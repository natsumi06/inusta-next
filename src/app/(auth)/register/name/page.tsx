import RegisterCard from "@/app/components/pages/register/register-card";
import { StepHeader } from "@/app/components/pages/register/step-parts";
import NameStepForm from "@/app/components/pages/register/name-step-form";
import RegisteredModal from "@/app/components/pages/register/registered-modal";
import { fetchMe } from "./../../../../../lib/apis";
import { provisionalName } from "./../../../../../lib/display-name";

export default async function Page(props: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const { registered } = await props.searchParams;
  const user = await fetchMe();
  // 登録直後の仮の名前（メールの@より前）のままなら、空欄から入力してもらう
  const defaultName = user.name === provisionalName(user.email) ? "" : user.name;

  return (
    <RegisterCard logoOnMobile={false}>
      <StepHeader step={1} />
      <NameStepForm defaultName={defaultName} />
      {registered === "1" && <RegisteredModal />}
    </RegisterCard>
  );
}
