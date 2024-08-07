'use client';

import React from 'react';
import { Form, Formik } from 'formik';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CompanyStatus,
  createCompany,
  getCategories,
  getCountries,
} from '@/lib/api';
import Button from '@/app/components/button';
import InputField from '@/app/components/input-field';
import LogoUploader from '@/app/components/logo-uploader';
import StatusLabel from '@/app/components/status-label';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export type CompanyFieldValues = {
  title: string;
  description: string;
  status: CompanyStatus;
  joinedDate: string;
  categoryId: string;
  countryId: string;
};

const initialValues: CompanyFieldValues = {
  title: '',
  description: '',
  status: CompanyStatus.Active,
  joinedDate: '',
  categoryId: '',
  countryId: '',
};

export interface CompanyFormProps {
  onSubmit?: (values: CompanyFieldValues) => void | Promise<void>;
  onClose?: () => void;
}

export default function CompanyForm({ onSubmit }: CompanyFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 10 * 1000,
  });

  const { data: countries, isLoading: isCountriesLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
    staleTime: 10 * 1000,
  });

  const mutation = useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      });
      toast.success('Company successfully added!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      router.push('/companies');
    },
    onError: (error: any) => {
      console.error('Company not added:', error);
      toast.error('Company not added!');
    },
  });

  const handleSubmit = async (values: CompanyFieldValues) => {
    const trimmedValues = {
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      categoryId: values.categoryId.trim(),
      countryId: values.countryId.trim(),
    };

    await mutation.mutateAsync({
      ...trimmedValues,
      categoryTitle:
        categories?.find(({ id }) => id === trimmedValues.categoryId)?.title ??
        '',
      countryTitle:
        countries?.find(({ id }) => id === trimmedValues.countryId)?.title ??
        '',
    });

    if (onSubmit) {
      onSubmit(trimmedValues);
    }
  };

  if (isCountriesLoading) {
    return <div>Loading countries...</div>;
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form className="flex flex-col gap-10">
        <p className="mb-0.5 text-xl">Add new company</p>
        <div className="flex gap-6">
          <div className="flex flex-col flex-1 gap-5">
            <LogoUploader label="Logo" placeholder="Upload photo" />
            <InputField
              required
              label="Status"
              placeholder="Status"
              name="status"
              as="select"
            >
              {(Object.values(CompanyStatus) as CompanyStatus[]).map(
                (status) => (
                  <option key={status} value={status}>
                    <StatusLabel status={status} />
                  </option>
                ),
              )}
            </InputField>
            <InputField
              required
              label="Country"
              placeholder="Country"
              name="countryId"
              as="select"
            >
              {countries?.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.title}
                </option>
              ))}
            </InputField>
          </div>
          <div className="flex flex-col flex-1 gap-5">
            <InputField required label="Name" placeholder="Name" name="title" />
            <InputField
              required
              label="Category"
              placeholder="Category"
              name="categoryId"
              as="select"
            >
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </InputField>
            <InputField
              required
              label="Joined date"
              type="date"
              name="joinedDate"
            />
            <InputField
              required
              label="Description"
              placeholder="Description"
              name="description"
            />
          </div>
        </div>
        <Button type="submit" disabled={mutation.status === 'pending'}>
          {mutation.status === 'pending' ? 'Adding company..' : 'Add company'}
        </Button>
      </Form>
    </Formik>
  );
}
