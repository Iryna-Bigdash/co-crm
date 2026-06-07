'use client';

import React from 'react';
import Modal from './modal';
import CategoriesList from './categories-list';

export interface CategoriesListModalProps {
  show: boolean;
  onClose: () => void;
}

export default function CategoriesListModal({
  show,
  onClose,
}: CategoriesListModalProps) {
  return (
    <Modal show={show} onClose={onClose} title="All categories">
      <div className="mt-5 max-h-[60vh] overflow-y-auto">
        <CategoriesList enabled={show} />
      </div>
    </Modal>
  );
}
