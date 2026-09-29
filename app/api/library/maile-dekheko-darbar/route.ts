const fileId = "1jb70J0TA8zG5NMfuEgDyjLsDAf0AUibx";

export async function GET() {
  const source = await fetch(`https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`, { next: { revalidate: 3600 } });
  if (!source.ok || !source.body) return new Response("The book is unavailable right now.", { status: 502 });
  return new Response(source.body, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400", "Content-Disposition": 'inline; filename="maile-dekheko-darbar.pdf"', "Content-Type": "application/pdf" } });
}
