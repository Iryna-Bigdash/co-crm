'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import NewCompaniesListModal from '@/app/components/new-companies-list-modal';

export interface PageProps {}

export default function Page({}: PageProps) {
  const router = useRouter();

  return (
    <NewCompaniesListModal show={true} onClose={() => router.back()} />
  );
}
