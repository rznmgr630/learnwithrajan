import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "Frankenstein | Learn with Rajan" };

export default function FrankensteinPage() {
  return <LibraryBookReader title="Frankenstein" pdfUrl="/api/library/frankenstein" />;
}
