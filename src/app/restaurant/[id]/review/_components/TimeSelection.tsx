import { cn } from '@/lib/utils';

const TIME_OPTIONS = ['오전', '점심', '오후', '저녁'];

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
        key={time}
        type="button"
        onClick={() => onChange(time)}
        className={cn(
          'box-border h-[83.5px] w-[244px] rounded-[9px] border bg-white text-[20px] font-normal leading-[130%] text-[#2E2E32]',
          value === time ? 'border-[2px] border-[#FA4D09]' : 'border-[#B6B6B6]',
        )}
      >
        {time}
      </button>
    ))}
  </div>
);

export default TimeSelection;
