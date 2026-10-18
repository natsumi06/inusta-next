"use client";

import { useCallback, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ProfileModal from "@/app/components/pages/profile/profile-modal";
import PostForm from "./post-form";
import DiscardConfirm from "./discard-confirm";

type EditablePost = { id: string; image: string; caption: string | null };

const DISCARD_TITLE = "編集をやめますか？";
const DISCARD_DESCRIPTION = "変えた写真とひとことは元にもどります";

/**
 * 投稿詳細の「…」›「編集する」から開く投稿の編集モーダル（URL は /posts/[id]/edit）
 * PC は中央のモーダル、スマホは全画面。閉じると前の画面（投稿詳細）にもどる
 */
export default function PostEditModal({ post }: { post: EditablePost }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const dirtyRef = useRef(false);
  const savedRef = useRef(false);

  const close = () => {
    if (dirtyRef.current && !savedRef.current) {
      setConfirming(true);
      return;
    }
    setOpen(false);
  };

  const handleDirtyChange = useCallback((dirty: boolean) => {
    dirtyRef.current = dirty;
  }, []);

  // 閉じて投稿詳細にもどったあとも、モーダルの枠はしばらく残るので、編集の URL 以外では出さない
  if (pathname !== `/posts/${post.id}/edit`) return null;

  return (
    <ProfileModal
      open={open}
      onClose={close}
      onClosed={() => {
        router.back();
        if (savedRef.current) router.refresh();
      }}
      title="投稿を編集"
      size="large"
    >
      <PostForm
        post={post}
        onCancel={close}
        onDone={() => {
          savedRef.current = true;
          setOpen(false);
        }}
        onDirtyChange={handleDirtyChange}
        sticky
      />
      <DiscardConfirm
        open={confirming}
        title={DISCARD_TITLE}
        description={DISCARD_DESCRIPTION}
        keepLabel="編集をつづける"
        onKeep={() => setConfirming(false)}
        onDiscard={() => {
          setConfirming(false);
          setOpen(false);
        }}
      />
    </ProfileModal>
  );
}

/**
 * /posts/[id]/edit を直接開いたとき（リロード・URL を入力）の画面版
 * 中身はモーダルと同じフォーム
 */
export function PostEditPage({ post }: { post: EditablePost }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const dirtyRef = useRef(false);
  const detailPath = `/posts/${post.id}`;

  const handleDirtyChange = useCallback((dirty: boolean) => {
    dirtyRef.current = dirty;
  }, []);

  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-white pb-5 sm:pb-0">
      <PostForm
        post={post}
        onCancel={() => {
          if (dirtyRef.current) setConfirming(true);
          else router.push(detailPath);
        }}
        onDone={() => router.replace(detailPath)}
        onDirtyChange={handleDirtyChange}
      />
      <DiscardConfirm
        open={confirming}
        title={DISCARD_TITLE}
        description={DISCARD_DESCRIPTION}
        keepLabel="編集をつづける"
        onKeep={() => setConfirming(false)}
        onDiscard={() => router.push(detailPath)}
      />
    </div>
  );
}
