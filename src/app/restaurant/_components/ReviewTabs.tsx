'use client';
import {
  addRestaurantReaction,
  deleteRestaurantReaction,
} from '@/app/actions/restaurant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import {
  GraphicReviewProps,
  keywordSummaryProps,
  ReactionType,
  StandardReviewProps,
} from '@/types/restaurant';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';
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
  sort: 'latest' | 'popular';
  onSortChange: (sort: 'latest' | 'popular') => void;
};

const ReviewTabs = ({
  standardReviews,
  graphicReviews,
  keywords,
  restaurantId,
  sort,
  onSortChange,
}: ReviewTabsProps) => {
  const [showAllStandardReviews, setShowAllStandardReviews] = useState(false);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  console.log('standardReveiws:', standardReviews);

  const addReactionMutation = useMutation({
    mutationFn: ({
      reviewId,
      type,
      userId,
    }: {
      reviewId: number;
      type: ReactionType;
      userId: number;
    }) => addRestaurantReaction(reviewId, type, userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['restaurant', restaurantId],
      });
    },
    onError: (error: any) => {
      if (error?.name === 'UNAUTHORIZED' && useAuthStore.getState().user) {
        useAuthStore.getState().clearUser();
        alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
      } else {
        alert('처리 중 오류가 발생했습니다.');
      }
    },
  });

  const deleteReactionMutation = useMutation({
    mutationFn: ({
      reviewId,
      type,
      userId,
    }: {
      reviewId: number;
      type: ReactionType;
      userId: number;
    }) => deleteRestaurantReaction(reviewId, type, userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['restaurant', restaurantId],
      });
    },
    onError: (error: any) => {
      if (error?.name === 'UNAUTHORIZED' && useAuthStore.getState().user) {
        useAuthStore.getState().clearUser();
        alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
      } else {
        alert('처리 중 오류가 발생했습니다.');
      }
    },
  });

  const isMutatingReaction =
    addReactionMutation.isPending || deleteReactionMutation.isPending;

  const handleReaction = async (
    reviewId: number,
    type: ReactionType,
    isReacted: boolean,
  ) => {
    if (!user) {
      alert('로그인 후 공감 버튼을 누를 수 있어요!');
      return;
    }
    const userId = user.id;
    if (isReacted) {
      deleteReactionMutation.mutate({ reviewId, type, userId });
    } else {
      addReactionMutation.mutate({ reviewId, type, userId });
    }
  };

  const isReacted = (
    reactions: { type: ReactionType; user_id: number[] }[],
    type: ReactionType,
  ) => {
    if (!user) return false;
    return reactions.some(
      (reaction) =>
        reaction.type === type && reaction.user_id.includes(user.id),
    );
  };

  // 표시할 리뷰 개수 결정 (일반리뷰만)
  const displayedStandardReviews = showAllStandardReviews
    ? standardReviews
    : standardReviews.slice(0, 6);

  return (
    <Tabs
      defaultValue="standard"
      className="w-full max-w-[1280px] px-[40px] py-[32px]"
    >
      <TabsList className="mx-auto w-full border-none">
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
        <KeywordSection
          keywords={keywords.standard}
          sort={sort}
          onSortChange={onSortChange}
        />

        {/* 일반리뷰 내용 */}
        <div className="bg-orange-200">
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

                    // reactions 파생값 계산 (타입/키 불일치 대비 정상화)
                    const likeCount =
                      standardReview?.reactions?.find(
                        (r) => r.type === '공감해요',
                      )?.user_id.length || 0;
                    const helpfulCount =
                      standardReview?.reactions?.find(
                        (r) => r.type === '도움이 됐어요',
                      )?.user_id.length || 0;

                    const likedByMe = isReacted(
                      standardReview.reactions,
                      '공감해요',
                    );
                    const helpfulByMe = isReacted(
                      standardReview.reactions,
                      '도움이 됐어요',
                    );

                    return (
                      <div
                        className="flex h-[390px] flex-1 flex-col rounded-[12px] border border-[#E2E2E4] bg-[#FCFCFD] p-[24px]"
                        key={standardReview.id}
                      >
                        <div className="mb-[12px] flex justify-between">
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
                        <p className="mb-[16px] line-clamp-2 h-[42px] w-full bg-red-200 text-[16px] text-lg font-normal leading-[130%] text-[#2E2E32]">
                          {standardReview.content}
                        </p>
                        <div className="scrollbar-hide mb-[16px] flex w-full items-center gap-[10px] overflow-hidden overflow-x-auto">
                          {standardReview.photos.map((photo) => (
                            <Image
                              key={photo.id}
                              src={photo.image_url}
                              alt="photo"
                              width={180}
                              height={226}
                              className="h-[180px] w-[180px] rounded-[20px]"
                            />
                          ))}
                        </div>
                        <div className="flex h-[36px] items-end gap-[10px] pt-[4px]">
                          <button
                            className={cn(
                              'flex h-[32px] items-center justify-center rounded-full border border-[#C7C7CC] px-[12px] py-[8px] text-[#5F5F68]',
                              likedByMe && 'bg-orange-400 text-white',
                            )}
                            disabled={isMutatingReaction}
                            onClick={() =>
                              handleReaction(
                                standardReview.id,
                                '공감해요',
                                likedByMe,
                              )
                            }
                          >
                            공감해요 {likeCount}
                          </button>
                          <button
                            className={cn(
                              'flex h-[32px] items-center justify-center rounded-full border border-[#C7C7CC] px-[12px] py-[8px] text-[#5F5F68]',
                              helpfulByMe && 'bg-orange-400 text-white',
                            )}
                            disabled={isMutatingReaction}
                            onClick={() =>
                              handleReaction(
                                standardReview.id,
                                '도움이 됐어요',
                                helpfulByMe,
                              )
                            }
                          >
                            도움이 됐어요 {helpfulCount}
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
        <KeywordSection
          keywords={keywords.graphic}
          sort={sort}
          onSortChange={onSortChange}
          type="graphic"
        />

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
