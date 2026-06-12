import React from 'react';

export interface LayoutProps {
  stats: React.ReactNode;
  children: React.ReactNode;
  sales: React.ReactNode;
  categories: React.ReactNode;
  countries: React.ReactNode;
  promotions: React.ReactNode;
  currency: React.ReactNode;
  modal: React.ReactNode;
}

export default function Layout({
  stats,
  children,
  sales,
  categories,
  countries,
  promotions,
  currency,
  modal,
}: LayoutProps) {
  return (
    <div>
      {modal}
      {children}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 py-6 px-4 sm:py-10 sm:px-7 lg:pl-10 lg:pr-7">
        <div className="lg:col-span-12">{stats}</div>
        <div className="lg:col-span-12">{currency}</div>
        <div className="lg:col-span-5">{sales}</div>
        <div className="lg:col-span-7">{categories}</div>
        <div className="lg:col-span-6">{countries}</div>
        <div className="lg:col-span-6">{promotions}</div>
      </main>
    </div>
  );
}
