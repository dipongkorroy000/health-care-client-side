"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { getDefaultDashboardRoute, getRouteOwner, UserRole } from "./lib/auth-utils";

// when user login -then again call these paths -> redirect role wise dashboard
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
const isAuthRoute = (pathname: string) => authRoutes.some((route: string) => route === pathname);

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();

  const pathname = request.nextUrl.pathname;
  let userRole: UserRole | null = null;

  const accessToken = request.cookies.get("accessToken")?.value || null;
  if (accessToken) {
    const verifiedToken: JwtPayload | string = jwt.verify(accessToken, process.env.JWT_SECRET as string);

    if (typeof verifiedToken === "string") {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      return NextResponse.redirect(new URL("/login", request.url));
    }
    userRole = verifiedToken.role;
  }

  // Rule 1 : User is logged in and trying to access auth route. Redirect to default dashboard
  if (accessToken && isAuthRoute(pathname))
    return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));

  // Rule 2 : User is trying to access open public route
  if (getRouteOwner(pathname) === null) return NextResponse.next();

  // Rule 1 & 2 for open public routes and auth routes

  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rule 3 : User is trying to access common protected route
  if (getRouteOwner(pathname) === "COMMON") return NextResponse.next();

  // Rule 4 : User is trying to access role based protected route
  // first check user is doctor | patient | admin is -- then
  // example -> doctor call this path-> /admin/dashboard -> redirect-> /doctor/dashboard
  if (
    (getRouteOwner(pathname) === "ADMIN" || getRouteOwner(pathname) === "DOCTOR" || getRouteOwner(pathname) === "PATIENT") &&
    getRouteOwner(pathname) !== userRole
  )
    return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/",
// };

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
