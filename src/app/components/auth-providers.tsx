'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import Providers from './providers';

export default function AuthProviders({ children }: React.PropsWithChildren) {
  return (
    <SessionProvider>
      <Providers>
        {children}
      </Providers>
    </SessionProvider>
  );
}