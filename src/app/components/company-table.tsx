'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCompanies } from '@/lib/api';
import CompanyRow from '@/app/components/company-row';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

const headers = [
  'Category',
  'Company',
  'Status',
  'Promotion',
  'Country',
  'Joined date',
];

export default function CompanyTable() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { data: session } = useSession();
  
  const employeeId = session?.user?.role === 'manager' ? session.user.id : undefined;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['companies', employeeId],
    queryFn: () => getCompanies(employeeId),
    staleTime: 10 * 1000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const filteredCompanies = data?.filter((company) =>
    company.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="py-6 px-4 sm:py-8 sm:px-10 bg-gray-100 dark:bg-gray-900 overflow-x-auto transition-colors">
      <table className="table-auto w-full min-w-[640px] border-separate border-spacing-y-2">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="pb-5 text-sm font-light text-gray-900 dark:text-gray-100">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredCompanies?.map((company) => (
            <CompanyRow key={company.id} company={company} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
