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
      <main className="py-10 pl-10 pr-7">
        <CategoriesList />
      </main>
    </>
  );
}
