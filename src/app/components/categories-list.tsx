'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import SummaryTable from './summary-table';
import SummaryTableCell from './summary-table-cell';
import SummaryTableHeader from './summary-table-header';
import { getCategoriesCounts } from '@/lib/api';

export interface CategoriesListProps {
  enabled?: boolean;
}

export default function CategoriesList({ enabled = true }: CategoriesListProps) {
  const { data: session } = useSession();
  const employeeId = session?.user?.role === 'manager' ? session.user.id : undefined;

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['categories', 'with-companies', employeeId],
    queryFn: () => getCategoriesCounts(employeeId),
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

  if (categories.length === 0)
    return (
      <div className="py-6 text-center text-gray-500 dark:text-gray-400">No categories found</div>
    );

  return (
    <SummaryTable
      headers={
        <>
          <SummaryTableHeader>Category</SummaryTableHeader>
          <SummaryTableHeader align="center">Companies</SummaryTableHeader>
        </>
      }
    >
      {categories.map(({ id, title, count }) => (
        <tr key={id}>
          <SummaryTableCell>{title}</SummaryTableCell>
          <SummaryTableCell align="center">{count}</SummaryTableCell>
        </tr>
      ))}
    </SummaryTable>
  );
}
