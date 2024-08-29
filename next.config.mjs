/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "localhost",
      "127.0.0.1",
      "www.google.com",
      "cdn.vectorstock.com",
      "cdn-icons-png.flaticon.com",
      "i.imgur.com",
      "cdn-icons-png.freepik.com",
      "picsum.photos",
      "testcommunity.s3.ap-south-1.amazonaws.com",
      "testcommunity.s3.amazonaws.com",
    ],
    unoptimized: true,
  },
  env: {
    BASE_API_URL: process.env.BASE_API_URL,
    TG_BOT_NAME: "communitysetupbot",
  },
  // output: "export",
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
