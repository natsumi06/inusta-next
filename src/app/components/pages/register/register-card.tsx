import Image from "next/image";
import clsx from "clsx";

/**
 * 会員登録まわりの外枠
 * スマホは画面いっぱい（カードなし）、PC はロゴの下に白いカード
 */
export default function RegisterCard({
  children,
  wide = false,
  logoOnMobile = true,
}: {
  children: React.ReactNode;
  /** PC のカード幅を広くする（準備完了画面） */
  wide?: boolean;
  /** スマホでもロゴを出す（1問ずつの画面では出さない） */
  logoOnMobile?: boolean;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-base px-6 pb-8 pt-4 sm:items-center sm:py-10">
      <Image
        src="/logo.png"
        width="80"
        height="30"
        alt="inusta"
        className={clsx("self-center", logoOnMobile ? "mt-2" : "hidden sm:block")}
      />
      <div
        className={clsx(
          "flex flex-1 flex-col gap-6 sm:mt-7 sm:w-full sm:gap-7 sm:flex-none sm:rounded-[20px] sm:border sm:border-line sm:bg-white",
          wide
            ? "sm:max-w-[760px] sm:px-10 sm:pb-8 sm:pt-9"
            : "sm:max-w-[560px] sm:px-12 sm:pb-10 sm:pt-7"
        )}
      >
        {children}
      </div>
    </div>
  );
}
