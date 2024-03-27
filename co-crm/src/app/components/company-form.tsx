'use client';
import React from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import LogoUploader from './logo-uploader';
import InputField from './input-field';

export type CompanyFieldValues = {
  title: string;
  status: string;
  country: string;
  category: string;
  joinedData: string;
  description: string;
};

const initialValues: CompanyFieldValues = {
  title: '',
  status: '',
  country: '',
  category: '',
  joinedData: '',
  description: '',
};

// export interface CompanyFormProps {
//     onSubmit?: (values: CompanyFieldValues) => void | Promise<void>;
//   }

  export interface CompanyFormProps {
    onSubmit: (values: CompanyFieldValues, formikHelpers: FormikHelpers<CompanyFieldValues>) => void | Promise<void>;
  }

export default function CompanyForm({ onSubmit }: CompanyFormProps) {
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <Form className="flex flex-col gap-10">
        <p className="mb-0.5 text-xl">Add new company</p>

        <div className="flex gap-6">
        <div className='flex flex-col flex-1 gap-5'>
          <LogoUploader label="Logo" placeholder="Upload photo" />
          <InputField label="Status" placeholder="Status" name="status" />
          <InputField label="Country" placeholder="Country" name="country" />
        </div>
        <div className='flex flex-col flex-1 gap-5'>
            <InputField  label='Name' placeholder='Title' name='title'/>
            <InputField  label='Category' placeholder='Category' name='category'/>
            <InputField  label='Joined data' placeholder='Joined data' name='joinedData'/>
            <InputField  label='Description' placeholder='Description' name='description'/>
        </div>
        </div>

      </Form>
    </Formik>
  );
}
