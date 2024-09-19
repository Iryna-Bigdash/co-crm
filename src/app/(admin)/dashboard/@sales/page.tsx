import React from 'react';
import DashboardCard from '@/app/components/dashboard-card';
import SummarySalesCard from '@/app/components/summery-sales-card';

export interface PageProps {}

export default async function Page({}: PageProps) {

  return (
    <DashboardCard label="Sales details">
      < SummarySalesCard />
    </DashboardCard>
  );
}
