import { BASE_H, BASE_W } from '@/constants/storyEditor';
import { useEffect, useState } from 'react';

export const useResponsiveCanvas = () => {
  const [{ w, h }, setSize] = useState({ w: BASE_W, h: BASE_H });
  const [scale, setScale] = useState({ x: 1, y: 1 });

  useEffect(() => {
    const onResize = () => {
      const maxH = window.innerHeight - 100;
      const newH = Math.min(BASE_H, maxH);
      const newW = (newH * BASE_W) / BASE_H;
      setSize({ w: newW, h: newH });
      setScale({ x: newW / BASE_W, y: newH / BASE_H });
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return { canvasW: w, canvasH: h, scale };
};
