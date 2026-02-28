import { SignUpForm } from "../../../modules/auth/SignUpForm";
import { signUpAction } from "../actions/authServerActions";

export default function SignUpPage() {
  return (
    <main>
      <h1>Sign up</h1>
      <SignUpForm onSubmitAction={signUpAction} />
    </main>
  );
}
