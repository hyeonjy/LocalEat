'use client';
import { getRestaurantStatus } from '@/lib/getRestaurantStatus';
import { RestaurantProps } from '@/types/restaurant';
import Image from 'next/image';
import { useState } from 'react';
import RestaurantHeaderButton from './RestaurantHeaderButton';
import RestaurantReviewMap from './RestaurantReviewMap';

type RestaurantHeaderProps = {
  restaurant: RestaurantProps;
};

const RestaurantHeader = ({ restaurant }: RestaurantHeaderProps) => {
  const openingState = getRestaurantStatus(restaurant.opening_hours);
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <div className="flex w-full max-w-[1280px] flex-col items-center justify-between gap-[24px] px-[16px] py-[20px] md:h-[414px] md:flex-row md:gap-[20px] md:px-[40px] md:pb-[32px] md:pt-[40px] lg:gap-[24px]">
      <Image
        alt={`${restaurant.name} 대표 이미지`}
        src={restaurant.image_url}
        width="588"
        height="342"
        className="h-[342px] w-full rounded-[12px] md:w-[460px] lg:w-[588px]"
      />

      <div className="w-full md:w-[464px] lg:w-[588px]">
        <p className="mb-[4px] flex items-center gap-2 text-[16px] font-normal leading-[130%] text-[#787882]">
          <span>{restaurant.address.split(' ')[0]} </span>
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
          <span className="whitespace-nowrap">{restaurant.address}</span>
          <button
            onClick={() => setIsMapOpen(true)}
            className="cursor-pointer whitespace-nowrap text-[#3177E8] hover:underline"
          >
            지도
          </button>
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

      {isMapOpen && (
        <RestaurantReviewMap
          place={{
            id: restaurant.id,
            name: restaurant.name,
            address: restaurant.address,
            lat: restaurant.lat,
            lng: restaurant.lng,
            phone: restaurant.phone,
            category: restaurant.category,
            opening_hours: restaurant.opening_hours,
            closed_days: restaurant.closed_days,
            parking: restaurant.parking ?? false,
            pet_allowed: restaurant.pet_allowed ?? false,
            image_url: restaurant.image_url,
            created_at: restaurant.created_at,
            average_rating: restaurant.averageRating.toString(),
            review_count: restaurant.reviewCount.toString(),
          }}
          onClose={() => setIsMapOpen(false)}
        />
      )}
    </div>
  );
};

export default RestaurantHeader;
