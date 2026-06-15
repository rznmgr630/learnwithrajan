import { AuthGate } from "@/components/AuthGate";

export default function TodoRoute() {
  return <AuthGate />;
}
