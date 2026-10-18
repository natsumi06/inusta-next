"use client";

import Loader from "@/app/components/loaders/loader";
import { registerUser } from "./../../../../../lib/actions";
import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import clsx from "clsx";

const inputClassName =
  "h-[46px] w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink focus:border-ink focus:outline-none";

function FieldErrors({ errors }: { errors?: string[] }) {
  if (!errors) return null;
  return errors.map((error) => (
    <p className="text-sm text-red-600" key={error}>
      {error}
    </p>
  ));
}

export default function RegisterForm() {
  const initialState = {
    errors: {},
    message: null,
  };
  const [state, action, isPending] = useActionState(registerUser, initialState);
  return (
    <form
      action={action}
      className={clsx("relative", { "opacity-20": isPending })}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
        <div className="flex shrink-0 flex-col gap-3 sm:w-[220px] sm:gap-4">
          <h1 className="font-heading text-[26px] font-medium sm:text-[30px]">
            新規登録
          </h1>
          <p className="text-sm leading-[1.8] text-sub sm:text-[15px]">
            みんなの愛犬写真を見たり、シェアしたりできます。
          </p>
          <Image
            src="/illustrations/dog-sit.png"
            alt=""
            aria-hidden="true"
            width={165}
            height={155}
            className="mt-2 hidden h-auto w-[120px] sm:block"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-name" className="text-[13px] font-bold">
              ユーザー名
            </label>
            <input
              id="register-name"
              name="name"
              required
              autoComplete="nickname"
              className={inputClassName}
            />
            <FieldErrors errors={state.errors?.name} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-email" className="text-[13px] font-bold">
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
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="register-password"
                className="text-[13px] font-bold"
              >
                パスワード
              </label>
              <input
                id="register-password"
                type="password"
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
                className={inputClassName}
              />
              <FieldErrors errors={state.errors?.password} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="register-password-confirmation"
                className="text-[13px] font-bold"
              >
                パスワード（確認用）
              </label>
              <input
                id="register-password-confirmation"
                type="password"
                name="passwordConfirmation"
                required
                minLength={8}
                autoComplete="new-password"
                className={inputClassName}
              />
              <FieldErrors errors={state.errors?.passwordConfirmation} />
            </div>
          </div>
          <p className="text-xs text-sub">
            パスワードは8文字以上で入力してください
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-col-reverse items-center gap-4 border-t border-line pt-6 sm:flex-row sm:justify-between">
        <p className="text-sm text-sub">
          アカウントをお持ちの方は{" "}
          <Link
            href="/login"
            className="font-bold text-ink underline underline-offset-[3px]"
          >
            ログイン
          </Link>
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-ink px-8 text-[15px] font-bold text-white shadow-cheek transition hover:translate-y-px hover:shadow-none disabled:opacity-60 sm:w-auto"
        >
          登録してつぎへ
        </button>
      </div>
      {isPending && <Loader />}
    </form>
  );
}
