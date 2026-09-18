"use client";

import { updateMe } from "./../../../../../lib/actions";
import Image from "next/image";
import { useState, FormEvent, ChangeEvent } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function ProfileEditForm({
  user,
}: {
  user: {
    name: string;
    email: string;
    image: string | null;
    description: string | null;
  };
}) {
  const [preview, setPreview] = useState<string | null>(user.image);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [descriptionLength, setDescriptionLength] = useState(
    user.description?.length || 0
  );

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

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
    };
    reader.readAsDataURL(file);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionLength(e.target.value.length);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get("name");
    if (!name || (name as string).trim().length === 0) {
      setError("名前は必須です");
      return;
    }

    setIsLoading(true);
    try {
      await updateMe(formData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "プロフィール更新に失敗しました"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative mt-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          名前 <span className="text-red-500">*</span>
        </label>
        <input
          defaultValue={user.name}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-700"
          name="name"
          type="text"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          defaultValue={user.email}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-700"
          name="email"
          type="email"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          自己紹介
        </label>
        <textarea
          className="text-gray-700 mt-1 w-full rounded border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-blue-700"
          name="description"
          rows={6}
          defaultValue={user.description ?? ""}
          onChange={handleDescriptionChange}
          disabled={isLoading}
          maxLength={500}
        ></textarea>
        <p className="mt-1 text-xs text-gray-500">
          {descriptionLength} / 500 文字
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          プロフィール画像
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 w-full rounded bg-gray-100 font-medium text-gray-500 file:mr-4 file:border-0 file:bg-gray-800 file:px-4 file:py-2.5 file:text-white"
          name="image"
          disabled={isLoading}
        />
        <p className="mt-1 text-xs text-gray-500">
          対応形式：JPEG, PNG, WebP, GIF（最大5MB）
        </p>
      </div>

      {preview && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">プレビュー</p>
          <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-gray-300">
            <Image
              src={preview}
              alt="preview"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-700 disabled:bg-gray-400 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900"
        >
          {isLoading ? "保存中..." : "保存"}
        </button>
      </div>
    </form>
  );
}
