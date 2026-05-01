import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_2_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "The App Router maps folders under `app/` to URL segments. A `page.tsx` (or `page.js`) file makes a route publicly addressable. `layout.tsx` wraps nested segments.",
      np: "`app/` भित्र फोल्डर URL खण्ड हो; `page.tsx` ले रूट सार्वजनिक बनाउँछ।",
      jp: "`app/` 以下のフォルダが URL。公開ルートは `page.tsx` が必要です。",
    },
  ],
  sections: [
    {
      title: { en: "Route patterns", np: "रूट ढाँचा", jp: "ルートパターン" },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Static segment: `app/about/page.tsx` → `/about`.",
              np: "`app/about/page.tsx` → `/about`।",
              jp: "`app/about/page.tsx` → `/about`。",
            },
            {
              en: "Nested: `app/blog/first/page.tsx` → `/blog/first`.",
              np: "निष्ठ रूट: `blog/first`।",
              jp: "ネスト: `/blog/first`。",
            },
            {
              en: "Dynamic: `app/blog/[id]/page.tsx` → `/blog/1`, `/blog/2`, …",
              np: "गतिशील: `[id]` खण्ड।",
              jp: "動的: `[id]` セグメント。",
            },
            {
              en: "Nested dynamics: e.g. `app/blog/[postId]/review/[reviewId]/page.tsx`.",
              np: "दोहोरो गतिशील खण्ड सम्भव।",
              jp: "動的セグメントの入れ子。",
            },
            {
              en: "Catch-all: `app/docs/[...slug]/page.tsx` matches `/docs/a/b/c`. Optional catch-all `[[...slug]]` also matches the base path without extra segments when needed.",
              np: "`[...slug]` सबै खण्ड; `[[...slug]]` वैकल्पिक आधार पथ।",
              jp: "`[...slug]` はキャッチオール。`[[...slug]]` はベースパスも含めて任意。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "not-found", np: "not-found", jp: "not-found" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Add `app/not-found.tsx` for a global 404 UI, or colocate `not-found.tsx` under a segment for localized missing routes. Call `notFound()` from Server Components or Route Handlers to trigger it.",
            np: "`not-found.tsx` वा `notFound()` प्रयोग।",
            jp: "`app/not-found.tsx` やセグメント単位の `not-found.tsx`、`notFound()` で表示。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Where is the home page file?",
        np: "गृह पृष्ठ कहाँ?",
        jp: "トップページのファイルは？",
      },
      answer: {
        en: "`app/page.tsx` is the `/` route. The `app` directory replaces the older `pages` directory for new App Router projects; you can migrate gradually if maintaining legacy routes.",
        np: "`app/page.tsx` भनेको `/`। पुरानो `pages` संगै हुन सक्छ योजना अनुसार।",
        jp: "`app/page.tsx` が `/`。従来の `pages` ルーターとは併用・移行の計画が公式にあります。",
      },
    },
  ],
};
