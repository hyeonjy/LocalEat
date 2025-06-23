import { MenuProps, RestaurantProps } from '@/types/restaurant';
import Image from 'next/image';
import { useState } from 'react';
import { RatingInput } from './RatingInput';

type RestaurantInfoProps = {
  restaurant: RestaurantProps;
  menus: MenuProps[];
};
const RestaurantInfo = ({ restaurant, menus }: RestaurantInfoProps) => {
  const [stars, setStars] = useState(0);

  return (
    <div className="mt-[60px]">
      <h1 className="mb-[32px] text-center text-[30px] font-semibold leading-[140%]">
        {restaurant.name}, 어떠셨나요?
      </h1>
      <section className="flex w-[791px] flex-col rounded-[50px] bg-[#FDF8F6] p-[40px]">
        <div className="flex justify-between">
          <div className="flex items-center gap-[4px]">
            <Image
              src={'/assets/icons/nearby.svg'}
              alt="distance"
              width={24}
              height={24}
            />
            <span className="text-body-mm text-[#5F5F68]">
              {restaurant.address}
            </span>
          </div>
          <span className="text-[16px] font-medium leading-[150%] text-[#169BFA;]">
            지도
          </span>
        </div>

        <div className="mb-[35px] mt-[20px] flex justify-between gap-[17px]">
          {menus.slice(0, 3).map((menu) => (
            <Image
              key={menu.id}
              src={menu.image_url}
              alt={menu.name}
              width={226}
              height={171}
              className="h-[171px] w-[226px] rounded-[10px]"
            />
          ))}
        </div>

        <RatingInput stars={stars} onChange={setStars} />
      </section>
    </div>
  );
};

export default RestaurantInfo;
