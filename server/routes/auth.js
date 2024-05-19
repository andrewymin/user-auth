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

const router = express.Router();
// const CLIENT_URL = "http://localhost:5173";
// const REDIRECT_URL = "http://localhost:5173/google/callback";

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

///////////// Oauth Manual way for aws later

router.get("/oauth/google", async (req, res) => {
  // get the code from qs on the F.E. side
  const code = req.query.code;

  // get the id and access token from code
  const { id_token, access_token, refresh_token } = await getGoogleOAuthTokens({
    code,
  });

  // get google user data from google
  const googleUser = await getGoogleUser(access_token);
  // Check if google user already created a regular user
  const user = await User.googleLink(googleUser, id_token);
  //TODO: 5/16 change this to show error that there was no google user
  if (!user) {
    // res.redirect(`http://localhost:5173/account-link/${id_token}/${ac_token}`); // this means there was a user but no google id link
    res.redirect(`http://localhost:5173/account-link/test/${ac_token}`);
    return;
  }

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
  res.redirect("https://user-auth-frontend-teal.vercel.app/secret");
});

// router.get("/google/callback", async (req, res) => {
//   const { code } = req.query;

//   try {
//     const { data } = await axios.post("https://oauth2.googleapis.com/token", {
//       code,
//       client_id: GOOGLE_CLIENT_ID,
//       client_secret: GOOGLE_CLIENT_SECRET,
//       redirect_uri: REDIRECT_URL,
//       grant_type: "authorization_code",
//     });

//     // Process the token (e.g., store it, generate JWT, etc.)
//     const accessToken = data.access_token;
//     // Handle the access token as needed
//     res.cookie("token", token, { httpOnly: true, maxAge: 60000 });
//     res.status(200).send("Successfully authenticated with Google");
//   } catch (error) {
//     res.status(500).send("Failed to authenticate with Google");
//   }
// });

///////////// Protected Routes

// router.get("/link-accounts", verifyGoogleLink, async (req, res) => {
//   // console.log(req.user); // req is from middleware req
//   res.status(200).json({ userData: { email: req.user } });
// });

router.get("/protected-route", verifyUserToken, (req, res) => {
  // console.log(req.user); // req is from middleware req
  res.status(200).json({ userData: { email: req.user } });
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
