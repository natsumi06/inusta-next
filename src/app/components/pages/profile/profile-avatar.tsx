import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { CameraIcon } from "@/app/components/layouts/navigation-icons";

/**
 * プロフィールのアイコン
 * - editHref があるとき（自分のマイページ）は押すと編集が開き、カメラの印を付ける。
 *   未設定なら点線の輪＋うすいわんこで「ここに写真を入れられる」と伝える。
 * - ほかの人のページで未設定なら、白黒わんこをそのまま見せる。
 */
export default function ProfileAvatar({
  image,
  name,
  editHref,
}: {
  image: string | null;
  name: string;
  editHref?: string;
}) {
  const editable = !!editHref;
  const unset = !image;

  const face = (
    <span
      className={clsx(
        "flex size-full items-center justify-center overflow-hidden rounded-full border-2",
        unset && editable
          ? "border-dashed border-[#9a9a92] bg-soft"
          : "border-ink bg-soft"
      )}
    >
      {image ? (
        <Image
          src={image}
          alt={editable ? "" : `${name}さんのアイコン`}
          width={96}
          height={96}
          className="size-full object-cover"
        />
      ) : (
        <Image
          src="/illustrations/dog-sit.png"
          alt={editable ? "" : `${name}さんのアイコン`}
          width={165}
          height={155}
          className={clsx("mt-[8%] h-auto w-[66%] mix-blend-multiply", {
            "opacity-[0.55]": editable,
          })}
        />
      )}
    </span>
  );

  if (!editHref) {
    return <div className="size-20 shrink-0 sm:size-24">{face}</div>;
  }

  return (
    <Link
      href={editHref}
      aria-label={unset ? "アイコンを設定する" : "アイコンを変更する"}
      className="relative block size-20 shrink-0 transition hover:opacity-90 sm:size-24"
    >
      {face}
      <span
        aria-hidden="true"
        className={clsx(
          "absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full",
          unset
            ? "size-8 border-[3px] border-white bg-ink text-white"
            : "size-7 border-2 border-ink bg-white text-ink"
        )}
      >
        <CameraIcon className={unset ? "size-[15px]" : "size-[13px]"} />
      </span>
    </Link>
  );
}
