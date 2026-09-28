import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "Mindset: The New Psychology of Success | Learn with Rajan" };

export default function MindsetPage() {
  return <LibraryBookReader title="Mindset: The New Psychology of Success" pdfUrl="/api/library/mindset" />;
}
