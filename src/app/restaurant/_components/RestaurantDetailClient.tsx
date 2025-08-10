'use client';

import { getRestaurantById } from '@/app/actions/restaurant';
import { useQuery } from '@tanstack/react-query';
import MenuSection from './MenuSection';
import RestaurantHeader from './RestaurantHeader';
import ReviewTabs from './ReviewTabs';

const RestaurantDetailClient = ({ id }: { id: string }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => getRestaurantById(id),
    queryKey: ['restaurant', id],
  });

  if (isLoading) {
    return (
      <div className="mt-[64px] flex w-full items-center justify-center p-10">
        로딩 중...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="mt-[64px] flex w-full items-center justify-center p-10 text-red-500">
        {(error as Error)?.message || '문제가 발생했습니다.'}
      </div>
    );
  }

  const { restaurant, menus, reviews, keywords } = data!;

  return (
    <div className="mt-[64px] flex w-full flex-col items-center">
      <RestaurantHeader restaurant={restaurant} />
      <MenuSection name={restaurant.name} menus={menus} />
      <ReviewTabs
        standardReviews={reviews.standard}
        graphicReviews={reviews.graphic}
        keywords={keywords}
        restaurantId={String(restaurant.id)}
      />
    </div>
  );
};

export default RestaurantDetailClient;
