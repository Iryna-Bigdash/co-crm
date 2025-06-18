import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Plus } from 'lucide-react';
import { isToday } from 'date-fns';

const interactionSchema = Yup.object({
  type: Yup.string()
    .oneOf(['call', 'email', 'meeting', 'other'])
    .required('Оберіть тип звʼязку'),
  status: Yup.string()
    .oneOf(['pending', 'completed', 'overdue'])
    .required('Оберіть статус'),
  comment: Yup.string().required('Коментар обовʼязковий'),
  nextCall: Yup.date()
    .nullable()
    .min(new Date(), 'Дата і час не можуть бути в минулому')
    .required('Дата і час обовʼязкові'),
  amount: Yup.number()
    .min(0, 'Сума має бути невідʼємною')
    .optional(),
});

export interface InteractionFormValues {
  type: 'call' | 'email' | 'meeting' | 'other' | '';
  status: 'pending' | 'completed' | 'overdue' | '';
  comment: string;
  nextCall: Date | null;
  amount?: number | string;
}

interface InteractionFormProps {
  onSubmit: (data: Omit<InteractionFormValues, 'amount'> & { amount?: number }) => void;
}

const interactionTypes = [
  { value: '', label: 'Тип звʼязку' },
  { value: 'call', label: 'Дзвінок' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Зустріч' },
  { value: 'other', label: 'Інше' },
];

const statusOptions = [
  { value: '', label: 'Статус' },
  { value: 'pending', label: 'В процесі' },
  { value: 'completed', label: 'Завершено' },
  { value: 'overdue', label: 'Протерміновано' },
];

export default function InteractionForm({ onSubmit }: InteractionFormProps) {
  const formik = useFormik<InteractionFormValues>({
    initialValues: {
      type: '',
      status: '',
      comment: '',
      nextCall: null,
      amount: '',
    },
    validationSchema: interactionSchema,
    onSubmit: (values) => {
      const normalized = {
        ...values,
        amount: values.amount ? Number(values.amount) : undefined,
      };
      onSubmit(normalized);
      formik.resetForm();
    },
  });

  // Мінімальна дата — сьогодні
  const minDate = new Date();

  // Мінімальний час — якщо вибрана дата сьогодні, мінімальний час зараз, інакше 00:00
  const minTime =
    formik.values.nextCall && isToday(formik.values.nextCall)
      ? new Date()
      : new Date(new Date().setHours(0, 0, 0, 0));

  // Максимальний час у DatePicker — 23:45
  const maxTime = new Date(new Date().setHours(23, 45, 0, 0));

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="mb-8 p-4 border border-gray-200 rounded-xl bg-white shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <div>
          <select
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          >
            {interactionTypes.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {formik.touched.type && formik.errors.type && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.type}</div>
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
            {statusOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {formik.touched.status && formik.errors.status && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.status}</div>
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
        <div className="text-red-500 text-sm mb-4">{formik.errors.comment}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
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
            <div className="text-red-500 text-sm mt-1">{formik.errors.nextCall}</div>
          )}
        </div>

        <input
          type="number"
          name="amount"
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Сума (грн)"
          min={0}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
      >
        <Plus size={16} />
        <span>Додати запис</span>
      </button>
    </form>
  );
}
