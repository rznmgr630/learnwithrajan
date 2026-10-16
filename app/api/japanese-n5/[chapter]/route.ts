import { getN5ChapterNote } from "@/lib/japanese-learning/n5/chapter-notes";

export async function GET(_request: Request, { params }: RouteContext<"/api/japanese-n5/[chapter]">) {
  const { chapter: slug } = await params;
  const note = getN5ChapterNote(slug);

  if (!note) {
    return new Response("Notes not found.", { status: 404 });
  }

  const source = await fetch(
    `https://drive.usercontent.google.com/download?id=${note.fileId}&export=download&confirm=t`,
    { next: { revalidate: 3600 } },
  );

  if (!source.ok || !source.body) {
    return new Response(`Chapter ${note.chapter} notes are unavailable right now.`, { status: 502 });
  }

  return new Response(source.body, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Disposition": `inline; filename="minna-no-nihongo-chapter-${note.chapter}-notes.pdf"`,
      "Content-Type": "application/pdf",
    },
  });
}
