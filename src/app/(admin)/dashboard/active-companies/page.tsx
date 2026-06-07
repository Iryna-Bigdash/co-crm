import React from 'react';
import Header from '@/app/components/header';
import ActiveCompaniesList from '@/app/components/active-companies-list';

export interface PageProps {}

export const metadata = {
  title: 'Active companies 👩🏻‍💻',
  description: 'Developed by Iryna Bigdash',
};

export default function Page({}: PageProps) {
  return (
    <>
      <Header>Dashboard/Total active companies</Header>
      <main className="py-10 pl-10 pr-7">
        <ActiveCompaniesList />
      </main>
    </>
  );
}
