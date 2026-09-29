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
  await page.goto('/register');

  await page.fill('input[name="name"]', user.name);
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.fill('input[name="confirmPassword"]', user.password);

  await page.click('button[type="submit"]');

  // ログイン後、ホーム画面(/posts)にリダイレクト
  await page.waitForURL('/posts', { timeout: 10000 });
}

/**
 * 既存ユーザーでログインする
 */
export async function login(page: Page, user: TestUser): Promise<void> {
  await page.goto('/auth/signin');

  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);

  await page.click('button[type="submit"]');

  // ログイン後、ホーム画面にリダイレクト
  await page.waitForURL('/posts', { timeout: 10000 });
}

/**
 * ログアウト
 */
export async function logout(page: Page): Promise<void> {
  // ログアウトボタンをクリック（位置はUIによって異なるので必要に応じて調整）
  await page.click('button:has-text("ログアウト")');
  await page.waitForURL('/', { timeout: 5000 });
}
