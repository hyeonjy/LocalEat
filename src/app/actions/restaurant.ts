'use server';

import api from '@/lib/axios';
import {
  keywordSummaryProps,
  MenuProps,
  RestaurantProps,
  StandardReviewPayload,
  StandardReviewProps,
} from '@/types/restaurant';

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
  reviews: { standard: StandardReviewProps[]; graphic: [] };
  keywordSummary: keywordSummaryProps[];
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
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const res = await fetch(
    `${backendUrl}/restaurants/${reviewData.restaurantId}/review/standard`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || '리뷰 등록 실패');
  }

  return data;
};

export const getRestaurantReaction = async (id: string) => {
  try {
    const res = await api.get(`/restaurants/${id}/review/reactions`);
    return res.data;
  } catch (error: any) {
    // 로그인 안함 or 토큰 만료
    if (error.response?.status === 401) {
      return 'UNAUTHORIZED';
    }

    throw new Error('리뷰 리액션 조회 중 에러 발생');
  }
};
