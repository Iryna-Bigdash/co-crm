// import { NextAuthOptions } from 'next-auth';
// import GitHubProvider from 'next-auth/providers/github';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import { GithubProfile } from 'next-auth/providers/github';

// export const options: NextAuthOptions = {
//   theme: {
//     colorScheme: 'dark',
//     brandColor: '#E9D5FF', // Hex color code
//     logo: '/icons/logo.svg', // Absolute URL to image
//     buttonText: '#E9D5FF', // Hex color code
//   },
//   providers: [
//     GitHubProvider({
//       profile(profile: GithubProfile) {
//         // console.log(profile);
//         return {
//           ...profile,
//           role: profile.role ?? 'user',
//           id: profile.id.toString(),
//           image: profile.avatar_url,
//           email: profile.email,
//         };
//       },
//       clientId: process.env.GITHUB_ID as string,
//       clientSecret: process.env.GITHUB_SECRET as string,
//     }),
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         username: {
//           label: 'Username:',
//           type: 'text',
//           placeholder: 'Enter your name',
//         },
//         password: {
//           label: 'Password:',
//           type: 'password',
//           placeholder: 'Enter your password',
//         },
//       },
//       async authorize(credentials) {
//         // This is where you need to retrieve user data
//         // to verify with credentials
//         // Docs: https://next-auth.js.org/configuration/providers/credentials
//         console.log('Credentials Authorize Callback:', credentials); 
//         const user = {
//           id: '28',
//           name: 'Iryna',
//           password: '123456Ira',
//           role: 'admin',
//         };

//         if (
//           credentials?.username === user.name &&
//           credentials?.password === user.password
//         ) {
//           return user;
//         } else {
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     // https://authjs.dev/guides/basics/role-based-access-control#persisting-the-role
//     async jwt({ token, user }) {
//       if (user) token.role = user.role;
//       return token;
//     },
//     // if you want to use role in client components:
//     async session({ session, token }) {
//       if (session?.user) session.user.role = token.role;
//       return session;
//     },
//   },

//   debug: process.env.NODE_ENV === 'development',
// };


import { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { GithubProfile } from 'next-auth/providers/github';

export const options: NextAuthOptions = {
  pages: {
    signIn: '/signin',
  },
  theme: {
    colorScheme: 'dark',
    brandColor: '#E9D5FF', // Hex color code
    logo: '/icons/logo.svg', // Absolute URL to image
    buttonText: '#E9D5FF', // Hex color code
  },
  providers: [
    GitHubProvider({
      profile(profile: GithubProfile) {
        console.log('GitHub Profile:', profile);
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
          placeholder: 'Enter your name',
        },
        password: {
          label: 'Password:',
          type: 'password',
          placeholder: 'Enter your password',
        },
      },
      async authorize(credentials) {
        console.log('Credentials Authorize Callback:', credentials);
        
        try {
          const apiUrl = process.env.NODE_ENV === 'production'
            ? 'https://api-yho4.onrender.com/api'
            : 'http://localhost:3000/api';
          
          const response = await fetch(`${apiUrl}/employees/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: credentials?.username, 
              password: credentials?.password 
            }),
          });

          if (!response.ok) {
            console.log('Authorization failed');
            return null;
          }

          const employee = await response.json();
          console.log('Authorization successful:', employee);
          
          return {
            id: employee.id,
            name: employee.name,
            email: employee.email,
            role: employee.role.toLowerCase(),
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT Callback - Token:', token, 'User:', user);
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback - Session:', session, 'Token:', token);
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === 'development',

  logger: {
    error(code, ...message) {
      console.error('NextAuth Error:', code, ...message);
    },
    warn(code, ...message) {
      console.warn('NextAuth Warning:', code, ...message);
    },
    debug(code, ...message) {
      console.log('NextAuth Debug:', code, ...message);
    },
  },
};


