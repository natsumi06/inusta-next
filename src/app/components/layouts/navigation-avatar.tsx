import Image from "next/image";
import clsx from "clsx";
import { UserIcon } from "@/app/components/layouts/navigation-icons";

type NavigationAvatarProps = {
  image: string | null | undefined;
  className?: string;
};

export default function NavigationAvatar({
  image,
  className,
}: NavigationAvatarProps) {
  if (!image) {
    return (
      <span
        className={clsx(
          "flex items-center justify-center rounded-full bg-soft text-sub",
          className
        )}
      >
        <UserIcon className="size-4/5" />
      </span>
    );
  }
  return (
    <Image
      className={clsx("aspect-square rounded-full object-cover", className)}
      src={image}
      width={64}
      height={64}
      alt=""
    />
  );
}
