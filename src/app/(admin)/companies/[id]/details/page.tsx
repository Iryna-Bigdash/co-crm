import React from 'react';
import CompanyDetailsInfo from '@/app/components/company-details-info';

export interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return (
    <div className="flex flex-col gap-4 p-4 w-full items-start">
      <CompanyDetailsInfo companyId={params.id}/>
    </div>
  );
}
