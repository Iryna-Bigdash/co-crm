import React from 'react';

export interface ToolbarProps {
  children: React.ReactNode;
  action?: React.ReactNode;
}

export default function Toolbar({ children, action }: ToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-7 py-6 px-4 sm:py-8 sm:px-10">
      <div className="flex-1">{children}</div>
      {action}
    </div>
  );
}