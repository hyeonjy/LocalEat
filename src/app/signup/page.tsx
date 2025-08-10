'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const profileImages = [
  '/assets/icons/profile1.svg',
  '/assets/icons/profile2.svg',
];

const schema = z
  .object({
    email: z.string().email('유효한 이메일을 입력해주세요'),
    nickname: z.string(),
    password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.',
  });

type FormData = z.infer<typeof schema>;

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

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
          region: ['서울'],
          profile_image: profileImage,
          provider: 'local',
          provider_id: data.email,
        }),
      });

      if (!res.ok) throw new Error('회원가입 실패');
      alert('회원가입 성공');

      router.push('/signin');
    } catch (err) {
      console.error(err);
      alert('회원가입 실패');
    }
  };

  return (
    <div className="mx-auto mt-[154px] w-[364px] text-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          회원가입
        </h2>
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
        <div className="flex flex-col items-start gap-2 pt-[24px]">
          <label
            htmlFor="passwordCheck"
            className="font-pretendard text-[14px] font-semibold leading-[130%] text-[#5F5F68]"
          >
            비밀번호<span className="text-[#FF4242]">*</span>
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
        <button
          type="submit"
          className="mt-[70px] w-full rounded-[10px] bg-[#F4F4F5] px-[20px] py-[14px] text-[#ADADB3]"
        >
          가입하기
        </button>
      </form>
    </div>
  );
};

export default SignUp;
