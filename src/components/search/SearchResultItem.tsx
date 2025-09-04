'use client';
import { useEffect, useMemo, useState } from 'react';

// Swiper
import 'swiper/css';
import 'swiper/css/free-mode';
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type PhotoPreview = { image_url?: string; text?: string };

type ItemProps = {
  it: any;
};

// ✅ 간단한 미디어쿼리 훅: 클라이언트에서만 동작
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, [query]);
  // SSR 초기 깜빡임 방지: null 동안은 아무것도 렌더 안 함
  return matches;
}

export default function SearchResultItem({ it }: ItemProps) {
  const isDesktop = useMediaQuery('(min-width: 376px)');

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

  // ✅ SSR → CSR 전환 시점까지는 스와이퍼 렌더 지연 (초기 폭 0으로 초기화 방지)
  if (isDesktop === null) {
    return (
      <div className="flex flex-col items-start gap-[10px] self-stretch border-b border-[#E2E2E4] bg-white pb-[12px] pl-[20px] pr-0 pt-[12px]">
        {/* 헤더만 먼저 보여주고, 슬라이더는 미디어쿼리 평가 후 렌더 */}
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
              {rating}{' '}
              <span className="text-[#787882]">리뷰 {reviewCount}</span>
            </div>
          </div>
          <img
            src="/assets/icons/bookmark.svg"
            alt="북마크"
            className="h-[24px] w-[24px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-[10px] self-stretch overflow-x-clip border-b border-[#E2E2E4] bg-white pb-[12px] pl-[20px] pr-0 pt-[12px]">
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

      {/* ========= 레이아웃 분기: "하나만" 렌더 ========= */}
      {isDesktop ? (
        /* ≥ 376px: (이미지+텍스트) 카드 단위 */
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
            spaceBetween={8}
            resistanceRatio={0}
            nested
            wrapperTag="ul"
            className="w-full [&>.swiper-wrapper]:m-0 [&>.swiper-wrapper]:list-none [&>.swiper-wrapper]:p-0"
            style={{ touchAction: 'pan-x' }}
            // ✅ 숨김→표시/사이즈 변경 대응
            observer
            observeParents
            observeSlideChildren
            updateOnWindowResize
            resizeObserver
          >
            {(imageSlides.length
              ? imageSlides
              : [{ image_url: cover } as PhotoPreview]
            ).map((ph, idx) => (
              <SwiperSlide
                tag="li"
                key={`pc-${idx}`}
                className="!w-[170px] shrink-0 list-none"
              >
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
      ) : (
        /* ≤ 375px: 이미지 윗줄 / 댓글 아랫줄 (각각 별도 Swiper) */
        <>
          {/* 이미지 줄 */}
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
              spaceBetween={8}
              resistanceRatio={0}
              nested
              wrapperTag="ul"
              className="w-full [&>.swiper-wrapper]:m-0 [&>.swiper-wrapper]:list-none [&>.swiper-wrapper]:p-0"
              style={{ touchAction: 'pan-x' }}
              observer
              observeParents
              observeSlideChildren
              updateOnWindowResize
              resizeObserver
              watchOverflow
            >
              {(imageSlides.length
                ? imageSlides
                : [{ image_url: undefined } as PhotoPreview]
              ).map((ph, idx) => (
                <SwiperSlide
                  tag="li"
                  key={`img-${idx}`}
                  className="!w-[120px] shrink-0 list-none"
                >
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

          {/* 텍스트 줄 */}
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
              spaceBetween={8}
              resistanceRatio={0}
              nested
              wrapperTag="ul"
              className="w-full [&>.swiper-wrapper]:m-0 [&>.swiper-wrapper]:list-none [&>.swiper-wrapper]:p-0"
              style={{ touchAction: 'pan-x' }}
              observer
              observeParents
              observeSlideChildren
              updateOnWindowResize
              resizeObserver
              watchOverflow
            >
              {(texts.length ? texts : ['아직 등록된 리뷰가 없습니다.']).map(
                (txt, idx) => (
                  <SwiperSlide
                    tag="li"
                    key={`txt-${idx}`}
                    className="!w-[146px] shrink-0 list-none"
                  >
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
        </>
      )}
    </div>
  );
}
