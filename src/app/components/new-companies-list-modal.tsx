'use client';

import React from 'react';
import Modal from './modal';
import NewCompaniesList from './new-companies-list';

export interface NewCompaniesListModalProps {
  show: boolean;
  onClose: () => void;
}

export default function NewCompaniesListModal({
  show,
  onClose,
}: NewCompaniesListModalProps) {
  return (
    <Modal show={show} onClose={onClose} title="New companies for the last month">
      <div className="mt-5 max-h-[60vh] overflow-y-auto">
        <NewCompaniesList enabled={show} />
      </div>
    </Modal>
  );
}
