import React from 'react';
import SummaryTableCell from '@/app/components/summary-table-cell';
import SummaryTableHeader from '@/app/components/summary-table-header';
import SummaryTable from '@/app/components/summary-table';
import DashboardCard from '@/app/components/dashboard-card';

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomCompanyTitle = () => {
  const companies = ['Company A', 'Company B', 'Company C', 'Company D', 'Company E'];
  return companies[getRandomNumber(0, companies.length - 1)];
};

const generateRandomSalesData = (count: number) => {
  const salesData = [];
  for (let i = 0; i < count; i++) {
    const companyId = `company_${i}`;
    const companyTitle = getRandomCompanyTitle();
    const sold = getRandomNumber(100, 1000);
    const income = getRandomNumber(1000, 10000);
    salesData.push({ companyId, companyTitle, sold, income });
  }
  return salesData;
};

export interface PageProps {}

const Page: React.FC<PageProps> = () => {
  const data = generateRandomSalesData(16); 

  return (
    <DashboardCard label="Sales details">
      <div style={{ maxHeight: '246px', overflowY: 'auto' }}>
        <SummaryTable
          headers={
            <>
              <SummaryTableHeader>Company</SummaryTableHeader>
              <SummaryTableHeader align="center">Sold</SummaryTableHeader>
              <SummaryTableHeader align="center">Income</SummaryTableHeader>
            </>
          }
        >
          {data.map(({ companyId, companyTitle, sold, income }) => (
            <tr key={companyId}>
              <SummaryTableCell>{companyTitle}</SummaryTableCell>
              <SummaryTableCell align="center">{sold}</SummaryTableCell>
              <SummaryTableCell align="center">{`$${income}`}</SummaryTableCell>
            </tr>
          ))}
        </SummaryTable>
      </div>
    </DashboardCard>
  );
};

export default Page;




