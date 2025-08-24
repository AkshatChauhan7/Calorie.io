import { SignUp } from "@clerk/clerk-react";
import './AuthPages.css';

export default function SignUpPage() {
  return (
    <div className="auth-container">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  );
}