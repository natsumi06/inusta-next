"use client";

import { createPost } from "./../../../../../lib/actions";
import Image from "next/image";
import { useState, FormEvent, ChangeEvent } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function PostsCreateForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) {
      setPreview(null);
      setFileName(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("対応する形式：JPEG, PNG, WebP, GIF");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("ファイルサイズは5MB以下にしてください");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!formData.get("image")) {
      setError("画像を選択してください");
      return;
    }

    setIsLoading(true);
    try {
      await createPost(formData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "投稿作成に失敗しました"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFileName(null);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 bg-white p-4">
      {!preview ? (
        <div>
          <label className="mb-4 block text-sm font-medium text-gray-700">
            画像 <span className="text-red-500">*</span>
          </label>
          <div className="rounded border-2 border-gray-200 bg-gray-50 p-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-200">
                <svg
                  className="h-10 w-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  name="image"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.parentElement?.querySelector<HTMLInputElement>(
                      'input[type="file"]'
                    )?.click();
                  }}
                  disabled={isLoading}
                  className="rounded-full bg-gray-800 px-6 py-2 font-medium text-white hover:bg-gray-700 disabled:bg-gray-400"
                >
                  ファイルを選択
                </button>
              </label>
              <p className="text-xs text-gray-500">
                JPEG・PNG・WebP・GIF
              </p>
              <p className="text-xs text-gray-500">最大 5MB</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">未選択</p>
        </div>
      ) : (
        <div>
          <label className="mb-4 block text-sm font-medium text-gray-700">
            画像 <span className="text-red-500">*</span>
          </label>
          <div className="rounded border-2 border-gray-200 bg-gray-50 p-4">
            <div className="relative mb-4 h-64 w-full overflow-hidden rounded border border-gray-300">
              <Image
                src={preview}
                alt="preview"
                fill
                className="object-cover"
              />
            </div>
            <div className="mb-4">
              {fileName && (
                <>
                  <p className="mb-1 text-sm font-medium text-gray-900">
                    {fileName}
                  </p>
                  <p className="mb-3 text-xs text-gray-500">
                    JPEG・2.4 MB
                  </p>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                    <p className="text-xs font-medium text-green-700">
                      アップロード準備完了
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  name="image"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.parentElement?.querySelector<HTMLInputElement>(
                      'input[type="file"]'
                    )?.click();
                  }}
                  disabled={isLoading}
                  className="rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:text-gray-400"
                >
                  変更
                </button>
              </label>
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isLoading}
                className="rounded px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:text-gray-400"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <label className="mb-2 mt-4 block text-sm font-medium text-gray-700">
        キャプション <span className="text-gray-500">任意</span>
      </label>
      <textarea
        className="w-full rounded border border-gray-300 p-2.5 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
        name="caption"
        rows={8}
        placeholder="キャプションを入力してください..."
        disabled={isLoading}
      ></textarea>

      <button
        type="submit"
        disabled={isLoading || !preview}
        className="mt-4 w-full rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white transition duration-150 ease-in-out hover:bg-gray-700 disabled:bg-gray-400"
      >
        {isLoading ? "公開中..." : "公開する"}
      </button>
    </form>
  );
}
