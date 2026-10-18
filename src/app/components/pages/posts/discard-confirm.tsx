"use client";

import { useEffect, useRef } from "react";

/**
 * 書きかけのまま閉じようとしたときの確認（ブラウザの確認ダイアログの代わり）
 * 主ボタンは「書きつづける」。うっかり押しても書いた内容が消えないようにする
 */
export default function DiscardConfirm({
  open,
  title,
  description,
  onKeep,
  onDiscard,
}: {
  open: boolean;
  title: string;
  description: string;
  onKeep: () => void;
  onDiscard: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      role="alertdialog"
      aria-labelledby="discard-confirm-title"
      aria-describedby="discard-confirm-description"
      onCancel={(event) => {
        // 外側のモーダルにも届くと、もう一度この確認を開こうとするので止める
        event.preventDefault();
        event.stopPropagation();
        onKeep();
      }}
      onClick={(event) => {
        event.stopPropagation();
        if (event.target === dialogRef.current) onKeep();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-[360px] rounded-3xl border-2 border-ink bg-white px-6 pb-6 pt-7 text-center text-ink shadow-[0_5px_0_var(--color-cheek)] animate-yuru-drop-in backdrop:bg-ink/30 backdrop:animate-yuru-fade-in"
    >
      <h2
        id="discard-confirm-title"
        className="font-heading text-xl font-medium"
      >
        {title}
      </h2>
      <p
        id="discard-confirm-description"
        className="mt-2 text-sm leading-relaxed text-sub"
      >
        {description}
      </p>
      <div className="mt-5 flex flex-col gap-2.5">
        <button
          type="button"
          autoFocus
          onClick={onKeep}
          className="h-12 rounded-full bg-ink text-[15px] font-bold text-white shadow-cheek transition hover:translate-y-px hover:shadow-none"
        >
          書きつづける
        </button>
        <button
          type="button"
          onClick={onDiscard}
          className="h-12 rounded-full border-2 border-[#e0dfd8] bg-white text-[15px] font-bold text-sub transition hover:border-sub hover:text-ink"
        >
          やめる
        </button>
      </div>
    </dialog>
  );
}
