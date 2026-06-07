'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import SummaryTable from './summary-table';
import SummaryTableCell from './summary-table-cell';
import SummaryTableHeader from './summary-table-header';
import { getPromotions } from '@/lib/api';

export interface PromotionsListProps {
  enabled?: boolean;
}

export default function PromotionsList({ enabled = true }: PromotionsListProps) {
  const {
    data: promotions = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['promotions'],
    queryFn: () => getPromotions(),
    staleTime: 10 * 1000,
    enabled,
  });

  if (isLoading) return <div className="py-6 text-center">Loading...</div>;

  if (isError)
    return (
      <div className="py-6 text-center text-red-600">
        Error: {error.message}
      </div>
    );

  if (promotions.length === 0)
    return (
      <div className="py-6 text-center text-gray-500">No promotions found</div>
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
