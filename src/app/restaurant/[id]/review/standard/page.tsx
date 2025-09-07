'use client';

import {
  createStandardReview,
  getRestaurantInfoAndMenus,
  getStandardReviewById,
  updateStandardReview,
} from '@/app/actions/restaurant';
import { Calendar } from '@/components/ui/calendar';
import { useAuthStore } from '@/store/authStore';
import { StandardReviewPayload } from '@/types/restaurant';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  const searchParams = useSearchParams();
  const editReviewId = searchParams.get('edit');
  const isEditMode = !!editReviewId;

  const [visitDate, setVisitDate] = useState<Date | undefined>(new Date());
  const [visitTime, setVisitTime] = useState<string>('');
  const [receiptImage, setReceiptImage] = useState<string | File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(0);
  const { user, clearUser } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isPending, error } = useQuery({
    queryKey: ['restaurant-info', restaurantId],
    queryFn: () => getRestaurantInfoAndMenus(restaurantId),
  });

  // 편집 모드일 때 기존 리뷰 데이터 불러오기
  const { data: existingReviewData, isPending: isReviewLoading } = useQuery({
    queryKey: ['review', editReviewId],
    queryFn: () => getStandardReviewById(Number(editReviewId)),
    enabled: isEditMode && !!editReviewId,
  });

  // 기존 리뷰 데이터를 폼에 채워넣기
  useEffect(() => {
    if (existingReviewData?.data?.review) {
      const review = existingReviewData.data.review;
      const photos = existingReviewData.data.photos || [];
      const receiptVerifications =
        existingReviewData.data.receipt_verifications || [];

      setContent(review.content || '');
      setRating(review.rating || 0);
      setKeywords(review.keywords || []);
      setVisitTime(review.visited_time_slot || '');

      // 방문 날짜 설정
      if (review.visited_date) {
        setVisitDate(new Date(review.visited_date));
      }

      // 기존 사진들을 File 객체로 변환하여 photos에 저장
      const convertPhotosToFiles = async () => {
        const photoFiles = await Promise.all(
          photos.map(async (photo: any) => {
            const response = await fetch(photo.image_url);
            const blob = await response.blob();
            const file = new File([blob], `existing_${photo.id}.jpg`, {
              type: blob.type,
            });
            // 기존 사진 ID를 파일 객체에 저장
            (file as any).existingId = photo.id;
            return file;
          }),
        );
        setPhotos(photoFiles);
      };

      convertPhotosToFiles();

      // 영수증 사진 설정 (receipt_verifications 배열에서)
      if (receiptVerifications.length > 0) {
        const receiptPhoto = receiptVerifications[0];
        setReceiptImage(receiptPhoto.image_url);
      } else {
        setReceiptImage(null);
      }
    }
  }, [existingReviewData]);

  const { mutateAsync: submitReview, isPending: isSubmitting } = useMutation({
    mutationFn: (payload: StandardReviewPayload) =>
      isEditMode
        ? updateStandardReview(payload, Number(editReviewId))
        : createStandardReview(payload),
    onSuccess: async (result, variables) => {
      if (!result.success) {
        if (result.reason === 'UNAUTHORIZED') {
          alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
          clearUser();
          router.push('/signin');
          return;
        }
        // alert(isEditMode ? '리뷰 수정 실패' : '리뷰 등록 실패');
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['restaurant-info', restaurantId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['restaurant', restaurantId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['reviews'],
        }),
      ]);

      // alert(isEditMode ? '리뷰 수정 성공' : '리뷰 등록 성공');
      router.push(`/restaurant/${restaurantId}`);
    },
    onError: () => {
      // alert(isEditMode ? '리뷰 수정 실패' : '리뷰 등록 실패');
    },
  });

  if (isPending || (isEditMode && isReviewLoading)) return <div>로딩 중…</div>;
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
      visitedAt: visitDate?.toLocaleDateString('sv-SE', {
        timeZone: 'Asia/Seoul',
      }),
      visitedTimeSlot: visitTime,
      photos: result.uploadedPhotos,
    };

    await submitReview(review as StandardReviewPayload);
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

      <section className="mx-auto mt-[32px] flex w-[calc(100%-32px)] flex-col rounded-[28px] bg-[#FDF8F6] px-[16px] py-[20px] md:mx-0 md:w-[692px] md:rounded-[50px] md:p-[40px] lg:w-[772px]">
        <span className="mb-[20px] text-[20px] font-semibold leading-[140%]">
          언제 방문하셨나요?
        </span>
        <div className="flex flex-col gap-[20px] md:flex-row">
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

      <section className="mx-auto mt-[32px] flex w-[calc(100%-32px)] flex-col gap-[16px] md:mx-0 md:w-[692px] md:flex-row lg:w-[772px] lg:gap-[20px]">
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

      <section className="mx-auto my-[32px] h-[213px] w-[calc(100%-32px)] rounded-[28px] bg-[#FDF8F6] p-[40px] md:mx-0 md:w-[692px] md:rounded-[50px] lg:w-[772px]">
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

      <div className="mx-auto flex w-[calc(100%-32px)] justify-end md:mx-0 md:w-[692px] lg:w-[772px]">
        <button
          disabled={isSubmitting}
          className="flex h-[37px] w-[68px] items-center justify-center rounded-[8px] bg-[#FA4D09] px-[20px] py-[8px] text-[16px] font-medium leading-[130%] text-white disabled:opacity-60"
        >
          {isEditMode ? '수정' : '등록'}
        </button>
      </div>
    </form>
  );
};

export default StandardReviewForm;
