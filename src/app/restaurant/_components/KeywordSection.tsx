import { keywordSummaryProps } from '@/types/restaurant';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

type SortType = 'latest' | 'popular';

interface KeywordSectionProps {
  keywords: keywordSummaryProps[];
  sort: SortType;
  onSortChange: (sort: SortType) => void;
  type?: 'standard' | 'graphic';
}

const KeywordSection = ({
  keywords,
  sort,
  onSortChange,
  type = 'standard',
}: KeywordSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  }, []);

  const scroll = () => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      const currentScrollLeft = scrollRef.current.scrollLeft;
      const newScrollLeft = currentScrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [checkScrollPosition, keywords]);

  return (
    <div className="my-[8px] flex flex-col items-center justify-between gap-0 md:my-[16px] md:flex-row md:gap-[20px]">
      <div className="relative w-full">
        <div
          ref={scrollRef}
          className="scrollbar-hide flex w-[calc(100%-32px)] gap-[8px] overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={checkScrollPosition}
        >
          {keywords.map((keyword) => (
            <div
              key={keyword.keyword}
              className="flex h-[32px] flex-shrink-0 items-center justify-center rounded-full bg-[#F2F2F7] px-[12px] py-[8px] text-sm text-[#5F5F68]"
            >
              {keyword.keyword} +{keyword.count}
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={scroll}
            className="absolute right-[0px] top-1/2 z-10 flex h-[32px] w-[38px] -translate-y-1/2 items-center justify-center"
          >
            <Image
              src="/assets/icons/arrow_right.svg"
              alt="다음"
              width={24}
              height={24}
            />
          </button>
        )}
      </div>

      {type === 'standard' && (
        <div className="flex h-[40px] w-full items-center justify-between md:hidden">
          {/* 드롭다운 메뉴 */}
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortType)}
            className="rounded-[4px] border border-[#E2E2E4] bg-white py-[7px] pl-[16px] pr-[8px] text-[12px] font-normal leading-[130%] text-[#171719]"
          >
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
          </select>

          {/* 정보 아이콘 */}
          <div className="h-6 w-6">
            <Image
              src="/assets/icons/alert.svg"
              alt="정보"
              width={24}
              height={24}
            />
          </div>
        </div>
      )}

      {type === 'standard' && (
        <div className="hidden items-center text-sm text-[#5F5F68] md:flex">
          <div className="flex w-[58px] items-center whitespace-nowrap">
            <span className="mx-2">•</span>
            <button
              onClick={() => onSortChange('latest')}
              className={`cursor-pointer hover:text-black ${
                sort === 'latest' ? 'font-semibold text-black' : ''
              }`}
            >
              최신순
            </button>
          </div>
          <div className="flex w-[58px] items-center whitespace-nowrap">
            <span className="mx-2">•</span>
            <button
              onClick={() => onSortChange('popular')}
              className={`cursor-pointer hover:text-black ${
                sort === 'popular' ? 'font-semibold text-black' : ''
              }`}
            >
              인기순
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordSection;
