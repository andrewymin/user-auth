import jwt from "jsonwebtoken";

const MAX_AGE = 3 * 60 * 1000;

const createToken = (_id) => {
  // return jwt.sign({_id}, process.env.SECRET, { expiresIn: '1h' })
  // return jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, {
  //   expiresIn: "1h",
  // });
  return jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET);
};

const createCookie = (_id, name, res) => {
  // if (token) console.log("made token?"); // this is for testing
  const token = createToken(_id);
  return res.cookie(name, token, {
    httpOnly: true,
    sameSite: "none", // makes it possible to do cross-site calls for creation and req.cookies
    secure: process.env.NODE_ENV === "production", // Need this for sameSite: "none" to work
    maxAge: MAX_AGE,
  });
};

export { createCookie };
