import Sidebar from '@/app/components/sidebar';
import React from 'react';
import MagicButton from '../components/magic-button';

export interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  console.log('render')
  return (
    <>
      <Sidebar />
      <div className="ml-60">{children}</div>
    </>
  );
}
