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
      <div className="mt-8 flex items-start justify-between bg-white p-4">
        <div className="flex">
          {user.image ? (
            <Image
              className="block aspect-[1/1] size-24 rounded-full object-cover"
              src={user.image}
              width={96}
              height={96}
              alt="user icon"
            />
          ) : (
            <IconSkeleton />
          )}
          <div className="pl-4">
            <p className="text-lg font-semibold text-black">{user.name}</p>
            {user.description && (
              <p className="whitespace-pre-wrap font-medium text-black">
                {user.description}
              </p>
            )}
            {!!user.description || (
              <p className="whitespace-pre-wrap text-sm opacity-20 text-black">
                🐾🐾🐾 「プロフィールを編集」から
                <br />
                自己紹介を入力しましょう 🐾🐾🐾
              </p>
            )}
            <div className="mt-4 flex gap-2">
              <p className="text-sm font-semibold text-black">
                投稿{user.posts.length}件
              </p>
              <Link
                href="/profile"
                className="ml-2 rounded border px-2 text-sm font-semibold text-black hover:bg-gray-50"
              >
                プロフィール編集
              </Link>
            </div>
          </div>
        </div>

        <details className="relative">
          <summary className="list-none cursor-pointer rounded border px-3 py-1.5 text-sm font-semibold text-black hover:bg-gray-50">
            設定
          </summary>
          <div className="absolute right-0 z-10 mt-2 w-52 origin-top-right divide-y divide-gray-100 rounded-md border border-gray-200 bg-white shadow-lg">
            <div className="py-1">
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                マイページ
              </Link>
            </div>
            <div className="py-1">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                プロフィール
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
