'use client';

import { signIn } from 'next-auth/react';
import { useState, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialsSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        username: email,
        password: password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Please try again.');
        setIsLoading(false);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = () => {
    setIsLoading(true);
    signIn('github', { callbackUrl: '/dashboard' });
  };

  return (
    <main className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Spacer for vertical centering */}
      <div className="flex-1"></div>

      {/* Main Content Container - Centered */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-8 transform hover:scale-105 transition-transform duration-300">
          <Image
            src="/icons/logo.svg"
            alt="TruScape Logo"
            width={280}
            height={150}
            className="drop-shadow-2xl"
            priority
          />
        </div>

        {/* Sign In Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10 transform hover:scale-[1.01] transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Welcome Back
            </h1>
            <p className="text-white/80 text-sm sm:text-base">
              Sign in to continue to your CRM
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur-sm">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}

          {/* GitHub Sign In */}
          <button
            onClick={handleGitHubSignIn}
            disabled={isLoading}
            className="w-full bg-gray-900/80 hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mb-6 backdrop-blur-sm border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="text-lg">Sign in with GitHub</span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/70 font-medium">Or continue with email</span>
            </div>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleCredentialsSignIn} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-white font-medium mb-2 text-sm">
                Email Address
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white font-medium mb-2 text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">Sign In</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Secure authentication powered by NextAuth
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-300 inline-flex items-center gap-2"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Spacer for vertical centering */}
      <div className="flex-1"></div>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6">
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
