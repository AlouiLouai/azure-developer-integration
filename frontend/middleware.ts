
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // List of protected routes
  const protectedRoutes = ['/chat', '/channel'];

  // Check if the user is trying to access a protected route
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Check for the presence of the authentication token (HttpOnly cookie)
    const sessionCookie = req.cookies.get('authToken');

    if (!sessionCookie) {
      // If the cookie is not present, redirect to the login page
      const loginUrl = new URL('/', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/chat/:path*', '/channel/:path*'],
};
