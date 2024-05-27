import jwt from "jsonwebtoken";
import bycrpt from "bcrypt";
import { ResetEmail, User } from "../models/userModel.js";
import { createCookie, deleteCookie } from "../hooks/jwtCookie.js";
import { resetPasswordEmail } from "../hooks/verifyCodeGen.js";
import crypto from "crypto";

///////////// login user
const loginUser = async (req, res) => {
  const username = await req.body.userID;
  const password = await req.body.userPass;

  try {
    const user = await User.login(username, password); // this is credentials
    //create a token
    // const token = createToken(user._id);

    createCookie(user._id, "token", res);
    // res.cookie("token", token, { httpOnly: true, maxAge: 60000 });
    // res.status(200).json({ userData: { email: user.email } });
    res.status(200).json({ authorized: true });

    // res.json({ msg: "got the data", isAuth: user });
    // res.status(200).json({ token: token });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ errorMsg: error.message });
  }
};

///////////// signup user
const signupUser = async (req, res) => {
  const username = await req.body.userID;
  const password = await req.body.userPass;

  try {
    const user = await User.signup(username, password);
    if (!user) return res.status(200).json({ msg: "Couldn't create user." });
    //create a token
    // const verifyToken = createToken(user._id);
    // if (token) console.log("made token?"); // this is for testing
    // res.cookie("verifyToken", verifyToken, { httpOnly: true, maxAge: MAX_AGE });
    createCookie(user._id, "verifyToken", res);
    res.status(200).json({ msg: "Need to verify first." });
    // res.status(200).json({ msg: "added user", isAuth: user });
  } catch (error) {
    // console.log(error.message);
    res.status(400).json({ errorMsg: error.message });
  }
};

// const signupUser = async (req, res) => {
//   const username = await req.body.userID;
//   const password = await req.body.userPass;

//   try {
//     const user = await User.signup(username, password);
//     //create a token
//     const token = createToken(user._id);
//     if (token) console.log("made token?"); // this is for testing
//     res.cookie("token", token, { httpOnly: true, maxAge: 60000 });
//     res.status(200).json({ msg: "Added User" });
//     // res.status(200).json({ msg: "added user", isAuth: user });
//   } catch (error) {
//     // console.log(error.message);
//     res.status(400).json({ errorMsg: error.message });
//   }

//   // res.json({mssg: 'signup user'})
//   // res.json({email: email, password: password});
//   // console.log(`${email} ${password}`)
// };

///////////// logout user
const logoutUser = (req, res, next) => {
  // console.log("am I getting to this route");
  try {
    deleteCookie("token", res);
    deleteCookie("access_token", res);
    deleteCookie("refresh_token", res);
    // needed these three params for cookies to actual be deleted
    res.set("Cache-Control", "no-store");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    next(); // using middleware to ensure that the cookies clear before sending 200 status since it's been doing that in vercel
  } catch (error) {
    console.log(error);
    res.status(400).json({ errorMsg: error.message });
  }
};

///////////// Retrieve Profile Data
const userData = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    console.log("no token");
  } else {
    // TODO: use token to find user in USER model to return that user for data
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        //   req.user_id = decodedToken._id;
        if (err) return res.status(401);
        const user = await User.findById(decodedToken._id);
        let data = {
          email: user.email,
          googleLink: user.googleId ? "Linked" : "Not Linked",
          githubLinked: user.githubId ? "Linked" : "Not Linked",
        };

        if (user) return res.status(200).json({ userData: data });
        else return res.status(401);
      }
    );
  }
};

///////////// Reset Password Link
const resetPasswordLink = async (req, res) => {
  const username = await req.body.userID; // check if link was accessed from login page
  // console.log(username);
  const token = await req.cookies.token; // check if link was accessed from account security page
  if (username) {
    // sent from login page with email
    const user = await User.findOne({ email: username });
    if (!user) return res.status(404).json({ errorMsg: "User not found" });

    const token = crypto.randomBytes(20).toString("hex");

    await ResetEmail.create({
      email: user.email,
      token: token,
    });

    let emailRes = await resetPasswordEmail(user.email, token); // getting response from nodemailer if email was successful or not
    // console.log("if log, this is emailRes: ", emailRes.messageId);
    if (emailRes.messageId)
      // checking if email is acctually sent before sending response of 200, if not could get success but no email
      return res
        .status(200)
        .json({ successMsg: "Successfully sent link to email!" });
    return res.status(400).json({ errorMsg: "Error sending email" });
  }

  if (!token) {
    console.log("no token");
  } else {
    // sent from security page where already logged in
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        //   req.user_id = decodedToken._id;
        if (err)
          return res
            .status(401)
            .json({ errorMsg: "Error retrieving User Email" });
        const user = await User.findById(decodedToken._id);
        if (!user) return res.status(404).json({ errorMsg: "User not found" });

        const token = crypto.randomBytes(20).toString("hex");

        await ResetEmail.create({
          email: user.email,
          token: token,
        });

        let emailRes = await resetPasswordEmail(user.email, token);
        if (emailRes.messageId)
          // checking if email is acctually sent before sending response of 200, if not could get success but no email
          return res
            .status(200)
            .json({ successMsg: "Successfully sent link to email!" });
        return res.status(400).json({ errorMsg: "Error sending email" });
      }
    );
  }
};

///////////// Reset Password Page from email link
// this is reached from EMAIL sent from reset-pass-link NOT going to be on frontend
// Used to check if reset link as expired or not using resetemail modal
const resetPasswordPage = async (req, res) => {
  const token = req.query.resetToken;
  // console.log(token);
  try {
    const user = await ResetEmail.findOne({ token: token });
    if (!user) return res.status(404).json({ errorMsg: "User not found" });
    // redirect to frontend password change component if link is still good
    // res.redirect(`http://localhost:5173/password-reset/${token}`);
    res.redirect(
      `https://user-auth-frontend-teal.vercel.app/password-reset/${token}`
    );
  } catch (error) {
    console.log(error);
  }
};

///////////// Reset Password
const resetPassword = async (req, res) => {
  const token = await req.body.token;
  const password = await req.body.userPass;

  try {
    // using this to get email to update user info
    const resetUser = await ResetEmail.findOne({ token: token });
    if (resetUser) {
      const hash = await bycrpt.hash(password, 10);
      const user = await User.findOne({ email: resetUser.email });
      if (user.password == hash)
        return res.status(401).json({ msg: "Password already exists." });

      user.set({ password: hash });

      await user.save();
      resetUser.deleteOne();
      // TODO: DELETE resetEmail user
      return res.status(200).json({ msg: "updated password" });
    }
    return res
      .status(400)
      .json({ msg: "Link expired or not working. Please try again." });
  } catch (error) {
    console.log(error);
  }
};

///////////// Cookie TEST
const checkCookie = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    console.log("no token");
  } else {
    res.status(200).json({ msg: "token sent" });
    console.log(token);
  }
};

export {
  loginUser,
  signupUser,
  logoutUser,
  checkCookie,
  userData,
  resetPasswordLink,
  resetPasswordPage,
  resetPassword,
};
