'use client';

import React from 'react';
import Modal from './modal';
import ActiveCompaniesList from './active-companies-list';

export interface ActiveCompaniesListModalProps {
  show: boolean;
  onClose: () => void;
}

export default function ActiveCompaniesListModal({
  show,
  onClose,
}: ActiveCompaniesListModalProps) {
  return (
    <Modal show={show} onClose={onClose} title="Active companies">
      <div className="mt-5 max-h-[60vh] overflow-y-auto">
        <ActiveCompaniesList enabled={show} />
      </div>
    </Modal>
  );
}
