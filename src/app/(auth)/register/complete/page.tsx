import Image from "next/image";
import Link from "next/link";

const STEPS = [
  { label: "見る", text: "ホームには、わんともたちの新着投稿が並びます" },
  { label: "のせる", text: "愛犬の写真をシェアしよう" },
  { label: "話す", text: "気になる写真にコメントしてみよう" },
] as const;

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-base px-4 py-8 sm:px-6 sm:py-10">
      <Image src="/logo.png" width="80" height="30" alt="inusta" />
      <div className="mt-6 w-full max-w-[760px] rounded-[20px] border border-line bg-white px-6 pb-8 pt-8 sm:px-10 sm:pt-9">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:gap-10 sm:text-left">
          <Image
            src="/illustrations/dog-walk.png"
            alt=""
            aria-hidden="true"
            width={335}
            height={180}
            priority
            className="h-auto w-52 shrink-0 sm:w-[220px]"
          />
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-[28px] font-medium sm:text-[32px]">
              ようこそ
            </h1>
            <p className="mt-2">今日からあなたも「わんとも」です！</p>
            <ul className="mt-5 flex flex-col gap-3.5 text-left">
              {STEPS.map((step, index) => (
                <li
                  key={step.label}
                  className="grid grid-cols-[28px_3.5em_minmax(0,1fr)] items-start gap-x-3"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-soft text-[13px] font-bold">
                    {index + 1}
                  </span>
                  <strong className="text-[15px] leading-7">{step.label}</strong>
                  <span className="pt-0.5 text-[15px] leading-relaxed">
                    {step.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end sm:gap-4">
          <Link
            href="/home"
            className="inline-flex h-12 items-center justify-center rounded-full border-2 border-ink bg-white px-7 text-[15px] font-bold transition hover:bg-soft"
          >
            みんなの投稿を見る
          </Link>
          <Link
            href="/posts/new"
            className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-8 text-[15px] font-bold text-white shadow-cheek transition hover:translate-y-px hover:shadow-none"
          >
            最初の投稿をする
          </Link>
        </div>
      </div>
    </div>
  );
}
