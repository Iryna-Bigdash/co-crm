import React from 'react';
import clsx from 'clsx';
import { Category } from '@/lib/api';

export interface CategoriesLabelProps {
  category: Category;
}

const categoryColors: Record<string, string> = {
  '1': 'text-emerald-400',
  '2': 'text-red-400',
  '3': 'text-orange-400',
  '4': 'text-yellow-400',
  '5': 'text-purple-400',
  '6': 'text-rose-400',
  '7': 'text-indigo-400',
  '8': 'text-lime-400',
};

export default function CategoriesLabel({ category }: CategoriesLabelProps) {
  return (
    <div
      className={clsx(
        'inline-flex items-center py-1 px-3.5 text-sm font-medium',
        categoryColors[category.id],
      )}
    >
      {category.title}
    </div>
  );
}
