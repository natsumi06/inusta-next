"use client";

import { useActionState, useState } from "react";
import ProfileModal, { ProfileModalActions } from "./profile-modal";
import {
  PencilIcon,
  PlusIcon,
} from "@/app/components/layouts/navigation-icons";
import {
  updateBio,
  type ProfileModalState,
} from "./../../../../../lib/actions";

const MAX_LENGTH = 500;

/**
 * マイページの自己紹介の入口
 * 空なら「＋ 自己紹介を追加」、書いてあれば「✎ 自己紹介を変更」。どちらも自己紹介だけを変えるモーダルが開く
 */
export default function BioEditModal({
  description,
}: {
  description: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [length, setLength] = useState(description?.length ?? 0);
  const hasBio = !!description;

  const [state, action, isPending] = useActionState(
    async (prev: ProfileModalState, formData: FormData) => {
      const result = await updateBio(prev, formData);
      if (result.ok) setOpen(false);
      return result;
    },
    { message: null }
  );

  const openModal = () => {
    setLength(description?.length ?? 0);
    setOpen(true);
  };

  return (
    <>
      {hasBio ? (
        <button
          type="button"
          onClick={openModal}
          className="-ml-2 inline-flex h-9 items-center gap-1.5 rounded-full pl-2 pr-3 text-[13px] font-bold text-sub transition hover:bg-soft hover:text-ink"
        >
          <PencilIcon className="size-[15px]" />
          自己紹介を変更
        </button>
      ) : (
        <button
          type="button"
          onClick={openModal}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-soft pl-2.5 pr-4 text-sm font-bold text-ink transition hover:bg-[#e6e4dc]"
        >
          <span
            aria-hidden="true"
            className="flex size-[22px] items-center justify-center rounded-full bg-ink text-white"
          >
            <PlusIcon className="size-3" />
          </span>
          自己紹介を追加
        </button>
      )}
      <ProfileModal
        open={open}
        onClose={() => setOpen(false)}
        title={hasBio ? "自己紹介を変更" : "自己紹介を追加"}
      >
        <form action={action}>
          <div className="flex flex-col gap-1.5 px-5 pt-2 sm:px-7 sm:pt-5">
            <label htmlFor="bio-modal" className="text-sm font-bold">
              自己紹介
            </label>
            <textarea
              id="bio-modal"
              name="description"
              rows={5}
              maxLength={MAX_LENGTH}
              defaultValue={description ?? ""}
              autoFocus
              onChange={(e) => setLength(e.target.value.length)}
              placeholder="例）柴犬のころ（3さい）と暮らしています。おさんぽ写真をよくのせます。"
              className="resize-none rounded-xl border-[1.5px] border-ink bg-white px-3.5 py-3 text-[16px] leading-relaxed text-ink shadow-[0_2px_0_var(--color-line)] placeholder:text-[#8a8a84] focus:outline-2 focus:outline-offset-2 focus:outline-ink"
            />
            <p className="self-end text-xs text-sub">
              {length} / {MAX_LENGTH}
            </p>
            {!state.ok && state.message && (
              <p role="alert" className="text-sm text-red-600">
                {state.message}
              </p>
            )}
          </div>
          <ProfileModalActions
            onCancel={() => setOpen(false)}
            pending={isPending}
          />
        </form>
      </ProfileModal>
    </>
  );
}
