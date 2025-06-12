'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getCompany } from '@/lib/api';
import StatusLabel from '@/app/components/status-label';
import UpdateDescriptionModal from '../components/description-update-modal';

export interface CompanyInfoProps {
  companyId: string;
}

export default function CompanyInfo({ companyId }: CompanyInfoProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
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

  const handleOpenEditModal = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false); 

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

        <div className="flex justify-between items-start">
          <p className="text-gray-700 text-sm leading-relaxed max-w-[90%]">
            {company.description || 'No description provided.'}
          </p>

          <button
            className="text-sm text-gray-900 p-1 rounded hover:bg-gray-100"
            aria-label="Edit description"
            onClick={handleOpenEditModal} 
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 hover:stroke-cyan-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
        </div>
      </div>

      {company && (
        <UpdateDescriptionModal
          show={isEditModalOpen}
          onClose={handleCloseEditModal}
          companyId={company.id}
          title={company.title}
          initialDescription={company.description || ''}
        />
      )}
    </div>
  );
}
