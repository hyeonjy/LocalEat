'use server';

import { createServerApi } from '@/lib/serverApi';
import { cookies } from 'next/headers';

// 일반 사용자 교환권 신청
export const exchangeRequest = async (
  userId: number | undefined,
  exchangeType: string,
  amount: number,
  email: string,
) => {
  const accessToken = cookies().get('accessToken')?.value;
  const refreshToken = cookies().get('refreshToken')?.value;

  const serverApi = createServerApi(accessToken, refreshToken);

  try {
    const res = await serverApi.post(`exchange-requests/${userId}`, {
      exchangeType,
      amount,
      email,
    });

    return res.data;
  } catch (error: any) {
    if (error.name === 'RefreshTokenExpired') {
      return { success: false, reason: 'UNAUTHORIZED' };
    }
    return { success: false, reason: 'UNKNOWN', message: error.message };
  }
};

// 교환권 신청 목록 조회 (관리자용)
export const getAllExchangeRequests = async (filters: {
  status?: string;
  page?: number;
  limit?: number;
  period?: string;
}) => {
  const accessToken = cookies().get('accessToken')?.value;
  const refreshToken = cookies().get('refreshToken')?.value;

  const serverApi = createServerApi(accessToken, refreshToken);

  try {
    // 필터 파라미터 구성
    const params = new URLSearchParams();
    if (filters.status && filters.status !== '전체') {
      params.append('status', filters.status);
    }
    if (filters.page) {
      params.append('page', filters.page.toString());
    }
    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }
    if (filters.period && filters.period !== '전체') {
      params.append('period', filters.period);
    }

    const res = await serverApi.get(`/exchange-requests?${params.toString()}`);

    return res.data;
  } catch (error: any) {
    console.error('Error fetching exchange requests:', error);
    if (error.name === 'RefreshTokenExpired') {
      return { success: false, reason: 'UNAUTHORIZED' };
    }
    return { success: false, reason: 'UNKNOWN', message: error.message };
  }
};

// 교환권 신청 상태 업데이트
export const updateExchangeRequestStatus = async ({
  requestId,
  status,
  adminComment,
}: {
  requestId: string;
  status: '승인완료' | '승인거절';
  adminComment: string;
}) => {
  const accessToken = cookies().get('accessToken')?.value;
  const refreshToken = cookies().get('refreshToken')?.value;

  const serverApi = createServerApi(accessToken, refreshToken);

  try {
    await serverApi.patch(`/exchange-requests/${requestId}/status`, {
      status,
      adminComment,
    });

    return { success: true, message: '상태가 성공적으로 업데이트되었습니다.' };
  } catch (error: any) {
    console.error('Error updating exchange request status:', error);
    if (error.name === 'RefreshTokenExpired') {
      return { success: false, reason: 'UNAUTHORIZED' };
    }
    return { success: false, reason: 'UNKNOWN', message: error.message };
  }
};
