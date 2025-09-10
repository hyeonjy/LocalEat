'use client';

import { useUserPoints } from '@/hooks/usePoint';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { getUserReviews, getUserReviewsCount } from '../actions/user';
import FoodCalendar from './_components/FoodCalendar';

// Swiper
import 'swiper/css';
import 'swiper/css/free-mode';
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const cornerClasses = [
  'rounded-tl-[20px]',
  'rounded-tr-[20px]',
  'rounded-bl-[20px]',
  'rounded-br-[20px]',
];

type FavoriteRow = {
  restaurant_id: string;
  snap_name: string;
  snap_region: string | null;
  snap_main_image_url: string | null;
  created_at: string;
};

const page = () => {
  const { user } = useAuthStore();
  const userId = user?.id?.toString() || '';

  // ─────────────────────────── 데이터 훅
  const { data: pointsData } = useUserPoints(userId);
  const { data: reviewsCountData } = useQuery({
    queryKey: ['reviewsCount', userId],
    queryFn: () => getUserReviewsCount(userId),
    enabled: !!userId,
  });
  const { data: reviewData, isPending } = useQuery({
    queryKey: ['reviews', 'standard', userId],
    queryFn: () => getUserReviews({ userId, type: 'standard' }),
    enabled: !!userId,
  });
  const currentPoints = pointsData?.totalPoints || 0;

  // 찜한 식당
  const {
    data: favData,
    isPending: favLoading,
    error: favError,
  } = useQuery({
    queryKey: ['favorites', userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await fetch('/api/favorites?limit=200', {
        method: 'GET',
        credentials: 'include',
        headers: userId ? { 'x-user-id': String(userId) } : {},
      });
      if (!res.ok) {
        const t = await res.text().catch(() => '');
        throw new Error(t || `HTTP ${res.status}`);
      }
      const data = await res.json();
      return (data?.items as FavoriteRow[]) ?? [];
    },
  });

  const favorites = favData ?? [];

  return (
    <div className="mx-auto w-full max-w-none px-4 max-[375px]:px-0 min-[376px]:max-w-[832px] xl:max-w-[1200px] xl:px-0">
      {/* ─────────────────────────── PC ≥1280 : 좌/우 레이아웃(마이페이지_0) */}
      <div className="hidden max-[1280px]:mt-[116px] xl:mt-[113px] xl:flex xl:gap-[126px]">
        {/* ===== 왼쪽 사이드바 ===== */}
        <aside className="w-[282px] shrink-0">
          {/* 섹션: 프로필 카드 */}
          <div className="relative flex items-start gap-[17px]">
            <div className="h-[80px] w-[80px] overflow-hidden rounded-full bg-[#CCCCCC]">
              {user?.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.profileImage} alt="프로필" />
              ) : (
                <div className="h-full w-full bg-[#E5E5E5]" />
              )}
            </div>
            <div>
              <p className="text-[20px] font-bold leading-[100%] text-[#171719]">
                {user?.nickname ?? '게스트'}
              </p>
              <div className="mt-[8px] text-[14px] leading-[100%] text-[#171719]">
                <span className="mr-2">팔로워 0</span>
                <span>팔로잉 0</span>
              </div>
            </div>
            <Image
              src="/assets/icons/setting.svg"
              alt="setting"
              width={24}
              height={24}
              className="absolute right-0 top-0"
            />
          </div>

          {/* 섹션: 포인트/기록 카드 */}
          <div className="mt-[20px] flex h-[54px] w-full justify-between rounded-[12px] border border-[#C7C7CC]">
            <Link
              href="/mypage/point"
              className="my-[9px] flex w-1/2 flex-col justify-center border-r border-r-[#CCCCCC]"
            >
              <p className="text-center text-[16px] font-bold leading-[130%] tracking-[0.16px] text-[#171719]">
                {currentPoints}P
              </p>
              <span className="text-center text-[12px] leading-[130%] tracking-[-0.24px] text-[#171719]">
                내 포인트
              </span>
            </Link>
            <Link
              href="/mypage/review"
              className="my-[9px] flex w-1/2 flex-col justify-center"
            >
              <p className="text-center text-[16px] font-bold leading-[130%] tracking-[0.16px] text-[#171719]">
                {reviewsCountData?.count || 0}
              </p>
              <span className="text-center text-[12px] leading-[130%] tracking-[-0.24px] text-[#171719]">
                내 기록
              </span>
            </Link>
          </div>

          {/* 섹션: 포인트 상점 버튼 */}
          <Link
            href="/mypage/store"
            className="mt-[20px] inline-flex h-[50px] w-full items-center justify-center rounded-[10px] bg-[#FA4D09] px-[24px] py-[10px] text-[20px] font-semibold text-white"
          >
            포인트 상점 구경하기
          </Link>
        </aside>

        {/* ===== 오른쪽 컨텐츠 ===== */}
        <div className="min-w-0 flex-1">
          {/* 섹션: 맛집 캘린더 */}
          <section aria-label="맛집 캘린더" className="w-full">
            <h2 className="text-[32px] font-bold text-[#171719]">
              맛집 캘린더
            </h2>
            {isPending ? (
              <div className="mt-4 grid w-full max-w-[770px] grid-cols-7 gap-[2px]">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square min-h-[110px] animate-pulse rounded-[12px] bg-[#EEEEEE]"
                  />
                ))}
              </div>
            ) : (
              <FoodCalendar reviews={reviewData?.reviews ?? []} />
            )}
          </section>

          {/* 섹션: 찜한 식당 */}
          <section aria-label="찜한 식당" className="my-[20px]">
            <h2 className="text-[32px] font-bold text-[#171719]">찜한 식당</h2>

            {!user ? (
              <p className="mt-[12px] text-[14px] text-[#787882]">
                로그인 후 찜 목록을 볼 수 있어요.
              </p>
            ) : favLoading ? (
              <div className="mt-[12px] grid grid-cols-4 gap-[20px]">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-[180px]">
                    <div className="h-[180px] w-full animate-pulse rounded-[12px] bg-[#EEEEEE]" />
                    <div className="mt-[8px] h-[18px] w-[150px] animate-pulse rounded bg-[#EEEEEE]" />
                    <div className="mt-[4px] h-[16px] w-[90px] animate-pulse rounded bg-[#EEEEEE]" />
                  </div>
                ))}
              </div>
            ) : favError ? (
              <p className="mt-[12px] text-[14px] text-[#D14343]">
                불러오기 오류가 발생했어요.
              </p>
            ) : favorites.length === 0 ? (
              <p className="mt-[12px] text-[14px] text-[#787882]">
                아직 찜한 식당이 없어요.
              </p>
            ) : (
              <ul className="mt-[12px] grid grid-cols-4 gap-[20px]">
                {favorites.map((f) => (
                  <li key={f.restaurant_id} className="w-[180px]">
                    <FavCard item={f} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* 섹션: 좋아한 잇터 컬렉션 */}
          <LikedCollections />
        </div>
      </div>

      {/* ─────────────────────────── 376–1279 : 프로필이 상단(마이페이지_1) */}
      <div className="mt-[64px] block max-[375px]:hidden xl:hidden">
        {/* 섹션: 프로필 헤더(가로 배치) */}
        <section aria-label="프로필 헤더" className="relative">
          {/* 커버 */}
          <div className="h-[180px] bg-[#F5F6F8]" />
          <Image
            src="/assets/icons/setting.svg"
            alt="setting"
            width={24}
            height={24}
            className="absolute right-2 top-2"
          />

          {/* ▼ 변경: flex → grid + 방어 레이아웃 */}
          <div className="relative -mt-[48px] grid items-end gap-4 max-[832px]:grid-cols-1 min-[833px]:grid-cols-[auto,1fr] min-[833px]:gap-6">
            {/* 왼쪽 프로필 블록 */}
            <div className="flex flex-col items-center gap-4 max-[832px]:gap-3 max-[832px]:pl-0 min-[833px]:pl-[60px]">
              <div className="h-[120px] w-[120px] overflow-hidden rounded-full shadow ring-4 ring-white">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="프로필"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-[#E5E5E5]" />
                )}
              </div>
              <div className="max-[832px]:text-center">
                <span className="inline-flex items-center rounded-[8px] bg-[#FFEDE5] px-3 py-1 text-[12px] font-semibold text-[#FA4D09]">
                  서울시 강서구
                </span>
                <p className="mt-2 text-[24px] font-bold text-[#171719]">
                  {user?.nickname ?? '게스트'}
                </p>
                <p className="mt-1 text-[14px] text-[#787882]">
                  팔로워 0&nbsp;&nbsp;팔로잉 0
                </p>
              </div>
            </div>

            {/* 오른쪽 카드 래퍼: wrap + 중앙 정렬 방어 */}
            <div className="flex flex-wrap gap-[10px] max-[900px]:justify-center min-[833px]:w-full min-[833px]:justify-end min-[833px]:pr-[30px]">
              {/* 작성한 리뷰 카드 */}
              <div className="flex w-full flex-col items-center justify-center rounded-[16px] border border-[#E6E7EA] bg-white p-[24px] min-[833px]:h-[160px] min-[833px]:w-[clamp(180px,40vw,244px)]">
                <p className="text-center text-[12px] text-[#8C8C8C]">
                  작성한 리뷰
                </p>
                <p className="mt-1 text-center text-[24px] font-extrabold text-[#171719]">
                  {reviewsCountData?.count || 0}
                </p>
                <Link
                  href="/mypage/review"
                  className="mt-2 inline-flex h-[41px] w-full items-center justify-center rounded-[10px] border px-[20px] py-[10px] text-[14px] font-medium text-[#171719]"
                >
                  리뷰 관리
                </Link>
              </div>

              {/* 내 포인트 카드 */}
              <div className="flex w-full flex-col items-center justify-center rounded-[16px] border border-[#E6E7EA] bg-white p-[24px] min-[833px]:h-[160px] min-[833px]:w-[clamp(180px,40vw,244px)]">
                <p className="text-center text-[12px] text-[#8C8C8C]">
                  내 포인트
                </p>
                <p className="mt-1 text-center text-[24px] font-extrabold text-[#171719]">
                  {currentPoints}P
                </p>
                <Link
                  href="/mypage/point"
                  className="mt-2 inline-flex h-[36px] w-full items-center justify-center rounded-[10px] bg-[#FA4D09] px-[20px] py-[10px] text-[14px] font-semibold text-white"
                >
                  포인트 상점
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 섹션: 맛집 캘린더 */}
        <section aria-label="맛집 캘린더" className="mt-8">
          <h2 className="text-[28px] font-bold text-[#171719]">맛집 캘린더</h2>
          <div className="mt-4">
            {isPending ? (
              <div className="grid grid-cols-7 gap-[2px]">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square animate-pulse rounded-[12px] bg-[#EEEEEE]"
                  />
                ))}
              </div>
            ) : (
              <FoodCalendar reviews={reviewData?.reviews ?? []} />
            )}
          </div>
        </section>

        {/* 섹션: 찜한 식당 (그리드) */}
        <section aria-label="찜한 식당" className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-[28px] font-bold text-[#171719]">찜한 식당</h2>
            <Link
              href="/mypage/favorites"
              className="text-[14px] text-[#787882]"
            >
              전체보기
            </Link>
          </div>

          {favLoading ? (
            <div className="mt-3 grid grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[160px] w-full animate-pulse rounded-[12px] bg-[#EEEEEE]"
                />
              ))}
            </div>
          ) : favError ? (
            <p className="mt-3 text-[14px] text-[#D14343]">
              불러오기 오류가 발생했어요.
            </p>
          ) : favorites.length === 0 ? (
            <p className="mt-3 text-[14px] text-[#787882]">
              아직 찜한 식당이 없어요.
            </p>
          ) : (
            <ul className="mt-3 grid grid-cols-5 gap-4">
              {favorites.map((f) => (
                <li key={f.restaurant_id}>
                  <FavCard item={f} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 섹션: 좋아한 잇터 컬렉션 */}
        <section aria-label="좋아한 잇터 컬렉션" className="mt-8">
          <LikedCollections />
        </section>
      </div>

      {/* ─────────────────────────── 모바일 ≤375 : 모바일 전용(마이페이지_2) */}
      <div className="mt-[16px] hidden max-[375px]:block">
        {/* 섹션: 프로필 헤더(스샷 맞춤) */}
        <section aria-label="프로필 헤더" className="relative">
          {/* 커버 */}
          <div className="h-[140px] bg-[#F5F6F8]" />
          <Image
            src="/assets/icons/setting.svg"
            alt="setting"
            width={24}
            height={24}
            className="absolute right-2 top-2"
          />
          {/* 아바타 + 텍스트 */}
          <div className="relative -mt-[48px] flex flex-col items-center">
            <div className="h-[96px] w-[96px] overflow-hidden rounded-full bg-[#E5E5E5] shadow ring-4 ring-white">
              {user?.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.profileImage}
                  alt="프로필"
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            <span className="mt-3 inline-flex items-center rounded-[8px] bg-[#FFEDE5] px-3 py-1 text-[12px] font-semibold text-[#FA4D09]">
              서울시 강서구
            </span>

            <p className="mt-2 text-[20px] font-bold text-[#171719]">
              {user?.nickname ?? '게스트'}
            </p>
            <p className="mt-1 text-[12px] text-[#787882]">
              팔로워 0&nbsp;&nbsp;팔로잉 0
            </p>
          </div>
        </section>

        {/* 리뷰/포인트 카드 & 버튼 */}
        <section className="mt-3">
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/mypage/review"
              className="flex h-[60px] items-center justify-center rounded-[12px] border border-[#C7C7CC]"
            >
              <div className="text-center">
                <p className="text-[16px] font-bold text-[#171719]">
                  {reviewsCountData?.count || 0}
                </p>
                <p className="text-[11px] text-[#787882]">리뷰 관리</p>
              </div>
            </Link>
            <Link
              href="/mypage/point"
              className="flex h-[60px] items-center justify-center rounded-[12px] border border-[#C7C7CC]"
            >
              <div className="text-center">
                <p className="text-[16px] font-bold text-[#171719]">
                  {currentPoints}P
                </p>
                <p className="text-[11px] text-[#787882]">내 포인트</p>
              </div>
            </Link>
          </div>

          <Link
            href="/mypage/store"
            className="mt-3 inline-flex h-[44px] w-full items-center justify-center rounded-[10px] bg-[#FA4D09] text-[16px] font-semibold text-white"
          >
            포인트 상점
          </Link>
        </section>

        {/* 섹션: 맛집 캘린더 */}
        <section aria-label="맛집 캘린더" className="mt-6">
          <h2 className="text-[16px] font-semibold text-[#FA4D09]">
            Local Eat
          </h2>
          <h3 className="mt-[6px] text-[20px] font-bold text-[#171719]">
            맛집 캘린더
          </h3>

          <div className="mt-3">
            {isPending ? (
              <div className="grid grid-cols-7 gap-[2px]">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square animate-pulse rounded-[8px] bg-[#EEEEEE]"
                  />
                ))}
              </div>
            ) : (
              <FoodCalendar reviews={reviewData?.reviews ?? []} />
            )}
          </div>
        </section>

        {/* 섹션: 찜한 식당(가로 스와이프) */}
        <section aria-label="찜한 식당" className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-[#171719]">찜한 식당</h2>
            <Link
              href="/mypage/favorites"
              className="text-[12px] text-[#787882]"
            >
              전체보기
            </Link>
          </div>

          {favLoading ? (
            <div className="mt-2 grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[140px] animate-pulse rounded-[12px] bg-[#EEEEEE]"
                />
              ))}
            </div>
          ) : favError ? (
            <p className="mt-2 text-[12px] text-[#D14343]">
              불러오기 오류가 발생했어요.
            </p>
          ) : favorites.length === 0 ? (
            <p className="mt-2 text-[12px] text-[#787882]">
              아직 찜한 식당이 없어요.
            </p>
          ) : (
            <div className="mt-2">
              <Swiper
                modules={[FreeMode]}
                freeMode={{ enabled: true, momentum: true }}
                grabCursor
                slidesPerView="auto"
                spaceBetween={12}
                resistanceRatio={0}
                nested
                wrapperTag="ul"
                className="w-full [&>.swiper-wrapper]:m-0 [&>.swiper-wrapper]:list-none [&>.swiper-wrapper]:p-0"
                style={{ touchAction: 'pan-x' }}
              >
                {favorites.map((f) => (
                  <SwiperSlide
                    key={f.restaurant_id}
                    tag="li"
                    className="!w-[140px]"
                  >
                    <FavCard item={f} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </section>

        {/* 섹션: 좋아한 잇터 컬렉션(1열 카드) */}
        <section aria-label="좋아한 잇터 컬렉션" className="mt-6">
          <LikedCollections mobile />
        </section>
      </div>
    </div>
  );
};

export default page;

/* ===== 내부 사용 컴포넌트 ===== */
function FavCard({ item }: { item: FavoriteRow }) {
  const href = `/restaurant/${item.restaurant_id}`;
  const name = item.snap_name || '이름 미상';
  const loc = item.snap_region || '';

  return (
    <Link href={href} prefetch={false} className="block">
      <div className="h-[180px] w-full overflow-hidden rounded-[12px] bg-[#CCCCCC] max-[375px]:h-[120px]">
        {item.snap_main_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.snap_main_image_url}
            alt={name}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="h-full w-full bg-[#CCCCCC]" />
        )}
      </div>
      <h3 className="mt-[8px] line-clamp-1 text-[16px] font-semibold text-[#171719] max-[375px]:text-[14px]">
        {name}
      </h3>
      <p className="mt-[4px] text-[14px] text-[#787882] max-[375px]:text-[12px]">
        {loc}
      </p>
    </Link>
  );
}

