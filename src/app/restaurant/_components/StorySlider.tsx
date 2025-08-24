import { GraphicReviewProps } from '@/types/restaurant';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import StoryPreview from '../[id]/review/_components/StoryPreview';

const StorySlider = ({ stories }: { stories: GraphicReviewProps[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screenSize, setScreenSize] = useState<'sm' | 'md' | 'lg'>('md');

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth >= 1024) {
        setScreenSize('lg');
      } else if (window.innerWidth >= 600) {
        setScreenSize('md');
      } else {
        setScreenSize('sm');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // 화면 크기별 슬라이더 기준
  // sm (600px 미만): 3개 이상일 때 슬라이더
  // md (600px 이상): 3개 이상일 때 슬라이더
  // lg (1024px 이상): 5개 이상일 때 슬라이더
  const shouldUseSlider =
    screenSize === 'lg' ? stories.length >= 5 : stories.length >= 3;

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative h-[358px] w-full overflow-hidden min-[600px]:h-[524px]">
        <div
          className={`flex h-full items-center gap-[24px] ${shouldUseSlider ? 'justify-center' : 'justify-start'}`}
        >
          {stories.map((story, index) => {
            const created_at = new Date(story.created_at);
            const isThisYear =
              created_at.getFullYear() === new Date().getFullYear();

            const formattedDate = isThisYear
              ? `${String(created_at.getMonth() + 1).padStart(2, '0')}.${String(created_at.getDate()).padStart(2, '0')}`
              : `${created_at.getFullYear()}.${String(created_at.getMonth() + 1).padStart(2, '0')}.${String(created_at.getDate()).padStart(2, '0')}`;

            // 화면 크기에 따라 슬라이더 사용 여부 결정
            const useSlider = shouldUseSlider;

            if (useSlider) {
              // 슬라이더 로직: 현재 인덱스를 중심으로 5개 카드 표시
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

              let transformClass = '';
              let sizeClass = '';

              if (isCenter) {
                transformClass = 'z-20';
                sizeClass =
                  screenSize === 'sm'
                    ? 'h-[298px] w-[182px] opacity-100'
                    : 'h-[524px] w-[320px] opacity-100';
              } else if (isLeft1) {
                transformClass =
                  screenSize === 'sm'
                    ? 'z-10 -translate-x-[189px]' // 165px + 24px gap
                    : 'z-10 -translate-x-[344px]'; // 320px + 24px gap
                sizeClass =
                  screenSize === 'sm'
                    ? 'h-[280px] w-[165px]'
                    : 'h-[494px] w-[320px]';
              } else if (isLeft2) {
                transformClass =
                  screenSize === 'sm'
                    ? 'z-10 -translate-x-[378px]' // (165px + 24px gap) * 2
                    : 'z-10 -translate-x-[688px]'; // (320px + 24px gap) * 2
                sizeClass =
                  screenSize === 'sm'
                    ? 'h-[280px] w-[165px]'
                    : 'h-[494px] w-[320px]';
              } else if (isRight1) {
                transformClass =
                  screenSize === 'sm'
                    ? 'z-10 translate-x-[189px]' // 165px + 24px gap
                    : 'z-10 translate-x-[344px]'; // 320px + 24px gap
                sizeClass =
                  screenSize === 'sm'
                    ? 'h-[280px] w-[165px]'
                    : 'h-[494px] w-[320px]';
              } else if (isRight2) {
                transformClass =
                  screenSize === 'sm'
                    ? 'z-10 translate-x-[378px]' // (165px + 24px gap) * 2
                    : 'z-10 translate-x-[688px]'; // (320px + 24px gap) * 2
                sizeClass =
                  screenSize === 'sm'
                    ? 'h-[280px] w-[165px]'
                    : 'h-[494px] w-[320px]';
              }

              return (
                <div
                  key={story.id}
                  className={`absolute cursor-pointer rounded-[16px] ${transformClass} ${sizeClass}`}
                  onClick={() => goToSlide(index)}
                >
                  <div
                    className={`relative overflow-hidden rounded-t-[16px] ${
                      screenSize === 'sm'
                        ? isCenter
                          ? 'h-[268px] w-[182px]'
                          : 'h-[250px] w-[165px]'
                        : isCenter
                          ? 'h-[470px] w-[320px]'
                          : 'h-[440px] w-[320px]'
                    }`}
                  >
                    <StoryPreview
                      backgroundImage={story.background_image_url}
                      elements={story.elements}
                      previewW={
                        screenSize === 'sm' ? (isCenter ? 182 : 165) : 320
                      }
                      previewH={
                        screenSize === 'sm'
                          ? isCenter
                            ? 268
                            : 250
                          : isCenter
                            ? 470
                            : 440
                      }
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
                          className="h-[60px] w-[60px] rounded-[50%] border-[2px] border-[#FA4D09] p-[2px] min-[600px]:h-[80px] min-[600px]:w-[80px]"
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
                        className="mr-[4px] h-[15px] w-[15px] rounded-[50%] bg-white min-[600px]:h-[30px] min-[600px]:w-[30px]"
                      />
                      <p className="text-[7px] font-semibold leading-[130%] text-white min-[600px]:text-[14px]">
                        {story.nickname}
                      </p>
                    </div>
                    <p className="text-[7px] font-normal leading-[100%] text-white min-[600px]:text-[14px]">
                      {formattedDate} • {story.visit_count}번째 방문
                    </p>
                  </div>
                </div>
              );
            } else {
              // 슬라이더 사용하지 않을 때: 정렬된 레이아웃
              return (
                <div
                  key={story.id}
                  className={`relative cursor-pointer rounded-[16px] ${
                    screenSize === 'sm'
                      ? 'h-[280px] w-[165px]'
                      : 'h-[494px] w-[320px]'
                  }`}
                  onClick={() => goToSlide(index)}
                >
                  <div
                    className={`relative overflow-hidden rounded-t-[16px] ${
                      screenSize === 'sm'
                        ? 'h-[250px] w-[165px]'
                        : 'h-[440px] w-[320px]'
                    }`}
                  >
                    <StoryPreview
                      backgroundImage={story.background_image_url}
                      elements={story.elements}
                      previewW={screenSize === 'sm' ? 165 : 320}
                      previewH={screenSize === 'sm' ? 250 : 440}
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 flex w-full items-center justify-between overflow-hidden rounded-b-[16px] bg-[#2E2E32] px-[16px] py-[12px]">
                    <div className="flex items-center bg-red-200">
                      <Image
                        src={story.profile_image}
                        alt={story.nickname}
                        width={30}
                        height={30}
                        className="mr-[4px] h-[15px] w-[15px] rounded-[50%] bg-white md:h-[30px] md:w-[30px]"
                      />
                      <p className="text-[7px] font-semibold leading-[130%] text-white min-[600px]:text-[14px]">
                        {story.nickname}
                      </p>
                    </div>
                    <p className="text-[7px] font-normal leading-[100%] text-white min-[600px]:text-[14px]">
                      {formattedDate} • {story.visit_count}번째 방문
                    </p>
                  </div>
                </div>
              );
            }
          })}
        </div>

        {/* 화살표 버튼: 슬라이더 사용할 때만 표시 */}
        {shouldUseSlider && stories.length > 1 && (
          <>
            {/* 이전 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-[calc(50%-91px-24px)] top-1/2 z-50 flex h-[48px] w-[48px] -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 min-[600px]:left-[calc(50%-160px-24px)]"
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
              className="absolute right-[calc(50%-91px-24px)] top-1/2 z-50 flex h-[48px] w-[48px] -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 min-[600px]:right-[calc(50%-160px-24px)]"
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
