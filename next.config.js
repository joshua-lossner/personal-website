/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    S3_BASE_URL: process.env.S3_BASE_URL,
  },
};

export default nextConfig;