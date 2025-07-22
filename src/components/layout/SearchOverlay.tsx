'use client';

import { useSearchStore } from '@/store/overlayStore';

const SearchOverlay = () => {
  const closeSearch = useSearchStore((state) => state.close);

  return (
    <>
      {/* 검정 투명 배경: 헤더는 가리지 않도록 z-20 */}
      <div className="fixed inset-0 z-20 bg-black/50" onClick={closeSearch} />

      {/* 검색창: 헤더 위에 나오게 z-40, top-16은 헤더 높이만큼 내려오기 */}
      <div
        className="fixed left-0 top-16 z-40 h-[502px] w-full bg-white px-8 pb-[120px] pt-[40px] shadow-md"
        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫힘 방지
      >
        {/* 중앙 문구 */}
        <h2 className="font-pretendard text-center text-[40px] font-bold leading-[130%] tracking-[0.4px] text-[#171719]">
          이번 주 <span className="text-[#007558]">어디서</span> 먹지?
        </h2>
        <p className="font-pretendard text-center text-[16px] font-semibold leading-[130%] tracking-[0.16px] text-[#92929B]">
          지나쳤던 골목, 알고 보니 맛집 핫플
        </p>

        {/* 검색창 */}
        <div className="relative mx-auto mt-6 w-[712px]">
          <input
            type="text"
            placeholder="지역명 입력"
            className="flex w-[712px] items-center justify-between self-stretch rounded-[12px] border border-[#ADADB3] bg-white p-5"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <img src="assets/icons/search.svg" alt="검색_아이콘" />
          </button>
        </div>

        {/* 최근 검색어 */}
        <div className="mx-auto mt-[4px] flex w-[712px] flex-col items-start justify-center gap-[16px] self-stretch rounded-[12px] bg-white p-5 shadow-[0_0_4px_0_rgba(0,0,0,0.15)]">
          <p className="font-pretendard text-[12px] font-bold leading-[130%] tracking-[-0.24px] text-[#92929B]">
            최근 검색어
          </p>
          <ul className="w-full space-y-2">
            {['한식순대국', '로컬오마카세', '마라탕맛집'].map((word) => (
              <li key={word} className="flex items-center justify-between pb-1">
                <div className="flex gap-[10px]">
                  <img src="assets/icons/search.svg" alt="검색_아이콘" />
                  <span className="font-pretendard text-[16px] font-bold leading-[130%] tracking-[0.16px] text-[#171719]">
                    {word}
                  </span>
                </div>
                <button type="button">
                  <img src="assets/icons/exit.svg" alt="취소_아이콘" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SearchOverlay;
