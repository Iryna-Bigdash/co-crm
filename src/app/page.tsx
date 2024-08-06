import React from 'react';
import Image from 'next/image';
import Greeting from './components/greeting';
import Link from 'next/link';

export const metadata = {
  title: 'Home - CRM 👩🏻‍💻',
  description: 'Welcome to the home page developed by Iryna Bigdash.',
  keywords: 'Iryna Bigdash, CRM, developer, tech, system business, site faro',
  author: 'Iryna Bigdash'
  } 

export default function Home() {
  return (
    <main className="bg-slate-800 min-h-screen flex flex-col justify-between py-4">
      <header className='py-10'> 
      <Image
        className="py-8 mx-auto"
        width={350}
        height={185}
        src="/icons/logo.svg"
        alt="logo"
      />
      </header>
    <section className='py-4 flex flex-col items-center justify-center gap-20'>
      <Greeting />
      <Link href="/dashboard" className="text-lg text-white sm:text-3xl">Get started</Link>
    </section>
    <footer className='flex justify-center py-4'>
      <p className='text-gray-200'>Developed by <Link href="https://www.linkedin.com/in/iryna-bigdash" target="_blank" className='underline'>Iryna Bigdash</Link></p>
    </footer>
  </main>
  );
}

