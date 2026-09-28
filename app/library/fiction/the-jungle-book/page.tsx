import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "The Jungle Book | Learn with Rajan" };

export default function TheJungleBookPage() {
  return <LibraryBookReader title="The Jungle Book" pdfUrl="/api/library/the-jungle-book" />;
}
