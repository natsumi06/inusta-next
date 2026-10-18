"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileModal from "./profile-modal";
import ProfileEditForm from "./profile-form";

const DISCARD_MESSAGE = "書きかけの内容は保存されません。閉じますか？";

/**
 * マイページの「プロフィールを編集」から開くモーダル（URL は /mypage/edit）
 * PC は中央のモーダル、スマホは全画面。閉じると前の画面（マイページ）にもどる
 */
export default function ProfileEditModal({
  user,
}: {
  user: { name: string; image: string | null; description: string | null };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const dirtyRef = useRef(false);
  const savedRef = useRef(false);

  const close = () => {
    if (
      dirtyRef.current &&
      !savedRef.current &&
      !window.confirm(DISCARD_MESSAGE)
    ) {
      return;
    }
    setOpen(false);
  };

  const handleDirtyChange = useCallback((dirty: boolean) => {
    dirtyRef.current = dirty;
  }, []);

  return (
    <ProfileModal
      open={open}
      onClose={close}
      onClosed={() => {
        router.back();
        if (savedRef.current) router.refresh();
      }}
      title="プロフィールを編集"
      size="large"
    >
      <ProfileEditForm
        user={user}
        onCancel={close}
        onSaved={() => {
          savedRef.current = true;
          setOpen(false);
        }}
        onDirtyChange={handleDirtyChange}
        sticky
      />
    </ProfileModal>
  );
}
