import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StatusLabel from '@/app/components/status-label';
import { Company } from '@/lib/api';
import CategoriesLabel from './category-label';
import clsx from 'clsx';

export interface CompanyRowProps {
  company: Company;
}

const borderColorClasses: Record<string, string> = {
  'Trade': 'border-emerald-400',
  'Product': 'border-red-400',
  'Healthcare': 'border-orange-400',
  'IT': 'border-yellow-400',
  'Finance': 'border-purple-400',
  'Energy': 'border-rose-400',
  'Construction': 'border-indigo-400',
  'Tourism': 'border-lime-400',
};

export default function CompanyRow({ company }: CompanyRowProps) {

  const category = {
    id: company.categoryId,
    title: company.categoryTitle || "No Category",
  };

  const categoryColor = borderColorClasses[company.categoryTitle ?? ''] || 'border-gray-300';


  const avatarUrl = company.avatar
    ? `${process.env.NEXT_PUBLIC_API_URL}${company.avatar}`
    : '/images/company-avatar.png';

  return (
    <tr className="h-14 text-center text-gray-900 bg-white">
      <td
        className={clsx(
          'text-xs font-medium rounded-l border-l-4',
          categoryColor,
        )}
      >
        <CategoriesLabel category={category}/>
      </td>
      <td className="w-56 pl-10">
        <div className="flex items-center gap-4">
          <div className="inline-block">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="company avatar"
                width={32}
                height={32}
                style={{ objectFit: 'cover' }}
                className="rounded-full"
              />
            ) : (
              <Image
                src="/images/company-avatar.png"
                alt="default company avatar"
                width={32}
                height={32}
                style={{ objectFit: 'cover' }}
                className="rounded-full"
              />
            )}
          </div>
          <Link href={`/companies/${company.id}`} className="text-gray-900">
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
            className={`text-sm font-medium ${company.hasPromotions ? 'text-green-700' : 'text-red-700'}`}
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
