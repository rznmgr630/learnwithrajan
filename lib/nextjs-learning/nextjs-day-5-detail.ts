import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_5_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "`next/link` wraps navigation with prefetch (default on for static routes in production), client-side transitions, and accessible anchors. Props include `href`, `replace`, `scroll`, and `prefetch`.",
      np: "`next/link` ले prefetch र client-side नेभिगेशन।",
      jp: "`next/link` がプリフェッチとクライアント遷移を担当。",
    },
    {
      en: "`template.tsx` is like `layout.tsx` but remounts children on navigation—useful when you need fresh local state per route without sharing layout persistence.",
      np: "`template` ले बच्चा हरेक नेभिगेशनमा पुन: माउन्ट गर्छ।",
      jp: "`template.tsx` は遷移ごとに子を再マウントします。",
    },
  ],
  sections: [
    {
      title: { en: "Programmatic navigation", np: "प्रोग्रामेटिक", jp: "プログラムで遷移" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "In Client Components use `useRouter()` from `next/navigation` (`push`, `replace`, `refresh`). For Server Actions or handlers use `redirect()` from `next/navigation`.",
            np: "Client: `useRouter`; Server: `redirect()`।",
            jp: "クライアントは `next/navigation` の `useRouter`。サーバーは `redirect()`。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When prefer Link vs router.push?",
        np: "Link बनाम push?",
        jp: "Link と router.push の使い分けは？",
      },
      answer: {
        en: "Prefer `<Link>` for declarative navigation and prefetch benefits. Use `router.push` for imperative flows after form success, guards, or timers.",
        np: "सामान्य लिंकको लागि `<Link>`; फर्म पछि आदि मा `push`।",
        jp: "通常は `<Link>`。フォーム成功後など命令的なら `push`。",
      },
    },
  ],
};
