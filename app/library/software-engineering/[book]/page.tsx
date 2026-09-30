import { notFound } from "next/navigation";
import { LibraryBookReader } from "@/components/library/FinanceBookReader";
import { getSoftwareEngineeringBook } from "@/lib/library/software-engineering-books";

export default async function SoftwareEngineeringBookPage({ params }: { params: Promise<{ book: string }> }) {
  const { book: slug } = await params;
  const book = getSoftwareEngineeringBook(slug);
  if (!book) notFound();

  return <LibraryBookReader title={book.title} pdfUrl={`/api/library/software-engineering/${book.slug}`} />;
}
