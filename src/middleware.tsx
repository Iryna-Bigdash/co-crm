import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const role = request.nextauth.token?.role;
    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith('/dashboard/settings') && role !== 'admin') {
      return NextResponse.rewrite(new URL('/denied', request.url));
    }

    if (
      (pathname.startsWith('/managers') || pathname.startsWith('/manager-assignments')) &&
      role !== 'admin'
    ) {
      return NextResponse.rewrite(new URL('/denied', request.url));
    }

    if (
      pathname.startsWith('/companies/new') &&
      role !== 'admin' &&
      role !== 'manager'
    ) {
      return NextResponse.rewrite(new URL('/denied', request.url));
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
    '/dashboard/:path*',
    '/companies/:path*',
    '/managers/:path*',
    '/manager-assignments/:path*',
    '/calendar/:path*',
  ],
};
