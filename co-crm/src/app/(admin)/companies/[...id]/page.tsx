'use client';
import React, { useEffect } from 'react';
import Header from '@/app/components/header';
import { notFound } from 'next/navigation';

export interface PageProps {
  params: { id: string | string[] };
}

export default function Page({ params }: PageProps) {

  useEffect(() => {

    if (Array.isArray(params.id)) {

      params.id.forEach((idString) => {
        const id = Number.parseInt(idString);

        if (Number.isNaN(id)) {
          notFound();
          return;
        }
      });
    } else {
      const id = Number.parseInt(params.id as string);
      if (Number.isNaN(id)) {
        notFound();
        return;
      }
    }
  }, [params.id]);

  return (
    <>
      <Header>Companies {params.id ? (Array.isArray(params.id) ? params.id.join(', ') : params.id) : 'undefined'}</Header>
    </>
  );
}
