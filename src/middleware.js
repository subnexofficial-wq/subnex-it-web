// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("adminToken")?.value;
  const { pathname } = req.nextUrl;


  const publicAdminPaths = ["/admin", "/admin/register"];

  if (pathname.startsWith("/admin")) {
    
    
    if (publicAdminPaths.includes(pathname)) {
      if (token) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
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
  /*
   * matcher-এ আমরা সব রুট ধরছি কিন্তু নেগেটিভ লুক-অ্যাহেড দিয়ে
   * ইমেজ, স্ট্যাটিক ফাইল এবং এপিআই রুটগুলোকে বাদ দিচ্ছি।
   */
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg).*)',
  ],
};