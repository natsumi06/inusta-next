"use server";

/**
 * 設定 › 会員情報の Server Actions
 * - changeEmail: メールアドレス変更（いまのパスワードで本人確認）
 * - changePassword: パスワード変更（いまのパスワードで本人確認）
 * - deleteAccount: 退会（投稿・コメント・プロフィールを消す）
 */

import { z } from "zod";
import bcrypt from "bcrypt";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "./prisma";
import { auth, signIn, signOut } from "./../auth";

const PASSWORD_MIN_LENGTH = 8;

export type AccountFormState = {
  errors?: Record<string, string[] | undefined>;
  message?: string | null;
};

/** ログイン中の人を取り出し、いまのパスワードが合っているか確かめる */
async function verifyCurrentUser(currentPassword: string) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/login");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) redirect("/login");
  const matches = await bcrypt.compare(currentPassword, user.password);
  return { user, matches };
}

const WRONG_PASSWORD = "いまのパスワードが正しくありません。";

const ChangeEmailSchema = z.object({
  email: z.string().trim().email("メールアドレスの形式が正しくありません。"),
  currentPassword: z.string().min(1, "いまのパスワードを入力してください。"),
});

export async function changeEmail(
  _state: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const parsed = ChangeEmailSchema.safeParse({
    email: formData.get("email"),
    currentPassword: formData.get("currentPassword"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { email, currentPassword } = parsed.data;
  const { user, matches } = await verifyCurrentUser(currentPassword);
  if (!matches) return { errors: { currentPassword: [WRONG_PASSWORD] } };
  if (email === user.email) {
    return { errors: { email: ["いまと同じメールアドレスです。"] } };
  }
  const taken = await prisma.user.findUnique({ where: { email } });
  if (taken) {
    return {
      errors: { email: ["このメールアドレスはすでに使われています。"] },
    };
  }

  await prisma.user.update({ where: { id: user.id }, data: { email } });

  // ログイン中の情報はメールアドレスで持っているので、新しいメールアドレスでログインし直す
  await signIn("credentials", {
    email,
    password: currentPassword,
    redirectTo: "/mypage/settings?done=email",
  });
  redirect("/mypage/settings?done=email");
}

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "いまのパスワードを入力してください。"),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "パスワードは8文字以上で設定してください。"),
    passwordConfirmation: z.string(),
  })
  .refine((args) => args.password === args.passwordConfirmation, {
    message: "新しいパスワードと確認用パスワードが一致しません。",
    path: ["passwordConfirmation"],
  });

export async function changePassword(
  _state: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const parsed = ChangePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { currentPassword, password } = parsed.data;
  const { user, matches } = await verifyCurrentUser(currentPassword);
  if (!matches) return { errors: { currentPassword: [WRONG_PASSWORD] } };
  if (await bcrypt.compare(password, user.password)) {
    return { errors: { password: ["いまと同じパスワードです。"] } };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { password: await bcrypt.hash(password, 10) },
  });

  redirect("/mypage/settings?done=password");
}

/** Vercel Blob に置いた画像か（シードの /dogs/... などは消さない） */
function isBlobUrl(url: string) {
  try {
    return new URL(url).hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export async function deleteAccount() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/login");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) redirect("/login");

  const posts = await prisma.post.findMany({
    where: { userId: user.id },
    select: { image: true },
  });
  const imageUrls = [user.image, ...posts.map((post) => post.image)].filter(
    (url): url is string => !!url && isBlobUrl(url),
  );

  // 投稿とコメントは onDelete: Cascade でいっしょに消える
  await prisma.user.delete({ where: { id: user.id } });

  // 同じ名前でアップロードした画像はほかの人と URL が重なることがあるので、
  // もう誰も使っていない画像だけを消す。消せなくても退会は済んでいるので止めない
  const stillUsed = await prisma.post.findMany({
    where: { image: { in: imageUrls } },
    select: { image: true },
  });
  const stillUsedIcons = await prisma.user.findMany({
    where: { image: { in: imageUrls } },
    select: { image: true },
  });
  const used = new Set([
    ...stillUsed.map((post) => post.image),
    ...stillUsedIcons.map((icon) => icon.image),
  ]);
  const unused = [...new Set(imageUrls)].filter((url) => !used.has(url));
  if (unused.length > 0) {
    try {
      await del(unused);
    } catch (error) {
      console.error("Failed to delete blobs:", error);
    }
  }

  revalidatePath("/home");
  revalidatePath("/users");
  await signOut({ redirectTo: "/goodbye" });
  redirect("/goodbye");
}
