"use server";
import { z } from "zod";
import { signIn, signOut, auth } from "./../auth";
import { AuthError } from "next-auth";

/**
 * Server Actions
 * - registerUser: 会員登録（重複チェック・bcryptハッシュ）
 * - saveDisplayName / saveIcon / saveBio: 会員登録後のプロフィール設定（1画面1問）
 * - updatePost: 投稿編集（本人の投稿のみ）
 * - deletePost: 投稿削除（本人の投稿のみ）
 * - createComment: コメント作成（投稿存在チェック）
 * - updateProfile: プロフィール編集（アイコン・表示名・自己紹介）
 * - createPost: 投稿作成（Vercel Blobへの画像アップロード込み）
 * - consumeWelcome: 歓迎モーダルの表示済み処理（印のCookieを消す）
 */

import prisma from "./../lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { WELCOME_COOKIE } from "./welcome";
import { provisionalName } from "./display-name";
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
    },
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
    },
  );

type RegisterUserState = {
  errors?: {
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
  formData: FormData,
): Promise<RegisterUserState> {
  const validatedFields = await RegisterUserSchema.safeParseAsync({
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

  const { email, password } = validatedFields.data;
  // 表示名はつぎの画面で決めてもらう。それまではメールの@より前を仮の名前にする
  const name = provisionalName(email);

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
    redirectTo: "/register/name?registered=1",
  });

  redirect("/register/name?registered=1");
}

type ProfileStepState = {
  message?: string | null;
};

async function requireEmail() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/login");
  return email;
}

/**
 * 会員登録後 1問目: 表示名（必須）
 */
export async function saveDisplayName(
  _state: ProfileStepState,
  formData: FormData,
): Promise<ProfileStepState> {
  const email = await requireEmail();

  const name = ((formData.get("name") as string) ?? "").trim();
  if (!name) return { message: "表示名を入力してください。" };
  if (name.length > 30)
    return { message: "表示名は30文字以内にしてください。" };

  await prisma.user.update({ where: { email }, data: { name } });

  revalidatePath("/users");
  revalidatePath("/mypage");
  redirect("/register/icon");
}

/**
 * 会員登録後 2問目: アイコン（写真を選ばなければそのまま次へ）
 */
export async function saveIcon(
  _state: ProfileStepState,
  formData: FormData,
): Promise<ProfileStepState> {
  const email = await requireEmail();

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
    await prisma.user.update({ where: { email }, data: { image: blob.url } });

    revalidatePath("/users");
    revalidatePath("/mypage");
  }

  redirect("/register/bio");
}

/** マイページのモーダルで使う。保存できたら ok を返し、モーダルを閉じる */
export type ProfileModalState = {
  message?: string | null;
  ok?: boolean;
};

/**
 * マイページのアイコンを押すと開くモーダル: アイコンだけ変える
 */
export async function updateIcon(
  _state: ProfileModalState,
  formData: FormData,
): Promise<ProfileModalState> {
  const email = await requireEmail();

  const imageFile = formData.get("image") as File | null;
  if (!imageFile || imageFile.size === 0) {
    return { message: "写真を選んでください。" };
  }
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
  await prisma.user.update({ where: { email }, data: { image: blob.url } });

  revalidatePath("/users");
  revalidatePath("/mypage");
  return { ok: true };
}

/**
 * マイページの「自己紹介を追加／変更」で開くモーダル: 自己紹介だけ変える
 */
export async function updateBio(
  _state: ProfileModalState,
  formData: FormData,
): Promise<ProfileModalState> {
  const email = await requireEmail();

  const description = ((formData.get("description") as string) ?? "").trim();
  if (description.length > 500) {
    return { message: "自己紹介は500文字以内にしてください。" };
  }
  await prisma.user.update({ where: { email }, data: { description } });

  revalidatePath("/users");
  revalidatePath("/mypage");
  return { ok: true };
}

/**
 * 会員登録後 3問目: 自己紹介
 */
