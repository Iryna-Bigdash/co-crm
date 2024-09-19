'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPromotionsforSelectedCompany } from '@/lib/api';
import Promotion from '@/app/components/promotion';

export interface CompanyPromotionsProps {
  companyId: string;
}

export default function CompanyPromotions({
  companyId,
}: CompanyPromotionsProps) {
  const { data } = useQuery({
    queryKey: ['promotions', 'company', companyId],
    queryFn: () => getPromotionsforSelectedCompany( companyId ),
    staleTime: 10 * 1000,
  });

  return (
    <div className="grid grid-cols-12 gap-5">
      {data?.map((promotion) => (
        <div key={promotion.id} className="col-span-4">
          <Promotion promotion={promotion} companyId={companyId} />
        </div>
      ))}
    </div>
  );
}