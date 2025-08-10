'use client';

import { MenuProps } from '@/types/restaurant';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type MenuSectionProps = {
  name: string;
  menus: MenuProps[];
};

const MenuSection = ({ name, menus }: MenuSectionProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative mb-[64px] h-[336px] w-full px-5 xl:px-0">
      <div className="mx-auto mb-6 flex w-full max-w-[1200px] text-[24px] font-semibold leading-[130%]">
        <h2 className="text-[#FA4D09]">{name}</h2>
        <p className="text-[#171719]">의 대표 메뉴</p>
      </div>

      {/* 카드 + 버튼 wrapper */}
      <div className="relative mx-auto flex w-full max-w-[1200px]">
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: '#custom-prev',
            nextEl: '#custom-next',
          }}
          slidesPerView="auto"
          spaceBetween={isMounted ? 24 : 0}
          loop={true}
        >
          {menus.map((menu) => (
            <SwiperSlide
              key={menu.id}
              className={`!h-[281px] !w-[282px] rounded-[20px] bg-white ${
                !isMounted ? 'mr-6' : ''
              }`}
              style={{
                boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.15)',
              }}
            >
              <div className="relative h-[281px] w-full overflow-hidden rounded-t-[20px] p-[12px] pb-[16px]">
                <Image
                  src={menu.image_url}
                  alt={menu.name}
                  className="h-[220px] w-[258px] object-cover"
                  width={258}
                  height={220}
                />
                {menu.badge && (
                  <div
                    className="absolute right-6 top-6 flex h-[26px] w-[68px] items-center justify-center text-[14px] font-medium text-white"
                    style={{
                      padding: '4px 8px',
                      borderRadius: '12px 0px',
                      background: '#FA4D09',
                      boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)',
                    }}
                  >
                    {menu.badge}
                  </div>
                )}
                <h3 className="mt-[12px] text-[16px] font-medium leading-[130%] text-[#171719]">
                  {menu.name}
                </h3>
              </div>
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
