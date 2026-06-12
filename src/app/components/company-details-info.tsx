'use client';
import React from 'react';
import DeleteCompanyButton from '@/app/components/company-delate-button';
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

  if (isLoading) return <p className="text-gray-700 dark:text-gray-300">Loading...</p>;
  if (error) return <p className="text-gray-700 dark:text-gray-300">Error loading company details</p>;
  if (!company) return <p className="text-gray-700 dark:text-gray-300">Company not found</p>;

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-xl w-full">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{company.title}</h2>

      <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
        <p><span className="font-medium text-gray-600 dark:text-gray-400">Category:</span> {company.categoryTitle || 'N/A'}</p>
        <p><span className="font-medium text-gray-600 dark:text-gray-400">Country:</span> {company.countryTitle || 'N/A'}</p>
        <p><span className="font-medium text-gray-600 dark:text-gray-400">Status:</span> {company.status}</p>
        <p><span className="font-medium text-gray-600 dark:text-gray-400">Joined:</span> {new Date(company.joinedDate).toLocaleDateString('uk')}</p>
      </div>

      <div>
        <p className="font-medium text-gray-600 dark:text-gray-400 mb-1">Description:</p>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {company.description || 'No description provided.'}
        </p>
      </div>

      <div className="flex flex-col items-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
        <DeleteCompanyButton companyId={companyId} />
      </div>
    </div>

  );
}
