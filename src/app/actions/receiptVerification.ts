'use server';

import { createServerApi } from '@/lib/serverApi';
import { cookies } from 'next/headers';

// 모든 영수증 검증 목록 조회 (관리자용)
export const getAllVerifications = async (filters: {
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
    if (filters.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters.page) {
      params.append('page', filters.page.toString());
    }
    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }
    if (filters.period) {
      params.append('period', filters.period);
    }

    const res = await serverApi.get(
      `/receipt-verifications?${params.toString()}`,
    );

    return res.data;
  } catch (error: any) {
    console.error('Error fetching all verifications:', error);

    if (error.name === 'RefreshTokenExpired') {
      return { success: false, reason: 'UNAUTHORIZED' };
    }
    return { success: false, reason: 'UNKNOWN', message: error.message };
  }
};

// 영수증 검증 상태 업데이트
export const updateVerificationStatus = async ({
  verificationId,
  status,
  adminComment,
}: {
  verificationId: string;
  status: '승인완료' | '승인거절';
  adminComment: string;
}) => {
  const accessToken = cookies().get('accessToken')?.value;
  const refreshToken = cookies().get('refreshToken')?.value;

  const serverApi = createServerApi(accessToken, refreshToken);

  try {
    await serverApi.patch(`/receipt-verifications/${verificationId}/status`, {
      status,
      adminComment,
    });

    return { success: true, message: '상태가 성공적으로 업데이트되었습니다.' };
  } catch (error: any) {
    console.error('Error updating verification status:', error);

    if (error.name === 'RefreshTokenExpired') {
      return { success: false, reason: 'UNAUTHORIZED' };
    }
    return { success: false, reason: 'UNKNOWN', message: error.message };
  }
};
