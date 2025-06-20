'use client';
import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { getCompany } from '@/lib/api';
import { DocumentsList } from './documents-list';
import { DocumentUploadForm } from './documents-upload';

interface DocumentsProps {
  companyId: string;
}

export function DocumentsSection({ companyId }: DocumentsProps) {
  const [companyTitle, setCompanyTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompany() {
      try {
        const company = await getCompany(companyId);
        setCompanyTitle(company.title);
      } catch (error) {
        console.error('Помилка при отриманні компанії:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, [companyId]);

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="text-blue-600" size={20} />
        <h2 className="text-lg font-semibold text-gray-800">
          Документи компанії <span className="text-blue-700">#{companyId}</span>
        </h2>
      </div>

      <DocumentsList companyId={companyId} />
      companyTitle
      {loading ? (
        <p className="text-sm text-gray-500">Завантаження компанії...</p>
      ) : companyTitle ? (
        <DocumentUploadForm companyTitle={companyTitle} companyId={companyId} />
      ) : (
        <p className="text-sm text-red-500">Не вдалося отримати компанію</p>
      )}
    </div>
  );
}
