import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { getGoogleUser, getNewAccessToken } from "./googleFunctions.js";

///////////// Verify Middleware for protected routes

const verifyUserToken = async (req, res, next) => {
  const token = await req.cookies.token; // using cookie-parser package to get cookie easier by name
  const access_token = await req.cookies.access_token; // check if access_token exists and save if it does, can be from github/google
  const refresh_token = await req.cookies.refresh_token; // check if refresh_token exists and save if it does

  // console.log("this is the cookie token: ", token); // testing token
  // console.log(access_token);

  // if neither of these exists them user hasn't created an account thus not verified
  if (!token && !access_token && !refresh_token)
    return res.status(401).json("Unauthorized"); // this doesn't allow the refresh token to work!

  // logged in through google and refresh_token exists to relogin without access_token
  if (refresh_token && !access_token) {
    // const googleUser = await getGoogleUser({ access_token });
    // console.log({ email: googleUser.email });
    // console.log("am I getting to this?");
    jwt.verify(
      refresh_token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) return res.status(401);
        const newAccessToken = await getNewAccessToken(decodedToken._id, res);
        const googleUser = await getGoogleUser(newAccessToken);
        if (googleUser) req.user = googleUser.email;
        else return res.status(401);
        // Token is valid; proceed to the next middleware/route handler
        next();
      }
    );
    // console.log(refresh_token, "this should print/log");
    // req.user = "testing";
    // next();
  }

  // console.log("This shouldn't print if there's no cooike");
  //   req.token = token;
  //   next();

  // token from previous login exists thus relog user without making them submit login info again
  if (token) {
    jwt.verify(
      // verifing token with secret decode from jwt library
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        //   req.user_id = decodedToken._id;
        if (err) return res.status(401);
        const user = await User.findById(decodedToken._id);
        // setting req.user to email of user for rest of function of connected route
        if (user) req.user = user.email;
        else return res.status(401);

        next(); // continue to rest of function of connected route
      }
    );
  }

  if (access_token) {
    // const googleUser = await getGoogleUser({ access_token });
    // console.log({ email: googleUser.email });
    jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) return res.status(401);
        const googleUser = await getGoogleUser(decodedToken._id);
        // console.log(googleUser); // check why it logs 4 times
        if (googleUser) req.user = googleUser.email;
        else return res.status(401);
        // Token is valid; proceed to the next middleware/route handler
        next();
      }
    );
  }
};

const verifyGoogleLink = async (req, res, next) => {
  // need id not access token, since user should already be in db
  const id_token = req.query.googleId;
  const ac_token = req.query.googleToken;

  if (!id_token && !ac_token) res.status(400).json("No google Id's provided");

  if (id_token) {
    // const googleUser = await getGoogleUser({ access_token });
    // console.log({ email: googleUser.email });
    jwt.verify(
      ac_token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) return res.status(401);
        const googleUser = await getGoogleUser(decodedToken._id);
        // console.log(googleUser); // check why it logs 4 times
        if (googleUser) {
          // req.user = googleUser.email;
          const filter = { email: googleUser.email };
          const update = { googleId: id_token };
          // update user
          await User.findOneAndUpdate(filter, update);
          const user = await User.findOne(filter);
          req.user = user.email;
        } else return res.status(401);
        // Token is valid; proceed to the next middleware/route handler
        next();
      }
    );
  }
};

export { verifyUserToken, verifyGoogleLink };
