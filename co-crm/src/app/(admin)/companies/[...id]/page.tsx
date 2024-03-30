'use client';
import React, { useEffect } from 'react';
import Header from '@/app/components/header';
import { notFound } from 'next/navigation';


export interface PageProps {
  params: { id: string[] };
}

export default function Page({ params }: PageProps) {

  useEffect(() => {
    
    params.id.forEach((idString) => {
      const id = Number.parseInt(idString);

      if (Number.isNaN(id)) {
        notFound();
        return;
      }
    });
  }, [params.id]);

  return (
    <>
      <Header>Companies {String(params.id)}</Header>
    </>
  );
}
