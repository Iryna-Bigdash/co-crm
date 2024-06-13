// import React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// export interface HeaderProps {
//   children: React.ReactNode;
// }

// export default function Header({ children }: HeaderProps) {
//   return (
//     <header className="flex items-center gap-5 py-6	px-10 border-b border-gray-300">
//       <h1 className="flex-1 text-3xl font-semibold text-gray-900">
//         {children}
//       </h1>
//       <div className="w-px self-stretch bg-gray-300" />
//       <div className="flex gap-3">
//         <Image width={44} height={44} src="/images/avatar1.png" alt="avatar" />
//         <div>
//           <p className="text-base	font-semibold text-gray-900">Iryna Bigdash</p>
//           <p className="text-sm	font-light text-gray-900">imbigdash@gmail.com</p>
//         </div>
//         <div>
//           <Link href={'http://localhost:3000/api/auth/signout'}>Sign out</Link>
//         </div>
//       </div>
//     </header>
//   );
// }

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
            <button onClick={() => signOut()} className="text-blue-500">
              Sign out
            </button>
          </>
        ) : (
          <Link href="/api/auth/signin">Sign in</Link>
        )}
      </div>
    </header>
  );
}
