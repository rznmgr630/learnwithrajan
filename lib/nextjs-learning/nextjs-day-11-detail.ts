import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_11_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Ship with **Vercel** (or any Node host): connect your Git repo, map branches to environments (`production` ← `main`, **preview** ← PRs), and let the platform build `next build` on every push. Environment variables live per environment—never commit secrets.",
      np: "Vercel: Git जोड्नुहोस्, ब्रान्च→वातावरण, `next build` CI मा। गोप्य `.env` मा मात्र।",
      jp: "Vercel などで Git を連携し、`main`→本番・PR→プレビューとして `next build` を自動化します。秘密情報は環境変数のみ。",
    },
    {
      en: "**Preview deployments** give stakeholders a URL per PR so you catch routing, auth, and asset issues before merge. Use **Production** protection (branch rules, required checks) so broken builds never reach users.",
      np: "PR प्रति URL — मर्ज अघि परीक्षण। उत्पादनमा ब्रानch संरक्षण।",
      jp: "プレビューURLでマージ前に確認。本番ブランチはチェックと保護で守ります。",
    },
  ],
  sections: [
    {
      title: { en: "Deploy checklist", np: "तैनाती सूची", jp: "デプロイ確認" },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "`NODE_ENV=production` build passes locally; fix TypeScript and ESLint in CI.",
              np: "स्थानीय `production` बिल्ड र CI लिन्ट।",
              jp: "ローカルで本番ビルドが通ること、CI で型・Lint を締めること。",
            },
            {
              en: "Set **DATABASE_URL**, auth secrets, and API keys in the dashboard—not in the repo.",
              np: "DB र API गोप्य ड्यासबोर्डमा।",
              jp: "DB URL・認証シークレットはダッシュボードの環境変数へ。",
            },
            {
              en: "Configure **headers**, **redirects**, and **images.remotePatterns** in `next.config` for your domains.",
              np: "`next.config` मा हेडर/रिडाइरेक्ट/छवि डोमेन।",
              jp: "`next.config` で headers / redirects / `images.remotePatterns` を本番ドメインに合わせる。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Observability", np: "निगरानी", jp: "運用監視" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "After deploy, watch **Core Web Vitals**, server logs, and error tracking (e.g. Sentry). Roll back via instant previous deployment or fix-forward with a hot PR—preview URLs let you verify the patch before promoting.",
            np: "Core Web Vitals र लग तपाईंको स्ट्याकमा। रोलब्याक वा छिटो PR।",
            jp: "公開後は CWV・ログ・エラー監視を。即時ロールバックか修正 PR をプレビューで確認してから本番へ。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why does my API route work locally but fail in production?",
        np: "स्थानीयमा चल्छ, उत्पादनमा किन?",
        jp: "ローカルでは動くのに本番だけ失敗するのは？",
      },
      answer: {
        en: "Usually **environment variables**, **Edge vs Node runtime**, or **database firewall / IP allowlist** differences. Compare `vercel env pull` with local `.env` and confirm the deployment region can reach your DB.",
        np: "ENV, Edge/Node, DB फायरवाल — `vercel env pull` ले तुलना गर्नुहोस्।",
        jp: "環境変数・ランタイム・DB の許可IPなどが典型。`vercel env pull` でローカルと差分を確認してください。",
      },
    },
  ],
};
