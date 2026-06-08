'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteInteraction, getInteractionsForCompany } from '@/lib/api';
import type { InteractionsListResponse } from '@/lib/api';
import InteractionCard from './interaction-card';
import InteractionForm from './interection-form';
import { toast } from 'react-toastify';


export default function InteractionSection({ companyId }: { companyId: string }) {
  const { data, isLoading, isError } = useQuery<InteractionsListResponse>({
    queryKey: ['interactions', 'company', companyId],
    queryFn: () => getInteractionsForCompany(companyId),
    staleTime: 10_000,
  });
  const queryClient = useQueryClient();


  const mutation = useMutation({
    mutationFn: (id: string) => deleteInteraction(id),
    onSuccess: () => {
      toast.success('Запис видалено');
      queryClient.invalidateQueries({ queryKey: ['interactions', 'company', companyId] });
    },
    onError: (e: any) => {
      console.error(e);
      toast.error(e?.message || 'Не вдалося видалити запис');
    },
  });

  const handleDeleteInteraction = async (id: string)=> {
    try {
      await mutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete interaction:', error);
    }
  };

  const items = React.useMemo(
    () => [...(data?.items ?? [])]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [data]
  );

  if (isLoading) return <div>Завантаження взаємодій…</div>;
  if (isError)   return <div>Не вдалося отримати взаємодії.</div>;

  return (
    <div className="space-y-6">
      <InteractionForm companyId={companyId} />

      {items.length === 0 ? (
        <div className="text-sm text-gray-500">Поки що немає взаємодій.</div>
      ) : (
        items.map(item => <InteractionCard
           key={item.id}
          interaction={item}
          onDelete={handleDeleteInteraction}
           />)
      )}
    </div>
  );
}
