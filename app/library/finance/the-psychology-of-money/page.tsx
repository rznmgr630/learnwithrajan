import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "The Psychology of Money | Learn with Rajan" };

export default function PsychologyOfMoneyPage() {
  return <LibraryBookReader title="The Psychology of Money" pdfUrl="/api/library/psychology-of-money" />;
}
