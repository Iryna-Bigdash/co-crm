'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSummaryStats, SummaryStats } from '@/lib/api';
import StatCard, { StatCardType } from './stat-card';

const labelByStat: Record<keyof SummaryStats, string> = {
  promotions: 'Total promotions',
  categories: 'Total categories',
  newCompanies: 'New companies for the last month',
  activeCompanies: 'Total active companies',
};

export default function StatsCompaniesCard() {
  const { 
    data: summaryStats,
    isLoading,
    isError,
    error, 
  } = useQuery({
    queryKey: ['summary-stats'],
    queryFn: getSummaryStats,
    staleTime: 10 * 1000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-12 gap-5">
      {(Object.keys(labelByStat) as (keyof SummaryStats)[]).map((key) => (
        <div key={key} className="col-span-3">
          <StatCard
            type={StatCardType.Gradient}
            label={labelByStat[key]}
            counter={summaryStats?.[key] || 0}
          />
        </div>
      ))}
    </div>
  );
}
