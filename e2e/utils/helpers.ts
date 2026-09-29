import { Page, expect } from '@playwright/test';
import path from 'path';

/**
 * テスト用の画像ファイルパスを取得
 */
export function getTestImagePath(): string {
  // テスト用の 1x1 ピクセルの PNG 画像を使用
  return path.join(__dirname, '../fixtures/test-image.png');
}

/**
 * 投稿を作成する
 */
export async function createPost(
  page: Page,
  caption: string,
  imagePath?: string,
): Promise<void> {
  // 新規投稿ページに移動（または投稿作成フォームを開く）
  const createButton = page.locator('button:has-text("新規投稿")');
  if (await createButton.isVisible()) {
    await createButton.click();
  } else {
    await page.goto('/posts/new');
  }

  // 画像をアップロード
  if (imagePath) {
    await page.locator('input[type="file"]').setInputFiles(imagePath);
  }

  // キャプションを入力
  await page.fill('textarea[name="caption"], input[name="caption"]', caption);

  // 投稿ボタンをクリック
  await page.click('button:has-text("投稿"), button[type="submit"]');

  // ホーム画面に戻るまで待機
  await page.waitForURL('/posts', { timeout: 10000 });
}

/**
 * 投稿を編集する
 */
export async function editPost(
  page: Page,
  postId: string,
  newCaption: string,
): Promise<void> {
  // 投稿詳細ページに移動
  await page.goto(`/posts/${postId}`);

  // 編集ボタンをクリック
  await page.click('button:has-text("編集")');

  // キャプションを更新
  const captionInput = page.locator('textarea[name="caption"], input[name="caption"]');
  await captionInput.clear();
  await captionInput.fill(newCaption);

  // 保存ボタンをクリック
  await page.click('button:has-text("保存"), button[type="submit"]');

  // 投稿詳細ページで確認されるまで待機
  await page.waitForURL(`/posts/${postId}`, { timeout: 10000 });
}

/**
 * 投稿を削除する
 */
export async function deletePost(page: Page, postId: string): Promise<void> {
  // 投稿詳細ページに移動
  await page.goto(`/posts/${postId}`);

  // 削除ボタンをクリック
  await page.click('button:has-text("削除")');

  // 確認ダイアログがあれば対応
  const confirmButton = page.locator('button:has-text("削除を確認"), button:has-text("はい")');
  if (await confirmButton.isVisible()) {
    await confirmButton.click();
  }

  // ホーム画面に戻るまで待機
  await page.waitForURL('/posts', { timeout: 10000 });
}

/**
 * ホーム画面で投稿があるかを確認
 */
export async function assertPostExistsOnHome(
  page: Page,
  caption: string,
): Promise<void> {
  await page.goto('/posts');
  await expect(page.locator(`text=${caption}`)).toBeVisible({ timeout: 5000 });
}

/**
 * ホーム画面で投稿がないかを確認
 */
export async function assertPostNotExistsOnHome(
  page: Page,
  caption: string,
): Promise<void> {
  await page.goto('/posts');
  await expect(page.locator(`text=${caption}`)).not.toBeVisible({ timeout: 5000 });
}

/**
 * ユーザープロフィール画面を開く
 */
export async function goToUserProfile(page: Page, userId: string): Promise<void> {
  await page.goto(`/users/${userId}`);
}

/**
 * ユーザー一覧を開く
 */
export async function goToUsersList(page: Page): Promise<void> {
  await page.goto('/users');
}

/**
 * コメントを追加する
 */
export async function addComment(
  page: Page,
  postId: string,
  commentText: string,
): Promise<void> {
  // 投稿詳細ページに移動
  await page.goto(`/posts/${postId}`);

  // コメント入力フォームにテキストを入力
  const commentInput = page.locator('textarea[name="comment"], input[name="comment"]');
  await commentInput.fill(commentText);

  // コメント投稿ボタンをクリック
  await page.click('button:has-text("投稿"), button:has-text("コメント投稿")');

  // コメントが表示されるまで待機
  await expect(page.locator(`text=${commentText}`)).toBeVisible({ timeout: 5000 });
}

/**
 * コメントを削除する
 */
export async function deleteComment(
  page: Page,
  postId: string,
  commentText: string,
): Promise<void> {
  // 投稿詳細ページに移動
  await page.goto(`/posts/${postId}`);

  // コメント削除ボタンをクリック（該当するコメントの）
  const commentElement = page.locator(`text=${commentText}`).first();
  const deleteButton = commentElement.locator('..').locator('button:has-text("削除")');
  await deleteButton.click();

  // 確認ダイアログがあれば対応
  const confirmButton = page.locator('button:has-text("削除を確認"), button:has-text("はい")');
  if (await confirmButton.isVisible()) {
    await confirmButton.click();
  }

  // コメントが削除されるまで待機
  await expect(page.locator(`text=${commentText}`)).not.toBeVisible({ timeout: 5000 });
}

/**
 * 投稿のコメント件数を取得
 */
export async function getCommentCount(page: Page, postId: string): Promise<number> {
  await page.goto(`/posts/${postId}`);
  const countText = await page.locator('text=/コメント\\s*\\d+\\s*件/').first().textContent();
  const match = countText?.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * ホーム画面の投稿グリッドでコメント件数を確認
 */
export async function getCommentCountOnHome(page: Page, caption: string): Promise<number> {
  await page.goto('/posts');
  const postElement = page.locator(`text=${caption}`).first().locator('..');
  const commentCountElement = postElement.locator('text=/💬\\s*\\d+/');
  const countText = await commentCountElement.textContent();
  const match = countText?.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}
