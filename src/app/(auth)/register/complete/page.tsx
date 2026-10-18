import Image from "next/image";
import Link from "next/link";
import RegisterCard from "@/app/components/pages/register/register-card";
import WalkProgress from "@/app/components/pages/register/walk-progress";
import { BackButton } from "@/app/components/pages/register/step-parts";

const STEPS = [
  { label: "見る", text: "ホームには、わんともたちの新着投稿が並びます" },
  { label: "のせる", text: "愛犬の写真をシェアしよう" },
  { label: "話す", text: "気になる写真にコメントしてみよう" },
] as const;

export default function Page() {
  return (
    <RegisterCard wide>
      <div className="mt-1 sm:mt-0">
        <WalkProgress step={4} />
      </div>
      <div className="flex flex-col items-center gap-7 text-center sm:flex-row sm:gap-10 sm:text-left">
        <Image
          src="/illustrations/dog-walk.png"
          alt=""
          aria-hidden="true"
          width={335}
          height={180}
          priority
          className="mt-4 h-auto w-60 shrink-0 mix-blend-multiply sm:mt-0 sm:w-[220px]"
        />
        <div className="w-full min-w-0 flex-1">
          <h1 className="font-heading text-[28px] font-medium sm:text-[32px]">
            ようこそ
          </h1>
          <p className="mt-2.5 text-[15px] leading-[1.8] sm:mt-2 sm:text-[16px]">
            今日からあなたも「わんとも」です！
          </p>
          <ul className="mt-7 flex flex-col gap-3 rounded-2xl border border-line bg-white px-5 py-[18px] text-left sm:mt-5 sm:gap-3.5 sm:border-0 sm:p-0">
            {STEPS.map((step, index) => (
              <li
                key={step.label}
                className="grid grid-cols-[26px_minmax(0,1fr)] items-start gap-x-3 sm:grid-cols-[28px_3.5em_minmax(0,1fr)]"
              >
                <span className="flex size-[26px] items-center justify-center rounded-full bg-soft text-[13px] font-bold sm:size-7">
                  {index + 1}
                </span>
                <span className="text-sm leading-[1.7] sm:contents sm:text-[15px]">
                  <strong className="sm:leading-7">{step.label}</strong>
                  <span className="sm:hidden">　</span>
                  <span className="sm:pt-0.5 sm:leading-relaxed">
                    {step.text}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-auto flex flex-col gap-3 pt-2 sm:mt-1 sm:flex-row-reverse sm:items-center sm:justify-between sm:gap-4 sm:border-t sm:border-line sm:pt-6">
        <Link
          href="/home"
          className="inline-flex h-[52px] items-center justify-center rounded-full bg-ink px-8 text-[16px] font-bold text-white shadow-cheek transition hover:translate-y-px hover:shadow-none sm:h-12 sm:text-[15px]"
        >
          みんなの投稿を見る
        </Link>
        <BackButton href="/register/bio" className="inline-flex h-12" />
      </div>
    </RegisterCard>
  );
}
