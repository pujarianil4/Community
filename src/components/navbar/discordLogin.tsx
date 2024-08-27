// const clientId = process.env.AUTH_DISCORD_ID;
// console.log("discord ENv", clientId);
export async function handleDiscordLogin() {
  // Redirect to the Discord OAuth URL with your bot token
  const clientId = process.env.NEXT_PUBLIC_DISCORD_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URL;
  const oauthUrl =
    "https://discord.com/oauth2/authorize?client_id=1276499848002273300&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000&scope=identify";
  window.location.href = oauthUrl;
}

export async function fetchUserInfo(accessToken: string): Promise<any> {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return data;
}
