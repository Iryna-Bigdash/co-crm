// 'use client';

// import React from 'react';
// import Image from 'next/image';
// import { useQuery } from '@tanstack/react-query';
// import { getCompany, updateCompanyStatus } from '@/lib/api';
// import StatusLabel from '@/app/components/status-label';

// export interface CompanyInfoProps {
//   companyId: string;
// }

// export default function CompanyInfo({ companyId }: CompanyInfoProps) {
//   const { data: company, refetch } = useQuery({
//     queryKey: ['company', companyId],
//     queryFn: () => getCompany(companyId),
//     staleTime: 10 * 1000,
//   });

//   if (!company) return null;
//   return (
//     <div className="flex flex-col gap-5">
//       <div className="flex flex-col items-center p-7 gap-5 bg-gray-900 rounded">
//         <div className="w-20 h-20 rounded-full bg-blue-500">
//         {company.avatar ? (
//             <Image
//               src={company.avatar}
//               alt="company avatar"
//               width={80}
//               height={80}
//               objectFit="cover"
//               className="rounded-full"
//             />
//           ) : (
//             <Image
//               src="/images/company-avatar.png"
//               alt="default company avatar"
//               objectFit="cover"
//               className="rounded-full"
//               width={80}
//               height={80}
//             />
//           )}
//         </div>
//         <p className="pb text-base font-semibold text-white">{company.title}</p>
//         <StatusLabel status={company.status} />
//       </div>
//       <div className="p-7 text-base text-gray-900 bg-gray-100 rounded">
//         <p className="pb-5 text-xl font-semibold">About company</p>
//         <p className="pb-3">{`Category: ${company.categoryTitle}`}</p>
//         <p className="pb-3">{`Country: ${company.countryTitle}`}</p>
//         <p className="pb-3">{`Joined date: ${new Date(
//           company.joinedDate,
//         ).toLocaleDateString('uk')}`}</p>
//         <div className="w-full h-px my-8 bg-gray-300" />
//         <p>{company.description}</p>
//       </div>
//     </div>
//   );
// }

"use client"

import React, { useState } from 'react';
import clsx from 'clsx';
import { CompanyStatus } from '@/lib/api';

export interface StatusLabelProps {
  status: CompanyStatus;
  disabled?: boolean;
  onStatusChange?: (newStatus: CompanyStatus) => void; // Додано onStatusChange
}

const labelByStatus = {
  [CompanyStatus.Active]: 'Active',
  [CompanyStatus.NotActive]: 'Not Active',
  [CompanyStatus.Pending]: 'Pending',
  [CompanyStatus.Suspended]: 'Suspended',
};

const statusOptions = [
  CompanyStatus.Active,
  CompanyStatus.NotActive,
  CompanyStatus.Pending,
  CompanyStatus.Suspended,
];

export default function StatusLabel({ status, disabled, onStatusChange }: StatusLabelProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatusChange = (newStatus: CompanyStatus) => {
    if (onStatusChange) {
      onStatusChange(newStatus); // Викликаємо зовнішній колбек для зміни статусу
    }
    setCurrentStatus(newStatus); // Оновлюємо локальний стан
    setDropdownOpen(false); // Закриваємо дропдаун після вибору
  };

  return (
    <div className="relative inline-block text-left">
      <button
        disabled={disabled}
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        className={clsx(
          'inline-flex items-center py-1 px-3.5 rounded-3xl text-sm font-medium',
          currentStatus === CompanyStatus.Active && 'text-green-700 bg-green-100',
          currentStatus === CompanyStatus.NotActive && 'text-red-700 bg-red-100',
          currentStatus === CompanyStatus.Pending && 'text-orange-700 bg-orange-100',
          currentStatus === CompanyStatus.Suspended && 'text-blue-700 bg-blue-100',
          {
            ['opacity-75 cursor-not-allowed']: disabled,
          }
        )}
      >
        <div className="w-1 h-1 mr-2 rounded-full bg-current" />
        {labelByStatus[currentStatus]}
      </button>

      {isDropdownOpen && (
        <div className="absolute mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <ul className="py-1" role="menu">
            {statusOptions.map((statusOption) => (
              <li
                key={statusOption}
                className="text-gray-700 block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                onClick={() => handleStatusChange(statusOption)}
              >
                {labelByStatus[statusOption]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
