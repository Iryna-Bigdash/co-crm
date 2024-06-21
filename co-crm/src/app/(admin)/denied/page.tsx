// pages/denied.tsx
'use client';
import AccessNotification from '@/app/components/access-notofication';
import React from 'react';

export interface PageProps {}

export default function Page({}: PageProps) {
  return (
    <div className="py-6 px-10 w-4 h-4">
      <AccessNotification show={true} onClose={() => {}} />
    </div>
  );
}
