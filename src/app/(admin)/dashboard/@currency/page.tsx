import React from 'react';
import DashboardCard from '@/app/components/dashboard-card';
import CurrencyRatesCard from '@/app/components/currency-rates-card';

export default async function Page() {
  return (
    <DashboardCard label="Currency Rates & Calculator">
      <CurrencyRatesCard />
    </DashboardCard>
  );
}
