import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const pathname = request.nextUrl.pathname;

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/register"];
  
  // Handle public routes
  if (publicRoutes.includes(pathname)) {
    if (token) {
      try {
        // Verify token validity before redirecting
        await verifyToken(token);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch (error) {
        // If token is invalid, proceed to public route
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (!token) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify the token for protected routes
    await verifyToken(token);
    return NextResponse.next();
  } catch (error) {
    // If token verification fails, redirect to login
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    // Apply to all routes except specified exclusions
    "/((?!api/auth|_next|_vercel|favicon.ico|public).*)",
  ],
};