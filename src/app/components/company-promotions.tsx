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
    refetchOnWindowFocus: false,
    retry: false,
  });

  if (!data || data.length === 0) {
    return (
      <div className="col-span-12 text-center text-gray-500 py-10">
       This company currently has no active promotions.
      </div>
    );
  }

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