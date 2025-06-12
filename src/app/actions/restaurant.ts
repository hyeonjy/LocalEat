'use server';

import { MenuProps, RestaurantProps } from '@/types/restaurant';

export const getRestaurantById = async (
  id: string,
): Promise<{ restaurant: RestaurantProps; menus: MenuProps }> => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const res = await fetch(`${backendUrl}/restaurants/${id}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || '에러 발생');
  }

  return data;
};
