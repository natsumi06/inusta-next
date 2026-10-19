"use client";

import Loader from "@/app/components/loaders/loader";
import { authenticate } from "./../../../../../lib/actions";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";

const inputClassName =
  "h-[52px] w-full rounded-xl border-[1.5px] border-ink bg-white px-4 text-[16px] text-ink shadow-[0_2px_0_var(--color-line)] focus:outline-2 focus:outline-offset-2 focus:outline-ink sm:h-[50px]";

/**
 * ログイン（新規登録と同じ見た目）
 * スマホは画面いっぱい、PC はロゴの下の白いカード（RegisterCard）
 */
export default function LoginForm() {
  const [error, action, isPending] = useActionState(authenticate, undefined);
  return (
    <form
      action={action}
      className={clsx("relative flex flex-1 flex-col gap-5 sm:gap-7", {
        "opacity-20": isPending,
      })}
    >
      <div className="mt-2 flex items-end justify-between gap-4 sm:mt-0 sm:flex-col sm:items-center sm:justify-start sm:gap-3">
        <h1 className="mb-1.5 font-heading text-[28px] font-medium sm:mb-0 sm:text-[30px]">
          ログイン
        </h1>
        <Image
          src="/illustrations/login-pup.png"
          alt=""
          aria-hidden="true"
          width={480}
          height={426}
          className="h-auto w-[96px] sm:w-[104px]"
        />
      </div>
      <div className="flex flex-col gap-[18px] rounded-[20px] border border-line bg-white px-5 py-6 sm:gap-5 sm:border-0 sm:p-0">
        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 text-sm font-bold leading-relaxed text-red-600"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              className="mt-0.5 size-[18px] shrink-0"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7.5v5.5" />
              <path d="M12 16.5v.01" />
            </svg>
            {error}
          </p>
        )}
        <div className="flex flex-col gap-2">
          <label htmlFor="login-email" className="text-sm font-bold">
            メールアドレス
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClassName}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="login-password" className="text-sm font-bold">
            パスワード
          </label>
          <input
            id="login-password"
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className={inputClassName}
          />
        </div>
      </div>
      <div className="mt-auto flex flex-col items-center gap-4 sm:mt-0">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-[52px] w-full items-center justify-center rounded-full bg-ink px-8 text-[16px] font-bold text-white shadow-cheek transition hover:translate-y-px hover:shadow-none disabled:opacity-60 sm:w-auto sm:min-w-[220px]"
        >
          ログイン
        </button>
        <p className="text-sm text-sub">
          はじめての方は{" "}
          <Link
            href="/register"
            className="font-bold text-ink underline underline-offset-[3px]"
          >
            新規登録
          </Link>
        </p>
      </div>
      {isPending && <Loader />}
    </form>
  );
}
