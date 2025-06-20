import { uploadDocuments } from '@/lib/api';
import React, { useState } from 'react';

interface DocumentUploadFormProps {
  companyId: string;
  companyTitle: string;
}

export function DocumentUploadForm({ companyId, companyTitle }: DocumentUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [documentNumber, setDocumentNumber] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
      setUploadedPath(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Будь ласка, виберіть файл');
      return;
    }

    try {
      setUploading(true);
      const path = await uploadDocuments(file, companyTitle, documentNumber);
      setUploadedPath(path);
    } catch (err: any) {
      setError(err.message || 'Помилка завантаження файлу');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf,image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={uploading}
      />

      <input
        type="text"
        placeholder="Номер документа (необов’язково)"
        value={documentNumber}
        onChange={(e) => setDocumentNumber(e.target.value)}
        className="mt-2 block border px-2 py-1 rounded"
      />

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        disabled={uploading}
        onClick={handleUpload}
      >
        {uploading ? 'Завантаження...' : 'Завантажити документ'}
      </button>

      {uploadedPath && (
        <div className="mt-4 text-green-600">
          Файл завантажено! Шлях: <a href={uploadedPath} target="_blank" rel="noreferrer">{uploadedPath}</a>
        </div>
      )}

      {error && <div className="mt-4 text-red-600">Помилка: {error}</div>}
    </div>
  );
}
