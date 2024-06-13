// import React from 'react';
// import { Plus_Jakarta_Sans } from 'next/font/google';
// import './globals.css';
// import Providers from './components/providers';

// const font = Plus_Jakarta_Sans({ subsets: ['latin']});

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={font.className}>
//         <Providers>
//         {children}
//         </Providers>
//         </body>
//     </html>
//   );
// } 

import React from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import AuthProviders from './components/auth-providers';

const font = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata = {
  title: 'CRM system',
  description: 'Developed by Iryna Bigdash'
  }

export default function RootLayout({
  children,
}: Readonly<{
   children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <AuthProviders>
          {children}
        </AuthProviders>
      </body>
    </html>
  );
}



