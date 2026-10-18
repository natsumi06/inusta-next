import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import Link from "next/link";
import { fetchDashboard } from "../../../../lib/apis";
import { Suspense } from "react";
import UserSkeleton from "@/app/components/skeletons/user-skeleton";
import ProfileAvatar from "@/app/components/pages/profile/profile-avatar";
import ProfilePostsGrid from "@/app/components/pages/profile/profile-posts-grid";
import EmptyPosts from "@/app/components/pages/profile/empty-posts";
import {
  PlusIcon,
  SettingsIcon,
} from "@/app/components/layouts/navigation-icons";

export default function Page() {
  return (
    <>
      <BreadCrumbs
        title="マイページ"
        description="あなたの投稿とプロフィール"
        action={<SettingsLink />}
      />
      <Suspense fallback={<UserSkeleton />}>
        <Dashboard />
      </Suspense>
    </>
  );
}

/** 設定はユーザーが探しに行く「画面の右上」に置く */
function SettingsLink() {
  return (
    <Link
      href="/mypage/settings"
      className="flex size-[52px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl text-ink transition hover:bg-soft sm:h-10 sm:w-auto sm:flex-row sm:gap-1.5 sm:rounded-full sm:px-3.5"
    >
      <SettingsIcon className="size-6 sm:size-5" />
      <span className="text-[11px] font-bold sm:text-sm">設定</span>
    </Link>
  );
}

async function Dashboard() {
  const user = await fetchDashboard();
  return (
    <div className="mx-auto max-w-5xl sm:px-6">
      <section
        aria-label="プロフィール"
        className="mt-2 border-y border-line bg-white px-4 py-5 sm:mt-6 sm:rounded-2xl sm:border sm:px-8 sm:py-7"
      >
        <div className="flex items-center gap-4 sm:gap-7">
          <ProfileAvatar
            image={user.image}
            name={user.name}
            editHref="/mypage/edit"
          />
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1">
            <p className="max-w-full truncate text-xl font-bold text-ink">
              {user.name}
            </p>
            <p className="whitespace-nowrap text-sm text-sub">
              投稿 <strong className="text-ink">{user.posts.length}</strong> 件
            </p>
            <Link
              href="/mypage/edit"
              className="hidden h-10 items-center rounded-full border-2 border-ink bg-white px-5 text-sm font-bold text-ink transition hover:bg-soft sm:inline-flex"
            >
              プロフィールを編集
            </Link>
          </div>
        </div>

        <div className="mt-4 sm:pl-[124px]">
          {user.description ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink sm:text-[15px]">
              {user.description}
            </p>
          ) : (
            <Link
              href="/mypage/edit"
              className="flex min-h-[52px] max-w-xl items-center gap-2.5 rounded-xl border-[1.5px] border-dashed border-[#b9b9b2] bg-base px-3.5 py-2.5 transition hover:border-sub"
            >
              <span
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-white"
              >
                <PlusIcon className="size-3.5" />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-bold text-ink">
                  自己紹介を書く
                </span>
                <span className="text-xs text-sub">
                  愛犬の名前や犬種を書くと、わんともに覚えてもらえます
                </span>
              </span>
            </Link>
          )}
        </div>

        <Link
          href="/mypage/edit"
          className="mt-4 flex h-11 items-center justify-center rounded-full border-2 border-ink bg-white text-[15px] font-bold text-ink transition hover:bg-soft sm:hidden"
        >
          プロフィールを編集
        </Link>
      </section>

      <section aria-labelledby="my-posts" className="px-4 pb-8 pt-5 sm:px-0">
        <h2 id="my-posts" className="mb-3 text-[15px] font-bold text-ink sm:text-[16px]">
          あなたの投稿
        </h2>
        {user.posts.length > 0 ? (
          <ProfilePostsGrid posts={user.posts} name={user.name} />
        ) : (
          <EmptyPosts>
            <p className="text-sm text-sub">はじめての1枚をのせてみよう</p>
            <Link
              href="/posts/new"
              className="mt-2.5 inline-flex h-12 items-center gap-1.5 rounded-full bg-ink px-7 text-[15px] font-bold text-white shadow-cheek transition hover:translate-y-px hover:shadow-none"
            >
              <PlusIcon className="size-[18px]" />
              写真を投稿する
            </Link>
          </EmptyPosts>
        )}
      </section>
    </div>
  );
}
