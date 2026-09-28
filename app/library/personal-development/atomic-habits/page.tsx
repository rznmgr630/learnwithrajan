import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "Atomic Habits | Learn with Rajan" };

export default function AtomicHabitsPage() {
  return <LibraryBookReader title="Atomic Habits" pdfUrl="/api/library/atomic-habits" />;
}
