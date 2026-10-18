import Image from "next/image";
import Link from "next/link";
import RegisterCard from "@/app/components/pages/register/register-card";
import WalkProgress from "@/app/components/pages/register/walk-progress";
import { BackButton } from "@/app/components/pages/register/step-parts";

export default function Page() {
  return (
    <RegisterCard wide>
      <div className="mt-1 sm:mt-0">
        <WalkProgress step={4} />
      </div>
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:gap-10 sm:text-left">
        <Image
          src="/illustrations/dog-photo.png"
          alt="スマホで写真を撮られている子犬"
          width={700}
          height={583}
          priority
          className="mt-2 h-auto w-[280px] shrink-0 motion-safe:animate-yuru-bob sm:mt-0 sm:w-[320px]"
        />
        <div className="w-full min-w-0 flex-1">
          <h1 className="font-heading text-[28px] font-medium sm:text-[32px]">
            ようこそ
          </h1>
          <p className="mt-2.5 text-[15px] leading-[1.8] sm:mt-2 sm:text-[16px]">
            今日からあなたも「わんとも」です！
          </p>
        </div>
      </div>
      <div className="mt-auto flex flex-col gap-3 pt-2 sm:mt-1 sm:flex-row-reverse sm:items-center sm:justify-between sm:gap-4 sm:border-t sm:border-line sm:pt-6">
        <Link
          href="/home"
          className="inline-flex h-[52px] items-center justify-center rounded-full bg-ink px-8 text-[16px] font-bold text-white shadow-cheek transition hover:translate-y-px hover:shadow-none sm:h-12 sm:min-w-[200px] sm:text-[15px]"
        >
          Start！
        </Link>
        <BackButton href="/register/bio" className="inline-flex h-12" />
      </div>
    </RegisterCard>
  );
}
