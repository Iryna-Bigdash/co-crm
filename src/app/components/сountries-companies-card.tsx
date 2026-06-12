'use client';

import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getCountriesWithCompanyCounts } from '@/lib/api';

export default function CountryCompaniesCard() {
  const { data: session } = useSession();
  const employeeId = session?.user?.role === 'manager' ? session.user.id : undefined;

  const {
    data: countries = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['countries', 'with-companies', employeeId],
    queryFn: () => getCountriesWithCompanyCounts(employeeId),
    staleTime: 10 * 1000,
  });

  const filteredCountries = countries.filter(
    (country) => country._count.companies > 0,
  );

  if (isLoading) return <div className="text-gray-900 dark:text-gray-100 p-4">Loading...</div>;
  if (isError) return <div className="text-red-600 dark:text-red-400 p-4">Error: {error.message}</div>;

  return (
    <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
      <div className="flex items-end pb-5 px-5 gap-2">
        <div>
          {filteredCountries.map(({ name, _count }) => (
            <p
              key={name}
              className={clsx(
                'text-sm text-gray-900 dark:text-gray-100 font-medium transition-colors',
                'before:inline-block before:w-2 before:h-2 before:rounded-full before:align-middle before:mr-2 before:bg-purple-200 dark:before:bg-purple-600',
              )}
            >{`${name} - ${_count.companies}`}</p>
          ))}
        </div>
        <Image width={395} height={262} src="/images/world.svg" alt="world" className="opacity-80 dark:opacity-40" />
      </div>
    </div>
  );
}
