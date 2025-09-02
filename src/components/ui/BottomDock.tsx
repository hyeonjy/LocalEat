'use client';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

type BottomDockProps = {
  /** 열린 정도 스냅 포인트(%) 예: [14, 60, 92] */
  snapPoints?: number[];
  /** 초기 열린 정도(%) */
  initialSnap?: number;
  /** 헤더(칩 버튼 묶음) */
  header: React.ReactNode;
  /** 본문(필터/결과 리스트 등) */
  children: React.ReactNode;
};

export default function BottomDock({
  snapPoints = [14, 60, 92],
  initialSnap = 14,
  header,
  children,
}: BottomDockProps) {
  const [translatePct, setTranslatePct] = useState(100 - initialSnap); // 0 = 완전 오픈
  const startY = useRef(0);
  const startTranslate = useRef(0);
  const dragging = useRef(false);

  // 바텀시트가 이 정도 이상 열리면 지도 인터랙션을 차단
  const SHIELD_THRESHOLD = 20;

  useEffect(() => {
    setTranslatePct(100 - initialSnap);
  }, [initialSnap]);

  const onDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    startY.current = e.clientY;
    startTranslate.current = translatePct;
    dragging.current = true;
    e.preventDefault();
    e.stopPropagation();
  };

  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dy = e.clientY - startY.current;
    const vh = window.innerHeight;
    const dyPct = (dy / vh) * 100;
    const next = Math.min(100, Math.max(0, startTranslate.current + dyPct));
    setTranslatePct(next);
    e.preventDefault();
    e.stopPropagation();
  };

  const onUp = () => {
    if (!dragging.current) return;
    const openPct = 100 - translatePct;
    const nearest = snapPoints.reduce((a, b) =>
      Math.abs(b - openPct) < Math.abs(a - openPct) ? b : a,
    );
    setTranslatePct(100 - nearest);
    dragging.current = false;
  };

  const openPct = 100 - translatePct;
  const shouldShield = openPct >= SHIELD_THRESHOLD || dragging.current;

  return (
    <>
      {/* 지도 이벤트 차단막 (도크가 열리면 지도 터치/스크롤 막기) */}
      {shouldShield && (
        <div
          className="fixed inset-0 z-[190]"
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onWheel={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
      )}

      {/* 바텀 도크 */}
      <div
        role="dialog"
        aria-modal="false"
        className={clsx(
          'fixed bottom-0 left-1/2 z-[200] w-full max-w-[1024px] -translate-x-1/2 transition-transform',
        )}
        style={{ transform: `translate(-50%, ${translatePct}vh)` }}
        onPointerMove={onMove}
        onPointerUp={onUp}
      >
        {/* 헤더(칩 버튼 묶음 + 핸들) */}
        <div
          onPointerDown={onDown}
          className="flex cursor-grab flex-col items-center justify-center gap-[16px] rounded-t-[16px] bg-white px-[16px] pb-[16px] pt-[10px] shadow-[0_-8px_24px_rgba(0,0,0,0.12)]"
          style={{ height: 81 }}
        >
          <div className="h-1.5 w-12 rounded-full bg-[#D9D9DE]" />
          <div className="flex w-full flex-col items-center justify-center gap-[16px]">
            {header}
          </div>
        </div>

        {/* 본문(스크롤 가능) */}
        <div className="max-h-[70vh] overflow-y-auto rounded-b-[16px] bg-white px-[16px] pb-[16px] pt-[16px]">
          {children}
        </div>
      </div>
    </>
  );
}
