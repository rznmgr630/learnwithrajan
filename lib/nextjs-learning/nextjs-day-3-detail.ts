import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_3_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Folders prefixed with an underscore (e.g. `_components`, `_lib`) are private: they do not create URL segments. Use them for colocated helpers, tests, or styles that should not become routes.",
      np: "`_` ले सुरु हुने फोल्डर रूट बन्दैन — आन्तरिक कोडको लागि।",
      jp: "`_` で始まるフォルダはルートにならないプライベート領域です。",
    },
    {
      en: "Parentheses define route groups: `(marketing)` and `(shop)` organize files and layouts without adding a path segment—URLs stay `/pricing` not `/marketing/pricing`.",
      np: "`(group)` ले URL मा खण्ड थप्दैन, लेआउट मात्र समूहबद्ध गर्छ।",
      jp: "`(name)` は URL に出さずフォルダ整理とレイアウト共有に使います。",
    },
  ],
  sections: [
    {
      title: { en: "Why private folders", np: "निजी फोल्डर किन", jp: "プライベートフォルダの目的" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Keeps server-only utilities, database clients, or sensitive config adjacent to features without exposing new URLs. Still treat secrets via env vars—privacy is about routing structure, not automatic security.",
            np: "रूट बाहिर नआउने आन्तरिक कोड राख्न। गोप्यता अझै env मा।",
            jp: "ルートを増やさずにサーバー用コードを並べます。秘密情報は環境変数で。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Can I import from `_lib` in Client Components?",
        np: "Client मा `_lib` import?",
        jp: "Client から `_lib` を import？",
      },
      answer: {
        en: "Imports work if the module is valid for the client bundle. Do not import server-only modules into client components—use `server-only` package or split files so secrets stay on the server.",
        np: "सर्वर मात्र मोड्युल client मा नल्याउनुहोस् — `server-only` प्रयोग।",
        jp: "クライアントにサーバー専用モジュールを import しない。`server-only` で境界を固定。",
      },
    },
  ],
};
