import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_4_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "`layout.tsx` wraps child segments and persists across navigations (unlike templates). Root `app/layout.tsx` must include `<html>` and `<body>` (or use metadata APIs appropriately for streaming).",
      np: "`layout.tsx` ले सन्तान खण्ड बेर्छ; जरा `app/layout.tsx` अनिवार्य।",
      jp: "`layout.tsx` は子セグメントを包み、遷移間も維持。ルートは `html`/`body` を含めます。",
    },
  ],
  sections: [
    {
      title: { en: "Metadata API", np: "Metadata API", jp: "Metadata API" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Export `metadata` object or async `generateMetadata` from `layout.tsx` or `page.tsx` for titles, descriptions, Open Graph, robots, etc. Child pages override parent keys when they conflict; see Metadata resolution rules in the docs.",
            np: "`metadata` वा `generateMetadata` ले SEO क्षेत्र सेट गर्छ।",
            jp: "`metadata` と `generateMetadata` で title や OG を設定。競合時は子が優先されるルールがあります。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Title can be a string or `{ default, template, absolute }`—templates often use `%s` for segment titles.",
              np: "Title मा `template` ले `%s` प्रतिस्थापन।",
              jp: "title は文字列または default/template/absolute。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How do I read pathname inside a layout?",
        np: "लेआउटमा pathname?",
        jp: "レイアウトで pathname を知りたい",
      },
      answer: {
        en: "Layouts are Server Components by default and do not receive pathname props. Use a small Client Component with `usePathname()` from `next/navigation`, or pass segment params via `children` composition.",
        np: "`usePathname()` भएको सानो Client कम्पोनेन्ट प्रयोग।",
        jp: "デフォルトのレイアウトは Server。`usePathname()` をクライアントの小さなコンポーネントで。",
      },
    },
  ],
};
