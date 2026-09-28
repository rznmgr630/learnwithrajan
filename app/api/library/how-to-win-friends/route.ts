const fileId = "1nPciznsYj1ShREYrE4KOD5_zs0gv7dT1";

export async function GET() {
  const source = await fetch(`https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`, { next: { revalidate: 3600 } });
  if (!source.ok || !source.body) return new Response("The book is unavailable right now.", { status: 502 });
  return new Response(source.body, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400", "Content-Disposition": 'inline; filename="how-to-win-friends.pdf"', "Content-Type": "application/pdf" } });
}
