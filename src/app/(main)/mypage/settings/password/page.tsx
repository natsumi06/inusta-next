import BreadCrumbs from "@/app/components/layouts/bread-crumbs";
import PasswordForm from "@/app/components/pages/settings/password-form";
import { BackLink } from "@/app/components/pages/settings/form-parts";

export default function Page() {
  return (
    <>
      <BreadCrumbs title="パスワードの変更" />
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-6">
        <BackLink href="/mypage/settings">設定にもどる</BackLink>
        <PasswordForm />
      </div>
    </>
  );
}
