"use client";

import Image from "next/image";
import Link from "next/link";
import { loadMorePosts } from "../../../../../lib/actions";
import { useState } from "react";

function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const postDate = typeof date === "string" ? new Date(date) : date;
  const diffMs = now.getTime() - postDate.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "今";
  if (diffMins < 60) return `${diffMins}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}週前`;
  return postDate.toLocaleDateString("ja-JP");
}

type Post = {
  id: string;
  image: string;
  caption: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  _count: {
    comments: number;
  };
};

type PostsListProps = {
  initialPosts: Post[];
  hasMore: boolean;
  totalCount: number;
};

export default function PostsList({
  initialPosts,
  hasMore,
  totalCount,
}: PostsListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = async () => {
    setIsLoading(true);
    try {
      const morePosts = await loadMorePosts(posts.length);
      setPosts((prev) => [...prev, ...morePosts]);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasMoreContent = posts.length < totalCount;

  return (
    <div className="mx-auto my-4 w-full bg-white px-4 sm:my-8 sm:max-w-5xl sm:px-0">
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
        {posts.map((post) => {
          const caption = post.caption
            ? post.caption.length > 50
              ? post.caption.substring(0, 50) + "..."
              : post.caption
            : "";
          return (
            <div key={post.id} className="relative group overflow-hidden">
              <Link href={`/posts/${post.id}`}>
                <Image
                  className="aspect-[1/1] w-full object-cover transition duration-200 group-hover:brightness-110 group-hover:contrast-90"
                  src={post.image}
                  alt="posts"
                  width={400}
                  height={400}
                />
              </Link>

              <div className="pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <Link
                href={`/posts/${post.id}/edit`}
                className="absolute right-2 top-1 hidden rounded-full p-1 group-hover:block"
              >
                🐾
              </Link>

              <Link href={`/posts/${post.id}`} className="block">
                <div className="border p-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    {post.user.image && (
                      <Image
                        className="block aspect-square size-5 rounded-full object-cover"
                        src={post.user.image}
                        width={32}
                        height={32}
                        alt="user icon"
                      />
                    )}
                    <p className="ml-1 text-xs font-semibold text-black truncate">
                      {post.user.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 flex-shrink-0 ml-1">
                    {getRelativeTime(post.createdAt)}
                  </p>
                </div>
                {caption && (
                  <p className="text-xs text-gray-600 truncate mb-1">
                    {caption}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  💬 {post._count.comments}
                </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {hasMoreContent && (
        <div className="mt-8 flex justify-center pb-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "読み込み中..." : "もっと見る"}
          </button>
        </div>
      )}

      {!hasMoreContent && posts.length > 0 && (
        <div className="mt-8 text-center pb-8 text-gray-500">
          すべての投稿を表示しています
        </div>
      )}
    </div>
  );
}
