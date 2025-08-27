'use client';

import { getTopRatedRestaurants } from '@/app/actions/restaurant';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const TopTenRestaurantList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['topRatedRestaurants'],
    queryFn: () => getTopRatedRestaurants(),
  });

  const restaurants = data ?? [];

  // 데스크톱 스와이퍼 UX(모바일은 일반 리스트)
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const draggingRef = useRef(false);

  useEffect(() => setMounted(true), []);
  const handleLinkClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (draggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section className="mt-[32px]">
      <div className="mx-auto w-full max-w-[1280px] rounded-[12px] px-4 py-6 sm:px-[16px] md:px-8 md:py-[32px] xl:px-[40px]">
        {/* 헤더 */}
        <div className="flex w-full items-end justify-between">
          <div className="w-full">
            <p className="pt-[30px] font-semibold leading-[130%] text-[#FA4D09] max-[720px]:text-[16px] min-[721px]:text-[24px]">
              요즘 인기 있는 식당
            </p>
            <h2 className="font-bold leading-[130%] tracking-[0.4px] text-[#171719] max-[720px]:text-[24px] min-[721px]:text-[40px]">
              로컬잇픽 TOP 10
            </h2>
          </div>
          <Link
            className="flex w-[84px] items-center justify-center p-[2px] text-center text-[16px] font-normal leading-[130%] text-[#787882]"
            href="/places"
          >
            전체보기
          </Link>
        </div>

        {/* 로딩/에러 */}
        {isLoading && <div className="mt-[24px]">로딩중...</div>}
        {isError && !isLoading && (
          <div className="mt-[24px] text-red-500">
            데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        )}

        {/* ===================== 모바일(≤720) 리스트 ===================== */}
        {!isLoading && !isError && (
          <ul className="mt-[24px] flex flex-col gap-[12px] min-[721px]:hidden">
            {restaurants.map((r: any, idx: number) => (
              <li
                key={r.id}
                className="flex h-[178px] w-full items-center overflow-hidden rounded-[20px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.15)]"
              >
                {/* 왼쪽 이미지 고정폭 145px, 높이 li와 동일 */}
                <div className="h-full w-[145px] flex-shrink-0 overflow-hidden">
                  {r.image_url ? (
                    <Image
                      src={r.image_url}
                      alt={r.name}
                      className="h-full w-full object-cover"
                      width={145}
                      height={178}
                    />
                  ) : (
                    <div className="h-full w-full bg-[#ccc]" />
                  )}
                </div>

                {/* 오른쪽 텍스트 */}
                <div className="flex h-full flex-1 flex-col gap-[10px] px-[12px] py-[12px]">
                  {/* 칩 2개 */}
                  <ul className="flex gap-[6px]">
                    <li className="rounded-[4px] bg-[#FEEDE6] px-[6px] py-[4px] text-[14px] text-[#FA4D09]">
                      {r.address?.split(' ')[1] || '지역'}
                    </li>
                    <li className="rounded-[4px] bg-[#E0F6F1] px-[6px] py-[4px] text-[14px] text-[#004332]">
                      {r.category?.split(',')[0]}
                    </li>
                  </ul>

                  {/* 순위 + 가게명 + 리뷰 */}
                  <div className="flex items-start gap-[10px]">
                    <span className="text-[24px] font-bold leading-[130%]">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={`/restaurant/${r.id}`}
                        className="block truncate text-[18px] font-semibold leading-[130%] text-[#171719] hover:text-[#F98510]"
                      >
                        {r.name}
                      </Link>
                      <span className="text-[14px] leading-[130%] text-[#727275]">
                        리뷰 {r.review_count ?? 0}
                      </span>
                    </div>
                  </div>

                  {/* 설명 두 줄 */}
                  <p className="line-clamp-2 border-t border-[#E2E2E4] pt-[8px] text-[14px] leading-[130%] text-[#010101]">
                    {r.menus?.length
                      ? `대표메뉴: ${r.menus.slice(0, 3).join(', ')}`
                      : '메뉴 정보 준비 중'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* ===================== 데스크톱(≥721) 스와이퍼 ===================== */}
        {!isLoading && !isError && (
          <div className="relative mt-[24px] hidden min-[721px]:block">
            {/* 네비 버튼 (xl 이상만 노출) */}
            <button
              id="topten-prev"
              type="button"
              aria-label="이전"
              className={`absolute left-[-20px] top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-[1000px] border border-[#E2E2E4] bg-[#FFF] p-[8px] transition-opacity xl:flex ${
                !ready || atStart
                  ? 'pointer-events-none opacity-0'
                  : 'opacity-100'
              }`}
            >
              <Image
                src="/assets/icons/arrow_left.svg"
                width={24}
                height={24}
                alt="이전"
              />
            </button>
            <button
              id="topten-next"
              type="button"
              aria-label="다음"
              className={`absolute right-[-20px] top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-[1000px] border border-[#E2E2E4] bg-[#FFF] p-[8px] transition-opacity xl:flex ${
                !ready || atEnd
                  ? 'pointer-events-none opacity-0'
                  : 'opacity-100'
              }`}
            >
              <Image
                src="/assets/icons/arrow_right.svg"
                width={24}
                height={24}
                alt="다음"
              />
            </button>

            {/* 스와이퍼 */}
            <div
              className={`${ready ? 'visible opacity-100' : 'invisible opacity-0'} transition-opacity`}
            >
              <Swiper
                modules={[Navigation]}
                navigation={{
                  enabled: true,
                  prevEl: '#topten-prev',
                  nextEl: '#topten-next',
                }}
                onBeforeInit={(sw) => {
                  if (
                    sw.params.navigation &&
                    typeof sw.params.navigation === 'object'
                  ) {
                    (sw.params.navigation as any).prevEl = '#topten-prev';
                    (sw.params.navigation as any).nextEl = '#topten-next';
                  }
                }}
                onSwiper={(sw) => {
                  swiperRef.current = sw;
                  sw.on('sliderFirstMove', () => (draggingRef.current = true));
                  sw.on('touchEnd', () =>
                    setTimeout(() => (draggingRef.current = false), 0),
                  );
                  sw.on('transitionEnd', () => (draggingRef.current = false));
                  setTimeout(() => {
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
                observer
                observeParents
                watchOverflow
                slidesPerView="auto"
                spaceBetween={mounted ? 20 : 0}
                speed={450}
                grabCursor
                simulateTouch
                allowTouchMove
                touchStartPreventDefault={false}
                resistanceRatio={0.65}
                threshold={5}
                className="w-full overflow-visible"
              >
                {restaurants.map((r: any, idx: number) => (
                  <SwiperSlide key={r.id} className="!w-auto">
                    <li className="flex h-[472px] w-[282px] flex-col items-start overflow-hidden rounded-[20px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.15)]">
                      <div className="h-[282px] w-full overflow-hidden bg-[#ccc]">
                        {r.image_url && (
                          <Image
                            src={r.image_url}
                            alt={r.name}
                            className="h-full w-full object-cover"
                            width={282}
                            height={282}
                          />
                        )}
                      </div>
                      <div className="flex flex-col items-start gap-[12px] self-stretch bg-white px-[24px] py-[20px]">
                        <ul className="flex gap-[6px]">
                          <li className="rounded-[4px] bg-[#FEEDE6] px-[6px] py-[4px] text-[14px] text-[#FA4D09]">
                            {r.address?.split(' ')[1] || '지역'}
                          </li>
                          <li className="rounded-[4px] bg-[#E0F6F1] px-[6px] py-[4px] text-[14px] text-[#004332]">
                            {r.category?.split(',')[0]}
                          </li>
                        </ul>
                        <div className="flex gap-[12px]">
                          <span className="text-[32px] font-bold leading-[130%]">
                            {idx + 1}
                          </span>
                          <div>
                            <Link
                              href={`/restaurant/${r.id}`}
                              onClick={handleLinkClick}
                              className="text-[20px] font-semibold leading-[130%] text-black hover:text-[#F98510]"
                            >
                              {r.name}
                            </Link>
                            <span className="ml-[6px] text-[16px] leading-[130%] text-[#727275]">
                              리뷰 {r.review_count ?? 0}
                            </span>
                          </div>
                        </div>
                        <p className="line-clamp-2 border-t border-[#E2E2E4] pt-[8px] text-[16px] text-[#010101]">
                          {r.menus?.length
                            ? `대표메뉴: ${r.menus.slice(0, 3).join(', ')}`
                            : '메뉴 정보 준비 중'}
                        </p>
                      </div>
                    </li>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopTenRestaurantList;
