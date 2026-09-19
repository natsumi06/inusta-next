"use client";

import NavigationLink from "@/app/components/layouts/navigation-link";
import { usePathname } from "next/navigation";

export default function NavigationLinks() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-gray-100 bg-white px-4 sm:static sm:inset-auto sm:z-auto sm:ms-10 sm:h-auto sm:justify-normal sm:space-x-8 sm:border-0 sm:bg-transparent sm:px-0">
      <NavigationLink
        href="/posts"
        active={pathname === "/posts"}
        normalIcon="/icon/home/normal.svg"
        hoverIcon="/icon/home/hover.svg"
        alt="home"
        label="ホーム"
      />
      <NavigationLink
        href="/posts/create"
        active={pathname === "/posts/create"}
        normalIcon="/icon/post/normal.svg"
        hoverIcon="/icon/post/hover.svg"
        alt="post"
        label="投稿する"
      />
      <NavigationLink
        href="/users"
        active={pathname === "/users"}
        normalIcon="/icon/users/normal.svg"
        hoverIcon="/icon/users/hover.svg"
        alt="user"
        label="ユーザー"
      />
    </div>
  );
}
