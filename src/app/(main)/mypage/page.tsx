import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import Link from "next/link";
import { fetchDashboard } from "../../../../lib/apis";
import { Suspense } from "react";
import UserSkeleton from "@/app/components/skeletons/user-skeleton";
import IconEditModal from "@/app/components/pages/profile/icon-edit-modal";
import BioEditModal from "@/app/components/pages/profile/bio-edit-modal";
import ProfilePostsGrid from "@/app/components/pages/profile/profile-posts-grid";
import EmptyPosts from "@/app/components/pages/profile/empty-posts";
import {
  PencilIcon,
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
      className="flex size-[52px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl text-ink transition hover:bg-soft sm:h-12 sm:w-auto sm:flex-row sm:gap-2 sm:rounded-full sm:border-2 sm:border-line sm:bg-white sm:pl-[18px] sm:pr-[22px] sm:hover:border-sub"
    >
      <SettingsIcon className="size-6 sm:size-[22px]" />
      <span className="text-[11px] font-bold sm:text-[15px]">設定</span>
    </Link>
  );
}

async function Dashboard() {
  const user = await fetchDashboard();
  return (
    <div className="mx-auto max-w-5xl sm:px-6">
      <section
        aria-label="プロフィール"
        className="mt-2 border-y border-line bg-white px-4 py-5 sm:mt-6 sm:rounded-2xl sm:border sm:px-9 sm:py-8"
      >
        {/* 左にプロフィールのまとまり、右上に「プロフィールを編集」（中身と操作を分ける） */}
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3 sm:gap-x-7">
          <IconEditModal image={user.image} name={user.name} />
          <div className="min-w-0 self-center sm:self-start sm:pt-2.5">
            <p className="truncate text-xl font-bold text-ink sm:text-2xl">
              {user.name}
            </p>
            <p className="mt-0.5 text-sm text-sub">
              投稿 <strong className="text-ink">{user.posts.length}</strong> 件
            </p>
          </div>
          <Link
            href="/mypage/edit"
            className="-mr-2 inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full pl-2.5 pr-3.5 text-sm font-bold text-ink transition hover:bg-soft sm:text-[15px]"
          >
            <PencilIcon className="size-[18px]" />
            プロフィールを編集
          </Link>
          <div className="col-span-3 flex flex-col items-start gap-1 sm:col-span-1 sm:col-start-2">
            {user.description ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink sm:text-[15px]">
                {user.description}
              </p>
            ) : (
              <BioEditModal />
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="my-posts" className="px-4 pb-8 pt-5 sm:px-0">
        <h2
          id="my-posts"
          className="mb-3 text-[15px] font-bold text-ink sm:text-[16px]"
        >
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
