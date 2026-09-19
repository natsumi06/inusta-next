"use client";

import { deletePost } from "../../../../../lib/actions";
import Image from "next/image";
import { useState } from "react";

type DeletePostButtonProps = {
  postId: string;
  postImage: string;
};

export default function DeletePostButton({
  postId,
  postImage,
}: DeletePostButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(postId, new FormData());
    } catch (error) {
      console.error("Delete failed:", error);
      setIsDeleting(false);
    }
  };

  return (
    <>
        <button
          onClick={() => setIsOpen(true)}
          className="mt-4 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-800"
        >
          投稿を削除
        </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900">
              投稿を削除しますか？
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              この操作は取り消せません。確認してから削除してください。
            </p>

            <div className="mt-4 flex justify-center">
              <div className="relative h-40 w-40 overflow-hidden rounded border border-gray-300">
                <Image
                  src={postImage}
                  alt="投稿画像"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
