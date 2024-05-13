import React from 'react';
import DashboardCard from '@/app/components/dashboard-card';
import SummaryTable from '@/app/components/summary-table';
import SummaryTableCell from '@/app/components/summary-table-cell';
import SummaryTableHeader from '@/app/components/summary-table-header';
// import { getPromotions } from '@/lib/api';

export interface Promotion {
  id: string;
  title: string;
  companyTitle: string;
  discount: number;
}

export interface PageProps {}

const getPromotions = (): Promotion[] => {
  const data: Promotion[] = [];

  for (let i = 1; i <= 17; i++) {
    data.push({
      id: `promo_${i}`,
      title: `Promotion ${i}`,
      companyTitle: `Company ${i}`,
      discount: Math.floor(Math.random() * 50) + 1,
    });
  }

  return data;
};

export default async function Page({}: PageProps) {
  const data = await getPromotions();

  return (
    <DashboardCard label="Promotions">
      <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
      <SummaryTable
        headers={
          <>
            <SummaryTableHeader>Company</SummaryTableHeader>
            <SummaryTableHeader>Name</SummaryTableHeader>
            <SummaryTableHeader align="center">%</SummaryTableHeader>
          </>
        }
      >
        {data.map(({ id, title, companyTitle, discount }) => (
          <tr key={id}>
            <SummaryTableCell>{companyTitle}</SummaryTableCell>
            <SummaryTableCell>{title}</SummaryTableCell>
            <SummaryTableCell align="center">{`-${discount}%`}</SummaryTableCell>
          </tr>
        ))}
      </SummaryTable>
      </div>
    </DashboardCard>
  );
}
