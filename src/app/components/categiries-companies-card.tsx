'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getCategories, getCategoriesCounts } from '@/lib/api';
import StatCard, { StatCardType } from './stat-card';

export default function CategoriesCompaniesCard() {
  const { data: session } = useSession();
  const employeeId = session?.user?.role === 'manager' ? session.user.id : undefined;

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 10 * 1000,
  });

  const { data: categoryCounts = [], isLoading, isError, error } = useQuery({
    queryKey: ['categories', 'with-companies', employeeId],
    queryFn: () => getCategoriesCounts(employeeId),
    staleTime: 10 * 1000,
  });

  const categoryCountMap = new Map(categoryCounts.map(({ id, count }) => [id, count]));

  if (isLoading) return <div className="text-gray-900 dark:text-gray-100 p-4">Loading...</div>;
  if (isError) return <div className="text-red-600 dark:text-red-400 p-4">Error: {error.message}</div>;

  return (
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 pb-5 px-5" style={{ maxHeight: '230px', overflowY: 'scroll' }}>
        {categories.map(({ id, title }) => (
          <div key={id}>
            <StatCard
              type={StatCardType.Dark}
              label={title}
              counter={categoryCountMap.get(id) || 0}
            />
          </div>
        ))}
      </div>
  );
}
