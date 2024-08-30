export async function handleDiscordLogin() {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_ID ?? "default_client_id";
  const redirectUri = encodeURIComponent(
    process.env.NEXT_PUBLIC_REDIRECT_URL ?? "http://localhost:3000"
  );

  const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=identify`;

  window.location.href = oauthUrl;
}
