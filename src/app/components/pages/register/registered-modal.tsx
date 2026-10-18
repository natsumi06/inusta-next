"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

/**
 * 新規登録の直後に、表示名の画面の上へ出る「登録が完了しました」モーダル
 * 閉じたら URL の印（?registered=1）を消し、リロードしても二度と出さない
 */
export default function RegisteredModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const close = () => setIsClosing(true);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="registered-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onAnimationEnd={() => {
        if (!isClosing) return;
        dialogRef.current?.close();
        router.replace("/register/name", { scroll: false });
      }}
      className={clsx(
        "m-auto w-[calc(100%-3rem)] max-w-[440px] rounded-3xl border-2 border-ink bg-white px-7 pb-[30px] pt-9 text-center text-ink shadow-[0_5px_0_var(--color-cheek)] backdrop:bg-ink/45",
        isClosing
          ? "animate-yuru-lift-out backdrop:animate-yuru-fade-out"
          : "animate-yuru-drop-in backdrop:animate-yuru-fade-in"
      )}
    >
      <div className="flex flex-col items-center">
      <span
        aria-hidden="true"
        className="flex size-14 items-center justify-center rounded-full bg-ink text-white shadow-cheek"
      >
        <svg
          className="size-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12.5 10 17 19 7" />
        </svg>
      </span>
      <h2
        id="registered-title"
        className="mt-[18px] font-heading text-[26px] font-medium"
      >
        登録が完了しました
      </h2>
      <p className="mt-2 text-[15px] leading-[1.8]">
        つぎは、プロフィールを設定しよう。
      </p>
      <button
        type="button"
        onClick={close}
        autoFocus
        className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-7 text-[15px] font-bold text-white shadow-cheek transition hover:translate-y-px hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        プロフィールを設定する
      </button>
      </div>
    </dialog>
  );
}
