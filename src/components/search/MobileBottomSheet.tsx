// components/search/MobileBottomSheet.tsx
'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
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
  const sp = useSearchParams();
  const hasCriteria = !!(sp.get('q')?.trim() || sp.get('keywords'));
  const isFilterOnly = !hasCriteria;

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

  // 필터만 상태일 때는 항상 half로 고정 + 드래그 무효
  useEffect(() => {
    if (isFilterOnly) {
      setMode('half');
      setDragPx(0);
      dragging.current = false;
    }
  }, [isFilterOnly]);

  const HEADER_H = 64;
  const BASE_H = Math.round(vh * 0.55); // half 높이
  const FULL_H = vh + HEADER_H; // full일 때 기존 헤더 높이만큼 더 올라감
  const MAX_DELTA = Math.max(0, FULL_H - BASE_H);
  const THRESHOLD = Math.round(vh * 0.15); // 스냅 임계(15vh)

  // === 드래그 공용 ===
  const startDragAt = (y: number) => {
    if (mode !== 'half' || isFilterOnly) return;
    dragging.current = true;
    startY.current = y;
    setDragPx(0);
  };
  const moveDragTo = (y: number) => {
    if (!dragging.current || mode !== 'half' || isFilterOnly) return;
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
  const headerOpacity = isFilterOnly ? 0 : mode === 'full' ? 1 : reveal;
  const scrimOpacity = isFilterOnly
    ? 0
    : mode === 'full'
      ? 1
      : Math.min(0.9, prog * 0.9);

  // 외형(라운딩/보더)
  const chromeClass = isFilterOnly
    ? 'rounded-t-2xl border border-[#E2E2E4]'
    : isRect
      ? ''
      : 'rounded-t-2xl border border-[#E2E2E4]';

  // 모바일만(기본), 데스크탑 테스트시 enableDesktop=true
  const visibilityClass = enableDesktop ? '' : 'lg:hidden';

  const headerHeight = Math.round(60 * headerOpacity);

  // 그립/스페이서 표시 여부
  const showHandle = !isFilterOnly && mode === 'half';

  return (
    <>
      {/* 스크림: 검색/필터가 있을 때만 */}
      <div
        className={`fixed inset-0 z-[999] bg-white transition-opacity duration-200 ${visibilityClass}`}
        style={{
          opacity: scrimOpacity,
          pointerEvents:
            !isFilterOnly && (mode === 'full' || prog > 0) ? 'auto' : 'none',
        }}
      />

      {/* 바텀시트 본체 */}
      <div
        data-testid="mobile-bottom-sheet"
        className={`fixed inset-x-0 bottom-0 z-[1000] overscroll-none bg-white ${chromeClass} ${visibilityClass} flex flex-col`}
        style={{
          height: isFilterOnly ? undefined : `${heightPx}px`,
          minHeight: isFilterOnly ? 96 : undefined,
          paddingTop: isFilterOnly ? 0 : mode === 'full' ? HEADER_H : 0,
          transition:
            isFilterOnly || dragging.current
              ? 'none'
              : 'height 180ms ease-out, padding-top 180ms ease-out',
          willChange: dragging.current ? 'height' : undefined,
        }}
      >
        {/* 헤더: 검색/필터 있을 때만 */}
        {!isFilterOnly && (
          <div
            className="relative flex shrink-0 select-none items-center overflow-hidden border-b border-[#E2E2E4]"
            style={{
              height: headerHeight,
              opacity: headerOpacity,
              pointerEvents:
                mode === 'full' || headerOpacity > 0.05 ? 'auto' : 'none',
            }}
          >
            <div
              className="absolute inset-x-0 top-0 transition-transform duration-200"
              style={{ transform: `translateY(${(1 - headerOpacity) * 16}px)` }}
            >
              <div className="flex h-[60px] items-center justify-between p-[16px]">
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
                <p className="min-w-0 flex-1 truncate text-[16px] font-semibold text-[#111]">
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
        )}

        {/* 그립: 검색/필터 있을 때는 인터랙티브, 없을 때는 동일한 회색 더미 */}
        {showHandle ? (
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
        ) : (
          // ✅ 필터만 상태: 동일한 높이/여백 + 같은 회색(#D1D1D6), 인터랙션 없음
          <div className="relative z-10 flex shrink-0 items-center justify-center pt-[16px]">
            <div className="h-1.5 w-[134px] rounded-full bg-[#D1D1D6]" />
          </div>
        )}

        {/* 콘텐츠 */}
        <div
          className={
            isFilterOnly ? 'flex flex-col' : 'flex min-h-0 flex-1 flex-col'
          }
        >
          <div
            className="shrink-0 px-[20px] py-[16px]"
            style={
              isFilterOnly
                ? { paddingBottom: 'max(env(safe-area-inset-bottom), 10px)' }
                : undefined
            }
          >
            <FilterBar
              className={`block ${enableDesktop ? '' : 'lg:hidden'}`}
              disableModal
            />
          </div>

          {hasCriteria && (
            <div
              className="min-h-0 flex-1 overflow-y-auto px-3"
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
          )}
        </div>
      </div>
    </>
  );
}
