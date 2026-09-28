import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "A Random Walk Down Wall Street | Learn with Rajan" };

export default function RandomWalkDownWallStreetPage() {
  return <LibraryBookReader title="A Random Walk Down Wall Street" pdfUrl="/api/library/a-random-walk-down-wall-street" />;
}
