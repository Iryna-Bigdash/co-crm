'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import SummaryTable from '@/app/components/summary-table';
import SummaryTableCell from '@/app/components/summary-table-cell';
import SummaryTableHeader from '@/app/components/summary-table-header';
import { getPromotions } from '@/lib/api';

export default function PromotionsCard() {
  const { data: session } = useSession();
  const employeeId = session?.user?.role === 'manager' ? session.user.id : undefined;

  const {
    data: promotions = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['promotions', employeeId],
    queryFn: () => getPromotions(employeeId ? { employeeId } : {}),
    staleTime: 10 * 1000,
  });

  if (isLoading) return <div className="text-gray-900 dark:text-gray-100 p-4">Loading...</div>;
  if (isError) return <div className="text-red-600 dark:text-red-400 p-4">Error: {error.message}</div>;

  return (
    <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
      <SummaryTable
        headers={
          <>
            <SummaryTableHeader>Company</SummaryTableHeader>
            <SummaryTableHeader>Name</SummaryTableHeader>
            <SummaryTableHeader align="center">%</SummaryTableHeader>
          </>
        }
      >
        {promotions.map(({ id, title, companyTitle, discount }) => (
          <tr key={id}>
            <SummaryTableCell>{companyTitle}</SummaryTableCell>
            <SummaryTableCell>{title}</SummaryTableCell>
            <SummaryTableCell align="center">{`-${discount}%`}</SummaryTableCell>
          </tr>
        ))}
      </SummaryTable>
    </div>
  );
}
