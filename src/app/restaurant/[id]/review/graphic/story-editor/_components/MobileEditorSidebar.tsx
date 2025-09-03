'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TABS } from '@/constants/storyEditor';
import { TEMPLATES } from '@/constants/template';
import type { Template } from '@/types/template';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import StickerElement from './StickerElement';
import TagElement from './TagElement';
import TextElement from './TextElement';

interface MobileEditorSidebarProps {
  onTemplateSelect: (template: Template) => void;
  addNewElement: (option: any) => void;
}

export default function MobileEditorSidebar({
  onTemplateSelect,
  addNewElement,
}: MobileEditorSidebarProps) {
  const [mode, setMode] = useState<'collapsed' | 'half' | 'full'>('collapsed');
  const [dragPx, setDragPx] = useState(0);

  const startY = useRef(0);
  const dragging = useRef(false);

  // 뷰포트 높이 추적(주소창 변화 대응)
  const [vh, setVh] = useState<number>(800); // 기본값 설정
  useEffect(() => {
    const onResize = () => {
      setVh(window.innerHeight);
      setDragPx(0);
    };
    // 초기 높이 설정
    setVh(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const EDITOR_HEADER_H = 60; // EditorHeader 높이
  const COLLAPSED_H = 60; // 완전히 내린 상태 높이 (그립 + 여백)
  const BASE_H = Math.max(300, Math.round((vh - EDITOR_HEADER_H) * 0.45)); // half 높이 (헤더 제외한 영역의 45%)
  const FULL_H = vh - EDITOR_HEADER_H; // full일 때 EditorHeader 아래까지만 올라감
  const MAX_DELTA = Math.max(0, FULL_H - BASE_H);
  const THRESHOLD = Math.round((vh - EDITOR_HEADER_H) * 0.15); // 스냅 임계(헤더 제외한 영역의 15%)

  // === 드래그 공용 ===
  const startDragAt = (y: number) => {
    dragging.current = true;
    startY.current = y;
    setDragPx(0);
  };
  const moveDragTo = (y: number) => {
    if (!dragging.current) return;
    const dy = startY.current - y; // 위로 올리면 +, 아래로 내리면 -

    if (mode === 'collapsed') {
      // collapsed 모드에서는 위로만 드래그 가능
      setDragPx(dy > 0 ? Math.min(dy, BASE_H - COLLAPSED_H) : 0);
    } else if (mode === 'half') {
      // half 모드에서는 위아래 모두 드래그 가능
      const upDelta = Math.min(dy, MAX_DELTA);
      const downDelta = Math.max(dy, -(BASE_H - COLLAPSED_H));
      setDragPx(dy > 0 ? upDelta : downDelta);
    } else {
      // full 모드에서는 아래로만 드래그 가능
      setDragPx(dy < 0 ? Math.max(dy, -MAX_DELTA) : 0);
    }
  };
  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;

    if (mode === 'collapsed') {
      // collapsed 모드에서 위로 드래그하면 half 모드로
      if (dragPx >= THRESHOLD) setMode('half');
    } else if (mode === 'half') {
      // half 모드에서 위로 드래그하면 full 모드로, 아래로 드래그하면 collapsed 모드로
      if (dragPx >= THRESHOLD) setMode('full');
      else if (dragPx <= -THRESHOLD) setMode('collapsed');
    } else {
      // full 모드에서 아래로 드래그하면 half 모드로
      if (dragPx <= -THRESHOLD) setMode('half');
    }
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
  const heightPx =
    mode === 'collapsed'
      ? COLLAPSED_H + dragPx
      : mode === 'full'
        ? FULL_H + dragPx
        : BASE_H + dragPx;

  // 진행률 계산
  const prog = mode === 'full' ? 1 : mode === 'half' ? 0.5 : 0;

  // half 넘기 전/후 연출
  const reveal = mode === 'full' ? 1 : Math.max(0, (prog - 0.5) * 2); // 0→1 (0.5 지점부터)
  const handleOpacity = mode === 'collapsed' ? 1 : 1 - reveal; // collapsed에서는 그립 항상 보임

  // 스크림
  const scrimOpacity = mode === 'full' ? 1 : mode === 'half' ? 0.3 : 0; // collapsed에서는 스크림 없음

  const rounding = 'rounded-t-2xl border-t border-l border-r border-[#E2E2E4]';

  return (
    <>
      {/* 흰 스크림: 뒤 배경을 점점 덮음 */}
      <div
        className="fixed inset-0 z-[90] bg-white transition-opacity duration-200 lg:hidden"
        style={{
          opacity: scrimOpacity,
          pointerEvents: 'none', // 스크림은 클릭 방해하지 않음
        }}
      />

      {/* 바텀시트 본체 */}
      <div
        className={`fixed inset-x-0 z-[100] overscroll-none bg-white shadow-xl ${rounding} flex flex-col lg:hidden`}
        style={{
          height: `${heightPx}px`,
          bottom: mode === 'full' ? `${EDITOR_HEADER_H}px` : '0px',
          transition: dragging.current
            ? 'none'
            : 'height 180ms ease-out, bottom 180ms ease-out',
          willChange: dragging.current ? 'height, bottom' : undefined,
        }}
      >
        {/* 헤더 (full 모드에서만 표시) */}
        {mode === 'full' && (
          <div className="flex shrink-0 items-center justify-end border-b border-[#E2E2E4] px-4 py-3">
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
          </div>
        )}

        {/* 그립 */}
        <div
          className="relative z-10 flex shrink-0 cursor-grab touch-none select-none items-center justify-center pt-[16px] active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ opacity: mode === 'half' ? handleOpacity : 1 }}
        >
          <div className="h-1.5 w-[134px] rounded-full bg-[#D1D1D6]" />
        </div>

        {/* 콘텐츠 (collapsed 모드에서는 숨김) */}
        {mode !== 'collapsed' && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto">
              <Tabs defaultValue="template" className="h-full w-full">
                <TabsList className="flex border-none px-4 pt-4">
                  {TABS.map((t) => (
                    <TabsTrigger
                      key={t.value}
                      value={t.value}
                      className="w-1/3 rounded-none border-b border-b-[#C7C7CC] text-gray-400 data-[state=active]:border-[#FA4D09] data-[state=active]:shadow-none"
                    >
                      {t.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="template" className="mt-0">
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {TEMPLATES.map((tpl) => (
                      <Image
                        key={tpl.id}
                        src={tpl.thumbnail ?? tpl.background}
                        alt={tpl.name}
                        width={160}
                        height={220}
                        className="aspect-[3/4] h-auto w-full cursor-pointer rounded-lg object-cover shadow-md"
                        onClick={() => onTemplateSelect(tpl)}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="text" className="mt-0">
                  <div className="p-4">
                    <TextElement addNewElement={addNewElement} />
                    <TagElement addNewElement={addNewElement} />
                  </div>
                </TabsContent>

                <TabsContent value="sticker" className="mt-0">
                  <div className="p-4">
                    <StickerElement addNewElement={addNewElement} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
