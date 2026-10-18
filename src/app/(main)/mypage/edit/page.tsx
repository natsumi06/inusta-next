import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import ProfileEditPage from "@/app/components/pages/profile/profile-edit-page";
import { BackLink } from "@/app/components/pages/settings/form-parts";
import { fetchMe } from "./../../../../../lib/apis";

export default async function Page() {
  const user = await fetchMe();
  return (
    <>
      <BreadCrumbs title="プロフィールを編集" />
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-6">
        <BackLink href="/mypage">マイページにもどる</BackLink>
        <ProfileEditPage user={user} />
      </div>
    </>
  );
}
