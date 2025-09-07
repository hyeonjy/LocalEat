'use client';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

// 간단 미디어쿼리
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
  return matches;
}

export default function SearchResultItem({ it }: ItemProps) {
  const isDesktop = useMediaQuery('(min-width: 376px)');
  const router = useRouter();

  // ✅ 로그인 유저 (null이면 비로그인)
  const user = useAuthStore((s: any) => s.user);

  // id/기본 데이터
  const idRaw = it?.id ?? it?.restaurant_id ?? it?.restaurantId;
  const rid =
    typeof idRaw === 'number' || typeof idRaw === 'string'
      ? String(idRaw)
      : null;
  const href = rid ? `/restaurant/${rid}` : undefined;

  const title = it?.name ?? '이름 미상';
  const category = it?.category ?? '';
  const ratingNum = Number(it?.avg_rating);
  const rating = Number.isFinite(ratingNum) ? ratingNum.toFixed(1) : '–';
  const reviewCountNum = Number(it?.review_count);
  const reviewCount = Number.isFinite(reviewCountNum) ? reviewCountNum : 0;

  const photos: PhotoPreview[] = (it?.photos_preview as any[]) ?? [];
  const cover = (it?.cover_image_url as string | undefined) ?? undefined;

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

  // ✅ 찜 로컬 상태(초기 false). *이 컴포넌트는 조회를 하지 않음*
  const [isFav, setIsFav] = useState(false);
  const [favBusy, setFavBusy] = useState(false);

  // 로그아웃되면 로컬 상태 초기화(선택)
  useEffect(() => {
    if (!user) setIsFav(false);
  }, [user]);

  // ✅ 토글(저장/삭제)만 수행
  const onToggleFavorite = async () => {
    if (!rid) return;

    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (favBusy) return;
    setFavBusy(true);

    // 백엔드에 저장할 스냅샷 필드(선택)
    const snapRegion =
      it?.region ?? it?.address_region ?? it?.area ?? it?.location ?? '';
    const snapMainImageUrl = cover ?? imageSlides?.[0]?.image_url ?? undefined;

    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
          // 🔴 중요: 유저 id를 Next API로 함께 보냄(Next가 백엔드로 포워딩)
          ...(user?.id ? { 'x-user-id': String(user.id) } : {}),
        },
        body: JSON.stringify({
          restaurantId: rid,
          snapName: title,
          snapRegion,
          snapMainImageUrl,
        }),
      });

      if (res.ok) {
        // 서버가 { action: 'inserted' | 'deleted', ... }를 반환
        let next = !isFav;
        try {
          const data = await res.json();
          if (data?.action === 'inserted') next = true;
          else if (data?.action === 'deleted') next = false;
        } catch {
          // 바디 파싱 실패 시 낙관적으로 토글 유지
        }
        setIsFav(next);
      } else {
        console.error('toggle favorite failed', await res.text());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFavBusy(false);
    }
  };

  // ✅ 제목 + 별점 블록
  const TitleHeader = () => (
    <div className="flex flex-col">
      <h2 className="flex items-center gap-[6px] text-[20px] font-semibold leading-[130%] tracking-[-0.3px] text-[#171719] max-[375px]:text-[16px]">
        {href ? (
          <Link
            href={href}
            prefetch={false}
            className="rounded-[4px] outline-none hover:underline focus:underline"
            aria-label={`${title} 상세 페이지로 이동`}
          >
            {title}
          </Link>
        ) : (
          title
        )}
        {category && (
          <span className="text-[16px] font-normal leading-[130%] tracking-[-0.24px] text-[#787882] max-[375px]:text-[10px]">
            {category}
          </span>
        )}
      </h2>

      <div className="flex items-center gap-1 text-[16px] font-normal leading-[130%] text-[#171719] max-[375px]:text-[12px]">
        <img
          src="/assets/icons/red_star.svg"
          alt="별점"
          className="h-[16px] w-[16px]"
        />
        {rating} <span className="text-[#787882]">리뷰 {reviewCount}</span>
      </div>
    </div>
  );

  const bookmarkDisabled = favBusy || isDesktop === null;
  const bookmarkIcon = isFav
    ? '/assets/icons/bookmark_filled.svg'
    : '/assets/icons/bookmark.svg';

  if (isDesktop === null) {
    return (
      <div className="flex flex-col items-start gap-[10px] self-stretch border-b border-[#E2E2E4] bg-white pb-[12px] pl-[20px] pr-0 pt-[12px]">
        <div className="flex w-full justify-between pr-[20px]">
          <TitleHeader />
          <button
            type="button"
            aria-label={isFav ? '찜 해제' : '찜하기'}
            aria-pressed={isFav}
            disabled
            className="opacity-70"
          >
            <img
              src={bookmarkIcon}
              alt="북마크"
              className="h-[24px] w-[24px]"
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-[10px] self-stretch overflow-x-clip border-b border-[#E2E2E4] bg-white pb-[12px] pl-[10px] pr-0 pt-[12px]">
      {/* 헤더 */}
      <div className="flex w-full justify-between pr-[20px]">
        <TitleHeader />
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={isFav ? '찜 해제' : '찜하기'}
          aria-pressed={isFav}
          disabled={bookmarkDisabled}
          className={`grid h-[28px] w-[28px] place-items-center rounded-md transition-opacity ${bookmarkDisabled ? 'opacity-60' : 'hover:opacity-80'}`}
        >
          <img
            src={bookmarkIcon}
            alt={isFav ? '북마크됨' : '북마크'}
            className="h-[24px] w-[24px]"
          />
        </button>
      </div>

      {/* ====== 이하 기존 슬라이드 UI 동일 ====== */}
      {isDesktop ? (
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
        <>
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
