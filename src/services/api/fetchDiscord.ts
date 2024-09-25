import axios from "axios";
import { getCurrentDomain } from "@/utils/helpers";
export default async function fetchDiscordData(code: string) {
  try {
    console.log("fetch code works");
    if (!code) {
      throw new Error("Authorization code is missing");
    }

    const currentDomain = getCurrentDomain();
    const redirectUri = `${currentDomain}/api/callback/discord`;
    const secretCode = process.env.NEXT_PUBLIC_DISCORD_ID;
    const clientSecret = process.env.NEXT_PUBLIC_DISCORD_SECRET;
    if (!secretCode || !clientSecret || !redirectUri) {
      throw new Error("Discord client ID or secret is missing");
    }

    const params = new URLSearchParams({
      client_id: secretCode,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
    });

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      params,
      { headers }
    );
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
