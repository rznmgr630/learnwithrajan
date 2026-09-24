import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "Your Money or Your Life | Learn with Rajan" };

export default function YourMoneyOrYourLifePage() {
  return <LibraryBookReader title="Your Money or Your Life" pdfUrl="/api/library/your-money-or-your-life" />;
}
