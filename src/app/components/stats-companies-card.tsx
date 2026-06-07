'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getSummaryStats, SummaryStats } from '@/lib/api';
import StatCard, { StatCardType } from './stat-card';

const labelByStat: Record<keyof SummaryStats, string> = {
  promotions: 'Total promotions',
  categories: 'Total categories',
  newCompanies: 'New companies for the last month',
  activeCompanies: 'Total active companies',
};

const routeByStat: Partial<Record<keyof SummaryStats, string>> = {
  promotions: '/dashboard/total-promotions',
  categories: '/dashboard/total-categories',
  newCompanies: '/dashboard/new-companies',
  activeCompanies: '/dashboard/active-companies',
};

export default function StatsCompaniesCard() {
  const router = useRouter();

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
      {(Object.keys(labelByStat) as (keyof SummaryStats)[]).map((key) => {
        const route = routeByStat[key];
        const isClickable = Boolean(route);

        const openRoute = () => {
          if (route) router.push(route);
        };

        return (
          <div
            key={key}
            className="col-span-3"
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onClick={isClickable ? openRoute : undefined}
            onKeyDown={
              isClickable
                ? (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openRoute();
                    }
                  }
                : undefined
            }
          >
            <div
              className={
                isClickable
                  ? 'cursor-pointer transition-transform hover:scale-[1.02]'
                  : undefined
              }
            >
              <StatCard
                type={StatCardType.Gradient}
                label={labelByStat[key]}
                counter={summaryStats?.[key] || 0}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
