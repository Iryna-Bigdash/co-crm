'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getCategoriesCounts } from '@/lib/api';
import StatCard, { StatCardType } from './stat-card';

export default function CategoriesCompaniesCard() {

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 10 * 1000,
  });

  const { data: categoryCounts = [], isLoading, isError, error } = useQuery({
    queryKey: ['categories', 'with-companies'],
    queryFn: getCategoriesCounts,
    staleTime: 10 * 1000,
  });

  const categoryCountMap = new Map(categoryCounts.map(({ id, count }) => [id, count]));

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
      <div className="grid grid-cols-12 gap-3 pb-5 px-5" style={{ maxHeight: '230px', overflowY: 'scroll' }}>
        {categories.map(({ id, title }) => (
          <div key={id} className="col-span-3">
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
