import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';
import { Interface } from 'readline';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      email: string; // Додаємо email
      image?: string;
      name: string;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: string;
  }
}
