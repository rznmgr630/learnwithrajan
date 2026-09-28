import { LibraryBookReader } from "@/components/library/FinanceBookReader";

export const metadata = { title: "Animal Farm | Learn with Rajan" };

export default function AnimalFarmPage() {
  return <LibraryBookReader title="Animal Farm" pdfUrl="/api/library/animal-farm" />;
}
