// lib/actions.ts
"use server";

/**
 * Server Actions 統合版
 * - registerUser: 会員登録（重複チェック・bcryptハッシュ）
 * - updatePost: 投稿編集（本人の投稿のみ）
 * - deletePost: 投稿削除（本人の投稿のみ）
 * - createComment: コメント作成（投稿存在チェック）
 * - updateMe: プロフィール編集（name/description/画像差し替え対応）
 * - createPost: 投稿作成（Vercel Blobへの画像アップロード込み）
 *
 * 注意:
 * - 認証未導入のため、一時的に email = "user+1@example.com" を使用。
 *   本番導入時は Auth.js などのセッションからユーザー情報を取得して置き換えてください。
 * - 画像アップロードには @vercel/blob を使用します。next.config.mjs の images.remotePatterns に Blob のホスト名を追加してください。
 * - .env.local に DB 接続文字列を設定し、キーやURLはコードに直書きしないでください。
 */

import prisma from "./../lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { put } from "@vercel/blob";
import { error } from "console";

export async function action(formData: FormData) {
  console.log(formData.get("message"));
}
/**
 * 会員登録
 * 成功時: 戻り値なし（フォーム側で遷移やメッセージ制御）
 * 失敗時: 日本語エラーメッセージ文字列を返す
 */
export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const passwordConfirmation = formData.get("passwordConfirmation") as string;

  if (!name || !email || !password || !passwordConfirmation) {
    throw new Error("未入力の項目があります。");
  }

  const exists = await prisma.user.findFirst({ where: { email } });
  if (exists) {
    throw new Error("このメールアドレスはすでに使われています。");
  }

  if (password !== passwordConfirmation) {
    throw new Error("パスワードと確認用パスワードが一致しません。");
  }

  const hashed = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("新規登録に失敗しました。");
  }
}

/**
 * 投稿編集（本人の投稿のみ）
 * 編集後はダッシュボードを再検証してダッシュボードへ遷移
 */
export async function updatePost(id: string, formData: FormData) {
  const caption = formData.get("caption") as string;
  // TODO: 不要
  const email = "user+1@example.com";

  console.log("⭐️", id);
  if (!caption) {
    throw new Error("キャプションが未入力です。");
  }

  const user = await prisma.user.findFirstOrThrow({
    where: { email },
  });

  console.log("⭐️user.id", id);
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
  const email = "user+1@example.com";

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
  const email = "user+1@example.com";

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
  const email = "user+1@example.com";
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
  console.log("createPost");
  const email = "user+1@example.com";
  const caption = formData.get("caption") as string;
  const imageFile = formData.get("image") as File;
  const blob = await put(imageFile.name, imageFile, {
    access: "public",
  });

  console.log("⭐️ファイル", imageFile);

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
