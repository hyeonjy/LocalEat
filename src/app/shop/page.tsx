import Link from 'next/link';

const page = () => {
  return (
    <div className="w-[full]">
      <div className="mx-auto mt-[104px] flex w-[1200px] gap-[40px]">
        <aside className="flex w-[282px] flex-col items-start gap-[20px]">
          <div className="flex w-[282px] gap-[49px]">
            <div className="flex items-center gap-[17px]">
              <div className="aspect-square h-[80px] w-[80px] rounded-full bg-[#ccc]">
                {/* 이미지 */}
              </div>
              <div>
                <p className="self-stretch text-[20px] font-bold leading-[100%] text-[#171719]">
                  장군쪼만
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
            포인트 사용 내역 확인 {'>'}
          </Link>
        </aside>
        <section>
          <div className="h-[247px] w-[878px] flex-shrink-0 rounded-[20px] border border-[#E2E2E4] px-[40px]">
            <section>
              <h2 className="font-pretendard mt-[40px] border-b border-[#F0F0F0] pb-[22px] text-[30px] font-bold not-italic leading-[100%] text-[#171719]">
                김잇터{' '}
                <span className="font-pretendard text-[16px] font-bold not-italic leading-[130%] tracking-[0.16px] text-[#171719]">
                  님의 포인트
                </span>
              </h2>
            </section>
            <section className="flex items-end">
              <div className="font-pretendard pt-[30px] text-[60px] font-bold not-italic leading-[130%] tracking-[0.6px] text-[#004332]">
                1,000<span className="px-[6px]">P</span>
              </div>
              <span className="font-pretendard flex items-center gap-[4px] text-[16px] font-bold not-italic leading-[130%] tracking-[-0.32px] text-[#5F5F68]">
                <img
                  src="/assets/icons/error_outline.svg"
                  alt="information icon"
                  width={24}
                  height={24}
                />
                포인트는 어떻게 모으나요?
              </span>
            </section>
          </div>
          <div className="mt-[80px] w-[878px]">
            <h2 className="font-pretendard text-[32px] font-bold not-italic leading-[130%] tracking-[-0.48px] text-black">
              포인트 상점
            </h2>
            <div className="mt-[40px] w-[full]">
              <h3 className="font-pretendard mb-[8px] w-[878px] text-[20px] font-bold not-italic leading-[100%] text-[#171719]">
                자주 찾는 쿠폰 교환권
              </h3>
              <ul className="flex h-[395px] w-[878px] gap-[32px] py-[12px]">
                <li className="flex w-[284px] flex-shrink-0 flex-col items-start rounded-[20px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)]">
                  <div className="flex h-[284px] items-center justify-center self-stretch rounded-t-[20px] bg-[#F5F5F8] px-[33px] py-[73px]">
                    {/*이미지*/}
                  </div>
                  <div className="flex flex-col items-start gap-[12px] self-stretch p-[12px]">
                    <h4 className="font-pretendard text-[20px] font-semibold not-italic leading-[130%] tracking-[-0.3px] text-[#171719]">
                      네이버 페이 3000원
                    </h4>
                    <div className="flex items-center gap-[12px]">
                      <p className="flex h-[14px] w-[169px] flex-[1_0_0] items-center rounded-[7px] bg-[#E2E2E4] pr-[92px]">
                        {/*게이지*/}
                      </p>
                      <span className="font-pretendard text-[16px] font-bold not-italic leading-[130%] tracking-[0.16px] text-[#171719]">
                        2000&nbsp;P
                      </span>
                    </div>
                    <Link
                      href=""
                      className="font-pretendard self-stretch text-[12px] font-normal not-italic leading-[130%] tracking-[-0.24px] text-[#787882]"
                    >
                      지금 바꾸러 가기
                    </Link>
                  </div>
                </li>
                <li className="flex w-[284px] flex-shrink-0 flex-col items-start rounded-[20px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)]">
                  <div className="flex h-[284px] items-center justify-center self-stretch rounded-t-[20px] bg-[#F5F5F8] px-[33px] py-[73px]">
                    {/*이미지*/}
                  </div>
                  <div className="flex flex-col items-start gap-[12px] self-stretch p-[12px]">
                    <h4 className="font-pretendard text-[20px] font-semibold not-italic leading-[130%] tracking-[-0.3px] text-[#171719]">
                      네이버 페이 3000원
                    </h4>
                    <div className="flex items-center gap-[12px]">
                      <p className="flex h-[14px] w-[169px] flex-[1_0_0] items-center rounded-[7px] bg-[#E2E2E4] pr-[92px]">
                        {/*게이지*/}
                      </p>
                      <span className="font-pretendard text-[16px] font-bold not-italic leading-[130%] tracking-[0.16px] text-[#171719]">
                        2000&nbsp;P
                      </span>
                    </div>
                    <Link
                      href=""
                      className="font-pretendard self-stretch text-[12px] font-normal not-italic leading-[130%] tracking-[-0.24px] text-[#787882]"
                    >
                      지금 바꾸러 가기
                    </Link>
                  </div>
                </li>
                <li className="flex w-[284px] flex-shrink-0 flex-col items-start rounded-[20px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)]">
                  <div className="flex h-[284px] items-center justify-center self-stretch rounded-t-[20px] bg-[#F5F5F8] px-[33px] py-[73px]">
                    {/*이미지*/}
                  </div>
                  <div className="flex flex-col items-start gap-[12px] self-stretch p-[12px]">
                    <h4 className="font-pretendard text-[20px] font-semibold not-italic leading-[130%] tracking-[-0.3px] text-[#171719]">
                      네이버 페이 3000원
                    </h4>
                    <div className="flex items-center gap-[12px]">
                      <p className="flex h-[14px] w-[169px] flex-[1_0_0] items-center rounded-[7px] bg-[#E2E2E4] pr-[92px]">
                        {/*게이지*/}
                      </p>
                      <span className="font-pretendard text-[16px] font-bold not-italic leading-[130%] tracking-[0.16px] text-[#171719]">
                        2000&nbsp;P
                      </span>
                    </div>
                    <Link
                      href=""
                      className="font-pretendard self-stretch text-[12px] font-normal not-italic leading-[130%] tracking-[-0.24px] text-[#787882]"
                    >
                      지금 바꾸러 가기
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
            <div className="mt-[40px] w-[full]">
              <h3 className="font-pretendard mb-[8px] w-[878px] text-[20px] font-bold not-italic leading-[100%] text-[#171719]">
                네이버 페이 포인트
              </h3>
              <ul className="flex h-[395px] w-[878px] gap-[32px] py-[12px]">
                <li className="flex w-[284px] flex-shrink-0 flex-col items-start rounded-[20px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)]">
                  <div className="flex h-[284px] items-center justify-center self-stretch rounded-t-[20px] bg-[#F5F5F8] px-[33px] py-[73px]">
                    {/*이미지*/}
                  </div>
                  <div className="flex flex-col items-start gap-[12px] self-stretch p-[12px]">
                    <h4 className="font-pretendard text-[20px] font-semibold not-italic leading-[130%] tracking-[-0.3px] text-[#171719]">
                      네이버 페이 3000원
                    </h4>
                    <div className="flex items-center gap-[12px]">
                      <p className="flex h-[14px] w-[169px] flex-[1_0_0] items-center rounded-[7px] bg-[#E2E2E4] pr-[92px]">
                        {/*게이지*/}
                      </p>
                      <span className="font-pretendard text-[16px] font-bold not-italic leading-[130%] tracking-[0.16px] text-[#171719]">
                        2000&nbsp;P
                      </span>
                    </div>
                    <Link
                      href=""
                      className="font-pretendard self-stretch text-[12px] font-normal not-italic leading-[130%] tracking-[-0.24px] text-[#787882]"
                    >
                      지금 바꾸러 가기
                    </Link>
                  </div>
                </li>
                <li className="flex w-[284px] flex-shrink-0 flex-col items-start rounded-[20px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)]">
                  <div className="flex h-[284px] items-center justify-center self-stretch rounded-t-[20px] bg-[#F5F5F8] px-[33px] py-[73px]">
                    {/*이미지*/}
                  </div>
                  <div className="flex flex-col items-start gap-[12px] self-stretch p-[12px]">
                    <h4 className="font-pretendard text-[20px] font-semibold not-italic leading-[130%] tracking-[-0.3px] text-[#171719]">
                      네이버 페이 3000원
                    </h4>
                    <div className="flex items-center gap-[12px]">
                      <p className="flex h-[14px] w-[169px] flex-[1_0_0] items-center rounded-[7px] bg-[#E2E2E4] pr-[92px]">
                        {/*게이지*/}
                      </p>
                      <span className="font-pretendard text-[16px] font-bold not-italic leading-[130%] tracking-[0.16px] text-[#171719]">
                        2000&nbsp;P
                      </span>
                    </div>
                    <Link
                      href=""
                      className="font-pretendard self-stretch text-[12px] font-normal not-italic leading-[130%] tracking-[-0.24px] text-[#787882]"
                    >
                      지금 바꾸러 가기
                    </Link>
                  </div>
                </li>
                <li className="flex w-[284px] flex-shrink-0 flex-col items-start rounded-[20px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)]">
                  <div className="flex h-[284px] items-center justify-center self-stretch rounded-t-[20px] bg-[#F5F5F8] px-[33px] py-[73px]">
                    {/*이미지*/}
                  </div>
                  <div className="flex flex-col items-start gap-[12px] self-stretch p-[12px]">
                    <h4 className="font-pretendard text-[20px] font-semibold not-italic leading-[130%] tracking-[-0.3px] text-[#171719]">
                      네이버 페이 3000원
                    </h4>
                    <div className="flex items-center gap-[12px]">
                      <p className="flex h-[14px] w-[169px] flex-[1_0_0] items-center rounded-[7px] bg-[#E2E2E4] pr-[92px]">
                        {/*게이지*/}
                      </p>
                      <span className="font-pretendard text-[16px] font-bold not-italic leading-[130%] tracking-[0.16px] text-[#171719]">
                        2000&nbsp;P
                      </span>
                    </div>
                    <Link
                      href=""
                      className="font-pretendard self-stretch text-[12px] font-normal not-italic leading-[130%] tracking-[-0.24px] text-[#787882]"
                    >
                      지금 바꾸러 가기
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;
