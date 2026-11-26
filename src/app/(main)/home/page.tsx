import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import { fetchLatestPosts, fetchPostsCount } from "./../../../../lib/apis";
import { Suspense } from "react";
import PostsWithUserSkeleton from "@/app/components/skeletons/posts-with-user-skeleton";
import PostsList from "@/app/components/pages/posts/posts-list";
import WelcomeModal from "@/app/components/pages/home/welcome-modal";

export default function Page() {
  return (
    <>
      <BreadCrumbs title="ホーム" description="わんともの新着投稿" />
      <Suspense fallback={<PostsWithUserSkeleton />}>
        <Posts />
      </Suspense>
      {/* 準備完了画面の「Start！」（/home?welcome=1）から来たときだけ開く */}
      <WelcomeModal />
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
