'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export interface HeaderProps {
  children: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const { data: session } = useSession();

  const userImage = session?.user?.image;
  const userName = session?.user?.name || '';
  const userEmail = session?.user?.email || '';
  const userRole = session?.user?.role || '';

  return (
    <header className="flex items-center gap-5 py-6 px-10 border-b border-gray-300">
      <h1 className="flex-1 text-3xl font-semibold text-gray-900">
        {children}
      </h1>
      <div className="w-px self-stretch bg-gray-300" />
      <div className="flex gap-3">
        {session ? (
          <>
            <div className="relative w-14 h-14">
              {userImage ? (
                <Image
                  layout="fill"
                  objectFit="cover"
                  src={userImage}
                  alt="avatar"
                  className="rounded-full"
                />
              ) : (
                <div className="bg-gray-800 text-2xl font-bold text-white rounded-full flex items-center justify-center w-14 h-14">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">
                {userName}
              </p>
              <p className="text-sm font-light text-gray-900">{userEmail}</p>
              <p className="text-sm font-light text-gray-900">{userRole}</p>
            </div>
          </>
        ) : (
          <Link href="/api/auth/signin">Sign in</Link>
        )}
      </div>
    </header>
  );
}
