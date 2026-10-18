import RegisterCard from "@/app/components/pages/register/register-card";
import RegisterSteps from "@/app/components/pages/register/register-steps";
import ProfileSetupForm from "@/app/components/pages/register/profile-setup-form";
import { fetchMe } from "./../../../../../lib/apis";

export default async function Page() {
  const user = await fetchMe();
  return (
    <RegisterCard>
      <RegisterSteps current={2} />
      <h1 className="font-heading text-[26px] font-medium sm:text-[30px]">
        プロフィールをつくろう
      </h1>
      <p className="mt-1.5 text-sm text-sub sm:text-[15px]">
        みんなに表示されます。あとからいつでも変えられます。
      </p>
      <ProfileSetupForm defaultName={user.name} />
    </RegisterCard>
  );
}
