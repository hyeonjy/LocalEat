'use client';

import { getUserReviewsCount } from '@/app/actions/user';
import PointUseModal from '@/components/ui/PointUseModal';
import { couponCategories } from '@/constants/couponCategories';
import { useUserPoints } from '@/hooks/usePoint';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const Store = () => {
  const [swiperStates, setSwiperStates] = useState<{
    [key: number]: { isBeginning: boolean; isEnd: boolean };
  }>({});
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    selectedCoupon: any;
  }>({
    isOpen: false,
    selectedCoupon: null,
  });

  const { user } = useAuthStore();

  const { data: pointsData, isPending: pointsLoading } = useUserPoints(
    user?.id.toString() || '',
  );
  const { data: reviewsCountData, isPending: reviewsCountLoading } = useQuery({
    queryKey: ['reviewsCount'],
    queryFn: () => getUserReviewsCount(user?.id.toString() || ''),
  });

  const currentPoints = pointsData?.totalPoints || 0;

  const handleSwiperChange = (categoryIndex: number, swiper: any) => {
    setSwiperStates(
      (prev: { [key: number]: { isBeginning: boolean; isEnd: boolean } }) => ({
        ...prev,
        [categoryIndex]: {
          isBeginning: swiper.isBeginning,
          isEnd: swiper.isEnd,
        },
      }),
    );
  };

  const handleOpenModal = (coupon: any) => {
    setModalState({
      isOpen: true,
      selectedCoupon: coupon,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      selectedCoupon: null,
    });
  };

  if (pointsLoading || reviewsCountLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="mx-auto mt-[113px] flex w-full max-w-[1200px] gap-[40px] px-4">
        <aside className="hidden w-[282px] gap-[20px] xl:flex xl:flex-col xl:items-start">
          <div className="flex w-[282px] gap-[49px]">
            <div className="relative flex w-full items-center gap-[17px]">
              <div className="h-[80px] w-[80px] rounded-full bg-[#E2E2E4]">
                <Image
                  src={user?.profileImage || ''}
                  alt="프로필 이미지"
                  width={80}
                  height={80}
                />
              </div>
              <div>
                <p className="self-stretch text-[20px] font-bold leading-[100%] text-[#171719]">
                  {user?.nickname || ''}
                </p>
                <span className="text-[14px] font-normal leading-[100%] text-[#171719]">
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
            <div className="my-[9px] flex w-[50%] flex-col justify-center border-r border-r-[#ccc]">
              <p className="text-center text-[16px] font-bold leading-[130%] tracking-[0.16px] text-[#171719]">
                {currentPoints}P
              </p>
              <span className="text-center text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#171719]">
                내 포인트
              </span>
            </div>
            <div className="my-[9px] flex w-[50%] flex-col justify-center">
              <p className="text-center text-[16px] font-bold leading-[130%] tracking-[0.16px] text-[#171719]">
                {reviewsCountData.count || 0}
              </p>
              <span className="text-center text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#171719]">
                내 기록
              </span>
            </div>
          </div>
          <Link
            href="/mypage/point"
            className="flex h-[50px] items-center justify-center gap-[8px] self-stretch rounded-[10px] bg-[#FA4D09] px-[24px] py-[10px] text-center text-[20px] font-semibold leading-[150%] text-white"
          >
            <p>포인트 사용 내역 확인</p>
            <Image
              src="/assets/icons/arrow_right_white.svg"
              alt="arrow_right"
              width={24}
              height={24}
            />
          </Link>
        </aside>

        <div className="w-full space-y-[40px]">
          <div className="flex w-full flex-row gap-[50px] px-[40px] xl:w-full xl:flex-col xl:gap-0 xl:px-0">
            <aside className="flex w-full flex-col items-start md:w-[282px] md:gap-[20px] xl:hidden">
              <div className="flex w-full gap-[49px] md:w-[282px]">
                <div className="relative flex w-full items-center gap-[17px]">
                  <div className="h-[80px] w-[80px] rounded-full bg-[#E2E2E4]">
                    <Image
                      src={user?.profileImage || ''}
                      alt="프로필 이미지"
                      width={80}
                      height={80}
                    />
                  </div>
                  <div>
                    <p className="self-stretch text-[20px] font-bold leading-[100%] text-[#171719]">
                      {user?.nickname || ''}
                    </p>
                    <span className="text-[14px] font-normal leading-[100%] text-[#171719]">
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
                    className="absolute right-1 top-1"
                  />
                </div>
              </div>

              <div className="mt-[20px] flex h-[54px] w-full justify-between self-stretch rounded-[12px] border border-[#C7C7CC] md:mt-0">
                <div className="my-[9px] flex w-[50%] flex-col justify-center border-r border-r-[#ccc]">
                  <p className="text-center text-[16px] font-bold leading-[130%] tracking-[0.16px] text-[#171719]">
                    {currentPoints}P
                  </p>
                  <span className="text-center text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#171719]">
                    내 포인트
                  </span>
                </div>
                <div className="my-[9px] flex w-[50%] flex-col justify-center">
                  <p className="text-center text-[16px] font-bold leading-[130%] tracking-[0.16px] text-[#171719]">
                    {reviewsCountData.count || 0}
                  </p>
                  <span className="text-center text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#171719]">
                    내 기록
                  </span>
                </div>
              </div>
              <div className="mt-[4px] flex w-full items-center justify-end gap-1 md:hidden">
                <Image
                  src="/assets/icons/info2.svg"
                  alt="info-icon"
                  width={8.333}
                  height={8.333}
                />
                <p className="text-[10px] font-normal leading-[100%] text-[#92929B]">
                  포인트는 어떻게 모으나요?
                </p>
              </div>

              <Link
                href="/mypage/point"
                className="mt-[20px] flex h-[50px] items-center justify-center gap-[8px] self-stretch rounded-[10px] bg-[#FA4D09] px-[24px] py-[10px] text-center text-[20px] font-semibold leading-[150%] text-white md:mt-0"
              >
                <p>포인트 사용 내역 확인</p>
                <Image
                  src="/assets/icons/arrow_right_white.svg"
                  alt="arrow_right"
                  width={24}
                  height={24}
                />
              </Link>
            </aside>

            <section className="hidden w-full rounded-[20px] border border-[#E2E2E4] px-[40px] pb-[36px] pt-[40px] md:block xl:w-auto xl:max-w-[878px]">
              <h1 className="mb-[41px] border-b border-[#F0F0F0] pb-[22px] text-[16px] font-bold leading-[130%] text-[#171719]">
                <span className="mr-2 text-[30px] leading-[100%]">
                  {user?.nickname || ''}
                </span>
                님의 포인트
              </h1>
              <div className="flex h-[78px] items-end gap-[6px]">
                <span className="text-[60px] font-bold leading-[130%] text-[#004332]">
                  {currentPoints}P
                </span>
                <div className="hidden items-center gap-1 pb-[12px] text-[#5F5F68] min-[936px]:flex">
                  <Image
                    src="/assets/icons/error_outline.svg"
                    alt="point_icon"
                    width={24}
                    height={24}
                  />
                  <span className="text-[16px] font-bold leading-[130%]">
                    포인트는 어떻게 모으나요?
                  </span>
                </div>
              </div>
            </section>
          </div>

          <section className="w-full px-[40px] xl:max-w-[878px] xl:px-0">
            <div className="flex h-[126px] flex-col items-center gap-[4px] px-[16px] py-[40px] md:mb-[40px] md:h-auto md:items-start md:p-0">
              <p className="block text-[16px] font-semibold leading-[150%] text-[#FA4D09] md:hidden">
                Point Shop
              </p>
              <h1 className="text-[24px] font-bold leading-[130%] md:text-[32px]">
                포인트 상점
              </h1>
            </div>

            {/* 쿠폰 교환 섹션들 */}
            <div className="w-full space-y-[16px] md:space-y-[40px] xl:max-w-[878px]">
              {couponCategories.map((category, categoryIndex) => (
                <div
                  key={categoryIndex}
                  className="w-full space-y-[20px] xl:max-w-[878px]"
                >
                  <h2 className="text-[16px] font-bold leading-[130%] text-[#171719] md:text-[20px]">
                    {category.title}
                  </h2>

                  <div className="relative w-full">
                    <div className="w-full">
                      <Swiper
                        modules={[Navigation]}
                        navigation={{
                          nextEl: `.swiper-button-next-${categoryIndex}`,
                          prevEl: `.swiper-button-prev-${categoryIndex}`,
                        }}
                        spaceBetween={32}
                        slidesPerView="auto"
                        slidesPerGroup={1}
                        // loop={true}
                        watchSlidesProgress={true}
                        className="h-auto !overflow-x-hidden"
                        observer={true}
                        observeParents={true}
                        onSlideChange={(swiper) =>
                          handleSwiperChange(categoryIndex, swiper)
                        }
                        onSwiper={(swiper) =>
                          handleSwiperChange(categoryIndex, swiper)
                        }
                        style={{
                          paddingTop: '1px',
                          paddingBottom: '1px',
                        }}
                      >
                        {category.items.map((item, itemIndex) => (
                          <SwiperSlide key={item.id} className="!w-auto">
                            <div className="h-[244px] w-[155px] rounded-[20px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)] md:h-[395px] md:w-[284px]">
                              <div className="flex h-[155px] w-[155px] items-center justify-center rounded-t-[20px] bg-[#F5F5F8] md:h-[284px] md:w-[284px]">
                                <div className="relative">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={218}
                                    height={138}
                                    className="h-[75px] w-[118px] md:h-[138px] md:w-[218px]"
                                  />
                                  <p className="absolute right-[10px] top-[55px] whitespace-nowrap text-[10px] font-bold text-white md:right-[10px] md:top-[110px] md:text-[15px]">
                                    {item.amount}원
                                  </p>
                                </div>
                              </div>

                              <div className="flex h-[89px] w-full flex-col gap-2 rounded-b-[20px] p-3 md:h-[111px] md:gap-3">
                                <p className="text-[14px] font-semibold leading-[130%] text-[#171719] md:text-[20px]">
                                  {item.name}
                                </p>

                                <div className="flex items-center gap-[12px]">
                                  <div className="h-[14px] w-[71px] rounded-[7px] bg-[#E2E2E4] md:w-[193px]">
                                    <div
                                      className="h-full rounded-[7px] bg-[#3CDD4C]"
                                      style={{
                                        width: `${Math.min((currentPoints / item.amount) * 100, 100)}%`,
                                      }}
                                    />
                                  </div>
                                  <p className="whitespace-nowrap text-[14px] font-bold leading-[130%] text-[#171719] md:text-[16px]">
                                    {currentPoints < item.amount
                                      ? currentPoints
                                      : item.amount}{' '}
                                    P
                                  </p>
                                </div>

                                <button
                                  onClick={() => handleOpenModal(item)}
                                  className="text-start text-[10px] font-normal leading-[130%] text-[#787882] transition-colors hover:text-[#FA4D09] md:text-[12px]"
                                >
                                  지금 바꾸러 가기 →
                                </button>
                              </div>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>

                    {/* 네비게이션 버튼들 */}
                    <button
                      className={`swiper-button-prev-${categoryIndex} absolute left-[-20px] top-1/2 z-10 flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-full border border-[#CDD1D5] bg-white shadow-sm transition-colors hover:bg-gray-50 ${
                        swiperStates[categoryIndex]?.isBeginning ? 'hidden' : ''
                      }`}
                    >
                      <Image
                        src="/assets/icons/arrow_left.svg"
                        alt="이전"
                        width={20}
                        height={20}
                      />
                    </button>
                    <button
                      className={`swiper-button-next-${categoryIndex} absolute right-[-20px] top-1/2 z-10 flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-full border border-[#CDD1D5] bg-white shadow-sm transition-colors hover:bg-gray-50 ${
                        swiperStates[categoryIndex]?.isEnd ? 'hidden' : ''
                      }`}
                    >
                      <Image
                        src="/assets/icons/arrow_right.svg"
                        alt="다음"
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 포인트 사용 모달 */}
      {modalState.selectedCoupon && (
        <PointUseModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          userPoints={currentPoints}
          coupon={modalState.selectedCoupon}
        />
      )}
    </div>
  );
};

export default Store;
