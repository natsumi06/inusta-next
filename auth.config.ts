import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

const guestRoutes = ["/", "/login", "/register"];

export const authConfig = {
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { nextUrl, method } = request;
      const isLoggedIn = !!auth?.user;

      // Allow non-GET methods to be handled explicitly if needed
      // (optional: tighten for POST/PUT/PATCH/DELETE with token checks)
      if (method !== "GET") return !!isLoggedIn;

      const isGuestRoute = guestRoutes.includes(nextUrl.pathname);

      // If user is logged in and on a guest route, send them to dashboard
      if (isLoggedIn && isGuestRoute) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }

      // If user is not logged in and is visiting a protected route, block
      if (!isLoggedIn && !isGuestRoute) {
        return false;
      }

      // Otherwise allow
      return true;
    },
  },
  // Other global options (cookies/debug/logger/theme etc.) can be set here
} satisfies NextAuthConfig;
