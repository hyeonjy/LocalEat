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

  // 포인트 / 리뷰 카운트 / 캘린더
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

  // ✅ 찜한 식당 목록 불러오기
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
        headers: {
          ...(userId ? { 'x-user-id': String(userId) } : {}), // 개발/프록시용
        },
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
    <div>
      <div className="mx-auto mt-[113px] flex w-[1200px] gap-[126px]">
        {/* ===== 왼쪽 사이드 ===== */}
        <aside className="flex w-[282px] flex-col items-start gap-[20px]">
          <div className="flex w-[282px] gap-[49px]">
            <div className="relative flex w-full items-center gap-[17px]">
              <div className="aspect-square h-[80px] w-[80px] overflow-hidden rounded-full bg-[#ccc]">
                {user?.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.profileImage} alt="프로필" />
                ) : (
                  <div className="h-full w-full rounded-full bg-gray-300" />
                )}
              </div>
              <div>
                <p className="self-stretch text-[20px] font-bold leading-[100%] text-[#171719]">
                  {user?.nickname ?? '게스트'}
                </p>
                <span className="mr-2 text-[14px] font-normal leading-[100%] text-[#171719]">
                  팔로워 0
                </span>
                <span className="text-[14px] font-normal leading-[100%] text-[#171719]">
                  팔로잉 0
                </span>
              </div>
              <Image
                src="/assets/icons/setting.svg"
                alt="setting"
                width={24}
                height={24}
                className="absolute right-0 top-0"
              />
            </div>
          </div>

          <div className="flex h-[54px] w-full justify-between self-stretch rounded-[12px] border border-[#C7C7CC]">
            <Link
              href="/mypage/point"
              className="my-[9px] flex w-[50%] flex-col justify-center border-r border-r-[#ccc]"
            >
              <p className="text-center text-[16px] font-bold leading-[130%] tracking-[0.16px] text-[#171719]">
                {currentPoints}P
              </p>
              <span className="text-center text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#171719]">
                내 포인트
              </span>
            </Link>
            <Link
              href="/mypage/review"
              className="my-[9px] flex w-[50%] flex-col justify-center"
            >
              <p className="text-center text-[16px] font-bold leading-[130%] tracking-[0.16px] text-[#171719]">
                {reviewsCountData?.count || 0}
              </p>
              <span className="text-center text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#171719]">
                내 기록
              </span>
            </Link>
          </div>

          <Link
            href="/mypage/store"
            className="flex h-[50px] items-center justify-center gap-[8px] self-stretch rounded-[10px] bg-[#FA4D09] px-[24px] py-[10px] text-center text-[20px] font-semibold leading-[150%] text-white"
          >
            포인트 상점 구경하기
          </Link>
        </aside>

        {/* ===== 오른쪽 컨텐츠 ===== */}
        <div>
          {/* 맛집 캘린더 */}
          <section>
            <h2 className="text-[32px] font-bold">맛집 캘린더</h2>
            {isPending ? (
              <div className="mt-4 grid w-[770px] grid-cols-7 gap-[2px]">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[110px] w-[110px] animate-pulse rounded-[12px] bg-[#eee]"
                  />
                ))}
              </div>
            ) : (
              <FoodCalendar reviews={reviewData?.reviews ?? []} />
            )}
          </section>

          {/* 찜한 식당 */}
          <section className="my-[20px]">
            <h2 className="text-[32px] font-bold leading-[130%] tracking-[-0.48px] text-[#171719]">
              찜한 식당
            </h2>

            {!user ? (
              <p className="mt-[12px] text-[14px] text-[#787882]">
                로그인 후 찜 목록을 볼 수 있어요.
              </p>
            ) : favLoading ? (
              <div className="mt-[12px] grid grid-cols-4 gap-[20px]">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-[180px]">
                    <div className="h-[180px] w-full animate-pulse rounded-[12px] bg-[#eee]" />
                    <div className="mt-[8px] h-[18px] w-[150px] animate-pulse rounded bg-[#eee]" />
                    <div className="mt-[4px] h-[16px] w-[90px] animate-pulse rounded bg-[#eee]" />
                  </div>
                ))}
              </div>
            ) : favError ? (
              <p className="mt-[12px] text-[14px] text-red-600">
                불러오기 오류가 발생했어요.
              </p>
            ) : favorites.length === 0 ? (
              <p className="mt-[12px] text-[14px] text-[#787882]">
                아직 찜한 식당이 없어요.
              </p>
            ) : (
              <>
                {/* Mobile (≤md): Swiper 가로 드래그 */}
                <div className="mt-[12px] md:hidden">
                  <Swiper
                    modules={[FreeMode]}
                    freeMode={{ enabled: true, momentum: true }}
                    grabCursor
                    allowTouchMove
                    slidesPerView="auto"
                    spaceBetween={20}
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
                    {favorites.map((f) => (
                      <SwiperSlide
                        tag="li"
                        key={f.restaurant_id}
                        className="!w-[180px] shrink-0 list-none"
                      >
                        <FavCard item={f} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* Desktop (≥md): 4열 그리드 */}
                <ul className="mt-[12px] hidden grid-cols-4 gap-[20px] md:grid">
                  {favorites.map((f) => (
                    <li key={f.restaurant_id} className="w-[180px] flex-shrink-0">
                      <FavCard item={f} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          {/* 좋아한 잇터 컬렉션 — 그대로 유지 */}
          <section>
            <h2 className="text-[32px] font-bold leading-[130%] tracking-[-0.48px] text-[#171719]">
              좋아한 잇터 컬렉션
            </h2>
            <ul className="flex w-[100%] gap-6 pt-[12px]">
              <li>
                <div className="flex w-[282px] flex-col items-start overflow-hidden rounded-[20px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.15)]">
                  <div className="relative w-full">
                    <div className="flex flex-wrap gap-[2px] self-stretch rounded-t-[20px] bg-[#FFFFFF] p-[3px]">
                      {[1, 2, 3, 4].map((_, index) => (
                        <div
                          key={index}
                          className={`flex aspect-[137/131] w-[calc(50%-1px)] items-center justify-center bg-[#E5E5E5] text-[12px] text-[#999999] ${cornerClasses[index]}`}
                        >
                          이미지 {index + 1}
                        </div>
                      ))}
                    </div>
                    <div className="absolute -bottom-[28px] left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full bg-[#FFFFFF] p-[4px]">
                      <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#E5E5E5] text-[12px] text-[#999999]">
                        프로필
                      </div>
                    </div>
                  </div>
                  <div className="mt-[40px] flex w-full flex-col items-center gap-2 pb-4">
                    <p className="text-[16px] font-semibold text-[#171719]">
                      장군쪼만
                    </p>
                    <p className="text-center text-[14px] text-[#8C8C8C]">
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
              {/* 나머지 예시 3개는 그대로 */}
              <li>
                <div className="flex w-[282px] flex-col items-start overflow-hidden rounded-[20px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.15)]">
                  <div className="relative w-full">
                    <div className="flex flex-wrap gap-[2px] self-stretch rounded-t-[20px] bg-[#FFFFFF] p-[3px]">
                      {[1, 2, 3, 4].map((_, index) => (
                        <div
                          key={index}
                          className={`flex aspect-[137/131] w-[calc(50%-1px)] items-center justify-center bg-[#E5E5E5] text-[12px] text-[#999999] ${cornerClasses[index]}`}
                        >
                          이미지 {index + 1}
                        </div>
                      ))}
                    </div>
                    <div className="absolute -bottom-[28px] left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full bg-[#FFFFFF] p-[4px]">
                      <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#E5E5E5] text-[12px] text-[#999999]">
                        프로필
                      </div>
                    </div>
                  </div>
                  <div className="mt-[40px] flex w-full flex-col items-center gap-2 pb-4">
                    <p className="text-[16px] font-semibold text-[#171719]">
                      장군쪼만
                    </p>
                    <p className="text-center text-[14px] text-[#8C8C8C]">
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
              <li>
                <div className="flex w-[282px] flex-col items-start overflow-hidden rounded-[20px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.15)]">
                  <div className="relative w-full">
                    <div className="flex flex-wrap gap-[2px] self-stretch rounded-t-[20px] bg-[#FFFFFF] p-[3px]">
                      {[1, 2, 3, 4].map((_, index) => (
                        <div
                          key={index}
                          className={`flex aspect-[137/131] w-[calc(50%-1px)] items-center justify-center bg-[#E5E5E5] text-[12px] text-[#999999] ${cornerClasses[index]}`}
                        >
                          이미지 {index + 1}
                        </div>
                      ))}
                    </div>
                    <div className="absolute -bottom-[28px] left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full bg-[#FFFFFF] p-[4px]">
                      <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#E5E5E5] text-[12px] text-[#999999]">
                        프로필
                      </div>
                    </div>
                  </div>
                  <div className="mt-[40px] flex w-full flex-col items-center gap-2 pb-4">
                    <p className="text-[16px] font-semibold text-[#171719]">
                      장군쪼만
                    </p>
                    <p className="text-center text-[14px] text-[#8C8C8C]">
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
              <li>
                <div className="flex w-[282px] flex-col items-start overflow-hidden rounded-[20px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.15)]">
                  <div className="relative w-full">
                    <div className="flex flex-wrap gap-[2px] self-stretch rounded-t-[20px] bg-[#FFFFFF] p-[3px]">
                      {[1, 2, 3, 4].map((_, index) => (
                        <div
                          key={index}
                          className={`flex aspect-[137/131] w-[calc(50%-1px)] items-center justify-center bg-[#E5E5E5] text-[12px] text-[#999999] ${cornerClasses[index]}`}
                        >
                          이미지 {index + 1}
                        </div>
                      ))}
                    </div>
                    <div className="absolute -bottom-[28px] left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full bg-[#FFFFFF] p-[4px]">
                      <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#E5E5E5] text-[12px] text-[#999999]">
                        프로필
                      </div>
                    </div>
                  </div>
                  <div className="mt-[40px] flex w-full flex-col items-center gap-2 pb-4">
                    <p className="text-[16px] font-semibold text-[#171719]">
                      장군쪼만
                    </p>
                    <p className="text-center text-[14px] text-[#8C8C8C]">
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
            </ul>
          </section>
        </div>
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
      <div className="h-[180px] w-full self-stretch overflow-hidden rounded-[12px] bg-[#ccc]">
        {item.snap_main_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.snap_main_image_url}
            alt={name}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="h-full w-full bg-[#ccc]" />
        )}
      </div>
      <h3 className="mt-[8px] line-clamp-1 self-stretch text-[16px] font-semibold leading-[130%] tracking-[0.16px] text-[#171719]">
        {name}
      </h3>
      <p className="mt-[4px] self-stretch text-[14px] font-normal leading-[130%] text-[#787882]">
        {loc}
      </p>
    </Link>
  );
}
