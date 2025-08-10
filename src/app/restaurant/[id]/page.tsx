import RestaurantDetailClient from '../_components/RestaurantDetailClient';

type RestaurantDetailProps = {
  params: {
    id: string;
  };
};

const RestaurantDetail = async ({ params }: RestaurantDetailProps) => {
  return <RestaurantDetailClient id={params.id} />;
};

export default RestaurantDetail;
