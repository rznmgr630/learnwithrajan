import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_1_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Next.js 15 is the React framework from Vercel for production web apps: file-system routing in the `app` directory, React Server Components by default, built-in bundling (Turbopack in dev), and opinions that reduce glue code. Official docs: nextjs.org/docs.",
      np: "Next.js 15 ले React मा routing, build, र उत्पादन तयारी एकीकृत गर्छ।",
      jp: "Next.js 15 は本番向けの React フレームワークです。公式は nextjs.org/docs を参照。",
    },
    {
      en: "You still author UI with React components; Next adds routing, data-fetching patterns, metadata for SEO, image/font optimizations, and a single toolchain without wiring Webpack manually.",
      np: "UI React मा; Next ले routing, SEO metadata, अनुकूलन थप्छ।",
      jp: "UI は React。Next がルーティング・メタデータ・最適化などを提供します。",
    },
  ],
  sections: [
    {
      title: {
        en: "Why Next.js (high level)",
        np: "किन Next.js",
        jp: "Next.js を選ぶ理由",
      },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "File-system routing and nested layouts in the App Router.",
              np: "App Router मा फाइल-आधारित रूट र लेआउट।",
              jp: "App Router のファイルベースルートとレイアウト。",
            },
            {
              en: "APIs adjacent to UI via Route Handlers (`route.ts`).",
              np: "`route.ts` मार्फत Route Handler।",
              jp: "`route.ts` による Route Handler。",
            },
            {
              en: "Server and Client components, streaming, and caching controls tied to `fetch` and segment config.",
              np: "Server/Client, streaming, `fetch` र cache नियन्त्रण।",
              jp: "Server/Client・ストリーミング・fetch とキャッシュ設定。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Do I install React separately?",
        np: "React अलग स्थापना?",
        jp: "React は別途インストール？",
      },
      answer: {
        en: "The `next` package depends on `react` and `react-dom`; a new app scaffold includes compatible versions. Upgrade Next and React together using the release notes when bumping major versions.",
        np: "`next` ले react समावेश गर्छ; मेजर अपग्रेडमा सँगै अपडेट गर्नुहोस्।",
        jp: "`next` が react に依存します。メジャーアップ時はリリースノートに従い React と揃えます。",
      },
    },
  ],
};
