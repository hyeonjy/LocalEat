/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'http', // API가 http로 주면 http로 적기
        hostname: 'k.kakaocdn.net',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
