"use client";

import Loader from "@/app/components/loaders/loader";
import { setupProfile } from "./../../../../../lib/actions";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useActionState, useRef, useState } from "react";
import clsx from "clsx";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const inputClassName =
  "w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink focus:border-ink focus:outline-none";

export default function ProfileSetupForm({
  defaultName,
}: {
  defaultName: string;
}) {
  const [state, action, isPending] = useActionState(setupProfile, {
    message: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

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

  const error = fileError ?? state.message;

  return (
    <form
      action={action}
      className={clsx("relative mt-7", { "opacity-20": isPending })}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
        <div className="flex shrink-0 flex-col items-center gap-3 sm:w-[200px]">
          <div className="relative size-[120px] sm:size-40">
            <span className="flex size-full items-center justify-center overflow-hidden rounded-full border-2 border-ink bg-soft">
              {preview ? (
                <Image
                  src={preview}
                  alt="選んだアイコン"
                  width={160}
                  height={160}
                  unoptimized
                  className="size-full object-cover"
                />
              ) : (
                <Image
                  src="/illustrations/dog-sit.png"
                  alt="デフォルトのアイコン"
                  width={165}
                  height={155}
                  className="mt-2 h-auto w-[70%] mix-blend-multiply"
                />
              )}
            </span>
            <span
              aria-hidden="true"
              className="absolute bottom-0.5 right-0.5 flex size-[34px] items-center justify-center rounded-full border-[3px] border-white bg-ink text-white sm:bottom-1 sm:right-1 sm:size-10"
            >
              <svg
                className="size-4 sm:size-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
                <circle cx="12" cy="13" r="3.5" />
              </svg>
            </span>
          </div>
          <input
            ref={fileInputRef}
            id="profile-image"
            name="image"
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            onChange={handleImageChange}
            className="sr-only"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-10 rounded-full border-2 border-ink bg-white px-5 text-sm font-bold transition hover:bg-soft"
          >
            愛犬の写真を選ぶ
          </button>
          <p className="text-center text-xs leading-relaxed text-sub">
            選ばない場合は、このわんこの
            <br className="hidden sm:inline" />
            アイコンになります
          </p>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[18px]">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="profile-name" className="text-[13px] font-bold">
              表示名
            </label>
            <input
              id="profile-name"
              name="name"
              required
              defaultValue={defaultName}
              className={clsx(inputClassName, "h-[46px]")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="profile-description"
              className="text-[13px] font-bold"
            >
              ひとこと自己紹介{" "}
              <span className="font-normal text-sub">（任意）</span>
            </label>
            <textarea
              id="profile-description"
              name="description"
              rows={5}
              maxLength={500}
              placeholder="例）柴犬のこむぎと暮らしています。おさんぽ写真をのせます。"
              className={clsx(
                inputClassName,
                "resize-none py-3 leading-relaxed placeholder:text-sub"
              )}
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>
      <div className="mt-8 flex flex-col-reverse items-center gap-4 border-t border-line pt-6 sm:flex-row sm:justify-end sm:gap-6">
        <Link
          href="/register/complete"
          className="text-sm font-medium text-sub underline underline-offset-[3px] hover:text-ink"
        >
          あとで設定する
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-ink px-8 text-[15px] font-bold text-white shadow-cheek transition hover:translate-y-px hover:shadow-none disabled:opacity-60 sm:w-auto"
        >
          保存してつぎへ
        </button>
      </div>
      {isPending && <Loader />}
    </form>
  );
}
