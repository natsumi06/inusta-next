// middleware.ts
export { auth as middleware } from "./auth";

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.gif$|.*\\.svg$).*)",
//   ],
// };
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
