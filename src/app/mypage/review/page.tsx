'use client';

import { getUserReceipts, getUserReviews } from '@/app/actions/user';
import { Star } from '@/app/restaurant/[id]/review/_components/RatingInput';
import StoryPreview from '@/app/restaurant/[id]/review/_components/StoryPreview';
import { useAuthStore } from '@/store/authStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';

const FILTERS = ['전체', '승인완료', '승인대기', '승인거절'];
const PERIODS = [
  { name: '전체', value: '전체' },
  { name: '최근 1개월', value: '1' },
  { name: '최근 3개월', value: '3' },
  { name: '최근 6개월', value: '6' },
];

const page = () => {
  const [reviewFilter, setReviewFilter] = useState<
    'all' | 'graphic' | 'standard'
  >('all');
  const [receiptFilter, setReceiptFilter] = useState<string>('전체');
  const [period, setPeriod] = useState<string>('전체');
  const { user } = useAuthStore();

  const { data: reviewData, isPending } = useQuery({
    queryKey: ['reviews', reviewFilter],
    queryFn: () =>
      getUserReviews({ userId: user?.id.toString() || '', type: reviewFilter }),
    enabled: !!user?.id,
  });

  const { data: receiptData, isPending: receiptPending } = useQuery({
    queryKey: ['receipts', receiptFilter, period],
    queryFn: () =>
      getUserReceipts({
        userId: user?.id.toString() || '',
        status: receiptFilter,
        month: period,
      }),
    enabled: !!user?.id,
  });

  // 영수증 데이터를 날짜별로 그룹핑하는 함수 (한국 시간 기준)
  const groupByDate = () => {
    const groups = new Map<string, Array<any & { koreaTime: Date }>>();

    receiptData?.receipts?.forEach((receipt: any) => {
      // UTC 시간을 한국 시간으로 변환
      const utcDate = new Date(receipt.submitted_at);
      const koreaTime = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

      const month = String(koreaTime.getMonth() + 1).padStart(2, '0');
      const day = String(koreaTime.getDate()).padStart(2, '0');
      const dateKey = `${month}.${day}`;

      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push({ ...receipt, koreaTime });
    });

    return Array.from(groups.entries());
  };

  // 필터링된 리뷰 데이터
  const filteredReviews = (reviewData?.reviews ?? []).filter((review: any) => {
    if (reviewFilter === 'all') return true;
    if (reviewFilter === 'graphic') return review.type === 'graphic';
    if (reviewFilter === 'standard') return review.type === 'standard';
    return true;
  });

  return (
    <div className="mt-[64px] flex w-full flex-col items-center">
      <div className="mx-auto w-full max-w-[772px] border-none">
        <h1 className="mt-[40px] text-[32px] font-bold leading-[130%]">
          내 기록
        </h1>
      </div>

      <Tabs defaultValue="review">
        <TabsList className="mb-[20px]">
          <TabsTrigger
            value="review"
            className="relative h-[51px] w-[386px] pb-2 text-[18px] font-semibold text-gray-400 focus-visible:ring-0 data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-[2px] data-[state=active]:after:w-full data-[state=active]:after:bg-black data-[state=active]:after:content-['']"
          >
            리뷰
          </TabsTrigger>
          <TabsTrigger
            value="receipt"
            className="relative h-[51px] w-[386px] pb-2 text-[18px] font-semibold text-gray-400 focus-visible:ring-0 data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-[2px] data-[state=active]:after:w-full data-[state=active]:after:bg-black data-[state=active]:after:content-['']"
          >
            영수증 인증
          </TabsTrigger>
        </TabsList>

        {isPending ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">리뷰를 불러오는 중...</div>
          </div>
        ) : (
          <>
            <TabsContent value="review" className="space-y-6">
              {/* 리뷰 필터링 탭 */}
              <div className="flex gap-2">
                <button
                  onClick={() => setReviewFilter('all')}
                  className={`rounded-[100px] px-[10px] py-[7px] text-[14px] font-normal transition-colors ${
                    reviewFilter === 'all'
                      ? 'border border-[#FA4D09] bg-[#FEEDE6] text-[#FA4D09]'
                      : 'border border-[#C7C7CC] bg-white text-[#2E2E32]'
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => setReviewFilter('graphic')}
                  className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                    reviewFilter === 'graphic'
                      ? 'border border-[#FA4D09] bg-[#FEEDE6] text-[#FA4D09]'
                      : 'border border-[#C7C7CC] bg-white text-[#2E2E32]'
                  }`}
                >
                  리얼 스토리
                </button>
                <button
                  onClick={() => setReviewFilter('standard')}
                  className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                    reviewFilter === 'standard'
                      ? 'border border-[#FA4D09] bg-[#FEEDE6] text-[#FA4D09]'
                      : 'border border-[#C7C7CC] bg-white text-[#2E2E32]'
                  }`}
                >
                  리얼 리뷰
                </button>
              </div>

              {/* 리뷰 카드들 */}
              {filteredReviews?.length === 0 && (
                <div className="flex w-full items-center justify-center">
                  <p className="text-center text-gray-500">리뷰가 없습니다.</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 overflow-x-auto pb-4">
                {filteredReviews?.map((review: any, index: number) => (
                  <div
                    key={review.id || index}
                    className="min-h-[330px] w-[247px] overflow-hidden rounded-[12px] bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)]"
                  >
                    {review.type === 'standard' && (
                      <div className="relative flex h-full flex-col">
                        <div className="relative flex h-[208px] flex-col rounded-t-[12px] bg-[#FCFCFD] p-3">
                          <Image
                            src="/assets/icons/more.svg"
                            alt="more"
                            width={24}
                            height={24}
                            className="absolute right-3 top-3"
                          />

                          {/* 리뷰 텍스트 */}
                          <div className="mt-[40px] box-border h-[72px] w-full rounded-lg border-2 border-gray-100 px-[10px] py-[20px]">
                            <p className="line-clamp-2 text-sm text-gray-700">
                              {review.content}
                            </p>
                          </div>

                          {/* 별점 */}
                          <div className="mt-[14px] flex items-center">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Star
                                width={15}
                                height={15}
                                filled={n <= review.rating}
                                color="#FFB114"
                              />
                            ))}
                          </div>

                          {/* 식당 정보 */}
                          <div className="mt-[2px]">
                            <h3 className="text-[16px] font-semibold text-gray-900">
                              {review.restaurant_name || '식당명'}
                            </h3>
                            <p className="mt-[2px] text-[14px] text-gray-600">
                              {review.address
                                .split(' ')
                                .slice(0, 2)
                                .join(' ') || '주소'}
                            </p>
                          </div>
                        </div>

                        {/* 사진들 - 맨 아래로 밀어내기 */}
                        <div className="absolute bottom-0 left-0 flex items-center">
                          {review.photos.slice(0, 2).map((photo: any) => (
                            <Image
                              key={photo.id}
                              src={photo.image_url}
                              alt="photo"
                              width={123}
                              height={123}
                              className="h-[123px] w-[123px]"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {review.type === 'graphic' && (
                      <div className="relative h-[330px] w-[247px] overflow-hidden">
                        <StoryPreview
                          backgroundImage={review.background_image_url}
                          elements={review.elements}
                          previewW={247}
                          previewH={330}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="receipt">
              {/* 필터 탭과 기간 선택 */}
              <div className="mb-4 mt-[20px] flex justify-between">
                {/* 필터 탭 */}
                <div className="flex space-x-[6px]">
                  {FILTERS.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setReceiptFilter(filter)}
                      className={`rounded-[100px] border border-[#C7C7CC] px-[10px] py-[7px] text-[14px] font-normal leading-[100%] text-[#2E2E32] ${
                        receiptFilter === filter
                          ? 'border-[#FA4D09] bg-[#FEEDE6] text-[#FA4D09]'
                          : 'bg-white'
                      }`}
                      disabled={receiptPending}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* 기간 선택 드롭다운 */}
                <div className="relative w-[179px]">
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-[4px] border border-[#E2E2E4] bg-white px-3 py-2 pr-10 focus:outline-none disabled:opacity-50"
                    disabled={receiptPending}
                  >
                    {PERIODS.map((periodOption) => (
                      <option
                        key={periodOption.value}
                        value={periodOption.value}
                      >
                        {periodOption.name}
                      </option>
                    ))}
                  </select>
                  <Image
                    src="/assets/icons/arrow_dropdown.svg"
                    alt="arrow_down"
                    width={24}
                    height={24}
                    className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                  />
                </div>
              </div>

              <div className="flex items-center gap-[6px] rounded-[12px] border border-[#E2E2E4] bg-[#FCFCFD] p-[12px] text-[16px] text-[#787882]">
                <Image
                  src="/assets/icons/error_outline.svg"
                  alt="alarm"
                  width={24}
                  height={24}
                />
                <p>
                  영수증 인증은 최대 24시간 이내 검토되며, 승인 결과는 아래
                  화면에서 확인할 수 있습니다.
                </p>
              </div>

              {/* 영수증 내역 리스트 */}
              <div>
                {receiptPending ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-600">
                      영수증 내역을 불러오는 중...
                    </div>
                  </div>
                ) : receiptData?.receipts?.length === 0 ? (
                  <div className="rounded-lg bg-white p-6 text-center text-gray-500 sm:p-8">
                    해당 기간에 영수증 내역이 없습니다.
                  </div>
                ) : (
                  groupByDate().map(([date, items]) => (
                    <div key={date} className="mb-4 flex items-start">
                      {/* 왼쪽 날짜 */}
                      <div className="w-[52px] pr-3 pt-3 font-normal text-[#171719]">
                        {date}
                      </div>

                      {/* 오른쪽 리스트 */}
                      <div className="w-full">
                        {items.map((receipt: any & { koreaTime: Date }) => {
                          const time = receipt.koreaTime
                            .toISOString()
                            .slice(11, 16);
                          return (
                            <div
                              key={receipt.id}
                              className="flex items-center justify-between border-b border-[#E2E2E4] py-3"
                            >
                              <div>
                                <div className="mb-1 text-[16px] font-bold text-[#171719]">
                                  {receipt.restaurant_name}
                                </div>
                                <div className="text-[14px] font-normal text-[#92929B]">
                                  {time}
                                </div>
                              </div>
                              <div
                                className={`rounded-[20px] px-[12px] py-[6px] text-[14px] font-medium leading-[130%] text-[#47474D] ${
                                  receipt.status === '승인완료'
                                    ? 'bg-[#E9FBEB]'
                                    : receipt.status === '승인대기'
                                      ? 'bg-[#E2E2E4]'
                                      : 'bg-[#FFDBDB]'
                                }`}
                              >
                                <p>{receipt.status}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default page;
