'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import FilterModal from './FilterModal';
import ReviewToggle from './ReviewToggle';

// Swiper
import 'swiper/css';
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type Props = {
  className?: string;
  disableModal?: boolean; // 모바일에서 내부 모달 끄기
  onFilterClick?: () => void; // 모바일에서 외부 시트 열기
};

export default function FilterBar({
  className,
  disableModal,
  onFilterClick,
}: Props) {
  const sp = useSearchParams();

  // URL의 keywords 길이(모달 선택 개수)만 카운트용으로 사용
  const modalSelectedCount = useMemo(() => {
    try {
      const raw = sp.get('keywords');
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return 0;
      const onlyStr = parsed.filter(
        (v: unknown): v is string => typeof v === 'string',
      );
      const deduped = onlyStr.filter((v, i) => onlyStr.indexOf(v) === i);
      return deduped.length;
    } catch {
      return 0;
    }
  }, [sp]);

  // 🔸 바깥(기본) 카테고리 토글 — '영업중' 기본 ON
  const [openNow, setOpenNow] = useState(true);
  const [breaktime, setBreaktime] = useState(false);
  const [closed, setClosed] = useState(false);
  const [allDay, setAllDay] = useState(false);

  // 총 선택 개수 = 바깥 토글들 + 모달 선택
  const selectedCount =
    modalSelectedCount +
    (openNow ? 1 : 0) +
    (breaktime ? 1 : 0) +
    (closed ? 1 : 0) +
    (allDay ? 1 : 0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const chipCls = (active: boolean) =>
    [
      'flex h-[30px] items-center justify-center gap-[4px] rounded-[20px] px-[12px] py-[8px] text-[14px] whitespace-nowrap',
      active
        ? 'border border-[#FA4D09] bg-[#FEEDE6] text-[#FA4D09]'
        : 'border border-[#C7C7CC] bg-white text-[#2E2E32]',
    ].join(' ');

  // ===== 드래그 가드: 드래그 시 click 막기 =====
  const drag = useRef({ x: 0, y: 0, dragged: false });
  const DRAG_THRESHOLD = 6; // 픽셀

  const dragGuardHandlers = {
    onPointerDownCapture: (e: React.PointerEvent) => {
      drag.current = { x: e.clientX, y: e.clientY, dragged: false };
    },
    onPointerMoveCapture: (e: React.PointerEvent) => {
      const dx = Math.abs(e.clientX - drag.current.x);
      const dy = Math.abs(e.clientY - drag.current.y);
      if (dx > DRAG_THRESHOLD && dx > dy) drag.current.dragged = true;
    },
    onPointerUpCapture: () => {
      // 스와이프 종료 직후 click 캡처 방지 위해 한 틱 뒤에 해제
      setTimeout(() => (drag.current.dragged = false), 0);
    },
    onClickCapture: (e: React.SyntheticEvent) => {
      if (drag.current.dragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    // iOS/Safari 대비 touch도 케어
    onTouchStartCapture: (e: React.TouchEvent) => {
      const t = e.touches[0];
      drag.current = { x: t.clientX, y: t.clientY, dragged: false };
    },
    onTouchMoveCapture: (e: React.TouchEvent) => {
      const t = e.touches[0];
      const dx = Math.abs(t.clientX - drag.current.x);
      const dy = Math.abs(t.clientY - drag.current.y);
      if (dx > DRAG_THRESHOLD && dx > dy) drag.current.dragged = true;
    },
    onTouchEndCapture: () => {
      setTimeout(() => (drag.current.dragged = false), 0);
    },
  };

  return (
    <div className={`flex flex-col gap-[20px] self-stretch ${className || ''}`}>
      {/* 상단: 필터 버튼 + 기본 카테고리 칩들(바깥에서 on/off) */}
      <div className="relative flex items-center gap-[8px] text-[14px]">
        {/* 필터 버튼 (숫자는 선택 총합) */}
        <button
          type="button"
          onClick={() => {
            if (disableModal) onFilterClick?.();
            else setIsModalOpen(true);
          }}
          className="flex h-[30px] flex-none cursor-pointer items-center justify-center gap-[4px] rounded-[20px] border border-[#FA4D09] bg-[#FEEDE6] px-[12px] py-[8px] text-[#FA4D09]"
        >
          <Image
            src="/assets/icons/tune.svg"
            alt="필터"
            width={20}
            height={20}
          />
          {selectedCount > 0 ? (
            <span className="text-[12px] font-semibold">{selectedCount}</span>
          ) : null}
        </button>

        {/* 기본 카테고리 칩들: 좁은 화면(≈380px)에서 좌우 드래그 */}
        <div className="min-w-0 flex-1">
          <div className="w-fit max-w-full overflow-hidden">
            <Swiper
              modules={[FreeMode]}
              freeMode
              spaceBetween={8}
              slidesPerView="auto"
              preventClicks
              preventClicksPropagation
              threshold={4}
              // iOS 사파리에서 버튼 안 드래그 막힘 방지
              style={{ touchAction: 'pan-x' }}
              className="!overflow-visible"
            >
              <SwiperSlide style={{ width: 'auto' }}>
                <button
                  type="button"
                  className={chipCls(openNow)}
                  onClick={() => setOpenNow((v) => !v)}
                  {...dragGuardHandlers}
                >
                  영업중
                </button>
              </SwiperSlide>
              <SwiperSlide style={{ width: 'auto' }}>
                <button
                  type="button"
                  className={chipCls(breaktime)}
                  onClick={() => setBreaktime((v) => !v)}
                  {...dragGuardHandlers}
                >
                  브레이크타임
                </button>
              </SwiperSlide>
              <SwiperSlide style={{ width: 'auto' }}>
                <button
                  type="button"
                  className={chipCls(closed)}
                  onClick={() => setClosed((v) => !v)}
                  {...dragGuardHandlers}
                >
                  휴무
                </button>
              </SwiperSlide>
              <SwiperSlide style={{ width: 'auto' }}>
                <button
                  type="button"
                  className={chipCls(allDay)}
                  onClick={() => setAllDay((v) => !v)}
                  {...dragGuardHandlers}
                >
                  24시
                </button>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>

        {/* PC 흐름에서만 내부 모달 오픈 (버튼 바로 아래 8px) */}
        {!disableModal && isModalOpen && (
          <div className="relative">
            <div className="absolute left-0 top-[calc(100%+8px)]">
              <FilterModal onClose={() => setIsModalOpen(false)} />
            </div>
          </div>
        )}
      </div>

      {/* 사진 리뷰 토글 (PC 전용) */}
      <div className="hidden items-center gap-[5px] lg:flex">
        <ReviewToggle on={false} onToggle={() => {}} />
        <span className="font-pretendard text-[16px] font-normal leading-[130%] text-[#000]">
          사진 리뷰만 보기
        </span>
      </div>
    </div>
  );
}
