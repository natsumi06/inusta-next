import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import IconSkeleton from "@/app/components/skeletons/icon-skeleton";
import { fetchUser } from "./../../../../../lib/apis";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import UserSkeleton from "@/app/components/skeletons/user-skeleton";

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
  const user = await fetchUser(id);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mt-8 flex bg-white p-4">
        {user.image && (
          <Image
            className="block aspect-[1/1] rounded-full object-cover"
            src={user.image}
            width={96}
            height={96}
            alt="user icon"
          />
        )}

        {!!user.image || <IconSkeleton />}

        <div className="pl-4">
          <p className="text-lg font-semibold text-black">{user.name}</p>
          <p className="whitespace-pre-wrap font-medium  text-black">
            {user.description}
          </p>
          <div className="mt-4 flex">
            <p className="text-sm font-semibold text-black">
              投稿{user.posts.length}件
            </p>
          </div>
        </div>
      </div>
      <div className="my-8 bg-white">
        {user.posts.length > 0 ? (
          <div className="grid grid-cols-3 gap-1">
            {user.posts.map((post) => {
              const caption = post.caption
                ? post.caption.length > 50
                  ? post.caption.substring(0, 50) + "..."
                  : post.caption
                : "";
              return (
                <Link href={`/posts/${post.id}`} key={post.id}>
                  <div className="relative group overflow-hidden">
                    <Image
                      className="aspect-[1/1] w-full object-cover transition duration-200 group-hover:brightness-110"
                      src={post.image}
                      width={400}
                      height={400}
                      alt="user icon"
                    />
                    {caption && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
                        <p className="text-xs text-white truncate">{caption}</p>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-16 px-4 text-center">
            <p className="text-gray-500 text-lg">🐾</p>
            <p className="text-gray-500">まだ投稿がありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
