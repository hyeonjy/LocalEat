'use client';

import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
const cornerClasses = [
  'rounded-tl-[20px]', // index 0 → 왼쪽 상단
  'rounded-tr-[20px]', // index 1 → 오른쪽 상단
  'rounded-bl-[20px]', // index 2 → 왼쪽 하단
  'rounded-br-[20px]', // index 3 → 오른쪽 하단
];

const page = () => {
  const year = 2025;
  const month = 6;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const reviewDates = ['2025-07-05', '2025-07-11', '2025-07-23'];

  const dateCells = [];
  for (let i = 0; i < startDay; i++) {
    dateCells.push(<div key={`empty-${i}`} className="" />);
  }

  // 날짜 칸 생성
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const isReviewed = reviewDates.includes(dateStr);

    dateCells.push(
      <div
        key={i}
        className="flex h-[110px] w-[110px] flex-col items-center justify-center rounded-[12px] border border-[#E2E2E4] bg-[#F6F6F6]"
      >
        <span className="text-center text-[14px] font-semibold leading-[130%] text-[#ADADB3]">
          {i}
        </span>
        {/* {isReviewed && (
          <div className="mt-1 flex h-[40px] w-[40px] items-center justify-center rounded-md bg-gray-300">
            <span className="text-xs text-white">사진</span>
          </div>
        )} */}
      </div>,
    );
  }
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <div className="mx-auto mt-[113px] flex w-[1200px] gap-[126px]">
        <aside className="flex w-[282px] flex-col items-start gap-[20px]">
          <div className="flex w-[282px] gap-[49px]">
            <div className="flex items-center gap-[17px]">
              <div className="aspect-square h-[80px] w-[80px] overflow-hidden rounded-full bg-[#ccc]">
                {user?.profileImage ? (
                  <img src={user.profileImage} />
                ) : (
                  <div className="h-full w-full rounded-full bg-gray-300" />
                )}
              </div>
              <div>
                <p className="self-stretch text-[20px] font-bold leading-[100%] text-[#171719]">
                  {user?.nickname}
                </p>
                <span className="text-[14px] font-normal leading-[100%] text-[#171719]">
                  팔로워 0
                </span>
                <span className="text-[14px] font-normal leading-[100%] text-[#171719]">
                  팔로잉 0
                </span>
              </div>
            </div>
            <div className="h-[24px] w-[24px] rounded-full bg-[#ccc]">
              {/* 스피너 */}
            </div>
          </div>

          <div className="flex h-[54px] w-full justify-between self-stretch rounded-[12px] border border-[#C7C7CC]">
            <div className="my-[9px] flex w-[50%] flex-col justify-center border-r border-r-[#ccc]">
              <p className="text-center text-[16px] font-bold leading-[130%] tracking-[0.16px] text-[#171719]">
                1000P
              </p>
              <span className="text-center text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#171719]">
                내 포인트
              </span>
            </div>
            <div className="my-[9px] flex w-[50%] flex-col justify-center">
              <p className="text-center text-[16px] font-bold leading-[130%] tracking-[0.16px] text-[#171719]">
                10
              </p>
              <span className="text-center text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#171719]">
                내 기록
              </span>
            </div>
          </div>
          <Link
            href=""
            className="flex h-[50px] items-center justify-center gap-[8px] self-stretch rounded-[10px] bg-[#FA4D09] px-[24px] py-[10px] text-center text-[20px] font-semibold leading-[150%] text-white"
          >
            포인트 상점 구경하기
          </Link>
        </aside>
        <div>
          <section>
            <h2 className="text-[32px] font-bold leading-[130%] tracking-[-0.48px] text-[#171719]">
              맛집 캘린더
            </h2>
            <div>
              <h3 className="text-center text-[24px] font-semibold leading-[130%] tracking-[-0.36px] text-[#171719]">
                2025.5
              </h3>
              <div className="w-[770px]">
                <div className="mb-2 grid grid-cols-7 gap-[2px]">
                  {['일', '월', '화', '수', '목', '금', '토'].map(
                    (day, index) => (
                      <div
                        key={index}
                        className="flex h-[40px] w-[110px] items-center justify-center text-center text-[14px] font-semibold leading-[130%] text-[#ADADB3]"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>
                <div className="grid grid-cols-7 gap-[2px]">{dateCells}</div>
              </div>
            </div>
          </section>
          <section className="my-[20px]">
            <h2 className="text-[32px] font-bold leading-[130%] tracking-[-0.48px] text-[#171719]">
              찜한 식당
            </h2>
            <ul className="mt-[12px] flex">
              <li className="w-[180px]">
                <div className="h-[180px] w-full self-stretch rounded-[12px] bg-[#ccc]">
                  {/* 이미지*/}
                </div>
                <h3 className="mt-[8px] self-stretch text-[16px] font-semibold leading-[130%] tracking-[0.16px] text-[#171719]">
                  신림흥미닭발
                </h3>
                <p className="mt-[4px] self-stretch text-[14px] font-normal leading-[130%] text-[#787882]">
                  신림동
                </p>
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-[32px] font-bold leading-[130%] tracking-[-0.48px] text-[#171719]">
              좋아한 잇터 컬렉션
            </h2>
            <ul className="flex w-[100%] gap-6 pt-[12px]">
              <li>
                <div className="flex w-[282px] flex-col items-start overflow-hidden rounded-[20px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.15)]">
                  {/* 이미지 그리드 */}
                  <div className="relative w-full">
                    <div className="flex flex-wrap gap-[2px] self-stretch rounded-t-[20px] bg-[#FFFFFF] p-[3px]">
                      {[1, 2, 3, 4].map((_, index) => (
                        <div
                          key={index}
                          className={`flex aspect-[137/131] w-[calc(50%-1px)] items-center justify-center bg-[#E5E5E5] text-[12px] text-[#999999] ${cornerClasses[index]}`}
                        >
                          이미지 {index + 1}
                        </div>
                      ))}
                    </div>

                    {/* 프로필 이미지 */}
                    <div className="absolute -bottom-[28px] left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full bg-[#FFFFFF] p-[4px]">
                      <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#E5E5E5] text-[12px] text-[#999999]">
                        프로필
                      </div>
                    </div>
                  </div>

                  {/* 프로필 이미지 아래 공간 확보 */}
                  <div className="mt-[40px] flex w-full flex-col items-center gap-2 pb-4">
                    <p className="text-[16px] font-semibold text-[#171719]">
                      장군쪼만
                    </p>
                    <p className="text-center text-[14px] text-[#8C8C8C]">
                      내가 가려고 만든 신림동 혼술 식당
                    </p>
                    <div className="flex items-center justify-center gap-2 text-[12px] text-[#8C8C8C]">
                      <span>좋아요 20</span>
                      <span className="h-[10px] w-[1px] bg-[#D9D9D9]"></span>
                      <span>댓글 130</span>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex w-[282px] flex-col items-start overflow-hidden rounded-[20px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.15)]">
                  {/* 이미지 그리드 */}
                  <div className="relative w-full">
                    <div className="flex flex-wrap gap-[2px] self-stretch rounded-t-[20px] bg-[#FFFFFF] p-[3px]">
                      {[1, 2, 3, 4].map((_, index) => (
                        <div
                          key={index}
                          className={`flex aspect-[137/131] w-[calc(50%-1px)] items-center justify-center bg-[#E5E5E5] text-[12px] text-[#999999] ${cornerClasses[index]}`}
                        >
                          이미지 {index + 1}
                        </div>
                      ))}
                    </div>

                    {/* 프로필 이미지 */}
                    <div className="absolute -bottom-[28px] left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full bg-[#FFFFFF] p-[4px]">
                      <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#E5E5E5] text-[12px] text-[#999999]">
                        프로필
                      </div>
                    </div>
                  </div>

                  {/* 프로필 이미지 아래 공간 확보 */}
                  <div className="mt-[40px] flex w-full flex-col items-center gap-2 pb-4">
                    <p className="text-[16px] font-semibold text-[#171719]">
                      장군쪼만
                    </p>
                    <p className="text-center text-[14px] text-[#8C8C8C]">
                      내가 가려고 만든 신림동 혼술 식당
                    </p>
                    <div className="flex items-center justify-center gap-2 text-[12px] text-[#8C8C8C]">
                      <span>좋아요 20</span>
                      <span className="h-[10px] w-[1px] bg-[#D9D9D9]"></span>
                      <span>댓글 130</span>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex w-[282px] flex-col items-start overflow-hidden rounded-[20px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.15)]">
                  {/* 이미지 그리드 */}
                  <div className="relative w-full">
                    <div className="flex flex-wrap gap-[2px] self-stretch rounded-t-[20px] bg-[#FFFFFF] p-[3px]">
                      {[1, 2, 3, 4].map((_, index) => (
                        <div
                          key={index}
                          className={`flex aspect-[137/131] w-[calc(50%-1px)] items-center justify-center bg-[#E5E5E5] text-[12px] text-[#999999] ${cornerClasses[index]}`}
                        >
                          이미지 {index + 1}
                        </div>
                      ))}
                    </div>

                    {/* 프로필 이미지 */}
                    <div className="absolute -bottom-[28px] left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full bg-[#FFFFFF] p-[4px]">
                      <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#E5E5E5] text-[12px] text-[#999999]">
                        프로필
                      </div>
                    </div>
                  </div>

                  {/* 프로필 이미지 아래 공간 확보 */}
                  <div className="mt-[40px] flex w-full flex-col items-center gap-2 pb-4">
                    <p className="text-[16px] font-semibold text-[#171719]">
                      장군쪼만
                    </p>
                    <p className="text-center text-[14px] text-[#8C8C8C]">
                      내가 가려고 만든 신림동 혼술 식당
                    </p>
                    <div className="flex items-center justify-center gap-2 text-[12px] text-[#8C8C8C]">
                      <span>좋아요 20</span>
                      <span className="h-[10px] w-[1px] bg-[#D9D9D9]"></span>
                      <span>댓글 130</span>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex w-[282px] flex-col items-start overflow-hidden rounded-[20px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.15)]">
                  {/* 이미지 그리드 */}
                  <div className="relative w-full">
                    <div className="flex flex-wrap gap-[2px] self-stretch rounded-t-[20px] bg-[#FFFFFF] p-[3px]">
                      {[1, 2, 3, 4].map((_, index) => (
                        <div
                          key={index}
                          className={`flex aspect-[137/131] w-[calc(50%-1px)] items-center justify-center bg-[#E5E5E5] text-[12px] text-[#999999] ${cornerClasses[index]}`}
                        >
                          이미지 {index + 1}
                        </div>
                      ))}
                    </div>

                    {/* 프로필 이미지 */}
                    <div className="absolute -bottom-[28px] left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full bg-[#FFFFFF] p-[4px]">
                      <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#E5E5E5] text-[12px] text-[#999999]">
                        프로필
                      </div>
                    </div>
                  </div>

                  {/* 프로필 이미지 아래 공간 확보 */}
                  <div className="mt-[40px] flex w-full flex-col items-center gap-2 pb-4">
                    <p className="text-[16px] font-semibold text-[#171719]">
                      장군쪼만
                    </p>
                    <p className="text-center text-[14px] text-[#8C8C8C]">
                      내가 가려고 만든 신림동 혼술 식당
                    </p>
                    <div className="flex items-center justify-center gap-2 text-[12px] text-[#8C8C8C]">
                      <span>좋아요 20</span>
                      <span className="h-[10px] w-[1px] bg-[#D9D9D9]"></span>
                      <span>댓글 130</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default page;
