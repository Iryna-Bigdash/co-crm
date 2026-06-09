import React from 'react';
import Header from '@/app/components/header';
import CategoriesList from '@/app/components/categories-list';

export interface PageProps {}

export const metadata = {
  title: 'Total categories 👩🏻‍💻',
  description: 'Developed by Iryna Bigdash',
};

export default function Page({}: PageProps) {
  return (
    <>
      <Header>Dashboard/Total categories</Header>
      <main className="py-6 px-4 sm:py-10 sm:px-7 lg:pl-10 lg:pr-7">
        <CategoriesList />
      </main>
    </>
  );
}
