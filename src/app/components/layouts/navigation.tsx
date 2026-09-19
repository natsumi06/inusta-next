"use client";

import NavigationMenu from "@/app/components/layouts/navigation-menu";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  return (
    <nav className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex shrink-0 items-center">
              <Link href="/dashboard">
                <Image src="/logo.png" width={80} height={30} alt="logo" />
              </Link>
            </div>

            <div className="hidden items-center space-x-8 sm:ms-10 sm:flex">
              <Link
                href="/posts"
                className={clsx(
                  "group inline-flex flex-col items-center border-gray-600 px-1 pt-1 text-sm font-medium text-gray-900 focus:border-gray-900",
                  {
                    "border-b": pathname === "/posts",
                  }
                )}
              >
                <span className="relative block size-[35px]">
                  <Image
                    src="/icon/home/normal.svg"
                    fill
                    className="object-contain transition-opacity group-hover:opacity-0"
                    alt="home"
                  />
                  <Image
                    src="/icon/home/hover.svg"
                    fill
                    className="object-contain opacity-0 transition-opacity group-hover:opacity-100"
                    alt="home"
                  />
                </span>
                <p className="text-xs">ホーム</p>
              </Link>
              <Link
                href="/posts/create"
                className={clsx(
                  "inline-flex items-center flex-col border-gray-600 px-1 pt-1 text-sm font-medium text-gray-900 focus:border-gray-900",
                  {
                    "border-b": pathname === "/posts/create",
                  }
                )}
              >
                <span className="relative block size-[35px]">
                <Image
                    src="/icon/post/normal.svg"
                    fill
                    className="object-contain transition-opacity group-hover:opacity-0"
                    alt="post"
                  />
                  <Image
                    src="/icon/post/hover.svg"
                    fill
                    className="object-contain opacity-0 transition-opacity group-hover:opacity-100"
                    alt="post"
                  />
                  </span>
                <p className="text-xs">投稿</p>
              </Link>
              <Link
                href="/users"
                className={clsx(
                  "inline-flex items-center flex-col border-gray-600 px-1 pt-1 text-sm font-medium text-gray-900 focus:border-gray-900",
                  {
                    "border-b": pathname === "/users",
                  }
                )}
              >
                <span className="relative block size-[35px]">
                  <Image
                    src="/icon/users/normal.svg"
                    fill
                    className="object-contain transition-opacity group-hover:opacity-0"
                    alt="user"
                  />
                  <Image
                    src="/icon/users/hover.svg"
                    fill
                    className="object-contain opacity-0 transition-opacity group-hover:opacity-100"
                    alt="user"
                  />
                </span>
                <p className="text-xs">ユーザー</p>
              </Link>
            </div>
          </div>
          <NavigationMenu />
        </div>
      </div>
    </nav>
  );
}
