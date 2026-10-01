const fileId = "1GkNAJEf0DjRuiQZMBP95eqj0pfTk8qTk";

export async function GET(request: Request) {
  const range = request.headers.get("range");
  const source = await fetch(`https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`, {
    headers: range ? { Range: range } : undefined,
    cache: "no-store",
  });
  if (!source.ok || !source.body) return new Response("The book is unavailable right now.", { status: 502 });

  return new Response(source.body, {
    status: source.status,
    headers: {
      "Accept-Ranges": "bytes",
      "Content-Disposition": 'inline; filename="frankenstein.pdf"',
      "Content-Type": "application/pdf",
      ...(source.headers.get("content-length") ? { "Content-Length": source.headers.get("content-length")! } : {}),
      ...(source.headers.get("content-range") ? { "Content-Range": source.headers.get("content-range")! } : {}),
    },
  });
}
