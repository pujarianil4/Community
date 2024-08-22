// import type { NextApiRequest, NextApiResponse } from "next";
// import crypto from "crypto";

// interface AuthData {
//   [key: string]: string;
// }

// const handler = (req: NextApiRequest, res: NextApiResponse) => {
//   const authData: AuthData = req.query as unknown as AuthData;

//   // Your bot token
//   const botToken = "";

//   // Create a secret from the bot token
//   const secret = crypto.createHash("sha256").update(botToken).digest();

//   // Sort and join the query parameters except the 'hash' parameter
//   const checkString = Object.keys(authData)
//     .filter((key) => key !== "hash")
//     .map((key) => `${key}=${authData[key]}`)
//     .sort()
//     .join("\n");

//   // Generate the hash from the checkString
//   const hash = crypto
//     .createHmac("sha256", secret)
//     .update(checkString)
//     .digest("hex");

//   // Compare the generated hash with the one sent by Telegram
//   if (hash === authData.hash) {
//     // Authentication successful
//     // Process the user data here, e.g., create a session, or generate a JWT
//     res
//       .status(200)
//       .json({ message: "Authentication successful!", user: authData });
//   } else {
//     res.status(401).json({ message: "Authentication failed." });
//   }
// };

// export default handler;
