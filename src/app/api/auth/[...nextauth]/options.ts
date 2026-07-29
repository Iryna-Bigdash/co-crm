import { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { GithubProfile } from 'next-auth/providers/github';
import { getApiHeaders, getApiOrigin, getAuthRequestTimeoutMs } from '@/lib/config';

interface BackendEmployee {
  id: string;
  email: string;
  role: string;
}

function getAllowedGithubEmails(): string[] {
  return (process.env.GITHUB_ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

async function findBackendEmployeeByEmail(email: string): Promise<BackendEmployee | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), getAuthRequestTimeoutMs());

  try {
    const response = await fetch(`${getApiOrigin()}/api/employees`, {
      headers: getApiHeaders() as Record<string, string>,
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const employees = (await response.json()) as BackendEmployee[];
    return (
      employees.find((employee) => employee.email.toLowerCase() === email) ?? null
    );
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export const options: NextAuthOptions = {
  pages: {
    signIn: '/signin',
  },
  theme: {
    colorScheme: 'dark',
    brandColor: '#E9D5FF',
    logo: '/icons/logo.svg',
    buttonText: '#E9D5FF',
  },
  providers: [
    GitHubProvider({
      profile(profile: GithubProfile) {
        return {
          ...profile,
          role: 'admin',
          id: profile.id.toString(),
          image: profile.avatar_url,
          email: profile.email,
        };
      },
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Username:',
          type: 'text',
          placeholder: 'Enter your email',
        },
        password: {
          label: 'Password:',
          type: 'password',
          placeholder: 'Enter your password',
        },
      },
      async authorize(credentials) {
        const email = credentials?.username?.trim();
        const password = credentials?.password?.trim();

        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        const controller = new AbortController();
        const timeoutMs = getAuthRequestTimeoutMs();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        try {
          const response = await fetch(`${getApiOrigin()}/api/employees/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(getApiHeaders() as Record<string, string>),
            },
            body: JSON.stringify({ email, password }),
            signal: controller.signal,
            cache: 'no-store',
          });

          if (response.status === 401) {
            return null;
          }

          if (!response.ok) {
            throw new Error('Authentication service is unavailable. Please try again.');
          }

          const employee = await response.json();

          return {
            id: employee.id,
            name: employee.name,
            email: employee.email,
            role: employee.role.toLowerCase(),
          };
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            throw new Error(
              'Server is waking up. Wait about a minute and try again.',
            );
          }

          if (error instanceof Error && error.message) {
            throw error;
          }

          throw new Error('Unable to connect to authentication service.');
        } finally {
          clearTimeout(timeout);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'github') {
        return true;
      }

      const email = user.email?.toLowerCase();
      if (!email) {
        return false;
      }

      const allowedEmails = getAllowedGithubEmails();
      if (allowedEmails.includes(email)) {
        return true;
      }

      const employee = await findBackendEmployeeByEmail(email);
      if (employee && ['ADMIN', 'MANAGER'].includes(employee.role)) {
        user.id = employee.id;
        user.role = employee.role.toLowerCase();
        return true;
      }

      if (process.env.NODE_ENV !== 'production') {
        return true;
      }

      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === 'development',
};
