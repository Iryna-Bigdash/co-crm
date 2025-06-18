'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '../button';
import Modal from '../modal';

interface Contract {
  id: string;
  service: string;
  term: string;
  deposit: number;
  interactionPeriod: string;
}

interface AddContractModalProps {
  onAdd: (contract: Contract) => void;
}

const validationSchema = Yup.object({
  service: Yup.string().required('Послуга є обовʼязковою'),
  term: Yup.string().required('Вкажіть термін'),
  deposit: Yup.number().min(0).required('Вкажіть залогову суму'),
  interactionPeriod: Yup.string().required('Вкажіть термін взаємодії'),
});

export function AddContractModal({ onAdd }: AddContractModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setOpen(true)}>Додати контракт</Button>

        <Modal show={open} onClose={() => setOpen(false)} title="Новий контракт">
          <Formik
            initialValues={{
              service: '',
              term: '',
              deposit: '',
              interactionPeriod: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              const newContract: Contract = {
                id: `contract-${Date.now()}`,
                service: values.service,
                term: values.term,
                deposit: Number(values.deposit),
                interactionPeriod: values.interactionPeriod,
              };
              onAdd(newContract);
              resetForm();
              setOpen(false);
            }}
          >
            {() => (
              <Form className="space-y-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Послуга</label>
                  <Field name="service" className="w-full border rounded-md p-2" />
                  <ErrorMessage name="service" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Термін</label>
                  <Field name="term" className="w-full border rounded-md p-2" />
                  <ErrorMessage name="term" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Залогова сума</label>
                  <Field name="deposit" type="number" className="w-full border rounded-md p-2" />
                  <ErrorMessage name="deposit" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Термін взаємодії</label>
                  <Field name="interactionPeriod" className="w-full border rounded-md p-2" />
                  <ErrorMessage name="interactionPeriod" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" onClick={() => setOpen(false)}>
                    Скасувати
                  </Button>
                  <Button type="submit">Зберегти</Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
      </div>
    </>
  );
}
