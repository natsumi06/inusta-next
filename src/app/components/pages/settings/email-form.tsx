"use client";

import { useActionState } from "react";
import { changeEmail } from "./../../../../../lib/account-actions";
import {
  Field,
  inputClassName,
  primaryButtonClassName,
  SettingsCard,
} from "./form-parts";

/**
 * メールアドレスの変更
 * 本人確認のため、いまのパスワードも入れてもらう
 */
export default function EmailForm({ currentEmail }: { currentEmail: string }) {
  const [state, action, isPending] = useActionState(changeEmail, {});

  return (
    <form action={action}>
      <SettingsCard>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold">いまのメールアドレス</p>
          <p className="break-all text-[15px] text-sub">{currentEmail}</p>
        </div>
        <Field
          id="settings-email"
          label="新しいメールアドレス"
          errors={state.errors?.email}
        >
          <input
            id="settings-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={!!state.errors?.email}
            aria-describedby="settings-email-error"
            className={inputClassName}
          />
        </Field>
        <Field
          id="settings-current-password"
          label="いまのパスワード"
          errors={state.errors?.currentPassword}
          hint={
            <p className="text-[13px] text-sub">
              本人確認のために入力してください
            </p>
          }
        >
          <input
            id="settings-current-password"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            aria-invalid={!!state.errors?.currentPassword}
            aria-describedby="settings-current-password-error"
            className={inputClassName}
          />
        </Field>
        <div className="flex pt-1 sm:justify-end">
          <button
            type="submit"
            disabled={isPending}
            className={primaryButtonClassName}
          >
            {isPending ? "変更しています…" : "変更する"}
          </button>
        </div>
      </SettingsCard>
    </form>
  );
}
