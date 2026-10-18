import Link from "next/link";
import clsx from "clsx";
import WalkProgress from "./walk-progress";

function BackIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[18px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 5 8 12l7 7" />
    </svg>
  );
}

/** 主張を控えた「もどる」ボタン（グレーのふち） */
export function BackButton({
  href,
  className,
}: {
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "items-center justify-center gap-1 rounded-full border-2 border-[#e0dfd8] bg-white pl-5 pr-7 text-[15px] font-bold text-sub transition hover:border-sub hover:text-ink",
        className
      )}
    >
      <BackIcon />
      もどる
    </Link>
  );
}

/**
 * 1問ずつの画面の上部
 * スマホは左上に「もどる」、その下におさんぽ進捗
 */
export function StepHeader({
  step,
  backHref,
}: {
  step: 1 | 2 | 3;
  backHref?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="min-h-10 sm:hidden">
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex h-10 items-center gap-1 rounded-full border border-line bg-white pl-2 pr-3.5 text-sm font-bold"
          >
            <BackIcon />
            もどる
          </Link>
        )}
      </div>
      <WalkProgress step={step} />
    </div>
  );
}

/** 1問ずつの画面の見出し */
export function StepTitle({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 text-center">
      {children}
      <h1 className="font-heading text-[26px] font-medium sm:text-[30px]">
        {title}
      </h1>
      <p className="text-[15px] text-sub">{lead}</p>
    </div>
  );
}

/**
 * 1問ずつの画面の下部
 * PC は「もどる」と「つぎへ」を横並び、スマホは「つぎへ」を画面下いっぱいに
 */
export function StepFooter({
  backHref,
  skipHref,
  disabled = false,
}: {
  backHref?: string;
  skipHref?: string;
  disabled?: boolean;
}) {
  return (
    <div className="mt-auto flex flex-col items-center gap-1 sm:mt-0 sm:gap-2">
      <div className="flex w-full items-center justify-center gap-3">
        {backHref && (
          <BackButton href={backHref} className="hidden h-[52px] sm:inline-flex" />
        )}
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex h-[52px] w-full items-center justify-center rounded-full bg-ink px-8 text-[16px] font-bold text-white shadow-cheek transition hover:translate-y-px hover:shadow-none disabled:cursor-not-allowed disabled:bg-line disabled:text-sub disabled:shadow-none disabled:hover:translate-y-0 sm:w-auto sm:min-w-[220px]"
        >
          つぎへ
        </button>
      </div>
      {skipHref && (
        <Link
          href={skipHref}
          className="inline-flex h-11 items-center px-4 text-sm font-medium text-sub underline underline-offset-[3px] hover:text-ink"
        >
          スキップ
        </Link>
      )}
    </div>
  );
}

/** 送信エラー */
export function StepError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-3 text-sm text-red-600">
      {message}
    </p>
  );
}
