"use client";

import { useCallback, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ProfileModal from "@/app/components/pages/profile/profile-modal";
import PostNewForm from "./post-new-form";
import DiscardConfirm from "./discard-confirm";

/**
 * ナビの「投稿する」などから開く投稿作成モーダル（URL は /posts/new）
 * PC は中央のモーダル、スマホは全画面。閉じると前の画面にもどる
 */
export default function PostNewModal() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const dirtyRef = useRef(false);

  const close = () => {
    if (dirtyRef.current) {
      setConfirming(true);
      return;
    }
    setOpen(false);
  };

  const handleDirtyChange = useCallback((dirty: boolean) => {
    dirtyRef.current = dirty;
  }, []);

  // 投稿できて詳細へ進んだあとも、モーダルの枠はしばらく残るので、/posts/new 以外では出さない
  if (pathname !== "/posts/new") return null;

  return (
    <ProfileModal
      open={open}
      onClose={close}
      onClosed={() => router.back()}
      title="写真を投稿"
      size="large"
    >
      <PostNewForm
        onCancel={close}
        onPosted={(postId) => router.replace(`/posts/${postId}`)}
        onDirtyChange={handleDirtyChange}
        sticky
      />
      <DiscardConfirm
        open={confirming}
        title="投稿をやめますか？"
        description="選んだ写真と書いたひとことは消えます"
        onKeep={() => setConfirming(false)}
        onDiscard={() => {
          setConfirming(false);
          setOpen(false);
        }}
      />
    </ProfileModal>
  );
}
