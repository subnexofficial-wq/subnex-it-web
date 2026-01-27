// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("adminToken")?.value;
  const { pathname } = req.nextUrl;


  const publicAdminPaths = ["/admin", "/admin/register"];


  if (publicAdminPaths.includes(pathname)) {

    if (token) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }
 

  if (!token) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {

  matcher: ["/admin/:path*"],
};