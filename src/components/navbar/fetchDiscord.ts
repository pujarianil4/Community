import axios from "axios";

export default async function fetchDiscordData(code: string) {
  try {
    console.log("fetch code works");
    if (!code) {
      throw new Error("Authorization code is missing");
    }
    const secretCode = process.env.NEXT_PUBLIC_DISCORD_ID;
    const params = new URLSearchParams({
      client_id: "1276499848002273300",
      client_secret: "iLrGpAhtxQKIueZ6PnnG77KI8vv1rUpd",
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "http://localhost:3000",
    });

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    console.log("params", params);
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      params,
      { headers }
    );
    console.log("tokenResponse", tokenResponse);
    const { access_token } = tokenResponse.data;

    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const user = userResponse.data;
    return user;
  } catch (error) {
    console.error("Error during Discord OAuth callback:", error);
    throw error;
  }
}
