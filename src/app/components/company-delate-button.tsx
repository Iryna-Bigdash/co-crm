'use client';

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCompany } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

interface DeleteCompanyButtonProps {
  companyId: string;
}

export default function DeleteCompanyButton({ companyId }: DeleteCompanyButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

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
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this company? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await mutation.mutateAsync(companyId);
      } catch (error) {
        console.error('Failed to delete company:', error);
      }
    }
  };

  return (
    <button
      onClick={handleDeleteCompany}
      className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded"
    >
      Delete Company
    </button>
  );
}
