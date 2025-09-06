'use client';

import { updateRestaurantShareCount } from '@/app/actions/restaurant';
import { copyLinkToClipboard, shareViaKakao } from '@/utils/share/shareUtils';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: number;
  shareUrl: string;
  imageUrl: string;
};

export default function ShareModal({
  isOpen,
  onClose,
  restaurantId,
  shareUrl,
  imageUrl,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleCopyLink = async () => {
    await copyLinkToClipboard(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 400);

    try {
      await updateRestaurantShareCount(restaurantId);
    } catch (error) {
      console.error('공유 수 업데이트 실패:', error);
    }
  };

  const handleKakaoShare = async () => {
    await shareViaKakao({
      title: '로컬잇 맛집 공유',
      description: '이 식당 리뷰를 확인해보세요!',
      imageUrl,
      url: shareUrl,
    });

    try {
      await updateRestaurantShareCount(restaurantId);
    } catch (error) {
      console.error('공유 수 업데이트 실패:', error);
    }
  };

  const handleTwitterShare = async () => {
    const u = new URL('https://twitter.com/intent/tweet');
    u.searchParams.set('text', '로컬잇에서 발견한 맛집, 같이 보실래요?');
    u.searchParams.set('url', shareUrl);
    window.open(u.toString(), '_blank', 'noopener,noreferrer');

    try {
      await updateRestaurantShareCount(restaurantId);
    } catch (error) {
      console.error('공유 수 업데이트 실패:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="w-[400px] max-w-[90vw] rounded-[24px] bg-white p-8 shadow-2xl duration-200 animate-in fade-in-0 zoom-in-95"
      >
        {/* 헤더 */}
        <div className="mb-6 text-center">
          <h3 className="mb-2 text-[20px] font-bold text-gray-900">
            맛집 공유하기
          </h3>
          <p className="text-[14px] text-gray-500">
            친구들과 함께 맛집을 공유해보세요
          </p>
        </div>

        {/* 링크 복사 섹션 */}
        <div className="mb-6">
          <label className="mb-2 block text-[14px] font-medium text-gray-700">
            공유 링크
          </label>
          <div className="flex items-center gap-2 rounded-[12px] border border-gray-200 bg-gray-50 p-3">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 truncate bg-transparent text-[14px] text-gray-700 outline-none"
              aria-label="공유 링크"
            />
            <button
              onClick={handleCopyLink}
              className={`rounded-[8px] px-4 py-2 text-[13px] font-medium text-white transition-all duration-200 ${
                copied
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-[#FA4D09] hover:bg-[#E04408]'
              }`}
            >
              {copied ? '복사됨!' : '복사'}
            </button>
          </div>
        </div>

        {/* 소셜 공유 버튼들 */}
        <div className="mb-6">
          <label className="mb-3 block text-[14px] font-medium text-gray-700">
            소셜 미디어로 공유
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleKakaoShare}
              className="flex items-center justify-center gap-3 rounded-[12px] border border-gray-200 bg-white p-4 transition-all hover:border-yellow-300 hover:bg-yellow-50 hover:shadow-md"
            >
              <Image
                src="/assets/icons/share_button_Kakao.svg"
                alt="카카오톡"
                width={24}
                height={24}
              />
              <span className="text-[14px] font-medium text-gray-700">
                카카오톡
              </span>
            </button>

            <button
              onClick={handleTwitterShare}
              className="flex items-center justify-center gap-3 rounded-[12px] border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
            >
              <Image
                src="/assets/icons/share_button_X.svg"
                alt="X"
                width={24}
                height={24}
              />
              <span className="text-[14px] font-medium text-gray-700">
                X (트위터)
              </span>
            </button>
          </div>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="w-full rounded-[12px] bg-gray-100 py-3 text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
