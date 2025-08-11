'use client';

import Image from 'next/image';
import React from 'react';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
};

export type ModalButton = {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
};

export interface ModalWithButtonsProps extends ModalProps {
  buttons: ModalButton[];
  showHeader?: boolean;
  subtitle?: string; // 작은 오렌지 텍스트용
  subtitleType?: 'orange' | 'green';
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  className = '',
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative h-[205px] w-[436px] rounded-[12px] bg-white pb-[34px] pl-[40px] pr-[24px] pt-[24px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)] ${className}`}
      >
        {/* Header - 닫기 버튼만 */}
        {showCloseButton && (
          <div className="flex items-center justify-end">
            <Image
              src="/assets/icons/exit.svg"
              onClick={onClose}
              alt="exit"
              width={24}
              height={24}
              className="h-[24px] w-[24px] cursor-pointer"
            />
          </div>
        )}

        {/* Content */}
        <div className="px-5 pb-5">
          {/* 제목이 있다면 여기에 표시 */}
          {title && (
            <div className="mb-6 text-center">
              <div className="text-xl font-bold text-gray-900">{title}</div>
            </div>
          )}

          <div className="text-center">{children}</div>
        </div>
      </div>
    </div>
  );
};

// 범용 모달 (버튼 포함)
export const ModalWithButtons = ({
  isOpen,
  onClose,
  title,
  children,
  buttons,
  showHeader = true,
  showCloseButton = true,
  subtitle,
  className = '',
  subtitleType = 'orange',
}: ModalWithButtonsProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative h-[263px] w-[500px] rounded-[12px] bg-white pb-[34px] pl-[40px] pr-[24px] pt-[24px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)] ${className}`}
      >
        {/* Header - 닫기 버튼만 */}
        {showHeader && showCloseButton && (
          <div className="flex items-center justify-end">
            <Image
              src="/assets/icons/exit.svg"
              onClick={onClose}
              alt="exit"
              width={24}
              height={24}
              className="h-[24px] w-[24px] cursor-pointer"
            />
          </div>
        )}

        {/* Content - 제목과 내용 포함 */}
        <div className="mt-[8px] text-start">
          {/* 제목 영역 */}
          {(subtitle || title) && (
            <div className="mb-5">
              {subtitle && (
                <div
                  className={`mb-[10px] text-[12px] font-bold ${
                    subtitleType === 'orange'
                      ? 'text-[#FA4D09]'
                      : 'text-[#004332]'
                  }`}
                >
                  {subtitle}
                </div>
              )}
              {title && (
                <div className="text-[20px] font-semibold text-[#171719]">
                  {title}
                </div>
              )}
            </div>
          )}

          {/* 내용 */}
          <div className="flex justify-start text-[14px] font-normal text-[#47474D]">
            {children}
          </div>
        </div>

        {/* Buttons */}
        {buttons.length > 0 && (
          <div className="mt-[50px] flex w-full justify-end gap-4 px-4">
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={() => {
                  button.onClick();
                  onClose();
                }}
                className={`flex rounded-[8px] px-5 py-2 font-medium transition-all duration-200 ${
                  button.variant === 'primary'
                    ? subtitleType === 'orange'
                      ? 'bg-[#FA4D09] text-white hover:bg-orange-600'
                      : 'bg-[#007558] text-white hover:bg-green-600'
                    : 'border border-[#C7C7CC] bg-white text-[#47474D] hover:bg-gray-50'
                } ${button.className || ''}`}
              >
                {button.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 특정 모달 타입들을 위한 편의 컴포넌트들
export const LoginGuideModal = ({
  isOpen,
  onClose,
  onGoBack,
  onGoToLogin,
}: {
  isOpen: boolean;
  onClose: () => void;
  onGoBack: () => void;
  onGoToLogin: () => void;
}) => (
  <ModalWithButtons
    isOpen={isOpen}
    onClose={onClose}
    title="로그인/회원가입을 하면 리뷰를 쓸 수 있어요"
    subtitle="로그인 안내"
    subtitleType="orange"
    buttons={[
      {
        text: '돌아가기',
        onClick: onGoBack,
        variant: 'secondary',
      },
      {
        text: '로그인하러 가기',
        onClick: onGoToLogin,
        variant: 'primary',
      },
    ]}
  >
    <div className="space-y-3">
      <p>로그인을 원하지 않는 경우 '돌아가기' 버튼을 눌러주세요.</p>
    </div>
  </ModalWithButtons>
);

export const ReviewSuccessModal = ({
  isOpen,
  onClose,
  onGoHome,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onGoHome: () => void;
  onConfirm: () => void;
}) => (
  <ModalWithButtons
    isOpen={isOpen}
    onClose={onClose}
    showHeader={false}
    title="리뷰 등록 완료"
    subtitleType="green"
    buttons={[
      {
        text: '홈으로',
        onClick: onGoHome,
        variant: 'secondary',
      },
      {
        text: '확인',
        onClick: onConfirm,
        variant: 'primary',
        className: 'bg-green-600 hover:bg-green-700',
      },
    ]}
  >
    <div className="space-y-3 text-center">
      <p className="text-lg font-medium text-gray-700">리뷰 등록 완료 :D</p>
      <p className="leading-relaxed text-gray-700">
        맛있는 경험을 나눠주셔서 감사해요!
      </p>
    </div>
  </ModalWithButtons>
);

export const ReviewFailedModal = ({
  isOpen,
  onClose,
  onGoHome,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onGoHome: () => void;
  onConfirm: () => void;
}) => (
  <ModalWithButtons
    isOpen={isOpen}
    onClose={onClose}
    showHeader={false}
    title="리뷰 등록 실패"
    subtitleType="orange"
    buttons={[
      {
        text: '홈으로',
        onClick: onGoHome,
        variant: 'secondary',
      },
      {
        text: '돌아가기',
        onClick: onConfirm,
        variant: 'primary',
        className: 'bg-green-600 hover:bg-green-700',
      },
    ]}
  >
    <div className="space-y-3">
      <p>리뷰 등록에 실패했어요. 다시 시도해주세요.</p>
    </div>
  </ModalWithButtons>
);

export const LoginSuccessModal = ({
  isOpen,
  onClose,
  onGoHome,
  onWriteReview,
}: {
  isOpen: boolean;
  onClose: () => void;
  onGoHome: () => void;
  onWriteReview: () => void;
}) => (
  <ModalWithButtons
    isOpen={isOpen}
    onClose={onClose}
    title="로그인 성공"
    subtitle="로그인 성공"
    buttons={[
      {
        text: '홈으로',
        onClick: onGoHome,
        variant: 'secondary',
      },
      {
        text: '리뷰 작성하기',
        onClick: onWriteReview,
        variant: 'primary',
        className: 'bg-green-600 hover:bg-green-700',
      },
    ]}
    subtitleType="green"
  >
    <div className="space-y-3">
      <p>이제 마음껏 리뷰도 남기고 서비스를 이용해보세요.</p>
    </div>
  </ModalWithButtons>
);

export const LoginFailedModal = ({
  isOpen,
  onClose,
  onGoBack,
  onRetryLogin,
}: {
  isOpen: boolean;
  onClose: () => void;
  onGoBack: () => void;
  onRetryLogin: () => void;
}) => (
  <ModalWithButtons
    isOpen={isOpen}
    onClose={onClose}
    title="로그인 실패..!"
    subtitle="로그인 실패"
    buttons={[
      {
        text: '돌아가기',
        onClick: onGoBack,
        variant: 'secondary',
      },
      {
        text: '다시 로그인하기',
        onClick: onRetryLogin,
        variant: 'primary',
      },
    ]}
    subtitleType="orange"
  >
    <div className="space-y-3">
      <p>입력하신 정보를 다시 확인하고, 다시 시도해주세요.</p>
    </div>
  </ModalWithButtons>
);

export default Modal;
