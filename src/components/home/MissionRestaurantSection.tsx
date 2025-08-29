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
  const { data, isPending, isError } = useQuery({
    queryKey: ['mission'],
    queryFn: () => getMissionRestaurants(),
  });

  const items = data?.data ?? [];

  // 마운트 후 간격 적용(SSR/CSR 떨림 방지)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 스와이퍼 준비/가장자리
  const [ready, setReady] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // refs
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const draggingRef = useRef(false);

  const handleLinkClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (draggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // 카드 스켈레톤 — 2개
  const CardSkeleton = () => (
    <div className="flex h-[386px] w-[386px] min-w-[200px] items-end rounded-[20px] bg-[#eaeaea] p-[26px] max-[721px]:h-[286px] max-[721px]:w-[200px]">
      <div className="h-[120px] w-full rounded-[8px] bg-white/70 p-[20px] shadow-[0_0_12px_rgba(0,0,0,0.15)]">
        <div className="mb-2 h-5 w-2/3 animate-pulse rounded bg-[#e5e5e5]" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-[#efefef]" />
      </div>
    </div>
  );

  return (
    <section className="mt-[64px] bg-[#F7F7F8]">
      <div className="mx-auto max-w-[1280px] rounded-[12px] px-[20px] py-[32px] md:px-[40px]">
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
              href="/mission"
              className="mt-[24px] flex h-[52px] w-full items-center justify-center gap-[8px] rounded-[12px] bg-[#FA4D09] px-[24px] py-[12px] text-center text-[18px] font-semibold leading-[150%] text-white sm:w-[166px] md:mt-[36px] md:h-[60px] md:px-[28px] md:text-[20px]"
            >
              자세히 보기
            </Link>
          </div>

          {/* 오른쪽: 컨텐츠 */}
          <div className="relative mt-6 w-full xl:mt-0 xl:w-[792px]">
            {/* 1) 펜딩: 스켈레톤 2개(버튼 렌더 안함) */}
            {isPending && (
              <div className="w-full">
                <div className="flex gap-[20px]">
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              </div>
            )}

            {/* 2) 에러/빈 상태 */}
            {!isPending && (isError || items.length === 0) && (
              <div className="rounded-[12px] bg-white p-6 text-sm text-[#787882]">
                현재 노출할 미션 식당이 없어요.
              </div>
            )}

            {/* 3) 데이터 준비 완료: Swiper + 버튼 */}
            {!isPending && !isError && items.length > 0 && (
              <>
                {/* 네비 버튼 — 조건부 렌더링으로 초깜빡임/초기 노출 차단 */}
                {ready && !atStart && (
                  <button
                    ref={prevRef}
                    type="button"
                    aria-label="이전"
                    className="absolute left-[-20px] top-1/2 z-10 -translate-y-1/2 items-center justify-center rounded-[1000px] border border-[#E2E2E4] bg-white p-[8px] xl:flex [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-0"
                  >
                    <Image
                      src="/assets/icons/arrow_left.svg"
                      width={24}
                      height={24}
                      alt="이전"
                    />
                  </button>
                )}

                {ready && !atEnd && (
                  <button
                    ref={nextRef}
                    type="button"
                    aria-label="다음"
                    className="absolute right-[-20px] top-1/2 z-10 -translate-y-1/2 items-center justify-center rounded-[1000px] border border-[#E2E2E4] bg-white p-[8px] xl:flex [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-0"
                  >
                    <Image
                      src="/assets/icons/arrow_right.svg"
                      width={24}
                      height={24}
                      alt="다음"
                    />
                  </button>
                )}

                <Swiper
                  modules={[Navigation]}
                  grabCursor={false}
                  navigation={{ enabled: true }}
                  onBeforeInit={(sw) => {
                    if (
                      sw.params.navigation &&
                      typeof sw.params.navigation === 'object'
                    ) {
                      (sw.params.navigation as any).prevEl = prevRef.current;
                      (sw.params.navigation as any).nextEl = nextRef.current;
                    }
                  }}
                  onInit={(sw) => {
                    swiperRef.current = sw;
                    sw.navigation.init();
                    sw.navigation.update();
                    // 가장자리 계산 → 초기 prev 숨김 보장
                    setAtStart(sw.isBeginning);
                    setAtEnd(sw.isEnd);
                    // 다음 프레임에 노출(깜빡임 방지)
                    requestAnimationFrame(() => setReady(true));
                  }}
                  onSlideChange={(sw) => {
                    setAtStart(sw.isBeginning);
                    setAtEnd(sw.isEnd);
                  }}
                  onResize={(sw) => {
                    sw.update();
                    sw.navigation.update();
                    setAtStart(sw.isBeginning);
                    setAtEnd(sw.isEnd);
                  }}
                  // 드래그 중 링크 클릭 방지
                  onSliderMove={() => {
                    draggingRef.current = true;
                  }}
                  onTouchEnd={() => {
                    setTimeout(() => {
                      draggingRef.current = false;
                    }, 0);
                  }}
                  onTransitionEnd={() => {
                    draggingRef.current = false;
                  }}
                  observer
                  observeParents
                  watchOverflow
                  slidesPerView="auto"
                  spaceBetween={mounted ? 20 : 0}
                  speed={450}
                  simulateTouch
                  allowTouchMove
                  touchStartPreventDefault={false}
                  resistanceRatio={0.65}
                  threshold={5}
                  className="w-full touch-pan-y overflow-visible"
                >
                  {items.map((restaurant: any) => (
                    <SwiperSlide key={restaurant.id} className="!w-auto">
                      <Link
                        href={`/restaurant/${restaurant.id}`}
                        className="block w-full select-none"
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        onClick={handleLinkClick}
                      >
                        <div
                          className="hidden h-[386px] w-[386px] min-w-[200px] flex-col items-center justify-end gap-[10px] rounded-[20px] bg-cover bg-center bg-no-repeat p-[26px] min-[722px]:flex"
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

                        {/* ✅ 새 카드: 722px 이상에서는 숨김 */}
                        <div className="flex w-[200px] flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.08)] min-[722px]:hidden">
                          {/* 이미지 영역 */}
                          <div
                            className="flex h-[194px] flex-col items-center justify-center gap-[10px] self-stretch bg-cover bg-center bg-no-repeat py-[26px]"
                            style={{
                              backgroundImage: `url(${restaurant.image_url})`,
                            }}
                            aria-label={`${restaurant.title} 이미지`}
                          />

                          {/* 텍스트 영역 */}
                          <div className="flex min-w-[200px] flex-col items-start justify-center self-stretch rounded-b-[10px] p-4">
                            <div className="flex w-full items-center gap-[6px]">
                              <h3 className="text-[18px] font-bold leading-[120%] text-[#171719]">
                                {restaurant.title}
                              </h3>

                              {/* 리뷰 아이콘 + 개수 (텍스트 '리뷰' 대신 아이콘) */}
                              <span className="ml-[2px] inline-flex items-center gap-[4px] text-[12px] leading-[100%] text-[#787882]">
                                <Image
                                  src="/assets/icons/massage_gray.svg"
                                  alt="리뷰 수"
                                  width={12}
                                  height={12}
                                />
                                {restaurant.review_count}
                              </span>
                            </div>

                            <p className="mt-[6px] line-clamp-2 text-[14px] font-semibold text-[#171719]">
                              대표메뉴: {(restaurant.menus || []).join(', ')}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionRestaurantSection;
