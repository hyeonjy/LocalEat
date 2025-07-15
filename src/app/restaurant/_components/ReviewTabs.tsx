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
import StoryPreview from '../[id]/review/_components/StoryPreview';

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

  console.log('graphicReviews: ', graphicReviews);
  console.log('keywords: ', keywords);

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

  return (
    <Tabs defaultValue="standard" className="mt-[64px] w-full px-[36px]">
      <TabsList className="mx-auto w-full max-w-[1120px] border-none">
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
      <TabsContent value="standard" className="mx-auto w-full max-w-[1120px]">
        {standardReviews.length > 0 ? (
          standardReviews.map((standardReview) => {
            const visited_at = new Date(standardReview.visited_at);
            const isThisYear =
              visited_at.getFullYear() === new Date().getFullYear();

            const formattedDate = isThisYear
              ? `${String(visited_at.getMonth() + 1).padStart(2, '0')}.${String(visited_at.getDate()).padStart(2, '0')}`
              : `${visited_at.getFullYear()}.${String(visited_at.getMonth() + 1).padStart(2, '0')}.${String(visited_at.getDate()).padStart(2, '0')}`;

            return (
              <div
                className="mb-[20px] flex flex-col border-b border-[#C7C7CC]"
                key={standardReview.id}
              >
                <div className="mb-[16px] flex items-center">
                  <Image
                    src={standardReview.profile_image}
                    alt={standardReview.nickname}
                    width={40}
                    height={40}
                    className="mr-[10px] h-[40px] w-[40px] rounded-[50%] bg-white"
                  />
                  <p className="text-lm mr-[12px] font-semibold">
                    {standardReview.nickname}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formattedDate} • {standardReview.visit_count}번째 방문 •
                    로컬인증
                  </p>
                </div>
                <p className="mb-[12px] w-full text-lg">
                  {standardReview.content}
                </p>
                <div className="mb-[20px] flex items-center gap-[10px]">
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
                    도움이 됐어요 {standardReview.reactions['도움이 됐어요']}
                  </button>
                </div>
                <div className="mb-[20px] flex items-center gap-[10px]">
                  {standardReview.photos.map((photo) => (
                    <Image
                      key={photo.id}
                      src={photo.image_url}
                      alt="photo"
                      width={193}
                      height={226}
                      className="h-[226px] w-[193px] rounded-[20px]"
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <p className="my-[50px] ml-[10px] text-lg text-gray-500">
            리얼 리뷰가 없습니다. 첫 리뷰를 남겨주세요.
          </p>
        )}
      </TabsContent>
      <TabsContent
        value="graphic"
        className="mx-auto flex w-full max-w-[1120px] gap-[24px]"
      >
        {graphicReviews.length > 0 ? (
          graphicReviews.map((graphicReview) => {
            const created_at = new Date(graphicReview.created_at);
            const isThisYear =
              created_at.getFullYear() === new Date().getFullYear();

            const formattedDate = isThisYear
              ? `${String(created_at.getMonth() + 1).padStart(2, '0')}.${String(created_at.getDate()).padStart(2, '0')}`
              : `${created_at.getFullYear()}.${String(created_at.getMonth() + 1).padStart(2, '0')}.${String(created_at.getDate()).padStart(2, '0')}`;

            console.log('elements: ', graphicReview.elements);
            return (
              <div
                key={graphicReview.id}
                className="relative h-[494px] w-[290px] overflow-hidden rounded-[16px]"
              >
                {/* <Image
                  src={graphicReview.story_preview_url}
                  alt="photo"
                  width="290"
                  height="440"
                  className="h-[440px] w-[290px]"
                /> */}
                <div className="relative h-[440px] w-[290px]">
                  <StoryPreview
                    backgroundImage={graphicReview.background_image_url}
                    elements={graphicReview.elements}
                    previewW={290}
                    previewH={440}
                  />
                </div>
                <div className="absolute bottom-0 left-0 flex w-full items-center justify-between bg-[#2E2E32] px-[16px] py-[12px]">
                  <div className="flex items-center">
                    <Image
                      src={graphicReview.profile_image}
                      alt={graphicReview.nickname}
                      width={30}
                      height={30}
                      className="mr-[4px] h-[30px] w-[30px] rounded-[50%] bg-white"
                    />
                    <p className="text-[14px] font-semibold leading-[130%] text-white">
                      {graphicReview.nickname}
                    </p>
                  </div>
                  <p className="text-[14px] font-normal leading-[100%] text-white">
                    {formattedDate} • {graphicReview.visit_count}번째 방문
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="my-[50px] ml-[10px] text-lg text-gray-500">
            리얼 스토리가 없습니다. 첫 리뷰를 남겨주세요.
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ReviewTabs;
