import NextAuth from "next-auth";
import { authConfig } from "./../auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$).*)"],
};

// export const middleware = (req: NextRequest) => {
//   const { pathname } = req.nextUrl;

//   if (pathname === "/login") {
//     // 例: 未認証なら /home へリダイレクト
//     return NextResponse.redirect(new URL("/home", req.url));
//   }

//   return NextResponse.next();
// };
