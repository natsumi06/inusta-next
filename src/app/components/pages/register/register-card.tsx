import Image from "next/image";

/**
 * 会員登録の各ステップで使う外枠（ロゴ＋白いカード）
 */
export default function RegisterCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-base px-4 py-8 sm:px-6 sm:py-10">
      <Image src="/logo.png" width="80" height="30" alt="inusta" />
      <div className="mt-6 w-full max-w-[760px] rounded-[20px] border border-line bg-white px-6 pb-8 pt-8 sm:px-10 sm:pt-9">
        {children}
      </div>
    </div>
  );
}
