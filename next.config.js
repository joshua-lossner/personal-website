/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    S3_BASE_URL: process.env.S3_BASE_URL,
  },
  publicRuntimeConfig: {
    S3_BASE_URL_ALBUMS: process.env.NEXT_PUBLIC_S3_BASE_URL_ALBUMS,
  },
  // Remove the experimental.middleware option
};

export default nextConfig;