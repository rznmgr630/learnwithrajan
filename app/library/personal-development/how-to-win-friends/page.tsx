import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "How to Win Friends and Influence People | Learn with Rajan" };

export default function HowToWinFriendsPage() {
  return <LibraryBookReader title="How to Win Friends and Influence People" pdfUrl="/api/library/how-to-win-friends" />;
}
