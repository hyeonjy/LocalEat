'use client';

import { getMissionRestaurants } from '@/app/actions/mission';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const MissionRestaurantSection: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['mission'],
    queryFn: () => getMissionRestaurants(),
  });

  const items = data?.data ?? [];

  // SSR/CSR 간격 떨림 방지용
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 준비 상태(초기 깜빡임 방지)
  const [ready, setReady] = useState(false);

  // 가장자리 상태 → 버튼 show/hide
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // 드래그 중 클릭 방지
  const swiperRef = useRef<SwiperType | null>(null);
  const draggingRef = useRef(false);

  const handleLinkClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (draggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section className="mt-[64px] bg-[#F7F7F8]">
      <div className="max-w={[1280]} mx-auto rounded-[12px] px-[20px] py-[32px] md:px-[40px]">
        <div className="mx-auto flex flex-col xl:w-[1200px] xl:flex-row xl:items-start xl:gap-[64px]">
          {/* 왼쪽 텍스트 */}
          <div className="w-full xl:w-[343px]">
            <p className="pt-[20px] text-[20px] font-semibold leading-[130%] text-[#FA4D09] md:pt-[30px] md:text-[24px]">
              리워드가 2배!
              <br />
              매주 찾아오는 지역 미션
            </p>
            <h2 className="mt-[12px] text-[40px] font-bold leading-[130%] tracking-[0.6px] text-[#171719] md:text-[60px]">
              이번 주 미션 「신림동」편
            </h2>
            <Link
              href="none"
              className="mt-[24px] flex h-[52px] w-full items-center justify-center gap-[8px] rounded-[12px] bg-[#FA4D09] px-[24px] py-[12px] text-center text-[18px] font-semibold leading-[150%] text-white sm:w-[166px] md:mt-[36px] md:h-[60px] md:px-[28px] md:text-[20px]"
            >
              자세히 보기
            </Link>
          </div>

          {/* 오른쪽: Swiper (xl에서 2장 보이도록 폭 고정) */}
          <div className="relative mt-6 w-full xl:mt-0 xl:w-[792px]">
            {/* 네비 버튼: DOM에는 항상 존재, ready 전/가장자리에서는 투명 처리 */}
            <button
              id="mission-prev"
              type="button"
              aria-label="이전"
              className={`absolute left-[-20px] top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-[1000px] border border-[#E2E2E4] bg-[#FFF] p-[8px] transition-opacity xl:flex ${!ready || atStart ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
            >
              <Image
                src="/assets/icons/arrow_left.svg"
                width={24}
                height={24}
                alt="이전"
              />
            </button>

            <button
              id="mission-next"
              type="button"
              aria-label="다음"
              className={`absolute right-[-20px] top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-[1000px] border border-[#E2E2E4] bg-[#FFF] p-[8px] transition-opacity xl:flex ${!ready || atEnd ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
            >
              <Image
                src="/assets/icons/arrow_right.svg"
                width={24}
                height={24}
                alt="다음"
              />
            </button>

            {/* ready 전에는 보이지 않게 → 버튼이 먼저 뜨는 깜빡임 방지 */}
            <div
              className={`${ready ? 'visible opacity-100' : 'invisible opacity-0'} transition-opacity`}
            >
              <Swiper
                modules={[Navigation]}
                navigation={{
                  enabled: true,
                  prevEl: '#mission-prev',
                  nextEl: '#mission-next',
                }}
                // ⚠ init/update 직접 호출 금지(타이밍 이슈 방지)
                onBeforeInit={(sw) => {
                  // 여분 가드(모바일/SSR 이슈에 대비)
                  if (
                    sw.params.navigation &&
                    typeof sw.params.navigation === 'object'
                  ) {
                    (sw.params.navigation as any).prevEl = '#mission-prev';
                    (sw.params.navigation as any).nextEl = '#mission-next';
                  }
                }}
                onSwiper={(sw) => {
                  swiperRef.current = sw;

                  // 드래그 감지(드래그 중 클릭 막기)
                  sw.on('sliderFirstMove', () => {
                    draggingRef.current = true;
                  });
                  sw.on('touchEnd', () => {
                    setTimeout(() => {
                      draggingRef.current = false;
                    }, 0);
                  });
                  sw.on('transitionEnd', () => {
                    draggingRef.current = false;
                  });

                  // 초기 상태 동기화(네비는 모듈이 자동으로 init됨)
                  setTimeout(() => {
                    // sw.navigation?.update?.();  // ← 호출하지 않음 (undefined 가능성)
                    setAtStart(sw.isBeginning);
                    setAtEnd(sw.isEnd);
                    setReady(true);
                  }, 0);
                }}
                onSlideChange={(sw) => {
                  setAtStart(sw.isBeginning);
                  setAtEnd(sw.isEnd);
                }}
                onResize={(sw) => {
                  sw.update();
                  setAtStart(sw.isBeginning);
                  setAtEnd(sw.isEnd);
                }}
                onObserverUpdate={(sw) => {
                  // 레이아웃 변화에도 상태 갱신(보수적 가드)
                  setAtStart(sw.isBeginning);
                  setAtEnd(sw.isEnd);
                }}
                observer
                observeParents
                watchOverflow
                slidesPerView="auto" // 카드 고정폭
                spaceBetween={mounted ? 20 : 0} // 마운트 후 간격
                speed={450} // 애니메이션 속도
                grabCursor={true} // 데스크톱 드래그 UX
                simulateTouch={true}
                allowTouchMove={true}
                touchStartPreventDefault={false} // 모바일 끊김 방지
                resistanceRatio={0.65}
                threshold={5}
                className="w-full overflow-visible"
              >
                {items.map((restaurant: any) => (
                  <SwiperSlide key={restaurant.id} className="!w-auto">
                    <Link
                      href={`/restaurant/${restaurant.id}`}
                      className="block w-full"
                      onClick={handleLinkClick} // 드래그 중 클릭 막기
                    >
                      <div
                        className="flex h-[386px] w-[386px] min-w-[200px] flex-col items-center justify-end gap-[10px] rounded-[20px] bg-cover bg-center bg-no-repeat p-[26px] max-[721px]:h-[286px] max-[721px]:w-[200px]"
                        style={{
                          backgroundImage: `url(${restaurant.image_url})`,
                        }}
                        aria-label={`${restaurant.title} 카드`}
                      >
                        <div className="flex flex-col items-center justify-center self-stretch rounded-[8px] bg-white/95 px-[24px] py-[20px] shadow-[0_0_12px_rgba(0,0,0,0.25)]">
                          <div className="flex w-full items-end gap-[6px]">
                            <h3 className="text-[20px] font-bold leading-[100%] text-[#171719]">
                              {restaurant.title}
                            </h3>
                            <span className="text-[14px] leading-[100%] text-[#787882]">
                              리뷰 {restaurant.review_count}
                            </span>
                          </div>
                          <p className="mt-[6px] text-[16px] font-semibold text-[#171719]">
                            대표메뉴: {(restaurant.menus || []).join(', ')}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionRestaurantSection;
