'use client';

import { getRestaurantInfoAndMenus } from '@/app/actions/restaurant';
import { Calendar } from '@/components/ui/calendar';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import KeywordSelection from '../_components/KeywordSelection';
import PhotoUpload from '../_components/PhotoUpload';
import ReceiptUpload from '../_components/ReceiptUpload';
import RestaurantInfo from '../_components/RestaurantInfo';
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
  const { user } = useAuthStore();

  const { data, isPending, error } = useQuery({
    queryKey: ['restaurant-info', restaurantId],
    queryFn: () => getRestaurantInfoAndMenus(restaurantId),
  });

  if (isPending) return <div>로딩 중…</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    photos.forEach((photo) => {
      formData.append('photos', photo);
    });

    console.log(Object.fromEntries(formData.entries()));

    // 영수증과 사진을 각각 다른 타입으로 구분
    const reviewImages = [];

    // 영수증 추가 (type: 'receipt')
    if (receiptImage instanceof File) {
      reviewImages.push({
        type: 'receipt',
        imageUrl: receiptImage,
      });
    }

    // 사진들 추가 (type: 'food')
    photos.forEach((photo) => {
      reviewImages.push({
        type: 'food',
        imageUrl: photo,
      });
    });

    const review = {
      restaurantId,
      userId: user?.id,
      content,
      keywords,
      rating,
      visitedAt: visitDate?.toISOString(),
      visitedTimeSlot: visitTime,
      photos: reviewImages,
    };
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

  const handleReceiptAdd = (file: File | null) => {
    setReceiptImage(file);
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
        <ReceiptUpload
          receiptImage={receiptImage}
          onReceiptAdd={handleReceiptAdd}
        />
        <PhotoUpload
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
