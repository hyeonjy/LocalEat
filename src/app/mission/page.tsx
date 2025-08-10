'use client';

import { useAuthStore } from '@/store/authStore';
import { MissionRestaurantProps } from '@/types/restaurant';
import { useQuery } from '@tanstack/react-query';
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
    <div>
      <section className="relative mt-[64px] flex h-[222px] w-full flex-col items-center justify-center overflow-hidden text-white md:h-[314px] lg:h-[590px]">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 bg-[url('/assets/images/mapogu.jpeg')] bg-cover bg-center bg-no-repeat" />

        {/* 어두운 반투명 오버레이 (약간 어둡게 처리) */}
        <div className="absolute inset-0 bg-black/20" />

        {/* 콘텐츠 */}
        <div className="relative z-20 text-center">
          <p className="text-[24px] font-bold leading-[130%]">
            이번 달은 마포구 미션으로 <span>새로운 맛집</span> 발견
          </p>

          <div className="mt-[30px] flex items-center justify-center font-bold leading-[130%]">
            <img
              src="/assets/icons/corner_left.svg"
              className="mb-[50px] w-[40px]"
              alt="left corner"
            />
            <p className="text-[90px]">마포구</p>
            <img
              src="/assets/icons/corner_right.svg"
              className="mt-[50px] w-[40px]"
              alt="right corner"
            />
          </div>

          <p className="mt-[5px] text-[50px] font-bold leading-[130%]">
            MISSION OPEN!
          </p>

          <div className="mt-[20px] flex flex-col items-center text-[16px] font-bold leading-[130%]">
            <p>✅참여 방법: 영수증 인증 후 리뷰 카드 작성</p>
            <p>⏰미션 기간: 2025.07.27 ~ 2025.08.31</p>
            <p>🎁미션 보상: 기간 내 미션 수행시 리워드 두배</p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto flex h-[423px] w-[1280px] gap-[25px] px-[40px] pb-[32px] pt-[64px]">
          <div className="flex flex-[1_0_0] flex-col items-center justify-center gap-[46px] rounded-[20px] border border-[#E2E2E4] bg-[#FCFCFD] p-[80px_40px] shadow-[0_0_4px_0_rgba(0,0,0,0.15)]">
            <div className="flex w-full items-center justify-between">
              <h2 className="font-pretendard text-[40px] font-bold not-italic leading-[130%] tracking-[0.4px] text-[#171719]">
                내 미션 현황
              </h2>
              <p className="font-pretendard text-center text-[40px] font-bold not-italic leading-[130%] tracking-[0.4px] text-[#171719]">
                {userMissionCountData?.completedCount || 0} /{' '}
                {missionRestaurants?.data?.length || 0}
              </p>
            </div>
            <ul className="flex gap-[16px]">
              {Array.from(
                { length: missionRestaurants?.data?.length || 0 },
                (_, index) => {
                  const isCompleted =
                    index < (userMissionCountData?.completedCount || 0);
                  return (
                    <li key={index}>
                      <img
                        src={`assets/icons/${isCompleted ? 'checked_stamp' : 'unchecked_stamp'}.svg`}
                        alt={
                          isCompleted
                            ? '체크된_스템프_이미지'
                            : '기본_스템프_이미지'
                        }
                      />
                    </li>
                  );
                },
              )}
            </ul>
          </div>

          <div className="flex w-[282px] flex-col items-start gap-[10px] self-stretch rounded-[20px] bg-[#00A87E] p-[40px_24px]">
            <div className="flex h-[62px] w-[62px] items-center justify-center gap-[10px] rounded-[31px] bg-[#00A87E] px-[15px] shadow-[2px_2px_10px_0_rgba(0,0,0,0.25)]">
              <img
                src="assets/icons/mission_icon.svg"
                alt="미션_프로필_아이콘"
              />
            </div>
            <div className="font-pretendard mt-[34px] self-stretch text-[16px] font-semibold not-italic leading-[130%] tracking-[0.16px] text-white">
              <p className="h-[21px]">현재</p>
              <p className="mb-2 mt-[10px] flex items-baseline">
                <span className="text-[40px] font-extrabold leading-none">
                  {user?.nickname}님
                </span>
                <span className="ml-1 text-[16px] font-semibold">의</span>
              </p>
              <p className="mt-[16px] h-[21px]">포인트 잔액은</p>
              <p className="mb-2 mt-[10px] flex items-baseline">
                <span className="text-[40px] font-extrabold leading-none">
                  {userPointsData?.totalPoints || 0}
                </span>
                <span className="ml-1 text-[16px] font-semibold">
                  포인트 입니다.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-[1280px] flex-col items-center justify-center gap-[77px] self-stretch px-[40px] py-[32px]">
        <h2 className="text-center text-[40px] font-bold leading-[130%] tracking-[0.4px] text-[#171719]">
          이번 주 마포구 미션 대상 식당
        </h2>

        <ul className="ml-[64px] grid w-full grid-cols-3 gap-[20px]">
          {missionRestaurants.data.map((restaurant: MissionRestaurantProps) => (
            <li
              key={restaurant.id}
              className="flex h-[386px] w-[386px] max-w-[386px] flex-col items-center justify-end gap-[10px] rounded-[20px] bg-cover bg-center bg-no-repeat p-[26px]"
              style={{ backgroundImage: `url(${restaurant.image_url})` }}
              onClick={() => {
                router.push(`/restaurant/${restaurant.id}`);
              }}
            >
              <div className="flex flex-col items-center justify-center self-stretch rounded-[8px] bg-white/95 px-[24px] py-[20px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.25)]">
                <div className="flex w-full items-end gap-[6px]">
                  <h3 className="text-[20px] font-bold leading-[100%] text-[#171719]">
                    {restaurant.title}
                  </h3>
                  <span className="text-[14px] font-normal leading-[100%] text-[#787882]">
                    리뷰 {restaurant.review_count}
                  </span>
                </div>
                <p className="mt-[6px]">
                  대표메뉴:{' '}
                  {restaurant.menus.map((menu: string) => menu).join(', ')}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default page;
