import Image from "next/image";
import clsx from "clsx";
import type { CSSProperties } from "react";

/** 点の位置（表示名・アイコン・自己紹介）。ゴールのおうちは 100% */
const POINTS = ["0%", "33.333%", "66.666%"] as const;

type Props = {
  /** 1: 表示名 2: アイコン 3: 自己紹介 4: 準備完了（ゴール） */
  step: 1 | 2 | 3 | 4;
};

/**
 * 会員登録後の進み具合を「おさんぽ」で見せる
 * わんこが前の点から今の点まで歩き、ゴールはおうち（＝ホーム）。
 * ゴールに着いたら、通った点にチェックが付き、おうちがピンクでぽんっと出る
 */
export default function WalkProgress({ step }: Props) {
  const isGoal = step === 4;
  const to = isGoal ? "100%" : POINTS[step - 1];
  const from = step === 1 ? POINTS[0] : POINTS[step - 2];

  return (
    <div
      role="img"
      aria-label={`はじめる準備 ${step}/4`}
      className="relative mx-3.5 h-[72px]"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-14 -mt-[1.5px] h-[3px] rounded-full bg-[repeating-linear-gradient(90deg,var(--color-line)_0_8px,transparent_8px_14px)]"
      />
      <span
        aria-hidden="true"
        className={clsx(
          "walk-line absolute left-0 top-14 rounded-full bg-ink",
          isGoal ? "-mt-0.5 h-1" : "-mt-[1.5px] h-[3px]"
        )}
        style={{ width: to, "--walk-from": from } as CSSProperties}
      />
      {POINTS.map((left, index) =>
        isGoal ? (
          <span
            key={left}
            aria-hidden="true"
            className="absolute top-14 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-white"
            style={{ left }}
          >
            <svg
              className="size-[11px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12.5 10 17 19 7" />
            </svg>
          </span>
        ) : (
          <span
            key={left}
            aria-hidden="true"
            className={clsx(
              "absolute top-14 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
              index < step ? "bg-ink" : "bg-line"
            )}
            style={{ left }}
          />
        )
      )}
      <span
        aria-hidden="true"
        className={clsx(
          "absolute left-full top-14 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2",
          isGoal
            ? "walk-goal size-10 border-ink bg-cheek text-ink shadow-[0_0_0_6px_rgb(255_138_154/0.25)]"
            : "size-7 border-[#b9b9b2] bg-white text-[#b9b9b2]"
        )}
      >
        <svg
          className={isGoal ? "size-5" : "size-[15px]"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
        </svg>
      </span>
      {!isGoal && (
        <Image
          src="/illustrations/dog-walk.png"
          alt=""
          aria-hidden="true"
          width={335}
          height={180}
          priority
          className={clsx(
            "walk-dog absolute bottom-[18px] h-auto w-16 max-w-none mix-blend-multiply",
            step === 1 ? "-ml-[30px]" : "-ml-[50px]"
          )}
          style={
            {
              left: to,
              transform: "scaleX(-1)",
              "--walk-from": from,
              "--walk-to": to,
            } as CSSProperties
          }
        />
      )}
    </div>
  );
}
