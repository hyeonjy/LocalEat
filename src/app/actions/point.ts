'use server';

export const getUserPoints = async (id: string) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const res = await fetch(`${backendUrl}/users/${id}/points`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || '에러 발생');
  }

  return data;
};

export const getUserPointHistories = async (
  id: string,
  period: string,
  type: string,
) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  let url = `${backendUrl}/users/${id}/points/histories`;

  if (period) {
    url += `?period=${period}`;
  }

  if (type) {
    url += `&type=${type}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || '에러 발생');
  }

  return data;
};
