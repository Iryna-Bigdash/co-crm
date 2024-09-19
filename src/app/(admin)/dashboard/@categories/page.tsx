import CategoriesCompaniesCard from '@/app/components/categiries-companies-card';
import DashboardCard from '@/app/components/dashboard-card';
import React from 'react';

export interface PageProps { }

export default async function Page({ }: PageProps) {

  return (
    <DashboardCard label="Categories of companies">
      < CategoriesCompaniesCard />
    </DashboardCard>
  );
}
