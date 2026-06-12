'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import SidebarItem from './sidebar-item';
import { signOut, useSession } from 'next-auth/react';

export interface SidebarProps {}

export default function Sidebar({}: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile hamburger toggle (hidden on desktop) */}
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-lg bg-gray-900 text-white shadow-lg lg:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Overlay behind the drawer on mobile/tablet */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 w-60 h-screen transform transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto bg-gray-900">
          {/* Close button inside the drawer (mobile/tablet only) */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <Image
            className="py-8 mb-11 mx-auto"
            width={122}
            height={25}
            src="/icons/logo.svg"
            alt="logo"
          />
          <ul className="space-y-7">
            <SidebarItem
              current={pathname === '/dashboard'}
              pathname="/dashboard"
              src="/icons/squares.svg"
              alt="dashboard icon"
            >
              Dashboard
            </SidebarItem>
            <SidebarItem
              current={pathname === '/companies'}
              pathname="/companies"
              src="/icons/briefcase.svg"
              alt="companies icon"
            >
              Companies
            </SidebarItem>
            {session?.user?.role === 'admin' && (
              <>
                <SidebarItem
                  current={pathname === '/managers'}
                  pathname="/managers"
                  src="/icons/briefcase.svg"
                  alt="managers icon"
                >
                  Managers
                </SidebarItem>
                <SidebarItem
                  current={pathname === '/manager-assignments'}
                  pathname="/manager-assignments"
                  src="/icons/briefcase.svg"
                  alt="assignments icon"
                >
                  Manager Assignments
                </SidebarItem>
              </>
            )}
          </ul>
          <button
            className="flex items-center gap-2 p-6 mt-auto mx-auto"
            onClick={() => signOut()}
          >
            <Image
              width={18}
              height={18}
              src="/icons/arrow-left-on-rectangle.svg"
              alt="exit icon"
            />
            <span className="font-medium text-white">Exit</span>
          </button>
        </div>
      </aside>
    </>
  );
}
