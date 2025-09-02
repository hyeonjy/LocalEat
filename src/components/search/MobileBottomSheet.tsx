// components/search/MobileBottomSheet.tsx
'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import FilterBar from './FilterBar';
import SearchResultList from './SearchResultList';

type Props = {
  items: any[];
  status: 'pending' | 'success' | 'error';
  error?: unknown;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  initialKeyword: string;
  enableDesktop?: boolean; // 데스크탑 테스트용
};

export default function MobileBottomSheet({
  items,
  status,
  error,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  initialKeyword,
  enableDesktop = false,
}: Props) {
  const [mode, setMode] = useState<'half' | 'full'>('half');
  const [dragPx, setDragPx] = useState(0);

  const startY = useRef(0);
  const dragging = useRef(false);

  // 뷰포트 높이 추적(주소창 변화 대응)
  const [vh, setVh] = useState<number>(
    typeof window !== 'undefined' ? window.innerHeight : 0,
  );
  useEffect(() => {
    const onResize = () => {
      setVh(window.innerHeight);
      setDragPx(0);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const HEADER_H = 64;
  const BASE_H = Math.round(vh * 0.55); // half 높이
  const FULL_H = vh + HEADER_H; // full일 때 기존 헤더 높이만큼 더 올라감
  const MAX_DELTA = Math.max(0, FULL_H - BASE_H);
  const THRESHOLD = Math.round(vh * 0.15); // 스냅 임계(15vh)

  // === 드래그 공용 ===
  const startDragAt = (y: number) => {
    if (mode !== 'half') return;
    dragging.current = true;
    startY.current = y;
    setDragPx(0);
  };
  const moveDragTo = (y: number) => {
    if (!dragging.current || mode !== 'half') return;
    const dy = startY.current - y; // 위로 올리면 +
    setDragPx(dy > 0 ? Math.min(dy, MAX_DELTA) : 0);
  };
  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (dragPx >= THRESHOLD) setMode('full');
    setDragPx(0);
  };

  // pointer + touch
  const onPointerDown = (e: React.PointerEvent) => {
    startDragAt(e.clientY);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => moveDragTo(e.clientY);
  const onPointerUp = (e: React.PointerEvent) => {
    endDrag();
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };
  const onTouchStart = (e: React.TouchEvent) =>
    startDragAt(e.touches[0].clientY);
  const onTouchMove = (e: React.TouchEvent) => moveDragTo(e.touches[0].clientY);
  const onTouchEnd = () => endDrag();

  // === 렌더 파생 값 ===
  const heightPx = mode === 'full' ? FULL_H : BASE_H + dragPx;

  // 진행률(0~1): half → full
  const prog =
    mode === 'full' ? 1 : MAX_DELTA ? Math.min(1, dragPx / MAX_DELTA) : 0;

  // half 넘기 전/후 연출
  const reveal = mode === 'full' ? 1 : Math.max(0, (prog - 0.5) * 2); // 0→1 (0.5 지점부터)
  const handleOpacity = 1 - reveal; // 그립은 반대로 사라짐
  const isRect = mode === 'full' || prog >= 0.5; // 사각형 전환 시점

  // 헤더/스크림
  const headerOpacity = mode === 'full' ? 1 : reveal;
  const scrimOpacity = mode === 'full' ? 1 : Math.min(0.9, prog * 0.9);

  const rounding = isRect ? '' : 'rounded-t-2xl border border-[#E2E2E4]';
  const visibilityClass = enableDesktop ? '' : 'lg:hidden';

  // ✅ 헤더 높이를 0→60px로 동적 적용
  const headerHeight = Math.round(60 * headerOpacity);

  return (
    <>
      {/* 흰 스크림: 뒤 배경을 점점 덮음 (시트보다 아래, 지도보다 위) */}
      <div
        className={`fixed inset-0 z-[60] bg-white transition-opacity duration-200 ${visibilityClass}`}
        style={{
          opacity: scrimOpacity,
          pointerEvents: mode === 'full' || prog > 0 ? 'auto' : 'none',
        }}
      />

      {/* 바텀시트 본체: height로 위로 자라남, half→full 넘어가면 사각형 */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[70] overscroll-none bg-white shadow-xl ${rounding} ${visibilityClass} flex flex-col`}
        style={{
          height: `${heightPx}px`,
          paddingTop: mode === 'full' ? HEADER_H : 0, // full에서 기존 헤더 자리만큼 밀어줌
          transition: dragging.current
            ? 'none'
            : 'height 180ms ease-out, padding-top 180ms ease-out',
          willChange: dragging.current ? 'height' : undefined,
        }}
      >
        {/* ✅ 헤더: 처음엔 높이 0, 드래그 진행에 따라 60px까지 커짐 */}
        <div
          className="relative flex shrink-0 select-none items-center overflow-hidden border-b border-[#E2E2E4]"
          style={{
            height: headerHeight, // 0 → 60
            opacity: headerOpacity,
            pointerEvents:
              mode === 'full' || headerOpacity > 0.05 ? 'auto' : 'none',
          }}
        >
          <div
            className="absolute inset-x-0 top-0 transition-transform duration-200"
            style={{
              transform: `translateY(${(1 - headerOpacity) * 16}px)`, // 아래(+16px)에서 0으로
            }}
          >
            <div className="flex h-[60px] items-center justify-between">
              <button
                onClick={() => setMode('half')}
                className="p-2"
                aria-label="뒤로"
              >
                <Image
                  width={28}
                  height={28}
                  src="/assets/icons/arrow_left.svg"
                  alt="뒤로가기_버튼"
                />
              </button>
              <p className="min-w-0 flex-1 truncate text-center text-[16px] font-semibold text-[#111]">
                {initialKeyword || ''}
              </p>
              <button className="p-2" aria-label="메뉴">
                <span className="block h-[2px] w-5 bg-black" />
                <span className="mt-1 block h-[2px] w-5 bg-black" />
                <span className="mt-1 block h-[2px] w-5 bg-black" />
              </button>
            </div>
          </div>
        </div>

        {/* 그립: half에서만, 드래그 진행에 따라 투명해짐 */}
        {mode === 'half' && (
          <div
            className="relative z-10 flex shrink-0 cursor-grab touch-none select-none items-center justify-center pt-[16px] active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ opacity: handleOpacity }}
          >
            <div className="h-1.5 w-[134px] rounded-full bg-[#D1D1D6]" />
          </div>
        )}

        {/* ✅ 콘텐츠: flex로 정확히 남은 영역 100% 차지 (여백 X) */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="shrink-0 px-[20px] py-[16px]">
            <FilterBar />
          </div>

          <div
            className="min-h-0 flex-1 overflow-y-auto px-3"
            // iOS 홈 인디케이터 여백 없애려면 0 유지,
            // 안전영역 살리려면 아래 줄 사용:
            // style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            style={{ paddingBottom: '0px' }}
          >
            <SearchResultList
              items={items}
              status={status}
              error={error}
              hasNextPage={!!hasNextPage}
              isFetchingNextPage={!!isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
