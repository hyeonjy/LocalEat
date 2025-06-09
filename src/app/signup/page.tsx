'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
    console.log('data: ', data);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          nickname: data.nickname,
          region: ['서울'],
          profile_image: null,
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-md"
      >
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          회원가입
        </h2>

        <input
          className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="이메일"
          {...register('email')}
        />
        {errors.email && (
          <p className="mb-4 text-sm text-red-600">{errors.email.message}</p>
        )}

        <input
          className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="닉네임"
          {...register('nickname')}
        />
        {errors.nickname && (
          <p className="mb-4 text-sm text-red-600">{errors.nickname.message}</p>
        )}

        <input
          className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="비밀번호"
          {...register('password')}
        />
        {errors.password && (
          <p className="mb-4 text-sm text-red-600">{errors.password.message}</p>
        )}

        <input
          className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="비밀번호 확인"
          {...register('passwordConfirm')}
        />
        {errors.passwordConfirm && (
          <p className="mb-4 text-sm text-red-600">
            {errors.passwordConfirm.message}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition duration-200 hover:bg-blue-700"
        >
          가입하기
        </button>
      </form>
    </div>
  );
};

export default SignUp;
