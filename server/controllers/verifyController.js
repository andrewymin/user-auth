import { User, TempUser } from "../models/userModel.js";
import jwt from "jsonwebtoken";
// import { createCookie, deleteCookie } from "../hooks/jwtCookie.js";
import { createToken } from "../hooks/jwtCookie.js";
import {
  generateRandomSixDigitNumber,
  verifyEmail,
} from "../hooks/verifyCodeGen.js";

// const MAX_AGE = 180000;

///////////// login user

const verifyPage = async (req, res, next) => {
  ///// COOKIE AUTH
  // const verifyToken = await req.cookies.verifyToken; // id of user

  //// TOKEN AUTH LOCALSTORAGE
  const verifyToken = req.headers.authorization.split(" ")[1]; // only token from sign up
  if (!verifyToken) return res.status(401).json("Unauthorized no verify token");

  jwt.verify(
    verifyToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decodedToken) => {
      // error in token return 401
      if (err) return res.status(401);
      // use decoded id to find temp user before they completed verification
      const tempUser = await User.findById(decodedToken._id);
      // checks if tempUser is null which means user has git/google
      //  credentials already in in db thus need to use TempUser db
      //  instead of regular User model
      if (!tempUser) {
        const tempGitOrGoUser = await TempUser.findById(decodedToken._id);
        // error checking with if statement
        if (tempGitOrGoUser) req.tempUser = true;
        // if no tempUser despite verifyToken being present return false/401
        else return res.status(401);
        next();
        // stop code here with return
        return;
      }

      // console.log(tempUser);
      // use found user to send "true" to F.E. for ACCESS_V_PAGE to be true
      if (tempUser) req.tempUser = true;
      // if no tempUser despite verifyToken being present return false/401
      else return res.status(401);

      next();
    }
  );
};

const verifyCode = async (req, res) => {
  const userCode = await req.body.userCode; // user verification code
  // console.log("this is the user inputted code: ", userCode);
  //   console.log("user completed code is: ", userCode);

  ///// COOKIE AUTH
  // const verifyToken = await req.cookies.verifyToken; // id of user

  //// TOKEN AUTH LOCALSTORAGE
  const verifyToken = req.headers.authorization.split(" ")[1]; // only token from sign up
  if (!verifyToken) return res.status(401).json("Unauthorized no verify token");

  if (verifyToken) {
    jwt.verify(
      verifyToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) return res.status(401);

        // this is if user is trying to login using same email as their google/github login
        //   this check if the tempUser expired before they tried to signup
        const tempUser = await TempUser.findById(decodedToken._id);
        // console.log(tempUser);
        if (tempUser) {
          if (tempUser.verificationCode.vCode != userCode)
            return res
              .status(400)
              .json(
                "Incorrect code. Either request for another code or try again."
              );
          // tempUser still exists and checking if the codes match
          if (tempUser.googleUserId) {
            // this is updating original google user with temp data
            const user = await User.findByIdAndUpdate(tempUser.googleUserId, {
              password: tempUser.password,
              verified: true,
            });
            //////////////////////////////////// TODO on frontent delete verifyToken
            //// TOKEN AUTH LOCALSTORAGE
            const token = createToken(User._id);

            ///// COOKIE AUTH
            // createCookie(user._id, "token", res);
            // deleteCookie("verifyToken", res);
            // after updating google user info, delete tempuser

            tempUser.deleteOne();
            return res.status(200).json({
              msg: "Updated existing google user thus linked with sign in.",
              token: token, // from TOKEN AUTH, get rid of/comment out for COOKIE AUTH
            });
          } else {
            // this is updating original google user with temp data
            const user = await User.findByIdAndUpdate(tempUser.githubUserId, {
              password: tempUser.password,
              verified: true,
            });
            //////////////////////////////////// TODO on frontent delete verifyToken
            //// TOKEN AUTH LOCALSTORAGE
            const token = createToken(user._id);

            ///// COOKIE AUTH
            // createCookie(user._id, "token", res);
            // deleteCookie("verifyToken", res);
            // after updating google user info, delete tempuser

            tempUser.deleteOne();
            return res.status(200).json({
              msg: "Updated existing github user thus linked with sign in.",
              token: token, // from TOKEN AUTH, get rid of/comment out for COOKIE AUTH
            });
          }
        }

        const user = await User.findById(decodedToken._id);
        if (user.verificationCode.vCode != userCode) {
          return res
            .status(400)
            .json(
              "Incorrect code. Either request for another code or try again."
            );
        }
        // here vcode has to equal usercode, thus use 'set' to update
        else {
          user.set({
            verified: true,
            verificationCode: null, // this cancels user deletion by expire
          });
          // saving updates to retrieved user
          const updatedUser = await user.save();

          // create a cookie of updatedUser.id for authCheck and retrieval for user data for dashboard
          //////////////////////////////////// TODO On frontent delete verifyToken
          //// TOKEN AUTH LOCALSTORAGE
          const token = createToken(updatedUser._id);

          ///// COOKIE AUTH
          // createCookie(updatedUser._id, "token", res);
          // res.clearCookie("verifyToken");

          res.status(200).json({
            msg: "User verified and will not expire now.",
            token: token, // from TOKEN AUTH, get rid of/comment out for COOKIE AUTH
          });
        }
      }
    );
  }
};

const requestCode = async (req, res) => {
  const newExpireTime = new Date(Date.now() + 180 * 1000);
  const newCode = generateRandomSixDigitNumber();
  //// TOKEN AUTH LOCALSTORAGE
  const verifyToken = req.headers.authorization.split(" ")[1]; // only token from sign up

  ///// COOKIE AUTH
  // const verifyToken = req.cookies.verifyToken;

  // console.log(verifyToken);
  if (!verifyToken) return res.status(401).json("Unauthorized no vToken"); // this doesn't allow the refresh token to work!

  if (verifyToken) {
    jwt.verify(
      verifyToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err)
          return res
            .status(401)
            .json(
              "Unauthorized no verify token. Please go back and sign-up again."
            );
        const tempUser = await TempUser.findById(decodedToken._id);
        if (tempUser) {
          const user = await TempUser.findByIdAndUpdate(
            decodedToken._id,
            {
              verificationCode: { vCode: newCode, expireAt: newExpireTime },
            },
            { new: true }
          );

          // console.log(user);
          console.log("New code that was requested: ", newCode);
          return res
            .status(200)
            .json({ msg: "New Code created and updated in db." });
        }

        const user = await User.findByIdAndUpdate(
          decodedToken._id,
          {
            verificationCode: { vCode: newCode, expireAt: newExpireTime },
          },
          { new: true }
        );
        console.log(user);
        console.log(newCode);
        // verifyEmail(newCode);

        res.status(200).json({ msg: "New Code created and updated in db." });
      }
    );
  }
};

export { requestCode, verifyCode, verifyPage };
