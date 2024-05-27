import express from "express";
import {
  verifyUserToken,
  verifyGoogleLink,
} from "../middleware/authMiddleware.js";
import {
  getGoogleUser,
  getGoogleOAuthTokens,
} from "../middleware/googleFunctions.js";
// import { createToken } from "../controllers/userController.js";
import { createCookie } from "../hooks/jwtCookie.js";
import { User, ResetEmail } from "../models/userModel.js";
import {
  getGithubOAuthTokens,
  getGithubUser,
} from "../middleware/githubFunctions.js";

//////////// DONT FORGET TO CHANGE PRODUCTION SETTINGS IN COOKIE CREATION AND DELETION FUNCIONS

const router = express.Router();
const REDIRECT_URI =
  process.env.NODE_ENV === "production"
    ? "https://user-auth-frontend-teal.vercel.app/secret"
    : "http://localhost:5173/secret";

const CANCEL_URI =
  process.env.NODE_ENV === "production"
    ? "https://user-auth-frontend-teal.vercel.app/"
    : "http://localhost:5173";

/*
// /////////// Passport Google Auth Routes

// router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// // router.get('/google/callback', passport.authenticate('google', {
// //     successRedirect: CLIENT_URL,
// //     failureRedirect: '/login/failed',
// // }));

// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     res.redirect(CLIENT_URL);
//   }
// );

// router.get("/login/success", (req, res) => {
//   console.log(req.user);
//   if (req.profile) {
//     res.status(200).json({
//       success: true,
//       message: "Successful",
//       user: req.profile,
//     });
//   }
// });

// router.get("/login/failed", (req, res) => {
//   res.status(401).json({
//     success: false,
//     message: "Failure to login",
//   });
// });

// router.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect(CLIENT_URL);
// });
*/

///////////// Oauth google

router.get("/oauth/google", async (req, res) => {
  // get the code from qs on the F.E. side
  const code = req.query.code;

  try {
    // Use callback to get googleoauthtokens used to
    //   get the id and access token from code
    const { id_token, access_token, refresh_token } =
      await getGoogleOAuthTokens({
        code,
      });

    // get google user data from google
    const googleUser = await getGoogleUser(access_token);
    // console.log("this is google user: ", googleUser);
    // Check if google user already created a regular user
    const user = await User.accountLink(googleUser, id_token, "google");
    // console.log(user._id);

    // set cookies
    createCookie(user._id, "token", res);
    createCookie(access_token, "access_token", res);
    createCookie(refresh_token, "refresh_token", res);
    // res.cookie("access_token", ac_token, { httpOnly: true, maxAge: 60000 }); // 1 min for testing, ms time
    // res.cookie("refresh_token", rf_Token, { httpOnly: true, maxAge: 180000 }); // 3 min for testing, ms time

    //// redirect back to client
    // localhost redirect
    // res.redirect("http://localhost:5173/secret");
    // vercel redirect
    // res.redirect("https://user-auth-frontend-teal.vercel.app/secret");
    res.redirect(REDIRECT_URI);
  } catch (error) {
    console.error("User canceled google oauth: ", error);
    // User canceled the OAuth process
    res.redirect(CANCEL_URI);
    return;
  }
});

///////////// Oauth github

router.get("/oauth/github", async (req, res) => {
  // get the code from qs on the F.E. side
  const code = req.query.code;

  // Use callback to get github oauth tokens used to
  //   get access token from code since thats the only thing to get back
  const { access_token } = await getGithubOAuthTokens({
    code,
  });

  // get github user data from different github api calls
  const githubUser = await getGithubUser(access_token);
  // console.log(githubUser);

  // Check if github user already created a regular user or with other accounts
  const user = await User.accountLink(
    githubUser,
    githubUser.data.id.toString(),
    "github"
  );

  // set cookies
  createCookie(user._id, "token", res);

  //// redirect back to client
  // localhost redirect
  // res.redirect("http://localhost:5173/secret");
  // vercel redirect
  // res.redirect("https://user-auth-frontend-teal.vercel.app/secret");
  res.redirect(REDIRECT_URI);
});

///////////// Protected Routes

router.get("/protected-route", verifyUserToken, (req, res) => {
  // console.log(req.user); // req is from middleware req
  res.status(200).json({ authorized: true });
});

///////////// Reset Password Token Check

router.post("/check-reset-token", async (req, res) => {
  const token = req.query.resetToken;
  console.log(token);
  try {
    const resetUser = await ResetEmail.findOne({ token: token });
    if (!resetUser) return res.status(401).json({ msg: "token expired" });
    return res.status(200).json({ msg: "found user" });
  } catch (error) {
    console.log(error);
  }
});

export default router;
