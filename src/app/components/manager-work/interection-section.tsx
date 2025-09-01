'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInteractionsForCompany } from '@/lib/api';
import type { InteractionsListResponse } from '@/lib/api';
import InteractionCard from './interaction-card';
import InteractionForm from '../company-form';


export default function InteractionSection({ companyId }: { companyId: string }) {
  const { data, isLoading, isError } = useQuery<InteractionsListResponse>({
    queryKey: ['interactions', 'company', companyId],
    queryFn: () => getInteractionsForCompany(companyId),
    staleTime: 10_000,
  });

  const items = React.useMemo(
    () => [...(data?.items ?? [])]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [data]
  );

  if (isLoading) return <div>Завантаження взаємодій…</div>;
  if (isError)   return <div>Не вдалося отримати взаємодії.</div>;

  return (
    <div className="space-y-6">
      {/* Форма створює POST і по onSuccess інвалідить ['interactions','company', companyId] */}
      <InteractionForm companyId={companyId} />

      {items.length === 0 ? (
        <div className="text-sm text-gray-500">Поки що немає взаємодій.</div>
      ) : (
        items.map(item => <InteractionCard key={item.id} interaction={item} />)
      )}
    </div>
  );
}
