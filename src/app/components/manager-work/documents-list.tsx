'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDocument, getCompanyDocuments } from '@/lib/api';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import Button from '../button';

interface DocumentsListProps {
  companyId: string;
}

interface DocumentItem {
  filename: string;
  url: string;
}

export function DocumentsList({ companyId }: DocumentsListProps) {
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState<string | null>(null);

  const {
    data: documents,
    isLoading,
    isError,
  } = useQuery<DocumentItem[]>({
    queryKey: ['company-documents', companyId],
    queryFn: () => getCompanyDocuments(companyId),
  });

  const { mutate: removeDoc } = useMutation({
    mutationFn: deleteDocument,
    onMutate: (filename) => setDeleting(filename),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-documents', companyId] });
    },
    onSettled: () => setDeleting(null),
    onError: () => {
      alert('Помилка при видаленні документа');
    },
  });

  if (isLoading)
    return <p className="text-sm text-gray-500">Завантаження документів...</p>;

  if (isError)
    return <p className="text-sm text-red-500">Не вдалося отримати документи</p>;

  if (!documents || documents.length === 0)
    return <p className="text-sm text-gray-400">Документи відсутні</p>;

  return (
    <>
      <ul className="space-y-3 mb-6">
        {documents.map((doc) => (
          <li
            key={doc.filename}
            className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg border"
          >
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {doc.filename}
            </a>
            <Button
              onClick={() => removeDoc(doc.filename)}
              disabled={deleting === doc.filename}
              title="Видалити документ"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
}
