'use client';

import { useSearchStore } from '@/store/overlayStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SearchOverlay = () => {
  const closeSearch = useSearchStore((state) => state.close);
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  const submit = () => {
    const q = keyword.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* 배경 */}
      <div className="fixed inset-0 z-20 bg-black/50" onClick={closeSearch} />

      {/* 패널 */}
      <div
        className="fixed left-0 top-16 z-40 h-[502px] w-full bg-white px-4 pb-[120px] pt-[40px] shadow-md lg:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 제목 */}
        <h2 className="font-pretendard /* ✅ 375–721px 에서 24px */ text-center text-[40px] font-bold leading-[130%] tracking-[0.4px] text-[#171719] min-[375px]:max-[721px]:text-[24px]">
          이번 주 <span className="text-[#007558]">어디서</span> 먹지?
        </h2>
        <p className="font-pretendard text-center text-[16px] font-semibold leading-[130%] tracking-[0.16px] text-[#92929B] min-[375px]:max-[721px]:mt-[8px]">
          지나쳤던 골목, 알고 보니 맛집 핫플
        </p>

        {/* 검색창: 고정폭 → 가변폭 */}
        <div className="relative mx-auto mt-6 w-full max-w-[712px]">
          <input
            type="text"
            placeholder="지역명 입력"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className="flex w-full items-center justify-between self-stretch rounded-[12px] border border-[#ADADB3] bg-white p-5"
          />
          <button
            type="button"
            onClick={submit}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <img src="assets/icons/search.svg" alt="검색_아이콘" />
          </button>
        </div>

        {/* 최근 검색어: 고정폭 → 가변폭 */}
        <div className="mx-auto mt-[4px] flex w-full max-w-[712px] flex-col items-start justify-center gap-[16px] self-stretch rounded-[12px] bg-white p-5 shadow-[0_0_4px_0_rgba(0,0,0,0.15)]">
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

        {/* ✅ 375–721px 전용 블록 (최근 검색어 밑에 나타남) */}
        <div className="mx-auto mt-[32px] hidden w-full max-w-[712px] flex-col items-center justify-center gap-1 text-center min-[375px]:max-[721px]:flex">
          {/* 필요 컨텐츠를 여기에 넣어줘 (예: 힌트/푸터/태그 등) */}
          <Image
            src="/assets/icons/search_gray.svg"
            alt="검색_아이콘"
            width={24}
            height={24}
          />
          <span className="text-[12px] text-[#92929B]">
            동네+음식 조합으로
            <br />
            맛집을 더 쉽게 찾을 수 있습니다.
          </span>
        </div>
      </div>
    </>
  );
};

export default SearchOverlay;
