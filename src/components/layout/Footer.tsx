import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center gap-[32px] self-stretch px-[20px] pb-[24px] pt-[40px]">
      <div className="mx-auto w-[1200px] px-[20px]">
        <div className="flex h-[47px] w-full items-center justify-between">
          <Link href="/">
            <Image
              src="/assets/logo.svg"
              alt="LocalEat 로고"
              width={109}
              height={47}
            />
          </Link>
          <ul className="font-pretendard flex gap-[32px] text-[16px] font-medium leading-[130%] tracking-[0.16px] text-[#171719]">
            <li>기업소개</li>
            <li>고객센터</li>
            <li>이용약관</li>
            <li>블로그</li>
            <li>개인정보 처리방침</li>
          </ul>
        </div>
        <div className="flex flex-col gap-[8px] py-[32px] text-[13px] font-medium leading-[130%] text-[rgba(55,56,60,0.61)]">
          <p>
            (주)로컬잇<span className="mx-3 text-[#D9D9D9]">|</span>대표이사
            김잇터
          </p>
          <p>서울특별시 송파구 올림픽로 300, 롯데월드타워 35층</p>
          <p>
            사업자등록번호: 542-86-00021
            <span className="mx-3 text-[#D9D9D9]">|</span>TEl: 02-542-0103
            <span className="mx-3 text-[#D9D9D9]">|</span>Email:
            localeat@gmail.com
          </p>
        </div>
        <ul className="font-pretendard flex gap-[24px] text-[13px] font-semibold leading-[130%] text-[#171719]">
          <li>로컬잇 서비스 소개</li>
          <li>로컬잇 문의</li>
          <li>가게등록 문의</li>
          <li>FAQ</li>
          <li>광고 및 제휴</li>
        </ul>
        <p className="border-t border-t-[rgba(112,115,124,0.08)] pt-[20px] text-[13px] font-medium leading-[130%] text-[rgba(55,56,60,0.61)]">
          © 2025 LocalEat Lab, Inc.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
