'use client';

import React from 'react';

export interface GreetingProps {};

const Greeting: React.FC<GreetingProps> = () => {
  return (
    <>
          <h1 className="animate-changeColor text-3xl font-bold tracking-tight text-white sm:text-5xl">CRM system for your business</h1>

      </>
  );
}

export default Greeting;