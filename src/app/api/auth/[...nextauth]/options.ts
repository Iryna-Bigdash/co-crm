import { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { GithubProfile } from 'next-auth/providers/github';
import { getApiHeaders, getApiOrigin } from '@/lib/config';

function getAllowedGithubEmails(): string[] {
  return (process.env.GITHUB_ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
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
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);

          const email = credentials?.username?.trim();
          const password = credentials?.password?.trim();

          const response = await fetch(`${getApiOrigin()}/api/employees/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getApiHeaders(),
            },
            body: JSON.stringify({
              email,
              password,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeout);

          if (!response.ok) {
            return null;
          }

          const employee = await response.json();

          return {
            id: employee.id,
            name: employee.name,
            email: employee.email,
            role: employee.role.toLowerCase(),
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'github') {
        return true;
      }

      const allowedEmails = getAllowedGithubEmails();
      const email = user.email?.toLowerCase();

      if (process.env.NODE_ENV === 'production' && allowedEmails.length === 0) {
        return false;
      }

      if (allowedEmails.length > 0 && (!email || !allowedEmails.includes(email))) {
        return false;
      }

      return true;
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
