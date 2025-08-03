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
      <div className="mx-auto mt-[113px] flex w-[1200px] gap-[40px]">
        <aside className="flex w-[282px] flex-col items-start gap-[20px]">
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
          <section className="w-[878px] rounded-[20px] border border-[#E2E2E4] px-[40px] pb-[36px] pt-[40px]">
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
              <div className="flex items-center gap-1 pb-[12px] text-[#5F5F68]">
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

          <section className="w-[878px]">
            <h1 className="mb-[40px] text-[32px] font-bold leading-[130%]">
              포인트 상점
            </h1>

            {/* 쿠폰 교환 섹션들 */}
            <div className="w-[878px] space-y-[40px]">
              {couponCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-[20px]">
                  <h2 className="text-[20px] font-bold leading-[130%] text-[#171719]">
                    {category.title}
                  </h2>

                  <div className="relative">
                    <Swiper
                      modules={[Navigation]}
                      navigation={{
                        nextEl: `.swiper-button-next-${categoryIndex}`,
                        prevEl: `.swiper-button-prev-${categoryIndex}`,
                      }}
                      spaceBetween={32}
                      slidesPerView="auto"
                      slidesPerGroup={2}
                      className="h-[396px] !overflow-x-hidden"
                      onSlideChange={(swiper) =>
                        handleSwiperChange(categoryIndex, swiper)
                      }
                      onSwiper={(swiper) =>
                        handleSwiperChange(categoryIndex, swiper)
                      }
                      onTransitionEnd={(swiper) =>
                        handleSwiperChange(categoryIndex, swiper)
                      }
                    >
                      {category.items.map((item, itemIndex) => (
                        <SwiperSlide key={item.id} className="!w-[285px]">
                          <div className="h-[395px] w-[284px] rounded-[20px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)]">
                            <div className="flex h-[284px] w-[284px] rounded-t-[20px] bg-[#F5F5F8] px-[33px] py-[73px]">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={218}
                                height={138}
                              />
                            </div>

                            <div className="flex h-[111px] w-[284px] flex-col gap-3 rounded-b-[20px] p-3">
                              <p className="text-[20px] font-semibold leading-[130%] text-[#171719]">
                                {item.name}
                              </p>

                              <div className="flex items-center gap-3">
                                <div className="h-[14px] w-[193px] rounded-[7px] bg-[#E2E2E4]">
                                  <div
                                    className="h-full rounded-[7px] bg-[#3CDD4C]"
                                    style={{
                                      width: `${Math.min((currentPoints / item.amount) * 100, 100)}%`,
                                    }}
                                  />
                                </div>
                                <p className="text-[16px] font-bold leading-[130%] text-[#171719]">
                                  {currentPoints} P
                                </p>
                              </div>

                              <button
                                onClick={() => handleOpenModal(item)}
                                className="text-start text-[12px] font-normal leading-[130%] text-[#787882] transition-colors hover:text-[#FA4D09]"
                              >
                                지금 바꾸러 가기 →
                              </button>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>

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
          currentPoints={currentPoints}
          requiredPoints={modalState.selectedCoupon.amount}
          couponName={modalState.selectedCoupon.name}
          couponImage={modalState.selectedCoupon.image}
          couponContent={modalState.selectedCoupon.content}
        />
      )}
    </div>
  );
};

export default Store;
