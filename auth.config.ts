import type { NextAuthConfig } from "next-auth";

const guestRoutes = ["/", "/login", "/register", "/register/complete"];

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isRegisterComplete = nextUrl.pathname === "/register/complete";
      const isOnMainPage = guestRoutes.every(
        (guestRoute) => nextUrl.pathname !== guestRoute
      );
      if (isRegisterComplete) return true;
      if (isOnMainPage) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
