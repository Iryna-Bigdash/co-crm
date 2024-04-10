import React from 'react';
import StatCard, { StatCardType } from '@/app/components/stat-card';
import { SummaryStats } from '@/lib/api';
import { faker } from '@faker-js/faker';
import Link from 'next/link';

export interface PageProps {}

const getRandomStats = (): SummaryStats => {
  return {
    promotions: faker.number.int({ min: 0, max: 600 }),
    categories: faker.number.int({ min: 0, max: 50 }),
    newCompanies: faker.number.int({ min: 0, max: 100 }),
    activeCompanies: faker.number.int({ min: 0, max: 1000 }),
  };
};

const labelByStat: Record<keyof SummaryStats, string> = {
  promotions: 'Total promotions',
  categories: 'Total categories',
  newCompanies: 'New companies',
  activeCompanies: 'Total active companies',
};

const Page: React.FC<PageProps> = () => {
  const data = getRandomStats();

  return (
    <div className="grid grid-cols-12 gap-5">
      {(Object.keys(labelByStat) as (keyof SummaryStats)[]).map((key) => (
        <Link href={`dashboard/${key}`}  key={key} className="col-span-3">
          <StatCard
            type={StatCardType.Gradient}
            label={labelByStat[key]}
            counter={data[key]}
          />
        </Link>
      ))}
    </div>
  );
};

export default Page;


