'use client';

import Script from 'next/script';

declare global {
  interface Window {
    Kakao?: any;
  }
}

export default function KakaoSDK() {
  const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      onLoad={() => {
        if (typeof window === 'undefined' || !window.Kakao) return;
        if (!window.Kakao.isInitialized?.() && key) window.Kakao.init(key);
      }}
    />
  );
}
