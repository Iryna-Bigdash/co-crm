'use client';

import React from 'react';
import Modal from './modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCompanyDescription } from '@/lib/api';
import { toast } from 'react-toastify';

interface Props {
  show: boolean;
  onClose: () => void;
  companyId: string;
  initialDescription: string;
  title: string;
}

const validationSchema = Yup.object({
  description: Yup.string()
    .required('Description is required')
    .min(5, 'Too short – at least 5 characters'),
});

export default function UpdateDescriptionModal({
  show,
  onClose,
  companyId,
  title,
  initialDescription,
}: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, description }: { id: string; description: string }) =>
      updateCompanyDescription(id, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company', companyId] });
      toast.success('Description updated');
      onClose();
    },
    onError: () => {
      toast.error('Update failed');
    },
  });

  return (
    <Modal show={show} onClose={onClose} title="Update Company Description">
      <div className="max-w-xl w-full bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 mt-3">
        <Formik
          initialValues={{ description: initialDescription }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            mutation.mutate(
              { id: companyId, description: values.description},
              {
                onSettled: () => setSubmitting(false),
              }
            );
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="description"
                  className="block text-m font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Enter New Description for {title}
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="Enter updated company description"
                  className="w-full px-4 py-3 text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 dark:focus:border-blue-500 transition placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}
