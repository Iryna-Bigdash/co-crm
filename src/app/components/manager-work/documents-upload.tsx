'use client';

import { uploadDocuments } from '@/lib/api';
import { useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

interface DocumentUploadFormProps {
  companyId: string;
  companyTitle: string;
  onUploadSuccess?: () => void;
}

export function DocumentUploadForm({
  companyId,
  companyTitle,
  onUploadSuccess,
}: DocumentUploadFormProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);


  const formik = useFormik<{
    file: File | null;
    documentName: string;
  }>({
    initialValues: {
      file: null,
      documentName: '',
    },
    validationSchema: Yup.object({
      file: Yup.mixed<File>()
        .required('Будь ласка, виберіть файл')
        .test(
          'fileSize',
          'Файл завеликий. Максимум 5MB',
          (value) => !(value instanceof File) || value.size <= 5 * 1024 * 1024
        )
        .test(
          'fileType',
          'Непідтримуваний тип файлу',
          (value) =>
            !(value instanceof File) ||
            ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(value.type)
        ),
      documentName: Yup.string().max(50, 'Максимум 50 символів'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setUploading(true);
      try {
        const path = await uploadDocuments(
          values.file as File,
          companyId,
          companyTitle,
          values.documentName
        );
        setUploadedPath(path);
        toast.success('📄 Документ успішно завантажено');
        resetForm();
        if (fileInputRef.current) fileInputRef.current.value = '';
        onUploadSuccess?.();
      } catch (err: any) {
        toast.error(err.message || '❌ Помилка завантаження файлу');
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Оберіть документ (PDF, JPG, PNG, WEBP)
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept=".pdf,image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0] || null;
            formik.setFieldValue('file', file);
            setUploadedPath(null);
          }}
          disabled={uploading}
          ref={fileInputRef}
          className="mt-1 block w-full border px-2 py-1 rounded"
        />
        {formik.touched.file && formik.errors.file && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.file}</div>
        )}
      </div>

      <div>
        <label htmlFor="documentName" className="block text-sm font-medium text-gray-700">
          Назва документа (необов’язково)
        </label>
        <input
          id="documentName"
          name="documentName"
          type="text"
          placeholder="Наприклад: Passport"
          onChange={formik.handleChange}
          value={formik.values.documentName}
          className="mt-1 block w-full border px-2 py-1 rounded"
        />
        {formik.touched.documentName && formik.errors.documentName && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.documentName}</div>
        )}
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        disabled={uploading}
      >
        {uploading ? 'Завантаження...' : 'Завантажити документ'}
      </button>


      {uploadedPath && (
        <div className="text-green-600 mt-2 text-sm">
          ✅ Завантажено: <a href={uploadedPath} target="_blank" rel="noreferrer">{uploadedPath}</a>
        </div>
      )}
    </form>
  );
}
