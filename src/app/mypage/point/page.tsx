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
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-[820px] px-[24px]">
        <h1 className="mt-[40px] text-[32px] font-bold leading-[130%] text-[#171719]">
          포인트 내역
        </h1>

        <div className="mt-[20px] flex justify-between">
          <div className="flex h-[162px] w-[277px] flex-col justify-between rounded-2xl bg-white p-5 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
            <div>
              <p className="mb-2 text-sm text-gray-600">내 포인트</p>
              <p className="text-[24px] font-semibold text-[#171719]">
                {currentPoints.toLocaleString()}P
              </p>
            </div>
            <Button className="w-full rounded-[8px] bg-[#FA4D09] text-[16px] font-medium text-white hover:bg-orange-600">
              포인트 상점 구경하기
            </Button>
          </div>

          <div className="h-[162px] w-[475px] rounded-2xl bg-white p-5 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
            <h2 className="mb-3 text-[16px] font-semibold text-[#171719]">
              교환 가능한 쿠폰
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {COUPONS.map((coupon, index) => (
                <Image
                  key={index}
                  src={coupon}
                  alt="coupon"
                  width={142}
                  height={90}
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
