import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';
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
  avatar: string;
};

const initialValues: CompanyFieldValues = {
  title: '',
  description: '',
  status: CompanyStatus.Active,
  joinedDate: '',
  categoryId: '',
  countryId: '',
  avatar: '',
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Name is required!'),
  description: Yup.string().required('Description is required!'),
  status: Yup.string().required('Status is required!'),
  joinedDate: Yup.date().required('Joined date is required!').nullable(),
  categoryId: Yup.string().required('Category is required!'),
  countryId: Yup.string().required('Country is required!'),
  avatar: Yup.string().url('Avatar must be a valid URL').nullable(),
});

export interface CompanyFormProps {
  onSubmit?: (values: CompanyFieldValues) => void | Promise<void>;
  onClose?: () => void;
}

export default function CompanyForm({ onSubmit }: CompanyFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string>('');

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
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({
        queryKey: ['countries', 'with-companies'],
      });
      queryClient.invalidateQueries({
        queryKey: ['categories', 'with-companies'],
      });
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['summary-stats'] });
      queryClient.invalidateQueries({ queryKey: ['summary-sales'] });
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
      avatar: avatarUrl,
      title: values.title.trim(),
      description: values.description.trim(),
      categoryId: values.categoryId.trim(),
      countryId: values.countryId.trim(),
      joinedDate: new Date(values.joinedDate).toISOString(),
      hasPromotions: false,
    };

    await mutation.mutateAsync(trimmedValues);

    if (onSubmit) {
      onSubmit(trimmedValues);
    }
  };

  if (isCountriesLoading) {
    return <div>Loading countries...</div>;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="flex flex-col gap-10">
          <p className="mb-0.5 text-xl">Add new company</p>
          <div className="flex gap-6">
            <div className="flex flex-col flex-1 gap-5">
              <LogoUploader
                label="Logo"
                placeholder="Upload photo"
                onUpload={(url) => {
                  setAvatarUrl(url);
                }}
              />
              <InputField
                required
                label="Status"
                placeholder="Status"
                name="status"
                as="select"
                error={
                  touched.status && errors.status ? errors.status : undefined
                }
              >
                {Object.values(CompanyStatus).map((status) => (
                  <option key={status} value={status}>
                    <StatusLabel status={status} />
                  </option>
                ))}
              </InputField>
              <InputField
                required
                label="Country"
                placeholder="Country"
                name="countryId"
                as="select"
                error={
                  touched.countryId && errors.countryId
                    ? errors.countryId
                    : undefined
                }
              >
                {countries?.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </InputField>
            </div>
            <div className="flex flex-col flex-1 gap-5">
              <InputField
                required
                label="Name"
                placeholder="Name"
                name="title"
                error={touched.title && errors.title ? errors.title : undefined}
              />
              <InputField
                required
                label="Category"
                placeholder="Category"
                name="categoryId"
                as="select"
                error={
                  touched.categoryId && errors.categoryId
                    ? errors.categoryId
                    : undefined
                }
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
                error={
                  touched.joinedDate && errors.joinedDate
                    ? errors.joinedDate
                    : undefined
                }
              />
              <InputField
                required
                label="Description"
                placeholder="Description"
                name="description"
                error={
                  touched.description && errors.description
                    ? errors.description
                    : undefined
                }
              />
            </div>
          </div>
          <Button type="submit" disabled={mutation.status === 'pending'}>
            {mutation.status === 'pending' ? 'Adding company..' : 'Add company'}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
