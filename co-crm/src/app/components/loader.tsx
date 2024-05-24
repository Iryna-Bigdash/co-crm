'use client';

import React from 'react';

export interface LoaderProps {};

const Loader: React.FC<LoaderProps> = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-300"></div>
        <h3 className="ml-2">Loading...</h3>
      </div>
    </div>
  );
}

export default Loader;
