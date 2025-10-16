import NextAuth from "next-auth";
import credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";
import prisma from "./lib/prisma";
import type { User } from "@prisma/client";
import { authConfig } from "./auth.config";

async function getUser(email: string): Promise<User | null> {
  try {
    return await prisma.user.findFirst({ where: { email } });
  } catch (e) {
    console.error("Failed to fetch user:", e);
    return null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    credentials({
      name: "Credentials",
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(8),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const user = await getUser(email);
        if (!user || !user.password) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email,
          image: user.image ?? null,
        };
      },
    }),
  ],
});
