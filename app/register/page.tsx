import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = { title: "Create account | Learn with Rajan" };

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
