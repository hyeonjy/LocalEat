// StoryReviewCollection.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/free-mode';
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { getLatestStoryCards, type StoryCard } from '@/app/actions/review';
import StoryPreview from '@/app/restaurant/[id]/review/_components/StoryPreview';
import Image from 'next/image';

// 정규화 함수
const BACKEND_ORIGIN =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') ||
  'https://test-shhu.onrender.com';
const toFrontUrl = (u?: string | null) => {
  if (!u) return '';
  if (u.startsWith('http')) return u; // 절대 URL 그대로
  if (u.startsWith('/assets/')) return u; // 프론트 public 정적 자산
  return `${BACKEND_ORIGIN}${u}`; // 그 외(예: /uploads/…)
};

type Props = { limit?: number };

const StoryReviewCollection = ({ limit = 12 }: Props) => {
  const {
    data: raw = [],
    isLoading,
    isError,
  } = useQuery<StoryCard[], Error>({
    queryKey: ['story-cards', 'latest', limit],
    queryFn: () => getLatestStoryCards(limit, 0), // ← 이 함수가 StoryCard[] 반환
    staleTime: 60_000,
  });

  // 여기서 한 번 정규화
  const cards: StoryCard[] = raw.map((c) => ({
    ...c,
    background_image_url: toFrontUrl(c.background_image_url),
    elements: (c.elements ?? []).map((el: any) => ({
      ...el,
      src: toFrontUrl(el.src),
    })),
  }));

  return (
    <section>
      <div className="mx-auto w-full max-w-[1280px] gap-[10px] self-stretch rounded-[12px] px-[40px] py-[32px] min-[381px]:max-[721px]:px-[16px]">
        <div className="flex items-end justify-between">
          <div>
            <p className="pt-[30px] font-semibold leading-[130%] text-[#FA4D09] max-[721px]:text-[16px] min-[722px]:text-[24px]">
              로컬잇터들의 방문 스토리 보러가기
            </p>
            <h2 className="font-bold leading-[130%] tracking-[0.4px] text-[#171719] max-[721px]:text-[24px] min-[722px]:text-[40px]">
              다녀왔밥 모음.zip
            </h2>
          </div>
          <Link
            href=""
            className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#E2E2E4] bg-white lg:h-auto lg:w-[84px] lg:rounded-none lg:border-0 lg:bg-transparent lg:p-[2px] lg:text-center lg:text-[16px] lg:font-normal lg:leading-[130%] lg:text-[#787882]"
          >
            {/* 1024px 이상: 텍스트 */}
            <span className="hidden lg:block">전체보기</span>

            {/* 1024px 미만: 아이콘 */}
            <Image
              src="/assets/icons/arrow_outward.svg"
              alt="전체보기"
              width={12}
              height={12}
              className="block lg:hidden"
            />
          </Link>
        </div>

        <div className="w-full pb-[37px] pt-[24px]">
          <Swiper
            modules={[FreeMode]}
            freeMode={{ enabled: true, momentum: true }}
            grabCursor
            slidesPerView="auto"
            spaceBetween={20}
            breakpoints={{
              0: { spaceBetween: 12 },
              381: { spaceBetween: 16 },
              722: { spaceBetween: 20 },
              1280: { spaceBetween: 24 },
            }}
            allowTouchMove
          >
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <SwiperSlide key={`skeleton-${i}`} style={{ width: 247 }}>
                  <div className="relative h-[330px] w-[247px] animate-pulse overflow-hidden rounded-[18px] bg-[#EDEDF0]" />
                </SwiperSlide>
              ))}

            {isError && !isLoading && (
              <SwiperSlide style={{ width: 240 }}>
                <div className="flex h-[360px] w-[240px] items-center justify-center rounded-[18px] bg-[#F8D7DA]">
                  <span className="text-[14px] text-[#842029]">
                    스토리를 불러오지 못했어요
                  </span>
                </div>
              </SwiperSlide>
            )}

            {!isLoading && !isError && cards.length === 0 && (
              <SwiperSlide style={{ width: 240 }}>
                <div className="flex h-[360px] w-[240px] items-center justify-center rounded-[18px] bg-[#ccc]">
                  <span className="text-[14px] text-[#171719]">
                    스토리가 없어요
                  </span>
                </div>
              </SwiperSlide>
            )}

            {!isLoading &&
              !isError &&
              cards.map((review) => (
                <SwiperSlide key={review.id} style={{ width: 247 }}>
                  <div className="relative h-[330px] w-[247px] overflow-hidden rounded-[18px]">
                    <StoryPreview
                      backgroundImage={review.background_image_url}
                      elements={review.elements}
                      previewW={247}
                      previewH={330}
                    />
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default StoryReviewCollection;
