import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import Image from "next/image";
import Link from "next/link";
import { fetchPostwithComments, fetchMe } from "./../../../../../lib/apis";
import { createComment } from "./../../../../../lib/actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const post = await fetchPostwithComments(id);
  const currentUser = await fetchMe().catch(() => null);
  const isOwner = currentUser && post.user.email === currentUser.email;
  const createCommentWithPostId = createComment.bind(null, id);
  return (
    <>
      <BreadCrumbs title="投稿詳細 🐾" />
      <div className="mx-auto max-w-5xl">
        <div className="mt-8 grid grid-cols-1 gap-1 bg-white md:grid-cols-2">
          <Image
            className="aspect-[1/1] w-full object-cover"
            src={post.image}
            width={640}
            height={640}
            alt="post"
          />
          <div className="p-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">オーナー</h3>
              <div className="flex items-center gap-2">
                {isOwner && (
                  <Link
                    href={`/posts/${id}/edit`}
                    className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    編集
                  </Link>
                )}
                <div className="text-xs text-gray-500">
                  公開日: {post.createdAt.toLocaleString("ja-JP")}
                </div>
              </div>
            </div>
            <Link href={`/users/${post.user.id}`}>
              <div className="mt-2 flex rounded border bg-white p-2">
                {post.user.image && (
                  <Image
                    className="block aspect-[1/1] size-12 rounded-full object-cover"
                    src={post.user.image}
                    width={96}
                    height={96}
                    alt="user icon"
                  />
                )}
                <div className="pl-4">
                  <p className="text-lg font-semibold text-black">
                    {post.user.name}
                  </p>
                  <p className="whitespace-pre-wrap text-sm font-medium text-black">
                    {post.user.description}
                  </p>
                </div>
              </div>
            </Link>
            <h3 className="mt-2 font-semibold">キャプション</h3>
            <p className="whitespace-pre-wrap py-2  text-gray-700">
              {post.caption}
            </p>
            <h3 className="mt-2 font-semibold">
              コメント{post.comments.length}件
            </h3>
            <div className="max-h-96 overflow-y-scroll">
              {post.comments.map((comment) => {
                return (
                  <div key={comment.id} className="border-b py-2">
                    <div className="mb-1 flex items-center">
                      {comment.user.image && (
                        <Image
                          src={comment.user.image}
                          className="size-6 rounded-full"
                          width={48}
                          height={48}
                          alt="user icon"
                        />
                      )}
                      <div className="ml-1 text-sm font-medium text-gray-800">
                        {comment.user.name}
                      </div>
                      <div className="ml-1 text-xs text-gray-500">
                        {comment.createdAt.toLocaleString("ja-JP")}
                      </div>
                    </div>
                    <p className="text-sm text-black">{comment.text}</p>
                  </div>
                );
              })}
            </div>
            <form action={createCommentWithPostId}>
              <div className="mt-2 flex">
                <input
                  name="text"
                  className="mr-2 grow rounded-md border border-gray-300 pl-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-700"
                  placeholder="コメントを追加..."
                />
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900"
                >
                  送信
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
