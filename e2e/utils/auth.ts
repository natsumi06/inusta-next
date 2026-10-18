import { Page } from '@playwright/test';

export interface TestUser {
  email: string;
  password: string;
  name: string;
}

/**
 * テストユーザーを登録してログインする
 */
export async function registerAndLogin(
  page: Page,
  user: TestUser,
): Promise<void> {
  await page.goto('/register', { waitUntil: 'networkidle' });

  // フォーム要素が表示されるまで待機
  await page.waitForSelector('input[name="email"]', { timeout: 10000 });

  const emailInput = page.locator('input[name="email"]');
  const passwordInput = page.locator('input[name="password"]');
  const confirmInput = page.locator('input[name="passwordConfirmation"]');

  await emailInput.fill(user.email);
  await passwordInput.fill(user.password);
  await confirmInput.fill(user.password);

  await page.getByRole('button', { name: '登録する' }).click();

  // 表示名の画面の上に「登録が完了しました」モーダルが出る
  await page.waitForURL('/register/name?registered=1', { timeout: 15000 });
  const registered = page.getByRole('dialog', { name: '登録が完了しました' });
  await registered.getByRole('button', { name: 'プロフィールを設定する' }).click();
  await registered.waitFor({ state: 'hidden' });

  // 表示名（必須）を入れて次へ。アイコンと自己紹介はスキップ
  await page.getByLabel('表示名').fill(user.name);
  await page.getByRole('button', { name: 'つぎへ' }).click();
  await page.waitForURL('/register/icon', { timeout: 15000 });
  await page.getByRole('link', { name: 'スキップ' }).click();
  await page.waitForURL('/register/bio', { timeout: 15000 });
  await page.getByRole('link', { name: 'スキップ' }).click();
  await page.waitForURL('/register/complete', { timeout: 15000 });

  // 準備完了画面の「Start！」をクリック
  const homeLink = page.locator('a').filter({ hasText: 'Start！' });
  await homeLink.click();

  // ホーム画面に移動するまで待機
  await page.waitForURL('/home', { timeout: 15000 });

  // はじめてのホームで出る歓迎モーダルを閉じる
  const welcome = page.getByRole('dialog', { name: 'ここがホームです' });
  await welcome.getByRole('button', { name: 'みんなの投稿を見る' }).click();
  await welcome.waitFor({ state: 'hidden' });
}

/**
 * 既存ユーザーでログインする
 */
export async function login(page: Page, user: TestUser): Promise<void> {
  await page.goto('/auth/signin');

  const emailInput = page.locator('input[name="email"]');
  const passwordInput = page.locator('input[name="password"]');

  await emailInput.fill(user.email);
  await passwordInput.fill(user.password);

  const submitButton = page.locator('button[type="submit"]').first();
  await submitButton.click();

  // ログイン後、ホーム画面にリダイレクト
  await page.waitForURL('/home', { timeout: 15000 });
}

/**
 * ログアウト
 */
export async function logout(page: Page): Promise<void> {
  // ログアウトボタンをクリック
  const logoutButton = page.locator('button').filter({ hasText: 'ログアウト' }).first();
  await logoutButton.click();
  await page.waitForURL('/', { timeout: 10000 });
}
