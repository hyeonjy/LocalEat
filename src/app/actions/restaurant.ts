'use server';

import { createServerApi } from '@/lib/serverApi';
import {
  GraphicReviewPayload,
  GraphicReviewProps,
  keywordSummaryProps,
  MenuProps,
  RestaurantProps,
  StandardReviewPayload,
  StandardReviewProps,
} from '@/types/restaurant';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const getRestaurantInfoAndMenus = async (id: string) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const res = await fetch(`${backendUrl}/restaurants/${id}/basic`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || '에러 발생');
  }

  return data;
};

export const getRestaurantById = async (
  id: string,
): Promise<{
  restaurant: RestaurantProps;
  menus: MenuProps[];
  reviews: { standard: StandardReviewProps[]; graphic: GraphicReviewProps[] };
  keywords: { standard: keywordSummaryProps[]; graphic: keywordSummaryProps[] };
}> => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const res = await fetch(`${backendUrl}/restaurants/${id}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || '에러 발생');
  }

  return data;
};

export const createStandardReview = async (
  reviewData: StandardReviewPayload,
) => {
  const accessToken = cookies().get('accessToken')?.value;
  const refreshToken = cookies().get('refreshToken')?.value;

  const serverApi = createServerApi(accessToken, refreshToken);

  try {
    const res = await serverApi.post(
      `/restaurants/${reviewData.restaurantId}/review/standard`,
      reviewData,
    );

    // 리뷰 등록 후 해당 레스토랑 페이지 캐시 무효화
    revalidatePath(`/restaurant/${reviewData.restaurantId}`);

    return { success: true, data: res.data };
  } catch (error: any) {
    if (error.name === 'RefreshTokenExpired') {
      return { success: false, reason: 'UNAUTHORIZED' };
    }
    return { success: false, reason: 'UNKNOWN', message: error.message };
  }
};

export const createGraphicReview = async (reviewData: GraphicReviewPayload) => {
  const accessToken = cookies().get('accessToken')?.value;
  const refreshToken = cookies().get('refreshToken')?.value;

  const serverApi = createServerApi(accessToken, refreshToken);

  try {
    const res = await serverApi.post(
      `/restaurants/${reviewData.restaurantId}/review/graphic`,
      reviewData,
    );

    // 리뷰 등록 후 해당 레스토랑 페이지 캐시 무효화
    revalidatePath(`/restaurant/${reviewData.restaurantId}`);

    return { success: true, data: res.data };
  } catch (error: any) {
    if (error.name === 'RefreshTokenExpired') {
      return { success: false, reason: 'UNAUTHORIZED' };
    }
    return { success: false, reason: 'UNKNOWN', message: error.message };
  }
};

export const getRestaurantReaction = async (id: string) => {
  const accessToken = cookies().get('accessToken')?.value;
  const refreshToken = cookies().get('refreshToken')?.value;

  const serverApi = createServerApi(accessToken, refreshToken);

  try {
    const res = await serverApi.get(`/restaurants/${id}/review/reactions`);

    return { success: true, data: res.data };
  } catch (error: any) {
    if (error.name === 'RefreshTokenExpired') {
      return { success: false, reason: 'UNAUTHORIZED' };
    }

    return { success: false, reason: 'UNKNOWN', message: error.message };
  }
};

export const getTopRatedRestaurants = async () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const res = await fetch(`${backendUrl}/restaurants/top-rated`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || '에러 발생');
  }

  return data;
};

export const getTopRecentRestaurants = async () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const res = await fetch(`${backendUrl}/restaurants/top-recent`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || '에러 발생');
  }

  return data;
};
