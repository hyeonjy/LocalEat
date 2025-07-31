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
