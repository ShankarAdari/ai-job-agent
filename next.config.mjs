/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'export',
  basePath: '/ai-job-agent',
  assetPrefix: '/ai-job-agent',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
