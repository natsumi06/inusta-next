import { redirect } from "next/navigation";
import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import { PostEditPage } from "@/app/components/pages/posts/post-edit-modal";
import { fetchOwnPost } from "./../../../../../../lib/apis";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const post = await fetchOwnPost(id);
  // ほかの人の投稿は編集できないので、投稿詳細にもどす
  if (!post) redirect(`/posts/${id}`);

  return (
    <>
      <BreadCrumbs title="投稿を編集" description="写真とひとことを直せます" />
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-6">
        <PostEditPage post={post} />
      </div>
    </>
  );
}
