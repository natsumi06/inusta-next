"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useState, useMemo } from "react";
import ProfileAvatar from "@/app/components/pages/profile/profile-avatar";
import { ChevronRightIcon } from "@/app/components/layouts/navigation-icons";

type User = {
  id: string;
  name: string;
  image: string | null;
  description: string | null;
  _count: {
    posts: number;
  };
};

type UsersListProps = {
  users: User[];
};

const SORTS = [
  { value: "recent", label: "新しい順" },
  { value: "posts", label: "投稿が多い順" },
] as const;

type Sort = (typeof SORTS)[number]["value"];

export default function UsersList({ users }: UsersListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<Sort>("recent");

  const filteredUsers = useMemo(() => {
    const result = users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
    );

    if (sortBy === "posts") {
      result.sort((a, b) => b._count.posts - a._count.posts);
    }

    return result;
  }, [users, searchQuery, sortBy]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-3.5 px-4 py-4 sm:gap-5 sm:px-6 sm:py-7">
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="flex flex-col gap-1.5 sm:w-[440px]">
          <label htmlFor="users-search" className="text-sm font-bold">
            名前でさがす
          </label>
          <div className="relative">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-sub"
            >
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
            <input
              id="users-search"
              type="search"
              placeholder="例: こむぎ"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[52px] w-full rounded-xl border-[1.5px] border-ink bg-white pl-[42px] pr-3.5 text-[16px] text-ink shadow-[0_2px_0_var(--color-line)] placeholder:text-[#8a8a84] focus:outline-2 focus:outline-offset-2 focus:outline-ink sm:h-[50px]"
            />
          </div>
        </div>
        <div
          role="radiogroup"
          aria-label="並び順"
          className="grid grid-cols-2 gap-1 rounded-full bg-soft p-1 sm:flex"
        >
          {SORTS.map((sort) => {
            const selected = sortBy === sort.value;
            return (
              <button
                key={sort.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setSortBy(sort.value)}
                className={clsx(
                  "h-10 rounded-full border-[1.5px] text-sm transition-colors duration-[var(--duration-yuru-quick)] sm:h-[42px] sm:px-[22px]",
                  selected
                    ? "border-ink bg-white font-bold text-ink"
                    : "border-transparent font-medium text-sub hover:text-ink",
                )}
              >
                {sort.label}
              </button>
            );
          })}
        </div>
      </div>

      {filteredUsers.length > 0 ? (
        <ul className="grid grid-cols-1 gap-2.5 sm:gap-4 lg:grid-cols-2">
          {filteredUsers.map((user) => (
            <li key={user.id}>
              <Link
                href={`/users/${user.id}`}
                className="flex h-full items-center gap-3.5 rounded-xl border border-line bg-white p-3.5 transition-colors duration-[var(--duration-yuru-quick)] hover:border-ink sm:gap-5 sm:px-[22px] sm:py-5"
              >
                <ProfileAvatar
                  image={user.image}
                  name={user.name}
                  className="sm:size-24"
                />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:gap-1">
                  <span className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                    <strong className="truncate text-[16px] sm:text-[17px]">
                      {user.name}
                    </strong>
                    <span className="text-xs text-sub sm:text-[13px]">
                      投稿 <strong className="text-ink">{user._count.posts}</strong> 件
                    </span>
                  </span>
                  {/* 自己紹介が空なら何も出さない（わんとものページと同じ） */}
                  {user.description && (
                    <span className="line-clamp-2 whitespace-pre-wrap text-[13px] leading-relaxed sm:text-sm">
                      {user.description}
                    </span>
                  )}
                </span>
                <ChevronRightIcon className="size-[18px] shrink-0 text-sub sm:hidden" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white px-4 py-12 text-center">
          <Image
            src="/illustrations/dog-sit.png"
            alt=""
            width={165}
            height={155}
            className="h-auto w-24 mix-blend-multiply"
          />
          <p className="font-heading text-lg font-medium">
            「{searchQuery}」のわんともは見つかりませんでした
          </p>
          <p className="text-sm text-sub">名前の一部だけでもさがせます</p>
        </div>
      )}
    </div>
  );
}
