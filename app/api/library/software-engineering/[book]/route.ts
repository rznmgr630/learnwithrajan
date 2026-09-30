import { getSoftwareEngineeringBook } from "@/lib/library/software-engineering-books";

export async function GET(_: Request, { params }: { params: Promise<{ book: string }> }) {
  const { book: slug } = await params;
  const book = getSoftwareEngineeringBook(slug);
  if (!book) return new Response("Book not found.", { status: 404 });

  const source = await fetch(`https://drive.usercontent.google.com/download?id=${book.fileId}&export=download&confirm=t`, { next: { revalidate: 3600 } });
  if (!source.ok || !source.body) return new Response("The book is unavailable right now.", { status: 502 });

  return new Response(source.body, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Disposition": `inline; filename="${book.slug}.pdf"`,
      "Content-Type": "application/pdf",
    },
  });
}
