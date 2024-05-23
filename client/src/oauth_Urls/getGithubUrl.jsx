function getGithubUrl(props) {
  const rootUrl = "https://github.com/login/oauth/authorize";

  const REDIRECT_URI =
    process.env.NODE_ENV === "production"
      ? import.meta.env.VITE_GITHUB_OAUTH_REDIRECT_URL_VERCEL
      : import.meta.env.VITE_GITHUB_OAUTH_REDIRECT_URL;

  const options = {
    // redirect_uri will send this to node server at endpoint /oauth/github
    //  after verifing oauth credentials
    // redirect_uri: import.meta.env.VITE_GITHUB_OAUTH_REDIRECT_URL,
    // redirect_uri: import.meta.env.VITE_GITHUB_OAUTH_REDIRECT_URL_VERCEL,
    redirect_uri: REDIRECT_URI,
    client_id: import.meta.env.VITE_GITHUB_CLIENT_ID,
    scope: "user:email",
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;

  //   console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);
}
export { getGithubUrl };
