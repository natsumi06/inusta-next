import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import PostsCreateForm from "@/app/components/pages/posts/posts-create-form";

export default function Page() {
  return (
    <>
      <BreadCrumbs title="投稿する 🐾" />
      <div className="mx-auto max-w-5xl">
        <PostsCreateForm />
      </div>
    </>
  );
}
