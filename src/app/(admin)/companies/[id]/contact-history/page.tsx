import InteractionSection from '@/app/components/manager-work/interection-section';
import React from 'react';

export interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return (
    <div className="p-4 w-full items-start">
      <InteractionSection 
      companyId={params.id} />
    </div>
  );
}