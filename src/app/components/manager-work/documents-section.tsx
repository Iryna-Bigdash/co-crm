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
      <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
        {loading ? (
          <p className="text-sm text-gray-500">Завантаження компанії...</p>
        ) : companyTitle ? (
          <DocumentUploadForm
            companyId={companyId}
            companyTitle={companyTitle}
            onUploadSuccess={handleUploadSuccess}
          />
        ) : (
          <p className="text-sm text-red-500">Не вдалося отримати компанію</p>
        )}
      </div>

      <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="text-blue-600" size={20} />
          <h2 className="text-lg font-semibold">Документи компанії</h2>
        </div>
        <DocumentsList companyId={companyId} />
      </div>
    </div>
  );
}
