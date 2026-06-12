'use client';

import React from 'react';
import {
  Phone, Send, Calendar, MessageSquare,
  Clock, CheckCircle, AlertCircle, Trash2
} from 'lucide-react';
import type { Interaction as ApiInteraction } from '@/lib/api';
import DeleteConfirmation from '@/app/components/delete-comfirm-window';

type Props = {
  interaction: ApiInteraction;
  onDelete?: (id: string) => Promise<void>;
};

const TYPE_ICON: Record<ApiInteraction['type'], React.ReactNode> = {
  CALL: <Phone size={14} />,
  EMAIL: <Send size={14} />,
  MEETING: <Calendar size={14} />,
  OTHER: <MessageSquare size={14} />,
};

const STATUS_META: Record<ApiInteraction['status'], { label: string; className: string; icon: React.ReactNode }> = {
  PENDING:  { label: 'В процесі',   className: 'bg-yellow-100 text-yellow-800', icon: <AlertCircle size={14} /> },
  DONE:     { label: 'Завершено',   className: 'bg-green-100 text-green-800',   icon: <CheckCircle size={14} /> },
  CANCELED: { label: 'Скасовано',   className: 'bg-red-100 text-red-800',       icon: <AlertCircle size={14} /> },
};

export default function InteractionCard({ interaction, onDelete }: Props) {
  const tIcon = TYPE_ICON[interaction.type];
  const sMeta = STATUS_META[interaction.status];

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          {tIcon}
          <span className="font-medium">
            {new Date(interaction.date).toLocaleDateString('uk-UA')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${sMeta.className}`}>
            {sMeta.icon}
            <span>{sMeta.label}</span>
          </div>

          {onDelete && (
            <DeleteConfirmation
              id={interaction.id}
              companyId={interaction.companyId}
              text="Видалити цей запис взаємодії?"
              onDelete={onDelete} 
            >
              <button title="Видалити" className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <Trash2 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </button>
            </DeleteConfirmation>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-800 dark:text-gray-200 mb-3">{interaction.comment}</p>

      <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-2">
        {interaction.nextCall && (
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <Clock size={14} />
            <span>
              Наступний звʼязок:{' '}
              {new Date(interaction.nextCall).toLocaleString('uk-UA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </span>
          </div>
        )}

        {interaction.amount != null && interaction.amount > 0 && (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
            <span>{interaction.amount.toLocaleString()} грн</span>
          </div>
        )}
      </div>
    </div>
  );
}
