'use client';

import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import FilterBar from './FilterBar';
import FilterModal from './FilterModal';

const TopBar = ({ initialKeyword }: { initialKeyword: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState(initialKeyword ?? '');

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const q = value.trim();

    // 기존 쿼리 유지(+ keywords 등), q만 갱신
    const params = new URLSearchParams(sp.toString());
    if (q) {
      params.set('q', q);
      // 페이지네이션 파라미터 같은 건 초기화하고 싶다면 여기서 삭제
      params.delete('offset');
    } else {
      params.delete('q');
      params.delete('offset');
    }

    const next = params.toString();
    router.push(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  const clearInput = () => setValue('');

  return (
    <>
      <div className="flex min-w-0 gap-2">
        {/* <1024px: 꽉 차고, >=1024px: 464px까지 */}
        <form
          onSubmit={submit}
          className="flex w-full min-w-0 items-center gap-[8px] rounded-xl border-2 border-[#FA4D09] bg-white px-4 py-3 lg:max-w-[464px]"
        >
          <button
            type="submit"
            aria-label="검색"
            className="shrink-0"
            title="검색"
          >
            <Image
              src="/assets/icons/search.svg"
              alt="검색 실행"
              width={24}
              height={24}
            />
          </button>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="min-w-0 flex-1"
            placeholder="검색어를 입력하세요"
            aria-label="검색어 입력"
          />
          {/* 제출 버튼(돋보기) */}
          {/* <button
            type="submit"
            aria-label="검색"
            className="shrink-0"
            title="검색"
          >
            <Image
              src="/assets/icons/search.svg"
              alt="검색 실행"
              width={24}
              height={24}
            />
          </button> */}
          {/* 지우기 버튼 */}
          <button
            type="button"
            onClick={clearInput}
            aria-label="입력 지우기"
            className="shrink-0"
            title="지우기"
          >
            <Image
              src="/assets/icons/exit.svg"
              alt="취소_아이콘"
              width={24}
              height={24}
            />
          </button>
        </form>

        {isModalOpen && <FilterModal onClose={() => setIsModalOpen(false)} />}
      </div>

      {/* PC 전용 필터바 */}
      <div className="hidden lg:block lg:pt-[16px]">
        <FilterBar />
      </div>
    </>
  );
};

export default TopBar;
