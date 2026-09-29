import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "Maile Dekheko Darbar | Learn with Rajan" };

export default function MaileDekhekoDarbarPage() {
  return <LibraryBookReader title="मैले देखेको दरबार" pdfUrl="/api/library/maile-dekheko-darbar" />;
}
