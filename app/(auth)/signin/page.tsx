import { SignInForm } from "../../../modules/auth/SignInForm";
import { signInAction } from "../actions/authServerActions";

export default function SignInPage() {
  return (
    <>
      <h2 className="card-title text-2xl font-bold mb-6">Sign in</h2>
      <SignInForm onSubmitAction={signInAction} />
    </>
  );
}
