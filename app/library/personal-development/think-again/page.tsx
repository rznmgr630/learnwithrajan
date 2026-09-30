import { LibraryBookReader } from "@/components/library/FinanceBookReader";
export const metadata = { title: "Think Again | Learn with Rajan" };
export default function ThinkAgainPage() { return <LibraryBookReader title="Think Again" pdfUrl="/api/library/think-again" />; }
