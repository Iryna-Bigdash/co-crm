'use client';
import React from 'react';
import DeleteCompanyButton from '@/app/components/company-delate-button';
import UpdateDescriptionButton from '@/app/components/update-description-button';
import { useQuery } from '@tanstack/react-query';
import { getCompany } from '@/lib/api';

export interface PageProps {
  companyId: string;
}

export default function CompanyDetailsInfo({ companyId }: PageProps) {
  
  const { data: company, isLoading, error } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => getCompany(companyId),
    staleTime: 10 * 1000,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading company details</p>;
  if (!company) return <p>Company not found</p>;

  return (
    <div className="flex flex-col p-6 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{company.title}</h2>
      
      <div className="mb-4">
        <p><strong>Category:</strong> {company.categoryTitle || 'N/A'}</p>
        <p><strong>Country:</strong> {company.countryTitle || 'N/A'}</p>
        <p><strong>Status:</strong> {company.status}</p>
        <p><strong>Joined Date:</strong> {new Date(company.joinedDate).toLocaleDateString('uk')}</p>
      </div>

      <div className="mb-4">
        <p><strong>Description:</strong></p>
        <p>{company.description || 'No description provided'}</p>
      </div>

      {company.avatar && (
        <div className="mb-4">
          <img src={company.avatar} alt={`${company.title} avatar`} className="rounded-full w-20 h-20 object-cover" />
        </div>
      )}

      <div className="mt-6 flex space-x-4">
        <UpdateDescriptionButton companyId={companyId} />
        <DeleteCompanyButton companyId={companyId} />
      </div>
    </div>
  );
}
