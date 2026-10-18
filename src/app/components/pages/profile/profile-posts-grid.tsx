import Image from "next/image";
import Link from "next/link";

type Post = { id: string; image: string; caption: string };

/** プロフィールの投稿一覧（3列の写真）。押すと投稿詳細へ */
export default function ProfilePostsGrid({
  posts,
  name,
}: {
  posts: Post[];
  name: string;
}) {
  return (
    <div className="-mx-4 grid grid-cols-3 gap-0.5 sm:mx-0 sm:gap-1">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className="group relative block overflow-hidden"
        >
          <Image
            className="aspect-square w-full object-cover transition duration-200 group-hover:brightness-110"
            src={post.image}
            alt={post.caption || `${name}さんの投稿`}
            width={400}
            height={400}
          />
          {post.caption && (
            <div className="absolute inset-0 hidden items-end bg-black/50 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:flex">
              <p className="truncate text-xs text-white">{post.caption}</p>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
