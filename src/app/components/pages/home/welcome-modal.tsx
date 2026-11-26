"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

/**
 * 会員登録後、はじめてホームに来たときだけ出る歓迎モーダル
 * - 準備完了画面の「Start！」が /home?welcome=1 へ遷移したときだけ開く
 * - 開いたらすぐ URL を /home に置き換えるので、戻る・リロードでは二度と出ない
 * 上からゆっくり降りてきて、閉じるとゆっくり上へ戻る（docs/design.md「動き」参照）
 */
export default function WelcomeModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("welcome") !== "1") return;
    setIsOpen(true);
    // 履歴の今のエントリを /home に置き換える（ページの再取得はしない）
    window.history.replaceState(null, "", "/home");
  }, []);

  useEffect(() => {
    if (isOpen) dialogRef.current?.showModal();
  }, [isOpen]);

  const close = () => setIsClosing(true);

  // 対象外のときは何も描画しない（イラスト画像も読み込まない）
  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="welcome-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
      onAnimationEnd={() => {
        if (isClosing) dialogRef.current?.close();
      }}
      className={clsx(
        "m-auto w-[calc(100%-2rem)] max-w-[520px] rounded-3xl border-2 border-ink bg-white px-6 pb-8 pt-10 text-center text-ink shadow-[0_5px_0_var(--color-cheek)] backdrop:bg-ink/45 sm:px-10",
        isClosing
          ? "animate-yuru-lift-out backdrop:animate-yuru-fade-out"
          : "animate-yuru-drop-in backdrop:animate-yuru-fade-in"
      )}
    >
      <button
        type="button"
        onClick={close}
        aria-label="閉じる"
        className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-full text-sub transition-colors hover:bg-soft hover:text-ink"
      >
        <svg
          aria-hidden="true"
          className="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <path d="M6 6l12 12" />
          <path d="M18 6 6 18" />
        </svg>
      </button>
      <Image
        src="/illustrations/welcome-house.png"
        alt=""
        aria-hidden="true"
        width={640}
        height={534}
        priority
        className="mx-auto h-auto w-52 sm:w-60"
      />
      <h2
        id="welcome-title"
        className="mt-4 font-heading text-2xl font-medium sm:text-[28px]"
      >
        ここがホームです
      </h2>
      <p className="mt-3 text-[15px] leading-[1.8]">
        わんともたちの愛犬写真が、新しい順に並びます。
        <br className="hidden sm:inline" />
        かわいい子を見つけたら、コメントしてみよう。
      </p>
      <button
        type="button"
        onClick={close}
        autoFocus
        className="mt-7 inline-flex h-12 items-center rounded-full bg-ink px-7 text-[15px] font-bold text-white shadow-cheek transition hover:translate-y-px hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        みんなの投稿を見る
      </button>
    </dialog>
  );
}
