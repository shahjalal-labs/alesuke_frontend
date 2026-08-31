// middleware.ts (in your root directory)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/pricing',
];

// Define profile setup routes (protected, but redirect to appropriate step)
const PROFILE_SETUP_ROUTES = [
  '/profile-setup',
  '/profile-setup/name',
  '/profile-setup/nickname',
  '/profile-setup/nric',
  '/profile-setup/age',
  '/profile-setup/marital-status',
  '/profile-setup/religion',
  '/profile-setup/get-started',
];

// Define protected routes that require full authentication
const PROTECTED_ROUTES = [
  '/will',
  '/will/preview',
  '/will/checkout',
  '/dashboard',
  '/profile',
  '/settings',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken');
  const userProfile = request.cookies.get('userProfile'); // Optional: check if profile is complete

  // Check if the route is a profile setup route
  const isProfileSetupRoute = PROFILE_SETUP_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  // Check if the route is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  // Check if the route is a public route
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // --- AUTHENTICATION CHECK ---
  
  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // --- PROFILE SETUP ROUTES ---
  
  // If user is on profile setup route
  if (isProfileSetupRoute) {
    // Check if profile is already completed
    const profileComplete = request.cookies.get('profileComplete');
    
    // If profile is complete, redirect to will or dashboard
    if (profileComplete?.value === 'true') {
      const willUrl = new URL('/will', request.url);
      return NextResponse.redirect(willUrl);
    }
    
    // Allow access to profile setup
    return NextResponse.next();
  }

  // --- PROTECTED ROUTES (Will pages, etc.) ---
  
  if (isProtectedRoute) {
    // Check if profile is completed
    const profileComplete = request.cookies.get('profileComplete');
    
    // If profile is not complete, redirect to profile setup
    if (profileComplete?.value !== 'true') {
      const profileUrl = new URL('/profile-setup/get-started', request.url);
      return NextResponse.redirect(profileUrl);
    }
    
    // Allow access to protected route
    return NextResponse.next();
  }

  // For any other routes, check if they need protection
  // Redirect to login by default for unknown routes
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (if you want to handle API auth separately)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};