"use server";
import { z } from "zod";
import { signIn, signOut, auth } from "./../auth";
import { AuthError } from "next-auth";

/**
 * Server Actions
 * - registerUser: 会員登録（重複チェック・bcryptハッシュ）
 * - setupProfile: 会員登録後のプロフィール設定
 * - updatePost: 投稿編集（本人の投稿のみ）
 * - deletePost: 投稿削除（本人の投稿のみ）
 * - createComment: コメント作成（投稿存在チェック）
 * - updateMe: プロフィール編集（name/description/画像差し替え対応）
 * - createPost: 投稿作成（Vercel Blobへの画像アップロード込み）
 * - consumeWelcome: 歓迎モーダルの表示済み処理（印のCookieを消す）
 */

import prisma from "./../lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { WELCOME_COOKIE } from "./welcome";
import bcrypt from "bcrypt";
import { put } from "@vercel/blob";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const RegisterUserSchema = z
  .object({
    name: z.string().min(1, "ユーザ名は必須です。"),
    email: z.string().email("メールアドレスの形式が正しくありません。"),
    password: z.string().min(8, "パスワードは8文字以上で設定してください。"),
    passwordConfirmation: z
      .string()
      .min(8, "確認用パスワードは8文字以上で設定してください。"),
  })
  .refine(
    (args) => {
      const { password, passwordConfirmation } = args;
      return password === passwordConfirmation;
    },
    {
      message: "パスワードと確認用パスワードが一致しません。",
      path: ["passwordConfirmation"],
    }
  )
  .refine(
    async (args) => {
      const { email } = args;
      const user = await prisma.user.findFirst({ where: { email } });
      return !user;
    },
    {
      message: "このメールアドレスはすでに使われています。",
      path: ["email"],
    }
  );

type RegisterUserState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    passwordConfirmation?: string[];
  };
  message?: string | null;
};

export async function action(formData: FormData) {
  console.log("送信");
}

/**
 * 会員登録
 * 成功時: 戻り値なし（フォーム側で遷移やメッセージ制御）
 * 失敗時: 日本語エラーメッセージ文字列を返す
 */
export async function registerUser(
  _state: RegisterUserState,
  formData: FormData
): Promise<RegisterUserState> {
  const validatedFields = await RegisterUserSchema.safeParseAsync({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "ユーザー登録に失敗しました。",
    };
  }

  const { name, email, password } = validatedFields.data;

  const bcryptedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: bcryptedPassword,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("ユーザー登録に失敗しました。");
  }

  revalidatePath("/users");

  // はじめてのホームで歓迎モーダルを出すための印
  (await cookies()).set(WELCOME_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/register/profile",
  });

  redirect("/register/profile");
}

type SetupProfileState = {
  message?: string | null;
};

/**
 * 会員登録の2ステップ目: プロフィール設定（表示名・ひとこと・アイコン）
 * 保存後は準備完了画面へ
 */
export async function setupProfile(
  _state: SetupProfileState,
  formData: FormData
): Promise<SetupProfileState> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/login");

  const name = ((formData.get("name") as string) ?? "").trim();
  if (!name) return { message: "表示名を入力してください。" };

  const data: { name: string; description: string; image?: string } = {
    name,
    description: ((formData.get("description") as string) ?? "").trim(),
  };

  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      return { message: "対応する形式：JPEG, PNG, WebP, GIF" };
    }
    if (imageFile.size > MAX_IMAGE_SIZE) {
      return { message: "画像は5MB以下にしてください。" };
    }
    const blob = await put(imageFile.name, imageFile, {
      access: "public",
      addRandomSuffix: true,
    });
    data.image = blob.url;
  }

  await prisma.user.update({ where: { email }, data });

  revalidatePath("/users");
  revalidatePath("/mypage");
  redirect("/register/complete");
}

/**
 * 歓迎モーダルを表示したら印を消す（リロードや再訪では出さない）
 */
export async function consumeWelcome() {
  (await cookies()).delete(WELCOME_COOKIE);
}

/**
 * 投稿編集（本人の投稿のみ）
 * 編集後はマイページを再検証してマイページへ遷移
 */
