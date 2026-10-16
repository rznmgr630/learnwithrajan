import { notFound } from "next/navigation";
import { LibraryBookReader } from "@/components/library/FinanceBookReader";
import { getN5ChapterNote } from "@/lib/japanese-learning/n5/chapter-notes";

export default async function ChapterNotesPage({ params }: PageProps<"/learn/japanese-n5/[chapter]">) {
  const { chapter: slug } = await params;
  const note = getN5ChapterNote(slug);

  if (!note) {
    notFound();
  }

  return (
    <LibraryBookReader
      title={`Minna no Nihongo · Chapter ${note.chapter} Notes`}
      pdfUrl={`/api/japanese-n5/${slug}`}
      backHref="/learn/japanese-n5"
      backLabel="← Minna no Nihongo N5"
    />
  );
}
