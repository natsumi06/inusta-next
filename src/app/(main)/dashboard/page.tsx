import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import Image from "next/image";
import Link from "next/link";
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
      <div className="mt-8 flex bg-white p-4">
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
              href="/posts/create"
              className="ml-2 rounded bg-blue-600 text-white px-3 py-1 text-sm font-semibold hover:bg-blue-700"
            >
              + 投稿する
            </Link>
            <Link
              href="/profile"
              className="ml-2 rounded border px-2 text-sm font-semibold text-black hover:bg-gray-50"
            >
              プロフィール編集
            </Link>
          </div>
        </div>
      </div>
      <div className="my-8 bg-white">
        {user.posts.length > 0 ? (
          <div className="grid grid-cols-3 gap-1">
            {user.posts.map((post) => {
              return (
                <div key={post.id} className="relative group">
                  <Link href={`/posts/${post.id}`}>
                    <Image
                      className="aspect-[1/1] w-full object-cover"
                      src={post.image}
                      alt="post"
                      width={300}
                      height={300}
                    />
                  </Link>
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="absolute right-2 top-2 hidden rounded-full bg-black/50 p-2 text-white hover:bg-black/70 group-hover:block"
                  >
                    ✎
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
