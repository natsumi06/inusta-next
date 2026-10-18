"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PostForm from "./post-form";
import DiscardConfirm from "./discard-confirm";

/**
 * /posts/new を直接開いたとき（リロード・URL を入力）の画面版
 * 中身はモーダルと同じフォーム
 */
export default function PostNewPage() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const dirtyRef = useRef(false);

  const handleDirtyChange = useCallback((dirty: boolean) => {
    dirtyRef.current = dirty;
  }, []);

  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-white pb-5 sm:pb-0">
      <PostForm
        onCancel={() => {
          if (dirtyRef.current) setConfirming(true);
          else router.push("/home");
        }}
        onDone={(postId) => router.replace(`/posts/${postId}`)}
        onDirtyChange={handleDirtyChange}
      />
      <DiscardConfirm
        open={confirming}
        title="投稿をやめますか？"
        description="選んだ写真と書いたひとことは消えます"
        onKeep={() => setConfirming(false)}
        onDiscard={() => router.push("/home")}
      />
    </div>
  );
}
