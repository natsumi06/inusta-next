import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import EmailForm from "@/app/components/pages/settings/email-form";
import { BackLink } from "@/app/components/pages/settings/form-parts";
import { fetchMe } from "./../../../../../../lib/apis";

export default async function Page() {
  const user = await fetchMe();
  return (
    <>
      <BreadCrumbs title="メールアドレスの変更" />
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-6">
        <BackLink href="/mypage/settings">設定にもどる</BackLink>
        <EmailForm currentEmail={user.email} />
      </div>
    </>
  );
}
