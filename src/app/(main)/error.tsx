"use client";

import Link from "next/link";
import { useEffect } from "react";
import StatusCard, {
  primaryButtonClassName,
  subButtonClassName,
} from "@/app/components/pages/errors/status-card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusCard
      title="うまく表示できませんでした"
      actions={
        <>
          <button
            type="button"
            onClick={reset}
            className={primaryButtonClassName}
          >
            もう一度読みこむ
          </button>
          <Link href="/home" className={subButtonClassName}>
            ホームへもどる
          </Link>
        </>
      }
    >
      通信がうまくいかなかったのかもしれません。少し待ってから、もう一度ためしてください。
    </StatusCard>
  );
}
