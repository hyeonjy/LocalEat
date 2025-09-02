import { exchangeRequest } from '@/app/actions/exchangeRequest';
import { useAuthStore } from '@/store/authStore';
import { CouponItem } from '@/types/coupon';
import Image from 'next/image';
import { useState } from 'react';
import Modal from './Modal';

type PointUseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  coupon: CouponItem;
  userPoints: number;
};

const PointUseModal = ({
  isOpen,
  onClose,
  coupon,
  userPoints,
}: PointUseModalProps) => {
  const { user } = useAuthStore();
  const [email, setEmail] = useState(user?.email || '');

  const hasEnoughPoints = userPoints >= coupon.amount;
  const progressPercentage = Math.min((userPoints / coupon.amount) * 100, 100);

  const handleExchange = async () => {
    try {
      await exchangeRequest(user?.id, coupon.value, coupon.amount, email);
      onClose();
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex w-[300px] flex-col gap-[24px] rounded-[20px] bg-white p-[30px] lg:h-[486px] lg:w-[810px] lg:flex-row lg:p-[40px]">
        {/* 왼쪽 섹션 - 기프트카드 시각 */}
        <div className="flex h-[220px] w-full items-center justify-center rounded-[20px] border border-[#E2E2E4] shadow-[0px_5px_20px_0px_rgba(0,0,0,0.04)] lg:h-[406px] lg:w-[406px]">
          <Image
            src={coupon.image}
            alt={coupon.name}
            width={338}
            height={214}
            className="h-[110px] w-[180px] lg:h-[214px] lg:w-[338px]"
          />
        </div>

        {/* 오른쪽 섹션 - 정보 및 포인트 사용하기 버튼 */}
        <div className="flex flex-col lg:h-[406px]">
          {/* 제목 */}
          <h2 className="mb-[12px] mt-[21px] text-[20px] font-semibold leading-[130%] text-[#171719]">
            {coupon.name}
          </h2>

          {/* 설명 */}
          <p className="mb-[16px] hidden h-[30px] w-full text-[12px] font-normal leading-[130%] text-[#787882] lg:block lg:w-[273px]">
            {coupon.content}
          </p>

          {/* 주문 발송자 */}
          <div className="mb-[20px] lg:mb-[131px]">
            <label className="mb-1 block text-[12px] font-normal leading-[130%] text-[#787882]">
              주문 발송자
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[5.18px] border border-[#ADADB3] p-3 text-[14px] focus:border-[#FA4D09] focus:outline-none"
              placeholder="이메일을 입력하세요"
            />
          </div>

          {/* 포인트 정보 */}
          <div className="mb-[16px]">
            <span className="mb-1 text-[12px] font-normal leading-[130%] text-[#787882]">
              내 보유 포인트 {userPoints}P
            </span>

            {/* 진행률 바 */}
            <div className="flex w-full items-center justify-between lg:w-[300px]">
              <div className="h-[14px] w-[180px] rounded-[7px] bg-[#E2E2E4] lg:w-[228px]">
                <div
                  className="h-full rounded-[7px] bg-[#3CDD4C]"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>
              <p className="text-[16px] font-bold leading-[130%] text-[#171719]">
                {coupon.amount}P
              </p>
            </div>
          </div>

          <button
            onClick={handleExchange}
            disabled={!hasEnoughPoints}
            className={`w-full rounded-[8px] px-[20px] py-[8px] text-[16px] font-medium ${
              hasEnoughPoints
                ? 'bg-[#FA4D09] text-white hover:bg-[#E04508]'
                : 'cursor-not-allowed border border-[#E2E2E4] text-[#E2E2E4]'
            }`}
          >
            포인트 사용하기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PointUseModal;
