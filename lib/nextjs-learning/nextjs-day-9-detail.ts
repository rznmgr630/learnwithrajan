import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_9_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "`route.ts` (Route Handlers) implement REST endpoints with Web standard `Request`/`Response`. They run on the server—good for secrets and database access without exposing keys to the browser.",
      np: "`route.ts` ले GET/POST आदि REST endpoint।",
      jp: "`route.ts` で Route Handler（サーバー上の HTTP API）。",
    },
  ],
  sections: [
    {
      title: { en: "GET handler sketch", np: "GET उदाहरण", jp: "GET の例" },
      blocks: [
        {
          type: "code",
          code: `import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("search");
  return Response.json({ ok: true, q });
}`,
        },
      ],
    },
    {
      title: { en: "Cookies & headers (Next.js 15)", np: "Cookie र header", jp: "Cookie とヘッダ" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "In Route Handlers read cookies via `request.cookies` or the async `cookies()` helper from `next/headers`. Set-Cookie can be attached on `Response` headers. Many `next/headers` APIs are async in Next 15—await them.",
            np: "Next 15 मा `cookies()` आदि अप्रत्यक्ष async हुन सक्छ।",
            jp: "Next.js 15 では `cookies()` などが async の場合があります。await を確認。",
          },
        },
      ],
    },
    {
      title: { en: "Caching GET Route Handlers", np: "GET cache", jp: "GET のキャッシュ" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "GET handlers using static caching behavior can be opted out with `export const dynamic = 'force-dynamic'` or per-request options on `Response`. Align with docs for Data Cache vs Full Route Cache distinctions.",
            np: "`dynamic = 'force-dynamic'` ले गतिशील बाध्यता।",
            jp: "`export const dynamic = 'force-dynamic'` で静的キャッシュを無効化できることがあります。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Route Handler vs Server Action?",
        np: "Handler बनाम Server Action?",
        jp: "Route Handler と Server Action の違いは？",
      },
      answer: {
        en: "Handlers are explicit HTTP endpoints—great for webhooks, REST, or non-React clients. Server Actions are RPC-style mutations tied to forms and progressive enhancement.",
        np: "Handler HTTP endpoint; Server Action फर्म/RPC शैली।",
        jp: "Handler は明示的 HTTP。Server Action はフォーム連携のミューテーション向け。",
      },
    },
  ],
};
