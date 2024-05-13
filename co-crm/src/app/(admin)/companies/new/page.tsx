'use client';

import CompanyForm from "@/app/components/company-form";

import React from "react";

export interface PageProps {};

export default function Page({}: PageProps) {
return (
    <div className="py-6 px-10">
        <CompanyForm onSubmit={console.log} />

    </div>
)

}

// import React from 'react';
// import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
// import { getCompanies } from '@/lib/api';
// import getQueryClient from '@/lib/utils/getQueryClient';
// import CompanyTable from '@/app/components/company-table';

// export interface PageProps {}

// export default async function Page({}: PageProps) {
//   const queryClient = getQueryClient();

//   await queryClient.prefetchQuery({
//     queryKey: ['companies'],
//     queryFn: () => getCompanies({ cache: 'no-store' }),
//     staleTime: 10 * 1000,
//   });

//   const dehydratedState = dehydrate(queryClient);

//   return (
//     <HydrationBoundary state={dehydratedState}>
//       <CompanyTable />
//     </HydrationBoundary>
//   );
// }
