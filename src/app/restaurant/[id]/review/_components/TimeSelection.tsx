import { cn } from '@/lib/utils';

const TIME_OPTIONS = [
  { ko: '오전', eng: 'morning' },
  { ko: '점심', eng: 'lunch' },
  { ko: '오후', eng: 'afternoon' },
  { ko: '저녁', eng: 'dinner' },
];

const TimeSelection = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (time: string) => void;
}) => (
  <div className="flex flex-col gap-[12px]">
    {TIME_OPTIONS.map((time) => (
      <button
        key={time.eng}
        type="button"
        onClick={() => onChange(time.eng)}
        className={cn(
          'box-border h-[83.5px] w-[244px] rounded-[9px] border bg-white text-[20px] font-normal leading-[130%] text-[#2E2E32]',
          value === time.eng
            ? 'border-[2px] border-[#FA4D09]'
            : 'border-[#B6B6B6]',
        )}
      >
        {time.ko}
      </button>
    ))}
  </div>
);

export default TimeSelection;
