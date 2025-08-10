import Image from 'next/image';

type ReviewToggleProps = {
  on: boolean;
  onToggle: () => void;
};

const ReviewToggle = ({ on, onToggle }: ReviewToggleProps) => {
  return (
    <div
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      className={`flex h-[20px] w-[36px] cursor-pointer items-center rounded-full p-[2px] transition-colors duration-300 ${
        on ? 'bg-[#FA4D09]' : 'bg-[#B6B6B6]'
      }`}
    >
      <div
        className={`flex h-[16px] w-[16px] items-center justify-center rounded-full transition-transform duration-300 ${on ? 'translate-x-[16px]' : 'translate-x-0'} `}
      >
        <Image
          src="/assets/icons/toggle.svg"
          alt="사진 리뷰 토글"
          width={16}
          height={16}
          className="pointer-events-none"
        />
      </div>
    </div>
  );
};

export default ReviewToggle;
