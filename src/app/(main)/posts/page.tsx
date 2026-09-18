import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import { fetchLatestPosts, fetchPostsCount } from "./../../../../lib/apis";
import { Suspense } from "react";
import PostsWithUserSkeleton from "@/app/components/skeletons/posts-with-user-skeleton";
import PostsList from "@/app/components/pages/posts/posts-list";

export default async function Page() {
  return (
    <>
      <BreadCrumbs title="新着投稿 🐾" />
      <Suspense fallback={<PostsWithUserSkeleton />}>
        <Posts />
      </Suspense>
    </>
  );
}

async function Posts() {
  const posts = await fetchLatestPosts(0, 20);
  const totalCount = await fetchPostsCount();
  const hasMore = (posts.length ?? 0) < totalCount;

  return (
    <PostsList initialPosts={posts} hasMore={hasMore} totalCount={totalCount} />
  );
}
