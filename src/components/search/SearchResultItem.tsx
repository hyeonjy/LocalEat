'use client';
type PhotoPreview = { image_url?: string; text?: string };

type ItemProps = {
  it: any; // 서버 결과 형태(필요시 타입 구체화)
};

export default function SearchResultItem({ it }: ItemProps) {
  const title = it?.name ?? '이름 미상';
  const category = it?.category ?? '';
  const ratingNum = Number(it?.avg_rating);
  const rating = Number.isFinite(ratingNum) ? ratingNum.toFixed(1) : '–';

  const reviewCountNum = Number(it?.review_count);
  const reviewCount = Number.isFinite(reviewCountNum) ? reviewCountNum : 0;

  const photos: PhotoPreview[] = (it?.photos_preview as any[]) ?? [];
  const cover = it?.cover_image_url as string | undefined;
  const lastText =
    it?.last_review_body ?? photos?.[0]?.text ?? '아직 등록된 리뷰가 없습니다.';

  console.log(it);

  return (
    <div className="flex flex-col items-start gap-[10px] self-stretch border-b border-[#E2E2E4] bg-white pb-[12px] pl-[20px] pr-0 pt-[12px]">
      <div className="flex w-full justify-between pr-[20px]">
        <div className="flex flex-col">
          <h2 className="flex items-center gap-[6px] text-[20px] font-semibold leading-[130%] tracking-[-0.3px] text-[#171719]">
            {title}{' '}
            {category && (
              <span className="text-[16px] font-normal leading-[130%] tracking-[-0.24px] text-[#787882]">
                {category}
              </span>
            )}
          </h2>
          <div className="flex items-center gap-1 text-[16px] font-normal leading-[130%] text-[#171719]">
            <img
              src="/assets/icons/red_star.svg"
              alt="별점"
              className="h-[16px] w-[16px]"
            />
            {rating} <span className="text-[#787882]">리뷰 {reviewCount}</span>
          </div>
        </div>
        <img
          src="/assets/icons/bookmark.svg"
          alt="북마크"
          className="h-[24px] w-[24px]"
        />
      </div>

      <ul className="flex w-[464px] gap-[8px] overflow-hidden">
        {(photos.length ? photos.slice(0, 3) : [null, null, null]).map(
          (ph, idx) => (
            <li
              key={`${it?.id ?? 'x'}-ph-${idx}`}
              className="flex flex-col items-start overflow-hidden rounded-[12px]"
            >
              <div className="h-[170px] w-[170px] overflow-hidden rounded-[12px] bg-[#ccc]">
                {ph?.image_url ? (
                  <img
                    src={ph.image_url}
                    alt="리뷰 이미지"
                    className="h-[170px] w-[170px] object-cover"
                  />
                ) : cover ? (
                  <img
                    src={cover}
                    alt="대표 이미지"
                    className="h-[170px] w-[170px] object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-[#e5e5ea]" />
                )}
              </div>

              <div className="w-[170px] rounded-[12px] bg-[#F4F4F5] p-[12px]">
                <p className="line-clamp-3 overflow-hidden text-[12px] font-normal leading-[130%] tracking-[-0.24px] text-[#5F5F68]">
                  {ph?.text || lastText}
                </p>
              </div>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
