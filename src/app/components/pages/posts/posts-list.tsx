"use client";

import Image from "next/image";
import Link from "next/link";
import { loadMorePosts } from "../../../../../lib/actions";
import { useEffect, useRef, useState } from "react";
import Loader from "../../loaders/loader";
import NavigationAvatar from "@/app/components/layouts/navigation-avatar";
import { CommentIcon } from "@/app/components/layouts/navigation-icons";
import { getRelativeTime } from "../../../../../lib/relative-time";

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
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const hasMoreContent = hasMore && posts.length < totalCount;

  useEffect(() => {
    const trigger = loadMoreTriggerRef.current;
    if (!trigger || !hasMoreContent || isLoading) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isLoadingRef.current) {
        isLoadingRef.current = true;
        setIsLoading(true);
        loadMorePosts(posts.length)
          .then((morePosts) => {
            setPosts((prev) => {
              const existingIds = new Set(prev.map((post) => post.id));
              return [
                ...prev,
                ...morePosts.filter((post) => !existingIds.has(post.id)),
              ];
            });
          })
          .catch((error) => {
            console.error("Failed to load more posts:", error);
          })
          .finally(() => {
            isLoadingRef.current = false;
            setIsLoading(false);
          });
      }
    });

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [hasMoreContent, isLoading, posts.length]);

  return (
    <div className="mx-auto w-full px-4 py-4 sm:max-w-5xl sm:px-6 sm:py-8">
      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5"
        data-testid="post-grid"
      >
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="group overflow-hidden rounded-xl border border-line bg-white transition-colors duration-[var(--duration-yuru-quick)] hover:border-ink"
          >
            <article>
              <Image
                className="aspect-square w-full object-cover"
                src={post.image}
                alt={`${post.user.name}さんの投稿`}
                width={400}
                height={400}
              />
              <div className="flex flex-col gap-1 px-2.5 pb-2.5 pt-2 sm:gap-1.5 sm:px-3.5 sm:pb-3.5 sm:pt-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                    <NavigationAvatar
                      image={post.user.image}
                      className="size-[22px] shrink-0 border-[1.5px] border-ink sm:size-7 sm:border-2"
                    />
                    <p className="truncate text-xs font-bold sm:text-sm">
                      {post.user.name}
                    </p>
                  </div>
                  <p className="hidden shrink-0 text-xs text-sub sm:block">
                    {getRelativeTime(post.createdAt)}
                  </p>
                </div>
                {/* ひとことがなくても高さをそろえる */}
                <p className="min-h-[18px] truncate text-xs leading-normal sm:min-h-[21px] sm:text-sm">
                  {post.caption}
                </p>
                <div className="flex items-center justify-between text-[11px] text-sub sm:text-xs">
                  <span className="inline-flex items-center gap-1">
                    <CommentIcon className="size-3.5 sm:size-4" />
                    <span className="sr-only sm:not-sr-only">コメント</span>
                    {post._count.comments}
                  </span>
                  <span className="sm:hidden">
                    {getRelativeTime(post.createdAt)}
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
      {hasMoreContent && (
        <div
          ref={loadMoreTriggerRef}
          className={`relative text-center ${isLoading ? "h-32" : "h-8"}`}
        >
          {isLoading && <Loader />}
        </div>
      )}
      {!hasMoreContent && posts.length > 0 && (
        <div className="mt-10 flex flex-col items-center gap-1.5 pb-8 text-center">
          <Image
            src="/illustrations/dog-walk.png"
            alt=""
            width={335}
            height={180}
            className="h-auto w-[88px] mix-blend-multiply"
          />
          <p className="text-sm text-sub">新着投稿はここまでです</p>
        </div>
      )}
    </div>
  );
}
