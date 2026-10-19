import Link from "next/link";
import StatusCard, { primaryButtonClassName } from "./status-card";

export default function NotFoundView() {
  return (
    <StatusCard
      label="404"
      title="ページが見つかりません"
      actions={
        <Link href="/home" className={primaryButtonClassName}>
          ホームへもどる
        </Link>
      }
    >
      URL がまちがっているか、投稿が削除されたのかもしれません。
    </StatusCard>
  );
}
