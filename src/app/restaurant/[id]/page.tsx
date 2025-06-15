import { getRestaurantById } from '@/app/actions/restaurant';
import MenuSection from '../_components/MenuSection';
import RestaurantHeader from '../_components/RestaurantHeader';

type RestaurantDetailProps = {
  params: {
    id: string;
  };
};

const RestaurantDetail = async ({ params }: RestaurantDetailProps) => {
  const { restaurant, menus } = await getRestaurantById(params.id);

  return (
    <div className="mt-[64px] flex w-full flex-col items-center bg-red-300">
      <RestaurantHeader restaurant={restaurant} />
      <MenuSection menus={menus} />
    </div>
  );
};

export default RestaurantDetail;
