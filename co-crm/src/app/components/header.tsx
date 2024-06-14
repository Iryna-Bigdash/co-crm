'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export interface HeaderProps {
  children: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const { data: session, status } = useSession();

  const userImage = session?.user?.image
    ? session.user.image
    : '/images/avatar1.png';

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <header className="flex items-center gap-5 py-6 px-10 border-b border-gray-300">
      <h1 className="flex-1 text-3xl font-semibold text-gray-900">
        {children}
      </h1>
      <div className="w-px self-stretch bg-gray-300" />
      <div className="flex gap-3">
        {session ? (
          <>
            <Image
              width={44}
              height={44}
              src={userImage}
              alt="avatar"
              className="rounded-full"
            />
            <div>
              <p className="text-base font-semibold text-gray-900">
                {session.user?.name}
              </p>
              <p className="text-sm font-light text-gray-900">
                {session.user?.email}
              </p>
            </div>
          </>
        ) : (
          <Link href="/api/auth/signin">Sign in</Link>
        )}
      </div>
    </header>
  );
}
