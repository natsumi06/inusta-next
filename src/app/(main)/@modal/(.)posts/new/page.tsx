import PostNewModal from "@/app/components/pages/posts/post-new-modal";

/** ナビの「投稿する」などから /posts/new へ移ったときは、今の画面の上にモーダルで開く */
export default function Page() {
  return <PostNewModal />;
}
