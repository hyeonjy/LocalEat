'use client';
import { getRestaurantStatus } from '@/lib/getRestaurantStatus';
import { RestaurantProps } from '@/types/restaurant';
import Image from 'next/image';
import RestaurantHeaderButton from './RestaurantHeaderButton';

type RestaurantHeaderProps = {
  restaurant: RestaurantProps;
};

const RestaurantHeader = ({ restaurant }: RestaurantHeaderProps) => {
  const openingState = getRestaurantStatus(restaurant.opening_hours);

  return (
    <div className="flex w-full max-w-[1280px] items-center justify-between gap-[20px] px-[40px] pb-[32px] pt-[40px] md:h-[414px] lg:gap-[24px]">
      <Image
        alt={`${restaurant.name} 대표 이미지`}
        src={restaurant.image_url}
        width="588"
        height="342"
        className="h-[342px] w-[460px] rounded-[12px] lg:w-[588px]"
      />

      <div className="w-[464px] lg:w-[588px]">
        <p className="mb-[4px] flex items-center gap-2 text-[16px] font-normal leading-[130%] text-[#787882]">
          <span>{restaurant.address.split(' ')[0]}</span>
          <span>|</span>
          <span>{restaurant.category}</span>
        </p>

        <h1 className="mb-[8px] text-[32px] font-bold leading-[130%]">
          {restaurant.name}
        </h1>

        <div className="mb-[20px] flex h-[41px] items-center gap-[6px] border-b border-[#E2E2E4] pb-[20px] text-[16px] font-medium leading-[130%]">
          <div className="flex gap-[2px]">
            <Image
              src="/assets/icons/star2.svg"
              alt="별점 아이콘"
              width={20}
              height={20}
              className="h-[20px]"
            />
            {restaurant.averageRating}
          </div>
          <p>리뷰 {restaurant.reviewCount}</p>
        </div>

        <p className="mb-[10px] flex h-[24px] items-center gap-2 text-[16px] font-normal leading-[130%] text-[#171719]">
          <Image
            src="/assets/icons/distance.svg"
            alt="위치 아이콘"
            width={24}
            height={24}
          />
          {restaurant.address}
        </p>

        <p className="mb-[10px] flex h-[24px] items-center gap-2 text-[16px] font-normal leading-[130%] text-[#171719]">
          <Image
            src="/assets/icons/alarm.svg"
            alt="시계 아이콘"
            width={24}
            height={24}
          />
          {openingState}
        </p>

        <p className="mb-[10px] flex h-[24px] items-center gap-2 text-[16px] font-normal leading-[130%] text-[#171719]">
          <Image
            src="/assets/icons/call.svg"
            alt="전화 아이콘"
            width={24}
            height={24}
          />
          {restaurant.phone}
        </p>

        <p className="mb-[30px] flex h-[24px] items-center gap-2 text-[16px] font-normal leading-[130%] text-[#171719]">
          <Image
            src="/assets/icons/info.svg"
            alt="정보 아이콘"
            width={24}
            height={24}
          />
          {restaurant.parking ? '주차 가능' : '주차 불가'} |{' '}
          {restaurant.pet_allowed ? '반려동물 출입 가능' : '반려동물 출입 제한'}
        </p>
        <RestaurantHeaderButton restaurantId={restaurant.id} />
      </div>
    </div>
  );
};

export default RestaurantHeader;
