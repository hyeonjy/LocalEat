'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TopRestaurantProps } from '@/types/restaurant';
import Image from 'next/image';
import RestaurantList from './RestaurantList';

type LocalEatTabProps = {
  topRatedRestaurants: TopRestaurantProps[];
  topRecentRestaurants: TopRestaurantProps[];
};

const LocalEatTab = ({
  topRatedRestaurants,
  topRecentRestaurants,
}: LocalEatTabProps) => {
  console.log('top: ', topRatedRestaurants);

  return (
    <div className="mt-[87px]">
      <Tabs defaultValue="top10" className="w-full">
        <TabsList className="mx-auto mt-[23px] flex max-w-[1200px] border-b-0">
          <TabsTrigger
            value="top10"
            className="relative pb-1 text-xl font-semibold text-gray-400 focus-visible:ring-0 data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-[2px] data-[state=active]:after:w-full data-[state=active]:after:bg-black data-[state=active]:after:content-['']"
          >
            로컬잇 TOP 10
          </TabsTrigger>
          <TabsTrigger
            value="recent"
            className="relative pb-1 text-xl font-semibold text-gray-400 focus-visible:ring-0 data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-[2px] data-[state=active]:after:w-full data-[state=active]:after:bg-black data-[state=active]:after:content-['']"
          >
            NEW 로컬잇
          </TabsTrigger>
        </TabsList>

        <TabsContent value="top10" className="mt-0 flex flex-col items-center">
          {/* mobile */}
          <section className="block h-[752px] w-full overflow-hidden bg-[url('/assets/icons/top1.png')] bg-cover bg-center bg-no-repeat px-[16px] py-[48px] md:hidden">
            <div className="mb-[32px] flex flex-col">
              <div className="flex h-[126px] flex-col">
                <h2 className="text-[32px] font-bold leading-[130%] text-white">
                  로컬잇픽
                </h2>
                <h2 className="text-[32px] font-bold leading-[130%] text-white">
                  마포구 맛집
                </h2>
                <h2 className="text-[32px] font-bold leading-[130%] text-white">
                  TOP 10
                </h2>
              </div>

              <div className="flex h-[48px] flex-col">
                <p className="text-[16px] font-semibold leading-[150%] text-white">
                  방문 횟수, 리뷰를 바탕으로 검증된
                </p>
                <p className="text-[16px] font-semibold leading-[150%] text-white">
                  로컬 맛집만 소개합니다.
                </p>
              </div>

              <div className="mt-[8px] flex items-center gap-[4px] text-[12px] font-medium leading-[130%] text-[#E2E2E4]">
                <Image
                  alt="중요알림_아이콘"
                  src="assets/icons/union.svg"
                  width={15}
                  height={15}
                />
                <span>매주 수요일 업데이트 · 현재 기준일: 8.27</span>
              </div>

              <div className="relative mt-[32px]">
                <input
                  className="h-[52px] w-full flex-shrink-0 items-center rounded-[12px] border border-[#ADADB3] bg-white p-[10px] text-[16px] font-normal leading-[130%]"
                  type="search"
                  placeholder="지역명을 입력하세요"
                />
                <img
                  className="absolute right-[20px] top-1/2 -translate-y-1/2"
                  alt="검색_아이콘"
                  src="assets/icons/search.svg"
                />
              </div>

              <div className="mt-[8px] flex w-full">
                <button
                  type="button"
                  className="flex h-[52px] w-full items-center justify-center gap-[4px] whitespace-nowrap rounded-[13px] border border-[#ADADB3] bg-[#FFF] p-[10px] text-center text-[16px] font-normal leading-[130%] text-[#171719]"
                >
                  <Image
                    alt="위치탐색_아이콘"
                    src="assets/icons/mylocation.svg"
                    width={20}
                    height={20}
                  />
                  서울 전체
                </button>
              </div>
            </div>
            <div className="flex w-full justify-center">
              <Image
                src="/assets/icons/map.png"
                alt="mapimage"
                width={278}
                height={272}
              />
            </div>
          </section>

          {/* tablet, desktop */}
          <section className="hidden h-[265px] w-full overflow-hidden bg-[url('/assets/icons/top1.png')] bg-cover bg-center bg-no-repeat md:block lg:h-[378px]">
            <div className="mx-auto flex h-full items-center justify-between px-[30px] xl:px-[100px]">
              <div className="mx-auto flex h-full max-w-[904px] flex-col justify-center lg:max-w-[1200px]">
                <h2 className="font-[Pretendard] text-[24px] font-semibold leading-[130%] tracking-[0.4px] text-white lg:text-[40px] lg:font-bold">
                  로컬잇픽 우리 동네 맛집 TOP 10
                </h2>
                <p className="mt-[8px] font-[Pretendard] text-[14px] font-semibold leading-[130%] tracking-[-0.3px] text-white lg:text-[20px]">
                  방문 횟수, 리뷰를 바탕으로 검증된 로컬 맛집만 소개합니다.
                </p>
                <div className="mt-[24px] flex gap-[4px] lg:mt-[32px]">
                  <button
                    type="button"
                    className="flex h-[44px] items-center gap-[4px] whitespace-nowrap rounded-[13px] border border-[#ADADB3] bg-[#FFF] p-[10px] text-[14px] font-normal leading-[130%] text-[#171719] lg:h-[64px] lg:gap-[10px] lg:p-[10px_16px] lg:text-[16px]"
                  >
                    <Image
                      alt="위치탐색_아이콘"
                      src="assets/icons/mylocation.svg"
                      className="h-[18.333px] w-[18.333px] lg:h-[22px] lg:w-[22px]"
                      width={22}
                      height={22}
                    />
                    서울 전체
                  </button>
                  <div className="relative">
                    <input
                      className="h-[44px] w-[275px] flex-shrink-0 items-center rounded-[12px] border border-[#ADADB3] bg-white px-5 py-3 text-[14px] font-normal leading-[100%] lg:h-[64px] lg:w-[405px] lg:p-5 lg:text-[16px] lg:leading-[130%]"
                      type="search"
                      placeholder="지역명을 입력하세요"
                    />
                    <img
                      className="absolute right-[20px] top-1/2 -translate-y-1/2"
                      alt="검색_아이콘"
                      src="assets/icons/search.svg"
                    />
                  </div>
                </div>
              </div>
              <Image
                src="/assets/icons/map.png"
                alt="mapimage"
                width={470}
                height={470}
                className="h-[378px] w-[378px] lg:h-[430px] lg:w-[430px]"
              />
            </div>
          </section>

          <section className="w-full max-w-[1280px] md:px-[40px] md:py-[32px]">
            <div className="mx-auto mb-[12px] flex items-center gap-[4px] font-[Pretendard] text-[14px] font-semibold leading-[130%] text-[#92929B]">
              <img alt="중요알림_아이콘" src="assets/icons/error_outline.svg" />
              <span>매주 수요일 업데이트 · 현재 기준일: 8.27</span>
            </div>

            <RestaurantList
              restaurants={topRatedRestaurants}
              isTopRated={true}
            />
          </section>
        </TabsContent>

        <TabsContent value="recent" className="mt-0 flex flex-col items-center">
          {/* mobile */}
          <section className="block h-[752px] w-full overflow-hidden bg-[url('/assets/icons/top2.png')] bg-cover bg-center bg-no-repeat px-[16px] py-[48px] md:hidden">
            <div className="mb-[32px] flex flex-col">
              <div className="flex h-[84px] flex-col">
                <h2 className="text-[32px] font-bold leading-[130%] text-white">
                  NEW EAT 10
                </h2>
                <h2 className="text-[32px] font-bold leading-[130%] text-white">
                  마포구 맛집
                </h2>
              </div>

              <div className="flex h-[48px] flex-col">
                <p className="text-[16px] font-semibold leading-[150%] text-white">
                  우리 동네에 새로 생긴 인기 맛집,
                </p>
                <p className="text-[16px] font-semibold leading-[150%] text-white">
                  가장 먼저 만나보기!
                </p>
              </div>

              <div className="mt-[8px] flex items-center gap-[4px] text-[12px] font-medium leading-[130%] text-[#E2E2E4]">
                <Image
                  alt="중요알림_아이콘"
                  src="assets/icons/union.svg"
                  width={15}
                  height={15}
                />
                <span>매주 수요일 업데이트 · 현재 기준일: 8.27</span>
              </div>

              <div className="relative mt-[32px]">
                <input
                  className="h-[52px] w-full flex-shrink-0 items-center rounded-[12px] border border-[#ADADB3] bg-white p-[10px] text-[16px] font-normal leading-[130%]"
                  type="search"
                  placeholder="지역명을 입력하세요"
                />
                <img
                  className="absolute right-[20px] top-1/2 -translate-y-1/2"
                  alt="검색_아이콘"
                  src="assets/icons/search.svg"
                />
              </div>

              <div className="mt-[8px] flex w-full">
                <button
                  type="button"
                  className="flex h-[52px] w-full items-center justify-center gap-[4px] whitespace-nowrap rounded-[13px] border border-[#ADADB3] bg-[#FFF] p-[10px] text-center text-[16px] font-normal leading-[130%] text-[#171719]"
                >
                  <Image
                    alt="위치탐색_아이콘"
                    src="assets/icons/mylocation.svg"
                    width={20}
                    height={20}
                  />
                  서울 전체
                </button>
              </div>
            </div>
            <div className="flex w-full justify-center">
              <Image
                src="/assets/icons/map.png"
                alt="mapimage"
                width={278}
                height={272}
              />
            </div>
          </section>

          {/* tablet, desktop */}
          <section className="hidden h-[265px] w-full overflow-hidden bg-[url('/assets/icons/top2.png')] bg-cover bg-center bg-no-repeat md:block lg:h-[378px]">
            <div className="mx-auto flex h-full items-center justify-between px-[30px] xl:px-[100px]">
              <div className="mx-auto flex h-full max-w-[904px] flex-col justify-center lg:max-w-[1200px]">
                <h2 className="font-[Pretendard] text-[24px] font-semibold leading-[130%] tracking-[0.4px] text-white lg:text-[40px] lg:font-bold">
                  NEW EAT 10 서울 맛집
                </h2>
                <p className="mt-[8px] font-[Pretendard] text-[14px] font-semibold leading-[130%] tracking-[-0.3px] text-white lg:text-[20px]">
                  우리 동네에 새로 생긴 인기 맛집, 가장 먼저 만나보기!
                </p>
                <div className="mt-[24px] flex gap-[4px] lg:mt-[32px]">
                  <button
                    type="button"
                    className="flex h-[44px] items-center gap-[4px] whitespace-nowrap rounded-[13px] border border-[#ADADB3] bg-[#FFF] p-[10px] text-[14px] font-normal leading-[130%] text-[#171719] lg:h-[64px] lg:gap-[10px] lg:p-[10px_16px] lg:text-[16px]"
                  >
                    <Image
                      alt="위치탐색_아이콘"
                      src="assets/icons/mylocation.svg"
                      className="h-[18.333px] w-[18.333px] lg:h-[22px] lg:w-[22px]"
                      width={22}
                      height={22}
                    />
                    서울 전체
                  </button>
                  <div className="relative">
                    <input
                      className="h-[44px] w-[275px] flex-shrink-0 items-center rounded-[12px] border border-[#ADADB3] bg-white px-5 py-3 text-[14px] font-normal leading-[100%] lg:h-[64px] lg:w-[405px] lg:p-5 lg:text-[16px] lg:leading-[130%]"
                      type="search"
                      placeholder="지역명을 입력하세요"
                    />
                    <img
                      className="absolute right-[20px] top-1/2 -translate-y-1/2"
                      alt="검색_아이콘"
                      src="assets/icons/search.svg"
                    />
                  </div>
                </div>
              </div>
              <Image
                src="/assets/icons/map.png"
                alt="mapimage"
                width={470}
                height={470}
                className="h-[378px] w-[378px] lg:h-[430px] lg:w-[430px]"
              />
            </div>
          </section>

          <section className="w-full max-w-[1280px] md:px-[40px] md:py-[32px]">
            <div className="mx-auto mb-[12px] hidden items-center gap-[4px] font-[Pretendard] text-[14px] font-semibold leading-[130%] text-[#92929B] md:flex">
              <img alt="중요알림_아이콘" src="assets/icons/error_outline.svg" />
              <span>매주 수요일 업데이트 · 현재 기준일: 7.28</span>
            </div>

            <div className="flex h-[120px] flex-col justify-center px-[16px] pb-[20px] pt-[40px] md:hidden">
              <p className="text-[16px] font-semibold leading-[150%] text-[#FA4D09]">
                요즘 인기 있는 식당
              </p>
              <p className="text-[24px] font-bold leading-[130%] text-[#171719]">
                로컬잇 랭킹
              </p>
            </div>

            <RestaurantList
              restaurants={topRecentRestaurants}
              isTopRated={false}
            />
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocalEatTab;
