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
        <label htmlFor={id} className="mb-2 text-base text-gray-900">
          {label}
        </label>
      )}
      <Field
        {...rest}
        id={id}
        className={`p-3 h-11 text-sm rounded border ${
          error ? 'border-red-500' : 'border-gray-300'
        } shadow`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
