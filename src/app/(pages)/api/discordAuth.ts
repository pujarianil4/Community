import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function discordAuth(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Authorization code is missing" });
    }

    const secretCode = process.env.NEXT_PUBLIC_DISCORD_ID;
    const clientSecret = process.env.NEXT_PUBLIC_DISCORD_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URL;

    if (!secretCode || !clientSecret || !redirectUri) {
      return res.status(500).json({
        message: "Discord client ID, secret, or redirect URI is missing",
      });
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

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error during Discord OAuth callback:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}
