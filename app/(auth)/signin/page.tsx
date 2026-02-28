import { SignInForm } from "../../../modules/auth/SignInForm";
import { signInAction } from "../actions/authServerActions";

export default function SignInPage() {
  return (
    <main>
      <h1>Sign in</h1>
      <SignInForm onSubmitAction={signInAction} />
    </main>
  );
}
