'use client';

import React from 'react';
import DeleteCompanyButton from '@/app/components/company-delate-button';

export interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {

  return (
    <div className="py-6 px-10">
      <DeleteCompanyButton companyId={params.id} />
    </div>
  );
}

