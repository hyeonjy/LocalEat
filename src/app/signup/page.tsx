'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const schema = z
  .object({
    email: z.string().email(),
    nickname: z.string(),
    password: z.string().min(6),
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
    } catch (err) {
      console.error(err);
      alert('회원가입 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="이메일" {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}

      <input placeholder="닉네임" {...register('nickname')} />
      {errors.nickname && <p>{errors.nickname.message}</p>}

      <input type="password" placeholder="비밀번호" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}

      <input
        type="password"
        placeholder="비밀번호 확인"
        {...register('passwordConfirm')}
      />
      {errors.passwordConfirm && <p>{errors.passwordConfirm.message}</p>}

      <button type="submit">가입하기</button>
    </form>
  );
};

export default SignUp;
