import React from 'react';

export interface ErrorComponentProps {}

export default function ErrorComponent({}: ErrorComponentProps) {
  return (
    <div>
      <p>Unexpected error inside sales slot</p>
    </div>
  );
}
