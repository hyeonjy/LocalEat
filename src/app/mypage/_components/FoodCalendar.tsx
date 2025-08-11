'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type Review = {
  visited_at: string;
  photos?: { image_url: string }[];
};

function ymd(date: Date) {
  const [y, m, d] = date
    .toLocaleDateString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .split('. ')
    .map((v) => v.replace('.', ''));

  return `${y}-${m}-${d}`;
}

export default function FoodCalendar({ reviews }: { reviews: Review[] }) {
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date());

  // 날짜별 사진 맵
  const photosByDate = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const r of reviews ?? []) {
      if (!r?.visited_at) continue;
      const key = ymd(new Date(r.visited_at));
      const urls = r.photos?.map((p) => p.image_url).filter(Boolean) ?? [];
      if (!map[key]) map[key] = [];
      map[key].push(...urls);
    }
    return map;
  }, [reviews]);

  // 캘린더 헤더
  const Header = ({ date }: { date: Date }) => {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    return (
      <div className="mb-[6px] mt-[12px] flex h-[31px] w-[792px] items-center justify-center gap-6 p-[10px]">
        <Image
          aria-label="이전달"
          onClick={() =>
            setActiveStartDate(
              (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1),
            )
          }
          src="/assets/icons/prev.svg"
          alt="calendar_icon"
          width={24}
          height={24}
          className="h-[24px] w-[24px] cursor-pointer"
        />
        <h3 className="text-center text-[24px] font-semibold">
          {y}.{m}
        </h3>
        <Image
          aria-label="다음달"
          onClick={() =>
            setActiveStartDate(
              (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1),
            )
          }
          src="/assets/icons/next.svg"
          alt="calendar_icon"
          width={24}
          height={24}
          className="h-[24px] w-[24px] cursor-pointer"
        />
      </div>
    );
  };

  return (
    <div className="food-cal">
      <Header date={activeStartDate} />
      <Calendar
        // 월 단위 뷰만
        locale="ko-KR"
        calendarType="gregory"
        minDetail="month"
        maxDetail="month"
        showNeighboringMonth={true}
        // 제어형 월 이동
        activeStartDate={activeStartDate}
        onActiveStartDateChange={(v) => {
          if (v?.activeStartDate) setActiveStartDate(v.activeStartDate);
        }}
        // 요일 라벨 (일~토)
        formatShortWeekday={(_, date) =>
          ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
        }
        // 셀 내부 콘텐츠
        tileContent={({ date, view }) => {
          if (view !== 'month') return null;
          const key = ymd(date);
          const photos = photosByDate[key] ?? [];
          if (photos.length === 0) return null;

          const main = photos[0];
          const more = photos.length - 1;

          return (
            <div className="relative mt-1 h-[110px] w-full overflow-hidden rounded-[12px]">
              <Image
                src={main}
                alt=""
                fill
                className="h-full w-full object-cover"
              />
              {more > 0 && (
                <span className="absolute right-1 top-1 rounded-full bg-[#FA4D09] px-[6px] py-[2px] text-[12px] font-bold text-white">
                  {more + 1}
                </span>
              )}
            </div>
          );
        }}
        // 셀 외형
        tileClassName={() =>
          '!bg-[#F6F6F6] !rounded-[12px] !border !border-[#E2E2E4] h-[110px] w-[110px]'
        }
        className="!w-[792px] !border-0 [&_.react-calendar__month-view__days]:gap-[4px] [&_.react-calendar__month-view__days__day--weekend_abbr]:!text-[#ADADB3] [&_.react-calendar__tile_abbr]:!text-[#ADADB3]"
        // 날짜 숫자 스타일
        formatDay={(_, date) => {
          const key = ymd(date);
          const hasPhotos = (photosByDate[key]?.length ?? 0) > 0;
          return hasPhotos ? '' : String(date.getDate()); // 리뷰 있으면 숫자 제거
        }}
      />
    </div>
  );
}
