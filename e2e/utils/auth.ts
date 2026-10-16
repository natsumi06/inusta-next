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

  await page.fill('input[name="name"]', user.name);
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.fill('input[name="passwordConfirmation"]', user.password);

  const submitButton = page.locator('button[type="submit"]');
  await submitButton.click();

  // 登録完了ページまで待機
  await page.waitForURL('/register/complete', { timeout: 15000 });

  // 「ホームへ戻る」ボタンをクリック
  const homeLink = page.locator('a:has-text("ホームへ戻る")');
  await homeLink.click();

  // ホーム画面(/posts)に移動するまで待機
  await page.waitForURL('/posts', { timeout: 15000 });
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
