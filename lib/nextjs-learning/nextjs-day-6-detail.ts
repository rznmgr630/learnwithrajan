import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_6_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "`loading.tsx` provides an instant fallback UI for a segment while React Suspense boundaries resolve. Next wraps it in Suspense automatically for that route segment.",
      np: "`loading.tsx` ले खण्डको लागि तुरुन्त fallback।",
      jp: "`loading.tsx` がセグメントの即時フォールバックを提供します。",
    },
    {
      en: "Streaming sends HTML in chunks so users see shell and critical content sooner (better TTFB/FCP). Combine with `<Suspense fallback={...}>` around slow async Server Components.",
      np: "Streaming र Suspense ले ढिलो डाटा छुट्टै देखाउँछ।",
      jp: "ストリーミングと Suspense で遅い部分を段階表示。",
    },
  ],
  sections: [
    {
      title: { en: "Suspense with React.lazy (client)", np: "Suspense", jp: "Suspense（クライアント）" },
      blocks: [
        {
          type: "code",
          title: { en: "Classic client split", np: "Client विभाजन", jp: "クライアント分割の例" },
          code: `import React, { Suspense } from "react";

const Heavy = React.lazy(() => import("./Heavy"));

export default function Page() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Heavy />
    </Suspense>
  );
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Does loading.tsx run on every child navigation?",
        np: "loading हरेक नेभिगेशन?",
        jp: "loading は子のたびに？",
      },
      answer: {
        en: "It applies to the segment that owns the `loading.tsx` file and nested boundaries—behavior follows Suspense rules and concurrent rendering; shared layouts above may not remount.",
        np: "यो खण्डको लागि fallback; माथिको लेआउट स्थिर हुन सक्छ।",
        jp: "そのセグメント境界に紐づきます。上位レイアウトは再マウントしないことがあります。",
      },
    },
  ],
};
