'use client';

import { getUserReviews } from '@/app/actions/user';
import { Star } from '@/app/restaurant/[id]/review/_components/RatingInput';
import StoryPreview from '@/app/restaurant/[id]/review/_components/StoryPreview';
import { useAuthStore } from '@/store/authStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';

const page = () => {
  const [reviewFilter, setReviewFilter] = useState<
    'all' | 'graphic' | 'standard'
  >('all');
  const { user } = useAuthStore();

  const { data: reviewData, isPending } = useQuery({
    queryKey: ['reviews', reviewFilter],
    queryFn: () =>
      getUserReviews({ userId: user?.id.toString() || '', type: reviewFilter }),
    enabled: !!user?.id,
  });

  console.log(reviewData);

  if (isPending) return <div>Loading...</div>;

  // 필터링된 리뷰 데이터
  const filteredReviews = reviewData.reviews?.filter((review: any) => {
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
          <div className="flex gap-4 overflow-x-auto pb-4">
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
                          {review.address.split(' ').slice(0, 2).join(' ') ||
                            '주소'}
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
          <div>
            <h1>영수증 인증</h1>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
