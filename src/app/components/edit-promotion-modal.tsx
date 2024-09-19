'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import Modal, { ModalProps } from '@/app/components/modal';
import { getPromotion, updatePromotion } from '@/lib/api';
import { toast } from 'react-toastify';
import InputField from './input-field';
import Button from './button';

export type PromotionEditFieldValues = {
  title: string;
  description: string;
  discount: number;
};

interface EditPromotionModalProps extends ModalProps {
  promotionId: string;
  onSubmit?: (values: PromotionEditFieldValues) => void | Promise<void>;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  discount: Yup.number().min(0, 'Discount must be at least 0').required('Discount is required'),
});

export default function EditPromotionModal({
  promotionId,
  onSubmit,
  onClose,
  show,
  ...rest
}: EditPromotionModalProps) {
  const queryClient = useQueryClient();

  const { data: promotion, isLoading, error } = useQuery({
    queryKey: ['promotion', promotionId],
    queryFn: () => getPromotion(promotionId),
    staleTime: 10 * 1000,
    enabled: Boolean(promotionId),
  });

  const mutation = useMutation({
    mutationFn: (data: PromotionEditFieldValues) =>
      updatePromotion(promotionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['promotions'],
      });
      toast.success('Promotion successfully updated!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      onClose();
    },
    onError: (error: any) => {
      console.error('Failed to update promotion:', error);
      toast.error('Failed to update promotion!');
    },
  });

  const handleSubmit = async (values: PromotionEditFieldValues) => {
    try {
      await mutation.mutateAsync(values);
      if (onSubmit) {
        onSubmit(values);
      }
    } catch (error) {
      console.error('Failed to create promotion:', error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading promotion data.</p>;

  return (
    <Modal show={show} onClose={onClose} {...rest}>
      <Formik
        initialValues={promotion || { title: '', description: '', discount: 0 }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="flex flex-col gap-10">
            <p className="mb-0.5 text-xl">Edit Promotion</p>
            <div className="flex flex-col gap-5">
              <InputField
                required
                label="Title"
                placeholder="Title"
                name="title"
                error={touched.title && errors.title ? errors.title : undefined}
              />
              <InputField
                required
                label="Description"
                name="description"
                placeholder="Description"
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
            </div>
            <Button type="submit" disabled={mutation.status === 'pending'}>
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
