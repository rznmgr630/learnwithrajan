import { notFound } from "next/navigation";
import { LibraryBookReader } from "@/components/library/FinanceBookReader";
import { getFictionBook } from "@/lib/library/fiction-books";

export default async function FictionBookPage({ params }: { params: Promise<{ book: string }> }) {
  const { book: slug } = await params;
  const book = getFictionBook(slug);
  if (!book) notFound();

  return <LibraryBookReader title={book.title} pdfUrl={`/api/library/fiction/${book.slug}`} />;
}
