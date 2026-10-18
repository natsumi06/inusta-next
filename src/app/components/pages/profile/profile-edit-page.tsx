"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import ProfileEditForm from "./profile-form";

/**
 * /mypage/edit を直接開いたとき（リロード・URL を入力）の画面版
 * 中身はモーダルと同じフォーム
 */
export default function ProfileEditPage({
  user,
}: {
  user: { name: string; image: string | null; description: string | null };
}) {
  const router = useRouter();
  const dirtyRef = useRef(false);

  const handleDirtyChange = useCallback((dirty: boolean) => {
    dirtyRef.current = dirty;
  }, []);

  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-white pb-5 sm:pb-0">
      <ProfileEditForm
        user={user}
        onCancel={() => {
          if (
            dirtyRef.current &&
            !window.confirm("書きかけの内容は保存されません。もどりますか？")
          ) {
            return;
          }
          router.push("/mypage");
        }}
        onSaved={() => router.push("/mypage")}
        onDirtyChange={handleDirtyChange}
      />
    </div>
  );
}
