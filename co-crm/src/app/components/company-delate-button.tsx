'use client';

import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteCompany, getCompanies } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface DeleteCompanyButtonProps {
  companyId: string;
}

const DeleteCompanyButton: React.FC<DeleteCompanyButtonProps> = ({
  companyId,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
    staleTime: 10 * 1000,
  });

  const mutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      });
      toast.success('Company successfully deleted!', {
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
      console.error('Company not deleted:', error);
      toast.error('Company not deleted!');
    },
  });

  const handleDeleteCompany = async () => {
    try {
      await mutation.mutateAsync(companyId);
    } catch (error) {
      console.error('Failed to delete company:', error);
    }
  };

  return (
    <button
      onClick={handleDeleteCompany}
      className="bg-red-500 text-white px-4 py-2 mt-4"
    >
      Delete Company
    </button>
  );
};

export default DeleteCompanyButton;
