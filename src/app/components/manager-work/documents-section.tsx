'use client';
import { FileText } from 'lucide-react';

interface DocumentsProps {
  companyId: string;
}

export function DocumentsSection({ companyId }: DocumentsProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-4">
      <FileText className="text-blue-600" size={20} />
      <h2 className="text-lg font-semibold text-gray-800">
        Документи компанії <span className="text-blue-700">#{companyId}</span>
      </h2>
    </div>
  
    {/* Тут може бути вивід списку документів або кнопка для додавання */}
    <p className="text-sm text-gray-600">
      Тут будуть відображені всі повʼязані документи компанії.
    </p>
  </div>
  );
}

