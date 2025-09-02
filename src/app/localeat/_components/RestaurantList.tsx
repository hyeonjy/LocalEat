import { LoginGuideModal } from '@/components/common/Modal';
import { useAuthStore } from '@/store/authStore';
import { TopRestaurantProps } from '@/types/restaurant';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<
    'sm' | 'md' | 'lg'
  >('lg');
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCurrentBreakpoint('lg');
      } else if (window.innerWidth >= 768) {
        setCurrentBreakpoint('md');
      } else {
        setCurrentBreakpoint('sm');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shouldShowButton = (reviewCount: number): boolean => {
    if (!reviewCount || reviewCount <= 1) return false;

    switch (currentBreakpoint) {
      case 'lg':
        return reviewCount > 3;
      case 'md':
        return reviewCount > 2;
      case 'sm':
        return reviewCount >= 2;
      default:
        return false;
    }
  };

  const handleOpenClick = (restaurantId: string) => {
    if (!user) {
      setIsGuideOpen(true);
      return;
    }

    router.push(`/restaurant/${restaurantId}/review/standard`);
  };

  const renderNavigationButtons = (
    restaurantId: string,
    reviewCount: number,
    isMobile: boolean,
  ) => {
    if (!shouldShowButton(reviewCount)) return null;

    return (
      <>
        <button
          id={`review-prev-${restaurantId}`}
          className={`absolute left-[-20px] ${isMobile ? 'top-1/2' : 'top-2/3'} z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[50%] bg-white shadow`}
          style={{ overflow: 'visible' }}
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
          id={`review-next-${restaurantId}`}
          className={`absolute right-[-20px] ${isMobile ? 'top-1/2' : 'top-2/3'} z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[50%] bg-white shadow`}
          style={{ overflow: 'visible' }}
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
    );
  };

  return (
    <>
      <ul className="mx-auto flex w-full flex-col gap-0 md:gap-[40px] lg:gap-[64px]">
        {restaurants.map((restaurant, index) => (
          <>
            <li
              key={restaurant.id}
              className="flex h-[769px] w-full flex-col border-t-[0.5px] border-[#C7C7CC] px-[16px] py-[24px] md:hidden"
            >
              <div className="flex items-center gap-[10px]">
                <span className="flex h-[29px] items-center justify-center gap-[10px] rounded-[4px] bg-[#FEEDE6] px-[6px] py-[4px] text-[16px] font-normal leading-[130%] text-[#FA4D09]">
                  {restaurant.address.split(' ')[1] || '지역'}
                </span>
                <span className="font-pretendard flex h-[29px] items-center justify-center gap-[10px] rounded-[4px] bg-[#E0F6F1] px-[6px] py-[4px] text-[16px] font-normal leading-[130%] text-[#004332]">
                  {restaurant.category.split(',')[0]}
                </span>
              </div>

              <Link
                href={`/restaurant/${restaurant.id}`}
                className="mt-[20px] flex h-[20px] cursor-pointer items-end gap-[10px] text-[20px] font-bold leading-[100%] text-[#171719] transition-colors hover:text-[#F98510]"
              >
                {isTopRated ? `${index + 1}. ` : ''}

                {restaurant.name}
                <span className="text-[10px] font-normal leading-[130%] text-[#787882]">
                  리뷰 {restaurant.review_count || 0}
                </span>
              </Link>

              <div className="mb-[20px] mt-[8px] h-[54px] overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-normal leading-[130%] text-[#47474D]">
                {restaurant.name}의 대표메뉴:
                {restaurant.menus && restaurant.menus.length > 0
                  ? restaurant.menus.slice(0, 3).map((menuName, idx) => (
                      <span key={idx} className="inline-block">
                        {menuName}
                        {idx < Math.min(restaurant.menus.length, 3) - 1 && ', '}
                      </span>
                    ))
                  : '메뉴 정보 준비 중'}
              </div>

              <div className="h-[277px] w-full flex-shrink-0 rounded-[20px]">
                {restaurant.image_url && (
                  <Image
                    src={restaurant.image_url}
                    alt={restaurant.name}
                    className="h-full w-full rounded-[20px] object-cover"
                    width={288}
                    height={277}
                  />
                )}
              </div>

              <div className="relative mt-[16px]">
                {/* 리뷰 슬라이더 */}
                <div className="relative w-full">
                  <Swiper
                    modules={[Navigation]}
                    navigation={{
                      prevEl: `#review-prev-${restaurant.id}`,
                      nextEl: `#review-next-${restaurant.id}`,
                    }}
                    slidesPerView="auto"
                    spaceBetween={isMounted ? 10 : 0}
                    loop={true}
                    className="flex w-full justify-start"
                  >
                    {restaurant.reviews && restaurant.reviews.length > 0 ? (
                      restaurant.reviews.map((review, reviewIdx) => (
                        <SwiperSlide
                          key={reviewIdx}
                          className={`h-[277px] !w-[198px] ${!isMounted ? 'mr-[10px]' : ''}`}
                        >
                          <div className="flex h-[277px] w-[198px] flex-col items-start gap-[12px] overflow-hidden">
                            <>
                              {review.photo && review.photo.image_url ? (
                                <Image
                                  src={review.photo.image_url}
                                  alt="리뷰 이미지"
                                  className="h-[237px] w-[198px] rounded-[16px] object-cover"
                                  width={198}
                                  height={237}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center rounded-[16px] bg-[#f0f0f0] text-[#999]">
                                  이미지 없음
                                </div>
                              )}
                            </>
                            <div className="flex w-full items-center justify-between">
                              <div className="flex items-center gap-[4.312px]">
                                <div className="h-[28px] w-[28px] rounded-[21.56px] bg-[#ccc]">
                                  {review.profile_image ? (
                                    <Image
                                      src={review.profile_image}
                                      alt="프로필"
                                      className="h-full w-full object-cover"
                                      width={28}
                                      height={28}
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
                    ) : (
                      // 리뷰가 없을 때 기본 placeholder 3개
                      <div className="flex h-[276px] flex-col items-center rounded-[20px] bg-[#FAFAFA] px-[20px] py-[69px]">
                        <p className="text-[32px] font-bold leading-[130%] text-black">
                          리뷰 준비중
                        </p>
                        <p className="mt-[10px] text-center text-[16px] font-normal leading-[130%] text-black">
                          소중한 한 끼, 어떠셨나요? 리뷰를 남겨주시면 리워드도
                          드려요! 🤗
                        </p>
                        <button
                          onClick={() =>
                            handleOpenClick(restaurant.id.toString())
                          }
                          className="mt-[24px] flex h-[41px] w-[220px] items-center justify-center gap-[4px] rounded-[8px] bg-[#FA4D09] px-[20px] py-[10px] text-white"
                        >
                          <span className="text-[16px] font-normal leading-[130%]">
                            리뷰 작성하기
                          </span>
                          <Image
                            src="/assets/icons/arrow-right.svg"
                            alt="다음"
                            width={20}
                            height={20}
                          />
                        </button>
                      </div>
                    )}
                  </Swiper>
                </div>

                {/* 리뷰 슬라이더 네비게이션 버튼 */}
                {renderNavigationButtons(
                  restaurant.id.toString(),
                  restaurant.review_count || 0,
                  true,
                )}
              </div>
            </li>

            {/* tablet, desktop */}
            <li
              key={restaurant.id}
              className="hidden h-[436px] w-full gap-[46px] md:flex lg:h-[430px] lg:gap-[49px]"
            >
              <div className="!h-[436px] !w-[403px] flex-shrink-0 rounded-[20px] bg-[#ccc] lg:!h-[430px] lg:!w-[537px]">
                {restaurant.image_url && (
                  <Image
                    src={restaurant.image_url}
                    alt={restaurant.name}
                    className="h-full w-full rounded-[20px] object-cover"
                    width={537}
                    height={430}
                  />
                )}
              </div>

              <div className="relative w-[calc(100%-449px)] lg:w-[calc(100%-586px)]">
                <div className="w-full overflow-hidden">
                  <div className="flex items-center gap-[10px]">
                    <span className="flex h-[29px] items-center justify-center gap-[10px] rounded-[4px] bg-[#FEEDE6] px-[6px] py-[4px] text-[16px] font-normal leading-[130%] text-[#FA4D09]">
                      {restaurant.address.split(' ')[1] || '지역'}
                    </span>
                    <span className="font-pretendard flex h-[29px] items-center justify-center gap-[10px] rounded-[4px] bg-[#E0F6F1] px-[6px] py-[4px] text-[16px] font-normal leading-[130%] text-[#004332]">
                      {restaurant.category.split(',')[0]}
                    </span>
                  </div>
                  <Link
                    href={`/restaurant/${restaurant.id}`}
                    className="font-pretendard mt-[12px] flex h-[31px] cursor-pointer items-end gap-[10px] text-[24px] font-semibold leading-[130%] tracking-[-0.85px] text-[#171719] transition-colors hover:text-[#F98510] lg:h-[34px] lg:text-[34px] lg:leading-[100%]"
                  >
                    {isTopRated ? `${index + 1}. ` : ''}

                    {restaurant.name}
                    <span className="font-[Pretendard] text-[12px] font-normal leading-[130%] text-[#787882] lg:text-[14px] lg:leading-[100%]">
                      리뷰 {restaurant.review_count || 0}
                    </span>
                  </Link>
                  <div className="mb-[16px] mt-[8px] h-[63px] overflow-hidden text-ellipsis whitespace-nowrap font-[Pretendard] text-[16px] font-normal leading-[130%] text-[#47474D] lg:mb-[20px] lg:mt-[16px] lg:h-[42px]">
                    {restaurant.name}의 대표메뉴:
                    {restaurant.menus && restaurant.menus.length > 0
                      ? restaurant.menus.slice(0, 3).map((menuName, idx) => (
                          <span key={idx} className="inline-block">
                            {menuName}
                            {idx < Math.min(restaurant.menus.length, 3) - 1 &&
                              ', '}
                          </span>
                        ))
                      : '메뉴 정보 준비 중'}
                  </div>

                  {/* 리뷰 슬라이더 */}
                  <div className="w-full">
                    <Swiper
                      modules={[Navigation]}
                      navigation={{
                        prevEl: `#review-prev-${restaurant.id}`,
                        nextEl: `#review-next-${restaurant.id}`,
                      }}
                      slidesPerView="auto"
                      spaceBetween={isMounted ? 10 : 0}
                      loop={true}
                      className="flex w-full justify-start"
                    >
                      {restaurant.reviews && restaurant.reviews.length > 0 ? (
                        restaurant.reviews.map((review, reviewIdx) => (
                          <SwiperSlide
                            key={reviewIdx}
                            className={`!h-[277px] !w-[198px] ${!isMounted ? 'mr-[10px]' : ''}`}
                          >
                            <div className="flex h-[277px] w-[198px] flex-col items-start gap-[12px] overflow-hidden">
                              <>
                                {review.photo && review.photo.image_url ? (
                                  <Image
                                    src={review.photo.image_url}
                                    alt="리뷰 이미지"
                                    className="h-[237px] w-[198px] rounded-[16px] object-cover"
                                    width={198}
                                    height={237}
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center rounded-[16px] bg-[#f0f0f0] text-[#999]">
                                    이미지 없음
                                  </div>
                                )}
                              </>
                              <div className="flex w-full items-center justify-between">
                                <div className="flex items-center gap-[4.312px]">
                                  <div className="h-[28px] w-[28px] rounded-[21.56px] bg-[#ccc]">
                                    {review.profile_image ? (
                                      <Image
                                        src={review.profile_image}
                                        alt="프로필"
                                        className="h-full w-full object-cover"
                                        width={28}
                                        height={28}
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
                      ) : (
                        // 리뷰가 없을 때 기본 placeholder 3개
                        <div className="flex h-[276px] flex-col items-center rounded-[20px] bg-[#FAFAFA] px-[20px] py-[69px]">
                          <p className="text-[32px] font-bold leading-[130%] text-black">
                            리뷰 준비중
                          </p>
                          <p className="mt-[10px] text-center text-[16px] font-normal leading-[130%] text-black">
                            소중한 한 끼, 어떠셨나요? 리뷰를 남겨주시면 리워드도
                            드려요! 🤗
                          </p>
                          <button
                            onClick={() =>
                              handleOpenClick(restaurant.id.toString())
                            }
                            className="mt-[24px] flex h-[41px] w-[220px] items-center justify-center gap-[4px] rounded-[8px] bg-[#FA4D09] px-[20px] py-[10px] text-white"
                          >
                            <span className="text-[16px] font-normal leading-[130%]">
                              리뷰 작성하기
                            </span>
                            <Image
                              src="/assets/icons/arrow-right.svg"
                              alt="다음"
                              width={20}
                              height={20}
                            />
                          </button>
                        </div>
                      )}
                    </Swiper>
                  </div>

                  {/* 리뷰 슬라이더 네비게이션 버튼 */}
                  {renderNavigationButtons(
                    restaurant.id.toString(),
                    restaurant.review_count || 0,
                    false,
                  )}
                </div>
              </div>
            </li>
          </>
        ))}
      </ul>

      <LoginGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onGoBack={() => setIsGuideOpen(false)}
        onGoToLogin={() => {
          setIsGuideOpen(false);
          router.push('/signin');
        }}
      />
    </>
  );
};

export default RestaurantList;
