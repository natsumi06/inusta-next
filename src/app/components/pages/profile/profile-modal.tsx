"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { CloseIcon } from "@/app/components/layouts/navigation-icons";

/**
 * マイページで使う小さな編集モーダル（アイコン・自己紹介）
 * - PC: 中央に浮かぶ。上から降りてくる（歓迎モーダルと同じ見た目）
 * - スマホ: 下からせり上がる。キーボードが出ても入力欄が隠れにくい
 * docs/design.md「モーダル」参照
 */
export default function ProfileModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setIsClosing(false);
      dialog.showModal();
    } else if (!open && dialog.open) {
      setIsClosing(true);
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      onAnimationEnd={(event) => {
        if (event.target !== dialogRef.current) return;
        if (isClosing) {
          dialogRef.current?.close();
          setIsClosing(false);
        }
      }}
      className={clsx(
        "mx-0 mb-0 mt-auto w-full max-w-none rounded-t-3xl border-t-2 border-ink bg-white pb-7 text-ink backdrop:bg-ink/45",
        "sm:m-auto sm:w-[calc(100%-2rem)] sm:max-w-[480px] sm:rounded-3xl sm:border-2 sm:pb-0 sm:shadow-[0_5px_0_var(--color-cheek)]",
        isClosing
          ? "yuru-modal-closing animate-yuru-sheet-down backdrop:animate-yuru-fade-out sm:animate-yuru-lift-out"
          : "yuru-modal animate-yuru-sheet-up backdrop:animate-yuru-fade-in sm:animate-yuru-drop-in"
      )}
    >
      <span
        aria-hidden="true"
        className="mx-auto mt-2 block h-1 w-10 rounded-full bg-[#d6d5ce] sm:hidden"
      />
      <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-center px-2 pb-2 pt-1 sm:flex sm:justify-between sm:border-b sm:border-line sm:py-3 sm:pl-7 sm:pr-4">
        <span className="sm:hidden" />
        <h2 className="text-center font-heading text-lg font-medium sm:text-left sm:text-xl">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="閉じる"
          className="flex size-11 items-center justify-center rounded-full text-sub transition-colors hover:bg-soft hover:text-ink"
        >
          <CloseIcon className="size-5" />
        </button>
      </div>
      {open || isClosing ? children : null}
    </dialog>
  );
}

/**
 * モーダルの下のボタン
 * スマホは幅いっぱいの「保存する」だけ（閉じるのは ✕ か外側）、PC は右下に「キャンセル」と「保存する」
 */
export function ProfileModalActions({
  onCancel,
  pending,
  disabled,
}: {
  onCancel: () => void;
  pending: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-3 px-5 pt-4 sm:justify-end sm:px-7 sm:pb-6">
      <button
        type="button"
        onClick={onCancel}
        className="hidden h-12 items-center rounded-full border-2 border-[#e0dfd8] bg-white px-6 text-[15px] font-bold text-sub transition hover:border-sub hover:text-ink sm:inline-flex"
      >
        キャンセル
      </button>
      <button
        type="submit"
        disabled={pending || disabled}
        className="h-[52px] w-full rounded-full bg-ink px-8 text-[16px] font-bold text-white shadow-cheek transition enabled:hover:translate-y-px enabled:hover:shadow-none disabled:opacity-40 sm:h-12 sm:w-auto sm:text-[15px]"
      >
        {pending ? "保存しています…" : "保存する"}
      </button>
    </div>
  );
}
