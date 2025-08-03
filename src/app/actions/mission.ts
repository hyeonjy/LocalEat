'use server';

export const getMissionRestaurants = async () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const res = await fetch(`${backendUrl}/restaurants/mission`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || '에러 발생');
  }

  return data;
};

export const getUserMissionCount = async (id: string) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const res = await fetch(`${backendUrl}/users/${id}/mission/completed-count`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || '에러 발생');
  }

  return data;
};
