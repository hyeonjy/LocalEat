import Image from 'next/image';
import Link from 'next/link';

const cornerClasses = [
  'rounded-tl-[20px]', // index 0 → 왼쪽 상단
  'rounded-tr-[20px]', // index 1 → 오른쪽 상단
  'rounded-bl-[20px]', // index 2 → 왼쪽 하단
  'rounded-br-[20px]', // index 3 → 오른쪽 하단
];

const LocalEaterCollection = () => {
  return (
    <section>
      <div className="mx-auto w-full max-w-[1280px] gap-[10px] self-stretch rounded-[12px] px-[40px] py-[32px] min-[381px]:max-[721px]:px-[16px]">
        <div className="flex w-full items-end justify-between">
          <div className="w-full">
            <p className="pt-[30px] font-semibold leading-[130%] text-[#FA4D09] max-[721px]:text-[16px] min-[722px]:text-[24px]">
              맛집 탐방가 로컬잇터들의 동선 대공개!
            </p>
            <h2 className="font-bold leading-[130%] tracking-[0.4px] text-[#171719] max-[721px]:text-[24px] min-[722px]:text-[40px]">
              로컬잇터 컬렉션
            </h2>
          </div>

          <Link
            href=""
            className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#E2E2E4] bg-white lg:h-auto lg:w-[84px] lg:rounded-none lg:border-0 lg:bg-transparent lg:p-[2px] lg:text-center lg:text-[16px] lg:font-normal lg:leading-[130%] lg:text-[#787882]"
          >
            {/* 1024px 이상: 텍스트 */}
            <span className="hidden lg:block">전체보기</span>

            {/* 1024px 미만: 아이콘 */}
            <Image
              src="/assets/icons/arrow_outward.svg"
              alt="전체보기"
              width={12}
              height={12}
              className="block lg:hidden"
            />
          </Link>
        </div>
        <ul className="flex w-[100%] gap-6 pt-[12px]">
          <li>
            <div className="flex w-[282px] flex-col items-start overflow-hidden rounded-[20px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.15)]">
              {/* 이미지 그리드 */}
              <div className="relative w-full">
                <div className="flex flex-wrap gap-[2px] self-stretch rounded-t-[20px] bg-[#FFFFFF] p-[3px]">
                  {[1, 2, 3, 4].map((_, index) => (
                    <div
                      key={index}
                      className={`flex aspect-[137/131] w-[calc(50%-1px)] items-center justify-center bg-[#E5E5E5] text-[12px] text-[#999999] ${cornerClasses[index]}`}
                    >
                      이미지 {index + 1}
                    </div>
                  ))}
                </div>

                {/* 프로필 이미지 */}
                <div className="absolute -bottom-[28px] left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full bg-[#FFFFFF] p-[4px]">
                  <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#E5E5E5] text-[12px] text-[#999999]">
                    프로필
                  </div>
                </div>
              </div>

              {/* 프로필 이미지 아래 공간 확보 */}
              <div className="mt-[40px] flex w-full flex-col items-center gap-2 pb-4">
                <p className="text-[16px] font-semibold text-[#171719]">
                  장군쪼만
                </p>
                <p className="text-center text-[14px] text-[#8C8C8C]">
                  내가 가려고 만든 신림동 혼술 식당
                </p>
                <div className="flex items-center justify-center gap-2 text-[12px] text-[#8C8C8C]">
                  <span>좋아요 20</span>
                  <span className="h-[10px] w-[1px] bg-[#D9D9D9]"></span>
                  <span>댓글 130</span>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className="flex w-[282px] flex-col items-start overflow-hidden rounded-[20px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.15)]">
              {/* 이미지 그리드 */}
              <div className="relative w-full">
                <div className="flex flex-wrap gap-[2px] self-stretch rounded-t-[20px] bg-[#FFFFFF] p-[3px]">
                  {[1, 2, 3, 4].map((_, index) => (
                    <div
                      key={index}
                      className={`flex aspect-[137/131] w-[calc(50%-1px)] items-center justify-center bg-[#E5E5E5] text-[12px] text-[#999999] ${cornerClasses[index]}`}
                    >
                      이미지 {index + 1}
                    </div>
                  ))}
                </div>

                {/* 프로필 이미지 */}
                <div className="absolute -bottom-[28px] left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full bg-[#FFFFFF] p-[4px]">
                  <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#E5E5E5] text-[12px] text-[#999999]">
                    프로필
                  </div>
                </div>
              </div>

              {/* 프로필 이미지 아래 공간 확보 */}
              <div className="mt-[40px] flex w-full flex-col items-center gap-2 pb-4">
                <p className="text-[16px] font-semibold text-[#171719]">
                  장군쪼만
                </p>
                <p className="text-center text-[14px] text-[#8C8C8C]">
                  내가 가려고 만든 신림동 혼술 식당
                </p>
                <div className="flex items-center justify-center gap-2 text-[12px] text-[#8C8C8C]">
                  <span>좋아요 20</span>
                  <span className="h-[10px] w-[1px] bg-[#D9D9D9]"></span>
                  <span>댓글 130</span>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className="flex w-[282px] flex-col items-start overflow-hidden rounded-[20px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.15)]">
              {/* 이미지 그리드 */}
              <div className="relative w-full">
                <div className="flex flex-wrap gap-[2px] self-stretch rounded-t-[20px] bg-[#FFFFFF] p-[3px]">
                  {[1, 2, 3, 4].map((_, index) => (
                    <div
                      key={index}
                      className={`flex aspect-[137/131] w-[calc(50%-1px)] items-center justify-center bg-[#E5E5E5] text-[12px] text-[#999999] ${cornerClasses[index]}`}
                    >
                      이미지 {index + 1}
                    </div>
                  ))}
                </div>

                {/* 프로필 이미지 */}
                <div className="absolute -bottom-[28px] left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full bg-[#FFFFFF] p-[4px]">
                  <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#E5E5E5] text-[12px] text-[#999999]">
                    프로필
                  </div>
                </div>
              </div>

              {/* 프로필 이미지 아래 공간 확보 */}
              <div className="mt-[40px] flex w-full flex-col items-center gap-2 pb-4">
                <p className="text-[16px] font-semibold text-[#171719]">
                  장군쪼만
                </p>
                <p className="text-center text-[14px] text-[#8C8C8C]">
                  내가 가려고 만든 신림동 혼술 식당
                </p>
                <div className="flex items-center justify-center gap-2 text-[12px] text-[#8C8C8C]">
                  <span>좋아요 20</span>
                  <span className="h-[10px] w-[1px] bg-[#D9D9D9]"></span>
                  <span>댓글 130</span>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className="flex w-[282px] flex-col items-start overflow-hidden rounded-[20px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.15)]">
              {/* 이미지 그리드 */}
              <div className="relative w-full">
                <div className="flex flex-wrap gap-[2px] self-stretch rounded-t-[20px] bg-[#FFFFFF] p-[3px]">
                  {[1, 2, 3, 4].map((_, index) => (
                    <div
                      key={index}
                      className={`flex aspect-[137/131] w-[calc(50%-1px)] items-center justify-center bg-[#E5E5E5] text-[12px] text-[#999999] ${cornerClasses[index]}`}
                    >
                      이미지 {index + 1}
                    </div>
                  ))}
                </div>

                {/* 프로필 이미지 */}
                <div className="absolute -bottom-[28px] left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full bg-[#FFFFFF] p-[4px]">
                  <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#E5E5E5] text-[12px] text-[#999999]">
                    프로필
                  </div>
                </div>
              </div>

              {/* 프로필 이미지 아래 공간 확보 */}
              <div className="mt-[40px] flex w-full flex-col items-center gap-2 pb-4">
                <p className="text-[16px] font-semibold text-[#171719]">
                  장군쪼만
                </p>
                <p className="text-center text-[14px] text-[#8C8C8C]">
                  내가 가려고 만든 신림동 혼술 식당
                </p>
                <div className="flex items-center justify-center gap-2 text-[12px] text-[#8C8C8C]">
                  <span>좋아요 20</span>
                  <span className="h-[10px] w-[1px] bg-[#D9D9D9]"></span>
                  <span>댓글 130</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default LocalEaterCollection;
