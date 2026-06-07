'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CategoriesListModal from '@/app/components/categories-list-modal';

export interface PageProps {}

export default function Page({}: PageProps) {
  const router = useRouter();

  return (
    <CategoriesListModal show={true} onClose={() => router.back()} />
  );
}
