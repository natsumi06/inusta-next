import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { registerAndLogin, TestUser } from '../utils/auth';
import {
  createPost,
  editPost,
  deletePost,
  assertPostExistsOnHome,
  assertPostNotExistsOnHome,
  goToUserProfile,
  goToUsersList,
} from '../utils/helpers';

let browser: Browser;
let context1: BrowserContext;
let context2: BrowserContext;
let page1: Page;
let page2: Page;

const userA: TestUser = {
  email: `testa-${Date.now()}@example.com`,
  password: 'Password123!',
  name: 'Test User A',
};

const userB: TestUser = {
  email: `testb-${Date.now()}@example.com`,
  password: 'Password123!',
  name: 'Test User B',
};

test.describe('投稿機能のテスト', () => {
  test.beforeAll(async ({ playwright }) => {
    browser = await playwright.chromium.launch();
  });

  test.beforeEach(async ({ playwright }) => {
    context1 = await browser.newContext();
    context2 = await browser.newContext();
    page1 = context1.newPage();
    page2 = context2.newPage();

    // ユーザーA、Bを登録してログイン
    await registerAndLogin(page1, userA);
    await registerAndLogin(page2, userB);
  });

  test.afterEach(async () => {
    await context1.close();
    await context2.close();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test('1-1: 投稿作成の反映 - ホーム画面に新規投稿が表示される', async () => {
    const caption = `Test post ${Date.now()}`;

    // ユーザーAで投稿を作成
    await createPost(page1, caption);

    // ユーザーBでホーム画面を表示し、投稿が表示されることを確認
    await assertPostExistsOnHome(page2, caption);
  });

  test('1-2: 投稿作成の反映 - 投稿一覧の上部に表示される', async () => {
    const caption = `Test post top ${Date.now()}`;

    // ユーザーAで投稿を作成
    await createPost(page1, caption);

    // ユーザーBでホーム画面を表示
    await page2.goto('/posts');

    // 投稿がグリッドの上部に表示されることを確認
    const posts = page2.locator('[data-testid="post-grid"] article, .grid article');
    const firstPost = posts.first();
    await expect(firstPost.locator(`text=${caption}`)).toBeVisible();
  });

  test('1-3: ユーザー一覧の件数反映 - ユーザーAの投稿件数が増加', async () => {
    const caption1 = `First post ${Date.now()}`;
    const caption2 = `Second post ${Date.now()}`;

    // ユーザーBでユーザー一覧を開き、初期投稿件数を確認
    await goToUsersList(page2);
    const userARow = page2.locator(`text=${userA.name}`).first().locator('..');
    const initialCountText = await userARow.locator('text=/投稿\\s*\\d+\\s*件/').textContent();
    const initialCount = initialCountText ? parseInt(initialCountText.match(/\d+/)![0], 10) : 0;

    // ユーザーAで投稿を2つ作成
    await createPost(page1, caption1);
    await createPost(page1, caption2);

    // ユーザーBでユーザー一覧を再表示
    await goToUsersList(page2);
    const userARowUpdated = page2.locator(`text=${userA.name}`).first().locator('..');
    const updatedCountText = await userARowUpdated.locator('text=/投稿\\s*\\d+\\s*件/').textContent();
    const updatedCount = updatedCountText ? parseInt(updatedCountText.match(/\d+/)![0], 10) : 0;

    // 投稿件数が増加していることを確認
    expect(updatedCount).toBeGreaterThan(initialCount);
  });

  test('1-4: ユーザープロフィールの投稿反映 - 新規投稿が表示される', async () => {
    const caption = `Profile test post ${Date.now()}`;

    // ユーザーAで投稿を作成
    await createPost(page1, caption);

    // ユーザーBでユーザーAのプロフィール画面を表示
    // （ユーザーIDは実装に応じて取得方法を調整）
    // ここではユーザー一覧からプロフィールに移動
    await goToUsersList(page2);
    const userALink = page2.locator(`text=${userA.name}`).first();
    await userALink.click();

    // プロフィール画面で投稿が表示されることを確認
    await expect(page2.locator(`text=${caption}`)).toBeVisible();
  });

  test('2-1: 投稿編集 - 編集された投稿内容がホーム画面に反映', async () => {
    const originalCaption = `Original caption ${Date.now()}`;
    const editedCaption = `Edited caption ${Date.now()}`;

    // ユーザーAで投稿を作成
    await createPost(page1, originalCaption);

    // ユーザーAで投稿を編集（投稿詳細ページからIDを取得）
    // ここでは URL から postId を取得
    const postUrl = page1.url();
    const postMatch = postUrl.match(/\/posts\/([^/]+)/);
    const postId = postMatch ? postMatch[1] : '';

    if (postId) {
      await editPost(page1, postId, editedCaption);

      // ユーザーBでホーム画面を表示
      await page2.goto('/posts');

      // 編集された投稿内容が表示されることを確認
      await expect(page2.locator(`text=${editedCaption}`)).toBeVisible();
      await expect(page2.locator(`text=${originalCaption}`)).not.toBeVisible();
    }
  });

  test('2-2: 投稿編集 - プロフィール画面での編集反映', async () => {
    const originalCaption = `Profile original ${Date.now()}`;
    const editedCaption = `Profile edited ${Date.now()}`;

    // ユーザーAで投稿を作成
    await createPost(page1, originalCaption);

    // 投稿IDを取得
    const postUrl = page1.url();
    const postMatch = postUrl.match(/\/posts\/([^/]+)/);
    const postId = postMatch ? postMatch[1] : '';

    if (postId) {
      // ユーザーAで投稿を編集
      await editPost(page1, postId, editedCaption);

      // ユーザーBでユーザーAのプロフィール画面を表示
      await goToUsersList(page2);
      const userALink = page2.locator(`text=${userA.name}`).first();
      await userALink.click();

      // プロフィール画面で編集された投稿が表示されることを確認
      await expect(page2.locator(`text=${editedCaption}`)).toBeVisible();
    }
  });

  test('3-1: 投稿削除 - ホーム画面から削除された投稿が表示されない', async () => {
    const caption = `Delete test ${Date.now()}`;

    // ユーザーAで投稿を作成
    await createPost(page1, caption);

    // ユーザーBでホーム画面で投稿が表示されることを確認
    await assertPostExistsOnHome(page2, caption);

    // ユーザーAで投稿を削除（投稿詳細ページから）
    const postUrl = page1.url();
    const postMatch = postUrl.match(/\/posts\/([^/]+)/);
    const postId = postMatch ? postMatch[1] : '';

    if (postId) {
      await deletePost(page1, postId);

      // ユーザーBでホーム画面を再表示して、投稿が削除されていることを確認
      await assertPostNotExistsOnHome(page2, caption);
    }
  });

  test('3-2: 投稿削除 - ユーザー一覧での件数反映', async () => {
    const caption = `Delete count test ${Date.now()}`;

    // ユーザーAで投稿を作成
    await createPost(page1, caption);

    // ユーザーBでユーザー一覧を開き、ユーザーAの投稿件数を確認
    await goToUsersList(page2);
    const userARow = page2.locator(`text=${userA.name}`).first().locator('..');
    const beforeCountText = await userARow.locator('text=/投稿\\s*\\d+\\s*件/').textContent();
    const beforeCount = beforeCountText ? parseInt(beforeCountText.match(/\d+/)![0], 10) : 0;

    // ユーザーAで投稿を削除
    const postUrl = page1.url();
    const postMatch = postUrl.match(/\/posts\/([^/]+)/);
    const postId = postMatch ? postMatch[1] : '';

    if (postId) {
      await deletePost(page1, postId);

      // ユーザーBでユーザー一覧を再表示
      await goToUsersList(page2);
      const userARowAfter = page2.locator(`text=${userA.name}`).first().locator('..');
      const afterCountText = await userARowAfter.locator('text=/投稿\\s*\\d+\\s*件/').textContent();
      const afterCount = afterCountText ? parseInt(afterCountText.match(/\d+/)![0], 10) : 0;

      // 投稿件数が減少していることを確認
      expect(afterCount).toBeLessThan(beforeCount);
    }
  });

  test('3-3: 投稿削除 - プロフィール画面での反映', async () => {
    const caption = `Profile delete test ${Date.now()}`;

    // ユーザーAで投稿を作成
    await createPost(page1, caption);

    // ユーザーAで投稿を削除
    const postUrl = page1.url();
    const postMatch = postUrl.match(/\/posts\/([^/]+)/);
    const postId = postMatch ? postMatch[1] : '';

    if (postId) {
      await deletePost(page1, postId);

      // ユーザーBでユーザーAのプロフィール画面を表示
      await goToUsersList(page2);
      const userALink = page2.locator(`text=${userA.name}`).first();
      await userALink.click();

      // プロフィール画面で投稿が削除されていることを確認
      await expect(page2.locator(`text=${caption}`)).not.toBeVisible();
    }
  });
});
