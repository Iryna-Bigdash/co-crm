import InteractionCard from '@/app/components/manager-work/interaction-card';
import React from 'react';

export interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return (
    <div className="flex flex-col gap-4 p-4 w-full items-start">
      <InteractionCard 
      companyId={params.id} />
    </div>
  );
}