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
  onClosed,
  title,
  size = "small",
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** 閉じる動きが終わったあとに呼ぶ（URL つきのモーダルで前の画面にもどるため） */
  onClosed?: () => void;
  title: string;
  /** small: 1項目だけの編集（スマホは下からのシート）／ large: 複数項目の編集（スマホは全画面） */
  size?: "small" | "large";
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
        // 暗幕（::backdrop）の動きの終わりも同じ dialog に届くので、本体の分だけで閉じる
        if (event.nativeEvent.pseudoElement) return;
        if (isClosing) {
          dialogRef.current?.close();
          setIsClosing(false);
          onClosed?.();
        }
      }}
      className={clsx(
        "mx-0 mb-0 w-full max-w-none bg-white text-ink backdrop:bg-ink/45",
        "sm:m-auto sm:w-[calc(100%-2rem)] sm:rounded-3xl sm:border-2 sm:border-ink sm:pb-0 sm:shadow-[0_5px_0_var(--color-cheek)]",
        size === "small"
          ? "mt-auto rounded-t-3xl border-t-2 border-ink pb-7 sm:max-w-[480px]"
          : "mt-0 h-dvh max-h-none open:flex open:flex-col sm:h-fit sm:max-h-[calc(100dvh-4rem)] sm:max-w-[560px]",
        isClosing
          ? "yuru-modal-closing animate-yuru-sheet-down backdrop:animate-yuru-fade-out sm:animate-yuru-lift-out"
          : "yuru-modal animate-yuru-sheet-up backdrop:animate-yuru-fade-in sm:animate-yuru-drop-in",
      )}
    >
      {size === "small" && (
        <span
          aria-hidden="true"
          className="mx-auto mt-2 block h-1 w-10 rounded-full bg-[#d6d5ce] sm:hidden"
        />
      )}
      <div
        className={clsx(
          "grid grid-cols-[44px_minmax(0,1fr)_44px] items-center px-2 sm:flex sm:justify-between sm:border-b sm:border-line sm:py-3 sm:pl-7 sm:pr-4",
          size === "small"
            ? "pb-2 pt-1"
            : "sticky top-0 z-10 border-b border-line bg-white py-1.5",
        )}
      >
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
  sticky = false,
  submitLabel = "保存する",
  pendingLabel = "保存しています…",
}: {
  onCancel: () => void;
  pending: boolean;
  disabled?: boolean;
  /** 主ボタンの文字（投稿作成では「投稿する」） */
  submitLabel?: string;
  pendingLabel?: string;
  /** 下に固定する（全画面のときに、スクロールしても保存ボタンが見えるように） */
  sticky?: boolean;
}) {
  return (
    <div
      className={clsx(
        "flex gap-3 px-5 pt-4 sm:justify-end sm:px-7 sm:pb-6",
        sticky &&
          "sticky bottom-0 border-t border-line bg-white pb-5 sm:border-line",
      )}
    >
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
        {pending ? pendingLabel : submitLabel}
      </button>
    </div>
  );
}
