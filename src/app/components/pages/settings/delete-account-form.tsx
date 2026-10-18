"use client";

import Image from "next/image";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { deleteAccount } from "./../../../../../lib/account-actions";
import { SettingsCard } from "./form-parts";

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-8 text-[15px] font-bold text-white transition enabled:hover:bg-red-700 disabled:opacity-40"
    >
      {pending ? "退会しています…" : "退会する"}
    </button>
  );
}

/**
 * 退会の確認
 * 「退会しますか？」と、やめる／退会する だけ
 */
export default function DeleteAccountForm() {
  return (
    <form action={deleteAccount}>
      <SettingsCard>
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <Image
            src="/illustrations/dog-sit.png"
            alt=""
            aria-hidden="true"
            width={165}
            height={155}
            className="h-auto w-20 mix-blend-multiply"
          />
          <p className="font-heading text-xl font-medium sm:text-2xl">
            退会しますか？
          </p>
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/mypage/settings"
            className="inline-flex h-12 items-center justify-center rounded-full border-2 border-[#e0dfd8] bg-white px-8 text-[15px] font-bold text-sub transition hover:border-sub hover:text-ink"
          >
            やめる
          </Link>
          <DeleteButton />
        </div>
      </SettingsCard>
    </form>
  );
}
