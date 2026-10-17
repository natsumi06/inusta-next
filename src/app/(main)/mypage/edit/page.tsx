import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import ProfileEditForm from "@/app/components/pages/profile/profile-form";
import { fetchMe } from "./../../../../../lib/apis";

export default async function Page() {
  const user = await fetchMe();
  return (
    <>
      <BreadCrumbs title="プロフィール編集 🐾" />
      <div className="mx-auto mt-8 max-w-5xl bg-white p-4">
        <header>
          <h2 className="text-lg font-medium text-gray-900">アカウント情報</h2>
          <p className="mt-1 text-sm text-gray-600">
            アカウント情報やメールアドレスの更新
          </p>
        </header>
        <ProfileEditForm user={user} />
      </div>
    </>
  );
}
