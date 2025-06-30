const cornerClasses = [
  'rounded-tl-[20px]', // index 0 → 왼쪽 상단
  'rounded-tr-[20px]', // index 1 → 오른쪽 상단
  'rounded-bl-[20px]', // index 2 → 왼쪽 하단
  'rounded-br-[20px]', // index 3 → 오른쪽 하단
];

const Community = () => {
  return (
    <div>
      <section className="mt-[64px] min-w-[1200px] bg-[#F4F4F5]">
        <div className="py-[75px] [padding-left:18.75%] [padding-right:18.75%]">
          <h2 className="font-pretendard text-[64px] font-extrabold leading-[130%] text-[#171719]">
            HOT🔥 로컬잇터 Talk
          </h2>
          <div className="mt-[40px] flex items-end items-center gap-3 rounded-xl bg-white px-10 py-5 shadow-[0px_5px_15px_0px_rgba(0,0,0,0.15)]">
            <h3 className="font-pretendard overflow-hidden text-ellipsis whitespace-nowrap text-[40px] font-extrabold leading-[100%] tracking-[-0.8px] text-[#171719]">
              내가 나중에 보려고 만든 성수동 맛집 북마크 모음집
            </h3>
            <span className="text-[12px] font-bold">오늘은 내가 리뷰어</span>
          </div>
          <div className="mt-[12px] flex items-end items-center gap-3 px-10 py-5">
            <h3 className="font-pretendard overflow-hidden text-ellipsis whitespace-nowrap text-[40px] leading-[100%] tracking-[-0.8px] text-[#787882]">
              고기 플레이팅 장인
            </h3>
            <span className="text-[12px] font-bold text-[#92929B]">
              맛피아 아님
            </span>
          </div>
          <div className="mt-[12px] flex items-end items-center gap-3 px-10 py-5">
            <h3 className="font-pretendard overflow-hidden text-ellipsis whitespace-nowrap text-[40px] leading-[100%] tracking-[-0.8px] text-[#787882]">
              투썸에서 실패하지 않는 디저트 모음
            </h3>
            <span className="text-[12px] font-bold text-[#92929B]">
              동네뿌셔지구뿌셔
            </span>
          </div>
          <div className="mt-[12px] flex items-end items-center gap-3 px-10 py-5">
            <h3 className="font-pretendard overflow-hidden text-ellipsis whitespace-nowrap text-[40px] leading-[100%] tracking-[-0.8px] text-[#787882]">
              두찜 신메뉴 실비곱찜닭 찐리뷰
            </h3>
            <span className="text-[12px] font-bold text-[#92929B]">
              입만열면그짓말이자동으루나와
            </span>
          </div>
          <div className="mt-[12px] flex items-end items-center gap-3 px-10 py-5">
            <h3 className="font-pretendard overflow-hidden text-ellipsis whitespace-nowrap text-[40px] leading-[100%] tracking-[-0.8px] text-[#787882]">
              아무튼 잇터톡 마지막 핫톡
            </h3>
            <span className="text-[12px] font-bold text-[#92929B]">
              플레인 크래커
            </span>
          </div>
        </div>
      </section>
      <section className="min-w-[1200px]">
        <div className="py-[80px] [padding-left:18.75%] [padding-right:18.75%]">
          <p className="text-primary-normal font-pretendard text-[24px] font-semibold leading-[31.2px] tracking-[-0.36px] text-[#FA4D09]">
            맛집 탐방가 로컬잇터들의 동선 대공개!
          </p>
          <h3 className="font-pretendard pt-[12px] text-[40px] font-bold leading-[52px] tracking-[0.4px] text-[#171719]">
            로컬잇터 컬렉션
          </h3>
          <div>
            <ul className="flex w-[100%] gap-2 pt-[28px]">
              <li className="flex h-[28px] items-center justify-center gap-[4px] rounded-full border border-[#FA4D09] bg-[#FEEDE6] px-[10px] py-[6px]">
                갯수
              </li>
              <li className="flex h-[28px] items-center justify-center gap-[4px] rounded-full border border-[#FA4D09] bg-[#FEEDE6] px-[10px] py-[6px]">
                최신
              </li>
              <li className="flex h-[28px] items-center justify-center gap-[4px] rounded-full border border-[#FA4D09] bg-[#FEEDE6] px-[10px] py-[6px]">
                #점심
              </li>
              <li className="flex h-[28px] items-center justify-center gap-[4px] rounded-full border border-[#C7C7CC] bg-[#FFF] px-[10px] py-[6px]">
                인기
              </li>
            </ul>
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
            <div className="mt-[36px] flex items-center gap-2">
              <hr className="h-px flex-1 border-none bg-[#D9D9D9]" />

              <button className="font-pretendard flex items-center justify-center gap-[10px] self-stretch rounded-[36px] border border-[#C7C7CC] px-[20px] py-[10px] text-[20px] font-semibold leading-[30px] text-[#47474D]">
                더 많은 컬렉션 보기
              </button>

              <hr className="h-px flex-1 border-none bg-[#D9D9D9]" />
            </div>
          </div>
        </div>
      </section>
      <section className="mt-[80px] min-w-[1200px] bg-[#F4F4F5]">
        <div className="py-[75px] [padding-left:18.75%] [padding-right:18.75%]">
          <h3 className="font-pretendard pt-[12px] text-[40px] font-bold leading-[52px] tracking-[0.4px] text-[#171719]">
            서울시 강서구 Eater 🍙 Talk
          </h3>
          <ul className="flex w-[100%] gap-[10px] pt-[28px]">
            <li className="flex items-center justify-center rounded-[8px] border border-[#FA4D09] bg-[#FFFFFF] px-[20px] py-[12px] text-[#FA4D09]">
              전체
            </li>
            <li className="flex items-center justify-center rounded-[8px] border border-[#E2E2E4] bg-[#FCFCFD] px-[20px] py-[12px]">
              추천 요청
            </li>
            <li className="flex items-center justify-center rounded-[8px] border border-[#E2E2E4] bg-[#FCFCFD] px-[20px] py-[12px]">
              지역 정보
            </li>
            <li className="flex items-center justify-center rounded-[8px] border border-[#E2E2E4] bg-[#FCFCFD] px-[20px] py-[12px]">
              동네 수다방
            </li>
          </ul>
          <ul className="mt-[48px]">
            <li className="border-t border-t-[#E2E2E4] py-[24px]">
              <div className="flex items-center gap-[40px]">
                <div className="h-[168px] w-[168px] items-center justify-center rounded-[20px] bg-[#E5E5E5] text-[12px] text-[#999999]">
                  이미지
                </div>

                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[16px] font-semibold text-[#171719]">
                      저녁 메뉴를 추천 받습니다 저언하
                    </h2>
                    <span className="text-[12px] text-[#8C8C8C]">댓글 12</span>
                  </div>

                  <p className="py-[24px] text-[14px] text-[#47474D]">
                    요즘 하루 세 끼 챙겨먹는 게 너무 귀찮아서 두 끼로 줄이려고
                    했는데... 저녁은 제대로 먹고 싶어요. 강서구 근처에서
                    든든하면서도 안 무겁고, 혼밥 가능한 데 있으면 추천
                    부탁드려요 저언하.
                  </p>

                  <div className="flex flex-wrap gap-[12px] text-[12px] text-[#8C8C8C]">
                    <p>추천 요청 · 지금막</p>
                    <span>#저녁추천</span>
                    <span>#혼밥맛집</span>
                    <span>#강서구</span>
                    <span>#메뉴고민</span>
                  </div>
                </div>
              </div>
            </li>
            <li className="border-t border-t-[#E2E2E4] py-[24px]">
              <div className="flex items-center gap-[40px]">
                <div className="h-[168px] w-[168px] items-center justify-center rounded-[20px] bg-[#E5E5E5] text-[12px] text-[#999999]">
                  이미지
                </div>

                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[16px] font-semibold text-[#171719]">
                      저녁 메뉴를 추천 받습니다 저언하
                    </h2>
                    <span className="text-[12px] text-[#8C8C8C]">댓글 12</span>
                  </div>

                  <p className="py-[24px] text-[14px] text-[#47474D]">
                    요즘 하루 세 끼 챙겨먹는 게 너무 귀찮아서 두 끼로 줄이려고
                    했는데... 저녁은 제대로 먹고 싶어요. 강서구 근처에서
                    든든하면서도 안 무겁고, 혼밥 가능한 데 있으면 추천
                    부탁드려요 저언하.
                  </p>

                  <div className="flex flex-wrap gap-[12px] text-[12px] text-[#8C8C8C]">
                    <p>추천 요청 · 지금막</p>
                    <span>#저녁추천</span>
                    <span>#혼밥맛집</span>
                    <span>#강서구</span>
                    <span>#메뉴고민</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Community;
