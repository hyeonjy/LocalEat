import { MenuProps, RestaurantProps } from '@/types/restaurant';
import Image from 'next/image';
import { RatingInput } from './RatingInput';

type RestaurantInfoProps = {
  restaurant: RestaurantProps;
  menus?: MenuProps[];
  rating: number;
  setRating: (rating: number) => void;
  type?: 'standard' | 'graphic';
};

const RestaurantInfo = ({
  restaurant,
  menus = [],
  rating,
  setRating,
  type = 'standard',
}: RestaurantInfoProps) => {
  return (
    <div className="mt-[60px]">
      <h1 className="mb-[32px] text-center text-[32px] font-semibold leading-[140%]">
        {restaurant.name}, 어떠셨나요?
      </h1>
      {type === 'standard' && (
        <section className="flex flex-col rounded-[50px] bg-[#FDF8F6] px-[85px] py-[40px] md:w-[692px] lg:w-[772px] lg:px-[30px]">
          <div className="flex justify-between">
            <div className="flex items-center gap-[4px]">
              <Image
                src={'/assets/icons/nearby.svg'}
                alt="distance"
                width={24}
                height={24}
              />
              <span className="text-[16px] font-medium leading-[130%] text-[#5F5F68]">
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
                className="w-[162px] rounded-[10px] lg:h-[171px] lg:w-[226px]"
              />
            ))}
          </div>

          <RatingInput ratings={rating} onChange={setRating} />
        </section>
      )}
      {type === 'graphic' && (
        <RatingInput ratings={rating} onChange={setRating} />
      )}
    </div>
  );
};

export default RestaurantInfo;
