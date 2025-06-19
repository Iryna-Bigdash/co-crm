'use client';

import React, { useState } from 'react';
import { ContractEditModal } from './contract-edit-modal';
import { AddContractModal } from './contract-add';
import { ContractPreviewModal } from './contract-preview-modal';
import { ContractCard } from './contact-card';

interface ContractsProps {
  companyId: string;
}

interface Contract {
  id: string;
  service: string;
  term: string;
  deposit: number;
  interactionPeriod: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export function ContractsSection({ companyId }: ContractsProps) {
  const [contracts, setContracts] = useState<Contract[]>([
      {
        id: 'c1',
        service: 'Equipment Rental',
        term: '01.07.2025 - 01.10.2025',
        deposit: 3000,
        interactionPeriod: '3 months',
        createdAt: new Date('2025-05-01T10:00:00'),
        updatedAt: new Date('2025-05-10T15:30:00'),
      },
      {
        id: 'c2',
        service: 'Consulting Services',
        term: '15.06.2025 - 15.09.2025',
        deposit: 1500,
        interactionPeriod: '3 months',
        createdAt: new Date('2025-05-05T09:15:00'),
        updatedAt: new Date('2025-05-12T12:00:00'),
      },
      {
        id: 'c3',
        service: 'Оренда обладнання',
        term: '01.07.2025 - 01.10.2025',
        deposit: 3000,
        interactionPeriod: '3 місяці',
        createdAt: new Date('2025-05-01T10:00:00'),
        updatedAt: new Date('2025-05-10T15:30:00'),
      },
      {
        id: 'c4',
        service: 'Консультаційні послуги',
        term: '15.06.2025 - 15.09.2025',
        deposit: 1500,
        interactionPeriod: '3 місяці',
        createdAt: new Date('2025-05-05T09:15:00'),
        updatedAt: new Date('2025-05-12T12:00:00'),
      },
    ])
    

  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [previewContract, setPreviewContract] = useState<Contract | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);

  const handleContractClick = (contract: Contract) => {
    setEditingContract(contract);
    setModalOpen(true);
  };

  const handleSaveContract = (updatedContract: Contract) => {
    const updatedWithDate = {
      ...updatedContract,
      updatedAt: new Date(),
    };
    setContracts(prev =>
      prev.map(c => (c.id === updatedWithDate.id ? updatedWithDate : c))
    );
    setModalOpen(false);
    setEditingContract(null);
  };

  const handleAddContract = (contract: Omit<Contract, 'createdAt' | 'updatedAt' | 'id'>) => {
    const newContract: Contract = {
      ...contract,
      id: `c${contracts.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setContracts(prev => [...prev, newContract]);
    setAddModalOpen(false);
  };

  const handlePreviewClick = (contract: Contract) => {
    setPreviewContract(contract);
    setPreviewOpen(true);
  };

  return (
    <>
      <div className="p-6">
        <AddContractModal onAdd={handleAddContract} />
      </div>

      <ContractEditModal
        contract={editingContract}
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingContract(null);
        }}
        onSave={handleSaveContract}
      />

      <ContractPreviewModal
        contract={previewContract}
        isOpen={isPreviewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setPreviewContract(null);
        }}
      />

      <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Контракти компанії <span className="text-blue-700">#{companyId}</span>
        </h2>

        {contracts.length === 0 ? (
          <p className="text-sm text-gray-600">Контракти ще не додано.</p>
        ) : (
          <ul className="space-y-4">
            {contracts.map(contract => (
              <ContractCard
                key={contract.id}
                contract={contract}
                onEdit={handleContractClick}
                onPreview={handlePreviewClick}
                onPrint={(c) => {
                  setPreviewContract(c);
                  setPreviewOpen(true);
                  setTimeout(() => window.print(), 600);
                }}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
