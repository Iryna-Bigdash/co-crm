'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getSummarySales } from '@/lib/api';
import SummaryTable from '@/app/components/summary-table';
import SummaryTableHeader from '@/app/components/summary-table-header';
import SummaryTableCell from '@/app/components/summary-table-cell';

export default function SummarySalesCard() {
  const { data: session } = useSession();
  const employeeId = session?.user?.role === 'manager' ? session.user.id : undefined;

  const { 
    data: summarySales = [],
    isLoading,
    isError,
    error, 
  } = useQuery({
    queryKey: ['summary-sales', employeeId],
    queryFn: () => getSummarySales(employeeId),
    staleTime: 10 * 1000,
  });

  if (isLoading) return <div className="text-gray-900 dark:text-gray-100 p-4">Loading...</div>;
  if (isError) return <div className="text-red-600 dark:text-red-400 p-4">Error: {error?.message}</div>;

  return (
    <div style={{ maxHeight: '246px', overflowY: 'auto' }}>
      {summarySales.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 p-4">No sales data available</div>
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
