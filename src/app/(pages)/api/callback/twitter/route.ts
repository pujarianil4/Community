import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  const { code } = await req.json();

  try {
    const clientId = process.env.NEXT_PUBLIC_TWITTER_ID as string;
    const clientSecret = process.env.NEXT_PUBLIC_TWITTER_SECRET as string;
    const redirectUri = process.env.NEXT_PUBLIC_X_REDIRECT_URL as string;
    const codeVerifier = process.env.NEXT_PUBLIC_X_CODEVERIFIER as string;

    const plainTextBytes = new TextEncoder().encode(
      `${clientId}:${clientSecret}`
    );
    const base64EncodedCredentials = btoa(
      String.fromCharCode(...plainTextBytes)
    );

    const tokenResponse = await axios.post(
      "https://api.twitter.com/2/oauth2/token",
      new URLSearchParams({
        code,
        grant_type: "authorization_code",
        client_id: clientId,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${base64EncodedCredentials}`,
        },
      }
    );

    const { access_token } = tokenResponse.data;
    const userResponse = await axios.get("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const user = userResponse.data.data;
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error during Twitter OAuth callback:", error);

    return NextResponse.json(
      { error: "Failed to exchange token or fetch user data" },
      { status: 500 }
    );
  }
}
