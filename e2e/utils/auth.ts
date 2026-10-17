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
  await page.waitForSelector('input[name="name"]', { timeout: 10000 });

  const nameInput = page.locator('input[name="name"]');
  const emailInput = page.locator('input[name="email"]');
  const passwordInput = page.locator('input[name="password"]');
  const confirmInput = page.locator('input[name="passwordConfirmation"]');

  await nameInput.fill(user.name);
  await emailInput.fill(user.email);
  await passwordInput.fill(user.password);
  await confirmInput.fill(user.password);

  const submitButton = page.locator('button[type="submit"]').first();
  await submitButton.click();

  // 登録完了ページまで待機
  await page.waitForURL('/register/complete', { timeout: 15000 });

  // 「ホームへ戻る」ボタンをクリック
  const homeLink = page.locator('a').filter({ hasText: 'ホームへ戻る' });
  await homeLink.click();

  // ホーム画面(/posts)に移動するまで待機
  await page.waitForURL('/posts', { timeout: 15000 });
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
  await page.waitForURL('/posts', { timeout: 15000 });
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
