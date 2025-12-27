import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Get the token from cookies
  // Replace 'sb-access-token' with your actual cookie name
  const token = request.cookies.get('__ZUME__')?.value; 

  // 2. Define paths that logged-in users shouldn't see
  const authRoutes = ['/login', '/signup', '/register'];
  
  // 3. Check if user is on an auth route AND has a token
  if (authRoutes.includes(request.nextUrl.pathname) && token) {
    // Redirect to Dashboard
    return NextResponse.redirect(new URL('/zume/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which paths this middleware runs on
export const config = {
  matcher: ['/login', '/signup', '/register'],
}