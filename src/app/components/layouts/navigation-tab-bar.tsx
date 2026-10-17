"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavigationAvatar from "@/app/components/layouts/navigation-avatar";
import {
  HomeIcon,
  PlusIcon,
  UsersIcon,
} from "@/app/components/layouts/navigation-icons";
import type { NavigationUser } from "@/app/components/layouts/navigation";

type TabProps = {
  href: string;
  active: boolean;
  label: string;
  children: React.ReactNode;
};

function Tab({ href, active, label, children }: TabProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={clsx(
        "flex flex-col items-center gap-0.5 py-1.5",
        active ? "text-ink" : "text-sub"
      )}
    >
      <span
        className={clsx(
          "flex h-[30px] w-14 items-center justify-center rounded-full",
          { "bg-soft": active }
        )}
      >
        {children}
      </span>
      <span className={clsx("text-[11px]", active ? "font-bold" : "font-medium")}>
        {label}
      </span>
    </Link>
  );
}

export default function NavigationTabBar({
  user,
}: {
  user: NavigationUser | null;
}) {
  const pathname = usePathname();
  const isPostActive = pathname === "/posts/new";
  const isMypageActive = pathname.startsWith("/mypage");

  return (
    <nav
      aria-label="メインメニュー"
      className="fixed inset-x-0 bottom-0 z-40 grid h-[76px] grid-cols-4 items-center border-t border-line bg-white px-2 pb-2 sm:hidden"
    >
      <Tab href="/home" active={pathname === "/home"} label="ホーム">
        <HomeIcon className="size-6" />
      </Tab>
      <Tab
        href="/users"
        active={pathname.startsWith("/users")}
        label="ユーザー一覧"
      >
        <UsersIcon className="size-6" />
      </Tab>
      <Link
        href="/posts/new"
        aria-current={isPostActive ? "page" : undefined}
        className={clsx(
          "flex flex-col items-center gap-0.5",
          isPostActive ? "text-ink" : "text-sub"
        )}
      >
        <span className="-mt-3.5 flex size-12 items-center justify-center rounded-full bg-ink text-white shadow-cheek">
          <PlusIcon className="size-[26px]" />
        </span>
        <span
          className={clsx(
            "text-[11px]",
            isPostActive ? "font-bold" : "font-medium"
          )}
        >
          投稿
        </span>
      </Link>
      <Tab href="/mypage" active={isMypageActive} label="マイページ">
        <NavigationAvatar
          image={user?.image}
          className={clsx("size-6 border-2", {
            "border-ink": isMypageActive,
            "border-line": !isMypageActive,
          })}
        />
      </Tab>
    </nav>
  );
}
