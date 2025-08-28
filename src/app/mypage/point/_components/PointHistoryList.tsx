import { useUserPointHistories } from '@/hooks/usePoint';
import Image from 'next/image';
import { useState } from 'react';

type PointHistory = {
  id: number;
  created_at: string;
  source: string;
  amount: number;
  type: string;
  restaurant_id: number;
  restaurant_name: string;
  user_id: number;
};

type PointHistoryListProps = {
  userId: string;
};

const FILTERS = ['전체', '적립', '사용'];
const PERIODS = [
  { name: '전체', value: '전체' },
  { name: '최근 1개월', value: '1' },
  { name: '최근 3개월', value: '3' },
  { name: '최근 6개월', value: '6' },
];

const PointHistoryList = ({ userId }: PointHistoryListProps) => {
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [selectedPeriod, setSelectedPeriod] = useState('전체');

  const { data: historiesData, isPending } = useUserPointHistories(
    userId,
    selectedPeriod,
    selectedFilter === '전체' ? '' : selectedFilter,
  );

  const pointHistories = historiesData?.histories || [];

  const filteredHistories =
    selectedFilter === '전체'
      ? pointHistories
      : pointHistories.filter(
          (history: PointHistory) => history.type === selectedFilter,
        );

  // 날짜별 그룹핑 (한국 시간 기준)
  const groupByDate = () => {
    const groups = new Map<string, Array<PointHistory & { koreaTime: Date }>>();

    filteredHistories.forEach((history: PointHistory) => {
      // UTC 시간을 한국 시간으로 변환
      const utcDate = new Date(history.created_at);
      const koreaTime = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000); // UTC+9

      const month = String(koreaTime.getMonth() + 1).padStart(2, '0');
      const day = String(koreaTime.getDate()).padStart(2, '0');
      const dateKey = `${month}.${day}`;

      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push({ ...history, koreaTime });
    });

    return Array.from(groups.entries());
  };

  return (
    <>
      {/* 필터 탭과 기간 선택 */}
      <div className="mb-2 mt-[20px] flex h-[36px] items-center justify-between">
        {/* 필터 탭 */}
        <div className="flex space-x-[6px]">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`flex h-[30px] w-[49px] items-center justify-center whitespace-nowrap rounded-[20px] border border-[#C7C7CC] px-[12px] py-[8px] text-[14px] font-normal leading-[100%] text-[#2E2E32] ${
                selectedFilter === filter
                  ? 'border-[#FA4D09] bg-[#FEEDE6] text-[#FA4D09]'
                  : 'bg-white'
              }`}
              disabled={isPending}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* 기간 선택 드롭다운 */}
        <div className="relative h-[36px] w-[179px]">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="h-[36px] w-full cursor-pointer appearance-none rounded-[4px] border border-[#E2E2E4] bg-white px-3 py-2 pl-[12px] focus:outline-none disabled:opacity-50"
            disabled={isPending}
          >
            {PERIODS.map((period) => (
              <option
                key={period.value}
                value={period.value}
                className="flex h-[24px] items-center text-[14px] font-normal leading-[100%] text-[#171719]"
              >
                {period.name}
              </option>
            ))}
          </select>
          <Image
            src="/assets/icons/arrow_dropdown.svg"
            alt="arrow_down"
            width={24}
            height={24}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
          />
        </div>
      </div>

      {/* 포인트 내역 헤더 */}
      <div className="flex items-start bg-[#F7F7F8] text-[14px] font-normal leading-[130%] text-[#171719]">
        {/* 왼쪽 날짜 */}
        <div className="mr-[10px] w-[52px] pl-[10px] pt-3">날짜</div>

        {/* 오른쪽 리스트 */}
        <div className="w-full">
          <div className="flex items-center justify-between py-3">
            <div>상세</div>

            <div className="flex w-[156px] items-center gap-[30px]">
              <p className={`flex-1 text-center`}>포인트</p>

              <div className="flex-1 text-center">상태</div>
            </div>
          </div>
        </div>
      </div>

      {/* 포인트 내역 리스트 */}
      <div>
        {isPending ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">포인트 내역을 불러오는 중...</div>
          </div>
        ) : filteredHistories.length === 0 ? (
          <div className="rounded-lg bg-white p-6 text-center text-gray-500 sm:p-8">
            해당 기간에 포인트 내역이 없습니다.
          </div>
        ) : (
          groupByDate().map(([date, items]) => (
            <div key={date} className="flex items-start">
              {/* 왼쪽 날짜 */}
              <div className="mr-[10px] w-[52px] pl-[10px] pt-3 font-normal text-[#171719]">
                {date}
              </div>

              {/* 오른쪽 리스트 */}
              <div className="w-full">
                {items.map((history: PointHistory & { koreaTime: Date }) => {
                  const time = history.koreaTime.toISOString().slice(11, 16);

                  return (
                    <div
                      key={history.id}
                      className="flex items-center justify-between border-b border-[#E2E2E4] py-3"
                    >
                      <div>
                        <div className="mb-1 text-[16px] font-bold leading-[130%] text-[#171719]">
                          {history.restaurant_name}
                        </div>
                        <div className="text-[14px] font-normal leading-[100%] text-[#92929B]">
                          {time} | {history.source}
                        </div>
                      </div>
                      <div className="flex w-[156px] items-center gap-[30px]">
                        <p
                          className={`flex-1 text-[16px] font-bold ${
                            history.amount > 0
                              ? 'text-[#3177E8]'
                              : 'text-[#92929B]'
                          }`}
                        >
                          {history.amount > 0 ? '+' : ''}
                          {Math.abs(history.amount)}P
                        </p>

                        <div className="flex-1 rounded-[20px] bg-[#E9FBEB] px-[12px] py-[6px] text-[14px] font-medium leading-[130%] text-[#2E2E32]">
                          승인완료
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default PointHistoryList;
