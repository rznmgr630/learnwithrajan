import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "The Richest Man in Babylon | Learn with Rajan" };

export default function RichestManInBabylonPage() {
  return <LibraryBookReader title="The Richest Man in Babylon" pdfUrl="/api/library/richest-man-in-babylon" />;
}
