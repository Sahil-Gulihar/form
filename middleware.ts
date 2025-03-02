import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  // Skip middleware for login route
  if (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/register") {
    return NextResponse.next();
  }

  // All other routes require authentication
  const isAuthRequired = true;

  if (isAuthRequired) {
    // Get the token from the cookies using the proper Next.js middleware method
    const token = request.cookies.get("auth_token")?.value;

    // If no token or invalid token, redirect to login
    if (!token ) {
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply to all routes - middleware will handle excluding the login route
    "/((?!api/auth|_next|_vercel|favicon.ico|public).*)",
  ],
};
