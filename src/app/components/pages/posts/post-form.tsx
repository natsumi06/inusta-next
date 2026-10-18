"use client";

import Image from "next/image";
import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { ProfileModalActions } from "@/app/components/pages/profile/profile-modal";
import { CameraIcon } from "@/app/components/layouts/navigation-icons";
import {
  createPost,
  updatePost,
  type PostCreateState,
  type PostUpdateState,
} from "./../../../../../lib/actions";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const CAPTION_MAX_LENGTH = 500;

function checkFile(file: File) {
  if (!ALLOWED_TYPES.includes(file.type))
    return "対応する形式：JPEG, PNG, WebP, GIF";
  if (file.size > MAX_FILE_SIZE) return "写真は5MB以下にしてください。";
  return null;
}

type PostFormState = PostCreateState & PostUpdateState;

/**
 * 投稿の作成・編集のフォーム（写真・ひとこと）
 * PC のモーダル、スマホの全画面、直接開いたときの画面で共通に使う。
 * post を渡すと編集になり、いまの写真とひとことが入った状態で始まる
 */
export default function PostForm({
  post,
  onCancel,
  onDone,
  onDirtyChange,
  sticky = false,
}: {
  /** 編集する投稿。なければ新しく投稿する */
  post?: { id: string; image: string; caption: string | null };
  onCancel: () => void;
  /** 投稿・保存できたとき。投稿の id を渡す */
  onDone: (postId: string) => void;
  /** 書きかけかどうか（閉じるときの確認に使う） */
  onDirtyChange?: (dirty: boolean) => void;
  /** 投稿ボタンを下に固定する */
  sticky?: boolean;
}) {
  const initialCaption = post?.caption ?? "";
  const [preview, setPreview] = useState<string | null>(post?.image ?? null);
  /** 写真を選び直したか（編集で、いまの写真のままなら送らない） */
  const [photoPicked, setPhotoPicked] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [caption, setCaption] = useState(initialCaption);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, action, isPending] = useActionState(
    async (prev: PostFormState, formData: FormData): Promise<PostFormState> => {
      if (post) {
        const result = await updatePost(post.id, prev, formData);
        if (result.ok) onDone(post.id);
        return result;
      }
      const result = await createPost(prev, formData);
      if (result.postId) onDone(result.postId);
      return result;
    },
    {},
  );

  const dirty = post
    ? photoPicked || caption !== initialCaption
    : !!preview || caption.trim().length > 0;
  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  useEffect(() => {
    return () => {
      // 選んだ写真のプレビューだけ片づける（編集のいまの写真は URL のまま）
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const takeFile = (file: File | undefined) => {
    setFileError(null);
    if (!file) return false;
    const error = checkFile(file);
    if (error) {
      setFileError(error);
      return false;
    }
    setPreview(URL.createObjectURL(file));
    setPhotoPicked(true);
    return true;
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!takeFile(e.target.files?.[0])) e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    const input = fileInputRef.current;
    if (!input || !takeFile(file)) return;
    // ドラッグした写真もフォームで送れるように、ファイル選択欄に入れる
    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
  };

  // <form action> だと送ったあとに入力が空に戻り、失敗したときに選んだ写真が消えるので、
  // onSubmit から送る
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => action(formData));
  };

  const imageErrors = fileError ? [fileError] : state.errors?.image;
  const pickPhoto = () => fileInputRef.current?.click();

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-5 px-5 pb-2 pt-5 sm:px-7 sm:pt-6">
        <input
          ref={fileInputRef}
          name="image"
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={handleImageChange}
          aria-label="写真"
          aria-describedby="post-image-error"
          className="sr-only"
          tabIndex={-1}
        />
        {preview ? (
          <div className="relative aspect-square w-full self-center sm:w-[300px]">
            <Image
              src={preview}
              alt={photoPicked || !post ? "選んだ写真" : "いまの写真"}
              fill
              unoptimized
              className="rounded-xl object-cover"
            />
            <button
              type="button"
              onClick={pickPhoto}
              className="absolute bottom-2.5 right-2.5 inline-flex h-9 items-center gap-1.5 rounded-full border-[1.5px] border-ink bg-white/95 pl-2.5 pr-3.5 text-[13px] font-bold transition hover:bg-soft"
            >
              <CameraIcon className="size-[15px]" />
              写真を変える
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={clsx(
              "flex h-[350px] flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed bg-soft transition-colors sm:h-[300px]",
              dragging ? "border-ink bg-[#e6e4dc]" : "border-[#9a9a92]",
            )}
          >
            <Image
              src="/illustrations/dog-sit.png"
              alt=""
              width={165}
              height={155}
              className="h-auto w-[92px] mix-blend-multiply"
            />
            <button
              type="button"
              onClick={pickPhoto}
              className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-ink bg-white px-[22px] text-[15px] font-bold transition hover:bg-soft"
            >
              <CameraIcon className="size-[18px]" />
              写真を選ぶ
            </button>
            <p className="text-xs text-sub">JPEG・PNG・WebP・GIF、5MBまで</p>
            <p className="hidden text-xs text-sub sm:block">
              ここに写真をドラッグしてもOK
            </p>
          </div>
        )}
        {imageErrors?.length ? (
          <p
            id="post-image-error"
            role="alert"
            className="text-sm text-red-600"
          >
            {imageErrors[0]}
          </p>
        ) : null}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="post-caption" className="text-sm font-bold">
            ひとこと
            <span className="font-medium text-sub">（なくてもOK）</span>
          </label>
          <textarea
            id="post-caption"
            name="caption"
            rows={3}
            maxLength={CAPTION_MAX_LENGTH}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="例）はじめての海。波にびっくりしていました"
            aria-describedby="post-caption-count post-caption-error"
            className="resize-none rounded-xl border-[1.5px] border-ink bg-white px-3.5 py-3 text-[16px] leading-relaxed text-ink shadow-[0_2px_0_var(--color-line)] placeholder:text-[#8a8a84] focus:outline-2 focus:outline-offset-2 focus:outline-ink"
          />
          <p id="post-caption-count" className="self-end text-xs text-sub">
            {caption.length} / {CAPTION_MAX_LENGTH}
          </p>
          {state.errors?.caption && (
            <p id="post-caption-error" className="text-sm text-red-600">
              {state.errors.caption[0]}
            </p>
          )}
        </div>
        {state.message && (
          <p role="alert" className="text-sm text-red-600">
            {state.message}
          </p>
        )}
      </div>
      <ProfileModalActions
        onCancel={onCancel}
        pending={isPending || !!state.postId || !!state.ok}
        disabled={!preview}
        sticky={sticky}
        submitLabel={post ? "保存する" : "投稿する"}
        pendingLabel={post ? "保存しています…" : "投稿しています…"}
      />
    </form>
  );
}
