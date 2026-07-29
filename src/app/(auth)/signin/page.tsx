'use client';

import { signIn } from 'next-auth/react';
import { Suspense, useEffect, useState, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Shield,
  Mail,
  Lock,
  Layers,
  UserCircle2,
  Github,
} from 'lucide-react';
import PasswordInput from '@/app/components/password-input';

const features = [
  {
    icon: Shield,
    title: 'Enterprise-grade security',
    description:
      '256-bit encryption, advanced threat protection, and data privacy by design',
  },
  {
    icon: UserCircle2,
    title: "Access that's in your control",
    description:
      'SSO, MFA, and role-based permissions to keep your business secure',
  },
  {
    icon: Layers,
    title: 'Reliable. Always.',
    description:
      '99.9% uptime, global infrastructure, and performance you can count on',
  },
];

function BrandMark() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C5A059]/40 bg-[#C5A059]/10">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M16 3L27 9.5V22.5L16 29L5 22.5V9.5L16 3Z"
            stroke="#C5A059"
            strokeWidth="1.5"
            fill="rgba(197,160,89,0.12)"
          />
          <path
            d="M16 9L22 12.5V19.5L16 23L10 19.5V12.5L16 9Z"
            fill="#C5A059"
          />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold tracking-[0.2em] text-white">IREN CORE</p>
        <p className="mt-1 text-[10px] tracking-[0.45em] text-[#C5A059]/90">CRM PLATFORM</p>
      </div>
    </div>
  );
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const authError = searchParams.get('error');

    if (authError === 'NoEmail') {
      setError(
        'GitHub did not share your email. Make your primary email public in GitHub settings, or use email/password login.',
      );
      return;
    }

    if (authError === 'AccessDenied') {
      setError(
        'GitHub access denied. Add your GitHub email to GITHUB_ADMIN_EMAILS on Vercel, or use an employee account with the same email in the database.',
      );
      return;
    }

    if (authError === 'Configuration') {
      setError('Authentication is misconfigured. Check GITHUB_ID, GITHUB_SECRET and NEXTAUTH_URL on Vercel.');
      return;
    }

    if (authError === 'OAuthCallback') {
      setError('GitHub callback failed. Verify the OAuth callback URL in your GitHub app settings.');
      return;
    }

    if (authError) {
      setError('Sign in failed. Please try again.');
    }
  }, [searchParams]);

  const handleCredentialsSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        username: email.trim(),
        password: password.trim(),
        redirect: false,
      });

      if (result?.error) {
        setError(
          result.error === 'CredentialsSignin'
            ? 'Invalid credentials. Please try again.'
            : result.error,
        );
        setIsLoading(false);
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = () => {
    setIsLoading(true);
    signIn('github', { callbackUrl: '/dashboard' });
  };

  const inputClassName =
    'h-12 w-full rounded-xl border border-white/10 bg-[#111111]/80 pl-11 pr-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#C5A059]/50 focus:ring-2 focus:ring-[#C5A059]/20 disabled:opacity-50';

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <Image
        src="/images/signin-bg.png"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex flex-1 items-center px-4 py-10 sm:px-8 lg:px-14 xl:px-20">
          <div className="grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
            {/* Login card */}
            <div className="mx-auto w-full max-w-md lg:mx-0">
              <div className="rounded-[28px] border border-[#C5A059]/20 bg-[#0f0f0f]/75 p-8 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-10">
                <BrandMark />

                <div className="mt-8 text-center">
                  <h1 className="text-3xl font-semibold tracking-tight text-white">
                    Welcome back
                  </h1>
                  <p className="mt-2 text-sm text-white/55">
                    Sign in to continue to your workspace
                  </p>
                </div>

                {error && (
                  <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                    <p className="text-center text-sm text-red-200">{error}</p>
                  </div>
                )}

                <form onSubmit={handleCredentialsSignIn} className="mt-8 space-y-5">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/85">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        disabled={isLoading}
                        className={inputClassName}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium text-white/85"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-white/35" />
                      <PasswordInput
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        disabled={isLoading}
                        autoComplete="current-password"
                        toggleClassName="text-white/45 hover:text-[#C5A059]"
                        className={`${inputClassName} pl-11 pr-11`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-sm">
                    <label className="flex cursor-pointer items-center gap-2 text-white/55">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-white/20 bg-transparent accent-[#C5A059]"
                      />
                      Remember me
                    </label>
                    <button
                      type="button"
                      className="text-[#C5A059] transition hover:text-[#dfc07a]"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#E8D5A3] via-[#D4AF37] to-[#C5A059] text-sm font-semibold text-[#1A1207] shadow-lg shadow-[#C5A059]/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                </form>

                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs uppercase tracking-[0.25em] text-white/35">or</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <button
                  type="button"
                  onClick={handleGitHubSignIn}
                  disabled={isLoading}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#111111]/80 text-sm font-medium text-white transition hover:border-white/20 hover:bg-[#161616] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Github className="h-4 w-4" />
                  Sign in with GitHub
                </button>

                <p className="mt-8 text-center text-sm text-white/45">
                  Don&apos;t have an account?{' '}
                  <span className="text-[#C5A059]">Contact administrator</span>
                </p>
              </div>
            </div>

            {/* Marketing panel */}
            <div className="hidden lg:block">
              <div className="max-w-xl">
                <h2 className="text-4xl font-semibold leading-tight text-white xl:text-5xl">
                  Built for performance.
                  <br />
                  <span className="text-[#C5A059]">Designed for trust.</span>
                </h2>

                <div className="mt-10 space-y-7">
                  {features.map(({ icon: Icon, title, description }) => (
                    <div key={title} className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/10">
                        <Icon className="h-5 w-5 text-[#C5A059]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">{title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-white/55">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 bg-black/35 px-4 py-4 backdrop-blur-sm sm:px-8 lg:px-14 xl:px-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#C5A059]" />
              <span>
                Secure Connection: Your data is protected with 256-bit SSL encryption
              </span>
            </div>
            <p className="text-center sm:flex-1">
              © {new Date().getFullYear()} IREN CORE. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-5 sm:justify-end">
              <Link href="/" className="transition hover:text-white/75">
                Privacy Policy
              </Link>
              <Link href="/" className="transition hover:text-white/75">
                Terms of Service
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-black text-white">
          Loading...
        </main>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
