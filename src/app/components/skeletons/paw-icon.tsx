/** 読み込み中の箱に入れる足跡（飾り。docs/design.md「犬モチーフ」） */
export function PawIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="12" cy="15.5" rx="4.2" ry="3.6" />
      <ellipse cx="6.2" cy="10" rx="1.9" ry="2.4" />
      <ellipse cx="17.8" cy="10" rx="1.9" ry="2.4" />
      <ellipse cx="9.4" cy="6" rx="1.8" ry="2.3" />
      <ellipse cx="14.6" cy="6" rx="1.8" ry="2.3" />
    </svg>
  );
}
