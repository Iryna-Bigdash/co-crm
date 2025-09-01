'use client';

import React from 'react';
import { PencilLine, EyeIcon, PrinterIcon } from 'lucide-react';

interface Contract {
  id: string;
  service: string;
  term: string;
  deposit: number;
  interactionPeriod: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ContractCardProps {
  contract: Contract;
  onEdit: (contract: Contract) => void;
  onPreview: (contract: Contract) => void;
  onPrint: (contract: Contract) => void;
}

export const ContractCard: React.FC<ContractCardProps> = ({
  contract,
  onEdit,
  onPreview,
  onPrint,
}) => {
  const formatDate = (date?: Date) =>
    date ? date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

  return (
    <li className="border p-4 rounded-lg hover:bg-gray-50 transition flex items-center justify-between">
    {/* Лівий блок з текстом */}
    <div>
      <p className="font-medium text-gray-800">Послуга: {contract.service}</p>
      <p className="text-sm text-gray-600">Термін: {contract.term}</p>
      <p className="text-sm text-gray-600">Залогова сума: {contract.deposit} грн</p>
      <p className="text-sm text-gray-600">Термін взаємодії: {contract.interactionPeriod}</p>
      <p className="text-xs text-gray-500 mt-2">
        Створено: {formatDate(contract.createdAt)} | Оновлено: {formatDate(contract.updatedAt)}
      </p>
    </div>
  
    {/* Правий блок з іконками */}
    <div className="flex items-end gap-2 ml-4">
      <button onClick={() => onEdit(contract)} title="Редагувати">
        <PencilLine className="w-6 h-6 text-blue-600 hover:text-blue-800" />
      </button>
      <button onClick={() => onPreview(contract)} title="Перегляд PDF">
        <EyeIcon className="w-6 h-6 text-blue-600 hover:text-blue-800" />
      </button>
      <button onClick={() => onPrint(contract)} title="Друк">
        <PrinterIcon className="w-6 h-6 text-blue-600 hover:text-blue-800" />
      </button>
    </div>
  </li>
  
  );
};
