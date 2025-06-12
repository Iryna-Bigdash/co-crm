'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { updateCompanyDescription } from '@/lib/api';

interface UpdateDescriptionButtonProps {
  companyId: string;
}

export default function UpdateDescriptionButton({
  companyId,
}: UpdateDescriptionButtonProps) {
  const [newDescription, setNewDescription] = useState<string>('');
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      companyId,
      newDescription,
    }: {
      companyId: string;
      newDescription: string;
    }) => {
      return updateCompanyDescription(companyId, newDescription);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      });
      toast.success('Description successfully updated!', {
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
      console.error('Description was not updated!:', error);
      toast.error('Description was not updated!');
    },
  });

  const handleUpdateDescription = async () => {
    if (newDescription.length < 5 || newDescription.length > 200) {
      toast.error('Description must be between 5 and 200 characters!');
      return;
    }

    try {
      await mutation.mutateAsync({ companyId, newDescription });
    } catch (error) {
      console.error('Failed to update description', error);
    }
  };

  return (
    <div className="w-full flex flex-col items-start gap-3">
      <textarea
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
        rows={3}
        placeholder="Enter new description"
      />
      <button
        onClick={handleUpdateDescription}
        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded"
      >
        Update Description
      </button>
    </div>
  );
}
