'use server';

export const getUserReviews = async ({
  userId,
  type,
}: {
  userId: string;
  type: string;
}) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const res = await fetch(`${backendUrl}/users/${userId}/reviews?type=${type}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || '에러 발생');
  }

  return data;
};

export const getUserReceipts = async ({
  userId,
  status,
  month,
}: {
  userId: string;
  status: string;
  month: string;
}) => {
  console.log(status, month);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const res = await fetch(
    `${backendUrl}/users/${userId}/receipts?status=${status}&month=${month}`,
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || '에러 발생');
  }

  return data;
};

export const getUserReviewsCount = async (userId: string) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const res = await fetch(`${backendUrl}/users/${userId}/reviews/count`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || '에러 발생');
  }

  return data;
};
