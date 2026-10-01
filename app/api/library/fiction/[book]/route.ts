import { getFictionBook } from "@/lib/library/fiction-books";

export async function GET(request: Request, { params }: { params: Promise<{ book: string }> }) {
  const { book: slug } = await params;
  const book = getFictionBook(slug);
  if (!book) return new Response("Book not found.", { status: 404 });

  const range = request.headers.get("range");
  const source = await fetch(`https://drive.usercontent.google.com/download?id=${book.fileId}&export=download&confirm=t`, {
    headers: range ? { Range: range } : undefined,
    cache: "no-store",
  });
  if (!source.ok || !source.body) return new Response("The book is unavailable right now.", { status: 502 });

  return new Response(source.body, {
    status: source.status,
    headers: {
      "Accept-Ranges": "bytes",
      "Content-Disposition": `inline; filename="${book.slug}.pdf"`,
      "Content-Type": "application/pdf",
      ...(source.headers.get("content-length") ? { "Content-Length": source.headers.get("content-length")! } : {}),
      ...(source.headers.get("content-range") ? { "Content-Range": source.headers.get("content-range")! } : {}),
    },
  });
}
