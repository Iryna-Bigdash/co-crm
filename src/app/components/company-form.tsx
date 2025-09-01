'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isToday } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createInteraction } from '@/lib/api';
import type { Interaction } from '@/lib/api';
import Button from './button';

type InteractionType = Interaction['type'];     
type InteractionStatus = Interaction['status'];   

const TYPE_LABELS: Record<InteractionType, string> = {
  CALL: 'Дзвінок',
  EMAIL: 'Email',
  MEETING: 'Зустріч',
  OTHER: 'Інше',
};

const STATUS_LABELS: Record<InteractionStatus, string> = {
  PENDING: 'В процесі',
  DONE: 'Завершено',
  CANCELED: 'Скасовано',
};

const validationSchema = Yup.object({
  type: Yup.mixed<InteractionType>()
    .oneOf(Object.keys(TYPE_LABELS) as InteractionType[])
    .required('Оберіть тип звʼязку'),
  status: Yup.mixed<InteractionStatus>()
    .oneOf(Object.keys(STATUS_LABELS) as InteractionStatus[])
    .required('Оберіть статус'),
  comment: Yup.string().trim().required('Коментар обовʼязковий'),
  nextCall: Yup.date()
    .nullable()
    .min(new Date(), 'Дата і час не можуть бути в минулому')
    .required('Дата і час обовʼязкові'),
  amount: Yup.number().min(0, 'Сума має бути невідʼємною').nullable(),
});

type FormValues = {
  type: '' | InteractionType;
  status: '' | InteractionStatus;
  comment: string;
  nextCall: Date | null;
  amount: number | null;
};

function toIso(v: Date | null) {
  return v ? v.toISOString() : null;
}

export default function InteractionForm({ companyId }: { companyId: string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        type: values.type as InteractionType,
        status: values.status as InteractionStatus,
        date: new Date().toISOString(),      // час створення interaction
        comment: values.comment.trim(),
        nextCall: toIso(values.nextCall),     // або null
        amount: values.amount,                // може бути null
      };
      return createInteraction(companyId, payload);
    },
    onSuccess: () => {
      toast.success('Запис додано');
      queryClient.invalidateQueries({ queryKey: ['interactions', 'company', companyId] });
      formik.resetForm();
    },
    onError: (e: any) => {
      console.error(e);
      toast.error(e?.message || 'Не вдалося додати запис');
    },
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      type: '',
      status: '',
      comment: '',
      nextCall: null,
      amount: null,
    },
    validationSchema,
    onSubmit: (vals) => mutation.mutate(vals),
  });

  const minDate = new Date();
  const minTime =
    formik.values.nextCall && isToday(formik.values.nextCall)
      ? new Date()
      : new Date(new Date().setHours(0, 0, 0, 0));
  const maxTime = new Date(new Date().setHours(23, 45, 0, 0));

  return (
    <form onSubmit={formik.handleSubmit} className="mb-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <div>
          <select
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          >
            <option value="">Тип звʼязку</option>
            {(Object.keys(TYPE_LABELS) as InteractionType[]).map((t) => (
              <option key={t} value={t}>
                {TYPE_LABELS[t]}
              </option>
            ))}
          </select>
          {formik.touched.type && formik.errors.type && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.type as string}</div>
          )}
        </div>

        <div>
          <select
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          >
            <option value="">Статус</option>
            {(Object.keys(STATUS_LABELS) as InteractionStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          {formik.touched.status && formik.errors.status && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.status as string}</div>
          )}
        </div>

        <div className="sm:col-span-2">
          <DatePicker
            selected={formik.values.nextCall}
            onChange={(date) => formik.setFieldValue('nextCall', date)}
            onBlur={formik.handleBlur}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="Pp"
            placeholderText="Наступний звʼязок"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            name="nextCall"
            minDate={minDate}
            minTime={minTime}
            maxTime={maxTime}
          />
          {formik.touched.nextCall && formik.errors.nextCall && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.nextCall as string}</div>
          )}
        </div>
      </div>

      <textarea
        name="comment"
        value={formik.values.comment}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        rows={3}
        placeholder="Коментар менеджера..."
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
      />
      {formik.touched.comment && formik.errors.comment && (
        <div className="text-red-500 text-sm mb-4">{formik.errors.comment as string}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          type="number"
          name="amount"
          value={formik.values.amount ?? ''}
          onChange={(e) =>
            formik.setFieldValue('amount', e.target.value === '' ? null : Number(e.target.value))
          }
          onBlur={formik.handleBlur}
          className="border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Сума ($)"
          min={0}
        />
      </div>

      <Button type="submit" disabled={mutation.status === 'pending'}>
        {mutation.status === 'pending' ? 'Додаємо…' : 'Додати запис'}
      </Button>
    </form>
  );
}
