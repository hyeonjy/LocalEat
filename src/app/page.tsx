import Link from 'next/link';

const cornerClasses = [
  'rounded-tl-[20px]', // index 0 → 왼쪽 상단
  'rounded-tr-[20px]', // index 1 → 오른쪽 상단
  'rounded-bl-[20px]', // index 2 → 왼쪽 하단
  'rounded-br-[20px]', // index 3 → 오른쪽 하단
];

export default function Home() {
  return (
    <div>
      <section className="mt-[64px]">
        <div className="mx-auto flex w-[1280px] self-stretch rounded-[12px] bg-[#F7F7F8] px-[40px] py-[32px]">
          <div className="w-[343px]">
            <p className="pt-[30px] text-[24px] font-semibold leading-[130%] text-[#FA4D09]">
              리워드가 2배!
              <br />
              매주 찾아오는 지역 미션
            </p>
            <h2 className="mt-[12px] text-[60px] font-bold leading-[130%] tracking-[0.6px] text-[#171719]">
              이번 주 미션 신림동 편
            </h2>
            <Link
              href="none"
              className="mt-[36px] flex h-[60px] w-[166px] items-center justify-center gap-[8px] rounded-[12px] bg-[#FA4D09] px-[28px] py-[12px] text-center text-[20px] font-semibold leading-[150%] text-white"
            >
              자세히 보기
            </Link>
          </div>
          <ul className="ml-[64px] flex gap-[20px]">
            <li className="flex h-[386px] w-[386px] max-w-[386px] flex-col items-center justify-end gap-[10px] rounded-[20px] bg-[#ccc] p-[26px]">
              <div className="flex flex-col items-center justify-center self-stretch rounded-[8px] bg-white/95 px-[24px] py-[20px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.25)]">
                <div className="flex w-full items-end gap-[6px]">
                  <h3 className="text-[20px] font-bold leading-[100%] text-[#171719]">
                    세울타코
                  </h3>
                  <span className="text-[14px] font-normal leading-[100%] text-[#787882]">
                    리뷰 20
                  </span>
                </div>
                <p>관악산 근처 타코집 시원한 생맥과 자극적인 맛의 타코!</p>
              </div>
            </li>
            <li className="flex h-[386px] w-[386px] max-w-[386px] flex-col items-center justify-end gap-[10px] rounded-[20px] bg-[#ccc] p-[26px]">
              <div className="flex flex-col items-center justify-center self-stretch rounded-[8px] bg-white/95 px-[24px] py-[20px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.25)]">
                <div className="flex w-full items-end gap-[6px]">
                  <h3 className="text-[20px] font-bold leading-[100%] text-[#171719]">
                    세울타코
                  </h3>
                  <span className="text-[14px] font-normal leading-[100%] text-[#787882]">
                    리뷰 20
                  </span>
                </div>
                <p>관악산 근처 타코집 시원한 생맥과 자극적인 맛의 타코!</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section className="mt-[32px]">
        <div className="mx-auto w-[1280px] gap-[10px] self-stretch rounded-[12px] px-[40px] py-[32px]">
          <div className="flex w-full items-end justify-between">
            <div className="w-full">
              <p className="pt-[30px] text-[24px] font-semibold leading-[130%] text-[#FA4D09]">
                요즘 인기 있는 식당
              </p>
              <h2 className="text-[40px] font-bold leading-[130%] tracking-[0.4px] text-[#171719]">
                로컬잇 TOP 10
              </h2>
            </div>

            <Link
              className="flex w-[84px] items-center justify-center p-[2px] text-center text-[16px] font-normal leading-[130%] text-[#787882]"
              href="/places"
            >
              전체보기
            </Link>
          </div>
          <ul className="mt-[24px]">
            <li className="flex h-[472px] w-[282px] flex-col items-start overflow-hidden rounded-[20px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)]">
              <div className="h-[282px] w-full bg-[#ccc]">{/* 이미지 */}</div>
              <div className="flex flex-col items-start gap-[12px] self-stretch bg-white px-[24px] py-[20px]">
                <ul className="flex gap-[4px]">
                  <li className="font-pretendard flex items-center justify-center gap-[10px] rounded-[4px] bg-[#FEEDE6] px-[6px] py-[4px] text-[16px] font-normal leading-[130%] text-[#FA4D09]">
                    신당동
                  </li>
                  <li className="font-pretendard flex items-center justify-center gap-[10px] rounded-[4px] bg-[#E0F6F1] px-[6px] py-[4px] text-[16px] font-normal leading-[130%] text-[#004332]">
                    신당역
                  </li>
                </ul>
                <div className="flex gap-[12px]">
                  <span className="text-[32px] font-bold leading-[130%] tracking-[-0.48px] text-black">
                    1
                  </span>
                  <div>
                    <h3 className="self-stretch text-[20px] font-semibold leading-[130%] tracking-[-0.3px] text-black">
                      원조 남원 닭발
                    </h3>
                    <span className="text-[16px] font-normal leading-[130%] text-[#727275]">
                      리뷰 120
                    </span>
                  </div>
                </div>
                <p className="line-clamp-2 self-stretch overflow-hidden text-ellipsis border-t border-[#E2E2E4] pt-[8px] text-[16px] font-normal leading-[130%] text-[#010101]">
                  노포갬성 닭발집 숯향나는 통닭발에 맥주한잔하기 좋았어요
                  기본으로 깍두기
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section className="mt-[32px]">
        <div className="mx-auto w-[1280px] gap-[10px] self-stretch rounded-[12px] px-[40px] py-[32px]">
          <div className="flex w-full items-end justify-between">
            <div className="w-full">
              <p className="pt-[30px] text-[24px] font-semibold leading-[130%] text-[#FA4D09]">
                로컬잇에 새로 등록된 식당
              </p>
              <h2 className="text-[40px] font-bold leading-[130%] tracking-[0.4px] text-[#171719]">
                NEW EAT 10
              </h2>
            </div>

            <Link
              className="flex w-[84px] items-center justify-center p-[2px] text-center text-[16px] font-normal leading-[130%] text-[#787882]"
              href="/places"
            >
              전체보기
            </Link>
          </div>
          <div className="mx-auto mt-[24px] grid max-w-[1280px] grid-cols-[486px_384px_282px] grid-rows-[231px_231px] gap-[24px]">
            {/* 왼쪽 큰 카드: 2행 차지 */}
            <div className="row-span-2 h-[486px] w-[486px] rounded-xl bg-[#ccc] p-4">
              <p className="text-lg font-semibold text-white">
                맛있는 커피와
                <br />
                편안한 분위기의 만남
              </p>
              <p className="mt-2 text-sm text-white">광화문 벌새</p>
            </div>

            {/* 오른쪽 위 카드: 가로로 2열 합침 */}
            <div className="col-span-2 h-[231px] w-[690px] rounded-xl bg-[#FA4D09] p-4 text-white">
              <p className="text-xl font-bold">
                동네 사람들의
                <br />
                장칼국수 맛집 추천
              </p>
              <p className="mt-2 text-sm">포남동 금천칼국수</p>
            </div>

            {/* 오른쪽 아래 왼쪽 카드 */}
            <div className="h-[231px] w-[384px] rounded-xl bg-[#0F3B2E] p-4 text-white">
              <p className="text-lg font-semibold">
                맛있는 떡과
                <br />
                예쁜 인테리어
              </p>
              <p className="mt-2 text-sm">이동면 이동복떡집</p>
            </div>

            {/* 오른쪽 아래 오른쪽 카드 */}
            <div className="h-[231px] w-[282px] rounded-xl bg-[#ccc] p-4">
              <p className="text-lg font-bold">
                고사리의 변신 색다른 파스타 도전
              </p>
              <p className="mt-2 text-sm text-gray-700">
                신당동 고사리 익스프레스
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto w-[1280px] gap-[10px] self-stretch rounded-[12px] px-[40px] py-[32px]">
          <div className="flex w-full items-end justify-between">
            <div className="w-full">
              <p className="pt-[30px] text-[24px] font-semibold leading-[130%] text-[#FA4D09]">
                로컬잇터들의 방문 스토리 보러가기
              </p>
              <h2 className="text-[40px] font-bold leading-[130%] tracking-[0.4px] text-[#171719]">
                다녀왔밥 모음.zip
              </h2>
            </div>

            <Link
              className="flex w-[84px] items-center justify-center p-[2px] text-center text-[16px] font-normal leading-[130%] text-[#787882]"
              href="/places"
            >
              전체보기
            </Link>
          </div>
          <ul className="flex w-[1202px] flex-col items-start gap-[20px] bg-white px-0 pb-[37px] pt-[24px]">
            <li className="flex h-[360px] w-[240px] flex-shrink-0 flex-col items-center justify-center rounded-[18px] bg-[#ccc]">
              {/*이미지*/}
            </li>
          </ul>
        </div>
      </section>
      <section>
        <div className="mx-auto w-[1280px] gap-[10px] self-stretch rounded-[12px] px-[40px] py-[32px]">
          <div className="flex w-full items-end justify-between">
            <div className="w-full">
              <p className="pt-[30px] text-[24px] font-semibold leading-[130%] text-[#FA4D09]">
                맛집 탐방가 로컬잇터들의 동선 대공개!
              </p>
              <h2 className="text-[40px] font-bold leading-[130%] tracking-[0.4px] text-[#171719]">
                로컬잇터 컬렉션
              </h2>
            </div>

            <Link
              className="flex w-[84px] items-center justify-center p-[2px] text-center text-[16px] font-normal leading-[130%] text-[#787882]"
              href="/places"
            >
              전체보기
            </Link>
          </div>
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
        </div>
      </section>
    </div>
  );
}
