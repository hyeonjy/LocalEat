'use client';

import { LoginFailedModal, LoginSuccessModal } from '@/components/common/Modal';
import { useAuthStore } from '@/store/authStore';
import { KAKAO_AUTH_URL } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
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
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  // 간편 로그인 , 로그인 네비게이션
  const [step, setStep] = useState<'select' | 'signin'>('select');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

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
        setIsModalOpen(true);
        setModalType('error');
        return;
      }

      // Zustand에 저장
      useAuthStore.getState().setUser(responseData.user);

      // setModalType('success');
      // setIsModalOpen(true);
      router.push('/');
    } catch (err) {
      console.error('로그인 요청 실패:', err);
      setModalType('error');
      setIsModalOpen(true);
    }
  };
  console.log();

  return (
    <div className="mx-auto mt-[64px] w-[364px] py-[100px] text-center">
      {step == 'select' && (
        <div className="mx-auto w-[364px] text-center">
          <h2 className="w-full text-center text-[32px] font-bold leading-[130%] tracking-[-0.48px] text-[#171719]">
            쉽고 간편하게
            <br />
            로그인할 수 있어요.
          </h2>
          <p className="pt-[8px] text-[16px] font-normal leading-[130%] text-[#787882]">
            숨은 로컬 식당의 발견, 로컬잇
          </p>
          <div className="mt-[70px] flex flex-col items-center gap-3">
            <a
              href={KAKAO_AUTH_URL}
              className="flex w-[324px] items-center justify-center gap-[10px] rounded-[10px] bg-[#FEE502] p-[14px_20px] text-[16px] font-semibold leading-[150%] text-[#171719]"
            >
              <Image
                src="/assets/icons/kakao.svg"
                alt="kakao"
                width={14}
                height={14}
              />
              <p>카카오로 계속하기</p>
            </a>
            <button className="flex w-[324px] items-center justify-center gap-[10px] rounded-[10px] bg-[#04C75B] p-[14px_20px] text-[16px] font-semibold leading-[150%] text-[#fff]">
              <Image
                src="/assets/icons/naver.svg"
                alt="naver"
                width={14}
                height={14}
              />
              <p>네이버로 계속하기</p>
            </button>
            <button className="flex w-[324px] items-center justify-center gap-[10px] rounded-[10px] border border-[#E2E2E4] p-[14px_20px] text-[16px] font-semibold leading-[150%] text-[#171719]">
              <Image
                src="/assets/icons/google.svg"
                alt="google"
                width={14}
                height={14}
              />
              <p>구글로 계속하기</p>
            </button>
            <button
              onClick={() => setStep('signin')}
              className="flex w-[324px] items-center justify-center gap-[10px] rounded-[10px] border border-[#E2E2E4] p-[14px_20px] text-[16px] font-semibold leading-[150%] text-[#171719]"
            >
              이메일로 계속하기
            </button>
          </div>
        </div>
      )}

      {step === 'signin' && (
        <div className="flex items-center justify-center bg-gray-50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md rounded-lg bg-white"
          >
            <h2 className="font-pretendard text-center text-[32px] font-bold leading-[130%] tracking-[-0.48px] text-[#171719]">
              이메일로 로그인
            </h2>
            <div className="flex flex-col items-start gap-2 pt-[70px]">
              <label
                htmlFor="email"
                className="font-pretendard text-[14px] font-semibold leading-[130%] text-[#5F5F68]"
              >
                이메일
              </label>
              <input
                id="email"
                className="flex items-start justify-between self-stretch rounded-[10px] border border-[#E2E2E4] px-4 py-[14px]"
                placeholder="이메일"
                {...register('email')}
              />
              {errors.email && (
                <p className="mb-4 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="flex flex-col items-start gap-2 py-[24px]">
              <label
                htmlFor="password"
                className="font-pretendard text-[14px] font-semibold leading-[130%] text-[#5F5F68]"
              >
                비밀번호
              </label>
              <input
                id="password"
                className="flex items-start justify-between self-stretch rounded-[10px] border border-[#E2E2E4] px-4 py-[14px]"
                type="password"
                placeholder="비밀번호"
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className="mb-4 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-[10px] px-[20px] py-[14px] ${isValid ? 'bg-[#FA4D09] text-white' : 'bg-[#F4F4F5] text-[#ADADB3]'}`}
            >
              로그인
            </button>
            <Link
              href="signup"
              className="mt-[12px] block w-full rounded-[10px] border border-[#C7C7CC] px-[20px] py-[14px] text-[#171719]"
            >
              회원가입
            </Link>
            {/* 로그아웃 로직 다른곳으로 이전 예정 */}
            {/* <button type="button" onClick={handleLogout}>
              <p>로그아웃</p>
            </button> */}
          </form>
        </div>
      )}

      <LoginSuccessModal
        isOpen={isModalOpen && modalType === 'success'}
        onClose={() => setIsModalOpen(false)}
        onGoHome={() => router.push('/')}
        onWriteReview={() => router.push('/localeat')}
      />

      <LoginFailedModal
        isOpen={isModalOpen && modalType === 'error'}
        onClose={() => setIsModalOpen(false)}
        onGoBack={() => router.push('/signin')}
        onRetryLogin={() => router.push('/signin')}
      />
    </div>
  );
};

export default Signin;