export async function updatePost(id: string, formData: FormData) {
  const caption = formData.get("caption") as string;
  const session = await auth();
  const email = session?.user?.email || "";

  if (!caption) {
    throw new Error("キャプションが未入力です。");
  }

  const user = await prisma.user.findFirstOrThrow({
    where: { email },
  });

  await prisma.post.update({
    where: { id, userId: user.id },
    data: { caption },
  });

  revalidatePath("/mypage");
  revalidatePath("/home");
  redirect("/mypage");
}

/**
 * 投稿削除（本人の投稿のみ）
 * 削除後はマイページを再検証してマイページへ遷移
 */
export async function deletePost(id: string, _formData: FormData) {
  const session = await auth();
  const email = session?.user?.email || "";

  const user = await prisma.user.findFirstOrThrow({
    where: { email },
  });

  await prisma.post.delete({
    where: { id, userId: user.id },
  });

  revalidatePath("/mypage");
  revalidatePath("/home");
  revalidatePath("/users");
  redirect("/mypage");
}

/**
 * コメント作成
 * 作成後は該当投稿ページを再検証して同ページへ遷移
 */
export async function createComment(postId: string, formData: FormData) {
  const text = formData.get("text") as string;
  const session = await auth();
  const email = session?.user?.email || "";

  if (!text) {
    throw new Error("コメントが未入力です。");
  }

  const user = await prisma.user.findFirstOrThrow({
    where: { email },
  });

  const post = await prisma.post.findFirstOrThrow({
    where: { id: postId },
  });

  await prisma.comment.create({
    data: {
      text,
      userId: user.id,
      postId: post.id,
    },
  });

  revalidatePath(`/posts/${postId}`);
  revalidatePath("/home");
  redirect(`/posts/${postId}`);
}

/**
 * プロフィール編集
 * name/description を更新
 * 画像はフォームに file があれば Blob にアップして差し替え
 * 更新後はマイページを再検証してマイページへ遷移
 */
export async function updateMe(formData: FormData) {
  const session = await auth();
  const email = session?.user?.email || "";
  const user = await prisma.user.findFirstOrThrow({
    where: { email },
  });

  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    image: user.image,
  };

  const imageFile = formData.get("image") as File;
  if (imageFile.size > 0) {
    const blob = await put(imageFile.name, imageFile, {
      access: "public",
      allowOverwrite: true,
    });
    data.image = blob.url;
  }

  await prisma.user.update({
    where: { email },
    data,
  });

  revalidatePath("/mypage");
  revalidatePath("/users");
  redirect("/mypage");
}

/**
 * 投稿作成（画像アップロードあり）
 * 画像を Blob にアップ → 投稿保存 → マイページ再検証 → マイページへ遷移
 */
export async function createPost(formData: FormData) {
  const session = await auth();
  const email = session?.user?.email || "";
  const caption = formData.get("caption") as string;
  const imageFile = formData.get("image");

  if (!(imageFile instanceof File) || imageFile.size === 0) {
    throw new Error("画像を選択してください");
  }

  if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
    throw new Error("対応する形式：JPEG, PNG, WebP, GIF");
  }

  if (imageFile.size > MAX_IMAGE_SIZE) {
    throw new Error("ファイルサイズは5MB以下にしてください");
  }

  const blob = await put(imageFile.name, imageFile, {
    access: "public",
    allowOverwrite: true,
  });

  const user = await prisma.user.findFirstOrThrow({
    where: { email },
  });

  const post = await prisma.post.create({
    data: {
      caption,
      image: blob.url,
      userId: user.id,
    },
  });

  revalidatePath("/mypage");
  revalidatePath("/home");
  revalidatePath("/users");
  redirect(`/posts/${post.id}`);
}

/**
 * 認証処理を行う関数
 */
export async function authenticate(
  state: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "メールアドレスまたはパスワードが正しくありません。";
        default:
          return "エラーが発生しました。";
      }
    }
    throw error;
  }
}

/**
 * ログアウト処理を行う関数
 * セッションを終了し、ログインページへリダイレクトする
 */
export async function logout() {
  await signOut();
  redirect("/login");
}

/**
 * 追加の投稿を読み込む（ページネーション用）
 * @param offset スキップする件数
 */
export async function loadMorePosts(offset: number) {
  try {
    const { fetchLatestPosts } = await import("./apis");
    const posts = await fetchLatestPosts(offset, 20);
    return posts;
  } catch (error) {
    console.error("Failed to load more posts:", error);
    throw new Error("投稿の読み込みに失敗しました");
  }
}
