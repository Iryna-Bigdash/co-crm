'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import SummaryTable from './summary-table';
import SummaryTableCell from './summary-table-cell';
import SummaryTableHeader from './summary-table-header';
import { getCompanies, type Company } from '@/lib/api';

export interface NewCompaniesListProps {
  enabled?: boolean;
}

const isAddedThisMonth = (company: Company) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return new Date(company.joinedDate) >= startOfMonth;
};

export default function NewCompaniesList({
  enabled = true,
}: NewCompaniesListProps) {
  const { data: session } = useSession();
  const employeeId = session?.user?.role === 'manager' ? session.user.id : undefined;

  const {
    data: companies = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['companies', employeeId],
    queryFn: () => getCompanies(employeeId),
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

  const newCompanies = companies.filter(isAddedThisMonth);

  if (newCompanies.length === 0)
    return (
      <div className="py-6 text-center text-gray-500 dark:text-gray-400">
        No new companies were added this month
      </div>
    );

  return (
    <SummaryTable
      headers={
        <>
          <SummaryTableHeader>Company</SummaryTableHeader>
          <SummaryTableHeader>Category</SummaryTableHeader>
          <SummaryTableHeader>Country</SummaryTableHeader>
          <SummaryTableHeader align="center">Joined</SummaryTableHeader>
        </>
      }
    >
      {newCompanies.map(({ id, title, categoryTitle, countryTitle, joinedDate }) => (
        <tr key={id}>
          <SummaryTableCell>{title}</SummaryTableCell>
          <SummaryTableCell>{categoryTitle}</SummaryTableCell>
          <SummaryTableCell>{countryTitle}</SummaryTableCell>
          <SummaryTableCell align="center">
            {format(new Date(joinedDate), 'dd MMM yyyy')}
          </SummaryTableCell>
        </tr>
      ))}
    </SummaryTable>
  );
}
