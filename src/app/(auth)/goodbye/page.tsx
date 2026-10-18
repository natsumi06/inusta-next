import Image from "next/image";
import Link from "next/link";
import RegisterCard from "@/app/components/pages/register/register-card";

/**
 * 退会したあとの画面（ログアウト済みで表示する）
 */
export default function Page() {
  return (
    <RegisterCard>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center sm:flex-none sm:py-4">
        <Image
          src="/illustrations/dog-walk.png"
          alt=""
          aria-hidden="true"
          width={335}
          height={180}
          priority
          className="h-auto w-52 mix-blend-multiply"
        />
        <h1 className="mt-2 font-heading text-[26px] font-medium sm:text-[28px]">
          退会しました
        </h1>
        <p className="text-[15px] leading-[1.8] text-sub">
          いままで使ってくれて、ありがとうございました。
          <br />
          またいつでも、わんこを見にきてください。
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex h-12 items-center rounded-full border-2 border-ink bg-white px-7 text-[15px] font-bold text-ink transition hover:bg-soft"
        >
          トップへ
        </Link>
      </div>
    </RegisterCard>
  );
}
