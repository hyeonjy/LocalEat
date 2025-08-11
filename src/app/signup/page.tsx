'use client';

import { SGG_BY_SIDO, SIDO_LIST } from '@/constants/regions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const profileImages = [
  '/assets/icons/profile1.svg',
  '/assets/icons/profile2.svg',
];

const schema = z
  .object({
    email: z.string().email('유효한 이메일을 입력해주세요'),
    nickname: z.string().min(1, '닉네임을 입력해 주세요'),
    password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
    passwordConfirm: z.string(),
    sido: z.string().min(1, '시/도를 선택해 주세요'),
    sgg: z.string().min(1, '시/군/구를 선택해 주세요'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.',
  });

type FormData = z.infer<typeof schema>;

type RegionSuggestion = { sido?: string; sgg?: string };

const SignUp = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: 'onChange' });

  const currentSido = watch('sido');
  const sggOptions = useMemo(
    () => (currentSido ? (SGG_BY_SIDO[currentSido] ?? []) : []),
    [currentSido],
  );

  const [suggestion, setSuggestion] = useState<RegionSuggestion>({});
  const [locError, setLocError] = useState<string | null>(null);

  useEffect(() => {
    handleSuggestRegion();
  }, []);

  // 현재 위치로 자동 제안
  const handleSuggestRegion = async () => {
    setLocError(null);
    try {
      await new Promise<void>((resolve, reject) => {
        if (!('geolocation' in navigator))
          return reject(
            new Error('이 브라우저는 위치 정보를 지원하지 않아요.'),
          );
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            const res = await fetch('/api/geo/reverse', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ lat: latitude, lng: longitude }),
            });
            if (!res.ok) {
              const errBody = await res.text();
              console.error('reverse error:', res.status, errBody);
              throw new Error('주소 찾기 실패');
            }
            const data = (await res.json()) as { sido?: string; sgg?: string };

            setSuggestion({ sido: data.sido, sgg: data.sgg });
            if (data.sido && SIDO_LIST.includes(data.sido as any)) {
              setValue('sido', data.sido, { shouldValidate: true });
              // 시/도 세팅 후 해당 시군구가 옵션에 있으면 기본값으로
              const sggs = SGG_BY_SIDO[data.sido] ?? [];
              if (data.sgg && sggs.includes(data.sgg))
                setValue('sgg', data.sgg, { shouldValidate: true });
            }
            resolve();
          },
          (err) => reject(err),
          { enableHighAccuracy: true, maximumAge: 10_000, timeout: 10_000 },
        );
      });
    } catch (e: any) {
      setLocError(e?.message ?? '현재 위치를 가져오지 못했어요.');
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const randomIndex = Math.floor(Math.random() * profileImages.length);
      const profileImage = profileImages[randomIndex];

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          nickname: data.nickname,
          region: [`${data.sido} ${data.sgg}`],
          profile_image: profileImage,
          provider: 'local',
          provider_id: data.email,
        }),
      });

      if (!res.ok) throw new Error('회원가입 실패');
      router.push('/signin');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto mt-[154px] w-[364px] text-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          회원가입
        </h2>

        {/* 이메일 */}
        <div className="flex flex-col items-start gap-2 pt-[70px]">
          <label
            htmlFor="email"
            className="font-pretendard text-[14px] font-semibold leading-[130%] text-[#5F5F68]"
          >
            이메일<span className="text-[#FF4242]">*</span>
          </label>
          <input
            className="w-full rounded-[10px] border border-[#E2E2E4] px-[16px] py-[14px]"
            placeholder="이메일을 입력해 주세요."
            {...register('email')}
          />
          {errors.email && (
            <p className="mb-4 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* 닉네임 */}
        <div className="flex flex-col items-start gap-2 pt-[24px]">
          <label
            htmlFor="nickname"
            className="font-pretendard text-[14px] font-semibold leading-[130%] text-[#5F5F68]"
          >
            닉네임<span className="text-[#FF4242]">*</span>
          </label>
          <input
            className="w-full rounded-[10px] border border-[#E2E2E4] px-[16px] py-[14px]"
            placeholder="사용할 닉네임을 입력해 주세요."
            {...register('nickname')}
          />
          {errors.nickname && (
            <p className="mb-4 text-sm text-red-600">
              {errors.nickname.message}
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col items-start gap-2 pt-[24px]">
          <label
            htmlFor="password"
            className="font-pretendard text-[14px] font-semibold leading-[130%] text-[#5F5F68]"
          >
            비밀번호<span className="text-[#FF4242]">*</span>
          </label>
          <input
            className="w-full rounded-[10px] border border-[#E2E2E4] px-[16px] py-[14px]"
            type="password"
            placeholder="비밀번호를 입력해 주세요."
            {...register('password')}
          />
          {errors.password && (
            <p className="mb-4 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className="flex flex-col items-start gap-2 pt-[24px]">
          <label
            htmlFor="passwordCheck"
            className="font-pretendard text-[14px] font-semibold leading-[130%] text-[#5F5F68]"
          >
            비밀번호 확인<span className="text-[#FF4242]">*</span>
          </label>
          <input
            className="w-full rounded-[10px] border border-[#E2E2E4] px-[16px] py-[14px]"
            type="password"
            placeholder="비밀번호를 한 번 더 입력해 주세요."
            {...register('passwordConfirm')}
          />
          {errors.passwordConfirm && (
            <p className="mb-4 text-sm text-red-600">
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>

        {/* 지역 선택 */}
        <div className="mt-8 text-left">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-pretendard text-sm font-semibold text-[#5F5F68]">
              내 동네 설정<span className="text-[#FF4242]">*</span>
            </span>
          </div>

          {locError && <p className="mb-2 text-xs text-red-500">{locError}</p>}
          {suggestion.sido && (
            <p className="mb-2 text-xs text-gray-500">
              제안된 지역: {suggestion.sido} {suggestion.sgg ?? ''}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-gray-500">시/도</label>
              <select
                className="w-full rounded-[10px] border border-[#E2E2E4] px-[12px] py-[12px]"
                {...register('sido')}
                onChange={(e) => {
                  setValue('sido', e.target.value, { shouldValidate: true });
                  setValue('sgg', '', { shouldValidate: true }); // 시군구 리셋
                }}
              >
                <option value="">시/도를 선택해 주세요</option>
                {SIDO_LIST.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.sido && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.sido.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-500">
                시/군/구
              </label>
              <select
                className="w-full rounded-[10px] border border-[#E2E2E4] px-[12px] py-[12px]"
                {...register('sgg')}
                disabled={!currentSido}
              >
                <option value="">
                  {currentSido
                    ? '시/군/구를 선택해 주세요'
                    : '시/도를 먼저 선택해 주세요'}
                </option>
                {sggOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {errors.sgg && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.sgg.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-[70px] w-full rounded-[10px] px-[20px] py-[14px] ${isValid ? 'bg-[#FA4D09] text-white' : 'bg-[#F4F4F5] text-[#ADADB3]'}`}
        >
          {isSubmitting ? '가입 중…' : '가입하기'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
