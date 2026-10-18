"use client";

import { useActionState } from "react";
import clsx from "clsx";
import Loader from "@/app/components/loaders/loader";
import { saveBio } from "./../../../../../lib/actions";
import { StepError, StepFooter, StepTitle } from "./step-parts";

/**
 * 3問目: 自己紹介（スキップできる）
 */
export default function BioStepForm({
  defaultDescription,
}: {
  defaultDescription: string;
}) {
  const [state, action, isPending] = useActionState(saveBio, {
    message: null,
  });

  return (
    <form
      action={action}
      className={clsx("relative flex flex-1 flex-col gap-6 sm:gap-7", {
        "opacity-20": isPending,
      })}
    >
      <StepTitle
        title="自己紹介を書こう"
        lead="どんな子と暮らしているか、ひとこと教えてね。"
      />
      <div>
        <label htmlFor="register-description" className="sr-only">
          自己紹介
        </label>
        <textarea
          id="register-description"
          name="description"
          rows={4}
          maxLength={500}
          defaultValue={defaultDescription}
          placeholder="例）柴犬のこむぎと暮らしています。おさんぽ写真をのせます。"
          className="w-full resize-none rounded-xl border-[1.5px] border-ink bg-white px-4 py-3.5 text-[16px] leading-relaxed text-ink shadow-[0_2px_0_var(--color-line)] placeholder:text-sub focus:outline-2 focus:outline-offset-2 focus:outline-ink"
        />
        <StepError message={state.message} />
      </div>
      <StepFooter
        backHref="/register/icon"
        skipHref="/register/complete"
        disabled={isPending}
      />
      {isPending && <Loader />}
    </form>
  );
}
