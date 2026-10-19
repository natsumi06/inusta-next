import Image from "next/image";

/** 投稿が0件のときの表示。children に案内文やボタンを渡す */
export default function EmptyPosts({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-12 text-center sm:rounded-2xl sm:border sm:border-line sm:bg-white">
      <Image
        src="/illustrations/dog-sleep.png"
        alt=""
        width={640}
        height={327}
        className="h-auto w-28 sm:w-36"
      />
      <p className="mt-3 font-heading text-lg font-medium text-ink sm:text-xl">
        まだ投稿がありません
      </p>
      {children}
    </div>
  );
}
