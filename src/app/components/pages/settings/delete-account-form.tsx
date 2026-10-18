"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { deleteAccount } from "./../../../../../lib/account-actions";
import { Field, inputClassName, SettingsCard } from "./form-parts";

/**
 * 退会
 * 消えるものを先に見せ、パスワードを入れてもらってから消す（取り消せないため）
 */
export default function DeleteAccountForm({
  postCount,
  commentCount,
}: {
  postCount: number;
  commentCount: number;
}) {
  const [state, action, isPending] = useActionState(deleteAccount, {});

  return (
    <form action={action}>
      <SettingsCard>
        <div className="flex items-center gap-4">
          <Image
            src="/illustrations/dog-sit.png"
            alt=""
            aria-hidden="true"
            width={165}
            height={155}
            className="h-auto w-16 shrink-0 mix-blend-multiply"
          />
          <p className="font-heading text-lg font-medium leading-relaxed sm:text-xl">
            退会すると、もとに戻せません
          </p>
        </div>
        <div className="rounded-xl bg-soft px-4 py-3.5">
          <p className="text-sm font-bold">消えるもの</p>
          <ul className="mt-1.5 flex list-disc flex-col gap-1 pl-5 text-sm leading-relaxed">
            <li>
              あなたの投稿 <strong>{postCount}</strong>{" "}
              件と、そこについたコメント
            </li>
            <li>
              あなたがほかの投稿に書いたコメント <strong>{commentCount}</strong>{" "}
              件
            </li>
            <li>アイコン・表示名・自己紹介、メールアドレス</li>
          </ul>
        </div>
        <Field
          id="settings-delete-password"
          label="パスワード"
          errors={state.errors?.currentPassword}
          hint={
            <p className="text-[13px] text-sub">
              本人確認のために入力してください
            </p>
          }
        >
          <input
            id="settings-delete-password"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            aria-invalid={!!state.errors?.currentPassword}
            aria-describedby="settings-delete-password-error"
            className={inputClassName}
          />
        </Field>
        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
          <Link
            href="/mypage/settings"
            className="inline-flex h-12 items-center justify-center rounded-full border-2 border-[#e0dfd8] bg-white px-6 text-[15px] font-bold text-sub transition hover:border-sub hover:text-ink"
          >
            やめる
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-8 text-[15px] font-bold text-white transition enabled:hover:bg-red-700 disabled:opacity-40"
          >
            {isPending ? "退会しています…" : "退会する"}
          </button>
        </div>
      </SettingsCard>
    </form>
  );
}
