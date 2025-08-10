export type UserType = {
  id: number;
  email: string;
  nickname: string;
  profileImage: string | null;
  region: string;
};

export type UserSocialType = {
  id: number;
  nickname: string;
  email: string | null;
  profileImage: string | null;
  region: string[];
};

// 카카오 API_KEY , REDIRECT_URI

const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

export const KAKAO_AUTH_URL : string = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`
