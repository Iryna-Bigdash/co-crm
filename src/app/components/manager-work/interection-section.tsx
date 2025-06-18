'use client';

import React from 'react';
import {
  Phone,
  Send,
  Calendar,
  MessageSquare,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import InteractionForm, { InteractionFormValues } from './interection-form';

type InteractionStatus = 'pending' | 'done';
type InteractionType = 'call' | 'email' | 'meeting' | 'other';

interface Interaction {
  id: string;
  type: InteractionType;
  status: InteractionStatus;
  date: string; // ISO string
  comment: string;
  nextCall?: string; // ISO string
  amount?: number;
}

const statusMap: Record<InteractionStatus, { label: string; icon: React.ReactNode; className: string }> = {
  pending: {
    label: 'Очікує',
    icon: <AlertCircle size={14} />,
    className: 'bg-yellow-100 text-yellow-800',
  },
  done: {
    label: 'Завершено',
    icon: <CheckCircle size={14} />,
    className: 'bg-green-100 text-green-800',
  },
};

const typeMap: Record<InteractionType, { label: string; icon: React.ReactNode }> = {
  call: {
    label: 'Дзвінок',
    icon: <Phone size={14} />,
  },
  email: {
    label: 'Email',
    icon: <Send size={14} />,
  },
  meeting: {
    label: 'Зустріч',
    icon: <Calendar size={14} />,
  },
  other: {
    label: 'Інше',
    icon: <MessageSquare size={14} />,
  },
};

interface InteractionCardProps {
  companyId: string;
  interaction?: Interaction; // можеш передавати interaction, якщо є
}

export function InteractionCard({ companyId, interaction }: InteractionCardProps) {
  // Якщо interaction не передано, використаємо дефолтний
  const defaultInteraction: Interaction = {
    id: 'default-id',
    type: 'call',
    status: 'pending',
    date: new Date().toISOString(),
    comment: 'Стандартний коментар',
    nextCall: new Date(Date.now() + 86400000).toISOString(), // завтрашня дата
    amount: 0,
  };

  const currentInteraction = interaction ?? defaultInteraction;

  const status = statusMap[currentInteraction.status] || statusMap.pending;
  const type = typeMap[currentInteraction.type] || typeMap.other;

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          {type.icon}
          <span className="font-medium">
            {new Date(currentInteraction.date).toLocaleDateString('uk-UA')}
          </span>
        </div>

        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>
          {status.icon}
          <span>{status.label}</span>
        </div>
      </div>

      <p className="text-sm text-gray-800 mb-3">{currentInteraction.comment}</p>

      <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-2">
        {currentInteraction.nextCall && (
          <div className="flex items-center gap-1 text-blue-600">
            <Clock size={14} />
            <span>
              Наступний звʼязок: {new Date(currentInteraction.nextCall).toLocaleString('uk-UA')}
            </span>
          </div>
        )}

        {currentInteraction.amount && currentInteraction.amount > 0 && (
          <div className="flex items-center gap-1 text-green-600 font-medium">
            <DollarSign size={14} />
            <span>{currentInteraction.amount.toLocaleString()} грн</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InteractionSection({ companyId }: { companyId: string }) {
  const handleFormSubmit = (data: InteractionFormValues) => {
    console.log('Interaction submitted:', data);

    // Тут можна додати логіку, наприклад, відправити interaction на сервер
  };

  return (
    <>
    <InteractionForm onSubmit={handleFormSubmit} />
    <InteractionCard companyId={companyId} />
    </>
  );
}
