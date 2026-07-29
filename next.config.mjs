/** @type {import('next').NextConfig} */

function getUploadHostname() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';

  try {
    return new URL(apiUrl).hostname;
  } catch {
    return '127.0.0.1';
  }
}

const uploadHostname = getUploadHostname();

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**',
      },
      {
        protocol: 'https',
        hostname: 'asset.brandfetch.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: uploadHostname,
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.(ttf|otf|woff|woff2|eot)$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;
