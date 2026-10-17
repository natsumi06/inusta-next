import clsx from "clsx";
import Link from "next/link";

type NavigationLinkProps = {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
};

export default function NavigationLink({
  href,
  active,
  icon,
  label,
}: NavigationLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={clsx(
        "inline-flex items-center gap-2 border-y-[3px] border-t-transparent px-3.5 text-[15px] transition-colors",
        active
          ? "border-b-ink font-bold text-ink"
          : "border-b-transparent font-medium text-sub hover:text-ink"
      )}
    >
      <span className="size-[22px]">{icon}</span>
      {label}
    </Link>
  );
}
