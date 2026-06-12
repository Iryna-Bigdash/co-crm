'use client';

import React from 'react';

export interface GreetingProps {};

const Greeting: React.FC<GreetingProps> = () => {
  return (
    <div className="space-y-3">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
        Welcome to
      </h1>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent animate-pulse">
        CRM System
      </h2>
      <p className="text-sm sm:text-base text-white/80 font-light">
        Streamline your business operations
      </p>
    </div>
  );
}

export default Greeting;