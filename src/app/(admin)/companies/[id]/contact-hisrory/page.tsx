import React from 'react';

export interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return (
    <div className="flex flex-col gap-4 p-4 w-full items-start">
      <InteractionCard 
      companyId={params.id} 
      interface Interaction {
        id: string;
        type: InteractionType;
        status: InteractionStatus;
        date: string;
        comment: string;
        nextCall?: string;
        amount?: number;
      }/>
    </div>
  );
}