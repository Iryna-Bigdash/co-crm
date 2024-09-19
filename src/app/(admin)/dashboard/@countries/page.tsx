import React from 'react';
import DashboardCard from '@/app/components/dashboard-card';
import CountryCompaniesCard from '@/app/components/сountries-companies-card';

export default async function Page() {

  return (
    <DashboardCard label="Countries of companies">
      <CountryCompaniesCard />
    </DashboardCard>
  );
}
