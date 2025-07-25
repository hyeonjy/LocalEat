const page = () => {
  return (
    <div>
      <section>
        <div className="h-[590px] w-full bg-[#ccc]">{/* visual 영역 */}</div>
      </section>
      <section>
        <div className="mx-auto flex h-[423px] w-[1280px] gap-[25px] px-[40px] pb-[32px] pt-[64px]">
          <div className="flex flex-[1_0_0] flex-col items-center justify-center gap-[46px] rounded-[20px] border border-[#E2E2E4] bg-[#FCFCFD] p-[80px_40px] shadow-[0_0_4px_0_rgba(0,0,0,0.15)]">
            <div className="flex w-full items-center justify-between">
              <h2 className="font-pretendard text-[40px] font-bold not-italic leading-[130%] tracking-[0.4px] text-[#171719]">
                내 미션 현황
              </h2>
              <p className="font-pretendard text-center text-[40px] font-bold not-italic leading-[130%] tracking-[0.4px] text-[#171719]">
                5/8
              </p>
            </div>
            <ul className="flex gap-[16px]">
              <li>
                <img
                  src="assets/icons/checked_stamp.svg"
                  alt="체크된_스템프_이미지"
                />
              </li>
              <li>
                <img
                  src="assets/icons/checked_stamp.svg"
                  alt="체크된_스템프_이미지"
                />
              </li>
              <li>
                <img
                  src="assets/icons/checked_stamp.svg"
                  alt="체크된_스템프_이미지"
                />
              </li>
              <li>
                <img
                  src="assets/icons/checked_stamp.svg"
                  alt="체크된_스템프_이미지"
                />
              </li>
              <li>
                <img
                  src="assets/icons/checked_stamp.svg"
                  alt="체크된_스템프_이미지"
                />
              </li>
              <li>
                <img
                  src="assets/icons/unchecked_stamp.svg"
                  alt="기본_스템프_이미지"
                />
              </li>
              <li>
                <img
                  src="assets/icons/unchecked_stamp.svg"
                  alt="기본_스템프_이미지"
                />
              </li>
              <li>
                <img
                  src="assets/icons/unchecked_stamp.svg"
                  alt="기본_스템프_이미지"
                />
              </li>
            </ul>
          </div>
          <div className="flex w-[282px] flex-col items-start gap-[10px] self-stretch rounded-[20px] bg-[#00A87E] p-[40px_24px]">
            <div className="flex h-[62px] w-[62px] items-center justify-center gap-[10px] rounded-[31px] bg-[#00A87E] px-[15px] shadow-[2px_2px_10px_0_rgba(0,0,0,0.25)]">
              <img
                src="assets/icons/mission_icon.svg"
                alt="미션_프로필_아이콘"
              />
            </div>
            <div className="font-pretendard mt-[34px] self-stretch text-[16px] font-semibold not-italic leading-[130%] tracking-[0.16px] text-white">
              <p className="h-[21px]">현재</p>
              <p className="mb-2 mt-[10px] flex items-baseline">
                <span className="text-[40px] font-extrabold leading-none">
                  김잇터님
                </span>
                <span className="ml-1 text-[16px] font-semibold">의</span>
              </p>
              <p className="mt-[16px] h-[21px]">포인트 잔액은</p>
              <p className="mb-2 mt-[10px] flex items-baseline">
                <span className="text-[40px] font-extrabold leading-none">
                  1000
                </span>
                <span className="ml-1 text-[16px] font-semibold">
                  포인트 입니다.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-center gap-[77px] self-stretch px-[40px] py-[32px]">
          <h2 className="text-center text-[40px] font-bold leading-[130%] tracking-[0.4px] text-[#171719]">
            이번 주 신림동 미션 대상 식당
          </h2>
          <ul className="ml-[64px] grid w-full grid-cols-3 gap-[20px]">
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
                <p className="mt-[6px]">
                  관악산 근처 타코집 시원한 생맥과 자극적인 맛의 타코!
                </p>
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
                <p className="mt-[6px]">
                  관악산 근처 타코집 시원한 생맥과 자극적인 맛의 타코!
                </p>
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
                <p className="mt-[6px]">
                  관악산 근처 타코집 시원한 생맥과 자극적인 맛의 타코!
                </p>
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
                <p className="mt-[6px]">
                  관악산 근처 타코집 시원한 생맥과 자극적인 맛의 타코!
                </p>
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
                <p className="mt-[6px]">
                  관악산 근처 타코집 시원한 생맥과 자극적인 맛의 타코!
                </p>
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
                <p className="mt-[6px]">
                  관악산 근처 타코집 시원한 생맥과 자극적인 맛의 타코!
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default page;
