'use client';

import {
  createStandardReview,
  getRestaurantInfoAndMenus,
} from '@/app/actions/restaurant';
import { Calendar } from '@/components/ui/calendar';
import { useAuthStore } from '@/store/authStore';
import { StandardReviewPayload } from '@/types/restaurant';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import KeywordSelection from '../_components/KeywordSelection';
import MultiPhotoUpload from '../_components/MultiPhotoUpload';
import RestaurantInfo from '../_components/RestaurantInfo';
import SinglePhotoUpload from '../_components/SinglePhotoUpload';
import TimeSelection from '../_components/TimeSelection';

const MAX_PHOTOS = 4;
const MAX_LENGTH = 400;

type StandardReviewPageProps = {
  params: {
    id: string;
  };
};

const StandardReviewForm = ({ params }: StandardReviewPageProps) => {
  const restaurantId = params.id;
  const [visitDate, setVisitDate] = useState<Date | undefined>(new Date());
  const [visitTime, setVisitTime] = useState<string>('');
  const [receiptImage, setReceiptImage] = useState<string | File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(0);
  const { user, clearUser } = useAuthStore();
  const router = useRouter();

  const { data, isPending, error } = useQuery({
    queryKey: ['restaurant-info', restaurantId],
    queryFn: () => getRestaurantInfoAndMenus(restaurantId),
  });

  if (isPending) return <div>로딩 중…</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if (receiptImage) {
      formData.append('photos', receiptImage);
      formData.append('photoTypes', 'receipt');
    }

    photos.forEach((photo) => {
      formData.append('photos', photo);
      formData.append('photoTypes', 'food');
    });

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();

    const review = {
      restaurantId,
      userId: user?.id,
      content,
      keywords,
      rating,
      visitedAt: visitDate?.toISOString(),
      visitedTimeSlot: visitTime,
      photos: result.uploadedPhotos,
    };

    try {
      const result = await createStandardReview(
        review as StandardReviewPayload,
      );

      if (!result.success) {
        if (result.reason === 'UNAUTHORIZED') {
          alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
          clearUser();
          router.push('/signin');
          return;
        }

        alert('리뷰 등록 실패');
        return;
      }

      alert('리뷰 등록 성공');
      router.push(`/restaurant/${restaurantId}`);
    } catch (error: any) {
      alert('리뷰 등록 실패');
    }
  };

  const handlePhotoDelete = (index: number) => {
    const updated = [...photos];
    updated.splice(index, 1);
    setPhotos(updated);
  };

  const handlePhotoAdd = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);

    const next = [...photos, ...newFiles].slice(0, MAX_PHOTOS);
    setPhotos(next);
  };

  const handleReceiptAdd = (file: File | string | null) => {
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setReceiptImage(dataUrl);
      };
      reader.readAsDataURL(file);
    } else {
      setReceiptImage(null);
    }
  };

  const handleKeywordToggle = (keyword: string) => {
    setKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword],
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-[64px] flex flex-col items-center"
    >
      <RestaurantInfo
        restaurant={data.restaurant}
        menus={data.menus}
        rating={rating}
        setRating={setRating}
      />

      <section className="mt-[32px] flex w-[791px] flex-col rounded-[50px] bg-[#FDF8F6] p-[40px]">
        <span className="mb-[20px] text-[20px] font-semibold leading-[140%]">
          언제 방문하셨나요?
        </span>
        <div className="flex gap-[40px]">
          <Calendar
            mode="single"
            defaultMonth={visitDate}
            selected={visitDate}
            onSelect={setVisitDate}
          />
          <TimeSelection value={visitTime} onChange={setVisitTime} />
          <input
            type="hidden"
            name="visitDate"
            value={visitDate?.toISOString()}
          />
          <input type="hidden" name="visitTime" value={visitTime} />
        </div>
      </section>

      <section className="mt-[32px] flex gap-[20px]">
        <SinglePhotoUpload image={receiptImage} onImageAdd={handleReceiptAdd} />
        <MultiPhotoUpload
          photos={photos}
          onPhotoAdd={handlePhotoAdd}
          onPhotoDelete={handlePhotoDelete}
        />
      </section>

      <KeywordSelection
        keywords={keywords}
        onKeywordToggle={handleKeywordToggle}
      />

      <section className="my-[32px] h-[213px] w-[791px] rounded-[50px] bg-[#FDF8F6] p-[40px]">
        <h2 className="mb-[10px] text-[20px] font-semibold leading-[130%] text-[#171719]">
          리뷰를 작성해주세요.
        </h2>

        <textarea
          name="content"
          className="h-[90px] w-full resize-none bg-transparent text-[14px] font-normal leading-[140%] text-[#2E2E32] placeholder:text-[#787882] focus:outline-none"
          placeholder={
            '리뷰 작성 시 유의사항 한 번 확인하기!\n욕설, 비방, 명예훼손성 표현은 누군가에게 상처가 될 수 있습니다.'
          }
          maxLength={MAX_LENGTH}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex justify-end text-[14px] font-medium leading-[130%] text-[#787882]">
          {content.length}/{MAX_LENGTH}
        </div>
      </section>

      <div className="flex w-[791px] justify-end">
        <button className="flex h-[50px] w-[100px] items-center justify-center rounded-[8px] bg-[#FA4D09] px-[20px] py-[16px] text-white">
          등록
        </button>
      </div>
    </form>
  );
};

export default StandardReviewForm;
