import { getRestaurantStatus } from '@/lib/getRestaurantStatus';
import { RestaurantProps } from '@/types/restaurant';
import Image from 'next/image';
import ReviewWriteButton from './ReviewWriteButton';

type RestaurantHeaderProps = {
  restaurant: RestaurantProps;
};

const RestaurantHeader = ({ restaurant }: RestaurantHeaderProps) => {
  const openingState = getRestaurantStatus(restaurant.opening_hours);

  return (
    <div className="flex h-[524px] w-full items-center justify-between gap-[65px] px-5 xl:w-[1200px] xl:px-0">
      <Image
        alt={`${restaurant.name} 대표 이미지`}
        src={restaurant.image_url}
        width="546"
        height="423"
        className="h-[423px] rounded-[16px]"
      />

      <div className="w-[589px]">
        <p className="mb-2 flex items-center gap-2 text-title-mm text-[#7F7F7F]">
          <span>{restaurant.address.split(' ')[0]}</span>
          <span>|</span>
          <span>{restaurant.category}</span>
        </p>

        <div className="flex w-full justify-between">
          <h1 className="text-title-2xl">{restaurant.name}</h1>
          <div className="flex">
            <Image
              src="/assets/icons/favorite.svg"
              alt="좋아요 버튼"
              width={24}
              height={24}
              className="mr-[16px]"
            />
            <Image
              src="/assets/icons/share.svg"
              alt="공유 버튼"
              width={24}
              height={24}
            />
          </div>
        </div>

        <p className="mb-[24px] flex h-[22px] items-center gap-1 text-title-mb">
          <span className="flex gap-[2px]">
            <Image
              src="/assets/icons/star2.svg"
              alt="별점 아이콘"
              width={20}
              height={20}
              className="h-[20px]"
            />
            0.0
          </span>
          <span>|</span>
          <span>리뷰 123개</span>
        </p>

        <p className="mb-[12px] flex h-[24px] items-center gap-2 text-body-mm text-[#646464]">
          <Image
            src="/assets/icons/distance.svg"
            alt="위치 아이콘"
            width={24}
            height={24}
          />
          {restaurant.address}
        </p>

        <p className="mb-[12px] flex h-[24px] items-center gap-2 text-body-mm text-[#646464]">
          <Image
            src="/assets/icons/alarm.svg"
            alt="시계 아이콘"
            width={24}
            height={24}
          />
          {openingState}
        </p>

        <p className="mb-[12px] flex h-[24px] items-center gap-2 text-body-mm text-[#646464]">
          <Image
            src="/assets/icons/call.svg"
            alt="전화 아이콘"
            width={24}
            height={24}
          />
          {restaurant.phone}
        </p>

        <p className="mb-[32px] flex h-[24px] items-center gap-2 text-body-mm text-[#646464]">
          <Image
            src="/assets/icons/chat_info.svg"
            alt="정보 아이콘"
            width={24}
            height={24}
          />
          {restaurant.parking ? '주차 가능' : '주차 불가'} |{' '}
          {restaurant.pet_allowed ? '반려동물 출입 가능' : '반려동물 출입 제한'}
        </p>
        <ReviewWriteButton restaurantId={restaurant.id} />
      </div>
    </div>
  );
};

export default RestaurantHeader;
