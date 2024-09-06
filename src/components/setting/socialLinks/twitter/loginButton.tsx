export async function handleTwitterLogin() {
  const rootUrl = "https://twitter.com/i/oauth2/authorize";

  const clientId = process.env.NEXT_PUBLIC_TWITTER_ID as string;
  const redirectUri = process.env.NEXT_PUBLIC_X_REDIRECT_URL as string;
  const state = "state";
  const codeChallenge = process.env.NEXT_PUBLIC_X_CODEVERIFIER as string;

  const options = {
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: "plain",
    scope: ["tweet.read", "users.read", "offline.access"].join(" "),
  };

  const qs = new URLSearchParams(options).toString();
  const authUrl = `${rootUrl}?${qs}`;
  window.location.href = authUrl;
}
