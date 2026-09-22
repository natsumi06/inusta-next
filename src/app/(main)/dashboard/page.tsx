import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import Image from "next/image";
import Link from "next/link";
import { logout } from "../../../../lib/actions";
import { fetchDashboard } from "../../../../lib/apis";
import IconSkeleton from "@/app/components/skeletons/icon-skeleton";
import { Suspense } from "react";
import UserSkeleton from "@/app/components/skeletons/user-skeleton";

export default function Page() {
  return (
    <>
      <BreadCrumbs title="マイページ 🐾" />
      <Suspense fallback={<UserSkeleton />}>
        <Dashboard />
      </Suspense>
    </>
  );
}

async function Dashboard() {
  const user = await fetchDashboard();
  return (
    <div className="mx-auto max-w-5xl">
      <div className="relative mt-8 flex items-start bg-white p-5 sm:p-6">
        <div className="flex min-w-0 gap-3 sm:gap-4">
          {user.image ? (
            <Image
              className="block size-20 shrink-0 rounded-full object-cover sm:size-24"
              src={user.image}
              width={96}
              height={96}
              alt="user icon"
            />
          ) : (
            <IconSkeleton />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <p className="truncate text-lg font-semibold text-black">
                {user.name}
              </p>
              <details className="relative shrink-0">
                <summary className="list-none cursor-pointer rounded p-1 hover:bg-gray-50">
                  <Image
                    src="/icon/setting/normal.svg"
                    width={20}
                    height={21}
                    alt="設定"
                  />
                </summary>
                <div className="absolute left-0 z-10 mt-2 w-52 origin-top-left divide-y divide-gray-100 rounded-md border border-gray-200 bg-white shadow-lg">
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      プロフィールを編集
                    </Link>
                  </div>
                  <div className="py-1">
                    <form action={logout}>
                      <button
                        type="submit"
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        ログアウト 🐾
                      </button>
                    </form>
                  </div>
                </div>
              </details>
            </div>
            {user.description && (
              <p className="mt-2 whitespace-pre-wrap font-medium text-black">
                {user.description}
              </p>
            )}
            {!!user.description || (
              <p className="mt-2 whitespace-pre-wrap text-sm text-black opacity-20">
                「プロフィールを編集」から
                <br />
                自己紹介を入力しましょう 
              </p>
            )}
            <div className="mt-5 flex items-center gap-3">
              <p className="whitespace-nowrap text-sm font-semibold text-black">
                投稿{user.posts.length}件
              </p>
              <Link
                href="/profile"
                className="whitespace-nowrap rounded border px-2 py-1 text-sm font-semibold text-black hover:bg-gray-50"
              >
                プロフィールを編集
              </Link>
            </div>
          </div>
        </div>

      </div>
      <div className="my-8 bg-white">
        {user.posts.length > 0 ? (
          <div className="grid grid-cols-3 gap-1">
            {user.posts.map((post) => {
              return (
                <div key={post.id} className="relative group overflow-hidden">
                  <Link href={`/posts/${post.id}`}>
                    <Image
                      className="aspect-[1/1] w-full object-cover transition duration-200 group-hover:brightness-110 group-hover:contrast-90"
                      src={post.image}
                      alt="post"
                      width={300}
                      height={300}
                    />
                  </Link>

                  <div className="pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="absolute right-2 top-1 hidden rounded-full p-1  group-hover:block"
                  >
                    🐾
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 px-4 text-center">
            <p className="text-gray-500 text-lg">📸</p>
            <p className="text-gray-500">まだ投稿がありません</p>
            <Link
              href="/posts/create"
              className="mt-4 inline-block rounded bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700"
            >
              最初の投稿をする
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
