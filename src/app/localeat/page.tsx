import {
  getTopRatedRestaurants,
  getTopRecentRestaurants,
} from '../actions/restaurant';
import LocalEatTab from './_components/LocalEatTab';

const LocaleatPage = async () => {
  const [topRatedRestaurants, topRecentRestaurants] = await Promise.all([
    getTopRatedRestaurants(),
    getTopRecentRestaurants(),
  ]);

  return (
    <LocalEatTab
      topRatedRestaurants={topRatedRestaurants}
      topRecentRestaurants={topRecentRestaurants}
    />
  );
};

export default LocaleatPage;
