'use client';

import React from 'react';
import DeleteCompanyButton from '@/app/components/company-delate-button';
import UpdateDescriptionButton from '@/app/components/update-description-button';

export interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return (
    <div className="flex flex-col gap-4 p-4 w-full items-start">
      <DeleteCompanyButton companyId={params.id} />
      <UpdateDescriptionButton companyId={params.id} />
    </div>
  );
}
