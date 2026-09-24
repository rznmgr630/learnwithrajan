import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "The Simple Path to Wealth | Learn with Rajan" };

export default function SimplePathToWealthPage() {
  return <LibraryBookReader title="The Simple Path to Wealth" pdfUrl="/api/library/the-simple-path-to-wealth" />;
}
