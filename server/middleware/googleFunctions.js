import axios from "axios";
import qs from "qs";
import { createCookie } from "../hooks/jwtCookie.js";
// import { createToken } from "../controllers/userController.js";

const REDIRECT_URI =
  process.env.NODE_ENV === "production"
    ? process.env.GOOGLE_OAUTH_REDIRECT_URI_VERCEL
    : process.env.GOOGLE_OAUTH_REDIRECT_URI;

// this is the callback for google oauth
const getGoogleOAuthTokens = async ({ code }) => {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    // redirect for vercel
    // redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI_VERCEL,
    // redirect for localhost
    // redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  };
  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    // console.log(res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch Google Oauth Tokens");
  }
};

const getGoogleUser = async (access_token) => {
  try {
    const res = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    // console.log(res.data);
    return res.data;
  } catch (error) {
    console.error(error.response.data, "Error fetching google user");
  }
};

const getNewAccessToken = async (refresh_token, res) => {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    refresh_token: refresh_token,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    grant_type: "refresh_token",
  };
  try {
    const response = await axios.post(url, qs.stringify(values));
    // console.log(res.data);
    const newAccessToken = response.data.access_token;

    createCookie(newAccessToken, "access_token", res);

    // console.log(newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error(error, "Failed to make new access token from refresh token.");
  }
};

export { getGoogleOAuthTokens, getGoogleUser, getNewAccessToken };
