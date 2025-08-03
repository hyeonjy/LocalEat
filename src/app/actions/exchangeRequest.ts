'use server';

import { createServerApi } from '@/lib/serverApi';
import { cookies } from 'next/headers';

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

    return { success: true, data: res.data };
  } catch (error: any) {
    if (error.name === 'RefreshTokenExpired') {
      return { success: false, reason: 'UNAUTHORIZED' };
    }
    return { success: false, reason: 'UNKNOWN', message: error.message };
  }
};
