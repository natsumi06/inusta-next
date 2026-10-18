import Image from "next/image";
import clsx from "clsx";

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
          "flex items-center justify-center overflow-hidden rounded-full bg-soft",
          className
        )}
      >
        {/* アイコン未設定のときは白黒わんこ（登録時のプロフィール設定と同じ） */}
        <Image
          src="/illustrations/dog-sit.png"
          alt=""
          width={64}
          height={60}
          className="mt-[10%] h-auto w-[70%] mix-blend-multiply"
        />
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
