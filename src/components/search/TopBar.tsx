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

  const hasCriteria = !!(sp.get('q')?.trim() || sp.get('keywords'));

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const q = value.trim();

    // 기존 쿼리 유지(+ keywords 등), q만 갱신
    const params = new URLSearchParams(sp.toString());
    if (q) {
      params.set('q', q);
      params.delete('offset'); // 페이지네이션 초기화
    } else {
      params.delete('q');
      params.delete('offset');
    }

    const next = params.toString();
    router.push(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  const clearAllToFilterOnly = () => {
    // q, keywords, offset 제거 -> 필터만 상태
    const params = new URLSearchParams(sp.toString());
    params.delete('q');
    params.delete('keywords');
    params.delete('offset');

    setValue(''); // 입력창 비우기(옵션)
    const next = params.toString();
    router.push(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  const clearInput = () => setValue('');

  return (
    <>
      <div className="flex min-w-0 gap-2">
        {/* <1024px: 왼쪽 아이콘이 검색/뒤로가기로 토글 */}
        <form
          onSubmit={submit}
          className="flex w-full min-w-0 items-center gap-[8px] rounded-xl border-2 border-[#FA4D09] bg-white px-4 py-3 lg:max-w-[464px]"
        >
          {/* 모바일/태블릿(<=1024) 아이콘 */}
          {hasCriteria ? (
            <button
              type="button"
              aria-label="뒤로"
              className="shrink-0 lg:hidden"
              title="뒤로"
              onClick={clearAllToFilterOnly}
            >
              <Image
                src="/assets/icons/arrow_left.svg"
                alt="뒤로가기"
                width={24}
                height={24}
              />
            </button>
          ) : (
            <button
              type="submit"
              aria-label="검색"
              className="shrink-0 lg:hidden"
              title="검색"
            >
              <Image
                src="/assets/icons/search.svg"
                alt="검색 실행"
                width={24}
                height={24}
              />
            </button>
          )}

          {/* 입력창 */}
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="min-w-0 flex-1"
            placeholder="검색어를 입력하세요"
            aria-label="검색어 입력"
          />

          {/* 데스크탑(>=1024)에서는 항상 검색 아이콘 유지 */}
          <button
            type="submit"
            aria-label="검색"
            className="hidden shrink-0 lg:inline"
            title="검색"
          >
            <Image
              src="/assets/icons/search.svg"
              alt="검색 실행"
              width={24}
              height={24}
            />
          </button>

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
