'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { useField } from 'formik';
import * as Yup from 'yup';
import Button from './button';
import InputField from './input-field';
import PasswordInput from './password-input';

interface ManagerFormValues {
  name: string;
  email: string;
  password: string;
}

interface ManagerFormProps {
  initialValues?: ManagerFormValues;
  onSubmit: (values: ManagerFormValues) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const createManagerSchema = (isEdit: boolean) =>
  Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .test('optional-in-edit', 'Password is required', (value) => isEdit || !!value)
      .test(
        'password-rules',
        'Password must be at least 6 characters long, include at least one uppercase letter, one digit, and one special character',
        (value) => {
          if (!value) return isEdit;
          return (
            value.length >= 6 &&
            /[A-Z]/.test(value) &&
            /\d/.test(value) &&
            /[!@#$%^&*]/.test(value)
          );
        },
      ),
  });

function ManagerPasswordField({
  onCopy,
}: {
  onCopy: (password: string) => void;
}) {
  const [field, meta] = useField<string>('password');

  return (
    <>
      <PasswordInput
        {...field}
        endAdornment={
          field.value ? (
            <button
              type="button"
              onClick={() => onCopy(field.value)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              title="Copy password"
            >
              📋
            </button>
          ) : undefined
        }
        className="h-11 w-full text-base rounded px-3 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      />
      {meta.touched && meta.error && (
        <div className="text-red-500 dark:text-red-400 text-sm mt-1">{meta.error}</div>
      )}
    </>
  );
}

export default function ManagerForm({
  initialValues = { name: '', email: '', password: '' },
  onSubmit,
  onCancel,
  isEdit = false,
}: ManagerFormProps) {
  const generatePassword = (setFieldValue: (field: string, value: string) => void) => {
    const length = 12;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    const allChars = uppercase + lowercase + numbers + special;

    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    password = password.split('').sort(() => Math.random() - 0.5).join('');
    setFieldValue('password', password);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={createManagerSchema(isEdit)}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ errors, touched, isSubmitting, setFieldValue }) => (
        <Form className="flex flex-col gap-5">
          <InputField
            label="Name"
            placeholder="Manager name"
            name="name"
            type="text"
            required
          />
          {errors.name && touched.name && (
            <div className="text-red-500 dark:text-red-400 text-sm -mt-3">{errors.name}</div>
          )}

          <InputField
            label="Email"
            placeholder="manager@example.com"
            name="email"
            type="email"
            required
          />
          {errors.email && touched.email && (
            <div className="text-red-500 dark:text-red-400 text-sm -mt-3">{errors.email}</div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-base font-medium text-gray-900 dark:text-gray-100">
                Password
                {!isEdit && <span className="text-red-500 ml-1">*</span>}
              </label>
              <button
                type="button"
                onClick={() => generatePassword(setFieldValue)}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Generate Password
              </button>
            </div>
            <ManagerPasswordField onCopy={copyToClipboard} />
            {isEdit && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Leave empty to keep the current password
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isEdit ? 'Update Manager' : 'Create Manager'}
            </Button>
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
