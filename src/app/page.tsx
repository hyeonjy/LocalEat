'use client';

import LocalEaterCollection from '@/components/home/LocalEaterCollection';
import MissionRestaurantSection from '@/components/home/MissionRestaurantSection';
import NewEatRestaurant from '@/components/home/NewEatRestaurant';
import StoryReviewCollection from '@/components/home/StoryReviewCollection';
import TopTenRestaurantList from '@/components/home/TopTenRestaurantList';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

export default function Home() {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    console.log('✅ Zustand에 저장된 유저:', user);
  }, [user]);

  return (
    <div>
      <MissionRestaurantSection />
      <TopTenRestaurantList />
      <NewEatRestaurant />
      <StoryReviewCollection />
     <LocalEaterCollection/>

    </div>
  );
}
