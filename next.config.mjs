/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "localhost",
      "127.0.0.1",
      "www.google.com",
      "cdn.vectorstock.com",
      "cdn-icons-png.flaticon.com",
    ],
  },
  env: {
    BASE_API_URL: process.env.BASE_API_URL,
  },
};

export default nextConfig;
