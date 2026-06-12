import React from 'react';

export interface SummaryTableProps {
  headers: React.ReactNode;
  children?: React.ReactNode;
}

export default function SummaryTable({ headers, children }: SummaryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-separate border-spacing-0">
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody className="[&>tr:nth-child(2n)]:bg-gray-100 dark:[&>tr:nth-child(2n)]:bg-gray-800 [&>tr:nth-child(2n+1)]:bg-white dark:[&>tr:nth-child(2n+1)]:bg-gray-900 transition-colors">
          {children}
        </tbody>
      </table>
    </div>
  );
}
