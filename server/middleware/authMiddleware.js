import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { getGoogleUser, getNewAccessToken } from "./googleFunctions.js";

///////////// Verify Middleware for protected routes

const verifyUserToken = async (req, res, next) => {
  const token = req.cookies.token;
  const access_token = req.cookies.access_token;
  const refresh_token = req.cookies.refresh_token;

  // console.log(token);
  // console.log(access_token);

  // console.log("this should be logged as long as middleware is working");
  // status 401 = unauthorized access
  //   if (!token) return res.status(401).json({ msg: "Not authorized. No Cookie" });

  if (!token && !access_token && !refresh_token)
    return res.status(401).json("Unauthorized"); // this doesn't allow the refresh token to work!

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

  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        //   req.user_id = decodedToken._id;
        if (err) return res.status(401);
        const user = await User.findById(decodedToken._id);

        if (user) req.user = user.email;
        else return res.status(401);

        next();
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
