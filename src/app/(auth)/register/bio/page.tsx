import RegisterCard from "@/app/components/pages/register/register-card";
import { StepHeader } from "@/app/components/pages/register/step-parts";
import BioStepForm from "@/app/components/pages/register/bio-step-form";
import { fetchMe } from "./../../../../../lib/apis";

export default async function Page() {
  const user = await fetchMe();
  return (
    <RegisterCard logoOnMobile={false}>
      <StepHeader step={3} backHref="/register/icon" />
      <BioStepForm defaultDescription={user.description ?? ""} />
    </RegisterCard>
  );
}
