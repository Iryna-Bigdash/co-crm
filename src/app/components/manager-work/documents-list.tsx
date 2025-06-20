'use client';
import React from 'react';

interface DocumentsListProps {
  companyId: string;
}

export function DocumentsList({ companyId }: DocumentsListProps) {
  // Поки заглушка
  return (
    <p className="text-sm text-gray-600 mb-6">
      Тут будуть відображені всі повʼязані документи компанії #{companyId}.
    </p>
  );
}
