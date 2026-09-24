import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "The Millionaire Next Door | Learn with Rajan" };

export default function MillionaireNextDoorPage() {
  return <LibraryBookReader title="The Millionaire Next Door" pdfUrl="/api/library/the-millionaire-next-door" />;
}
