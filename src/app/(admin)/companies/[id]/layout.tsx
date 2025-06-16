'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import CompanyInfo from '@/app/components/company-info';
import CompanyTabs from '@/app/components/manager-work/company-tabs';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();

  const companyId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null; // або лоадер
  }

  return (
    <div className="py-6 px-10 grid grid-cols-12 gap-5">
      <div className="col-span-3">
        <CompanyInfo companyId={companyId} />
      </div>
      <div className="col-span-9 space-y-6">
        <CompanyTabs companyId={companyId} />
        {children}
      </div>
    </div>
  );
}
