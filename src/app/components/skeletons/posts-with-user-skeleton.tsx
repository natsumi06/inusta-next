import { PawIcon } from "./paw-icon";

/** ホームの読み込み中。投稿カードと同じ形の、うすグレーの箱を並べる */
export default function PostsWithUserSkeleton() {
  return (
    <div
      role="status"
      className="mx-auto w-full px-4 py-4 sm:max-w-5xl sm:px-6 sm:py-8"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
        {Array.from({ length: 6 }, (_, i) => (
          <Post key={i} />
        ))}
      </div>
      <span className="sr-only">読み込み中</span>
    </div>
  );
}

function Post() {
  return (
    <div className="animate-yuru-pulse overflow-hidden rounded-xl border border-line bg-white">
      <div className="flex aspect-square items-center justify-center bg-soft">
        <PawIcon className="size-8 text-line sm:size-10" />
      </div>
      <div className="flex flex-col gap-2 p-2.5 sm:p-3.5">
        <div className="flex items-center gap-1.5">
          <span className="size-[22px] rounded-full bg-soft sm:size-7" />
          <span className="h-2.5 w-16 rounded-full bg-soft" />
        </div>
        <span className="h-2.5 w-[90%] rounded-full bg-soft" />
        <span className="h-2 w-2/5 rounded-full bg-soft" />
      </div>
    </div>
  );
}
