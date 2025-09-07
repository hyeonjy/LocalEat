'use server';

import { createServerApi } from '@/lib/serverApi';
import {
  GraphicReviewPayload,
  GraphicReviewProps,
  keywordSummaryProps,
  MenuProps,
  ReactionType,
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
  sort?: 'latest' | 'popular',
): Promise<{
  restaurant: RestaurantProps;
  menus: MenuProps[];
  reviews: { standard: StandardReviewProps[]; graphic: GraphicReviewProps[] };
  keywords: { standard: keywordSummaryProps[]; graphic: keywordSummaryProps[] };
}> => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const res = await fetch(
    `${backendUrl}/restaurants/${id}?type=standard&sort=${sort}`,
    {
      cache: 'no-store',
    },
  );
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

export const addRestaurantReaction = async (
  reviewId: number,
  type: ReactionType,
  userId: number | undefined,
) => {
  const accessToken = cookies().get('accessToken')?.value;
  const refreshToken = cookies().get('refreshToken')?.value;

  const serverApi = createServerApi(accessToken, refreshToken);

  try {
    const res = await serverApi.post(
      `/restaurants/review/${reviewId}/reactions`,
      { type, userId },
    );

    return { success: true, data: res.data };
  } catch (error: any) {
    if (error.name === 'RefreshTokenExpired') {
      return { success: false, reason: 'UNAUTHORIZED' };
    }
  }
};

export const deleteRestaurantReaction = async (
  reviewId: number,
  type: ReactionType,
  userId: number,
) => {
  const accessToken = cookies().get('accessToken')?.value;
  const refreshToken = cookies().get('refreshToken')?.value;

  const serverApi = createServerApi(accessToken, refreshToken);

  try {
    const res = await serverApi.delete(
      `/restaurants/review/${reviewId}/reactions`,
      {
        data: {
          type,
          userId,
        },
      },
    );

    return { success: true, data: res.data };
  } catch (error: any) {
    if (error.name === 'RefreshTokenExpired') {
      return { success: false, reason: 'UNAUTHORIZED' };
    }
  }
};

export const updateRestaurantShareCount = async (restaurantId: number) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const res = await fetch(`${backendUrl}/restaurants/${restaurantId}/share`, {
    method: 'POST',
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || '에러 발생');
  }

  return data;
};

export const getStandardReviewById = async (reviewId: number) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const res = await fetch(
    `${backendUrl}/restaurants/review/standard/${reviewId}`,
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || '에러 발생');
  }

  return data;
};

export const updateStandardReview = async (
  reviewData: StandardReviewPayload,
  reviewId: number,
) => {
  const accessToken = cookies().get('accessToken')?.value;
  const refreshToken = cookies().get('refreshToken')?.value;

  const serverApi = createServerApi(accessToken, refreshToken);

  try {
    const res = await serverApi.patch(
      `/restaurants/review/standard/${reviewId}`,
      reviewData,
    );

    return { success: true, data: res.data };
  } catch (error: any) {
    if (error.name === 'RefreshTokenExpired') {
      return { success: false, reason: 'UNAUTHORIZED' };
    }
    return { success: false, reason: 'UNKNOWN_ERROR' };
  }
};

export const deleteReview = async (reviewId: number) => {
  const accessToken = cookies().get('accessToken')?.value;
  const refreshToken = cookies().get('refreshToken')?.value;

  const serverApi = createServerApi(accessToken, refreshToken);

  try {
    await serverApi.delete(`/restaurants/review/${reviewId}`);
  } catch (error: any) {
    if (error.name === 'RefreshTokenExpired') {
      return { success: false, reason: 'UNAUTHORIZED' };
    }
    return { success: false, reason: 'UNKNOWN_ERROR' };
  }

  return { success: true, message: '리뷰가 성공적으로 삭제되었습니다.' };
};
