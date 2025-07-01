'use client';

import { useAuthStore } from '@/store/authStore';
import { KAKAO_AUTH_URL } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
});

type FormData = z.infer<typeof schema>;

const Signin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // 간편 로그인 , 로그인 네비게이션
  const [step, setStep] = useState<'select' | 'signin'>('select');

  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        alert(responseData.message || '로그인 실패');
        return;
      }

      // Zustand에 저장
      useAuthStore.getState().setUser(responseData.user);

      alert('로그인 성공!');
      router.push('/');
    } catch (err) {
      console.error('로그인 요청 실패:', err);
      alert('서버 오류');
    }
  };

  const handleLogout = async () => {
    console.log(1);
    await fetch('http://localhost:4000/auth/logout', {
      method: 'POST',
      credentials: 'include', // 쿠키를 함께 보내려면 꼭 필요함
    });
    router.push('/signin');
  };

  return (
    <>
      {step == 'select' && (
        <div className="mx-auto mt-[154px] w-[364px] text-center">
          <h2 className="w-full text-center text-[32px] font-bold leading-[130%] tracking-[-0.48px] text-[#171719]">
            쉽고 간편하게
            <br />
            로그인할 수 있어요.
          </h2>
          <p className="pt-[8px] text-[#787882]">
            숨은 로컬 식당의 발견, 로컬잇
          </p>
          <div className="mt-[70px] flex flex-col items-center gap-3">
            <a
              href={KAKAO_AUTH_URL}
              className="flex w-[324px] items-center justify-center gap-[10px] rounded-[10px] bg-[#FEE502] p-[14px_20px] text-[16px] font-semibold leading-[150%]"
            >
              카카오로 계속하기
            </a>
            <button className="flex w-[324px] items-center justify-center gap-[10px] rounded-[10px] bg-[#04C75B] p-[14px_20px] text-[16px] font-semibold leading-[150%] text-[#fff]">
              네이버로 계속하기
            </button>
            <button className="flex w-[324px] items-center justify-center gap-[10px] rounded-[10px] border border-[#E2E2E4] p-[14px_20px] text-[16px] font-semibold leading-[150%]">
              구글로 계속하기
            </button>
            <button
              onClick={() => setStep('signin')}
              className="flex w-[324px] items-center justify-center gap-[10px] rounded-[10px] border border-[#E2E2E4] p-[14px_20px] text-[16px] font-semibold leading-[150%]"
            >
              이메일로 계속하기
            </button>
          </div>
        </div>
      )}

      {step === 'signin' && (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md rounded-lg bg-white p-8 shadow-md"
          >
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
              로그인
            </h2>

            <input
              className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="이메일"
              {...register('email')}
            />
            {errors.email && (
              <p className="mb-4 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}

            <input
              className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              placeholder="비밀번호"
              {...register('password')}
            />
            {errors.password && (
              <p className="mb-4 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition duration-200 hover:bg-blue-700"
            >
              로그인
            </button>
          </form>
          <button onClick={handleLogout}>
            <p>로그아웃</p>
          </button>
        </div>
      )}
    </>
  );
};

export default Signin;