export async function saveBio(
  _state: ProfileStepState,
  formData: FormData,
): Promise<ProfileStepState> {
  const email = await requireEmail();

  const description = ((formData.get("description") as string) ?? "").trim();
  if (description.length > 500) {
    return { message: "自己紹介は500文字以内にしてください。" };
  }

  await prisma.user.update({ where: { email }, data: { description } });

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

/** プロフィール編集（アイコン・表示名・自己紹介）。保存できたら ok を返す */
export type ProfileEditState = {
  errors?: { name?: string[]; description?: string[]; image?: string[] };
  ok?: boolean;
};

/**
 * プロフィール編集: アイコン・表示名・自己紹介をまとめて保存
 * メールアドレスとパスワードは設定 › 会員情報で変える
 */
export async function updateProfile(
  _state: ProfileEditState,
  formData: FormData,
): Promise<ProfileEditState> {
  const email = await requireEmail();

  const name = ((formData.get("name") as string) ?? "").trim();
  const description = ((formData.get("description") as string) ?? "").trim();
  const errors: ProfileEditState["errors"] = {};
  if (!name) errors.name = ["表示名を入力してください。"];
  else if (name.length > 30)
    errors.name = ["表示名は30文字以内にしてください。"];
  if (description.length > 500) {
    errors.description = ["自己紹介は500文字以内にしてください。"];
  }

  const imageFile = formData.get("image") as File | null;
  const hasImage = !!imageFile && imageFile.size > 0;
  if (hasImage && !ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
    errors.image = ["対応する形式：JPEG, PNG, WebP, GIF"];
  } else if (hasImage && imageFile.size > MAX_IMAGE_SIZE) {
    errors.image = ["画像は5MB以下にしてください。"];
  }
  if (Object.keys(errors).length > 0) return { errors };

  const data: { name: string; description: string; image?: string } = {
    name,
    description,
  };
  if (hasImage) {
    const blob = await put(imageFile.name, imageFile, {
      access: "public",
      addRandomSuffix: true,
    });
    data.image = blob.url;
  }

  await prisma.user.update({ where: { email }, data });

  revalidatePath("/mypage");
  revalidatePath("/users");
  revalidatePath("/home");
  return { ok: true };
}

export type PostCreateState = {
  errors?: { image?: string[]; caption?: string[] };
  message?: string | null;
  /** 投稿できたら、その投稿の id（画面側で投稿の詳細へ進む） */
  postId?: string;
};

const CAPTION_MAX_LENGTH = 500;

/**
 * 投稿作成（画像アップロードあり）
 * 画像を Blob にアップ → 投稿保存 → 一覧を再検証 → 投稿の id を返す（詳細へは画面側で進む）
 */
export async function createPost(
  _state: PostCreateState,
  formData: FormData,
): Promise<PostCreateState> {
  const email = await requireEmail();
  const caption = ((formData.get("caption") as string) ?? "").trim();
  const imageFile = formData.get("image");

  if (!(imageFile instanceof File) || imageFile.size === 0) {
    return { errors: { image: ["写真を選んでください。"] } };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
    return { errors: { image: ["対応する形式：JPEG, PNG, WebP, GIF"] } };
  }
  if (imageFile.size > MAX_IMAGE_SIZE) {
    return { errors: { image: ["写真は5MB以下にしてください。"] } };
  }
  if (caption.length > CAPTION_MAX_LENGTH) {
    return { errors: { caption: ["ひとことは500文字以内にしてください。"] } };
  }

  const user = await prisma.user.findFirstOrThrow({ where: { email } });

  let imageUrl: string;
  try {
    const blob = await put(imageFile.name, imageFile, {
      access: "public",
      allowOverwrite: true,
    });
    imageUrl = blob.url;
  } catch (error) {
    console.error("Failed to upload image:", error);
    return {
      message: "写真をアップロードできませんでした。もう一度お試しください。",
    };
  }

  const post = await prisma.post.create({
    data: { caption, image: imageUrl, userId: user.id },
  });

  revalidatePath("/mypage");
  revalidatePath("/home");
  revalidatePath("/users");
  return { postId: post.id };
}

/**
 * 認証処理を行う関数
 */
export async function authenticate(
  state: string | undefined,
  formData: FormData,
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
