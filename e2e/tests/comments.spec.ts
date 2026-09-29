import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { registerAndLogin, TestUser } from '../utils/auth';
import {
  createPost,
  addComment,
  deleteComment,
  getCommentCount,
  getCommentCountOnHome,
} from '../utils/helpers';

let browser: Browser;
let context1: BrowserContext;
let context2: BrowserContext;
let page1: Page;
let page2: Page;

const userA: TestUser = {
  email: `commenta-${Date.now()}@example.com`,
  password: 'Password123!',
  name: 'Comment User A',
};

const userB: TestUser = {
  email: `commentb-${Date.now()}@example.com`,
  password: 'Password123!',
  name: 'Comment User B',
};

test.describe('コメント機能のテスト', () => {
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

  test('4-1: コメント作成 - 投稿詳細ページにコメントが表示される', async () => {
    const postCaption = `Post for comments ${Date.now()}`;
    const commentText = `This is a test comment ${Date.now()}`;

    // ユーザーAで投稿を作成
    await createPost(page1, postCaption);

    // 投稿IDを取得
    const postUrl = page1.url();
    const postMatch = postUrl.match(/\/posts\/([^/]+)/);
    const postId = postMatch ? postMatch[1] : '';

    if (postId) {
      // ユーザーBで投稿詳細ページを表示
      await page2.goto(`/posts/${postId}`);

      // ユーザーBがコメントを追加
      await addComment(page2, postId, commentText);

      // コメントが表示されることを確認
      await expect(page2.locator(`text=${commentText}`)).toBeVisible();

      // ユーザー名が表示されることを確認
      await expect(page2.locator(`text=${userB.name}`)).toBeVisible();
    }
  });

  test('4-2: コメント件数 - 投稿詳細ページでのコメント件数が増加', async () => {
    const postCaption = `Post for comment count ${Date.now()}`;
    const commentText1 = `Comment 1 ${Date.now()}`;
    const commentText2 = `Comment 2 ${Date.now()}`;

    // ユーザーAで投稿を作成
    await createPost(page1, postCaption);

    // 投稿IDを取得
    const postUrl = page1.url();
    const postMatch = postUrl.match(/\/posts\/([^/]+)/);
    const postId = postMatch ? postMatch[1] : '';

    if (postId) {
      // ユーザーBで投稿詳細ページを表示
      await page2.goto(`/posts/${postId}`);

      // 初期コメント件数を取得
      const initialCount = await getCommentCount(page2, postId);

      // コメントを2つ追加
      await addComment(page2, postId, commentText1);
      await addComment(page2, postId, commentText2);

      // コメント件数を再取得
      const updatedCount = await getCommentCount(page2, postId);

      // コメント件数が増加していることを確認
      expect(updatedCount).toBe(initialCount + 2);
    }
  });

  test('4-3: コメント件数 - ホーム画面でのコメント件数が増加', async () => {
    const postCaption = `Post for home comment count ${Date.now()}`;
    const commentText1 = `Home comment 1 ${Date.now()}`;
    const commentText2 = `Home comment 2 ${Date.now()}`;

    // ユーザーAで投稿を作成
    await createPost(page1, postCaption);

    // 投稿IDを取得
    const postUrl = page1.url();
    const postMatch = postUrl.match(/\/posts\/([^/]+)/);
    const postId = postMatch ? postMatch[1] : '';

    if (postId) {
      // ユーザーBでホーム画面でのコメント件数を確認
      const initialHomeCount = await getCommentCountOnHome(page2, postCaption);

      // ユーザーBで投稿詳細ページを表示してコメントを追加
      await page2.goto(`/posts/${postId}`);
      await addComment(page2, postId, commentText1);
      await addComment(page2, postId, commentText2);

      // ホーム画面でコメント件数を再確認
      const updatedHomeCount = await getCommentCountOnHome(page2, postCaption);

      // コメント件数が増加していることを確認
      expect(updatedHomeCount).toBe(initialHomeCount + 2);
    }
  });

  test('4-4: 複数ユーザーからのコメント表示', async () => {
    const postCaption = `Post for multi-user comments ${Date.now()}`;
    const commentTextA = `Comment from A ${Date.now()}`;
    const commentTextB = `Comment from B ${Date.now()}`;

    // ユーザーAで投稿を作成
    await createPost(page1, postCaption);

    // 投稿IDを取得
    const postUrl = page1.url();
    const postMatch = postUrl.match(/\/posts\/([^/]+)/);
    const postId = postMatch ? postMatch[1] : '';

    if (postId) {
      // ユーザーAが投稿詳細ページを表示してコメントを追加
      await page1.goto(`/posts/${postId}`);
      await addComment(page1, postId, commentTextA);

      // ユーザーBが投稿詳細ページを表示してコメントを追加
      await page2.goto(`/posts/${postId}`);
      await addComment(page2, postId, commentTextB);

      // ユーザーBの画面で両方のコメントが表示されることを確認
      await expect(page2.locator(`text=${commentTextA}`)).toBeVisible();
      await expect(page2.locator(`text=${commentTextB}`)).toBeVisible();

      // コメント件数が2件であることを確認
      const commentCount = await getCommentCount(page2, postId);
      expect(commentCount).toBe(2);
    }
  });

  test('6-1: コメント削除 - 投稿詳細ページから削除されたコメントが表示されない', async () => {
    const postCaption = `Post for delete comment ${Date.now()}`;
    const commentText = `Comment to delete ${Date.now()}`;

    // ユーザーAで投稿を作成
    await createPost(page1, postCaption);

    // 投稿IDを取得
    const postUrl = page1.url();
    const postMatch = postUrl.match(/\/posts\/([^/]+)/);
    const postId = postMatch ? postMatch[1] : '';

    if (postId) {
      // ユーザーBでコメントを追加
      await page2.goto(`/posts/${postId}`);
      await addComment(page2, postId, commentText);

      // ユーザーBでコメントを削除
      await deleteComment(page2, postId, commentText);

      // コメントが表示されていないことを確認
      await expect(page2.locator(`text=${commentText}`)).not.toBeVisible();
    }
  });

  test('6-2: コメント削除 - 投稿詳細ページでのコメント件数が減少', async () => {
    const postCaption = `Post for delete count ${Date.now()}`;
    const commentText1 = `Delete count comment 1 ${Date.now()}`;
    const commentText2 = `Delete count comment 2 ${Date.now()}`;

    // ユーザーAで投稿を作成
    await createPost(page1, postCaption);

    // 投稿IDを取得
    const postUrl = page1.url();
    const postMatch = postUrl.match(/\/posts\/([^/]+)/);
    const postId = postMatch ? postMatch[1] : '';

    if (postId) {
      // ユーザーBで投稿詳細ページを表示
      await page2.goto(`/posts/${postId}`);

      // コメントを2つ追加
      await addComment(page2, postId, commentText1);
      await addComment(page2, postId, commentText2);

      // コメント件数を確認
      const beforeDelete = await getCommentCount(page2, postId);

      // コメントを1つ削除
      await deleteComment(page2, postId, commentText1);

      // コメント件数を再確認
      const afterDelete = await getCommentCount(page2, postId);

      // コメント件数が減少していることを確認
      expect(afterDelete).toBe(beforeDelete - 1);
    }
  });

  test('6-3: コメント削除 - ホーム画面でのコメント件数が減少', async () => {
    const postCaption = `Post for home delete count ${Date.now()}`;
    const commentText = `Home delete comment ${Date.now()}`;

    // ユーザーAで投稿を作成
    await createPost(page1, postCaption);

    // 投稿IDを取得
    const postUrl = page1.url();
    const postMatch = postUrl.match(/\/posts\/([^/]+)/);
    const postId = postMatch ? postMatch[1] : '';

    if (postId) {
      // ユーザーBで投稿詳細ページを表示
      await page2.goto(`/posts/${postId}`);

      // コメントを追加
      await addComment(page2, postId, commentText);

      // ホーム画面でコメント件数を確認
      const beforeDelete = await getCommentCountOnHome(page2, postCaption);

      // 投稿詳細ページに戻ってコメントを削除
      await page2.goto(`/posts/${postId}`);
      await deleteComment(page2, postId, commentText);

      // ホーム画面でコメント件数を再確認
      const afterDelete = await getCommentCountOnHome(page2, postCaption);

      // コメント件数が減少していることを確認
      expect(afterDelete).toBeLessThan(beforeDelete);
    }
  });
});
