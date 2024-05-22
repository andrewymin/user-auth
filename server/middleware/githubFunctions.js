import axios from "axios";
import qs from "qs";
import { createCookie } from "../hooks/jwtCookie.js";

// this is the callback for github oauth
const getGithubOAuthTokens = async ({ code }) => {
  const url = "https://github.com/login/oauth/access_token";
  const values = {
    code,
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    // redirect for localhost
    redirect_uri: process.env.GITHUB_OAUTH_REDIRECT_URI,
    // redirect for localvercel
    // redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI_VERCEL,
  };
  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        Accept: "application/json",
      },
    });
    // console.log(res.data);
    return res.data;
  } catch (error) {
    console.error(error, "Failed to fetch Github Oauth Tokens");
  }
};

// Using callback token that was generated to get user data
const getGithubUser = async (access_token) => {
  try {
    // get most of user data
    const user = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    // get user email that may not appear in user data sometimes
    const Emailres = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const emails = Emailres.data;
    const primaryEmailObj = emails.find((emailObj) => emailObj.primary);
    const userEmail = primaryEmailObj ? primaryEmailObj.email : null;

    // compiling email and data to one constant to send back
    const userData = { data: user.data, email: userEmail };
    return userData;
  } catch (error) {
    console.error(error.response.data, "Error fetching google user");
  }
};

// const getNewAccessToken = async (refresh_token, res) => {
//   const url = "https://oauth2.googleapis.com/token";
//   const values = {
//     refresh_token: refresh_token,
//     client_id: process.env.GOOGLE_CLIENT_ID,
//     client_secret: process.env.GOOGLE_CLIENT_SECRET,
//     grant_type: "refresh_token",
//   };
//   try {
//     const response = await axios.post(url, qs.stringify(values));
//     // console.log(res.data);
//     const newAccessToken = response.data.access_token;

//     createCookie(newAccessToken, "access_token", res);

//     // console.log(newAccessToken);
//     return newAccessToken;
//   } catch (error) {
//     console.error(error, "Failed to make new access token from refresh token.");
//   }
// };

export { getGithubOAuthTokens, getGithubUser };
