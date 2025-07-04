const page = () => {
  return (
    <div className="mt-[87px]">
      <ul className="mx-auto mt-[23px] flex w-[1200px]">
        <li className="flex items-center justify-center gap-2.5 border-b-[3px] border-[#171719] px-[10px] py-2 font-[Pretendard] text-[20px] font-semibold leading-[130%] tracking-[-0.3px] text-[#171719]">
          로컬잇 TOP 10
        </li>
        <li className="flex items-center justify-center gap-2.5 px-[10px] py-2 font-[Pretendard] text-[20px] font-semibold leading-[130%] tracking-[-0.3px] text-[#ADADB3]">
          NEW 로컬잇
        </li>
      </ul>
      <section className="h-[370px] w-full bg-[#F98510]">
        <div className="mx-auto w-[1200px]">
          <h2 className="pt-[84px] font-[Pretendard] text-[40px] font-bold leading-[130%] tracking-[0.4px] text-white">
            로컬잇픽 우리 동네 맛집 TOP 10
          </h2>
          <p className="mt-[8px] font-[Pretendard] text-[20px] font-semibold leading-[130%] tracking-[-0.3px] text-white">
            방문 횟수, 리뷰를 바탕으로 검증된 로컬 맛집만 소개합니다.
          </p>
          <input
            className="mt-[32px] flex h-[60px] w-[524px] shrink-0 items-center gap-2 rounded-[12px] border border-[#92929B] bg-white px-[20px] py-[16px]"
            type="search"
            placeholder="지역명을 입력하세요"
          />
        </div>
      </section>
      <section className="w-full">
        <span className="mx-auto mt-[35px] block w-[1200px] font-[Pretendard] text-[14px] font-semibold leading-[130%] text-[#92929B]">
          매주 수요일 업데이트 · 현재 기준일: 5.28
        </span>
        <ul className="mx-auto mt-[15px] w-[1200px] flex-col gap-[64px]">
          <li className="flex h-[426px] gap-[46px]">
            <div className="w-[519px] rounded-[20px] bg-[#ccc]">이미지</div>
            <div className="w-[635px]">
              <div className="flex items-center gap-[10px]">
                <span className="font-pretendard flex items-center justify-center gap-[10px] rounded-[4px] bg-[#FEEDE6] px-[6px] py-[4px] text-[16px] font-normal leading-[130%] text-[#FA4D09]">
                  신당동
                </span>
                <span className="font-pretendard flex items-center justify-center gap-[10px] rounded-[4px] bg-[#E0F6F1] px-[6px] py-[4px] text-[16px] font-normal leading-[130%] text-[#004332]">
                  신당역
                </span>
              </div>
              <h3 className="font-pretendard flex items-center gap-[10px] pt-[10px] text-[34px] font-semibold leading-[140%] tracking-[-0.85px] text-[#171719]">
                1. 원조 남원 닭발
                <span className="font-[Pretendard] text-[14px] font-normal leading-[100%] text-[#787882]">
                  리뷰 287
                </span>
              </h3>
              <p className="pt-[10px] font-[Pretendard] text-[16px] font-normal leading-[130%] text-[#47474D]">
                직접 삶아 쫄깃한 식감이 살아있는 닭발에 매콤한 양념이 깊게 배어
                있어 중독성 있는 맛을 자랑해요. 술안주로도, 든든한 한 끼로도
                손색없는 남원의 숨은 맛집이에요.
              </p>
              <ul className="flex gap-[10px] pt-[10px]">
                <li className="flex h-[277px] w-[198px] flex-col items-start gap-[12px]">
                  <div className="h-[237px] w-full rounded-[16px] bg-[#ccc]">
                    {/*이미지*/}
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-[4.312px]">
                      <div className="h-[28px] w-[28px] rounded-[21.56px] bg-[#ccc]">
                        {/* 이미지 */}
                      </div>
                      <p className="max-w-[61px] overflow-hidden text-ellipsis whitespace-nowrap font-[Pretendard] text-[14px] font-semibold leading-[130%] text-[#171719]">
                        장군쪼만
                      </p>
                    </div>
                    <div className="font-[Pretendard] text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#5F5F68]">
                      7.24 • 1번째 방문
                    </div>
                  </div>
                </li>
                <li className="flex h-[277px] w-[198px] flex-col items-start gap-[12px]">
                  <div className="h-[237px] w-full rounded-[16px] bg-[#ccc]">
                    {/*이미지*/}
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-[4.312px]">
                      <div className="h-[28px] w-[28px] rounded-[21.56px] bg-[#ccc]">
                        {/* 이미지 */}
                      </div>
                      <p className="max-w-[61px] overflow-hidden text-ellipsis whitespace-nowrap font-[Pretendard] text-[14px] font-semibold leading-[130%] text-[#171719]">
                        장군쪼만
                      </p>
                    </div>
                    <div className="font-[Pretendard] text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#5F5F68]">
                      7.24 • 1번째 방문
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li className="flex h-[426px] gap-[46px]">
            <div className="w-[519px] rounded-[20px] bg-[#ccc]">이미지</div>
            <div className="w-[635px]">
              <div className="flex items-center gap-[10px]">
                <span className="font-pretendard flex items-center justify-center gap-[10px] rounded-[4px] bg-[#FEEDE6] px-[6px] py-[4px] text-[16px] font-normal leading-[130%] text-[#FA4D09]">
                  신당동
                </span>
                <span className="font-pretendard flex items-center justify-center gap-[10px] rounded-[4px] bg-[#E0F6F1] px-[6px] py-[4px] text-[16px] font-normal leading-[130%] text-[#004332]">
                  신당역
                </span>
              </div>
              <h3 className="font-pretendard flex items-center gap-[10px] pt-[10px] text-[34px] font-semibold leading-[140%] tracking-[-0.85px] text-[#171719]">
                1. 원조 남원 닭발
                <span className="font-[Pretendard] text-[14px] font-normal leading-[100%] text-[#787882]">
                  리뷰 287
                </span>
              </h3>
              <p className="pt-[10px] font-[Pretendard] text-[16px] font-normal leading-[130%] text-[#47474D]">
                직접 삶아 쫄깃한 식감이 살아있는 닭발에 매콤한 양념이 깊게 배어
                있어 중독성 있는 맛을 자랑해요. 술안주로도, 든든한 한 끼로도
                손색없는 남원의 숨은 맛집이에요.
              </p>
              <ul className="flex gap-[10px] pt-[10px]">
                <li className="flex h-[277px] w-[198px] flex-col items-start gap-[12px]">
                  <div className="h-[237px] w-full rounded-[16px] bg-[#ccc]">
                    {/*이미지*/}
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-[4.312px]">
                      <div className="h-[28px] w-[28px] rounded-[21.56px] bg-[#ccc]">
                        {/* 이미지 */}
                      </div>
                      <p className="max-w-[61px] overflow-hidden text-ellipsis whitespace-nowrap font-[Pretendard] text-[14px] font-semibold leading-[130%] text-[#171719]">
                        장군쪼만
                      </p>
                    </div>
                    <div className="font-[Pretendard] text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#5F5F68]">
                      7.24 • 1번째 방문
                    </div>
                  </div>
                </li>
                <li className="flex h-[277px] w-[198px] flex-col items-start gap-[12px]">
                  <div className="h-[237px] w-full rounded-[16px] bg-[#ccc]">
                    {/*이미지*/}
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-[4.312px]">
                      <div className="h-[28px] w-[28px] rounded-[21.56px] bg-[#ccc]">
                        {/* 이미지 */}
                      </div>
                      <p className="max-w-[61px] overflow-hidden text-ellipsis whitespace-nowrap font-[Pretendard] text-[14px] font-semibold leading-[130%] text-[#171719]">
                        장군쪼만
                      </p>
                    </div>
                    <div className="font-[Pretendard] text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#5F5F68]">
                      7.24 • 1번째 방문
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default page;
