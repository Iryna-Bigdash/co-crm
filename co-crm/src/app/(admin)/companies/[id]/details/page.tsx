'use client'
import DelateCompanyButton from '@/app/components/company-delate-button';
import React from 'react';

export interface PageProps {
  params: { id: string };
}


export default function Page({ params }: PageProps) {
  return (
    <div className="py-6 px-10">
      <DelateCompanyButton companyId={params.id} />
    </div>
  );
}