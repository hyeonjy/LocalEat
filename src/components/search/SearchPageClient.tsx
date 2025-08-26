'use client';

import FilterModal from '@/components/search/FilterModal';
import ReviewToggle from '@/components/search/ReviewToggle';
import SearchMap from '@/components/search/SearchMap';
import SearchResultList from '@/components/search/SearchResultList';
import { useInfiniteMapSearch } from '@/hooks/useSearchNavigate';
import { useEffect, useState } from 'react';

const SearchPageClient = ({ initialKeyword }: { initialKeyword: string }) => {
  const [photoOnly, setPhotoOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 디버깅: 초기 키워드와 환경변수 확인
  useEffect(() => {
    console.log('🔍 SearchPageClient 디버깅 정보:');
    console.log('initialKeyword:', initialKeyword);
    console.log('NEXT_PUBLIC_API_BASE:', process.env.NEXT_PUBLIC_API_BASE);
    console.log(
      'window.location.origin:',
      typeof window !== 'undefined' ? window.location.origin : '서버사이드',
    );
  }, [initialKeyword]);

  // ✅ 여기서 한 번만 패칭 (서버에서 받은 키워드 사용)
  const {
    data,
    status,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteMapSearch(initialKeyword);

  // 디버깅: 쿼리 상태 확인
  useEffect(() => {
    console.log('🔍 useInfiniteMapSearch 상태:', {
      status,
      error,
      dataPagesCount: data?.pages?.length || 0,
      itemsCount: data?.pages?.flatMap((p) => p.items)?.length || 0,
    });

    if (error) {
      console.error('❌ useInfiniteMapSearch 오류:', error);
    }
  }, [status, error, data]);

  const items = data?.pages?.flatMap((p) => p.items) ?? [];
  const center = {
    lat: data?.pages?.[0]?.center?.lat ?? 37.5665,
    lng: data?.pages?.[0]?.center?.lng ?? 126.978,
  };

  return (
    <div className="mx-auto mt-[64px] flex max-w-[1520px] items-start justify-center self-stretch px-[40px]">
      <section className="w-[464px] shrink-0 border-l border-[#E2E2E4]">
        <div className="flex h-[1019px] flex-col">
          {/* 상단: 검색/필터 영역 */}
          <div className="w-[464px] max-w-[464px] border-l border-[#E2E2E4]">
            <form className="flex w-[464px] flex-col items-start gap-[10px] px-[20px] pb-0 pt-[20px]">
              <input
                defaultValue={initialKeyword}
                className="flex items-center gap-[8px] self-stretch rounded-[12px] border-[2px] border-[#FA4D09] bg-[#FFF] px-[20px] py-[16px]"
              />
            </form>
          </div>

          <div className="flex flex-col gap-[20px] self-stretch border-b border-[#E2E2E4] p-[20px]">
            <div className="relative flex gap-[8px] text-[14px]">
              <button
                onClick={() => setIsModalOpen(true)}
                type="button"
                className="flex h-[30px] cursor-pointer items-center justify-center gap-[4px] rounded-[20px] border border-[#FA4D09] bg-[#FEEDE6] px-[12px] py-[8px] text-[#FA4D09]"
              >
                <img src="assets/icons/tune.svg" /> 1
              </button>
              <span className="flex h-[30px] items-center justify-center gap-[4px] rounded-[20px] border border-[#FA4D09] bg-[#FEEDE6] px-[12px] py-[8px] text-[#FA4D09]">
                영업중
              </span>
              <span className="flex h-[30px] items-center justify-center gap-[4px] rounded-[20px] border border-[#C7C7CC] px-[12px] py-[8px] text-[#2E2E32]">
                브레이크타임
              </span>
              <span className="flex h-[30px] items-center justify-center gap-[4px] rounded-[20px] border border-[#C7C7CC] px-[12px] py-[8px] text-[#2E2E32]">
                휴무
              </span>
              <span className="flex h-[30px] items-center justify-center gap-[4px] rounded-[20px] border border-[#C7C7CC] px-[12px] py-[8px] text-[#2E2E32]">
                24시
              </span>
              {isModalOpen && (
                <FilterModal onClose={() => setIsModalOpen(false)} />
              )}
            </div>

            <div className="flex items-center gap-[5px]">
              <ReviewToggle
                on={photoOnly}
                onToggle={() => setPhotoOnly((prev) => !prev)}
              />
              <span className="font-pretendard text-[16px] font-normal leading-[130%] text-[#000]">
                사진 리뷰만 보기
              </span>
            </div>
          </div>

          {/* 리스트 영역만 스크롤 */}
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
            <SearchResultList
              items={items}
              status={status}
              error={error}
              hasNextPage={!!hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />
          </div>
        </div>
      </section>

      <section>
        <SearchMap center={center} places={items} />
      </section>
    </div>
  );
};

export default SearchPageClient;
