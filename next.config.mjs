/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Local product images live in /public, so no remote patterns are needed yet.
    // Add remote hosts here later if you serve images from a CDN.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
