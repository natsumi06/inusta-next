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
  // 新規投稿ページに移動
  await page.goto('/posts/new');

  // 画像をアップロード（必須フィールド）
  const fileInput = page.locator('input[type="file"]');
  const testImagePath = imagePath || getTestImagePath();
  await fileInput.setInputFiles(testImagePath);

  // 選んだ写真のプレビューが出るまで待機
  await page.locator('img[alt="選んだ写真"]').waitFor({ timeout: 10000 });

  // キャプション入力フィールドが表示されるまで待機
  const captionInput = page.locator('textarea[name="caption"]');
  await captionInput.waitFor({ state: 'visible', timeout: 5000 });
  await captionInput.fill(caption);

  // 投稿ボタンをクリック
  const submitButton = page.locator('button:has-text("投稿する")');
  await submitButton.waitFor({ state: 'visible', timeout: 5000 });
  await submitButton.click();

  // 投稿詳細ページにリダイレクトされるまで待機
  await page.waitForURL(/\/posts\/(?!new$)[^/]+$/, { timeout: 15000 });

  // 投稿詳細ページで投稿内容が表示されるまで待機
  await expect(page.locator(`text=${caption}`)).toBeVisible({ timeout: 10000 });
}

/**
 * 投稿を編集する
 */
export async function editPost(
  page: Page,
  postId: string,
  newCaption: string,
): Promise<void> {
  // 投稿編集ページに直接移動
  await page.goto(`/posts/${postId}/edit`);

  // キャプションを更新
  const captionInput = page.locator('textarea[name="caption"]');
  await captionInput.waitFor({ state: 'visible', timeout: 5000 });
  await captionInput.clear();
  await captionInput.fill(newCaption);

  // 保存ボタンをクリック
  const submitButton = page.locator('button[type="submit"]').first();
  await submitButton.waitFor({ state: 'visible', timeout: 5000 });
  await submitButton.click();

  // 保存すると投稿詳細にもどる
  await page.waitForURL(`/posts/${postId}`, { timeout: 15000 });

  // 更新されたひとことを確認
  await page.goto(`/posts/${postId}`);
  await expect(page.locator(`text=${newCaption}`)).toBeVisible({ timeout: 10000 });
}

/**
 * 投稿を削除する
 */
export async function deletePost(page: Page, postId: string): Promise<void> {
  // 投稿詳細ページに移動
  await page.goto(`/posts/${postId}`);

  // 「…」メニューを開いて「削除する」を選ぶ
  const menuButton = page.getByRole('button', { name: '投稿のメニュー' });
  await menuButton.waitFor({ state: 'visible', timeout: 5000 });
  await menuButton.click();
  await page.getByRole('menuitem', { name: '削除する' }).click();

  // 確認の「削除する」ボタンをクリック
  const confirmButton = page.getByRole('alertdialog').getByRole('button', { name: '削除する' });
  await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
  await confirmButton.click();

  // マイページに戻るまで待機
  await page.waitForURL('/mypage', { timeout: 15000 });
}

/**
 * ホーム画面で投稿があるかを確認
 */
export async function assertPostExistsOnHome(
  page: Page,
  caption: string,
): Promise<void> {
  await page.goto('/home');
  await expect(page.locator(`text=${caption}`)).toBeVisible({ timeout: 5000 });
}

/**
 * ホーム画面で投稿がないかを確認
 */
export async function assertPostNotExistsOnHome(
  page: Page,
  caption: string,
): Promise<void> {
  await page.goto('/home');
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
  // コメント入力フォームが表示されるまで待機
  const commentInput = page.locator('input[name="text"]');
  await commentInput.waitFor({ state: 'visible', timeout: 10000 });
  await commentInput.fill(commentText);

  // コメント投稿ボタンをクリック
  const submitButton = page.locator('button').filter({ hasText: "送る" }).first();
  await submitButton.click();

  // コメントが表示されるまで待機
  await expect(page.locator(`text=${commentText}`)).toBeVisible({ timeout: 10000 });
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
  const deleteButton = commentElement.locator('..').locator('button').filter({ hasText: '削除' }).first();
  await deleteButton.click();

  // 確認ボタンがあれば対応
  const confirmButton = page.locator('button').filter({ hasText: /確認|はい/ }).first();
  if (await confirmButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await confirmButton.click();
  }

  // コメントが削除されるまで待機
  await expect(page.locator(`text=${commentText}`)).not.toBeVisible({ timeout: 10000 });
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
  await page.goto('/home');
  const postElement = page.locator(`text=${caption}`).first().locator('..');
  const commentCountElement = postElement.locator('text=/コメント\\s*\\d+/');
  const countText = await commentCountElement.textContent();
  const match = countText?.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}
