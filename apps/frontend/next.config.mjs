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
      {
        hostname: "www.exjstore.web.id",
      },
      {
        hostname: "images.ctfassets.net",
      },
      {
        hostname: "id.wikipedia.org",
      },
      {
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
