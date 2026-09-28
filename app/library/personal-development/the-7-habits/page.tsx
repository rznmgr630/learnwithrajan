import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "The 7 Habits of Highly Effective People | Learn with Rajan" };

export default function The7HabitsPage() {
  return <LibraryBookReader title="The 7 Habits of Highly Effective People" pdfUrl="/api/library/the-7-habits" />;
}
