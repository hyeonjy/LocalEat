'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
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

      alert('로그인 성공!');
      router.push('/');
    } catch (err) {
      console.error('로그인 요청 실패:', err);
      alert('서버 오류');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="이메일" {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" placeholder="비밀번호" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit">로그인</button>
    </form>
  );
};

export default Signin;
