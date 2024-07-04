'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DetailsCompanyModal from '@/app/components/details-company-modal';

export interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const router = useRouter();

  return (
    <DetailsCompanyModal
      companyId={params.id}
      show={true}
      onClose={() => router.back()}
    />
  );
}
