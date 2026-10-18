import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import DeleteAccountForm from "@/app/components/pages/settings/delete-account-form";
import { BackLink } from "@/app/components/pages/settings/form-parts";

export default function Page() {
  return (
    <>
      <BreadCrumbs title="退会" />
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-6">
        <BackLink href="/mypage/settings">設定にもどる</BackLink>
        <DeleteAccountForm />
      </div>
    </>
  );
}
