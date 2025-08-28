'use client';

import { Button } from '@/components/ui/button';
import { useUserPoints } from '@/hooks/usePoint';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import PointHistoryList from './_components/PointHistoryList';

const COUPONS = [
  '/assets/images/point/naver.png',
  '/assets/images/point/baemin.png',
  '/assets/images/point/google.png',
];

const PointPage = () => {
  const { user } = useAuthStore();
  const userId = user?.id?.toString() || '';
  const { data: pointsData, isPending: pointsLoading } = useUserPoints(userId);

  const currentPoints = pointsData?.totalPoints || 0;

  if (pointsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[60px] lg:pt-[77px]">
      <div className="mx-auto max-w-[820px] px-[16px] md:px-[40px] lg:px-[24px]">
        <h1 className="hidden h-[42px] text-[32px] font-bold leading-[130%] text-[#171719] md:mt-[40px] md:block">
          포인트 내역
        </h1>

        <div className="flex w-full flex-col items-center justify-end gap-[4px] py-[20px] md:hidden">
          <p className="text-[16px] font-semibold leading-[150%] text-[#FA4D09]">
            Point Shop
          </p>
          <h1 className="text-[24px] font-bold leading-[130%] text-[#171719]">
            포인트 내역
          </h1>
        </div>

        <div className="mt-[20px] flex flex-col gap-[16px] md:flex-row md:justify-between md:gap-[20px]">
          <div className="flex h-[162px] w-full flex-none flex-col justify-between rounded-2xl bg-white p-5 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] md:w-auto md:flex-1 lg:w-[277px] lg:flex-none">
            <div className="flex h-[60px] flex-col gap-[8px]">
              <p className="text-[16px] font-semibold leading-[150%] text-[#171719]">
                내 포인트
              </p>
              <p className="text-[24px] font-semibold leading-[130%] text-[#171719]">
                {currentPoints.toLocaleString()}P
              </p>
            </div>
            <Button className="h-[41px] w-full rounded-[8px] bg-[#FA4D09] text-[16px] font-medium text-white hover:bg-orange-600">
              포인트 상점 구경하기
            </Button>
          </div>

          <div className="m scrollbar-hide h-[204px] w-full overflow-x-hidden rounded-2xl bg-white p-5 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] md:h-[162px] md:w-[475px] md:overflow-x-auto">
            <h2 className="mb-4 text-[16px] font-semibold text-[#171719] md:mb-3">
              교환 가능한 쿠폰
            </h2>
            <div className="scrollbar-hide flex gap-2 overflow-x-scroll md:grid md:grid-cols-3 md:overflow-x-auto">
              {COUPONS.map((coupon, index) => (
                <Image
                  key={index}
                  src={coupon}
                  alt="coupon"
                  width={142}
                  height={90}
                  className="h-[127px] w-[200px] md:h-[90px] md:w-auto"
                />
              ))}
            </div>
          </div>
        </div>

        <PointHistoryList userId={userId} />
      </div>
    </div>
  );
};

export default PointPage;
