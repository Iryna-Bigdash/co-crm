'use client';

 import React from 'react';
 import Link from 'next/link';

 export interface NotFoundProps {}

 export default function NotFound({}: NotFoundProps) {
   return (
     <div className='p-16 flex flex-col justify-center items-center'>
       <p>Could not found the company</p>
       <Link href="/companies" className="text-blue-500 mt-4">
         Back to companies
       </Link>
     </div>
   );
 }