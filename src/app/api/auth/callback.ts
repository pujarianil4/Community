import axios from "axios";

export default async (req: any, res: any) => {
  const { code } = req.query;
  console.log("user code", code);
  const data: any = {
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.REDIRECT_URI,
    scope: "identify email",
  };

  const response = await axios.post(
    "https://discord.com/api/oauth2/token",
    new URLSearchParams(data),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const { access_token } = response.data;
  const userResponse = await axios.get("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const user = userResponse.data;
  console.log("user Discord", user);
  // Store user details in session or database if needed
  res.status(200).json({ user });
};
