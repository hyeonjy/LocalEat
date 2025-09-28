'use client';

import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useMemo, useRef, useState } from 'react';
import FilterBar from './FilterBar';
import FilterModal from './FilterModal';

const TopBar = ({ initialKeyword }: { initialKeyword: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState(initialKeyword ?? '');
  const [focused, setFocused] = useState(false);

  const hasCriteria = !!(sp.get('q')?.trim() || sp.get('keywords'));

  // 예시 자동완성 데이터 (API 연동 시 교체)
  const suggestions = useMemo(
    () => [
      '마포구 맛집',
      '마포구 냉면',
      '마포구 카페',
      '홍대 파스타',
      '연남동 디저트',
      '상수동 술집',
    ],
    [],
  );

  // value로 시작하는 첫 번째 추천어(자기 자신 제외)
  const hint = useMemo(() => {
    if (!value.trim()) return '';
    const v = value.trim().toLowerCase();
    const hit = suggestions.find(
      (s) => s.toLowerCase().startsWith(v) && s.toLowerCase() !== v,
    );
    return hit ?? '';
  }, [value, suggestions]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const q = value.trim();
    const params = new URLSearchParams(sp.toString());
    if (q) {
      params.set('q', q);
      params.delete('offset');
    } else {
      params.delete('q');
      params.delete('offset');
    }
    const next = params.toString();
    router.push(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  const clearAllToFilterOnly = () => {
    const params = new URLSearchParams(sp.toString());
    params.delete('q');
    params.delete('keywords');
    params.delete('offset');
    setValue('');
    const next = params.toString();
    router.push(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  const clearInput = () => setValue('');

  // 자동완성 클릭 시 채우고 제출(원하면 제출 제거 가능)
  const applyHintAndSubmit = () => {
    if (!hint) return;
    setValue(hint);
    setTimeout(() => submit(), 0);
  };

  // blur시 자동완성 박스가 클릭되기 전에 닫히지 않도록 약간 지연
  const blurTimeout = useRef<number | null>(null);
  const onBlurSafely = () => {
    blurTimeout.current = window.setTimeout(() => setFocused(false), 80);
  };
  const cancelBlurTimeout = () => {
    if (blurTimeout.current) {
      window.clearTimeout(blurTimeout.current);
      blurTimeout.current = null;
    }
  };

  const isDropdownOpen = focused && !!hint;

  return (
    <>
      <div className="flex min-w-0 gap-2">
        {/* 폭 동기화를 위한 래퍼 */}
        <div className="relative w-full lg:max-w-[464px]">
          <form
            onSubmit={submit}
            className={[
              'flex w-full min-w-0 items-center gap-[8px] bg-white px-4 py-3',
              'rounded-xl border-2 border-[#FA4D09]',
              // 드롭다운 열렸을 때 아래쪽을 분리해서 한 덩어리처럼 연결
              isDropdownOpen ? 'rounded-b-none border-b-0' : '',
            ].join(' ')}
          >
            {/* 모바일/태블릿 아이콘 토글 */}
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
              onFocus={() => setFocused(true)}
              onBlur={onBlurSafely}
              onKeyDown={(e) => {
                if (e.key === 'Escape') clearInput();
                if (e.key === 'ArrowDown' && hint) {
                  e.preventDefault();
                  applyHintAndSubmit();
                }
              }}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="검색어를 입력하세요"
              aria-label="검색어 입력"
              className="min-w-0 flex-1 bg-transparent text-[16px] text-[#171719] outline-none placeholder:text-[#8C8C8C] lg:text-[15px]"
            />

            {/* 데스크탑(>=1024) 검색 아이콘 */}
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

          {/* ✅ 자동완성: 입력 폭과 100% 동기화 + 정확히 하단에 밀착 */}
          {isDropdownOpen && (
            <div
              className={[
                'absolute left-0 right-0 top-full z-40 -mt-px', // 폼 바로 아래 1px 겹치기
                'rounded-b-[12px] border border-t-0 border-[#C7C7CC]',
                'bg-white px-4 py-3 text-left text-[15px] leading-[1.2]',
              ].join(' ')}
              onMouseDown={cancelBlurTimeout} // 클릭 시 blur 닫힘 방지
            >
              <p className="w-full font-[Pretendard] text-[12px] font-bold leading-[130%] tracking-[-0.24px] text-[#92929B]">
                자동완성
              </p>
              <ul className="mt-[10px]">
                <li className="flex gap-[10px]">
                  <Image
                    src="/assets/icons/map_avatar.svg"
                    alt="지도_아바타"
                    width={20}
                    height={20}
                  />
                  <div className="flex gap-[4px]">
                    <h4 className="text-base font-normal leading-[130%] text-[#171719] [font-family:'Pretendard']">
                      {hint}
                    </h4>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>

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
