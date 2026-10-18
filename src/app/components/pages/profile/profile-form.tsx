"use client";

import Image from "next/image";
import {
  ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { ProfileModalActions } from "./profile-modal";
import { CameraIcon } from "@/app/components/layouts/navigation-icons";
import {
  updateProfile,
  type ProfileEditState,
} from "./../../../../../lib/actions";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const NAME_MAX_LENGTH = 30;
const BIO_MAX_LENGTH = 500;

const inputClassName =
  "w-full rounded-xl border-[1.5px] border-ink bg-white px-4 text-[16px] text-ink shadow-[0_2px_0_var(--color-line)] placeholder:text-[#8a8a84] focus:outline-2 focus:outline-offset-2 focus:outline-ink";

function FieldErrors({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <div id={id} className="flex flex-col gap-0.5">
      {errors.map((error) => (
        <p key={error} className="text-sm text-red-600">
          {error}
        </p>
      ))}
    </div>
  );
}

/**
 * プロフィール編集のフォーム（アイコン・表示名・自己紹介）
 * PC のモーダル、スマホの全画面シート、直接開いたときの画面で共通に使う
 */
export default function ProfileEditForm({
  user,
  onCancel,
  onSaved,
  onDirtyChange,
  sticky = false,
}: {
  user: { name: string; image: string | null; description: string | null };
  onCancel: () => void;
  onSaved: () => void;
  /** 書きかけかどうか（閉じるときの確認に使う） */
  onDirtyChange?: (dirty: boolean) => void;
  /** 保存ボタンを下に固定する */
  sticky?: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.description ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, action, isPending] = useActionState(
    async (prev: ProfileEditState, formData: FormData) => {
      const result = await updateProfile(prev, formData);
      if (result.ok) onSaved();
      return result;
    },
    {},
  );

  const dirty =
    !!preview || name !== user.name || bio !== (user.description ?? "");
  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

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

  const shown = preview ?? user.image;
  const imageErrors = fileError ? [fileError] : state.errors?.image;
  const nameEmpty = name.trim().length === 0;

  return (
    <form action={action} className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-6 px-5 pb-2 pt-5 sm:px-7 sm:pt-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <span className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-ink bg-soft">
            {shown ? (
              <Image
                src={shown}
                alt={preview ? "選んだ写真" : "いまのアイコン"}
                width={96}
                height={96}
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
          <div className="flex flex-col items-start gap-1.5">
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
              className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-ink bg-white px-5 text-[15px] font-bold transition hover:bg-soft"
            >
              <CameraIcon className="size-[18px]" />
              {shown ? "写真を変える" : "写真を選ぶ"}
            </button>
            <p className="text-xs text-sub">JPEG・PNG・WebP・GIF、5MBまで</p>
          </div>
        </div>
        <FieldErrors id="profile-image-error" errors={imageErrors} />

        <div className="flex flex-col gap-2">
          <label htmlFor="profile-name" className="text-sm font-bold">
            表示名
            <span aria-hidden="true" className="ml-1 text-sub">
              *
            </span>
            <span className="sr-only">（必須）</span>
          </label>
          <input
            id="profile-name"
            name="name"
            type="text"
            required
            maxLength={NAME_MAX_LENGTH}
            autoComplete="nickname"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!state.errors?.name}
            aria-describedby="profile-name-error"
            className={clsx(inputClassName, "h-[52px] sm:h-[50px]")}
          />
          <FieldErrors id="profile-name-error" errors={state.errors?.name} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="profile-bio" className="text-sm font-bold">
            自己紹介
          </label>
          <textarea
            id="profile-bio"
            name="description"
            rows={5}
            maxLength={BIO_MAX_LENGTH}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="例：柴犬のこむぎと暮らしています。おさんぽ写真をのせます。"
            aria-invalid={!!state.errors?.description}
            aria-describedby="profile-bio-count profile-bio-error"
            className={clsx(inputClassName, "resize-none py-3 leading-relaxed")}
          />
          <p id="profile-bio-count" className="self-end text-xs text-sub">
            {bio.length} / {BIO_MAX_LENGTH}
          </p>
          <FieldErrors
            id="profile-bio-error"
            errors={state.errors?.description}
          />
        </div>
      </div>
      <ProfileModalActions
        onCancel={onCancel}
        pending={isPending}
        disabled={nameEmpty}
        sticky={sticky}
      />
    </form>
  );
}
