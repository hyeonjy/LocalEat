'use client';
import FilterModal from '@/components/search/FilterModal';
import ReviewToggle from '@/components/search/ReviewToggle';
import { useState } from 'react';

const page = () => {
  const [photoOnly, setPhotoOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mx-auto mt-[64px] flex max-w-[1520px] items-start justify-center self-stretch px-[40px]">
        <section className="h-[1019px] w-[464px] overflow-hidden border-l border-[#E2E2E4]">
          <div className="flex w-[464px] max-w-[464px] flex-col items-start border-l border-[#E2E2E4]">
            <form className="flex w-[464px] flex-col items-start gap-[10px] px-[20px] pb-0 pt-[20px]">
              <input className="flex items-center gap-[8px] self-stretch rounded-[12px] border-[2px] border-[#FA4D09] bg-[#FFF] px-[20px] py-[16px]" />
            </form>
          </div>
          <div className="flex flex-col gap-[20px] self-stretch border-b border-[#E2E2E4] p-[20px]">
            <div className="relative flex gap-[8px] text-[14px]">
              <button
                onClick={() => setIsModalOpen(true)}
                type="button"
                className="flex h-[30px] cursor-pointer items-center justify-center gap-[4px] rounded-[20px] border border-[#FA4D09] bg-[#FEEDE6] px-[12px] py-[8px] text-[#FA4D09]"
              >
                <img src="assets/icons/tune.svg" /> 1
              </button>
              <span className="flex h-[30px] items-center justify-center gap-[4px] rounded-[20px] border border-[#FA4D09] bg-[#FEEDE6] px-[12px] py-[8px] text-[#FA4D09]">
                영업중
              </span>
              <span className="flex h-[30px] items-center justify-center gap-[4px] rounded-[20px] border border-[#C7C7CC] px-[12px] py-[8px] text-[#2E2E32]">
                브레이크타임
              </span>
              <span className="flex h-[30px] items-center justify-center gap-[4px] rounded-[20px] border border-[#C7C7CC] px-[12px] py-[8px] text-[#2E2E32]">
                휴무
              </span>
              <span className="flex h-[30px] items-center justify-center gap-[4px] rounded-[20px] border border-[#C7C7CC] px-[12px] py-[8px] text-[#2E2E32]">
                24시
              </span>
              {isModalOpen && (
                <FilterModal onClose={() => setIsModalOpen(false)} />
              )}
            </div>
            <div className="flex items-center gap-[5px]">
              <ReviewToggle
                on={photoOnly}
                onToggle={() => setPhotoOnly((prev) => !prev)}
              />
              <span className="font-pretendard text-[16px] font-normal leading-[130%] text-[#000]">
                사진 리뷰만 보기
              </span>
            </div>
          </div>
          <div>
            <div className="flex flex-col items-start gap-[10px] self-stretch border-b border-[#E2E2E4] bg-white pb-[12px] pl-[20px] pr-0 pt-[12px]">
              <div className="flex w-full justify-between pr-[20px]">
                <div className="flex flex-col">
                  <h2 className="flex items-center gap-[6px] text-[20px] font-semibold leading-[130%] tracking-[-0.3px] text-[#171719]">
                    돈가스진옥{' '}
                    <span className="text-[16px] font-normal leading-[130%] tracking-[-0.24px] text-[#787882]">
                      돈까스
                    </span>
                  </h2>
                  <div className="flex text-[16px] font-normal leading-[130%] text-[#171719]">
                    <img src="assets/icons/red_star.svg" />
                    3.5 리뷰 24
                  </div>
                </div>
                <img src="assets/icons/bookmark.svg" />
              </div>
              <ul className="flex w-[464px] gap-[8px] overflow-hidden">
                <li className="flex flex-col items-start overflow-hidden rounded-[12px]">
                  <div className="h-[170px] w-[170px] bg-[#ccc]">
                    {/*이미지 */}
                  </div>
                  <div className="w-[170px] rounded-[12px] bg-[#F4F4F5] p-[12px]">
                    <p className="line-clamp-3 overflow-hidden text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#5F5F68]">
                      안녕하세요. 이 곳에는 리뷰가 작성될 예정이오니 많은 관심과
                      참여 부탁드립니다. 앞으로도 종종 인사드리겠습니다.
                    </p>
                  </div>
                </li>
                <li className="flex flex-col items-start overflow-hidden rounded-[12px]">
                  <div className="h-[170px] w-[170px] bg-[#ccc]">
                    {/*이미지 */}
                  </div>
                  <div className="w-[170px] rounded-[12px] bg-[#F4F4F5] p-[12px]">
                    <p className="line-clamp-3 overflow-hidden text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#5F5F68]">
                      안녕하세요. 이 곳에는 리뷰가 작성될 예정이오니 많은 관심과
                      참여 부탁드립니다. 앞으로도 종종 인사드리겠습니다.
                    </p>
                  </div>
                </li>
                <li className="flex flex-col items-start overflow-hidden rounded-[12px]">
                  <div className="h-[170px] w-[170px] bg-[#ccc]">
                    {/*이미지 */}
                  </div>
                  <div className="w-[170px] rounded-[12px] bg-[#F4F4F5] p-[12px]">
                    <p className="line-clamp-3 overflow-hidden text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#5F5F68]">
                      안녕하세요. 이 곳에는 리뷰가 작성될 예정이오니 많은 관심과
                      참여 부탁드립니다. 앞으로도 종종 인사드리겠습니다.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div className="flex flex-col items-start gap-[10px] self-stretch border-b border-[#E2E2E4] bg-white pb-[12px] pl-[20px] pr-0 pt-[12px]">
              <div className="flex w-full justify-between pr-[20px]">
                <div className="flex flex-col">
                  <h2 className="flex items-center gap-[6px] text-[20px] font-semibold leading-[130%] tracking-[-0.3px] text-[#171719]">
                    돈가스진옥{' '}
                    <span className="text-[16px] font-normal leading-[130%] tracking-[-0.24px] text-[#787882]">
                      돈까스
                    </span>
                  </h2>
                  <div className="flex text-[16px] font-normal leading-[130%] text-[#171719]">
                    <img src="assets/icons/red_star.svg" />
                    3.5 리뷰 24
                  </div>
                </div>
                <img src="assets/icons/bookmark.svg" />
              </div>
              <ul className="flex w-[464px] gap-[8px] overflow-hidden">
                <li className="flex flex-col items-start overflow-hidden rounded-[12px]">
                  <div className="h-[170px] w-[170px] bg-[#ccc]">
                    {/*이미지 */}
                  </div>
                  <div className="w-[170px] rounded-[12px] bg-[#F4F4F5] p-[12px]">
                    <p className="line-clamp-3 overflow-hidden text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#5F5F68]">
                      안녕하세요. 이 곳에는 리뷰가 작성될 예정이오니 많은 관심과
                      참여 부탁드립니다. 앞으로도 종종 인사드리겠습니다.
                    </p>
                  </div>
                </li>
                <li className="flex flex-col items-start overflow-hidden rounded-[12px]">
                  <div className="h-[170px] w-[170px] bg-[#ccc]">
                    {/*이미지 */}
                  </div>
                  <div className="w-[170px] rounded-[12px] bg-[#F4F4F5] p-[12px]">
                    <p className="line-clamp-3 overflow-hidden text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#5F5F68]">
                      안녕하세요. 이 곳에는 리뷰가 작성될 예정이오니 많은 관심과
                      참여 부탁드립니다. 앞으로도 종종 인사드리겠습니다.
                    </p>
                  </div>
                </li>
                <li className="flex flex-col items-start overflow-hidden rounded-[12px]">
                  <div className="h-[170px] w-[170px] bg-[#ccc]">
                    {/*이미지 */}
                  </div>
                  <div className="w-[170px] rounded-[12px] bg-[#F4F4F5] p-[12px]">
                    <p className="line-clamp-3 overflow-hidden text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#5F5F68]">
                      안녕하세요. 이 곳에는 리뷰가 작성될 예정이오니 많은 관심과
                      참여 부탁드립니다. 앞으로도 종종 인사드리겠습니다.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div className="flex flex-col items-start gap-[10px] self-stretch border-b border-[#E2E2E4] bg-white pb-[12px] pl-[20px] pr-0 pt-[12px]">
              <div className="flex w-full justify-between pr-[20px]">
                <div className="flex flex-col">
                  <h2 className="flex items-center gap-[6px] text-[20px] font-semibold leading-[130%] tracking-[-0.3px] text-[#171719]">
                    돈가스진옥{' '}
                    <span className="text-[16px] font-normal leading-[130%] tracking-[-0.24px] text-[#787882]">
                      돈까스
                    </span>
                  </h2>
                  <div className="flex text-[16px] font-normal leading-[130%] text-[#171719]">
                    <img src="assets/icons/red_star.svg" />
                    3.5 리뷰 24
                  </div>
                </div>
                <img src="assets/icons/bookmark.svg" />
              </div>
              <ul className="flex w-[464px] gap-[8px] overflow-hidden">
                <li className="flex flex-col items-start overflow-hidden rounded-[12px]">
                  <div className="h-[170px] w-[170px] bg-[#ccc]">
                    {/*이미지 */}
                  </div>
                  <div className="w-[170px] rounded-[12px] bg-[#F4F4F5] p-[12px]">
                    <p className="line-clamp-3 overflow-hidden text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#5F5F68]">
                      안녕하세요. 이 곳에는 리뷰가 작성될 예정이오니 많은 관심과
                      참여 부탁드립니다. 앞으로도 종종 인사드리겠습니다.
                    </p>
                  </div>
                </li>
                <li className="flex flex-col items-start overflow-hidden rounded-[12px]">
                  <div className="h-[170px] w-[170px] bg-[#ccc]">
                    {/*이미지 */}
                  </div>
                  <div className="w-[170px] rounded-[12px] bg-[#F4F4F5] p-[12px]">
                    <p className="line-clamp-3 overflow-hidden text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#5F5F68]">
                      안녕하세요. 이 곳에는 리뷰가 작성될 예정이오니 많은 관심과
                      참여 부탁드립니다. 앞으로도 종종 인사드리겠습니다.
                    </p>
                  </div>
                </li>
                <li className="flex flex-col items-start overflow-hidden rounded-[12px]">
                  <div className="h-[170px] w-[170px] bg-[#ccc]">
                    {/*이미지 */}
                  </div>
                  <div className="w-[170px] rounded-[12px] bg-[#F4F4F5] p-[12px]">
                    <p className="line-clamp-3 overflow-hidden text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#5F5F68]">
                      안녕하세요. 이 곳에는 리뷰가 작성될 예정이오니 많은 관심과
                      참여 부탁드립니다. 앞으로도 종종 인사드리겠습니다.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section>
          <div className="h-[1019px] w-[976px] bg-[#ccc]">{/* 지도 */}</div>
        </section>
      </div>
    </>
  );
};

export default page;
