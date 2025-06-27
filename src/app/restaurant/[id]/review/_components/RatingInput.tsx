export const RatingInput = ({
  ratings,
  onChange,
}: {
  ratings: number;
  onChange: (n: number) => void;
}) => {
  return (
    <div className="flex h-[50px] items-center justify-center gap-2">
      <span className="text-[#47474D text-[14px] font-medium leading-[130%]">
        한 번이면 충분해요
      </span>

      <div className="flex gap-[12px]">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={`${n}점`}
            className="flex h-[50px] w-[50px] items-center justify-center"
          >
            <Star filled={n <= ratings} />
          </button>
        ))}
      </div>
      <input type="hidden" name="rating" value={ratings} />

      <span className="text-[#47474D text-[14px] font-medium leading-[130%]">
        또 오고 싶어요
      </span>
    </div>
  );
};

const Star = ({ filled }: { filled: boolean }) => {
  return (
    <svg
      width="40"
      height="38"
      viewBox="0 0 40 38"
      fill={filled ? '#FA4D09' : '#C7C7CC'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.0979 1.8541C18.6966 0.011477 21.3034 0.0114808 21.9021 1.8541L25.1638 11.8926C25.4316 12.7167 26.1995 13.2746 27.0659 13.2746H37.621C39.5585 13.2746 40.364 15.7538 38.7966 16.8926L30.2574 23.0967C29.5564 23.606 29.2631 24.5088 29.5308 25.3328L32.7925 35.3713C33.3912 37.2139 31.2823 38.7462 29.7148 37.6074L21.1756 31.4033C20.4746 30.894 19.5254 30.894 18.8244 31.4033L10.2852 37.6074C8.71774 38.7462 6.60878 37.2139 7.20748 35.3713L10.4692 25.3328C10.7369 24.5088 10.4436 23.606 9.74265 23.0967L1.20338 16.8926C-0.364047 15.7538 0.441508 13.2746 2.37895 13.2746H12.9341C13.8005 13.2746 14.5684 12.7167 14.8362 11.8926L18.0979 1.8541Z" />
    </svg>
  );
};
