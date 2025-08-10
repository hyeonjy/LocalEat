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
      alert('포인트 교환이 완료되었습니다.');
      onClose();
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex h-[486px] w-[810px] gap-[24px] rounded-[20px] bg-white p-[40px]">
        {/* 왼쪽 섹션 - 기프트카드 시각 */}
        <div className="flex h-[406px] w-[406px] items-center justify-center rounded-[20px] border border-[#E2E2E4] shadow-[0px_5px_20px_0px_rgba(0,0,0,0.04)]">
          <Image
            src={coupon.image}
            alt={coupon.name}
            width={338}
            height={214}
          />
        </div>

        {/* 오른쪽 섹션 - 정보 및 포인트 사용하기 버튼 */}
        <div className="flex h-[406px] flex-col">
          {/* 제목 */}
          <h2 className="mb-[12px] mt-[21px] text-[20px] font-semibold leading-[130%] text-[#171719]">
            {coupon.name}
          </h2>

          {/* 설명 */}
          <p className="mb-[16px] h-[30px] w-[273px] text-[12px] font-normal leading-[130%] text-[#787882]">
            {coupon.content}
          </p>

          {/* 주문 발송자 */}
          <div className="mb-[131px]">
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
            <div className="flex w-[300px] items-center justify-between">
              <div className="h-[14px] w-[228px] rounded-[7px] bg-[#E2E2E4]">
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
            className={`h-[107px] w-full rounded-[8px] px-[20px] py-[8px] text-[16px] font-medium ${
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
