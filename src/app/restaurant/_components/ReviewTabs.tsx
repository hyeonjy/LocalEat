'use client';

import { getRestaurantReaction } from '@/app/actions/restaurant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import {
  GraphicReviewProps,
  keywordSummaryProps,
  ReactionProps,
  StandardReviewProps,
} from '@/types/restaurant';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import KeywordSection from './KeywordSection';
import StorySlider from './StorySlider';

type ReviewTabsProps = {
  standardReviews: StandardReviewProps[];
  graphicReviews: GraphicReviewProps[];
  keywords: {
    standard: keywordSummaryProps[];
    graphic: keywordSummaryProps[];
  };
  restaurantId: string;
};

const ReviewTabs = ({
  standardReviews,
  graphicReviews,
  keywords,
  restaurantId,
}: ReviewTabsProps) => {
  const [myReactions, setMyReactions] = useState<ReactionProps[]>([]);
  const [showAllStandardReviews, setShowAllStandardReviews] = useState(false);

  const isReacted = useCallback(
    (reviewId: number, type: string) =>
      myReactions.some(
        (reaction) => reaction.review_id === reviewId && reaction.type === type,
      ),
    [myReactions],
  );

  useEffect(() => {
    const fetchReaction = async () => {
      const result = await getRestaurantReaction(restaurantId);

      if (!result.success) {
        if (result.reason === 'UNAUTHORIZED' && useAuthStore.getState().user) {
          useAuthStore.getState().clearUser();
          alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
        }

        return setMyReactions([]);
      }

      setMyReactions(result.data);
    };

    fetchReaction();
  }, []);

  // 표시할 리뷰 개수 결정 (일반리뷰만)
  const displayedStandardReviews = showAllStandardReviews
    ? standardReviews
    : standardReviews.slice(0, 6);

  return (
    <Tabs defaultValue="standard" className="w-full">
      <TabsList className="mx-auto w-full max-w-[1200px] border-none">
        <TabsTrigger
          value="standard"
          className="relative pb-2 text-xl font-semibold text-gray-400 focus-visible:ring-0 data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-[2px] data-[state=active]:after:w-full data-[state=active]:after:bg-black data-[state=active]:after:content-['']"
        >
          리얼 리뷰
        </TabsTrigger>

        <TabsTrigger
          value="graphic"
          className="relative pb-2 text-xl font-semibold text-gray-400 focus-visible:ring-0 data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-[2px] data-[state=active]:after:w-full data-[state=active]:after:bg-black data-[state=active]:after:content-['']"
        >
          리얼 스토리
        </TabsTrigger>
      </TabsList>
      <TabsContent value="standard" className="mx-auto w-full max-w-[1200px]">
        <KeywordSection keywords={keywords.standard} />

        {/* 일반리뷰 내용 */}
        <div className="w-[1200px]">
          {displayedStandardReviews.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-[24px]">
                {displayedStandardReviews.map(
                  (standardReview: StandardReviewProps) => {
                    const visited_at = new Date(standardReview.visited_at);
                    const isThisYear =
                      visited_at.getFullYear() === new Date().getFullYear();

                    const formattedDate = isThisYear
                      ? `${String(visited_at.getMonth() + 1).padStart(2, '0')}.${String(visited_at.getDate()).padStart(2, '0')}`
                      : `${visited_at.getFullYear()}.${String(visited_at.getMonth() + 1).padStart(2, '0')}.${String(visited_at.getDate()).padStart(2, '0')}`;

                    return (
                      <div
                        className="flex flex-col rounded-[12px] border border-[#E2E2E4] bg-[#FCFCFD] p-[24px]"
                        key={standardReview.id}
                      >
                        <div className="mb-[16px] flex justify-between">
                          <div className="flex items-center">
                            <Image
                              src={standardReview.profile_image}
                              alt={standardReview.nickname}
                              width={40}
                              height={40}
                              className="mr-[10px] h-[40px] w-[40px] rounded-[50%] bg-white"
                            />
                            <p className="mr-[12px] text-[16px] font-semibold leading-[130%] text-[#2E2E32]">
                              {standardReview.nickname}
                            </p>
                            <p className="text-[14px] font-medium leading-[130%] text-[#5F5F68]">
                              {formattedDate} • {standardReview.visit_count}번째
                              방문 • 로컬인증
                            </p>
                          </div>
                          <Image
                            src={'/assets/icons/more.svg'}
                            alt="더보기 아이콘"
                            width={24}
                            height={24}
                            className="h-[24px] w-[24px]"
                          />
                        </div>
                        <p className="mb-[12px] w-full text-lg">
                          {standardReview.content}
                        </p>
                        <div className="mb-[20px] flex items-center gap-[10px]">
                          {standardReview.photos.map((photo) => (
                            <Image
                              key={photo.id}
                              src={photo.image_url}
                              alt="photo"
                              width={180}
                              height={226}
                              className="h-[226px] w-[180px] rounded-[20px]"
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-[10px]">
                          <button
                            className={cn(
                              'flex h-[32px] items-center justify-center rounded-full border border-[#C7C7CC] px-[12px] py-[8px] text-[#5F5F68]',
                              isReacted(standardReview.id, '공감해요') &&
                                'bg-orange-400 text-white',
                            )}
                          >
                            공감해요 {standardReview.reactions['공감해요']}
                          </button>
                          <button
                            className={cn(
                              'flex h-[32px] items-center justify-center rounded-full border border-[#C7C7CC] px-[12px] py-[8px] text-[#5F5F68]',
                              isReacted(standardReview.id, '도움이 됐어요') &&
                                'bg-orange-400 text-white',
                            )}
                          >
                            도움이 됐어요{' '}
                            {standardReview.reactions['도움이 됐어요']}
                          </button>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>

              {!showAllStandardReviews && standardReviews.length > 6 && (
                <div className="relative flex items-center justify-center py-[20px]">
                  <div className="absolute h-[1px] w-full bg-[#E2E2E4]"></div>
                  <button
                    onClick={() => setShowAllStandardReviews(true)}
                    className="relative z-10 w-[187px] rounded-full border border-[#C7C7CC] bg-white px-[20px] py-[10px] text-[20px] font-semibold leading-[130%] text-[#47474D] hover:bg-gray-50"
                  >
                    더 많은 리뷰 보기
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="my-[50px] ml-[10px] text-lg text-gray-500">
              리얼 리뷰가 없습니다. 첫 리뷰를 남겨주세요.
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="graphic" className="mx-auto w-full max-w-[1200px]">
        <KeywordSection keywords={keywords.graphic} />

        <div>
          {graphicReviews.length > 0 ? (
            <StorySlider stories={graphicReviews} />
          ) : (
            <p className="my-[50px] ml-[10px] text-lg text-gray-500">
              리얼 스토리가 없습니다. 첫 리뷰를 남겨주세요.
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ReviewTabs;
