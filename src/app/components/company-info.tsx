'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getCompany } from '@/lib/api';
import StatusLabel from '@/app/components/status-label';

export interface CompanyInfoProps {
  companyId: string;
}

export default function CompanyInfo({ companyId }: CompanyInfoProps) {
  const { data: company, refetch } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => getCompany(companyId),
    staleTime: 10 * 1000,
  });

  useEffect(() => {
    if (!company) {
      refetch(); 
    }
  }, [company, refetch]);

  if (!company) return null;

  const avatarUrl = company.avatar
    ? `${process.env.NEXT_PUBLIC_API_URL}${company.avatar}`
    : '/images/company-avatar.png';

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center p-7 gap-5 bg-gray-900 rounded">
        <div className="w-20 h-20 rounded-full bg-blue-500">
          <Image
            src={avatarUrl}
            alt="company avatar"
            width={80}
            height={80}
            style={{ objectFit: 'cover' }}
            className="rounded-full"
          />
        </div>
        <p className="pb text-base font-semibold text-white">{company.title}</p>
        <StatusLabel status={company.status} />
      </div>
      <div className="p-7 text-base text-gray-900 bg-gray-100 rounded">
        <p className="pb-5 text-xl font-semibold">About company</p>
        <p className="pb-3">{`Category: ${company.categoryTitle}`}</p>
        <p className="pb-3">{`Country: ${company.countryTitle}`}</p>
        <p className="pb-3">{`Joined date: ${new Date(company.joinedDate).toLocaleDateString('uk')}`}</p>
        <div className="w-full h-px my-8 bg-gray-300" />
        <p>{company.description}</p>
      </div>
    </div>
  );
}
