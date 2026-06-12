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
    <main className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-12">
          {/* Logo Section */}
          <div className="transform hover:scale-105 transition-transform duration-300">
            <Image
              className="drop-shadow-2xl"
              width={350}
              height={185}
              src="/icons/logo.svg"
              alt="logo"
              priority
            />
          </div>

          {/* Card Container */}
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-12 transform hover:scale-[1.02] transition-all duration-300">
              {/* Greeting */}
              <div className="mb-8 text-center">
                <Greeting />
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                  <span className="text-sm sm:text-base">Manage your companies efficiently</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                  <span className="text-sm sm:text-base">Track promotions and sales</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                  <span className="text-sm sm:text-base">Assign managers to companies</span>
                </div>
              </div>

              {/* Get Started Button */}
              <Link href="/dashboard" className="block w-full">
                <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <span className="text-lg sm:text-xl">Get Started</span>
                  <span className="ml-2">→</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-2xl">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 text-center border border-white/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl sm:text-4xl font-bold text-white mb-1">🚀</div>
              <div className="text-xs sm:text-sm text-white/80">Fast & Easy</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 text-center border border-white/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl sm:text-4xl font-bold text-white mb-1">💼</div>
              <div className="text-xs sm:text-sm text-white/80">Professional</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 text-center border border-white/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl sm:text-4xl font-bold text-white mb-1">📊</div>
              <div className="text-xs sm:text-sm text-white/80">Analytics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 mt-auto">
        <div className="flex flex-col items-center gap-2">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/50 to-transparent mb-2"></div>
          <p className="text-white/90 text-sm sm:text-base font-medium">
            Developed with 💜 by{' '}
            <Link 
              href="https://www.linkedin.com/in/iryna-bigdash" 
              target="_blank" 
              className="text-white font-semibold hover:text-purple-200 transition-colors duration-300 underline decoration-2 underline-offset-4"
            >
              Iryna Bigdash
            </Link>
          </p>
          <p className="text-white/60 text-xs">Full-Stack Developer</p>
        </div>
      </footer>
    </main>
  );
}

