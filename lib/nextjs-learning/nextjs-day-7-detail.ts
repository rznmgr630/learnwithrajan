import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_7_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "`error.tsx` must be a Client Component. It catches runtime errors in its segment’s subtree (below the layout boundary). Export `reset` to retry rendering after fixing transient failures.",
      np: "`error.tsx` Client हुनुपर्छ; खण्डको त्रुटि समात्छ।",
      jp: "`error.tsx` は Client。セグメント以下のランタイムエラーを捕捉します。",
    },
  ],
  sections: [
    {
      title: { en: "Boundary nesting", np: "boundary निभाना", jp: "境界の入れ子" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Rough mental model: Layout wraps long-lived shell; errors inside layout body are caught by nested `error.tsx`, not by a sibling layout error file at the same depth as the layout root—consult the official error boundary diagram for App Router.",
            np: "गहिरो `error.tsx` ले सन्तान खण्ड समात्छ — डायग्राम हेर्नुहोस्।",
            jp: "公式の境界図を参照。レイアウト直下のエラー取り扱いはルールがあります。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Will error.tsx catch errors in layout.tsx?",
        np: "layout को त्रुटि?",
        jp: "layout のエラーは拾える？",
      },
      answer: {
        en: "Errors thrown while rendering a layout are handled by an error boundary above or at the layout’s parent—same-folder `error.tsx` sits below the layout in the tree. Use nested layouts/errors strategically.",
        np: "layout render त्रुटि माथिको boundary ले — फाइल स्थान महत्वपूर्ण।",
        jp: "レイアウト自体のエラーは別境界。公式のツリー説明に従って配置します。",
      },
    },
  ],
};
