'use client';

import { useAuthStore } from '@/store/authStore';
import { MissionRestaurantProps } from '@/types/restaurant';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getMissionRestaurants, getUserMissionCount } from '../actions/mission';
import { getUserPoints } from '../actions/point';

const page = () => {
  const { user } = useAuthStore();
  const {
    data: missionRestaurants,
    isPending,
    error,
  } = useQuery({
    queryKey: ['mission'],
    queryFn: () => getMissionRestaurants(),
  });

  const {
    data: userMissionCountData,
    isPending: userMissionCountPending,
    error: userMissionCountError,
  } = useQuery({
    queryKey: ['userMissionCount'],
    queryFn: () => getUserMissionCount(user?.id.toString() || ''),
  });

  const {
    data: userPointsData,
    isPending: userPointsPending,
    error: userPointsError,
  } = useQuery({
    queryKey: ['userPoints'],
    queryFn: () => getUserPoints(user?.id.toString() || ''),
  });

  const router = useRouter();

  console.log(missionRestaurants);
  console.log(userMissionCountData);

  console.log(userPointsData);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="mt-[64px] flex min-h-[calc(100vh-64px)] items-center justify-center text-[25px] text-[#CECECE]">
        <p className="mt-[20px]">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-[100vw] flex-col items-center">
      <section className="relative mt-[64px] flex h-[222px] w-full flex-col items-center justify-center overflow-hidden text-white md:h-[314px] lg:h-[590px]">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 bg-[url('/assets/images/mapogu.jpeg')] bg-cover bg-center bg-no-repeat" />

        {/* 어두운 반투명 오버레이 (약간 어둡게 처리) */}
        <div className="absolute inset-0 bg-black/20" />

        {/* 콘텐츠 */}
        <div className="relative z-20 text-center">
          <p className="font-bold leading-[130%] md:text-[18px] lg:text-[24px]">
            이번 달은 마포구 미션으로 <span>새로운 맛집</span> 발견
          </p>

          <div className="flex items-center justify-center font-bold leading-[130%] md:mt-[20px] lg:mt-[30px]">
            <img
              src="/assets/icons/corner_left.svg"
              className="mb-[50px] w-[20px] md:w-[30px] lg:w-[40px]"
              alt="left corner"
            />
            <p className="text-[40px] md:text-[60px] lg:text-[90px]">마포구</p>
            <img
              src="/assets/icons/corner_right.svg"
              className="mt-[50px] w-[20px] md:w-[30px] lg:w-[40px]"
              alt="right corner"
            />
          </div>

          <p className="mt-[5px] text-[30px] font-bold leading-[130%] md:text-[40px] lg:text-[50px]">
            MISSION OPEN!
          </p>

          <div className="flex flex-col items-center text-[12px] font-bold leading-[130%] md:mt-[15px] md:text-[14px] lg:mt-[20px] lg:text-[16px]">
            <p>✅참여 방법: 영수증 인증 후 리뷰 카드 작성</p>
            <p>⏰미션 기간: 2025.07.27 ~ 2025.09.30</p>
            <p>🎁미션 보상: 기간 내 미션 수행시 리워드 두배</p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto mt-[16px] flex h-[237px] w-full gap-[16px] px-[16px] md:mt-0 md:h-[310px] md:gap-[18px] md:px-[40px] md:pb-[32px] md:pt-[40px] lg:h-[423px] lg:max-w-[1280px] lg:gap-[25px] lg:pt-[64px]">
        <div className="flex flex-1 flex-col justify-center rounded-[10px] border border-[#E2E2E4] bg-[#FCFCFD] p-[32px_24px] shadow-[0_0_4px_0_rgba(0,0,0,0.15)] md:h-[238px] md:gap-[32px] md:rounded-[12.9px] md:p-[50px_24px] lg:h-[343px] lg:gap-[46px] lg:rounded-[20px] lg:p-[80px_40px]">
          <div className="mb-[24px] flex w-full flex-col items-center justify-between sm:flex-row md:mb-0">
            <h2 className="font-pretendard whitespace-nowrap text-[14px] font-bold not-italic leading-[130%] tracking-[0.4px] text-[#171719] md:text-[24px] md:font-semibold lg:text-[40px] lg:font-bold">
              내 미션 현황
            </h2>
            <p className="font-pretendard text-center text-[14px] font-bold not-italic leading-[130%] tracking-[0.4px] text-[#171719] md:text-[24px] md:font-semibold lg:text-[40px] lg:font-bold">
              {userMissionCountData?.completedCount || 0}/
              <span className="text-[#92929B]">
                {missionRestaurants?.data?.length || 0}
              </span>
            </p>
          </div>
          <ul className="grid h-full w-full grid-cols-3 gap-[5px] md:flex md:gap-[10.29px] lg:gap-[16px]">
            {Array.from(
              { length: missionRestaurants?.data?.length || 0 },
              (_, index) => {
                const isCompleted =
                  index < (userMissionCountData?.completedCount || 0);
                return (
                  <li key={index} className="h-full w-full">
                    <Image
                      src={`assets/icons/${isCompleted ? 'checked_stamp' : 'unchecked_stamp'}.svg`}
                      alt={
                        isCompleted
                          ? '체크된_스템프_이미지'
                          : '기본_스템프_이미지'
                      }
                      width={85}
                      height={85}
                      className="h-[58px] w-[58px] md:h-[75px] md:w-[75px] lg:h-[85px] lg:w-[85px]"
                    />
                  </li>
                );
              },
            )}
          </ul>
        </div>

        <div className="flex h-[181px] flex-col items-start gap-[10px] self-stretch rounded-[10px] bg-[url('/assets/images/point_bg.png')] bg-cover bg-center bg-no-repeat p-[25px_28px] md:h-[238px] md:w-[182px] md:rounded-[12.9px] md:p-[32px_16px] lg:h-[343px] lg:w-[282px] lg:rounded-[20px] lg:p-[40px_24px]">
          <div className="flex h-[62px] w-[62px] items-center justify-center rounded-[50%] py-[14px] shadow-[2px_2px_10px_0_rgba(0,0,0,0.25)] md:h-[40px] md:w-[40px] md:py-[8.8px] md:shadow-[1.32px_1.32px_6.598px_0_rgba(0,0,0,0.25)] lg:h-[62px] lg:w-[62px] lg:py-[17px] lg:shadow-[2px_2px_10px_0_rgba(0,0,0,0.25)]">
            <Image
              src="/assets/icons/mission_icon.svg"
              alt="미션_프로필_아이콘"
              width={34}
              height={34}
              className="h-[34px] w-[34px] md:h-[22.3px] md:w-[22.3px] lg:h-[34px] lg:w-[34px]"
            />
          </div>

          <div className="font-pretendard self-stretch not-italic leading-[130%] tracking-[0.16px] text-white md:mt-[26.56px] md:text-[12px] md:font-normal lg:mt-[34px] lg:text-[16px] lg:font-semibold">
            <p className="hidden md:block md:h-[16px] lg:h-[21px]">현재</p>
            <p className="flex items-baseline md:h-[31px] lg:h-[52px]">
              <span className="whitespace-nowrap text-[14px] font-bold leading-[130%] md:text-[24px] md:font-semibold lg:text-[40px] lg:font-bold">
                {user?.nickname || '게스트'}님
              </span>
              <span className="text-[12px] font-medium leading-[130%] md:font-normal lg:text-[20px] lg:font-semibold">
                의
              </span>
            </p>
            <p className="text-[12px] md:mt-[10.26px] md:block md:h-[18px] lg:mt-[16px] lg:h-[21px]">
              포인트 잔액은
            </p>
            <p className="flex items-baseline md:h-[31px] lg:h-[52px]">
              <span className="text-[14px] font-bold leading-[130%] md:font-semibold lg:text-[40px] lg:font-bold">
                {userPointsData?.totalPoints || 0}
              </span>
              <span className="ml-[4px] text-[12px] font-normal leading-[130%] md:ml-0 md:text-[12px] md:font-normal lg:text-[20px] lg:font-semibold">
                포인트 <span className="hidden md:inline">입니다.</span>
              </span>
            </p>
          </div>
        </div>

        {!user && (
          <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-white/50 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-[20px] font-bold">로그인하고</p>
              <p className="mb-[10px] text-[20px] font-bold">
                첫 글을 작성해보세요!
              </p>
              <button
                onClick={() => {
                  router.push('/signin');
                }}
                className="rounded-[8px] bg-[#FA4D09] px-5 py-[10px] text-[16px] font-bold text-white"
              >
                로그인 하러가기
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="flex h-full flex-col items-center justify-center self-stretch md:mx-auto md:w-full md:gap-[64px] md:px-[40px] md:py-[32px] lg:max-w-[1280px] lg:gap-[77px]">
        <h2 className="mb-[4px] mt-[37px] text-[16px] font-semibold text-[#FA4D09] md:hidden">
          Event
        </h2>
        <h2 className="mb-[30px] text-center text-[20px] font-bold leading-[130%] tracking-[0.4px] text-[#171719] md:mb-0 md:text-[32px] lg:text-[40px]">
          이번 주 마포구 미션 대상 식당
        </h2>

        <ul className="hidden w-full md:grid md:grid-cols-3 md:gap-x-[37px] md:gap-y-[32px] lg:gap-x-[20px] lg:gap-y-[20px]">
          {missionRestaurants.data.map((restaurant: MissionRestaurantProps) => (
            <li
              key={restaurant.id}
              className="flex flex-col items-center justify-end gap-[10px] rounded-[20px] bg-cover bg-center bg-no-repeat md:h-[256px] md:max-w-[256px] md:p-[16px] lg:h-[386px] lg:max-w-[386px] lg:p-[26px]"
              style={{ backgroundImage: `url(${restaurant.image_url})` }}
              onClick={() => {
                router.push(`/restaurant/${restaurant.id}`);
              }}
            >
              <div className="flex flex-col items-center justify-center self-stretch rounded-[8px] bg-white/95 px-[24px] py-[20px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.25)]">
                <div className="flex w-full items-end md:gap-[4px] lg:gap-[6px]">
                  <h3 className="leading-[100%] text-[#171719] md:text-[16px] md:font-semibold lg:text-[20px] lg:font-bold">
                    {restaurant.title}
                  </h3>
                  <span className="leading-[100%] text-[#787882] md:text-[12px] md:font-normal lg:text-[14px] lg:font-semibold">
                    리뷰 {restaurant.review_count}
                  </span>
                </div>
                <p className="text-[#171719] md:mt-[4px] md:text-[12px] md:font-normal lg:mt-[6px] lg:text-[16px] lg:font-semibold">
                  대표메뉴:{' '}
                  {restaurant.menus.map((menu: string) => menu).join(', ')}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <ul className="flex w-full flex-col gap-[10px] px-[16px] md:hidden">
          {missionRestaurants.data.map((restaurant: MissionRestaurantProps) => (
            <li
              key={restaurant.id}
              className="flex h-[160px] rounded-[10px] shadow-[0_0_4px_0_rgba(0,0,0,0.15)]"
            >
              <Image
                src={restaurant.image_url}
                alt={restaurant.title}
                width={100}
                height={160}
                className="h-[160px] w-[50%] rounded-l-[10px]"
              />
              <div className="flex w-[50%] flex-col gap-[10px] px-[16px] py-[24px]">
                <div className="flex items-center gap-[4px]">
                  <div className="h-[20px] rounded-[4px] bg-[#FEEDE6] p-1 text-[12px] font-normal leading-[130%] text-[#FA4D09]">
                    {restaurant.address.split(' ')[0]}
                  </div>
                  <div className="h-[20px] rounded-[4px] bg-[#E0F6F1] p-1 text-[12px] font-normal leading-[130%] text-[#004332]">
                    {restaurant.address.split(' ')[1]}
                  </div>
                </div>

                <div>
                  <div className="flex flex-col border-b border-[#E3DEE0] pb-[7px]">
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[20px] font-semibold leading-[130%]">
                      {restaurant.title}
                    </p>
                    <p className="text-[12px] font-normal leading-[130%] text-[#727275]">
                      리뷰 {restaurant.review_count}
                    </p>
                  </div>

                  <div className="mt-[8px] text-[14px] font-normal leading-[130%] text-[#010101]">
                    대표메뉴:{' '}
                    {restaurant.menus
                      .slice(0, 2)
                      .map((menu: string) => menu)
                      .join(', ')}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default page;
