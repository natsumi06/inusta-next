import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import { fetchUser } from "./../../../../../lib/apis";
import { auth } from "./../../../../../auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import UserSkeleton from "@/app/components/skeletons/user-skeleton";
import ProfileAvatar from "@/app/components/pages/profile/profile-avatar";
import ProfilePostsGrid from "@/app/components/pages/profile/profile-posts-grid";
import EmptyPosts from "@/app/components/pages/profile/empty-posts";
import { ChevronLeftIcon } from "@/app/components/layouts/navigation-icons";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: PageProps) {
  return (
    <>
      <BreadCrumbs title="ユーザー詳細" />
      <Suspense fallback={<UserSkeleton />}>
        <UserDetail params={params} />
      </Suspense>
    </>
  );
}

async function UserDetail({ params }: PageProps) {
  const { id } = await params;
  const [user, session] = await Promise.all([fetchUser(id), auth()]);

  // 自分のページは2種類にせず、マイページに集める
  if (session?.user?.email && session.user.email === user.email) {
    redirect("/mypage");
  }

  return (
    <div className="mx-auto max-w-5xl sm:px-6">
      <div className="px-4 pt-2 sm:px-0 sm:pt-4">
        <Link
          href="/users"
          className="-ml-1.5 inline-flex h-11 items-center gap-0.5 pr-3 text-sm font-bold text-ink"
        >
          <ChevronLeftIcon className="size-5" />
          ユーザー一覧
        </Link>
      </div>
      <section
        aria-label="プロフィール"
        className="border-y border-line bg-white px-4 py-5 sm:rounded-2xl sm:border sm:px-8 sm:py-7"
      >
        <div className="flex items-center gap-4 sm:gap-7">
          <ProfileAvatar image={user.image} name={user.name} />
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1">
            <p className="max-w-full truncate text-xl font-bold text-ink">
              {user.name}
            </p>
            <p className="whitespace-nowrap text-sm text-sub">
              投稿 <strong className="text-ink">{user.posts.length}</strong> 件
            </p>
          </div>
        </div>
        {/* 自己紹介が空なら何も出さない（書くよう促すのはマイページだけ） */}
        {user.description && (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink sm:pl-[140px] sm:text-[15px]">
            {user.description}
          </p>
        )}
      </section>

      <section
        aria-label={`${user.name}さんの投稿`}
        className="px-4 pb-8 pt-5 sm:px-0"
      >
        {user.posts.length > 0 ? (
          <ProfilePostsGrid posts={user.posts} name={user.name} />
        ) : (
          <EmptyPosts />
        )}
      </section>
    </div>
  );
}
