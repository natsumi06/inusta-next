"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavigationAvatar from "@/app/components/layouts/navigation-avatar";
import { PlusIcon } from "@/app/components/layouts/navigation-icons";
import type { NavigationUser } from "@/app/components/layouts/navigation";

export default function NavigationMenu({
  user,
}: {
  user: NavigationUser | null;
}) {
  const pathname = usePathname();
  const isPostActive = pathname === "/posts/new";
  const isMypageActive = pathname.startsWith("/mypage");

  return (
    <div className="hidden items-center gap-4 sm:flex">
      <Link
        href="/posts/new"
        aria-current={isPostActive ? "page" : undefined}
        className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-[18px] text-sm font-bold text-white shadow-cheek transition hover:translate-y-px hover:shadow-none"
      >
        <PlusIcon className="size-[18px]" />
        投稿する
      </Link>
      <Link
        href="/mypage"
        aria-current={isMypageActive ? "page" : undefined}
        className={clsx(
          "inline-flex h-10 items-center gap-2 rounded-full border py-0 pl-1 pr-3 text-sm transition-colors",
          isMypageActive
            ? "border-ink bg-soft font-bold text-ink"
            : "border-line bg-white font-medium text-sub hover:text-ink"
        )}
      >
        <NavigationAvatar image={user?.image} className="size-8" />
        マイページ
      </Link>
    </div>
  );
}
