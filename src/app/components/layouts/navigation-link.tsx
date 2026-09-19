import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

type NavigationLinkProps = {
  href: string;
  active: boolean;
  normalIcon: string;
  hoverIcon: string;
  alt: string;
  label: string;
};

export default function NavigationLink({
  href,
  active,
  normalIcon,
  hoverIcon,
  alt,
  label,
}: NavigationLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "group inline-flex flex-col items-center border-gray-600 px-1 pb-1.5 pt-1 text-sm font-medium text-gray-900 focus:border-gray-900",
        {
          "border-b": active,
        }
      )}
    >
      <span className="relative block size-[40px]">
        <Image
          src={normalIcon}
          fill
          className="object-contain transition-opacity group-hover:opacity-0"
          alt={alt}
        />
        <Image
          src={hoverIcon}
          fill
          className="object-contain opacity-0 transition-opacity group-hover:opacity-100"
          alt={alt}
        />
      </span>
      <p className="pointer-events-none max-h-0 overflow-hidden text-xs opacity-0 transition-all duration-400 ease-out group-hover:max-h-6 group-hover:opacity-100">
        {label}
      </p>
    </Link>
  );
}
