import React from 'react';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="bg-slate-800 min-h-screen flex flex-col items-center justify-center">
      <Image
          className="py-8 mb-11 mx-auto"
          width={350}
          height={185}
          src="/icons/logo.svg"
          alt="logo"
        />
      {/* <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-4">TruScape</h1> */}
      {/* <p className="text-lg">Login</p> */}
    </main>
  );
}

