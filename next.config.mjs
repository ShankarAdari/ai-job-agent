/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'export',        // Static HTML export for GitHub Pages
  trailingSlash: true,     // Required for GitHub Pages routing
  images: {
    unoptimized: true,     // Required for static export (no Next image server)
  },
};

export default nextConfig;
