const page = () => {
  return (
    <div className="mt-[64px]">
      <form className="mx-auto flex w-full max-w-[640px] flex-col gap-6 px-4 py-6">
        {/* 추천 요청 여부 */}
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-[#FA4D09]" />
          <span className="text-[16px] font-medium text-[#171719]">
            추천 요청 글이에요
          </span>
        </label>

        {/* 제목 입력 */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="title"
            className="text-[14px] font-medium text-[#5F5F68]"
          >
            제목
          </label>
          <input
            id="title"
            type="text"
            placeholder="예: 홋카이도 샵포로 오타루 인생 맛집 알려주세요!"
            className="w-full rounded-[8px] border border-[#E2E2E4] px-4 py-3 text-[16px] focus:outline-[#FA4D09]"
          />
        </div>

        {/* 내용 입력 */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="content"
            className="text-[14px] font-medium text-[#5F5F68]"
          >
            본문
          </label>
          <textarea
            id="content"
            rows={8}
            placeholder="본문을 작성해주세요. 해시태그는 #으로 시작하면 자동으로 링크됩니다."
            className="w-full rounded-[8px] border border-[#E2E2E4] px-4 py-3 text-[16px] focus:outline-[#FA4D09]"
          />
        </div>

        {/* 이미지 업로드 */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-[#5F5F68]">
            이미지 첨부 (선택)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="text-[14px]"
          />
        </div>

        {/* 등록 버튼 */}
        <button
          type="submit"
          className="mt-4 rounded-[8px] bg-[#FA4D09] px-6 py-3 text-[16px] font-semibold text-white"
        >
          게시글 등록하기
        </button>
      </form>
    </div>
  );
};

export default page;
