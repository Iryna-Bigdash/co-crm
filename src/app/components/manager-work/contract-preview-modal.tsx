'use client';

import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { ContractPDF } from './contract-pdf';
import Modal from '../modal';

interface Contract {
  id: string;
  service: string;
  term: string;
  deposit: number;
  interactionPeriod: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ContractPreviewModalProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ContractPreviewModal: React.FC<ContractPreviewModalProps> = ({
  contract,
  isOpen,
  onClose,
}) => {
  if (!contract) return null;

  return (
    <Modal show={isOpen} onClose={onClose} title={`Перегляд контракту #${contract.id}`}>
    <div className="flex justify-between items-center mb-4">
      <button onClick={onClose} className="text-red-500 hover:underline">
        Закрити
      </button>
    </div>
  
    <div className="border rounded-md overflow-hidden h-[70vh]">
      <PDFViewer width="100%" height="100%">
        <ContractPDF contract={contract} />
      </PDFViewer>
    </div>
  </Modal>
  );
};
