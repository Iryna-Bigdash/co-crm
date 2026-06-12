'use client';

import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Button from './button';
import InputField from './input-field';

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

const ManagerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one digit')
    .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
    .test('required-if-new', 'Password is required', function(value) {
      const { parent } = this;
      return parent.isEdit || !!value;
    }),
});

export default function ManagerForm({ 
  initialValues = { name: '', email: '', password: '' },
  onSubmit, 
  onCancel,
  isEdit = false
}: ManagerFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const generatePassword = (setFieldValue: any) => {
    const length = 12;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    const allChars = uppercase + lowercase + numbers + special;
    
    let password = '';
    // Ensure at least one of each required character type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setFieldValue('password', password);
    setShowPassword(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ManagerSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting, values, setFieldValue }) => (
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
                {isEdit ? "New Password (leave empty to keep current)" : "Password"}
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
            <div className="relative">
              <Field
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-11 w-full text-base rounded px-3 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              {values.password && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(values.password)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm px-2 transition-colors"
                    title="Copy password"
                  >
                    📋
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm px-2 transition-colors"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              )}
            </div>
            {errors.password && touched.password && (
              <div className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.password}</div>
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
