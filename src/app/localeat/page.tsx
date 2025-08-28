import {
  getTopRatedRestaurants,
  getTopRecentRestaurants,
} from '../actions/restaurant';
import LocalEatTab from './_components/LocalEatTab';

type PageProps = {
  searchParams: { tab?: 'top10' | 'recent' };
};

const LocaleatPage = async ({ searchParams }: PageProps) => {
  const initialTab = searchParams?.tab === 'recent' ? 'recent' : 'top10';
  const [topRatedRestaurants, topRecentRestaurants] = await Promise.all([
    getTopRatedRestaurants(),
    getTopRecentRestaurants(),
  ]);

  return (
    <LocalEatTab
      initialTab={initialTab}
      topRatedRestaurants={topRatedRestaurants}
      topRecentRestaurants={topRecentRestaurants}
    />
  );
};

export default LocaleatPage;
