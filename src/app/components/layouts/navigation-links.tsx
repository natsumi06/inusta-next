"use client";

import NavigationLink from "@/app/components/layouts/navigation-link";
import { HomeIcon, UsersIcon } from "@/app/components/layouts/navigation-icons";
import { usePathname } from "next/navigation";

export default function NavigationLinks() {
  const pathname = usePathname();

  return (
    <div className="flex grow items-stretch gap-2">
      <NavigationLink
        href="/home"
        active={pathname === "/home"}
        icon={<HomeIcon />}
        label="ホーム"
      />
      <NavigationLink
        href="/users"
        active={pathname.startsWith("/users")}
        icon={<UsersIcon />}
        label="ユーザー一覧"
      />
    </div>
  );
}
