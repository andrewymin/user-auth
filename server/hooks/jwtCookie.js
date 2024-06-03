import jwt from "jsonwebtoken";

const MAX_AGE = 3 * 60 * 1000; // time in ms, 3min

const createToken = (_id) => {
  // return jwt.sign({_id}, process.env.SECRET, { expiresIn: '1h' })
  // return jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, {
  //   expiresIn: "1h",
  // });
  return jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET);
};

const prodCookieSettings = {
  httpOnly: true,
  /////////// comment out sameSite and secure for localhost
  // 6/03 changing this to "strict" from "none" to test
  sameSite: "Strict", // makes it possible to do cross-site calls for creation and req.cookies
  secure: true, // Need this for sameSite: "none" to work, will return 'true'
  maxAge: MAX_AGE,
};

const localCookieSettings = {
  httpOnly: true,
  maxAge: MAX_AGE,
};

const cookieOptions =
  process.env.NODE_ENV === "production"
    ? prodCookieSettings
    : localCookieSettings;

const prodDeleteCookieSettings = {
  httpOnly: true,
  /////////// comment out sameSite and secure for localhost
  // 6/03 changing this to "strict" from "none" to test
  sameSite: "Strict", // makes it possible to do cross-site calls for creation and req.cookies
  secure: true, // Need this for sameSite: "none" to work
  path: "/",
};

const localDeleteCookieSettings = {
  httpOnly: true,
  path: "/",
};

const deleteCookieOptions =
  process.env.NODE_ENV === "production"
    ? prodDeleteCookieSettings
    : localDeleteCookieSettings;

const createCookie = (_id, name, res) => {
  // if (token) console.log("made token?"); // this is for testing
  const token = createToken(_id);
  return res.cookie(name, token, cookieOptions);
};

const deleteCookie = (name, res) => {
  return res.clearCookie(name, deleteCookieOptions);
};

export { createCookie, deleteCookie };
