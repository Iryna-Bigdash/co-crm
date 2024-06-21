// components/access-notification.tsx
'use client';

import React from 'react';
import Modal, { ModalProps } from '@/app/components/modal';
import Link from 'next/link';


export interface AccessNotificationProps extends ModalProps {}

export default function AccessNotification({
  onClose,
  ...rest
}: AccessNotificationProps) {
  return (
    <Modal {...rest} onClose={onClose}>
    <div className='flex flex-col gap-6 text-center'>
      <h2 className='text-3xl text-pink-700'>Insufficient permissions</h2>
      <p className='text-xl'>You do not have the required access level to view this page.</p>
      <Link href='/dashboard' className='outline-none underline text-2xl border-none p-2 text-gray-900'>Back</Link>
      </div>
    </Modal>
  );
}
