import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Для PDF генерації можна використати jspdf або pdfmake, тут просто базовий варіант через iframe

interface Contract {
  id: string;
  service: string;
  term: string;
  deposit: number;
  interactionPeriod: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ContractModalProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (contract: Contract) => void;
}

export function ContractModal({ contract, isOpen, onClose, onSave }: ContractModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: contract || {
      id: '',
      service: '',
      term: '',
      deposit: 0,
      interactionPeriod: '',
    },
    validationSchema: Yup.object({
      service: Yup.string().required('Обов’язково'),
      term: Yup.string().required('Обов’язково'),
      deposit: Yup.number().min(0).required('Обов’язково'),
      interactionPeriod: Yup.string().required('Обов’язково'),
    }),
    onSubmit: (values) => {
      onSave(values);
      onClose();
    },
  });

  // Функція для генерації PDF в data-uri (тут простий HTML-прев’ю)
  const generatePdfPreview = () => {
    if (!formik.values) return '';
    return `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Контракт #${formik.values.id}</h2>
          <p><strong>Послуга:</strong> ${formik.values.service}</p>
          <p><strong>Термін:</strong> ${formik.values.term}</p>
          <p><strong>Залогова сума:</strong> ${formik.values.deposit} грн</p>
          <p><strong>Термін взаємодії:</strong> ${formik.values.interactionPeriod}</p>
        </body>
      </html>
    `;
  };

  const handlePrint = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.focus();
      iframeRef.current.contentWindow?.print();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-auto p-6">
        <h3 className="text-xl font-semibold mb-4">Редагувати контракт</h3>
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Послуга</label>
            <input
              name="service"
              value={formik.values.service}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border rounded p-2 w-full"
            />
            {formik.touched.service && formik.errors.service && (
              <div className="text-red-500 text-sm">{formik.errors.service}</div>
            )}
          </div>

          <div>
            <label className="block font-medium">Термін</label>
            <input
              name="term"
              value={formik.values.term}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border rounded p-2 w-full"
            />
            {formik.touched.term && formik.errors.term && (
              <div className="text-red-500 text-sm">{formik.errors.term}</div>
            )}
          </div>

          <div>
            <label className="block font-medium">Залогова сума (грн)</label>
            <input
              type="number"
              name="deposit"
              value={formik.values.deposit}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border rounded p-2 w-full"
            />
            {formik.touched.deposit && formik.errors.deposit && (
              <div className="text-red-500 text-sm">{formik.errors.deposit}</div>
            )}
          </div>

          <div>
            <label className="block font-medium">Термін взаємодії</label>
            <input
              name="interactionPeriod"
              value={formik.values.interactionPeriod}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border rounded p-2 w-full"
            />
            {formik.touched.interactionPeriod && formik.errors.interactionPeriod && (
              <div className="text-red-500 text-sm">{formik.errors.interactionPeriod}</div>
            )}
          </div>

          <div className="col-span-2 mt-4 flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Зберегти
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Друкувати
            </button>
            <button
              type="button"
              onClick={() => alert('Відправлено на email!')}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Надіслати
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-600 text-white px-4 py-2 rounded ml-auto"
            >
              Закрити
            </button>
          </div>
        </form>

        <div className="mt-6">
          <h4 className="font-semibold mb-2">Прев’ю PDF</h4>
          <iframe
            ref={iframeRef}
            title="PDF Preview"
            srcDoc={generatePdfPreview()}
            style={{ width: '100%', height: '300px', border: '1px solid #ccc' }}
          />
        </div>
      </div>
    </div>
  );
}
