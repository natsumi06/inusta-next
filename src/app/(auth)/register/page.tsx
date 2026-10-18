import RegisterForm from "./../../components/pages/register/register-form";
import RegisterCard from "@/app/components/pages/register/register-card";
import RegisterSteps from "@/app/components/pages/register/register-steps";

export default function Page() {
  return (
    <RegisterCard>
      <RegisterSteps current={1} />
      <RegisterForm />
    </RegisterCard>
  );
}
