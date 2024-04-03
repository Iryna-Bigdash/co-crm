import DashboardCard from '@/app/components/dashboard-card';
import StatCard, { StatCardType } from '@/app/components/stat-card';
// import { getCategories, getCompanies } from '@/lib/api';
import getCountById from '@/lib/utils/getCountById';
import React from 'react';

const getCategories = () => {
  const categories = [
    { id: 'cat1', title: 'Products' },
    { id: 'cat2', title: 'Products' },
    { id: 'cat3', title: 'Products' },
    { id: 'cat4', title: 'Products' },
    { id: 'cat5', title: 'Products' },
    { id: 'cat6', title: 'Products' },
    { id: 'cat7', title: 'Products' },
    { id: 'cat8', title: 'Products' },
    { id: 'cat9', title: 'Products' },
    { id: 'cat10', title: 'Products' },
    { id: 'cat11', title: 'Products' },

  ];
  return categories;
};

// Функція для генерації фейкових даних для компаній
const getCompanies = () => {
  const companies = [];
  const categories = getCategories();
  // Генеруємо випадкову кількість компаній для кожної категорії
  for (const category of categories) {
    const numCompanies = Math.floor(Math.random() * 10) + 1; // Випадкова кількість компаній від 1 до 10
    for (let i = 1; i <= numCompanies; i++) {
      companies.push({ id: `company_${i}`, categoryId: category.id });
    }
  }
  return companies;
};

export interface PageProps {}

export default async function Page({}: PageProps) {
  const categories = await getCategories();
  const companies = await getCompanies();

  const counts = getCountById(companies, 'categoryId');

  return (
    <DashboardCard label="Categories of companies">
      <div className="grid grid-cols-12 gap-3 pb-5 px-5" style={{maxHeight: '230px', overflowY: "scroll"}}>
        {categories.map(({ id, title }) => (
          <div key={id} className="col-span-3">
            <StatCard
              type={StatCardType.Dark}
              label={title}
              counter={counts[id] || 0}
            />
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

