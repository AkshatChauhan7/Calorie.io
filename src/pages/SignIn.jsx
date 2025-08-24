import { SignIn } from "@clerk/clerk-react";
import './AuthPages.css'; // We'll create this CSS file next

export default function SignInPage() {
  return (
    <div className="auth-container">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
}