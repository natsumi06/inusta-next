import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import PostNewPage from "@/app/components/pages/posts/post-new-page";

export default function Page() {
  return (
    <>
      <BreadCrumbs title="写真を投稿" description="愛犬の写真をシェアしよう" />
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-6">
        <PostNewPage />
      </div>
    </>
  );
}
