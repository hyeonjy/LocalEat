'use client';

import { deleteReview } from '@/app/actions/restaurant';
import { getUserReceipts, getUserReviews } from '@/app/actions/user';
import { Star } from '@/app/restaurant/[id]/review/_components/RatingInput';
import StoryPreview from '@/app/restaurant/[id]/review/_components/StoryPreview';
import { useAuthStore } from '@/store/authStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [period, setPeriod] = useState<string>('전체');
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  // 리뷰 삭제 함수
  const handleDeleteReview = async (reviewId: number) => {
    try {
      const result = await deleteReview(reviewId);

      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['reviews', reviewFilter] });
      } else {
        if (result.reason === 'UNAUTHORIZED') {
          alert('로그인이 필요합니다.');
          router.push('/signin');
        } else {
          alert('리뷰 삭제에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('리뷰 삭제 중 오류 발생:', error);
      alert('리뷰 삭제 중 오류가 발생했습니다.');
    }
  };

  // 드롭다운 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // 드롭다운 버튼이나 드롭다운 메뉴 내부를 클릭한 경우는 무시
      if (target.closest('[data-dropdown]')) {
        return;
      }

      if (openDropdownId !== null) {
        setOpenDropdownId(null);
      }
    };

    if (openDropdownId !== null) {
      // mousedown 대신 click 이벤트 사용하고 약간의 지연 추가
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openDropdownId]);

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
    <div className="mx-auto mt-[60px] flex w-full flex-col items-center px-[16px] md:w-[772px] md:px-0">
      <h1 className="mt-[40px] hidden w-full text-[32px] font-bold leading-[130%] md:block">
        작성한 리뷰
      </h1>

      <div className="flex h-[99px] w-full flex-col items-center gap-[4px] py-[20px] md:hidden">
        <p className="text-[16px] font-semibold leading-[150%] text-[#FA4D09]">
          My Page
        </p>

        <h1 className="text-[24px] font-bold leading-[130%] text-[#171719]">
          작성한 리뷰
        </h1>
      </div>

      <div className="w-full">
        <div className="flex justify-center gap-[6px] md:justify-start md:py-[12px]">
          <button
            onClick={() => setReviewFilter('all')}
            className={`h-[30px] rounded-[20px] px-[12px] py-[8px] text-[14px] font-normal leading-[100%] transition-colors ${
              reviewFilter === 'all'
                ? 'border border-[#FA4D09] bg-[#FEEDE6] text-[#FA4D09]'
                : 'border border-[#C7C7CC] bg-white text-[#2E2E32]'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setReviewFilter('graphic')}
            className={`h-[30px] rounded-[20px] px-[12px] py-[8px] text-[14px] font-normal leading-[100%] transition-colors ${
              reviewFilter === 'graphic'
                ? 'border border-[#FA4D09] bg-[#FEEDE6] text-[#FA4D09]'
                : 'border border-[#C7C7CC] bg-white text-[#2E2E32]'
            }`}
          >
            방문 스토리
          </button>
          <button
            onClick={() => setReviewFilter('standard')}
            className={`h-[30px] rounded-[20px] px-[12px] py-[8px] text-[14px] font-normal leading-[100%] transition-colors ${
              reviewFilter === 'standard'
                ? 'border border-[#FA4D09] bg-[#FEEDE6] text-[#FA4D09]'
                : 'border border-[#C7C7CC] bg-white text-[#2E2E32]'
            }`}
          >
            리뷰
          </button>
        </div>

        {isPending ? (
          <div className="mt-[12px] flex items-center justify-center">
            <div className="text-gray-600">리뷰를 불러오는 중...</div>
          </div>
        ) : (
          <>
            {filteredReviews?.length === 0 && (
              <div className="mt-[12px] flex w-full items-center justify-center">
                <p className="text-gray-500">리뷰가 없습니다.</p>
              </div>
            )}

            <div className="mt-[12px] flex flex-col items-center gap-[15px] pb-[12px] md:grid md:grid-cols-3">
              {filteredReviews?.map((review: any, index: number) => (
                <div
                  className="mt-[1px] h-[330px] px-[20px] md:px-0"
                  key={review.id}
                >
                  <div className="h-[330px] w-[247px] overflow-hidden rounded-[12px] bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)]">
                    {review.type === 'standard' && (
                      <div className="relative flex h-full flex-col">
                        <div className="relative flex h-[208px] flex-col rounded-t-[12px] bg-[#FCFCFD] p-3">
                          <div className="relative w-full">
                            <Image
                              src="/assets/icons/more.svg"
                              alt="more"
                              width={24}
                              height={24}
                              className="absolute right-0 top-0 z-10 cursor-pointer"
                              onClick={() =>
                                setOpenDropdownId(
                                  openDropdownId === review.id
                                    ? null
                                    : review.id,
                                )
                              }
                            />

                            {openDropdownId === review.id && (
                              <div
                                data-dropdown
                                className="absolute right-0 top-[23px] z-20 w-[100px] rounded-[8px] border border-[#E2E2E4] bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.15)]"
                              >
                                <button
                                  className="w-full rounded-t-[8px] px-[12px] py-[8px] text-left text-[14px] font-normal text-[#171719] hover:bg-[#F5F5F5]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdownId(null);
                                    // 리뷰 편집 페이지로 이동
                                    console.log('in');
                                    router.push(
                                      `/restaurant/${review.restaurant_id}/review/standard?edit=${review.id}`,
                                    );
                                  }}
                                >
                                  편집하기
                                </button>
                                <div className="h-[1px] bg-[#E2E2E4]"></div>
                                <button
                                  className="w-full rounded-b-[8px] px-[12px] py-[8px] text-left text-[14px] font-normal text-[#FF3B30] hover:bg-[#F5F5F5]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdownId(null);
                                    handleDeleteReview(review.id);
                                  }}
                                >
                                  삭제하기
                                </button>
                              </div>
                            )}
                          </div>

                          {/* 리뷰 텍스트 */}
                          <div className="mt-[40px] h-[72px] w-full rounded-[12px] border border-[#E2E2E4] px-[10px] py-[20px]">
                            <p className="line-clamp-2 h-[32px] text-[12px] font-normal leading-[130%] text-[#171719]">
                              {review.content}
                            </p>
                          </div>

                          {/* 별점 */}
                          <div className="mt-[14px] flex items-center">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Star
                                key={review.id + n}
                                width={15}
                                height={15}
                                filled={n <= review.rating}
                                color="#FFB114"
                              />
                            ))}
                          </div>

                          {/* 식당 정보 */}
                          <div className="mt-[2px]">
                            <h3 className="text-[16px] font-semibold leading-[130%] text-[#171719]">
                              {review.restaurant_name || '식당명'}
                            </h3>
                            <p className="mt-[2px] text-[14px] font-normal leading-[130%] text-[#171719]">
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
                        <div className="absolute right-2 top-2 z-10">
                          <Image
                            src="/assets/icons/more.svg"
                            alt="more"
                            width={24}
                            height={24}
                            className="cursor-pointer"
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === review.id ? null : review.id,
                              )
                            }
                          />

                          {openDropdownId === review.id && (
                            <div
                              data-dropdown
                              className="absolute right-0 top-[23px] z-20 w-[100px] rounded-[8px] border border-[#E2E2E4] bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.15)]"
                            >
                              <button
                                className="w-full rounded-t-[8px] px-[12px] py-[8px] text-left text-[14px] font-normal text-[#171719] hover:bg-[#F5F5F5]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdownId(null);
                                  // 방문 스토리 편집 페이지로 이동
                                  router.push(
                                    `/restaurant/${review.restaurant_id}/review/graphic/story-editor?edit=${review.id}`,
                                  );
                                }}
                              >
                                편집하기
                              </button>
                              <div className="h-[1px] bg-[#E2E2E4]"></div>
                              <button
                                className="w-full rounded-b-[8px] px-[12px] py-[8px] text-left text-[14px] font-normal text-[#FF3B30] hover:bg-[#F5F5F5]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdownId(null);
                                  handleDeleteReview(review.id);
                                }}
                              >
                                삭제하기
                              </button>
                            </div>
                          )}
                        </div>
                        <StoryPreview
                          backgroundImage={review.background_image_url}
                          elements={review.elements}
                          previewW={247}
                          previewH={330}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default page;
