// import { getRestaurantById } from '@/app/actions/restaurant';

import { getRestaurantById } from '@/app/actions/restaurant';
import RestaurantHeader from '../_components/RestaurantHeader';

type RestaurantDetailProps = {
  params: {
    id: string;
  };
};

const RestaurantDetail = async ({ params }: RestaurantDetailProps) => {
  const { restaurant, menus } = await getRestaurantById(params.id);

  return (
    <div className="mt-[64px] flex w-full justify-center">
      <RestaurantHeader restaurant={restaurant} />
    </div>
  );
};

export default RestaurantDetail;
