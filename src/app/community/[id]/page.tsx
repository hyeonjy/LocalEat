'use client';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';

const page = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="mt-[64px]">
      <div className="mx-auto flex max-w-[1280px] gap-[24px] px-[40px]">
        <div className="w-[894px]">
          <div className="flex flex-col items-start self-stretch p-[40px]">
            {/* 제목 */}
            <div className="flex flex-col gap-[12px]">
              <ul className="flex">
                <li className="items-center justify-center gap-[10px] rounded-[4px] bg-[#F4F4F5] px-[12px] py-[6px] text-[16px] font-normal leading-[130%] tracking-[-0.24px] text-[#47474D]">
                  추천 요청
                </li>
              </ul>
              <h1 className="text-[28px] font-bold leading-[140%] text-[#171719]">
                홋카이도 삿포로 오타루 인생 맛집 알려주세요!
              </h1>
              <div className="flex text-[16px] font-normal leading-[130%] tracking-[-0.24px] text-[#787882]">
                <span>장군쪼만</span>
                <i className="px-[4px] not-italic">·</i>
                <span>9시간 전</span>
                <i className="px-[4px] not-italic">·</i>
                <span>조회 1,002</span>
              </div>
            </div>

            {/* 본문 */}
            <div className="prose mt-[28px] max-w-none leading-[180%] text-[#171719]">
              <p>
                안녕하세요! 이번 여름에 삿포로랑 오타루로 여행을 가요.
                <br />
                ‘인생 맛집’이라 불리는 곳이면 웨이팅이 있더라도 가볼까
                고민입니다 ㅎㅎ
              </p>
              <p>
                오타루 근처도 좋고 삿포로 시내 맛집도 좋고 지역 상관없이
                좋습니다!
              </p>
              <p>
                여행 기간은 총 3박 4일이고 호텔은 삿포로 시내에 예약했어요.
                <br />
                (대중교통 이용 위주로 여행하려고 합니다)
              </p>
            </div>

            {/* 이미지 */}
            <div className="mt-[32px] h-[415px] w-full bg-[#ccc]">
              {/* <img
              src="/sample-post.jpg"
              alt="샘플 이미지"
              className="rounded-[12px] object-cover"
            /> */}
            </div>
            {/* 링크 */}
            <ul className="mt-[28px] flex gap-[4px] text-right text-[16px] font-normal leading-[130%] tracking-[-0.24px] text-[#007558]">
              <li>#훗카이도여행</li>
              <li>#삿포로맛집</li>
            </ul>
          </div>
          {/* 댓글 */}
          <div className="p-[40px]">
            {/* 아이콘 바 */}
            <div className="flex items-center gap-[12px]">
              <button
                type="button"
                className="flex h-[41px] items-center justify-center gap-[4px] rounded-[8px] border border-[#C7C7CC] bg-[#FFF] px-[20px] py-[10px]"
              >
                <Image
                  src="/assets/icons/favorite.svg"
                  alt="좋아요_아이콘"
                  width={20}
                  height={20}
                />
                <span>123</span>
              </button>
              <button
                type="button"
                className="flex h-[41px] items-center justify-center gap-[4px] rounded-[8px] border border-[#C7C7CC] bg-[#EFEFF0] px-[20px] py-[10px]"
              >
                <Image
                  src="/assets/icons/message.svg"
                  alt="댓글_아이콘"
                  width={20}
                  height={20}
                />
                <span>12</span>
              </button>
              <Image
                src="/assets/icons/share.svg"
                alt="공유_아이콘"
                width={30}
                height={30}
              />
            </div>

            {/* 댓글 리스트 1개 예시 */}
            <ul>
              <li className="flex flex-col gap-[16px] py-[24px]">
                <div className="flex items-center gap-[12px]">
                  <div className="flex items-center gap-[10px]">
                    <p className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#FEEDE6] p-[5.715px]"></p>
                    <span className="text-[16px] font-semibold leading-[150%] text-[#2E2E32]">
                      김잇터
                    </span>
                  </div>
                  <span className="text-[14px] font-medium leading-[130%] text-[#5F5F68]">
                    지금 막
                  </span>
                </div>
                <div>
                  친구들이랑 삿포로 다녀왔었는데, 스스키노 쪽에 있는 작은
                  이자카야 진짜 좋았어요!관광지랑 멀지 않고 가격도 괜찮아서
                  부모님이랑도 다시 가고 싶더라구요.디저트 좋아하시면 오타루
                  르타오 초코 케이크는 무조건 드셔보셔야 해요…!회덮밥은 무조건
                  현지인 줄 서있는 집 따라가면 성공 확률 높아요 ㅎㅎ좋은 여행
                  되세요! ☺️
                </div>
                <div className="flex gap-[8px]">
                  <div className="flex gap-[16px]">
                    <button type="button" className="flex gap-[4px]">
                      <Image
                        src="/assets/icons/favorite_gray.svg"
                        alt="좋아요_아이콘"
                        width={20}
                        height={20}
                      />
                      <span>8</span>
                    </button>
                    <button type="button" className="flex gap-[4px]">
                      <Image
                        src="/assets/icons/massage_gray.svg"
                        alt="댓글_아이콘"
                        width={20}
                        height={20}
                      />
                      <span>12</span>
                    </button>
                  </div>
                </div>
              </li>
            </ul>

            {/* 댓글 입력창 */}
            <div className="flex flex-col items-start justify-center gap-[12px] self-stretch rounded-[12px] border border-[#C7C7CC] p-[24px]">
              <div className="flex items-center gap-[12px]">
                <div className="flex items-center gap-[10px]">
                  <p className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#FEEDE6] p-[5.715px]"></p>
                  <span className="text-[16px] font-semibold leading-[150%] text-[#2E2E32]">
                    김잇터
                  </span>
                </div>
                <span className="text-[14px] font-medium leading-[130%] text-[#5F5F68]">
                  지금 막
                </span>
              </div>
              <div className="flex flex-col items-end justify-end gap-[30px] self-stretch rounded-[10px] p-[14px_16px]">
                <textarea
                  placeholder="댓글을 입력하세요"
                  className="w-full resize-none rounded-[8px] border border-none border-[#E2E2E4] text-[16px] focus:outline-none"
                  rows={3}
                />
                <div className="mt-[8px] flex w-full justify-between">
                  <button
                    type="button"
                    className="flex items-center gap-[2px] border-none"
                  >
                    <Image
                      src="/assets/icons/link.svg"
                      alt="링크_아이콘"
                      width={16}
                      height={16}
                    />
                    <span>링크 추가</span>
                  </button>
                  <button
                    type="button"
                    className="flex h-[37px] items-center justify-center rounded-[8px] border border-[#C7C7CC] bg-[#FFF] px-[16px] py-[8px]"
                  >
                    등록
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-[474px] w-[282px] flex-col items-start gap-[40px] py-[40px]">
          <div className="flex w-[282px] items-start gap-[49px]">
            <div className="flex w-full shrink-0 items-center gap-[17px]">
              <p className="aspect-square h-[80px] w-[80px] rounded-full bg-[#ccc]">
                {/*이미지 */}
              </p>
              <div className="flex w-[112px] shrink-0 flex-col items-start gap-[4px]">
                <p className="self-stretch text-[20px] font-bold leading-[100%] text-[#171719]">
                  장군쪼만
                </p>
                <div className="flex gap-[12px]">
                  <p className="flex gap-[4px] text-[14px] font-normal leading-[100%] text-[#171719]">
                    <span>팔로워</span>
                    <span className="font-semibold">0</span>
                  </p>
                  <p className="flex gap-[4px] text-[14px] font-normal leading-[100%] text-[#171719]">
                    <span>팔로잉</span>
                    <span className="font-semibold">0</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[50px] w-[282px] items-center justify-center gap-[8px] self-stretch rounded-[10px] bg-[#FA4D09] px-[24px] py-[10px] text-center text-[18px] font-medium leading-[150%] text-white">
            팔로우
          </div>
          <div className="flex flex-col items-start gap-[16px] self-stretch rounded-[8px] border border-[#E2E2E4] p-[24px]">
            <h3 className="self-stretch text-[24px] font-semibold leading-[130%] tracking-[-0.36px] text-[#171719]">
              로컬잇 HOT🔥 Talk
            </h3>
            <ul className="flex flex-col items-start gap-4 self-stretch">
              <li className="line-clamp-1 max-w-[282px] overflow-hidden text-ellipsis text-[16px] font-normal leading-[130%] tracking-[-0.24px] text-[#171719]">
                1. 내가 나중에 보려고 만든 성수동 찐 맛집
              </li>
              <li className="text-[16px] font-normal leading-[130%] tracking-[-0.24px] text-[#92929B]">
                2. 고기 플레이팅 장인
              </li>{' '}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
