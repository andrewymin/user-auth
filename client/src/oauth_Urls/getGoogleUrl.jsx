function getGoogleUrl(props) {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const REDIRECT_URI =
    process.env.NODE_ENV === "production"
      ? import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URL_VERCEL
      : import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URL;

  const options = {
    // redirect_uri will send this to node server at endpoint /oauth/google
    // redirect_uri: import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URL,
    // redirect_uri: import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URL_VERCEL,
    redirect_uri: REDIRECT_URI,
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    response_type: "code",
    access_type: "offline", // Need this to get refresh token
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;

  //   console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);
}
export default getGoogleUrl;
