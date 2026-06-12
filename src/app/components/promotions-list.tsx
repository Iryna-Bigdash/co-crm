'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import SummaryTable from './summary-table';
import SummaryTableCell from './summary-table-cell';
import SummaryTableHeader from './summary-table-header';
import { getPromotions } from '@/lib/api';

export interface PromotionsListProps {
  enabled?: boolean;
}

export default function PromotionsList({ enabled = true }: PromotionsListProps) {
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
    enabled,
  });

  if (isLoading) return <div className="py-6 text-center text-gray-900 dark:text-gray-100">Loading...</div>;

  if (isError)
    return (
      <div className="py-6 text-center text-red-600 dark:text-red-400">
        Error: {error.message}
      </div>
    );

  if (promotions.length === 0)
    return (
      <div className="py-6 text-center text-gray-500 dark:text-gray-400">No promotions found</div>
    );

  return (
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
  );
}
