'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from './button';

export interface CompanyDetailsProps {
  companyId: string;
}

export default function CompanyDetails({ companyId }: CompanyDetailsProps) {
  const router = useRouter();
  
  return (
    <Button
      onClick={() =>
        router.push(`/companies/${companyId}/details`, { scroll: false })
      }
    >
      Details
    </Button>
  );
}




