import type { NextAuthConfig } from "next-auth";

const guestRoutes = ["/", "/login", "/register"];

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log("⭐️");
      const isLoggedIn = !!auth?.user;
      const isOnMainPage = guestRoutes.every(
        (guestRoute) => nextUrl.pathname !== guestRoute
      );
      if (isOnMainPage) {
        console.log("ログイン済み");
        if (isLoggedIn) {
          console.log("アクセスを許可");
          return true;
        }
        console.log("アクセスを拒否");
        return false;
      } else if (isLoggedIn) {
        console.log("未ログイン");
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
