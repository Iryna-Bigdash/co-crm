'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSummarySales } from '@/lib/api';
import SummaryTable from '@/app/components/summary-table';
import SummaryTableHeader from '@/app/components/summary-table-header';
import SummaryTableCell from '@/app/components/summary-table-cell';

export default function SummarySalesCard() {
  const { 
    data: summarySales = [],
    isLoading,
    isError,
    error, 
  } = useQuery({
    queryKey: ['summary-sales'],
    queryFn: getSummarySales,
    staleTime: 10 * 1000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div style={{ maxHeight: '246px', overflowY: 'auto' }}>
      {summarySales.length === 0 ? (
        <div>No sales data available</div>
      ) : (
        <SummaryTable
          headers={
            <>
              <SummaryTableHeader>Company</SummaryTableHeader>
              <SummaryTableHeader align="center">Sold</SummaryTableHeader>
              <SummaryTableHeader align="center">Income</SummaryTableHeader>
            </>
          }
        >
          {summarySales.map(({ companyId, companyTitle, sold, income }) => (
            <tr key={companyId}>
              <SummaryTableCell>{companyTitle}</SummaryTableCell>
              <SummaryTableCell align="center">{sold}</SummaryTableCell>
              <SummaryTableCell align="center">{formatCurrency(income)}</SummaryTableCell>
            </tr>
          ))}
        </SummaryTable>
      )}
    </div>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
