'use client';

import {
  getAllVerifications,
  updateVerificationStatus,
} from '@/app/actions/receiptVerification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';

const AdminPage = () => {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState('전체');
  const [selectedPeriod, setSelectedPeriod] = useState('전체');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

  // 모든 영수증 조회 (필터링)
  const { data: allVerificationsData, isLoading: allLoading } = useQuery({
    queryKey: ['allVerifications', selectedStatus, selectedPeriod],
    queryFn: () =>
      getAllVerifications({
        status: selectedStatus,
        page: 1,
        limit: 10,
        period: selectedPeriod,
      }),
  });

  console.log('allVerificationsData:', allVerificationsData);

  // 상태 업데이트 뮤테이션
  const updateStatusMutation = useMutation({
    mutationFn: ({
      verificationId,
      status,
      adminComment,
    }: {
      verificationId: string;
      status: '승인완료' | '승인거절';
      adminComment: string;
    }) => updateVerificationStatus({ verificationId, status, adminComment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allVerifications'] });
      setRejectModalOpen(false);
      setRejectReason('');
      setSelectedVerification(null);
    },
  });

  const handleStatusUpdate = (
    verificationId: string,
    status: '승인완료' | '승인거절',
    adminComment: string,
  ) => {
    updateStatusMutation.mutate({ verificationId, status, adminComment });
  };

  const handleRejectClick = (verification: any) => {
    setSelectedVerification(verification);
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = () => {
    if (selectedVerification && rejectReason.trim()) {
      handleStatusUpdate(selectedVerification.id, '승인거절', rejectReason);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '승인완료':
        return 'bg-green-100 text-green-800';
      case '승인대기':
        return 'bg-yellow-100 text-yellow-800';
      case '승인거절':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mt-[64px] min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="mt-2 text-gray-600">
            영수증 검증 관리 및 시스템 모니터링
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-100">
                    <Image
                      src="/assets/icons/schedule.svg"
                      alt="승인대기"
                      className="h-5 w-5 text-yellow-600"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">
                      승인대기
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {allLoading
                        ? '...'
                        : allVerificationsData?.data.filter(
                            (verification: any) =>
                              verification.status === '승인대기',
                          ).length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-100">
                    <Image
                      src="/assets/icons/check.svg"
                      alt="승인완료"
                      className="h-5 w-5 text-green-600"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">
                      승인완료
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {allLoading
                        ? '...'
                        : allVerificationsData?.data.filter(
                            (verification: any) =>
                              verification.status === '승인완료',
                          ).length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-100">
                    <Image
                      src="/assets/icons/x.svg"
                      alt="승인거절"
                      className="h-5 w-5 text-red-600"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">
                      승인거절
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {allLoading
                        ? '...'
                        : allVerificationsData?.data.filter(
                            (verification: any) =>
                              verification.status === '승인거절',
                          ).length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100">
                    <Image
                      src="/assets/icons/description.svg"
                      alt="전체"
                      className="h-5 w-5 text-blue-600"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">
                      전체
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {allLoading
                        ? '...'
                        : allVerificationsData?.data?.length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 필터 */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                상태
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="전체">전체</option>
                <option value="승인대기">승인대기</option>
                <option value="승인완료">승인완료</option>
                <option value="승인거절">승인거절</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                기간
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="전체">전체</option>
                <option value="오늘">오늘</option>
                <option value="이번주">이번주</option>
                <option value="1달전">1달전</option>
                <option value="2달전">2달전</option>
                <option value="3달전">3달전</option>
              </select>
            </div>
          </div>
        </div>

        {/* 영수증 검증 목록 */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">
              영수증 검증 목록
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    식당명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    사용자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    제출일시
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {allLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      로딩 중...
                    </td>
                  </tr>
                ) : allVerificationsData?.data?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      검증할 영수증이 없습니다.
                    </td>
                  </tr>
                ) : (
                  allVerificationsData?.data?.map((verification: any) => {
                    const date = new Date(verification.submitted_at);
                    const formattedDate = date.toLocaleString('ko-KR', {
                      timeZone: 'Asia/Seoul',
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    });

                    return (
                      <tr key={verification.id}>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {verification.restaurant_name}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {verification.nickname}
                          </div>
                          <div className="text-sm text-gray-500">
                            {verification.email}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {formattedDate}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(verification.status)}`}
                          >
                            {verification.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                          {verification.status === '승인대기' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    verification.id,
                                    '승인완료',
                                    '',
                                  )
                                }
                                disabled={updateStatusMutation.isPending}
                                className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                              >
                                승인
                              </button>
                              <button
                                onClick={() => handleRejectClick(verification)}
                                disabled={updateStatusMutation.isPending}
                                className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                              >
                                거절
                              </button>
                            </div>
                          )}
                          {verification.status !== '승인대기' && (
                            <div className="flex flex-col gap-1">
                              <span className="text-gray-400">처리완료</span>
                              {verification.admin_comment && (
                                <span className="text-red-400">
                                  이유: {verification.admin_comment}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 거절 이유 입력 모달 */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              승인 거절 이유
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              <strong>{selectedVerification?.restaurant_name}</strong>의 영수증
              검증을 거절하는 이유를 입력해주세요.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="거절 이유를 입력하세요..."
              className="mb-4 w-full resize-none rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={4}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setRejectModalOpen(false);
                  setRejectReason('');
                  setSelectedVerification(null);
                }}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                취소
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={
                  !rejectReason.trim() || updateStatusMutation.isPending
                }
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {updateStatusMutation.isPending ? '처리 중...' : '거절'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
