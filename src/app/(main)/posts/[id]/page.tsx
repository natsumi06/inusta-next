import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import NavigationAvatar from "@/app/components/layouts/navigation-avatar";
import { ChevronLeftIcon } from "@/app/components/layouts/navigation-icons";
import PostMenu from "@/app/components/pages/posts/post-menu";
import Image from "next/image";
import Link from "next/link";
import { fetchPostwithComments, fetchMe } from "./../../../../../lib/apis";
import { createComment } from "./../../../../../lib/actions";
import { getRelativeTime } from "./../../../../../lib/relative-time";

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
      <BreadCrumbs title="投稿詳細" />
      <div className="mx-auto max-w-5xl sm:px-6 sm:pb-10">
        <div className="px-4 pt-1 sm:px-0 sm:pt-2">
          <Link
            href="/home"
            className="-ml-1.5 inline-flex h-11 items-center gap-0.5 pr-3 text-sm font-bold text-ink"
          >
            <ChevronLeftIcon className="size-5" />
            ホーム
          </Link>
        </div>
        <article className="border-y border-line bg-white sm:grid sm:grid-cols-[minmax(0,7fr)_minmax(0,6fr)] sm:rounded-2xl sm:border">
          <Image
            className="aspect-square w-full object-cover sm:rounded-l-2xl"
            src={post.image}
            width={640}
            height={640}
            alt={`${post.user.name}さんの投稿`}
            priority
          />
          {/* PC は写真と同じ高さにそろえ、コメントだけスクロールさせる */}
          <div className="sm:relative">
            <div className="flex flex-col sm:absolute sm:inset-0">
              <div className="flex flex-col gap-3 border-b border-line px-4 pb-5 pt-4 sm:px-5 sm:pt-5">
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/users/${post.user.id}`}
                    className="flex min-h-11 min-w-0 items-center gap-2.5"
                  >
                    <NavigationAvatar
                      image={post.user.image}
                      className="size-11 shrink-0 border-2 border-ink"
                    />
                    <span className="flex min-w-0 flex-col">
                      <strong className="truncate text-[16px]">
                        {post.user.name}
                      </strong>
                      <span className="text-xs text-sub">
                        {getRelativeTime(post.createdAt)}
                      </span>
                    </span>
                  </Link>
                  {isOwner && (
                    <div className="-mr-2.5 sm:mr-0">
                      <PostMenu postId={post.id} postImage={post.image} />
                    </div>
                  )}
                </div>
                {post.caption && (
                  <p className="whitespace-pre-wrap text-[15px] leading-[1.8]">
                    {post.caption}
                  </p>
                )}
              </div>

              <section
                aria-labelledby="comments-title"
                className="flex flex-col gap-1.5 px-4 pt-4 sm:min-h-0 sm:flex-1 sm:px-5"
              >
                <h2
                  id="comments-title"
                  className="font-heading text-lg font-medium"
                >
                  コメント <span className="text-[15px]">{post.comments.length}件</span>
                </h2>
                {post.comments.length > 0 ? (
                  <ul className="divide-y divide-line sm:min-h-0 sm:flex-1 sm:overflow-y-auto">
                    {post.comments.map((comment) => (
                      <li key={comment.id} className="flex gap-2.5 py-3">
                        <NavigationAvatar
                          image={comment.user.image}
                          className="size-8 shrink-0 border-[1.5px] border-ink"
                        />
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <div className="flex items-baseline gap-2">
                            <strong className="truncate text-[13px]">
                              {comment.user.name}
                            </strong>
                            <span className="shrink-0 text-[11px] text-sub">
                              {getRelativeTime(comment.createdAt)}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                            {comment.text}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="py-3 text-sm text-sub sm:flex-1">
                    まだコメントはありません
                  </p>
                )}
              </section>

              <form
                action={createCommentWithPostId}
                className="flex flex-col gap-2 border-t border-line px-4 pb-5 pt-3.5 sm:px-5"
              >
                <label htmlFor="comment-text" className="text-sm font-bold">
                  コメントを書く
                </label>
                <div className="flex gap-2 sm:gap-2.5">
                  <input
                    id="comment-text"
                    name="text"
                    required
                    maxLength={500}
                    autoComplete="off"
                    placeholder="かわいいですね！"
                    className="h-[52px] min-w-0 flex-1 rounded-xl border-[1.5px] border-ink bg-white px-3.5 text-[16px] text-ink shadow-[0_2px_0_var(--color-line)] placeholder:text-[#8a8a84] focus:outline-2 focus:outline-offset-2 focus:outline-ink sm:h-[50px]"
                  />
                  <button
                    type="submit"
                    className="h-[52px] shrink-0 rounded-full bg-ink px-5 text-[15px] font-bold text-white shadow-cheek transition hover:translate-y-px hover:shadow-none sm:h-[50px] sm:px-6"
                  >
                    送る
                  </button>
                </div>
              </form>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
