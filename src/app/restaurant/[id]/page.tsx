import { getRestaurantById } from '@/app/actions/restaurant';
import MenuSection from '../_components/MenuSection';
import RestaurantHeader from '../_components/RestaurantHeader';
import ReviewTabs from '../_components/ReviewTabs';

type RestaurantDetailProps = {
  params: {
    id: string;
  };
};

const RestaurantDetail = async ({ params }: RestaurantDetailProps) => {
  const { restaurant, menus, reviews, keywordSummary } =
    await getRestaurantById(params.id);

  return (
    <div className="mt-[64px] flex w-full flex-col items-center">
      <RestaurantHeader restaurant={restaurant} />
      <MenuSection menus={menus} />
      <ReviewTabs
        standardReviews={reviews.standard}
        graphicReviews={reviews.graphic}
        keywordSummary={keywordSummary}
      />
    </div>
  );
};

export default RestaurantDetail;
