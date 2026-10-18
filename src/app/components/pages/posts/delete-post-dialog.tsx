"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { deletePost } from "./../../../../../lib/actions";

/**
 * 投稿を削除する前の確認（「…」›「削除する」から開く）
 * 取り消せない操作なので、最後の一押しは危険ボタン。うっかり押さないよう「やめる」を先に置く
 */
export default function DeletePostDialog({
  open,
  postId,
  postImage,
  onClose,
}: {
  open: boolean;
  postId: string;
  postImage: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setError(null);
      dialog.showModal();
    } else if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      // 消せたらマイページへ移る（redirect）
      await deletePost(postId, new FormData());
    } catch (e) {
      console.error("Delete failed:", e);
      setError("削除できませんでした。もう一度お試しください。");
      setIsDeleting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      role="alertdialog"
      aria-labelledby="delete-post-title"
      aria-describedby="delete-post-description"
      onCancel={(event) => {
        event.preventDefault();
        if (!isDeleting) onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current && !isDeleting) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-[420px] rounded-3xl border-2 border-ink bg-white px-6 pb-6 pt-7 text-center text-ink shadow-[0_5px_0_var(--color-cheek)] animate-yuru-drop-in backdrop:bg-ink/45 backdrop:animate-yuru-fade-in sm:px-7 sm:pt-8"
    >
      <h2
        id="delete-post-title"
        className="font-heading text-xl font-medium sm:text-[22px]"
      >
        この投稿を削除しますか？
      </h2>
      <Image
        src={postImage}
        alt="削除する投稿の写真"
        width={256}
        height={256}
        className="mx-auto mt-3 size-[120px] rounded-xl object-cover sm:size-32"
      />
      <p
        id="delete-post-description"
        className="mt-3 text-sm leading-relaxed text-sub"
      >
        写真とひとこと、ついたコメントも消えます。
        <br />
        元にはもどせません。
      </p>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="mt-5 flex flex-col gap-2.5 sm:grid sm:grid-cols-2 sm:gap-3">
        <button
          type="button"
          autoFocus
          onClick={onClose}
          disabled={isDeleting}
          className="h-12 rounded-full border-2 border-[#e0dfd8] bg-white text-[15px] font-bold text-sub transition hover:border-sub hover:text-ink disabled:opacity-40"
        >
          やめる
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="h-12 rounded-full bg-red-600 text-[15px] font-bold text-white transition hover:bg-red-700 disabled:opacity-40"
        >
          {isDeleting ? "削除しています…" : "削除する"}
        </button>
      </div>
    </dialog>
  );
}
