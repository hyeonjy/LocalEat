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
    <div className="mt-[60px] flex w-full flex-col items-center">
      <h1 className="mb-[32px] text-center text-[32px] font-semibold leading-[140%]">
        {restaurant.name}, 어떠셨나요?
      </h1>
      {type === 'standard' && (
        <section className="mx-auto flex w-[calc(100%-32px)] flex-col rounded-[28px] bg-[#FDF8F6] px-[16px] py-[20px] md:mx-0 md:w-[692px] md:rounded-[50px] md:px-[85px] md:py-[40px] lg:w-[772px] lg:px-[30px]">
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

          <div className="mb-[35px] mt-[20px] flex flex-col items-center justify-between gap-[17px] md:flex-row">
            {menus.slice(0, 3).map((menu) => (
              <Image
                key={menu.id}
                src={menu.image_url}
                alt={menu.name}
                width={226}
                height={171}
                className="h-[171px] w-[197px] rounded-[10px] md:w-[162px] lg:w-[226px]"
              />
            ))}
          </div>

          <RatingInput ratings={rating} onChange={setRating} />
          <p className="text-[#47474D mt-[20px] block text-center text-[14px] font-medium leading-[130%] md:hidden">
            다음에 또 올래요!
          </p>
        </section>
      )}
      {type === 'graphic' && (
        <div>
          <RatingInput ratings={rating} onChange={setRating} />
          <p className="text-[#47474D mt-[20px] block text-center text-[14px] font-medium leading-[130%] md:hidden">
            다음에 또 올래요!
          </p>
        </div>
      )}
    </div>
  );
};

export default RestaurantInfo;
