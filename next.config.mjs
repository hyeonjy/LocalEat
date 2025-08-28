// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ['res.cloudinary.com'],
//     remotePatterns: [
//       {
//         protocol: 'http', // API가 http로 주면 http로 적기
//         hostname: 'k.kakaocdn.net',
//         pathname: '/**',
//       },
//     ],
//   },
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // remotePatterns가 더 유연하므로 여기서 모두 허용
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'test-shhu.onrender.com',
        pathname: '/**',
      },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'k.kakaocdn.net', pathname: '/**' },
      // 개발용(로컬 백엔드에서 이미지 서빙할 때)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/**',
      },
      // 혹시 카카오 CDN이 http로 내려오는 케이스가 있으면 아래도 추가
      { protocol: 'http', hostname: 'k.kakaocdn.net', pathname: '/**' },
    ],

    // domains를 함께 써도 되지만, 위 remotePatterns로 충분합니다.
    // domains: ['test-shhu.onrender.com', 'res.cloudinary.com', 'k.kakaocdn.net'],
  },
};

export default nextConfig;
