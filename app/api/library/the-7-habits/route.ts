const fileId = "13q83uOL6_F8-fv4X3rq1ZLOGKgPFopbc";

export async function GET() {
  const source = await fetch(
    `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`,
    { next: { revalidate: 3600 } },
  );

  if (!source.ok || !source.body) {
    return new Response("The book is unavailable right now.", { status: 502 });
  }

  return new Response(source.body, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Disposition": 'inline; filename="the-7-habits.pdf"',
      "Content-Type": "application/pdf",
    },
  });
}
