'use client';

import { getTopRecentRestaurants } from '@/app/actions/restaurant';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';

const NewEatRestaurant = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['topRecentRestaurants'],
    queryFn: () => getTopRecentRestaurants(),
  });

  const items = (data ?? []).slice(0, 4);

  const Info = ({
    title,
    sub,
    strong = false,
  }: {
    title?: string;
    sub?: string;
    strong?: boolean;
  }) => (
    <div className="absolute bottom-4 left-4 right-4 text-white">
      <p
        className={`${strong ? 'text-[20px] font-bold' : 'text-[16px] font-semibold'} leading-[130%]`}
      >
        {title ?? '식당명'}
      </p>
      <p className="mt-1 text-[13px] opacity-90">{sub ?? ''}</p>
    </div>
  );

  const ImgFill = ({
    src,
    alt,
    priority = false,
  }: {
    src?: string;
    alt: string;
    priority?: boolean;
  }) =>
    src ? (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority={priority}
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center bg-[#ccc] text-white">
        이미지 준비중
      </div>
    );

  return (
    <section className="mt-[32px]">
      <div className="w/full mx-auto max-w-[1280px] rounded-[12px] px-4 py-[32px] xl:px-[40px]">
        <div className="flex w-full items-end justify-between">
          <div className="w-full">
            <p className="pt-[30px] font-semibold leading-[130%] text-[#FA4D09] max-[721px]:text-[16px] min-[722px]:text-[24px]">
              로컬잇에 새로 등록된 식당
            </p>
            <h2 className="font-bold leading-[130%] tracking-[0.4px] text-[#171719] max-[721px]:text-[24px] min-[722px]:text-[40px]">
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

        {/* GRID */}
        <div className="mx-auto mt-[24px] grid grid-cols-1 gap-[24px] min-[722px]:grid-cols-2 lg:grid-cols-2 xl:grid-cols-[486px_384px_282px] xl:grid-rows-[231px_231px]">
          {/* 1) 왼쪽 큰 카드 (이미지 + 오버레이 텍스트) */}
          <Link
            href={items[0] ? `/restaurant/${items[0].id}` : '#'}
            className="relative h-[486px] w-full overflow-hidden rounded-xl min-[722px]:col-span-2 xl:col-span-1 xl:row-span-2"
          >
            {isLoading ? (
              <div className="h-full w-full animate-pulse rounded-xl bg-[#eaeaea]" />
            ) : (
              <>
                <ImgFill
                  src={items[0]?.image_url}
                  alt={items[0]?.name ?? 'restaurant'}
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <Info
                  title={items[0]?.name}
                  sub={items[0]?.address || items[0]?.category}
                  strong
                />
              </>
            )}
          </Link>

          {/* 2) 우측 상단: "이미지(좌) + 주황 패널(우)" 한 카드 */}
          <Link
            href={items[1] ? `/restaurant/${items[1].id}` : '#'}
            className="relative h-[231px] w-full overflow-hidden rounded-xl min-[722px]:col-span-2 xl:col-span-2"
          >
            {isLoading ? (
              <div className="h-full w-full animate-pulse rounded-xl bg-[#eaeaea]" />
            ) : (
              <div className="absolute inset-0 flex">
                {/* 이미지 영역(좌) */}
                <div className="relative h-full flex-[0_0_55%]">
                  <ImgFill
                    src={items[1]?.image_url}
                    alt={items[1]?.name ?? 'restaurant'}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                </div>
                {/* 주황 텍스트 패널(우) */}
                <div className="relative h-full flex-1 overflow-hidden bg-[#FA4D09]">
                  {/* 워터마크 */}
                  <div className="pointer-events-none absolute -right-6 -top-10 select-none text-[120px] font-extrabold leading-none text-white/10">
                    Local
                  </div>
                  <div className="absolute inset-y-0 left-6 right-6 flex flex-col justify-center text-white">
                    <p className="line-clamp-2 text-[18px] font-bold leading-[130%]">
                      {items[1]?.name}
                    </p>
                    <p className="mt-2 text-[13px] opacity-90">
                      {items[1]?.address || items[1]?.category}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Link>

          {/* 3) 아래 왼쪽: "이미지(좌) + 녹색 패널(우)" 한 카드 */}
          <Link
            href={items[2] ? `/restaurant/${items[2].id}` : '#'}
            className="relative h-[231px] w-full overflow-hidden rounded-xl"
          >
            {isLoading ? (
              <div className="h-full w-full animate-pulse rounded-xl bg-[#eaeaea]" />
            ) : (
              <div className="absolute inset-0 flex">
                {/* 이미지 영역(좌) */}
                <div className="relative h-full flex-[0_0_55%]">
                  <ImgFill
                    src={items[2]?.image_url}
                    alt={items[2]?.name ?? 'restaurant'}
                  />
                </div>
                {/* 녹색 텍스트 패널(우) */}
                <div className="relative h-full flex-1 overflow-hidden bg-[#0F3B2E]">
                  <div className="pointer-events-none absolute -right-4 -top-6 select-none text-[120px] font-extrabold leading-none text-black/15">
                    eat
                  </div>
                  <div className="absolute inset-y-0 left-6 right-6 flex flex-col justify-center text-white">
                    <p className="line-clamp-2 text-[16px] font-semibold leading-[130%]">
                      {items[2]?.name}
                    </p>
                    <p className="mt-2 text-[13px] opacity-90">
                      {items[2]?.address || items[2]?.category}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Link>

          {/* 4) 아래 오른쪽: 이미지 안에 텍스트 */}
          <Link
            href={items[3] ? `/restaurant/${items[3].id}` : '#'}
            className="relative h-[231px] w-full overflow-hidden rounded-xl"
          >
            {isLoading ? (
              <div className="h-full w-full animate-pulse rounded-xl bg-[#eaeaea]" />
            ) : (
              <>
                <ImgFill
                  src={items[3]?.image_url}
                  alt={items[3]?.name ?? 'restaurant'}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <Info
                  title={items[3]?.name}
                  sub={items[3]?.address || items[3]?.category}
                />
              </>
            )}
          </Link>
        </div>

        {isError && (
          <p className="mt-2 text-[14px] text-red-500">
            데이터를 불러오지 못했습니다.
          </p>
        )}
      </div>
    </section>
  );
};

export default NewEatRestaurant;
