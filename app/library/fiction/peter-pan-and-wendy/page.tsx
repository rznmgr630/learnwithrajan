import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "Peter Pan and Wendy | Learn with Rajan" };

export default function PeterPanAndWendyPage() {
  return <LibraryBookReader title="Peter Pan and Wendy" pdfUrl="/api/library/peter-pan-and-wendy" />;
}
