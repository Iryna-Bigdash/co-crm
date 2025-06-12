'use client';

import React from 'react';
import Modal, { ModalProps } from '@/app/components/modal';
import DelateCompanyButton from './company-delate-button';
import UpdateDescriptionButton from './update-description-button';
import CompanyDetailsInfo from './company-details-info';

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
        <div className='flex flex-col gap-3 items-start'>
        <div className="flex flex-col gap-4 p-4 w-full items-start">
      <CompanyDetailsInfo companyId={companyId}/>
      {/* <DelateCompanyButton companyId={companyId}/> */}
    </div>
      </div>
    </Modal>
  );
}