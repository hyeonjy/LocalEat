import { getUserPointHistories, getUserPoints } from '@/app/actions/point';
import { useQuery } from '@tanstack/react-query';

export const useUserPoints = (userId: string) => {
  return useQuery({
    queryKey: ['userPoints', userId],
    queryFn: () => getUserPoints(userId),
    enabled: !!userId,
  });
};

export const useUserPointHistories = (
  userId: string,
  period: string,
  type: string,
) => {
  return useQuery({
    queryKey: ['userPointHistories', userId, period, type],
    queryFn: () => getUserPointHistories(userId, period, type),
    enabled: !!userId,
  });
};
