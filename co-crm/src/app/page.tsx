import React from 'react';
import Image from 'next/image';
import Greeting from './components/greeting';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-slate-800 min-h-screen flex flex-col items-center justify-center gap-20">
      <Image
          className="py-8 mx-auto"
          width={350}
          height={185}
          src="/icons/logo.svg"
          alt="logo"
        />
      <Greeting />
      <Link href="/dashboard" className="text-lg text-white sm:text-3xl">Login</Link>
    </main>
  );
}

