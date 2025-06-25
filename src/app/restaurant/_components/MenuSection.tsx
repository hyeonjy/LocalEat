'use client';

import { MenuProps } from '@/types/restaurant';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type MenuSectionProps = {
  menus: MenuProps[];
};

const MenuSection = ({ menus }: MenuSectionProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative h-[557px] w-full bg-[#FFEFE8] px-5 py-10 xl:px-0">
      <h2 className="mx-auto mb-6 w-full max-w-[1120px] px-[60px] text-title-xl">
        대표 메뉴
      </h2>

      {/* 카드 + 버튼 wrapper */}
      <div className="relative mx-auto w-full max-w-[1120px] px-[60px]">
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: '#custom-prev',
            nextEl: '#custom-next',
          }}
          slidesPerView="auto"
          spaceBetween={isMounted ? 20 : 0}
          loop={true}
        >
          {menus.map((menu) => (
            <SwiperSlide
              key={menu.id}
              className={`!h-[353px] !w-[320px] rounded-[12px] border bg-white p-6 ${
                !isMounted ? 'mr-5' : ''
              }`}
            >
              <Image
                src={menu.image_url}
                alt={menu.name}
                className="mb-4 h-[221px] w-full rounded-md object-cover"
                width={273}
                height={221}
              />
              {menu.badge && (
                <p className="mb-[11px] inline-block rounded-[4px] bg-[#FEEDE6] px-[6px] py-[4px] text-label-mb font-medium text-[#FA4D09]">
                  {menu.badge}
                </p>
              )}
              <h3 className="mb-1 text-title-lm font-semibold">{menu.name}</h3>
              <p className="line-clamp-3 text-xs text-gray-500">
                {menu.description || ''}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 왼쪽 버튼 */}
        <button
          id="custom-prev"
          className="absolute left-[10px] top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[50%] bg-white shadow"
        >
          <Image
            src="/assets/icons/arrow_left.svg"
            className="h-[24px] w-[24px]"
            width={24}
            height={24}
            alt="이전"
          />
        </button>

        {/* 오른쪽 버튼 */}
        <button
          id="custom-next"
          className="absolute right-[10px] top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[50%] bg-white shadow"
        >
          <Image
            src="/assets/icons/arrow_right.svg"
            className="h-[24px] w-[24px]"
            width={24}
            height={24}
            alt="다음"
          />
        </button>
      </div>
    </section>
  );
};

export default MenuSection;
