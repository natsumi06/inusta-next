import clsx from "clsx";

const STEPS = ["アカウント", "プロフィール", "完了"] as const;

/**
 * 会員登録の3ステップ表示（アカウント → プロフィール → 完了）
 * current は 1 始まり。そこまでのバーを塗り、今いるステップを太字にする
 */
export default function RegisterSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol
      aria-label="登録のステップ"
      className="mb-7 grid grid-cols-3 gap-1.5 sm:gap-2"
    >
      {STEPS.map((label, index) => {
        const step = index + 1;
        const isCurrent = step === current;
        return (
          <li
            key={label}
            aria-current={isCurrent ? "step" : undefined}
            className="flex flex-col gap-1.5"
          >
            <span
              className={clsx(
                "h-1 rounded-full",
                step <= current ? "bg-ink" : "bg-line"
              )}
            />
            <span
              className={clsx(
                "text-[11px] sm:text-xs",
                isCurrent ? "font-bold text-ink" : "text-sub"
              )}
            >
              {step} {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
