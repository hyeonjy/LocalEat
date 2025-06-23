import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const ReceiptUpload = ({
  receiptImage,
  onReceiptAdd,
}: {
  receiptImage: string | File | null;
  onReceiptAdd: (file: File | null) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [receiptUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (receiptImage instanceof File) {
      const url = URL.createObjectURL(receiptImage);
      setPhotoUrl(url);
    }

    // 컴포넌트 언마운트 시 또는 receiptImage 변경 시 이전 URL 정리
    return () => {
      if (receiptImage instanceof File) {
        URL.revokeObjectURL(receiptUrl as string);
      }
    };
  }, [receiptImage]);

  const handleReceiptDelete = () => {
    onReceiptAdd(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-[330px] rounded-[30px] bg-[#FDF8F6] px-[30px] pb-[49px] pt-[40px]">
      <p className="text-[20px] font-semibold leading-[130%] text-[#171719]">
        영수증 인증 [필수]
      </p>
      <p className="mb-[24px] mt-[6px] text-[16px] font-normal leading-[130%] text-[#787882]">
        인증 시 <span className="text-[#0826E9]">500P</span> 즉시 지급!
      </p>

      <div className="flex items-center gap-[12px]">
        <label className="flex h-[220px] w-[140px] cursor-pointer flex-col items-center justify-center rounded-[20px] border border-[#C7C7CC] bg-[#E2E2E4] text-[14px] font-semibold leading-[140%] text-[#787882]">
          <Image
            src="/assets/icons/photo.svg"
            alt="사진 추가"
            width={24}
            height={24}
          />
          <span>사진 추가</span>
          <input
            ref={inputRef}
            name="receipt"
            type="file"
            accept="image/*"
            onChange={(e) => {
              console.log('>>>>>> ', e.target.files?.[0]);
              onReceiptAdd(e.target.files?.[0] || null);
            }}
            className="hidden"
          />
        </label>

        <div className="relative h-[178px] w-[120px] overflow-hidden rounded-[20px] border">
          <div
            className={cn(
              'absolute inset-0 bg-cover bg-center bg-no-repeat',
              receiptImage ? '' : 'bg-gray-200',
            )}
            style={{
              backgroundImage: receiptImage
                ? `linear-gradient(0deg, rgba(56, 56, 56, 0.5), rgba(56, 56, 56, 0.5)), url(${receiptUrl})`
                : undefined,
            }}
          />
          <span className="absolute inset-0 z-10 flex items-center justify-center text-[14px] font-semibold leading-[100%] text-white">
            예시 확인하기
          </span>
          {receiptImage && (
            <button
              type="button"
              onClick={handleReceiptDelete}
              className="absolute right-2 top-2 z-20 cursor-pointer rounded bg-black/50 px-2 py-0.5 text-xs text-white"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptUpload;
