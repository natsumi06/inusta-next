"use client";

import { useActionState, useState } from "react";
import { changePassword } from "./../../../../../lib/account-actions";
import {
  Field,
  inputClassName,
  PasswordLengthHint,
  primaryButtonClassName,
  SettingsCard,
} from "./form-parts";

const PASSWORD_MIN_LENGTH = 8;

/**
 * パスワードの変更
 * いまのパスワード → 新しいパスワード（確認用つき）
 */
export default function PasswordForm() {
  const [state, action, isPending] = useActionState(changePassword, {});
  const [password, setPassword] = useState("");

  return (
    <form action={action}>
      <SettingsCard>
        <Field
          id="settings-current-password"
          label="いまのパスワード"
          errors={state.errors?.currentPassword}
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
        <div className="h-px bg-line" aria-hidden="true" />
        <Field
          id="settings-new-password"
          label="新しいパスワード"
          errors={state.errors?.password}
          hint={
            <PasswordLengthHint
              id="settings-new-password-hint"
              met={password.length >= PASSWORD_MIN_LENGTH}
            />
          }
        >
          <input
            id="settings-new-password"
            name="password"
            type="password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            autoComplete="new-password"
            placeholder="8文字以上"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={!!state.errors?.password}
            aria-describedby="settings-new-password-hint settings-new-password-error"
            className={inputClassName}
          />
        </Field>
        <Field
          id="settings-new-password-confirmation"
          label="新しいパスワード（確認用）"
          errors={state.errors?.passwordConfirmation}
        >
          <input
            id="settings-new-password-confirmation"
            name="passwordConfirmation"
            type="password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            autoComplete="new-password"
            placeholder="もう一度入力"
            aria-invalid={!!state.errors?.passwordConfirmation}
            aria-describedby="settings-new-password-confirmation-error"
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
