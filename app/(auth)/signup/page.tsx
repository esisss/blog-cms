import { SignUpForm } from "../../../modules/auth/SignUpForm";
import { signUpAction } from "../actions/authServerActions";

export default function SignUpPage() {
  return (
    <>
      <h2 className="card-title text-2xl font-bold mb-6">Sign up</h2>
      <SignUpForm onSubmitAction={signUpAction} />
    </>
  );
}
