'use client';

import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const ReviewWriteButton = ({ restaurantId }: { restaurantId: number }) => {
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleOpenClick = () => {
    if (!user) {
      alert('로그인 후 리뷰를 작성할 수 있어요!');
      return;
    }

    setOpen(true);
  };

  return (
    <>
      <button
        onClick={handleOpenClick}
        className="flex w-full items-center justify-center rounded-[9px] border border-[#9E9D9D] px-[16px] py-[12px] text-label-lmb"
      >
        <span className="mr-[7px]">리뷰 작성하기</span>
        <Image
          src="/assets/icons/arrow_back_ios_new.svg"
          alt="오른쪽 화살표 아이콘"
          width={20}
          height={20}
        />
      </button>

      {/* 모달 컴포넌트 */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(52,52,52,0.8)]">
          <div ref={modalRef} className="flex gap-[30px]">
            <Link
              href={`/restaurant/${restaurantId}/review/standard`}
              className="flex h-[470px] w-[350px] flex-col items-center justify-center rounded-[40px] bg-white shadow-inset-lg"
            >
              <Image
                src={'/assets/icons/standard.svg'}
                alt={'일반 리뷰 작성 아이콘'}
                width={213}
                height={196}
                className="h-[196px] w-[213px]"
              />
              <h2 className="text-title-lb">일반 리뷰 작성하기</h2>
            </Link>
            <Link
              href={`/restaurant/${restaurantId}/review/graphic`}
              className="flex h-[470px] w-[350px] flex-col items-center justify-center rounded-[40px] bg-white shadow-inset-lg"
            >
              <Image
                src={'/assets/icons/graphic.svg'}
                alt={'스토리카드 작성 아이콘'}
                width={179}
                height={196}
                className="h-[196px] w-[179px]"
              />
              <h2 className="text-title-lb">스토리 리뷰 작성하기</h2>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewWriteButton;
