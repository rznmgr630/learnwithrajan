import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "GauKhane Katha | Learn with Rajan" };

export default function GauKhaneKathaPage() {
  return <LibraryBookReader title="गाउँ खाने कथा" pdfUrl="/api/library/gaukhane-katha" />;
}
