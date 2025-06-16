// import React from 'react';
// import { notFound } from 'next/navigation';
// import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
// import { Company, getCompany, getPromotions } from '@/lib/api';
// import getQueryClient from '@/lib/utils/getQueryClient';
// import CompanyInfo from '@/app/components/company-info';
// import CompanyPromotions from '@/app/components/company-promotions';
// import { InteractionCard } from '@/app/components/manager-work/interaction-card';

// export interface PageProps {
//   params: { id: string };
// }

// export async function generateMetadata({ params }: PageProps) {
//   const queryClient = getQueryClient();

//   await queryClient.prefetchQuery({
//     queryKey: ['companies', params.id],
//     queryFn: () => getCompany(params.id, { cache: 'no-store' }),
//     staleTime: 10 * 1000,
//   });

//   const company = queryClient.getQueryData(['companies', params.id]) as Company;

//   if (!company) {
//     return {
//       title: 'Company Not Found',
//       description: 'The requested company could not be found.',
//     };
//   }

//   return {
//     title: company.title,
//     description: `This is the page of ${company.title}`,
//   };
// }

// export default async function Page({ params }: PageProps) {
//   const queryClient = getQueryClient();

//   await queryClient.prefetchQuery({
//     queryKey: ['companies', params.id],
//     queryFn: () => getCompany(params.id, { cache: 'no-store' }),
//     staleTime: 10 * 1000,
//   });

//   await queryClient.prefetchQuery({
//     queryKey: ['promotions', params.id],
//     queryFn: () =>
//       getPromotions({ companyId: params.id }, { cache: 'no-store' }),
//     staleTime: 10 * 1000,
//   });

//   const company = queryClient.getQueryData(['companies', params.id]) as Company;

//   if (!company) {
//     notFound();
//   }

//   const dehydratedState = dehydrate(queryClient);

//   return (
//     <HydrationBoundary state={dehydratedState}>
//       <div className="py-6 px-10 grid grid-cols-12 gap-5">
//         <div className="col-span-3">
//           <CompanyInfo companyId={params.id} />
//         </div>

//         <div className="col-span-6">
//         <InteractionCard
//   interaction={{
//     id: '1',
//     type: 'call',
//     status: 'completed',
//     date: '2025-06-14',
//     comment: 'Звʼязались з клієнтом. Домовились про наступну зустріч.',
//     nextCall: '2025-06-20',
//     amount: 1500,
//   }}
// />
//         </div>

//         <div className="col-span-9">
//           <CompanyPromotions companyId={params.id} />
//         </div>
//       </div>
//     </HydrationBoundary>
//   );
// }


import React from 'react';
import { notFound } from 'next/navigation';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Company, getCompany, getPromotions } from '@/lib/api';
import getQueryClient from '@/lib/utils/getQueryClient';
import CompanyInfo from '@/app/components/company-info';
import CompanyPromotions from '@/app/components/company-promotions';
import CompanyTabs from '@/app/components/manager-work/company-tabs';
import InteractionCard from '@/app/components/manager-work/interaction-card';

export interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['companies', params.id],
    queryFn: () => getCompany(params.id, { cache: 'no-store' }),
    staleTime: 10 * 1000,
  });

  const company = queryClient.getQueryData(['companies', params.id]) as Company;

  if (!company) {
    return {
      title: 'Company Not Found',
      description: 'The requested company could not be found.',
    };
  }

  return {
    title: company.title,
    description: `This is the page of ${company.title}`,
  };
}

export default async function Page({ params }: PageProps) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['companies', params.id],
    queryFn: () => getCompany(params.id, { cache: 'no-store' }),
    staleTime: 10 * 1000,
  });

  await queryClient.prefetchQuery({
    queryKey: ['promotions', params.id],
    queryFn: () =>
      getPromotions({ companyId: params.id }, { cache: 'no-store' }),
    staleTime: 10 * 1000,
  });

  const company = queryClient.getQueryData(['companies', params.id]) as Company;

  if (!company) {
    notFound();
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="py-6 px-10 grid grid-cols-12 gap-5">
        {/* <div className="col-span-3">
          <CompanyInfo companyId={params.id} />
        </div>

        <div className="col-span-9 space-y-6">
          <CompanyTabs companyId={params.id} />
          <CompanyPromotions companyId={params.id} />
        </div> */}
        <div className="col-span-9 space-y-6">
     <CompanyPromotions companyId={params.id} />
     </div>
      </div>
    </HydrationBoundary>
  );
}
