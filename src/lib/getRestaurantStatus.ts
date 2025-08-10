import { OpeningHours } from '@/types/restaurant';

export const getRestaurantStatus = (openingHours: OpeningHours) => {
  const now = new Date();
  const day = now.toLocaleString('en-US', { weekday: 'short' }).toLowerCase(); // 'mon', 'tue', ...
  const todayHours = openingHours[day as keyof OpeningHours];

  if (!todayHours || todayHours.closed) {
    return '오늘은 휴무입니다.';
  }

  const nowTime = now.getHours() * 60 + now.getMinutes(); // 현재 시간 (분 단위)
  const [openHour, openMin] = todayHours.open?.split(':').map(Number) ?? [0, 0];
  const [closeHour, closeMin] = todayHours.close?.split(':').map(Number) ?? [
    0, 0,
  ];

  const openTime = openHour * 60 + openMin;
  const closeTime = closeHour * 60 + closeMin;

  if (nowTime < openTime) {
    return `영업전 | ${todayHours.open} 영업시작`;
  } else if (nowTime >= openTime && nowTime < closeTime) {
    return todayHours.last_order
      ? `영업중 · ${todayHours.last_order}에 라스트오더`
      : '영업중';
  } else {
    return '영업종료';
  }
};
