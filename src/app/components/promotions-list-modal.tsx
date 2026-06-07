'use client';

import React from 'react';
import Modal from './modal';
import PromotionsList from './promotions-list';

export interface PromotionsListModalProps {
  show: boolean;
  onClose: () => void;
}

export default function PromotionsListModal({
  show,
  onClose,
}: PromotionsListModalProps) {
  return (
    <Modal show={show} onClose={onClose} title="All promotions">
      <div className="mt-5 max-h-[60vh] overflow-y-auto">
        <PromotionsList enabled={show} />
      </div>
    </Modal>
  );
}
