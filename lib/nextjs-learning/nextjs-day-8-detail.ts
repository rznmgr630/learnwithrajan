import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_8_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Parallel routes let multiple pages render in one layout via named slots—folders like `@analytics` and `@team`. The parent `layout.tsx` receives each slot as a prop matching the folder name.",
      np: "`@slot` फोल्डर ले एक लेआउटमा धेरै पृष्ठ।",
      jp: "`@名前` スロットで同一レイアウトに複数ページを並列表示。",
    },
  ],
  sections: [
    {
      title: { en: "Benefits", np: "फाइदा", jp: "利点" },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Independent loading and error boundaries per slot.",
              np: "प्रत्येक slot को आफ्नै loading/error।",
              jp: "スロットごとに loading/error を分離。",
            },
            {
              en: "Great when dashboard panels load at different speeds.",
              np: "फरक गति भएको ड्यासबोर्ड प्यानल।",
              jp: "読み込み速度が違うダッシュボード向け。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Do parallel routes change the URL?",
        np: "URL बदलिन्छ?",
        jp: "URL は変わる？",
      },
      answer: {
        en: "Slots compose UI within the active route; URLs still follow `page.tsx` segments. Advanced patterns like intercepting routes (`(.)`) combine with parallel routes for modals—see official intercepting routes docs.",
        np: "URL मुख्य `page` अनुसार; intercepting रoutes उन्नत।",
        jp: "URL は通常のセグメント。インターセプトと組み合わせる上級パターンあり。",
      },
    },
  ],
};
