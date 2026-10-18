"use client";

import Loader from "@/app/components/loaders/loader";
import { registerUser } from "./../../../../../lib/actions";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import clsx from "clsx";

const PASSWORD_MIN_LENGTH = 8;

const inputClassName =
  "h-[52px] w-full rounded-xl border-[1.5px] border-ink bg-white px-4 text-[16px] text-ink shadow-[0_2px_0_var(--color-line)] placeholder:text-sub focus:outline-2 focus:outline-offset-2 focus:outline-ink sm:h-[50px]";

function FieldErrors({ errors }: { errors?: string[] }) {
  if (!errors) return null;
  return errors.map((error) => (
    <p className="text-sm text-red-600" key={error}>
      {error}
    </p>
  ));
}

/**
 * 新規登録（メールアドレスとパスワードだけ）
 * 表示名などのプロフィールは、登録したあと1問ずつ聞く
 */
export default function RegisterForm() {
  const initialState = {
    errors: {},
    message: null,
  };
  const [state, action, isPending] = useActionState(registerUser, initialState);
  const [password, setPassword] = useState("");
  const isPasswordLongEnough = password.length >= PASSWORD_MIN_LENGTH;

  return (
    <form
      action={action}
      className={clsx("relative flex flex-1 flex-col gap-5 sm:gap-7", {
        "opacity-20": isPending,
      })}
    >
      <div className="mt-2 flex items-end justify-between gap-4 sm:mt-0 sm:flex-col sm:items-center sm:justify-start sm:gap-3">
        <h1 className="mb-1.5 font-heading text-[28px] font-medium sm:mb-0 sm:text-[30px]">
          新規登録
        </h1>
        <Image
          src="/illustrations/dog-sit.png"
          alt=""
          aria-hidden="true"
          width={165}
          height={155}
          className="h-auto w-[84px] mix-blend-multiply sm:w-[92px]"
        />
      </div>
      <div className="flex flex-col gap-[18px] rounded-[20px] border border-line bg-white px-5 py-6 sm:gap-5 sm:border-0 sm:p-0">
        <div className="flex flex-col gap-2">
          <label htmlFor="register-email" className="text-sm font-bold">
            メールアドレス
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClassName}
          />
          <FieldErrors errors={state.errors?.email} />
        </div>
        <div className="grid gap-[18px] sm:grid-cols-2 sm:gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="register-password" className="text-sm font-bold">
              パスワード
            </label>
            <input
              id="register-password"
              type="password"
              name="password"
              required
              minLength={PASSWORD_MIN_LENGTH}
              autoComplete="new-password"
              placeholder="8文字以上"
              aria-describedby="register-password-hint"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClassName}
            />
            <FieldErrors errors={state.errors?.password} />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="register-password-confirmation"
              className="text-sm font-bold"
            >
              パスワード（確認用）
            </label>
            <input
              id="register-password-confirmation"
              type="password"
              name="passwordConfirmation"
              required
              minLength={PASSWORD_MIN_LENGTH}
              autoComplete="new-password"
              placeholder="もう一度入力"
              className={inputClassName}
            />
            <FieldErrors errors={state.errors?.passwordConfirmation} />
          </div>
        </div>
        {/* 8文字以上になったら緑の太字に変わる */}
        <p
          id="register-password-hint"
          className={clsx(
            "flex items-center gap-1.5 text-[13px] transition-colors duration-[var(--duration-yuru-quick)]",
            isPasswordLongEnough ? "font-bold text-ok" : "text-sub"
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
      </div>
      <div className="mt-auto flex flex-col items-center gap-4 sm:mt-0">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-[52px] w-full items-center justify-center rounded-full bg-ink px-8 text-[16px] font-bold text-white shadow-cheek transition hover:translate-y-px hover:shadow-none disabled:opacity-60 sm:w-auto sm:min-w-[220px]"
        >
          登録する
        </button>
        <p className="text-sm text-sub">
          アカウントをお持ちの方は{" "}
          <Link
            href="/login"
            className="font-bold text-ink underline underline-offset-[3px]"
          >
            ログイン
          </Link>
        </p>
      </div>
      {isPending && <Loader />}
    </form>
  );
}
