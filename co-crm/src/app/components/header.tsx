// 'use client';

// import React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useSession } from 'next-auth/react';


// export interface HeaderProps {
//   children: React.ReactNode;
// }

// export default function Header({ children }: HeaderProps) {
//   const { data: session, status } = useSession();

//   if (status === 'loading') {
//     return <p>Loading...</p>;
//   }

//   return (
//     <header className="flex items-center gap-5 py-6 px-10 border-b border-gray-300">
//       <h1 className="flex-1 text-3xl font-semibold text-gray-900">
//         {children}
//       </h1>
//       <div className="w-px self-stretch bg-gray-300" />
//       <div className="flex gap-3">
//         {session ? (
//           <>
//             <Image
//               width={44}
//               height={44}
//               src={user.avatar}
//               alt="avatar"
//               className="rounded-full"
//             />
//             <div>
//               <p className="text-base font-semibold text-gray-900">
//                 {session.user?.name}
//               </p>
//               <p className="text-sm font-light text-gray-900">
//                 {session.user?.email}
//               </p>
//             </div>
//           </>
//         ) : (
//           <Link href="/api/auth/signin">Sign in</Link>
//         )}
//       </div>
//     </header>
//   );
// }


'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export interface HeaderProps {
  children: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  const userImage = session?.user?.image ? session.user.image : '/images/avatar1.png';

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
              <Image
                layout="fill"
                objectFit="cover"
                src={userImage}
                alt="avatar"
                className="rounded-full"
              />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">
                {session.user?.name}
              </p>
              <p className="text-sm font-light text-gray-900">
                {session.user?.email}
              </p>
              <p className="text-sm font-light text-gray-900">
                {session.user.role}
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
