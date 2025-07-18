const restaurants = [
  { name: '신림흥미닭발', location: '신림동' },
  { name: '홍대맛집', location: '홍대' },
  { name: '강남곱창', location: '강남' },
  { name: '이태원버거', location: '이태원' },
  { name: '합정치킨', location: '합정' },
  { name: '건대족발', location: '건대' },
  { name: '연남돈까스', location: '연남동' },
  { name: '성수브런치', location: '성수' },
];

export default function Page() {
  return (
    <div className="w-[full]">
      <section className="mx-auto mt-[104px] flex w-[820px] flex-col gap-[20px] px-[24px]">
        <h2 className="text-[32px] font-bold leading-[130%] tracking-[-0.48px] text-[#171719]">
          찜한 식당
        </h2>
        <ul className="mt-[12px] grid grid-cols-4 gap-[20px]">
          {restaurants.map((item, i) => (
            <li key={i} className="w-[180px] flex-shrink-0">
              <div className="h-[180px] w-full self-stretch rounded-[12px] bg-[#ccc]"></div>
              <h3 className="mt-[8px] self-stretch text-[16px] font-semibold leading-[130%] tracking-[0.16px] text-[#171719]">
                {item.name}
              </h3>
              <p className="mt-[4px] self-stretch text-[14px] font-normal leading-[130%] text-[#787882]">
                {item.location}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
