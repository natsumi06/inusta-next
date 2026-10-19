import { PawIcon } from "./paw-icon";

/** マイページ・わんとものページの読み込み中。プロフィールと投稿の並びと同じ形の箱 */
export default function UserSkeleton() {
  return (
    <div role="status" className="mx-auto max-w-5xl sm:px-6">
      <div className="h-11 sm:h-[60px]" />
      <div className="flex animate-yuru-pulse items-center gap-4 border-y border-line bg-white px-4 py-5 sm:gap-7 sm:rounded-2xl sm:border sm:px-8 sm:py-7">
        <span className="size-20 shrink-0 rounded-full bg-soft sm:size-28" />
        <div className="flex flex-1 flex-col gap-3">
          <span className="h-4 w-36 rounded-full bg-soft sm:w-44" />
          <span className="h-2.5 w-[70%] rounded-full bg-soft" />
          <span className="h-2.5 w-1/2 rounded-full bg-soft" />
        </div>
      </div>
      <div className="grid animate-yuru-pulse grid-cols-3 gap-0.5 pb-8 pt-5 sm:gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center bg-soft sm:rounded-xl"
          >
            <PawIcon className="size-8 text-line sm:size-10" />
          </div>
        ))}
      </div>
      <span className="sr-only">読み込み中</span>
    </div>
  );
}
