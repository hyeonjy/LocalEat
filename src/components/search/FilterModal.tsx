import { FILTER_GROUPS } from '@/app/constants/filter';
import Image from 'next/image';

const FilterModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fix absolute left-0 top-[38px] z-[99] flex w-[396px] flex-col items-start justify-center gap-[20px] self-stretch overflow-hidden rounded-[16px] border-b border-[#E2E2E4] bg-white pt-[16px] shadow-[0_0_20px_0_rgba(0,0,0,0.15)]">
      <div className="flex w-full justify-between px-[24px]">
        <h2 className="text-[16px] font-bold leading-[130%] tracking-[0.16px] text-[#000]">
          로컬 필터
        </h2>
        <Image
          onClick={onClose}
          src="/assets/icons/exit.svg"
          alt="닫기"
          width={20}
          height={20}
          className="ml-auto cursor-pointer"
        />
      </div>
      <div className="flex h-[340px] flex-col items-start gap-[24px] overflow-y-auto border-t border-[#E2E2E4] bg-white px-[24px] pb-[24px] pt-[16px]">
        {/* 로컬잇 그룹만 렌더링 */}
        {FILTER_GROUPS.map((group) => (
          <div
            key={group.key}
            className="flex w-full flex-col items-start gap-2"
          >
            {/* 제목 */}
            <h3 className="text-base font-semibold leading-[150%] text-[#000]">
              {group.title}
            </h3>

            {/* 버튼 목록 */}
            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => (
                <button
                  key={option}
                  className="flex h-[30px] items-center justify-center gap-1 rounded-full border border-[#C7C7CC] bg-white px-3 py-2 text-sm text-[#2E2E32]"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-[9px] self-stretch bg-white px-[24px] py-[16px] shadow-[0_-2px_8px_rgba(0,0,0,0.1)]">
        {/* 초기화 버튼 */}
        <button className="flex h-[37px] flex-1 items-center justify-center gap-[4px] rounded-[8px] border border-[#C7C7CC] bg-white px-[20px] py-[8px] text-[#2E2E32]">
          초기화
        </button>

        {/* 필터 적용 버튼 */}
        <button className="flex h-[37px] flex-1 items-center justify-center gap-[4px] rounded-[8px] bg-[#FA4D09] px-[20px] py-[8px] text-white">
          필터 적용
        </button>
      </div>
    </div>
  );
};

export default FilterModal;
