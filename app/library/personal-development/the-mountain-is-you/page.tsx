import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "The Mountain Is You | Learn with Rajan" };

export default function TheMountainIsYouPage() {
  return <LibraryBookReader title="The Mountain Is You" pdfUrl="/api/library/the-mountain-is-you" />;
}
