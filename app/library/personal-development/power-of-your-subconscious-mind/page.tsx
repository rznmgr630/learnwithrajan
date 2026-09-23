import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "The Power of Your Subconscious Mind | Learn with Rajan" };

export default function PowerOfYourSubconsciousMindPage() {
  return <LibraryBookReader title="The Power of Your Subconscious Mind" pdfUrl="/api/library/power-of-your-subconscious-mind" />;
}
