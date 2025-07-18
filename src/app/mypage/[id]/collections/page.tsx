const page = () => {
  return (
    <div className="relative mx-auto mt-[104px] w-[772px]">
      {/* 상단 배너 */}
      <div className="relative h-[200px] rounded-[12px] bg-[#ccc]">
        {/* 오른쪽 텍스트 */}
        <div className="absolute bottom-[12px] right-[12px] text-right text-[14px] leading-[1.3] text-white">
          게시물 10
          <br />
          좋아요 23 | 댓글 133
        </div>
      </div>

      {/* 프로필 */}
      <div className="relative z-10 -mt-[40px] flex flex-col items-center">
        <div className="h-[80px] w-[80px] rounded-full border-[3px] border-white bg-[#ccc]"></div>
        <h2 className="mt-[8px] text-[18px] font-semibold">장군쫩만</h2>
        <p className="mt-[4px] text-center text-[14px] leading-[130%] text-[#787882]">
          내가 가려고 만든 신림동 혼술 식당
          <br />
          신림동에 시끄럽지 않고 혼자서 책 읽으며 반주할 수 있는 식당으로
          선정해봤습니다...
        </p>
      </div>

      {/* 좋아요 댓글 공유 */}
      <div className="mt-[16px] flex justify-around border-b border-t border-[#E2E2E4] py-[12px]">
        <button className="text-[14px]">좋아요</button>
        <button className="text-[14px]">댓글</button>
        <button className="text-[14px]">공유</button>
      </div>

      {/* 가게 리스트 */}
      <ul className="mt-[16px] grid grid-cols-4 gap-[10px]">
        {[
          '광명대창집',
          '또순이원조순대 본점',
          '신림춘천집',
          '서울갈비',
          '막불감동',
          '목포수산',
          '아리차이',
          '서울타코',
        ].map((store) => (
          <li key={store} className="flex h-[231px] w-[180px] flex-col">
            <div className="flex-1 rounded-[8px] bg-[#ccc]"></div>
            <p className="mt-[4px] text-[14px] font-semibold">{store}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default page;
