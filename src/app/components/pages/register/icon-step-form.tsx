"use client";

import Image from "next/image";
import { ChangeEvent, useActionState, useRef, useState } from "react";
import clsx from "clsx";
import Loader from "@/app/components/loaders/loader";
import { saveIcon } from "./../../../../../lib/actions";
import { StepError, StepFooter, StepTitle } from "./step-parts";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * 2問目: アイコン（スキップできる。選ばなければ白黒わんこのアイコン）
 */
export default function IconStepForm({
  currentImage,
}: {
  currentImage: string | null;
}) {
  const [state, action, isPending] = useActionState(saveIcon, {
    message: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage);
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

  return (
    <form
      action={action}
      className={clsx("relative flex flex-1 flex-col gap-6 sm:gap-7", {
        "opacity-20": isPending,
      })}
    >
      <StepTitle
        title="アイコンを設定しよう"
        lead="愛犬の写真がおすすめです。"
      />
      <div className="flex flex-col items-center gap-3.5">
        <div className="relative size-[152px]">
          <span className="flex size-full items-center justify-center overflow-hidden rounded-full border-2 border-ink bg-soft">
            {preview ? (
              <Image
                src={preview}
                alt="選んだアイコン"
                width={152}
                height={152}
                unoptimized
                className="size-full object-cover"
              />
            ) : (
              <Image
                src="/illustrations/dog-sit.png"
                alt="デフォルトのアイコン"
                width={165}
                height={155}
                className="mt-2 h-auto w-[104px] mix-blend-multiply"
              />
            )}
          </span>
          <span
            aria-hidden="true"
            className="absolute bottom-1 right-1 flex size-10 items-center justify-center rounded-full border-[3px] border-white bg-ink text-white"
          >
            <svg
              className="size-[18px]"
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
          id="register-image"
          name="image"
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={handleImageChange}
          className="sr-only"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="h-11 rounded-full border-2 border-ink bg-white px-[22px] text-[15px] font-bold transition hover:bg-soft"
        >
          写真を選ぶ
        </button>
        <p className="text-xs text-sub">
          スキップすると、このわんこのアイコンになります
        </p>
        <StepError message={fileError ?? state.message} />
      </div>
      <StepFooter
        backHref="/register/name"
        skipHref="/register/bio"
        disabled={isPending}
      />
      {isPending && <Loader />}
    </form>
  );
}
