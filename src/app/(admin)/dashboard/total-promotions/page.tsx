import React from 'react';
import Header from '@/app/components/header';
import PromotionsList from '@/app/components/promotions-list';

export interface PageProps {}

export const metadata = {
  title: 'Total promotions 👩🏻‍💻',
  description: 'Developed by Iryna Bigdash',
};

export default function Page({}: PageProps) {
  return (
    <>
      <Header>Dashboard/Total promotions</Header>
      <main className="py-10 pl-10 pr-7">
        <PromotionsList />
      </main>
    </>
  );
}
