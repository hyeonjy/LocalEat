'use client';

import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import ShareModal from './ShareModal';

type Props = { restaurantId: number; shareCount: number; imageUrl: string };

export default function RestaurantHeaderButton({
  restaurantId,
  shareCount,
  imageUrl,
}: Props) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const reviewRef = useRef<HTMLDivElement>(null);

  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const [shareUrl, setShareUrl] = useState('');
  useEffect(() => {
    setShareUrl(
      typeof window !== 'undefined'
        ? window.location.href
        : `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}${pathname}`,
    );
  }, [pathname]);

  // 바깥 클릭 닫기
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (
        reviewOpen &&
        reviewRef.current &&
        !reviewRef.current.contains(e.target as Node)
      )
        setReviewOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [reviewOpen]);

  const onWriteClick = () => {
    if (!user) return router.push('/signin');
    setReviewOpen(true);
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

        {/* 공유 아이콘 */}
        <button
          type="button"
          onClick={() => setShareOpen(true)}
          className="flex flex-col items-center gap-[2px] text-[#787882]"
          aria-label="공유하기"
        >
          <Image
            src="/assets/icons/share.svg"
            alt="공유 아이콘"
            width={24}
            height={24}
            className="h-[24px]"
          />
          <p>{shareCount}</p>
        </button>
      </div>

      <button
        onClick={onWriteClick}
        className="flex h-[50px] w-full items-center justify-center rounded-[10px] bg-[#FA4D09] px-[24px] py-[10px] text-[20px] font-semibold leading-[130%] text-white"
      >
        리뷰 작성하기
      </button>

      {/* 리뷰 타입 선택 모달 */}
      {reviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(52,52,52,0.8)]">
          <div ref={reviewRef} className="flex gap-[30px]">
            <Link
              href={`/restaurant/${restaurantId}/review/standard`}
              className="flex h-[470px] w-[350px] flex-col items-center justify-center rounded-[40px] bg-white shadow-inset-lg"
            >
              <Image
                src="/assets/icons/standard.svg"
                alt="일반 리뷰 작성 아이콘"
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
                src="/assets/icons/graphic.svg"
                alt="스토리카드 작성 아이콘"
                width={179}
                height={196}
                className="h-[196px] w-[179px]"
              />
              <h2 className="text-title-lb">스토리 리뷰 작성하기</h2>
            </Link>
          </div>
        </div>
      )}

      {/* 공유 모달 */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        restaurantId={restaurantId}
        shareUrl={shareUrl}
        imageUrl={imageUrl}
      />
    </div>
  );
}
