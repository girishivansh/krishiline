import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isRouteAllowedForRole, type UserRole } from "@/lib/auth/rbac";

export const SESSION_COOKIE_NAME = "krishiline_session";
export const ROLE_COOKIE_NAME = "krishiline_role";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected paths check
  const isProtectedPath = pathname.startsWith("/roles");

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const role = request.cookies.get(ROLE_COOKIE_NAME)?.value as UserRole | undefined;

  // Unauthenticated user trying to access protected role portal
  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If role is known from the authenticated session cookie, verify RBAC permissions
  if (role) {
    const allowed = isRouteAllowedForRole(role, pathname);
    if (!allowed) {
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      unauthorizedUrl.searchParams.set("attempted", pathname);
      unauthorizedUrl.searchParams.set("role", role);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/roles/:path*",
  ],
};
