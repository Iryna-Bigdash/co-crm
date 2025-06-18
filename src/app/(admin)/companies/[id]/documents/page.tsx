import { DocumentsSection } from '@/app/components/manager-work/documents-section';
import React from 'react';

export interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return (
    <div className="p-4 w-full items-start">
      <DocumentsSection 
      companyId={params.id} />
    </div>
  );
}