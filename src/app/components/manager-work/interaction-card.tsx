'use client';

import React from 'react';
import {
  Phone, Send, Calendar, MessageSquare,
  Clock, DollarSign, CheckCircle, AlertCircle
} from 'lucide-react';
import type { Interaction as ApiInteraction } from '@/lib/api';

type Props = { interaction: ApiInteraction };

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

export default function InteractionCard({ interaction }: Props) {
  const tIcon = TYPE_ICON[interaction.type];
  const sMeta = STATUS_META[interaction.status];

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          {tIcon}
          <span className="font-medium">
            {new Date(interaction.date).toLocaleDateString('uk-UA')}
          </span>
        </div>

        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${sMeta.className}`}>
          {sMeta.icon}
          <span>{sMeta.label}</span>
        </div>
      </div>

      <p className="text-sm text-gray-800 mb-3">{interaction.comment}</p>

      <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-2">
        {interaction.nextCall && (
          <div className="flex items-center gap-1 text-blue-600">
            <Clock size={14} />
            <span>Наступний звʼязок: {new Date(interaction.nextCall).toLocaleString('uk-UA')}</span>
          </div>
        )}

        {interaction.amount != null && interaction.amount > 0 && (
          <div className="flex items-center gap-1 text-green-600 font-medium">
            <DollarSign size={14} />
            <span>{interaction.amount.toLocaleString()} грн</span>
          </div>
        )}
      </div>
    </div>
  );
}
