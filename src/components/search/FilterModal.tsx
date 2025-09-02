'use client';

import { FILTER_GROUPS } from '@/app/constants/filter';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

const FilterModal = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 🔹 기본 '전체' 옵션 자동 선택 로직 (로컬 그룹에서 '전체'가 있을 때)
  const defaultKeywords = useMemo<string[]>(() => {
    const localGroup =
      FILTER_GROUPS.find(
        (g) => g.key === 'localit' || /로컬/.test(g.title || ''),
      ) || FILTER_GROUPS[0];
    const hasAll = localGroup?.options?.includes('전체');
    return hasAll ? ['전체'] : [];
  }, []);

  // URL -> 초기 선택값 (없으면 defaultKeywords 적용)
  const initialSelected = useMemo(() => {
    try {
      const raw = searchParams.get('keywords');
      const arr = raw ? (JSON.parse(raw) as unknown) : [];
      if (!Array.isArray(arr)) return defaultKeywords;
      const onlyStr = arr.filter((v): v is string => typeof v === 'string');
      const deduped = onlyStr.filter((v, i) => onlyStr.indexOf(v) === i);
      return deduped.length ? deduped : defaultKeywords;
    } catch {
      return defaultKeywords;
    }
  }, [searchParams, defaultKeywords]);

  const [selected, setSelected] = useState<string[]>(initialSelected);

  const toggle = (opt: string) =>
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt],
    );

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (selected.length) params.set('keywords', JSON.stringify(selected));
    else params.delete('keywords');
    // 페이징 초기화가 필요하면 offset 제거
    params.delete('offset');

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    onClose();
  };

  const reset = () => setSelected(defaultKeywords);

  const tagBtnClass = (active: boolean) =>
    [
      'flex h-[30px] items-center justify-center gap-1 rounded-full px-3 py-2 text-sm',
      active
        ? 'border border-[#FA4D09] bg-[#FEEDE6] text-[#FA4D09]'
        : 'border border-[#C7C7CC] bg-white text-[#2E2E32]',
    ].join(' ');

  return (
    <>
      {/* ====== 모바일: 바텀시트 ====== */}
      <div className="lg:hidden">
        <div
          className="fixed inset-0 z-[998] bg-black/40"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-x-0 bottom-0 z-[999] flex h-[65vh] max-h-[85vh] w-full flex-col rounded-t-2xl bg-white shadow-[0_-8px_24px_rgba(0,0,0,0.2)]"
        >
          <div className="flex items-center justify-between border-b border-[#E2E2E4] px-4 py-3">
            <h2 className="text-[16px] font-bold leading-[130%] tracking-[0.16px] text-[#000]">
              로컬 필터
            </h2>
            <button onClick={onClose} aria-label="닫기" className="p-1">
              <Image
                src="/assets/icons/exit.svg"
                alt="닫기"
                width={20}
                height={20}
              />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-3">
            {FILTER_GROUPS.map((group) => (
              <div key={group.key} className="mb-6 flex w-full flex-col gap-2">
                <h3 className="text-base font-semibold leading-[150%] text-[#000]">
                  {group.title}
                </h3>

                {/* 버튼 박스: 너비 331px */}
                <div className="flex w-[331px] max-w-full flex-wrap gap-2">
                  {group.options.map((option) => {
                    const active = selected.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        className={tagBtnClass(active)}
                        onClick={() => toggle(option)}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* 풋터 */}
          <div
            className="flex items-center justify-center gap-[9px] border-t border-[#E2E2E4] bg-white px-4 py-4"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}
          >
            <button
              type="button"
              onClick={reset}
              className="flex h-[44px] flex-1 items-center justify-center gap-[4px] rounded-[8px] border border-[#C7C7CC] bg-white px-[20px] text-[#2E2E32]"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={applyFilters}
              className="flex h-[44px] flex-1 items-center justify-center gap-[4px] rounded-[8px] bg-[#FA4D09] px-[20px] text-white"
            >
              필터 적용
            </button>
          </div>
        </div>
      </div>

      {/* ====== 데스크탑: 트리거 버튼 바로 아래 8px (FilterBar의 relative 기준) ====== */}
      <div className="absolute left-0 top-[calc(100%+8px)] z-[999] hidden w-[396px] flex-col overflow-hidden rounded-[16px] border border-[#E2E2E4] bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.15)] lg:flex">
        <div className="flex w-full items-center justify-between px-[24px] py-[16px]">
          <h2 className="text-[16px] font-bold leading-[130%] tracking-[0.16px] text-[#000]">
            로컬 필터
          </h2>
          <button onClick={onClose} aria-label="닫기" className="ml-auto">
            <Image
              src="/assets/icons/exit.svg"
              alt="닫기"
              width={20}
              height={20}
            />
          </button>
        </div>

        <div className="flex max-h-[340px] flex-col gap-[24px] overflow-y-auto border-t border-[#E2E2E4] bg-white px-[24px] pb-[24px] pt-[16px]">
          {FILTER_GROUPS.map((group) => (
            <div key={group.key} className="flex w-full flex-col gap-2">
              <h3 className="text-base font-semibold leading-[150%] text-[#000]">
                {group.title}
              </h3>

              {/* 버튼 박스: 너비 331px */}
              <div className="flex w-[331px] max-w-full flex-wrap gap-2">
                {group.options.map((option) => {
                  const active = selected.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      className={tagBtnClass(active)}
                      onClick={() => toggle(option)}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-[9px] border-t border-[#E2E2E4] bg-white px-[24px] py-[16px]">
          <button
            type="button"
            onClick={reset}
            className="flex h-[37px] flex-1 items-center justify-center gap-[4px] rounded-[8px] border border-[#C7C7CC] bg-white px-[20px] text-[#2E2E32]"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={applyFilters}
            className="flex h-[37px] flex-1 items-center justify-center gap-[4px] rounded-[8px] bg-[#FA4D09] px-[20px] text-white"
          >
            필터 적용
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterModal;
