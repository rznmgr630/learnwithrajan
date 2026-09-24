import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "I Will Teach You to Be Rich | Learn with Rajan" };

export default function IWillTeachYouToBeRichPage() {
  return <LibraryBookReader title="I Will Teach You to Be Rich" pdfUrl="/api/library/i-will-teach-you-to-be-rich" />;
}
