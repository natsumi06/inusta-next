import RegisterCard from "@/app/components/pages/register/register-card";
import { StepHeader } from "@/app/components/pages/register/step-parts";
import IconStepForm from "@/app/components/pages/register/icon-step-form";
import { fetchMe } from "./../../../../../lib/apis";

export default async function Page() {
  const user = await fetchMe();
  return (
    <RegisterCard logoOnMobile={false}>
      <StepHeader step={2} backHref="/register/name" />
      <IconStepForm currentImage={user.image} />
    </RegisterCard>
  );
}
