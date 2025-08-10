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
  console.log(topRatedRestaurants);

  return (
    <div className="mt-[87px]">
      <Tabs defaultValue="top10" className="w-full">
        <TabsList className="mx-auto mt-[23px] flex w-[1200px] border-b-0">
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

        <TabsContent value="top10">
          <section className="h-[370px] w-full overflow-hidden bg-[url('/assets/icons/top1.png')] bg-cover bg-center bg-no-repeat">
            <div className="mx-auto flex h-full w-[1200px] items-center justify-between">
              <div className="flex h-full flex-col">
                <h2 className="pt-[84px] font-[Pretendard] text-[40px] font-bold leading-[130%] tracking-[0.4px] text-white">
                  로컬잇픽 우리 동네 맛집 TOP 10
                </h2>
                <p className="mt-[8px] font-[Pretendard] text-[20px] font-semibold leading-[130%] tracking-[-0.3px] text-white">
                  방문 횟수, 리뷰를 바탕으로 검증된 로컬 맛집만 소개합니다.
                </p>
                <div className="mt-[32px] flex gap-[4px]">
                  <button
                    type="button"
                    className="flex h-[64px] w-[138px] items-center gap-[10px] rounded-[13px] bg-[#FFF] p-[10px_16px] text-[16px] font-normal leading-[130%] text-[#171719]"
                  >
                    <img
                      alt="위치탐색_아이콘"
                      src="assets/icons/mylocation.svg"
                    />
                    서울 전체
                  </button>
                  <div className="relative">
                    <input
                      className="flex h-[64px] w-[524px] shrink-0 items-center gap-2 rounded-[12px] border border-[#92929B] bg-white px-[20px] py-[16px]"
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
                width={591}
                height={591}
              />
            </div>
          </section>
          <section className="w-full">
            <div className="mx-auto mt-[35px] flex w-[1200px] items-center gap-[4px] font-[Pretendard] text-[14px] font-semibold leading-[130%] text-[#92929B]">
              <img alt="중요알림_아이콘" src="assets/icons/error_outline.svg" />
              매주 수요일 업데이트 · 현재 기준일: 5.28
            </div>
            <RestaurantList
              restaurants={topRatedRestaurants}
              isTopRated={true}
            />
          </section>
        </TabsContent>

        <TabsContent value="recent">
          <section className="h-[370px] w-full overflow-hidden bg-[url('/assets/icons/top2.png')] bg-cover bg-center bg-no-repeat">
            <div className="mx-auto flex h-full w-[1200px] items-center justify-between">
              <div className="flex h-full flex-col">
                <h2 className="pt-[84px] font-[Pretendard] text-[40px] font-bold leading-[130%] tracking-[0.4px] text-white">
                  NEW 로컬잇 우리 동네 맛집 TOP 10
                </h2>
                <p className="mt-[8px] font-[Pretendard] text-[20px] font-semibold leading-[130%] tracking-[-0.3px] text-white">
                  우리 동네에 새로 생긴 인기 맛집, 가장 먼저 만나보기!
                </p>
                <div className="mt-[32px] flex gap-[4px]">
                  <button
                    type="button"
                    className="flex h-[64px] w-[138px] items-center gap-[10px] rounded-[13px] bg-[#FFF] p-[10px_16px] text-[16px] font-normal leading-[130%] text-[#171719]"
                  >
                    <img
                      alt="위치탐색_아이콘"
                      src="assets/icons/mylocation.svg"
                    />
                    서울 전체
                  </button>
                  <div className="relative">
                    <input
                      className="flex h-[64px] w-[524px] shrink-0 items-center gap-2 rounded-[12px] border border-[#92929B] bg-white px-[20px] py-[16px]"
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
                width={591}
                height={591}
              />
            </div>
          </section>
          <section className="w-full">
            <div className="mx-auto mt-[35px] flex w-[1200px] items-center gap-[4px] font-[Pretendard] text-[14px] font-semibold leading-[130%] text-[#92929B]">
              <img alt="중요알림_아이콘" src="assets/icons/error_outline.svg" />
              매주 수요일 업데이트 · 현재 기준일: 5.28
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
