import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface User {
  role: string;
  sponsorStatus?: string;
}

export function proxy(request: NextRequest) {
  const loginRoute = `${request.nextUrl.origin}/login`;
  const homeRoute = `${request.nextUrl.origin}/`;
  const currentPath = request.nextUrl.pathname;

  // Private route PREFIXES — anything starting with these is protected.
  // This automatically covers every nested page under /will (assets,
  // caretakers-of-pets, checkout, digital-assets, divide-estate, executor,
  // gifts, preview, you-and-your-family/*, etc.) without listing each one.
  const privatePrefixes = [
    "/profile-setup", // covers /profile-setup/name, /nric, /age, ...
    "/will",          // covers /will/assets/add-financials, /will/preview, /will/checkout, ...
    "/my-profile",
  ];

  // Public routes — accessible without authentication (exact match)
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/reset-password",
    "/verification",
    "/new-password",
    "/pricing",
    "/how-it-works",
    "/privacy-policy",
    "/terms-of-use",
  ];

  const token = request.cookies.get("accessToken")?.value;

  // Authenticated user hitting /login -> send home
  if (currentPath === "/login" && token) {
    try {
      jwtDecode<User>(token);
      return NextResponse.redirect(new URL(homeRoute, request.url));
    } catch {
      const response = NextResponse.next();
      response.cookies.delete("accessToken");
      return response;
    }
  }

  const isPrivateRoute = privatePrefixes.some(
    (prefix) => currentPath === prefix || currentPath.startsWith(`${prefix}/`)
  );

  const isPublicRoute = publicRoutes.includes(currentPath);

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL(loginRoute, request.url));
  }

  if (isPrivateRoute && token) {
    try {
      jwtDecode<User>(token);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL(loginRoute, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match everything EXCEPT: api routes, Next's static/image optimizer
  // assets, and common static files. This is what stops the image route
  // (and other static assets) from ever being routed through auth logic.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};