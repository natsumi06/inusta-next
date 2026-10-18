import { redirect } from "next/navigation";
import PostEditModal from "@/app/components/pages/posts/post-edit-modal";
import { fetchOwnPost } from "./../../../../../../../lib/apis";

type PageProps = {
  params: Promise<{ id: string }>;
};

/** 投稿詳細の「…」›「編集する」から /posts/[id]/edit へ移ったときは、今の画面の上にモーダルで開く */
export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const post = await fetchOwnPost(id);
  // ほかの人の投稿は編集できないので、投稿詳細にもどす
  if (!post) redirect(`/posts/${id}`);
  return <PostEditModal post={post} />;
}
