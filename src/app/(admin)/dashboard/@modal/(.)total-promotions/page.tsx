'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import PromotionsListModal from '@/app/components/promotions-list-modal';

export interface PageProps {}

export default function Page({}: PageProps) {
  const router = useRouter();

  return (
    <PromotionsListModal show={true} onClose={() => router.back()} />
  );
}
