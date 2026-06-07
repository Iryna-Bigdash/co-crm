'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ActiveCompaniesListModal from '@/app/components/active-companies-list-modal';

export interface PageProps {}

export default function Page({}: PageProps) {
  const router = useRouter();

  return (
    <ActiveCompaniesListModal show={true} onClose={() => router.back()} />
  );
}
