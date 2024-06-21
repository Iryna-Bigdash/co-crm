// export { default } from "next-auth/middleware";
// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage

import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    console.log('pathname:', request.nextUrl.pathname);
    console.log('token:', request.nextauth.token);

    if( request.nextUrl.pathname.startsWith("/dashboard/settings")
    && request.nextauth.token?.role !== "admin"){
        return NextResponse.rewrite(
            new URL('/dashboard', request.url)
        )
    }

    if( request.nextUrl.pathname.startsWith('/companies/new')
    && request.nextauth.token?.role !== "admin"
    && request.nextauth.token?.role !== "manager"){
        return NextResponse.rewrite(
            new URL('/companies', request.url)
        )
    }
  },
  
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: [
    // '/dashboard',
    '/dashboard/settings',
    // '/companies',
    // '/companies/:id*',
    '/companies/new',
    // '/companies/:id*/new-promotion',
  ],
};
