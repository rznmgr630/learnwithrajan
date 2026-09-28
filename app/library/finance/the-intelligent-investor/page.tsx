import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "The Intelligent Investor | Learn with Rajan" };

export default function IntelligentInvestorPage() {
  return <LibraryBookReader title="The Intelligent Investor" pdfUrl="/api/library/the-intelligent-investor" />;
}
