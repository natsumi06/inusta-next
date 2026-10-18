import Navigation from "@/app/components/layouts/navigation";

export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  /** URL つきのモーダル（プロフィール編集など）。@modal フォルダが入る */
  modal: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base">
      <Navigation />
      <main className="pb-24 sm:pb-0">{children}</main>
      {modal}
    </div>
  );
}
