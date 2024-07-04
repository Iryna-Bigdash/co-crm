import React from 'react';
 import Toolbar from '@/app/components/toolbar';
//  import SearchInput from '@/app/components/search-input';
 import AddPromotionButton from '@/app/components/add-promotion-button';
 import CompanyDetails from '@/app/components/company-details';


 export interface PageProps {
   params: { id: string };
 }

 export default function Page({ params }: PageProps) {
   return (
     <Toolbar action={<AddPromotionButton companyId={params.id} />}>
       {/* <SearchInput /> */}
       <CompanyDetails companyId={params.id} />
      
     </Toolbar>
   );
 }