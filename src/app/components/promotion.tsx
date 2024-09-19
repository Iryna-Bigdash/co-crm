'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { Promotion } from '@/lib/api';
import { deletePromotion } from '@/lib/api';
import DeleteConfirmation from './delete-comfirm-window';
import EditPromotionModal from './edit-promotion-modal';

export interface PromotionProps {
  promotion: Promotion;
  companyId: string;
  text?: string;
}

export default function Promotion({ promotion }: PromotionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: deletePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['promotions'],
      });
      router.push(`/companies/${promotion.companyId}`);
    },
    onError: (error: any) => {
      console.error('Promotion not deleted:', error);
    },
  });

  const handleDeletePromotion = async (id: string) => {
    try {
      await mutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete promotion:', error);
    }
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true); 
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <div className="rounded overflow-hidden bg-gray-100 flex flex-col">
      <div className="relative w-full h-40 bg-gray-300">
        {promotion.avatar && (
          <Image fill src={promotion.avatar} alt="promotion avatar" />
        )}
        <div className="w-14 h-14 absolute top-0 left-px rounded-br-full bg-lime-200" />
        <div className="w-14 h-14 absolute inset-0 py-3 pr-3 pl-0.5 rounded-br-full bg-gray-900">
          <p className="text-center text-xs font-bold text-lime-200">{`-${promotion.discount}%`}</p>
        </div>
      </div>

      <div className="flex flex-col p-5 gap-3 flex-grow">
        <p className="text-base font-semibold text-gray-900">
          {promotion.title}
        </p>

        <p className="text-sm text-gray-900 break-words overflow-hidden">
          {promotion.description}
        </p>

        <div className="flex justify-end space-x-4 mt-auto">
          <DeleteConfirmation 
          id={promotion.id}
          text='Confirm deleting this promotion?'
          companyId={promotion.companyId} 
          onDelete={handleDeletePromotion}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 hover:stroke-cyan-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9L14.394 18M9.606 18L9.26 9M18.228 5.79c.342.052.682.107 1.022.166M18.228 5.79L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79M18.228 5.79a48.108 48.108 0 00-3.478-.397M6.522 5.955c.34-.059.68-.114 1.022-.165M6.522 5.955a48.11 48.11 0 013.478-.397M17.5 5.79V4.874c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0C10.91 2.71 10 3.696 10 4.874V5.79M17.5 5.79a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </DeleteConfirmation>

          <button className="text-sm text-gray-900" onClick={handleOpenEditModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 hover:stroke-cyan-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
        </div>
      </div>

      {isEditModalOpen && (
        <EditPromotionModal 
          promotionId={promotion.id} 
          onClose={handleCloseEditModal} 
          show={isEditModalOpen}
        />
      )}
    </div>
  );
}
