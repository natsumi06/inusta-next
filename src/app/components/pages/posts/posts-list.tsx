"use client";

import Image from "next/image";
import Link from "next/link";
import { loadMorePosts } from "@/lib/actions";
import { useState } from "react";

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
          return (
            <Link key={post.id} href={`/posts/${post.id}`}>
              <Image
                className="aspect-[1/1] w-full object-cover"
                src={post.image}
                alt="posts"
                width={400}
                height={400}
              />
              <div className="flex items-center justify-between border p-1">
                <div className="flex items-center">
                  {post.user.image && (
                    <Image
                      className="block aspect-square size-6 rounded-full object-cover"
                      src={post.user.image}
                      width={32}
                      height={32}
                      alt="user icon"
                    />
                  )}
                  <p className="ml-2 text-sm font-semibold text-black">
                    {post.user.name}
                  </p>
                </div>
                <p className="hidden text-xs text-gray-500 md:block">
                  {post.createdAt instanceof Date
                    ? post.createdAt.toLocaleString("ja-JP")
                    : new Date(post.createdAt).toLocaleString("ja-JP")}
                </p>
              </div>
            </Link>
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
