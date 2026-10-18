import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import Link from "next/link";
import { logout } from "../../../../../lib/actions";
import { fetchMe } from "../../../../../lib/apis";
import { ChevronRightIcon } from "@/app/components/layouts/navigation-icons";
import { BackLink } from "@/app/components/pages/settings/form-parts";

const DONE_MESSAGES: Record<string, string> = {
  email: "メールアドレスを変更しました",
  password: "パスワードを変更しました",
};

function SettingsRow({
  href,
  label,
  value,
  last = false,
}: {
  href: string;
  label: string;
  value?: string;
  last?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex min-h-14 items-center gap-3 px-3.5 py-2 transition hover:bg-soft ${
        last ? "" : "border-b border-line"
      }`}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[15px] font-medium text-ink">{label}</span>
        {value && (
          <span className="truncate text-[13px] text-sub">{value}</span>
        )}
      </span>
      <ChevronRightIcon className="size-[18px] shrink-0 text-sub" />
    </Link>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ done?: string }>;
}) {
  const [{ done }, user] = await Promise.all([searchParams, fetchMe()]);
  const doneMessage = done ? DONE_MESSAGES[done] : undefined;

  return (
    <>
      <BreadCrumbs title="設定" />
      <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-6">
        <BackLink href="/mypage">マイページにもどる</BackLink>

        {doneMessage && (
          <p
            role="status"
            className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-bold text-ok"
          >
            <svg
              aria-hidden="true"
              className="size-[18px] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12.5 10 17.5 19 7.5" />
            </svg>
            {doneMessage}
          </p>
        )}

        <section
          aria-labelledby="settings-profile"
          className="flex flex-col gap-2"
        >
          <h3
            id="settings-profile"
            className="mx-1 text-[13px] font-bold text-sub"
          >
            プロフィール（みんなに見える）
          </h3>
          <div className="overflow-hidden rounded-xl border border-line bg-white">
            <SettingsRow
              href="/mypage/edit"
              label="アイコン・表示名・自己紹介"
              last
            />
          </div>
        </section>

        <section
          aria-labelledby="settings-account"
          className="flex flex-col gap-2"
        >
          <h3
            id="settings-account"
            className="mx-1 text-[13px] font-bold text-sub"
          >
            会員情報（あなただけに見える）
          </h3>
          <div className="overflow-hidden rounded-xl border border-line bg-white">
            <SettingsRow
              href="/mypage/settings/email"
              label="メールアドレス"
              value={user.email}
            />
            <SettingsRow
              href="/mypage/settings/password"
              label="パスワード"
              last
            />
          </div>
        </section>

        <div className="mt-4 flex flex-col items-center gap-1.5">
          <form action={logout} className="w-full">
            <button
              type="submit"
              className="h-12 w-full rounded-full border-2 border-[#e0dfd8] bg-white text-[15px] font-bold text-ink transition hover:border-sub"
            >
              ログアウト
            </button>
          </form>
          <Link
            href="/mypage/settings/delete"
            className="inline-flex h-11 items-center px-3 text-[13px] text-sub underline underline-offset-[3px] hover:text-ink"
          >
            退会する
          </Link>
        </div>
      </div>
    </>
  );
}
