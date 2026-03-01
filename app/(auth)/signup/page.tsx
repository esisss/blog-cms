import { SignUpForm } from "@/features/auth/SignUpForm";
import { signUpAction } from "@/server/actions/auth";

export default function SignUpPage() {
  return (
    <>
      <h2 className="card-title text-2xl font-bold mb-6">Sign up</h2>
      <SignUpForm onSubmitAction={signUpAction} />
    </>
  );
}
