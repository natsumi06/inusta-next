"use client";

import Image from "next/image";
import { ChangeEvent, useActionState, useRef, useState } from "react";
import ProfileAvatar from "./profile-avatar";
import ProfileModal, { ProfileModalActions } from "./profile-modal";
import { CameraIcon } from "@/app/components/layouts/navigation-icons";
import {
  updateIcon,
  type ProfileModalState,
} from "./../../../../../lib/actions";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/** マイページのアイコン。押すとアイコンだけを変えるモーダルが開く */
export default function IconEditModal({
  image,
  name,
}: {
  image: string | null;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, action, isPending] = useActionState(
    async (prev: ProfileModalState, formData: FormData) => {
      const result = await updateIcon(prev, formData);
      if (result.ok) setOpen(false);
      return result;
    },
    { message: null },
  );

  const openModal = () => {
    setPreview(null);
    setFileError(null);
    setOpen(true);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError("対応する形式：JPEG, PNG, WebP, GIF");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("画像は5MB以下にしてください");
      e.target.value = "";
      return;
    }
    setPreview(URL.createObjectURL(file));
  };

  const shown = preview ?? image;
  const message = fileError ?? (state.ok ? null : state.message);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        aria-label={image ? "アイコンを変更する" : "アイコンを設定する"}
        className="row-span-1 shrink-0 rounded-full transition hover:opacity-90 sm:row-span-2"
      >
        <ProfileAvatar image={image} name={name} editable />
      </button>
      <ProfileModal
        open={open}
        onClose={() => setOpen(false)}
        title={image ? "アイコンを変更" : "アイコンを設定"}
      >
        <form action={action}>
          <div className="flex flex-col items-center gap-3.5 px-5 pt-4 sm:px-7 sm:pt-6">
            <span className="flex size-36 items-center justify-center overflow-hidden rounded-full border-2 border-ink bg-soft sm:size-40">
              {shown ? (
                <Image
                  src={shown}
                  alt={preview ? "選んだ写真" : "いまのアイコン"}
                  width={160}
                  height={160}
                  unoptimized={!!preview}
                  className="size-full object-cover"
                />
              ) : (
                <Image
                  src="/illustrations/dog-sit.png"
                  alt="いまのアイコン（白黒わんこ）"
                  width={165}
                  height={155}
                  className="mt-[8%] h-auto w-[66%] mix-blend-multiply"
                />
              )}
            </span>
            <input
              ref={fileInputRef}
              name="image"
              type="file"
              accept={ALLOWED_TYPES.join(",")}
              onChange={handleImageChange}
              className="sr-only"
              tabIndex={-1}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-ink bg-white px-[22px] text-[15px] font-bold transition hover:bg-soft"
            >
              <CameraIcon className="size-[18px]" />
              写真を選ぶ
            </button>
            <p className="text-xs text-sub">JPEG・PNG・WebP・GIF、5MBまで</p>
            {message && (
              <p role="alert" className="text-sm text-red-600">
                {message}
              </p>
            )}
          </div>
          <ProfileModalActions
            onCancel={() => setOpen(false)}
            pending={isPending}
            disabled={!preview}
          />
        </form>
      </ProfileModal>
    </>
  );
}
