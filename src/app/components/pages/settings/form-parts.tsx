import Link from "next/link";
import clsx from "clsx";
import { ChevronLeftIcon } from "@/app/components/layouts/navigation-icons";

/** 設定まわりの入力欄（design.md「入力欄」） */
export const inputClassName =
  "h-[52px] w-full rounded-xl border-[1.5px] border-ink bg-white px-4 text-[16px] text-ink shadow-[0_2px_0_var(--color-line)] placeholder:text-[#8a8a84] focus:outline-2 focus:outline-offset-2 focus:outline-ink sm:h-[50px]";

export const primaryButtonClassName =
  "inline-flex h-[52px] w-full items-center justify-center rounded-full bg-ink px-8 text-[16px] font-bold text-white shadow-cheek transition enabled:hover:translate-y-px enabled:hover:shadow-none disabled:opacity-40 sm:h-12 sm:w-auto sm:min-w-[200px] sm:text-[15px]";

export function BackLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="-ml-1.5 inline-flex h-11 items-center gap-0.5 self-start pr-3 text-sm font-bold text-ink"
    >
      <ChevronLeftIcon className="size-5" />
      {children}
    </Link>
  );
}

export function FieldErrors({
  id,
  errors,
}: {
  id?: string;
  errors?: string[];
}) {
  if (!errors?.length) return null;
  return (
    <div id={id} className="flex flex-col gap-0.5">
      {errors.map((error) => (
        <p className="text-sm text-red-600" key={error}>
          {error}
        </p>
      ))}
    </div>
  );
}

export function Field({
  id,
  label,
  errors,
  hint,
  children,
}: {
  id: string;
  label: string;
  errors?: string[];
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-bold">
        {label}
      </label>
      {children}
      {hint}
      <FieldErrors id={`${id}-error`} errors={errors} />
    </div>
  );
}

/** 8文字以上になったら緑の太字に変わるヒント（会員登録と同じ） */
export function PasswordLengthHint({ id, met }: { id: string; met: boolean }) {
  return (
    <p
      id={id}
      className={clsx(
        "flex items-center gap-1.5 text-[13px] transition-colors duration-[var(--duration-yuru-quick)]",
        met ? "font-bold text-ok" : "text-sub",
      )}
    >
      <svg
        aria-hidden="true"
        className="size-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <path d="M7.5 12.5 10.5 15.5 16.5 9" />
      </svg>
      パスワードは8文字以上で入力してください
    </p>
  );
}

/** 設定の下の画面の外枠（白いカード） */
export function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 rounded-[20px] border border-line bg-white px-5 py-6 sm:px-8 sm:py-8">
      {children}
    </div>
  );
}
