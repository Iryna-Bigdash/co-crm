import { ContractsSection } from '@/app/components/manager-work/contracts-section';
import React from 'react';

export interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return (
    <div className="p-4 w-full items-start">
      <ContractsSection 
      companyId={params.id} />
    </div>
  );
}