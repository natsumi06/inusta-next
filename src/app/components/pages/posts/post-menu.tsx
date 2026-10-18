"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  MoreIcon,
  PencilIcon,
  TrashIcon,
} from "@/app/components/layouts/navigation-icons";
import DeletePostDialog from "./delete-post-dialog";

const itemClassName =
  "flex h-12 w-full items-center gap-2.5 rounded-[10px] px-3 text-left text-[15px] font-bold transition-colors hover:bg-soft focus-visible:bg-soft focus-visible:outline-none";

/**
 * 自分の投稿の「…」ボタン
 * 押すとボタンの下に「編集する」「削除する」「キャンセル」が出る
 */
export default function PostMenu({
  postId,
  postImage,
}: {
  postId: string;
  postImage: string;
}) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    firstItemRef.current?.focus();
    // メニューの外を押すか Esc で閉じる
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label="投稿のメニュー"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="post-menu"
        onClick={() => setOpen((value) => !value)}
        className="flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-soft aria-expanded:bg-soft"
      >
        <MoreIcon className="size-[22px]" />
      </button>
      {open && (
        <div
          id="post-menu"
          role="menu"
          aria-label="投稿のメニュー"
          className="absolute right-0 top-full z-20 mt-1.5 flex w-[200px] flex-col rounded-2xl border-2 border-ink bg-white p-1.5 text-ink shadow-[0_4px_0_var(--color-cheek)] animate-yuru-fade-in"
        >
          <Link
            ref={firstItemRef}
            role="menuitem"
            href={`/posts/${postId}/edit`}
            onClick={() => setOpen(false)}
            className={itemClassName}
          >
            <PencilIcon className="size-5" />
            編集する
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              setDeleting(true);
            }}
            className={itemClassName}
          >
            <TrashIcon className="size-5" />
            削除する
          </button>
          <span aria-hidden="true" className="mx-1.5 my-1 h-px bg-line" />
          <button
            type="button"
            role="menuitem"
            onClick={closeMenu}
            className={`${itemClassName} text-sub`}
          >
            キャンセル
          </button>
        </div>
      )}
      <DeletePostDialog
        open={deleting}
        postId={postId}
        postImage={postImage}
        onClose={() => setDeleting(false)}
      />
    </div>
  );
}
