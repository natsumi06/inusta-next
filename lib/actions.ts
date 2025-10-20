"use server";
import { z } from "zod";
import { signIn, signOut, auth } from "./../auth";
import { AuthError } from "next-auth";

/**
 * Server Actions
 * - registerUser: 会員登録（重複チェック・bcryptハッシュ）
 * - updatePost: 投稿編集（本人の投稿のみ）
 * - deletePost: 投稿削除（本人の投稿のみ）
 * - createComment: コメント作成（投稿存在チェック）
 * - updateMe: プロフィール編集（name/description/画像差し替え対応）
 * - createPost: 投稿作成（Vercel Blobへの画像アップロード込み）
 */

import prisma from "./../lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { put } from "@vercel/blob";

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
  console.log(formData.get("message"));
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
    return {
      errors: {},
      message: "ユーザー登録に成功しました。",
    };
  } catch (error) {
    console.error(error);
    throw new Error("ユーザー登録に失敗しました。");
  }
}

/**
 * 投稿編集（本人の投稿のみ）
 * 編集後はダッシュボードを再検証してダッシュボードへ遷移
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

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

/**
 * 投稿削除（本人の投稿のみ）
 * 削除後はダッシュボードを再検証してダッシュボードへ遷移
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

  revalidatePath("/dashboard");
  redirect("/dashboard");
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
  redirect(`/posts/${postId}`);
}

/**
 * プロフィール編集
 * name/description を更新
 * 画像はフォームに file があれば Blob にアップして差し替え
 * 更新後はダッシュボードを再検証してダッシュボードへ遷移
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

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

/**
 * 投稿作成（画像アップロードあり）
 * 画像を Blob にアップ → 投稿保存 → ダッシュボード再検証 → ダッシュボードへ遷移
 */
export async function createPost(formData: FormData) {
  const session = await auth();
  const email = session?.user?.email || "";
  const caption = formData.get("caption") as string;
  const imageFile = formData.get("image") as File;
  const blob = await put(imageFile.name, imageFile, {
    access: "public",
  });

  const user = await prisma.user.findFirstOrThrow({
    where: { email },
  });

  await prisma.post.create({
    data: {
      caption,
      image: blob.url,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
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
