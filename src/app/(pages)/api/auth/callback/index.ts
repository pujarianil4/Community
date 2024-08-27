import axios from "axios";
export default async function fetchDiscordData(code: string) {
  try {
    if (!code) {
      throw new Error("Authorization code is missing");
    }

    // const data = {
    //   client_id: "1276499848002273300",
    //   client_secret: "UvDt0C9D7gilIwgcogWV0XcEi15NGH7O",
    //   grant_type: "authorization_code",
    //   code: code,
    //   redirect_uri: "http://localhost:3000",
    //   scope: "identify email",
    // };

    // // Request access token from Discord
    // const tokenResponse = await axios.post(
    //   "https://discord.com/api/oauth2/token",
    //   new URLSearchParams(data).toString(),
    //   {
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //   }
    // );

    const params = new URLSearchParams({
      client_id: "1276499848002273300",
      client_secret: "UvDt0C9D7gilIwgcogWV0XcEi15NGH7O",
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "http://localhost:3000/api/auth/callback",
    });

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      // "Accept-Encoding": "application/x-www-form-urlencoded",
    };
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      params,
      {
        headers,
      }
    );

    const data = tokenResponse.data;
    console.log("data", data);

    // Fetch user details using access token
    // const userResponse = await axios.get("https://discord.com/api/users/@me", {
    //   headers: {
    //     Authorization: `Bearer ${access_token}`,
    //   },
    // });

    // const user = userResponse.data;
    // console.log("Discord User Data:", user);
    // return user;
  } catch (error) {
    console.error("Error during Discord OAuth callback:", error);
    throw error; // Rethrow the error to be caught by the caller
  }
}
