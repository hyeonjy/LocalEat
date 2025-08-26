import { BASE_H, BASE_W } from '@/constants/storyEditor';
import { useEffect, useState } from 'react';

export const useResponsiveCanvas = () => {
  const [{ w, h }, setSize] = useState({ w: BASE_W, h: BASE_H });
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [prevScale, setPrevScale] = useState({ x: 1, y: 1 });

  useEffect(() => {
    const onResize = () => {
      const isMobile = window.innerWidth < 1025; // lg 브레이크포인트

      if (isMobile) {
        // 모바일: 고정 크기 사용하여 요소 위치 일정하게 유지
        const newW = BASE_W;
        const newH = BASE_H;
        const newScale = { x: 1, y: 1 };

        setSize({ w: newW, h: newH });
        setScale(newScale);
      } else {
        // 데스크톱: 반응형 크기 사용
        const maxH = window.innerHeight - 100;
        const newH = Math.min(BASE_H, maxH);
        const newW = (newH * BASE_W) / BASE_H;
        const newScale = { x: newW / BASE_W, y: newH / BASE_H };

        setSize({ w: newW, h: newH });
        setScale(newScale);
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return { canvasW: w, canvasH: h, scale };
};
