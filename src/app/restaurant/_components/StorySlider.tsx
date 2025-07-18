import { GraphicReviewProps } from '@/types/restaurant';
import Image from 'next/image';
import { useState } from 'react';
import StoryPreview from '../[id]/review/_components/StoryPreview';

const StorySlider = ({ stories }: { stories: GraphicReviewProps[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative h-[520px] w-full overflow-hidden">
        <div className="flex h-full items-center justify-center">
          {stories.map((story, index) => {
            const created_at = new Date(story.created_at);
            const isThisYear =
              created_at.getFullYear() === new Date().getFullYear();

            const formattedDate = isThisYear
              ? `${String(created_at.getMonth() + 1).padStart(2, '0')}.${String(created_at.getDate()).padStart(2, '0')}`
              : `${created_at.getFullYear()}.${String(created_at.getMonth() + 1).padStart(2, '0')}.${String(created_at.getDate()).padStart(2, '0')}`;

            // 현재 인덱스를 중심으로 5개 카드 표시
            const isCenter = index === currentIndex;
            const isLeft1 =
              index === (currentIndex - 1 + stories.length) % stories.length;
            const isLeft2 =
              index === (currentIndex - 2 + stories.length) % stories.length;
            const isRight1 = index === (currentIndex + 1) % stories.length;
            const isRight2 = index === (currentIndex + 2) % stories.length;

            const isVisible =
              isCenter || isLeft1 || isLeft2 || isRight1 || isRight2;
            if (!isVisible) return null;

            let positionClass = '';
            let sizeClass = '';

            if (isCenter) {
              positionClass = 'z-20';
              sizeClass = 'h-[494px] w-[290px] opacity-100';
            } else if (isLeft1) {
              positionClass = 'z-10 -translate-x-[314px]';
              sizeClass = 'h-[494px] w-[290px]';
            } else if (isLeft2) {
              positionClass = 'z-10 -translate-x-[628px]';
              sizeClass = 'h-[494px] w-[290px]';
            } else if (isRight1) {
              positionClass = 'z-10 translate-x-[314px]';
              sizeClass = 'h-[494px] w-[290px]';
            } else if (isRight2) {
              positionClass = 'z-10 translate-x-[628px]';
              sizeClass = 'h-[494px] w-[290px]';
            }

            return (
              <div
                key={story.id}
                className={`absolute cursor-pointer rounded-[16px] transition-all duration-300 ease-in-out ${positionClass} ${sizeClass}`}
                onClick={() => goToSlide(index)}
              >
                <div className="relative h-[440px] w-[290px] overflow-hidden rounded-t-[16px]">
                  <StoryPreview
                    backgroundImage={story.background_image_url}
                    elements={story.elements}
                    previewW={290}
                    previewH={440}
                  />

                  {/* 중앙이 아닌 카드에만 오버레이 */}
                  <div
                    className={`absolute inset-0 rounded-t-[16px] transition-all duration-300 ease-in-out ${
                      isCenter ? 'opacity-0' : 'opacity-100'
                    }`}
                    style={{ background: 'rgba(0, 0, 0, 0.50)' }}
                  ></div>

                  {(isLeft1 || isRight1) && (
                    <div className="absolute top-[40%] z-20 flex w-full flex-col items-center">
                      <Image
                        src={story.profile_image}
                        alt={story.nickname}
                        width={80}
                        height={80}
                        className="rounded-[50%] border-[2px] border-[#FA4D09] p-[2px]"
                      />
                      <p className="mt-[6px] text-[24px] font-semibold leading-[130%] text-white">
                        {story.nickname}
                      </p>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 flex w-full items-center justify-between overflow-hidden rounded-b-[16px] bg-[#2E2E32] px-[16px] py-[12px]">
                  <div className="flex items-center">
                    <Image
                      src={story.profile_image}
                      alt={story.nickname}
                      width={30}
                      height={30}
                      className="mr-[4px] h-[30px] w-[30px] rounded-[50%] bg-white"
                    />
                    <p className="text-[14px] font-semibold leading-[130%] text-white">
                      {story.nickname}
                    </p>
                  </div>
                  <p className="text-[14px] font-normal leading-[100%] text-white">
                    {formattedDate} • {story.visit_count}번째 방문
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {stories.length > 1 && (
          <>
            {/* 이전 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-[calc(50%-145px-25px)] top-1/2 z-50 flex h-[48px] w-[48px] -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50"
            >
              <Image
                src="/assets/icons/arrow_right.svg"
                alt="이전"
                width={24}
                height={24}
                className="rotate-180"
              />
            </button>

            {/* 다음 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-[calc(50%-145px-25px)] top-1/2 z-50 flex h-[48px] w-[48px] -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50"
            >
              <Image
                src="/assets/icons/arrow_right.svg"
                alt="다음"
                width={24}
                height={24}
              />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StorySlider;
