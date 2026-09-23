import { NextRequest } from "next/server";

interface DictionaryEntry {
  meanings?: Array<{
    definitions?: Array<{ definition?: string }>;
  }>;
}

interface TranslationResponse {
  responseData?: { translatedText?: string };
}

interface DatamuseEntry {
  defs?: string[];
}

export async function GET(request: NextRequest) {
  const word = request.nextUrl.searchParams.get("word")?.trim().toLowerCase() ?? "";

  if (!/^[a-z]+(?:['-][a-z]+)?$/.test(word)) {
    return Response.json({ error: "Select one English word." }, { status: 400 });
  }

  const [dictionaryResult, fallbackDictionaryResult, translationResult] = await Promise.allSettled([
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(8000) }),
    fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&md=d`, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(8000) }),
    fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en%7Cne`, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(8000) }),
  ]);

  const primaryDefinition = dictionaryResult.status === "fulfilled" && dictionaryResult.value.ok
    ? ((await dictionaryResult.value.json()) as DictionaryEntry[])[0]?.meanings?.[0]?.definitions?.[0]?.definition ?? null
    : null;
  const fallbackDefinition = fallbackDictionaryResult.status === "fulfilled" && fallbackDictionaryResult.value.ok
    ? ((await fallbackDictionaryResult.value.json()) as DatamuseEntry[])[0]?.defs?.[0]?.replace(/^[^\t]+\t/, "") ?? null
    : null;
  const definition = primaryDefinition ?? fallbackDefinition;
  const translation = translationResult.status === "fulfilled" && translationResult.value.ok
    ? ((await translationResult.value.json()) as TranslationResponse).responseData?.translatedText ?? null
    : null;

  if (!definition && !translation) {
    return Response.json({ error: "Meaning is unavailable right now." }, { status: 502 });
  }

  return Response.json(
    { definition, translation },
    { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } },
  );
}
