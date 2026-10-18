import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import Link from "next/link";
import { logout } from "../../../../../lib/actions";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/app/components/layouts/navigation-icons";

export default function Page() {
  return (
    <>
      <BreadCrumbs title="設定" />
      <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-6">
        <Link
          href="/mypage"
          className="-ml-1.5 inline-flex h-11 items-center gap-0.5 self-start pr-3 text-sm font-bold text-ink"
        >
          <ChevronLeftIcon className="size-5" />
          マイページにもどる
        </Link>

        <section aria-labelledby="settings-profile" className="flex flex-col gap-2">
          <h3 id="settings-profile" className="mx-1 text-[13px] font-bold text-sub">
            プロフィール（みんなに見える）
          </h3>
          <Link
            href="/mypage/edit"
            className="flex min-h-14 items-center gap-3 rounded-xl border border-line bg-white px-3.5 transition hover:bg-soft"
          >
            <span className="flex-1 text-[15px] font-medium text-ink">
              アイコン・表示名・自己紹介
            </span>
            <ChevronRightIcon className="size-[18px] text-sub" />
          </Link>
        </section>

        <form action={logout} className="mt-4">
          <button
            type="submit"
            className="h-12 w-full rounded-full border-2 border-[#e0dfd8] bg-white text-[15px] font-bold text-ink transition hover:border-sub"
          >
            ログアウト
          </button>
        </form>
      </div>
    </>
  );
}
