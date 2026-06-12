'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/contexts/theme-context';

export interface HeaderProps {
  children: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  const userImage = session?.user?.image;
  const userName = session?.user?.name || '';
  const userEmail = session?.user?.email || '';
  const userRole = session?.user?.role || '';

  return (
    <header className="flex items-center gap-3 sm:gap-5 py-4 sm:py-6 pl-16 pr-4 sm:pr-10 lg:px-10 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors">
      <h1 className="flex-1 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-gray-100">
        {children}
      </h1>
      <div className="hidden sm:block w-px self-stretch bg-gray-300 dark:bg-gray-700" />
      <div className="flex gap-3 items-center">
        {session ? (
          <>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg
                  className="w-5 h-5 text-gray-700 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-300 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 shrink-0">
              {userImage ? (
                <Image
                  layout="fill"
                  objectFit="cover"
                  src={userImage}
                  alt="avatar"
                  className="rounded-full"
                />
              ) : (
                <div className="bg-gray-800 dark:bg-gray-700 text-lg sm:text-2xl font-bold text-white rounded-full flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {userName}
              </p>
              <p className="text-sm font-light text-gray-900 dark:text-gray-300">{userEmail}</p>
              <p className="text-sm font-light text-gray-900 dark:text-gray-300">{userRole}</p>
            </div>
          </>
        ) : (
          <Link href="/api/auth/signin">Sign in</Link>
        )}
      </div>
    </header>
  );
}
