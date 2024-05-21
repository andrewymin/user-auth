import express from "express";
///////////// controller functions
import {
  loginUser,
  signupUser,
  logoutUser,
  checkCookie,
  userData,
  resetPasswordLink,
  resetPasswordPage,
  resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

///////////// login route
router.post("/login", loginUser);

///////////// signup route
router.post("/signup", signupUser);

///////////// logout route
router.get("/logout", logoutUser, (req, res) => {
  res.status(200).json({ isUser: false }); // sending success status after clearing cookies
});

///////////// logout route
router.get("/cookie", checkCookie);

///////////// Data route
router.get("/data", userData);

///////////// Reset Link route
router.post("/reset-password-link", resetPasswordLink);

///////////// Reset Page route
router.get("/reset-password-page", resetPasswordPage);

///////////// Reset Password
router.post("/reset-password", resetPassword);

// ///////////// google route
// router.get('/google', logoutUser)

// ///////////// github route
// router.get('/github', logoutUser)

export default router;
