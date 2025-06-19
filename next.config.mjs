/** @type {import('next').NextConfig} */
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
    ],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.(ttf|otf|woff|woff2|eot)$/,
      type: 'asset/resource',
    });
    return config;
  }
};
  

export default nextConfig;

  
