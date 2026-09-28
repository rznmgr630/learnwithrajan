import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "Eat That Frog! | Learn with Rajan" };

export default function EatThatFrogPage() {
  return <LibraryBookReader title="Eat That Frog!" pdfUrl="/api/library/eat-that-frog" />;
}
