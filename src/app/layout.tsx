import React from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import AuthProviders from './components/auth-providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const font = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata = {
  title: 'CRM 👩🏻‍💻',
  description: 'Developed by Iryna Bigdash'
  }

export default function RootLayout({
  children,
}: Readonly<{
   children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
    <link rel="icon" href='icons/favicon.svg' sizes="any" />
    </head>
      <body className={font.className}>
        <AuthProviders>
          {children}
        </AuthProviders>
        <ToastContainer 
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastClassName="toast"
        />
      </body>
    </html>
  );
}



