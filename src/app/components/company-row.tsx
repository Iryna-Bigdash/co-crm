import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import StatusLabel from '@/app/components/status-label';
import { Company } from '@/lib/api';

export interface CompanyRowProps {
  company: Company;
}

export default function CompanyRow({ company }: CompanyRowProps) {
  return (
    <tr className="h-14 text-center text-gray-900 bg-white ">
      <td className="text-xs font-medium text-blue-700 rounded-l border-l-4 border-blue-700">
        {company.categoryTitle}
      </td>
      <td className="w-56 pl-10">
        <div className="flex items-center gap-4">
          <div className="inline-block">
            {company.avatar ? (
              <Image
                src={company.avatar}
                alt="company avatar"
                width={32}
                height={32}
                objectFit="cover"
                className="rounded-full"
              />
            ) : (
              <Image
                src="/images/company-avatar.png"
                alt="default company avatar"
                width={32}
                height={32}
                objectFit="cover"
                className="rounded-full"
              />
            )}
          </div>
          <Link href={`/companies/${company.id}`} className="text-blue-600">
            {company.title}
          </Link>
        </div>
      </td>

      <td>
        <StatusLabel status={company.status} />
      </td>
      <td>
        <div className="inline-flex items-center gap-1">
          <Image
            width={16}
            height={16}
            src={`/icons/${company.hasPromotions ? 'check' : 'x-mark'}.svg`}
            alt="promotion icon"
          />
          <span
            className={clsx(
              'text-sm font-medium',
              company.hasPromotions ? 'text-green-700' : 'text-red-700',
            )}
          >
            {company.hasPromotions ? 'Yes' : 'No'}
          </span>
        </div>
      </td>
      <td>{company.countryTitle}</td>
      <td className="rounded-r">
        {new Date(company.joinedDate).toLocaleDateString('uk-UA')}
      </td>
    </tr>
  );
}
