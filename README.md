# inusta

犬の飼い主が愛犬の写真を投稿し、コメントで交流できるSNSです。
Next.js（App Router）を使い、認証・投稿／コメント・プロフィール編集・画像アップロードまでを1つのアプリでフルスタックに実装しました。

- **[デモを開く](https://inusta-next-delta.vercel.app)**（会員登録後すぐに利用できます）
- **[技術ポートフォリオ（PDF）を見る](docs/technical-portfolio.pdf)**

## スクリーンショット

| ホーム（新着投稿） | 投稿作成 | マイページ |
| --- | --- | --- |
| ![ホーム](docs/images/posts.jpg) | ![投稿作成](docs/images/create.jpg) | ![マイページ](docs/images/dashboard.jpg) |

## 主な機能

- 会員登録・ログイン・ログアウト
- 投稿の作成・編集・削除
- 投稿画像のアップロード（JPEG / PNG / WebP / GIF、5MBまで）
- コメント投稿
- プロフィール編集（名前・自己紹介・アイコン画像）
- 新着投稿一覧とスクロールでの追加読み込み
- 投稿者本人だけが編集・削除できる制御

## 技術スタック

| 分類 | 技術 |
| --- | --- |
| フロントエンド | Next.js 15、React 19、TypeScript、Tailwind CSS |
| サーバー処理 | Next.js Server Actions |
| 認証 | Auth.js（NextAuth v5）、bcrypt |
| バリデーション | Zod |
| DB | PostgreSQL、Prisma |
| ストレージ | Vercel Blob |
| デプロイ | Vercel |

## 技術的な見どころ

- Auth.jsのMiddlewareとServer Actionsを組み合わせた認証・認可
- PrismaによるUser・Post・Commentのリレーション設計
- Vercel Blobへの画像保存と、サーバー側でのファイル検証

処理フロー、データ設計、設計上の判断については、[技術ポートフォリオ](docs/technical-portfolio.pdf)にまとめています。

## ローカルでの起動方法

Node.js v22、pnpm、PostgreSQLが必要です。

```bash
pnpm install
```

`.env` を作成します。

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/inusta"
AUTH_SECRET="任意のランダム文字列"
BLOB_READ_WRITE_TOKEN="Vercel Blobのトークン（画像アップロードに必要）"
```

```bash
pnpm prisma db push   # テーブル作成
pnpm prisma db seed   # サンプルデータ投入（user+1@example.com / password でログイン可）
pnpm dev              # http://localhost:3000
```

## 今後の改善

- 自動テストの追加（Server Actionsの単体テスト、PlaywrightによるE2E）
- GitHub ActionsでのLint・型チェック・ビルドの自動実行
- エラー監視・ログ収集の導入
