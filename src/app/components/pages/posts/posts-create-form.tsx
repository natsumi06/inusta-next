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

  return (
    <form onSubmit={handleSubmit} className="mt-8 bg-white p-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          画像 <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full rounded bg-gray-100 font-medium text-gray-500 file:mr-4 file:border-0 file:bg-gray-800 file:px-4 file:py-2.5 file:text-white"
          name="image"
          disabled={isLoading}
        />
        <p className="mt-1 text-xs text-gray-500">
          対応形式：JPEG, PNG, WebP, GIF（最大5MB）
        </p>
      </div>

      {preview && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-gray-700">プレビュー</p>
          <div className="relative h-64 w-full overflow-hidden rounded border border-gray-300">
            <Image
              src={preview}
              alt="preview"
              fill
              className="object-cover"
            />
          </div>
          {fileName && (
            <p className="mt-2 text-xs text-gray-500">{fileName}</p>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <label className="mb-2 mt-4 block text-sm font-medium text-gray-700">
        キャプション
      </label>
      <textarea
        className="w-full rounded border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-blue-500 text-gray-700"
        name="caption"
        rows={8}
        placeholder="キャプションを入力してください..."
        disabled={isLoading}
      ></textarea>

      <button
        type="submit"
        disabled={isLoading || !preview}
        className="mt-4 inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 disabled:bg-gray-400 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900"
      >
        {isLoading ? "公開中..." : "公開"}
      </button>
    </form>
  );
}
