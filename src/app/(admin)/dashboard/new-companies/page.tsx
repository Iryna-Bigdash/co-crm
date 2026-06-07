import React from 'react';
import Header from '@/app/components/header';
import NewCompaniesList from '@/app/components/new-companies-list';

export interface PageProps {}

export const metadata = {
  title: 'New companies 👩🏻‍💻',
  description: 'Developed by Iryna Bigdash',
};

export default function Page({}: PageProps) {
  return (
    <>
      <Header>Dashboard/New companies for the last month</Header>
      <main className="py-10 pl-10 pr-7">
        <NewCompaniesList />
      </main>
    </>
  );
}
