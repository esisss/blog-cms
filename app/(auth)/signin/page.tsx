import { SignInForm } from "@/features/auth/SignInForm";
import { signInAction } from "@/server/actions/auth";

export default function SignInPage() {
  return (
    <>
      <h2 className="card-title text-2xl font-bold mb-6">Sign in</h2>
      <SignInForm onSubmitAction={signInAction} />
    </>
  );
}
