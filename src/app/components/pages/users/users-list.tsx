"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import IconSkeleton from "@/app/components/skeletons/icon-skeleton";

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

export default function UsersList({ users }: UsersListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "posts">("recent");

  const filteredUsers = useMemo(() => {
    const result = users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === "posts") {
      result.sort((a, b) => b._count.posts - a._count.posts);
    }

    return result;
  }, [users, searchQuery, sortBy]);

  return (
    <div className="mx-auto my-8 max-w-5xl">
      <div className="mb-1 bg-white p-4 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="ユーザー名で検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
        />
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setSortBy("recent")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              sortBy === "recent"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            最新順
          </button>
          <button
            onClick={() => setSortBy("posts")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              sortBy === "posts"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            投稿数が多い順
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm">
        <div className="grid grid-cols-1 gap-1 lg:grid-cols-2">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Link href={`/users/${user.id}`} key={user.id}>
                <div className="flex bg-white p-4 hover:bg-gray-50 transition">
                  {user.image ? (
                    <Image
                      src={user.image}
                      className="block aspect-[1/1] rounded-full object-cover flex-shrink-0"
                      width={96}
                      height={96}
                      alt="user icon"
                    />
                  ) : (
                    <IconSkeleton />
                  )}
                  <div className="pl-4 flex-1">
                    <p className="text-lg font-semibold text-black">
                      {user.name}
                    </p>
                    <p className="whitespace-pre-wrap font-medium text-gray-600 line-clamp-2">
                      {user.description || "自己紹介なし"}
                    </p>
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700">
                        投稿 {user._count.posts} 件
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full p-8 text-center">
              <p className="text-gray-500">
                「{searchQuery}」に該当するユーザーが見つかりません
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
