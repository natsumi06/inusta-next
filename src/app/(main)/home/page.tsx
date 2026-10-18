import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import { fetchLatestPosts, fetchPostsCount } from "./../../../../lib/apis";
import { Suspense } from "react";
import PostsWithUserSkeleton from "@/app/components/skeletons/posts-with-user-skeleton";
import PostsList from "@/app/components/pages/posts/posts-list";
import WelcomeModal from "@/app/components/pages/home/welcome-modal";
import { cookies } from "next/headers";
import { WELCOME_COOKIE } from "./../../../../lib/welcome";

export default async function Page() {
  const isFirstVisit = (await cookies()).has(WELCOME_COOKIE);

  return (
    <>
      <BreadCrumbs title="ホーム" description="わんともの新着投稿" />
      <Suspense fallback={<PostsWithUserSkeleton />}>
        <Posts />
      </Suspense>
      {isFirstVisit && <WelcomeModal />}
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
