'use client';

import React, { useState } from 'react';
import { ContractModal } from './contract-preview';
import { AddContractModal } from './contract-add';

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
      service: 'Оренда обладнання',
      term: '01.07.2025 - 01.10.2025',
      deposit: 3000,
      interactionPeriod: '3 місяці',
      createdAt: new Date('2025-05-01T10:00:00'),
      updatedAt: new Date('2025-05-10T15:30:00'),
    },
    {
      id: 'c2',
      service: 'Консультаційні послуги',
      term: '15.06.2025 - 15.09.2025',
      deposit: 1500,
      interactionPeriod: '3 місяці',
      createdAt: new Date('2025-05-05T09:15:00'),
      updatedAt: new Date('2025-05-12T12:00:00'),
    },
  ]);

  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

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

  const formatDate = (date?: Date) =>
    date ? date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

  return (
    <>
      <div className="p-6">
        <button
          onClick={() => setAddModalOpen(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Додати контракт
        </button>
        <AddContractModal onAdd={handleAddContract} />
      </div>

      <ContractModal
        contract={editingContract}
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingContract(null);
        }}
        onSave={handleSaveContract}
      />

      <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Контракти компанії <span className="text-blue-700">#{companyId}</span>
        </h2>

        {contracts.length === 0 ? (
          <p className="text-sm text-gray-600">Контракти ще не додано.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {contracts.map(contract => (
                <li
                  key={contract.id}
                  onClick={() => handleContractClick(contract)}
                  className="cursor-pointer border p-4 rounded-lg hover:bg-gray-50 transition"
                >
                  <p className="font-medium text-gray-800">Послуга: {contract.service}</p>
                  <p className="text-sm text-gray-600">Термін: {contract.term}</p>
                  <p className="text-sm text-gray-600">Залогова сума: {contract.deposit} грн</p>
                  <p className="text-sm text-gray-600">Термін взаємодії: {contract.interactionPeriod}</p>
                  <p className="text-xs text-gray-500 mt-4">
                    Створено: {formatDate(contract.createdAt)} | Оновлено: {formatDate(contract.updatedAt)}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
