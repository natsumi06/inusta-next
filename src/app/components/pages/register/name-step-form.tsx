"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import clsx from "clsx";
import Loader from "@/app/components/loaders/loader";
import { saveDisplayName } from "./../../../../../lib/actions";
import { StepError, StepFooter, StepTitle } from "./step-parts";

/**
 * 1問目: 表示名（必須）
 * 入力するまで「つぎへ」は押せない
 */
export default function NameStepForm({ defaultName }: { defaultName: string }) {
  const [state, action, isPending] = useActionState(saveDisplayName, {
    message: null,
  });
  const [name, setName] = useState(defaultName);
  const isEmpty = name.trim() === "";

  return (
    <form
      action={action}
      className={clsx("relative flex flex-1 flex-col gap-6 sm:gap-7", {
        "opacity-20": isPending,
      })}
    >
      <StepTitle
        title="表示名はどうしますか"
        lead="投稿やコメントのそばに表示されます。"
      >
        <Image
          src="/illustrations/dog-sit.png"
          alt=""
          aria-hidden="true"
          width={165}
          height={155}
          className="h-auto w-24 self-center mix-blend-multiply"
        />
      </StepTitle>
      <div>
        <label
          htmlFor="register-name"
          className="mb-2 flex items-center gap-0.5 text-sm font-bold"
        >
          表示名
          <span aria-hidden="true" className="text-ink">
            *
          </span>
          <span className="sr-only">（必須）</span>
        </label>
        <input
          id="register-name"
          name="name"
          required
          aria-required="true"
          maxLength={30}
          autoComplete="nickname"
          placeholder="例）ナツ"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-[52px] w-full rounded-xl border-[1.5px] border-ink bg-white px-4 text-[16px] text-ink shadow-[0_2px_0_var(--color-line)] placeholder:text-sub focus:outline-2 focus:outline-offset-2 focus:outline-ink"
        />
        <p className="mt-2 text-xs text-sub">あとからマイページで変えられます</p>
        <StepError message={state.message} />
      </div>
      <StepFooter disabled={isEmpty || isPending} />
      {isPending && <Loader />}
    </form>
  );
}
