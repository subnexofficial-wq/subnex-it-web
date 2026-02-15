// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("adminToken")?.value;
  const { pathname } = req.nextUrl;

  
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/logo.png") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 🔒 Admin protection
  if (pathname.startsWith("/admin")) {
    const publicAdminPaths = ["/admin", "/admin/register"];

    if (publicAdminPaths.includes(pathname)) {
      if (token) {
        return NextResponse.redirect(
          new URL("/admin/dashboard", req.url)
        );
      }
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], 
};