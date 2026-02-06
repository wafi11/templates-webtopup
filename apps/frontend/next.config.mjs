/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
      },
      {
        hostname: "upload.wikimedia.org",
      },
      {
        hostname: "www.veinstore.id",
      },
    ],
  },
};

export default nextConfig;
