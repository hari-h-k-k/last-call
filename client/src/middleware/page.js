import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();

  // Allow public pages
  if (url.pathname.startsWith("/login") || url.pathname.startsWith("/signup")) {
    return NextResponse.next();
  }

  // Protected routes will be handled by client-side redirection
  return NextResponse.next();
}

export const config = {
  matcher: ["/home"],
};
