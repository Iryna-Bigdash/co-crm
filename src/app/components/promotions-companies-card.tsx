'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import SummaryTable from '@/app/components/summary-table';
import SummaryTableCell from '@/app/components/summary-table-cell';
import SummaryTableHeader from '@/app/components/summary-table-header';
import { getPromotions } from '@/lib/api';

export default function PromotionsCard() {
  const {
    data: promotions = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['promotions'],
    queryFn: () => getPromotions(),
    staleTime: 10 * 1000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

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
