import { keywordSummaryProps } from '@/types/restaurant';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

const KeywordSection = ({ keywords }: { keywords: keywordSummaryProps[] }) => {
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
    <div className="my-[16px] flex items-center justify-between">
      <div className="relative w-[636px]">
        <div
          ref={scrollRef}
          className="scrollbar-hide flex w-[598px] gap-[8px] overflow-x-auto"
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

      <div className="flex items-center text-sm text-[#5F5F68]">
        <span className="mx-2">•</span>
        <span>최신순</span>
        <span className="mx-2">•</span>
        <span>인기순</span>
      </div>
    </div>
  );
};

export default KeywordSection;
