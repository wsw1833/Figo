/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'green-elderly-sheep-310.mypinata.cloud',
        port: '', // Leave blank unless a specific port is used
        pathname: '/ipfs/**', // Match all paths under /ipfs/
      },
    ],
  },
};

export default nextConfig;
