import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import DeleteAccountForm from "@/app/components/pages/settings/delete-account-form";
import { BackLink } from "@/app/components/pages/settings/form-parts";
import { fetchMyActivityCounts } from "./../../../../../../lib/apis";

export default async function Page() {
  const { postCount, commentCount } = await fetchMyActivityCounts();
  return (
    <>
      <BreadCrumbs title="退会" />
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-6">
        <BackLink href="/mypage/settings">設定にもどる</BackLink>
        <DeleteAccountForm postCount={postCount} commentCount={commentCount} />
      </div>
    </>
  );
}
