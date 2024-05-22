function getGoogleUrl(props) {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    // redirect_uri will send this to node server at endpoint /oauth/google
    redirect_uri: import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URL_VERCEL,
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
