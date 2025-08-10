import { TopRestaurantProps } from '@/types/restaurant';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type RestaurantListProps = {
  restaurants: TopRestaurantProps[];
  isTopRated: boolean;
};

const RestaurantList = ({ restaurants, isTopRated }: RestaurantListProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <ul className="mx-auto mt-[15px] flex w-[1200px] flex-col gap-[64px]">
      {restaurants.map((restaurant, index) => (
        <li key={restaurant.id} className="flex h-[426px] gap-[46px]">
          <div className="w-[519px] rounded-[20px] bg-[#ccc]">
            {restaurant.image_url && (
              <img
                src={restaurant.image_url}
                alt={restaurant.name}
                className="h-full w-full rounded-[20px] object-cover"
              />
            )}
          </div>
          <div className="w-[635px]">
            <div className="flex items-center gap-[10px]">
              <span className="font-pretendard flex items-center justify-center gap-[10px] rounded-[4px] bg-[#FEEDE6] px-[6px] py-[4px] text-[16px] font-normal leading-[130%] text-[#FA4D09]">
                {restaurant.address.split(' ')[1] || '지역'}
              </span>
              <span className="font-pretendard flex items-center justify-center gap-[10px] rounded-[4px] bg-[#E0F6F1] px-[6px] py-[4px] text-[16px] font-normal leading-[130%] text-[#004332]">
                {restaurant.category}
              </span>
            </div>
            <Link
              href={`/restaurant/${restaurant.id}`}
              className="font-pretendard flex cursor-pointer items-center gap-[10px] pt-[10px] text-[34px] font-semibold leading-[140%] tracking-[-0.85px] text-[#171719] transition-colors hover:text-[#F98510]"
            >
              {isTopRated ? `${index + 1}. ` : ''}

              {restaurant.name}
              <span className="font-[Pretendard] text-[14px] font-normal leading-[100%] text-[#787882]">
                리뷰 {restaurant.review_count || 0}
              </span>
            </Link>
            <p className="pt-[10px] font-[Pretendard] text-[16px] font-normal leading-[130%] text-[#47474D]">
              {restaurant.name}의 대표메뉴:
              {restaurant.menus && restaurant.menus.length > 0
                ? restaurant.menus.slice(0, 3).map((menuName, idx) => (
                    <span key={idx}>
                      {menuName}
                      {idx < Math.min(restaurant.menus.length, 3) - 1 && ', '}
                    </span>
                  ))
                : '메뉴 정보 준비 중'}
            </p>

            {/* 리뷰 슬라이더 */}
            <div className="relative w-[611px] pt-[10px]">
              <Swiper
                modules={[Navigation]}
                navigation={{
                  prevEl: `#review-prev-${restaurant.id}`,
                  nextEl: `#review-next-${restaurant.id}`,
                }}
                slidesPerView="auto"
                spaceBetween={isMounted ? 10 : 0}
                loop={true}
              >
                {restaurant.reviews && restaurant.reviews.length > 0
                  ? restaurant.reviews.map((review, reviewIdx) => (
                      <SwiperSlide
                        key={reviewIdx}
                        className={`!h-[277px] !w-[197px] ${!isMounted ? 'mr-[10px]' : ''}`}
                      >
                        <div className="flex h-[277px] w-[197px] flex-col items-start gap-[12px]">
                          <div className="h-[237px] w-full rounded-[16px] bg-[#ccc]">
                            {review.photo && review.photo.image_url ? (
                              <img
                                src={review.photo.image_url}
                                alt="리뷰 이미지"
                                className="h-full w-full rounded-[16px] object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center rounded-[16px] bg-[#f0f0f0] text-[#999]">
                                이미지 없음
                              </div>
                            )}
                          </div>
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center gap-[4.312px]">
                              <div className="h-[28px] w-[28px] overflow-hidden rounded-[21.56px] bg-[#ccc]">
                                {review.profile_image ? (
                                  <img
                                    src={review.profile_image}
                                    alt="프로필"
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-[#ddd]" />
                                )}
                              </div>
                              <p className="max-w-[61px] overflow-hidden text-ellipsis whitespace-nowrap font-[Pretendard] text-[14px] font-semibold leading-[130%] text-[#171719]">
                                {review.nickname || '익명'}
                              </p>
                            </div>
                            <div className="font-[Pretendard] text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#5F5F68]">
                              {review.visited_at
                                ? new Date(
                                    review.visited_at,
                                  ).toLocaleDateString('ko-KR', {
                                    month: 'numeric',
                                    day: 'numeric',
                                  })
                                : '최근 방문'}
                              {review.visit_count &&
                                ` • ${review.visit_count}번째 방문`}
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                  : // 리뷰가 없을 때 기본 placeholder 3개
                    Array.from({ length: 3 }, (_, idx) => (
                      <SwiperSlide
                        key={idx}
                        className={`!h-[277px] !w-[197px] ${!isMounted ? 'mr-[10px]' : ''}`}
                      >
                        <div className="flex h-[277px] w-[197px] flex-col items-start gap-[12px]">
                          <div className="flex h-[237px] w-full items-center justify-center rounded-[16px] bg-[#ccc] text-[#999]">
                            리뷰 준비 중
                          </div>
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center gap-[4.312px]">
                              <div className="h-[28px] w-[28px] rounded-[21.56px] bg-[#ccc]" />
                              <p className="max-w-[61px] overflow-hidden text-ellipsis whitespace-nowrap font-[Pretendard] text-[14px] font-semibold leading-[130%] text-[#171719]">
                                리뷰어
                              </p>
                            </div>
                            <div className="font-[Pretendard] text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#5F5F68]">
                              최근 방문
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
              </Swiper>

              {/* 리뷰 슬라이더 네비게이션 버튼 */}
              {restaurant.reviews && restaurant.reviews.length > 3 && (
                <>
                  <button
                    id={`review-prev-${restaurant.id}`}
                    className="absolute left-[-20px] top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[50%] bg-white shadow"
                  >
                    <Image
                      src="/assets/icons/arrow_left.svg"
                      className="h-[24px] w-[24px]"
                      width={24}
                      height={24}
                      alt="이전"
                    />
                  </button>
                  <button
                    id={`review-next-${restaurant.id}`}
                    className="absolute right-[-20px] top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[50%] bg-white shadow"
                  >
                    <Image
                      src="/assets/icons/arrow_right.svg"
                      className="h-[24px] w-[24px]"
                      width={24}
                      height={24}
                      alt="다음"
                    />
                  </button>
                </>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RestaurantList;
