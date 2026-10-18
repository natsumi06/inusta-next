import Image from "next/image";
import clsx from "clsx";
import { CameraIcon } from "@/app/components/layouts/navigation-icons";

/**
 * プロフィールのアイコン
 * - editable（自分のマイページ）のときはカメラの印を付ける。
 *   未設定なら点線の輪＋うすいわんこで「ここに写真を入れられる」と伝える。
 * - ほかの人のページで未設定なら、白黒わんこをそのまま見せる。
 * 押したときの動き（アイコン変更モーダル）は icon-edit-modal.tsx が持つ
 */
export default function ProfileAvatar({
  image,
  name,
  editable = false,
  className,
}: {
  image: string | null;
  name: string;
  editable?: boolean;
  className?: string;
}) {
  const unset = !image;
  const alt = editable ? "" : `${name}さんのアイコン`;

  return (
    <span
      className={clsx("relative block size-20 shrink-0 sm:size-28", className)}
    >
      <span
        className={clsx(
          "flex size-full items-center justify-center overflow-hidden rounded-full border-2 bg-soft",
          unset && editable ? "border-dashed border-[#9a9a92]" : "border-ink",
        )}
      >
        {image ? (
          <Image
            src={image}
            alt={alt}
            width={112}
            height={112}
            className="size-full object-cover"
          />
        ) : (
          <Image
            src="/illustrations/dog-sit.png"
            alt={alt}
            width={165}
            height={155}
            className={clsx("mt-[8%] h-auto w-[66%] mix-blend-multiply", {
              "opacity-[0.55]": editable,
            })}
          />
        )}
      </span>
      {editable && (
        <span
          aria-hidden="true"
          className={clsx(
            "absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full",
            unset
              ? "size-8 border-[3px] border-white bg-ink text-white sm:size-9"
              : "size-7 border-2 border-ink bg-white text-ink sm:size-8",
          )}
        >
          <CameraIcon
            className={unset ? "size-[15px]" : "size-[13px] sm:size-[15px]"}
          />
        </span>
      )}
    </span>
  );
}
