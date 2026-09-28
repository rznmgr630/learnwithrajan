import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "The Wizard of Oz | Learn with Rajan" };

export default function TheWizardOfOzPage() {
  return <LibraryBookReader title="The Wizard of Oz" pdfUrl="/api/library/the-wizard-of-oz" />;
}
