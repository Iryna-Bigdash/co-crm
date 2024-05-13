'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from './button';

export default function AddCompanyButton() {
  const router = useRouter();

  return (
    <>
      <Button onClick={() => router.push('/companies/new')}>
      Add company
    </Button></>
  
  );
}

// 'use client';

// import React, { useState } from 'react';
// import Button from './button';
// import dynamic from 'next/dynamic';
// // import CompanyFormModal from './company-form-modal';

// const CompanyFormModal = dynamic (() => import('./company-form-modal'), {
//   ssr: false,
// });

// export default function AddCompanyButton() {
//   const [show, setShow] = useState(false)

//   return (
//     <>
//     <Button onClick={() => setShow(true)}>
//       Add company
//     </Button>
//     <CompanyFormModal
//     onSubmit={console.log}
//     show={show}
//     onClose={() => setShow(false)}
//     />
//     </>
    
//   );
// }

