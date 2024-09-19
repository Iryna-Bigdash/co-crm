'use client';

import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { getCountriesWithCompanyCounts } from '@/lib/api';

export default function CountryCompaniesCard() {
  const {
    data: countries = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['countries', 'with-companies'],
    queryFn: getCountriesWithCompanyCounts,
    staleTime: 10 * 1000,
  });

  const filteredCountries = countries.filter(
    (country) => country._count.companies > 0,
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
      <div className="flex items-end pb-5 px-5 gap-2">
        <div>
          {filteredCountries.map(({ name, _count }) => (
            <p
              key={name}
              className={clsx(
                'text-sm text-gray-900 font-medium',
                'before:inline-block before:w-2 before:h-2 before:rounded-full before:align-middle before:mr-2 before:bg-purple-200',
              )}
            >{`${name} - ${_count.companies}`}</p>
          ))}
        </div>
        <Image width={395} height={262} src="/images/world.svg" alt="world" />
      </div>
    </div>
  );
}
