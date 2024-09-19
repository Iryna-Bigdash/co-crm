import React from 'react';
import DashboardCard from '@/app/components/dashboard-card';
import PromotionsCard from '@/app/components/promotions-companies-card';

export interface PageProps {}

export default async function Page({}: PageProps) {

  return (
    <DashboardCard label="Promotions">
    < PromotionsCard />
    </DashboardCard>
  );
}