/* 좋아한 잇터 컬렉션 컴포넌트(PC/Tablet 공용, 모바일 옵션) */
function LikedCollections({ mobile = false }: { mobile?: boolean }) {
  return (
    <section>
      {/* 제목 */}
      <h2
        className={`font-bold text-[#171719] ${mobile ? 'text-[18px]' : 'text-[32px]'}`}
      >
        좋아한 잇터 컬렉션
      </h2>

      {/* 카드 리스트 */}
      <ul
        className={`pt-[12px] ${mobile ? 'flex flex-col gap-4' : 'flex gap-6 overflow-hidden'}`}
      >
        {[0, 1, 2, 3].map((i) => (
          <li key={i}>
            <div className="flex w-[282px] flex-col items-start overflow-hidden rounded-[20px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.15)] max-[375px]:w-full">
              <div className="relative w-full">
                <div className="flex flex-wrap gap-[2px] rounded-t-[20px] bg-[#FFFFFF] p-[3px]">
                  {[1, 2, 3, 4].map((_, index) => (
                    <div
                      key={index}
                      className={`flex aspect-[137/131] w-[calc(50%-1px)] items-center justify-center bg-[#E5E5E5] text-[12px] text-[#999999] ${cornerClasses[index]}`}
                    >
                      이미지 {index + 1}
                    </div>
                  ))}
                </div>
                <div className="absolute -bottom-[28px] left-1/2 z-10 -translate-x-1/2 rounded-full bg-[#FFFFFF] p-[4px]">
                  <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#E5E5E5] text-[12px] text-[#999999]">
                    프로필
                  </div>
                </div>
              </div>
              <div className="mt-[40px] flex w-full flex-col items-center gap-2 pb-4">
                <p className="text-[16px] font-semibold text-[#171719]">
                  장군쪼만
                </p>
                <p className="text-center text-[14px] text-[#8C8C8C] max-[375px]:px-3">
                  내가 가려고 만든 신림동 혼술 식당
                </p>
                <div className="flex items-center justify-center gap-2 text-[12px] text-[#8C8C8C]">
                  <span>좋아요 20</span>
                  <span className="h-[10px] w-[1px] bg-[#D9D9D9]" />
                  <span>댓글 130</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
