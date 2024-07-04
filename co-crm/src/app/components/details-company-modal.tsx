'use client';

import React from 'react';
import Modal, { ModalProps } from '@/app/components/modal';
import DelateCompanyButton from './company-delate-button';

export interface DetailsCompanyModal extends ModalProps {
  companyId: string;
}

export default function DetailsCompanyModal({
  companyId,
  onClose,
  ...rest
}: DetailsCompanyModal) {
  return (
    <Modal {...rest} onClose={onClose}>
        <h1 className='text-2xl font-bold text-center'>Company settings</h1>
      <DelateCompanyButton companyId={companyId} />
    </Modal>
  );
}