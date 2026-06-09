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
      <main className="py-6 px-4 sm:py-10 sm:px-7 lg:pl-10 lg:pr-7">
        <NewCompaniesList />
      </main>
    </>
  );
}
