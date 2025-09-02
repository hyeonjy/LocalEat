'use client';
import { useMemo } from 'react';

// Swiper
import 'swiper/css';
import 'swiper/css/free-mode';
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type PhotoPreview = { image_url?: string; text?: string };

type ItemProps = {
  it: any; // 서버 결과 형태(필요시 타입 구체화)
};

export default function SearchResultItem({ it }: ItemProps) {
  const title = it?.name ?? '이름 미상';
  const category = it?.category ?? '';
  const ratingNum = Number(it?.avg_rating);
  const rating = Number.isFinite(ratingNum) ? ratingNum.toFixed(1) : '–';

  const reviewCountNum = Number(it?.review_count);
  const reviewCount = Number.isFinite(reviewCountNum) ? reviewCountNum : 0;

  const photos: PhotoPreview[] = (it?.photos_preview as any[]) ?? [];
  const cover = it?.cover_image_url as string | undefined;

  const imageSlides: PhotoPreview[] = useMemo(() => {
    if (photos && photos.length > 0) return photos;
    if (cover) return [{ image_url: cover }];
    return [];
  }, [photos, cover]);

  const texts: string[] = useMemo(() => {
    const arr = (photos ?? [])
      .map((p) => (p?.text ?? '').trim())
      .filter(Boolean);
    if (arr.length > 0) return arr;
    const fallback = (it?.last_review_body ?? '').trim();
    return fallback ? [fallback] : ['아직 등록된 리뷰가 없습니다.'];
  }, [photos, it?.last_review_body]);

  return (
    <div className="flex flex-col items-start gap-[10px] self-stretch border-b border-[#E2E2E4] bg-white pb-[12px] pl-[20px] pr-0 pt-[12px]">
      {/* 헤더 */}
      <div className="flex w-full justify-between pr-[20px]">
        <div className="flex flex-col">
          <h2 className="flex items-center gap-[6px] text-[20px] font-semibold leading-[130%] tracking-[-0.3px] text-[#171719]">
            {title}{' '}
            {category && (
              <span className="text-[16px] font-normal leading-[130%] tracking-[-0.24px] text-[#787882]">
                {category}
              </span>
            )}
          </h2>
          <div className="flex items-center gap-1 text-[16px] font-normal leading-[130%] text-[#171719]">
            <img
              src="/assets/icons/red_star.svg"
              alt="별점"
              className="h-[16px] w-[16px]"
            />
            {rating} <span className="text-[#787882]">리뷰 {reviewCount}</span>
          </div>
        </div>
        <img
          src="/assets/icons/bookmark.svg"
          alt="북마크"
          className="h-[24px] w-[24px]"
        />
      </div>

      {/* ========= >= 376px: 한 카드(이미지+텍스트)씩 가로 스와이프 ========= */}
      <div className="hidden min-[376px]:block">
        <div
          className="w-full select-none overflow-hidden"
          style={{ overscrollBehaviorX: 'contain' }}
        >
          <Swiper
            modules={[FreeMode]}
            freeMode={{ enabled: true, momentum: true }}
            grabCursor
            allowTouchMove
            slidesPerView="auto"
            spaceBetween={20}
            breakpoints={{
              0: { spaceBetween: 12 },
              381: { spaceBetween: 16 },
              722: { spaceBetween: 20 },
              1280: { spaceBetween: 24 },
            }}
            resistanceRatio={0}
            nested
            touchStartPreventDefault={false}
            className="!overflow-visible"
            style={{ touchAction: 'pan-x' }}
          >
            {(imageSlides.length
              ? imageSlides
              : [{ image_url: cover } as PhotoPreview]
            ).map((ph, idx) => (
              <SwiperSlide key={`pc-${idx}`} className="!w-[170px]">
                <div className="flex flex-col items-start overflow-hidden rounded-[12px]">
                  <div className="h-[170px] w-[170px] overflow-hidden bg-[#ccc]">
                    {ph?.image_url ? (
                      <img
                        src={ph.image_url}
                        alt="리뷰 이미지"
                        className="h-[170px] w-[170px] object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="h-full w-full bg-[#e5e5ea]" />
                    )}
                  </div>
                  <div className="w-[170px] bg-[#F4F4F5] p-[12px]">
                    <p className="line-clamp-3 overflow-hidden text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#5F5F68]">
                      {photos[idx]?.text ??
                        it?.last_review_body ??
                        '아직 등록된 리뷰가 없습니다.'}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* ========= <= 375px: 이미지/텍스트 분리 스와이프 ========= */}
      <div className="block min-[376px]:hidden">
        {/* 이미지 (120x120) */}
        <div
          className="w-full select-none overflow-hidden"
          style={{ overscrollBehaviorX: 'contain' }}
        >
          <Swiper
            modules={[FreeMode]}
            freeMode={{ enabled: true, momentum: true }}
            grabCursor
            allowTouchMove
            slidesPerView="auto"
            spaceBetween={16}
            breakpoints={{
              0: { spaceBetween: 12 },
              381: { spaceBetween: 16 },
            }}
            resistanceRatio={0}
            nested
            touchStartPreventDefault={false}
            className="!overflow-visible"
            style={{ touchAction: 'pan-x' }}
            watchOverflow
          >
            {(imageSlides.length
              ? imageSlides
              : [{ image_url: undefined } as PhotoPreview]
            ).map((ph, idx) => (
              <SwiperSlide key={`img-${idx}`} className="!w-[120px]">
                <div className="h-[120px] w-[120px] overflow-hidden rounded-[12px] bg-[#e5e5ea]">
                  {ph?.image_url ? (
                    <img
                      src={ph.image_url}
                      alt="리뷰 이미지"
                      className="h-[120px] w-[120px] object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="h-full w-full bg-[#e5e5ea]" />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 텍스트 (카드 146×48 + p-12, 3줄 말줄임) */}
        <div
          className="mt-[8px] w-full select-none overflow-hidden"
          style={{ overscrollBehaviorX: 'contain' }}
        >
          <Swiper
            modules={[FreeMode]}
            freeMode={{ enabled: true, momentum: true }}
            grabCursor
            allowTouchMove
            slidesPerView="auto"
            spaceBetween={16}
            breakpoints={{
              0: { spaceBetween: 12 },
              381: { spaceBetween: 16 },
            }}
            resistanceRatio={0}
            nested
            touchStartPreventDefault={false}
            className="!overflow-visible"
            style={{ touchAction: 'pan-x' }}
            watchOverflow
          >
            {(texts.length ? texts : ['아직 등록된 리뷰가 없습니다.']).map(
              (txt, idx) => (
                <SwiperSlide key={`txt-${idx}`} className="!w-[146px]">
                  <div className="w-[146px] rounded-[12px] bg-[#F4F4F5] p-[12px]">
                    <p
                      className="line-clamp-3 overflow-hidden text-[12px] leading-[130%] tracking-[-0.24px] text-[#5F5F68]"
                      style={{ maxHeight: '48px' }}
                    >
                      {txt}
                    </p>
                  </div>
                </SwiperSlide>
              ),
            )}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
