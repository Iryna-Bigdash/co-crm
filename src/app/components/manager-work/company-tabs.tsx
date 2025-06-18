'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import {
  FileText,
  PhoneCall,
  Paperclip,
  Pencil,
} from 'lucide-react';

interface CompanyTabsProps {
  companyId: string;
}

const tabs = [
  {
    label: 'Information',
    href: (id: string) => `/companies/${id}`,
    icon: FileText,
  },
  {
    label: 'Contact history',
    href: (id: string) => `/companies/${id}/contact-history`,
    icon: PhoneCall,
  },
  {
    label: 'Documents',
    href: (id: string) => `/companies/${id}/documents`,
    icon: Paperclip,
  },
  {
    label: 'Contract',
    href: (id: string) => `/companies/${id}/contracts`,
    icon: Pencil,
  },
];

export default function CompanyTabs({ companyId }: CompanyTabsProps) {
  const pathname = usePathname();

  return (
    <div className="flex items-center space-x-6 border-b pb-4">
      {tabs.map(({ label, href, icon: Icon }) => {
        const url = href(companyId);
        const isActive = pathname === url;

        return (
          <Link
            key={label}
            href={url}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition',
              isActive
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-600 hover:text-blue-700'
            )}
          >
            <Icon
              size={18}
              className={clsx(isActive ? 'text-blue-700' : 'text-gray-500')}
            />
            <span>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}


