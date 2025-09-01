'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isToday } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createInteraction, type Interaction as ApiInteraction } from '@/lib/api';

type UIType   = 'call' | 'email' | 'meeting' | 'other';
type UIStatus = 'pending' | 'done' | 'canceled' | 'callback';

const schema = Yup.object({
  type:    Yup.string().oneOf(['call','email','meeting','other']).required('Оберіть тип'),
  status:  Yup.string().oneOf(['pending','done','canceled','callback']).required('Оберіть статус'),
  comment: Yup.string().trim().required('Коментар обовʼязковий'),
  nextCall:Yup.date().nullable().min(new Date(),'Не в минулому').required('Дата і час обовʼязкові'),
  amount:  Yup.number().min(0,'Має бути ≥ 0').nullable()
    .transform(v => (v === '' || isNaN(v) ? null : v)),
});

function toUpperEnum<T extends string>(v: T) { return v.toUpperCase() as Uppercase<T>; }
function toIso(v?: Date | string | null) {
  if (v == null) return null;
  if (v instanceof Date) return v.toISOString();
  return new Date(v).toISOString();
}

export default function InteractionForm({ companyId }: { companyId: string }) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: {
      type: UIType | ''; status: UIStatus | '';
      comment: string; nextCall: Date | null; amount: number | null;
    }) => {
      const payload: Omit<ApiInteraction,'id'|'companyId'|'createdAt'|'updatedAt'> = {
        type:     toUpperEnum(values.type as UIType) as ApiInteraction['type'],       // → CALL/EMAIL/...
        status:   toUpperEnum(values.status as UIStatus) as ApiInteraction['status'], // → PENDING/DONE/...
        date:     new Date().toISOString(),
        comment:  values.comment.trim(),
        nextCall: toIso(values.nextCall),
        amount:   values.amount,
      };
      return createInteraction(companyId, payload);
    },
    onSuccess: () => {
      toast.success('Запис додано');
      qc.invalidateQueries({ queryKey: ['interactions','company', companyId] });
      qc.invalidateQueries({ queryKey: ['company', companyId] });
    },
    onError: (e: any) => toast.error(e?.message || 'Не вдалося додати запис'),
  });

  const formik = useFormik({
    initialValues: {
      type: '' as UIType | '',
      status: '' as UIStatus | '',
      comment: '',
      nextCall: null as Date | null,
      amount: null as number | null,
    },
    validationSchema: schema,
    onSubmit: (vals) => mutation.mutate(vals),
  });

  const minDate = new Date();
  const minTime =
    formik.values.nextCall && isToday(formik.values.nextCall)
      ? new Date()
      : new Date(new Date().setHours(0, 0, 0, 0));
  const maxTime = new Date(new Date().setHours(23, 45, 0, 0));

  return (
    <form onSubmit={formik.handleSubmit} className="mb-8 p-4 border rounded-xl bg-white shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <div>
          <select
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border rounded-lg px-3 py-2 w-full"
          >
            <option value="">Тип звʼязку</option>
            <option value="call">Дзвінок</option>
            <option value="email">Email</option>
            <option value="meeting">Зустріч</option>
            <option value="other">Інше</option>
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
            className="border rounded-lg px-3 py-2 w-full"
          >
            <option value="">Статус</option>
            <option value="pending">В процесі</option>
            <option value="done">Завершено</option>
            <option value="canceled">Скасовано</option>
            <option value="callback">Передзвонити</option>
          </select>
          {formik.touched.status && formik.errors.status && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.status as string}</div>
          )}
        </div>

        <div className="sm:col-span-2">
          <DatePicker
            selected={formik.values.nextCall}
            onChange={(d) => formik.setFieldValue('nextCall', d)}
            onBlur={formik.handleBlur}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="Pp"
            placeholderText="Наступний звʼязок"
            className="w-full border rounded-lg px-3 py-2"
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
        className="w-full border rounded-lg px-3 py-2 mb-4"
      />
      {formik.touched.comment && formik.errors.comment && (
        <div className="text-red-500 text-sm mb-4">{formik.errors.comment as string}</div>
      )}

      <input
        type="number"
        name="amount"
        value={formik.values.amount ?? ''}
        onChange={(e) =>
          formik.setFieldValue('amount', e.target.value === '' ? null : Number(e.target.value))
        }
        onBlur={formik.handleBlur}
        className="border rounded-lg px-3 py-2 mb-4"
        placeholder="Сума (грн)"
        min={0}
      />

      <button
        type="submit"
        disabled={mutation.status === 'pending'}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        {mutation.status === 'pending' ? 'Додаємо…' : 'Додати запис'}
      </button>
    </form>
  );
}
