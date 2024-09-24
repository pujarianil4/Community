import { NextResponse } from "next/server";
import axios from "axios";
import { getCurrentDomain } from "@/utils/helpers";
export async function POST(req: Request) {
  const { code } = await req.json();
  console.log("code", code);
  const currentDomain = getCurrentDomain();
  try {
    const clientId = process.env.NEXT_PUBLIC_TWITTER_ID as string;
    const clientSecret = process.env.NEXT_PUBLIC_TWITTER_SECRET as string;
    const redirectUri = `${currentDomain}/api/twitter`;
    // const redirectUri = " http://127.0.0.1:3000/api/twitter";
    console.log("redirect", redirectUri);
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
    console.log("user", access_token);
    const userResponse = await axios.get("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    console.log("user", userResponse.data.data);
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
