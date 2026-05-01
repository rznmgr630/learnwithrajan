import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_10_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "`middleware.ts` runs at the Edge before a request completes—rewrite, redirect, set cookies, or enforce auth at scale. Export a `middleware` function (not GET). Use `NextResponse.next()` to continue the chain.",
      np: "`middleware.ts` अनुरोध अघि चल्छ — redirect/cookie आदि।",
      jp: "`middleware.ts` はリクエスト完了前に実行。`NextResponse.next()` で継続。",
    },
  ],
  sections: [
    {
      title: { en: "Rendering model (short)", np: "रेंडरिङ", jp: "レンダリング" },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Server Components default: fetch on server, smaller client JS. Client Components opt in with `use client` for hooks and browser APIs.",
              np: "Server डिफल्ट; `use client` ले अन्तरक्रिया।",
              jp: "デフォルトは Server Component。`use client` でインタラクション。",
            },
            {
              en: "Pure CSR remains possible but hurts SEO and first paint if everything waits on the client.",
              np: "पूरा CSR ले SEO र पहिलो पेन्ट प्रभावित गर्न सक्छ।",
              jp: "全面 CSR は SEO と初回表示に不利になりがち。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Fetch caching (App Router)", np: "fetch cache", jp: "fetch のキャッシュ" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`fetch` in Server Components participates in Next’s caching story: use `{ cache: 'no-store' }` to skip cache, `{ next: { revalidate: n } }` for time-based revalidation, or segment options like `export const revalidate = 60`. Behavior interacts with dynamic APIs (`cookies()`, `headers()`, `searchParams`)—read the latest caching guide because defaults evolve per release.",
            np: "`no-store`, `revalidate`, र गतिशील API संग सम्बन्ध — नवीनतम डक हेर्नुहोस्।",
            jp: "`cache: 'no-store'`、`revalidate`、動的 API との相互作用はリリースごとに確認を。",
          },
        },
      ],
    },
    {
      title: { en: "Composition rules", np: "संरचना नियम", jp: "コンポジション" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Import `server-only` / `client-only` to enforce boundaries. Pass Server Components into Client Components via `children` props rather than importing servers inside clients directly.",
            np: "`server-only`; Client भित्र Server लाई `children` मार्फत।",
            jp: "`server-only` で境界を固定。Client に Server を直接 import せず children で渡す。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Where is middleware configured?",
        np: "middleware कहाँ?",
        jp: "middleware はどこに置く？",
      },
      answer: {
        en: "Place `middleware.ts` at the project root (or `src/` root). Use `matcher` config to limit which paths run middleware—avoid running on static assets.",
        np: "प्रोजेक्ट जरामा; `matcher` ले पथ सीमित गर्छ।",
        jp: "プロジェクト（または `src`）直下。`matcher` で静的ファイルを除外。",
      },
    },
  ],
};
