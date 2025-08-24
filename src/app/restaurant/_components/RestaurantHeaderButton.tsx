'use client';

import { LoginGuideModal } from '@/components/common/Modal';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const RestaurantHeaderButton = ({ restaurantId }: { restaurantId: number }) => {
  const [open, setOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const router = useRouter();

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
      setIsGuideOpen(true);
      return;
    }

    setOpen(true);
  };

  return (
    <div className="flex h-[50px] items-center justify-between gap-[24px]">
      <div className="flex gap-[8px]">
        <div className="flex flex-col items-center gap-[2px] text-[#787882]">
          <Image
            src="/assets/icons/bookmark.svg"
            alt="북마크 아이콘"
            width={24}
            height={24}
            className="h-[24px]"
          />
          <p>12</p>
        </div>
        <div className="flex flex-col items-center gap-[2px] text-[#787882]">
          <Image
            src="/assets/icons/share.svg"
            alt="공유 아이콘"
            width={24}
            height={24}
            className="h-[24px]"
          />
          <p>12</p>
        </div>
      </div>
      <button
        onClick={handleOpenClick}
        className="flex h-[50px] w-full items-center justify-center rounded-[10px] bg-[#FA4D09] px-[24px] py-[10px] text-[20px] font-semibold leading-[130%] text-white"
      >
        리뷰 작성하기
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
      <LoginGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onGoBack={() => setIsGuideOpen(false)}
        onGoToLogin={() => {
          setIsGuideOpen(false);
          router.push('/signin');
        }}
      />
    </div>
  );
};

export default RestaurantHeaderButton;
