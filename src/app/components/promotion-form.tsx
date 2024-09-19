'use client';

import React from 'react';
import { Form, Formik } from 'formik';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';
import { createPromotion, getCompany } from '@/lib/api';
import Button from '@/app/components/button';
import InputField from '@/app/components/input-field';
import LogoUploader from '@/app/components/logo-uploader';
import { toast } from 'react-toastify';

export type PromotionFieldValues = {
  companyId: string;
  title: string;
  description: string;
  discount: number;
  companyTitle?: string;
};

const initialValues: PromotionFieldValues = {
  companyId: '',
  title: '',
  description: '',
  companyTitle: '',
  discount: 0,
};

export interface PromotionFormProps {
  companyId: string;
  onSubmit?: (values: PromotionFieldValues) => void | Promise<void>;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required!'),
  description: Yup.string().required('Description is required!'),
  discount: Yup.number()
    .required('Discount is required!')
    .min(0, 'Only positive values from 0 to 100')
    .max(100)
});

export default function PromotionForm({
  companyId,
  onSubmit,
}: PromotionFormProps) {
  const queryClient = useQueryClient();

  const { data: company } = useQuery({
    queryKey: ['companies', companyId],
    queryFn: () => getCompany(companyId),
    staleTime: 10 * 1000,
    enabled: Boolean(companyId),
  });

  const mutation = useMutation({
    mutationFn: (data: Omit<PromotionFieldValues, 'id'>) =>
      createPromotion(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['promotions', 'company', companyId]
      })
      toast.success('Promotion successfully added!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
    onError: (error: any) => {
      console.error('Failed to create promotion:', error);
      toast.error('Failed to add the promotion!');
    },
  });

  const handleSubmit = async (values: PromotionFieldValues) => {
    if (!company) {
      return;
    }

    try {
      await mutation.mutateAsync({
        ...values,
        discount: Number(values.discount),
        companyId: company.id,
      });

      if (onSubmit) {
        onSubmit(values);
      }
    } catch (error) {
      console.error('Failed to create promotion:', error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="flex flex-col gap-10">
          <p className="mb-0.5 text-xl">Add New Promotion</p>
          <div className="flex flex-col gap-5">
            <InputField
              required
              label="Title"
              placeholder="Title"
              name="title"
            />
            <InputField
              required
              label="Description"
              placeholder="Description"
              name="description"
              error={touched.description && errors.description ? errors.description : undefined}
            />
            <InputField
              required
              type="number"
              label="Discount"
              placeholder="Discount"
              name="discount"
              error={touched.discount && errors.discount ? errors.discount : undefined}
            />
            <LogoUploader square label="Image" placeholder="Upload image" />
          </div>
          <Button type="submit" disabled={mutation.status === 'pending'}>
            Add Promotion
          </Button>
        </Form>
      )}
    </Formik>
  );
}
