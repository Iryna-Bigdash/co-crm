'use client';

import React from 'react';
import { Field, FieldAttributes } from 'formik';

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    Pick<FieldAttributes<string>, 'as'> {
  label?: string;
  error?: string;
}

export default function InputField({ label, error, id, ...rest }: InputFieldProps) {
  return (
    <div className="flex flex-col mb-4">
      {label && (
        <label htmlFor={id} className="mb-2 text-base text-gray-900 dark:text-gray-100">
          {label}
        </label>
      )}
      <Field
        {...rest}
        id={id}
        className={`p-3 h-11 text-sm rounded border ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } shadow bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
