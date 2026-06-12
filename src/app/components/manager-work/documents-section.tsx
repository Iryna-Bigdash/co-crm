'use client';

import { useQueryClient } from '@tanstack/react-query';
import { getCompany } from '@/lib/api';
import { useEffect, useState } from 'react';
import { DocumentsList } from './documents-list';
import { DocumentUploadForm } from './documents-upload';
import { FileText } from 'lucide-react';

interface DocumentsSectionProps {
  companyId: string;
}

export function DocumentsSection({ companyId }: DocumentsSectionProps) {
  const [companyTitle, setCompanyTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    async function fetchCompany() {
      try {
        const company = await getCompany(companyId);
        setCompanyTitle(company.title);
      } catch (err) {
        console.error('Помилка при отриманні компанії:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, [companyId]);

  const handleUploadSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['company-documents', companyId] });
  };

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800 shadow-sm">
        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Завантаження компанії...</p>
        ) : companyTitle ? (
          <DocumentUploadForm
            companyId={companyId}
            companyTitle={companyTitle}
            onUploadSuccess={handleUploadSuccess}
          />
        ) : (
          <p className="text-sm text-red-500 dark:text-red-400">Не вдалося отримати компанію</p>
        )}
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="text-blue-600 dark:text-blue-400" size={20} />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Документи компанії</h2>
        </div>
        <DocumentsList companyId={companyId} />
      </div>
    </div>
  );
}
