// 'use client';
import React from 'react';
import Header from '@/app/components/header';
import { notFound } from 'next/navigation';

export interface PageProps {
    params: {id: string};
};

// Генеруємо статичні параметри
export function generateStaticParams(){
    return [
      { id: '1'},
      { id: '2'},
      { id: '3'}
    ]
}

export default function Page({ params }: PageProps) {
    // Перетворюємо id на число
    const id = Number.parseInt(params.id);

    // Отримуємо статичні параметри
    const staticParams = generateStaticParams();

    // Перевіряємо, чи id є в масиві статичних параметрів
    const isValidId = staticParams.some(param => param.id === params.id);

    if (!isValidId) {
        notFound();
        return null; // Повертаємо null, оскільки компонент не буде відображений
    }

    return (
        <>
            <Header>Companies {params.id}</Header>
        </>
    );
}
