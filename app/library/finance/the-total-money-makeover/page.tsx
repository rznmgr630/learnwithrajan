import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "The Total Money Makeover | Learn with Rajan" };

export default function TotalMoneyMakeoverPage() {
  return <LibraryBookReader title="The Total Money Makeover" pdfUrl="/api/library/the-total-money-makeover" />;
}
