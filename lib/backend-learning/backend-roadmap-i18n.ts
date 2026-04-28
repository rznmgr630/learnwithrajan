import type { LocalizedString } from "@/lib/i18n/types";

/** Tag pill labels (slug stays ASCII for styling keys). */
export const BACKEND_TAG: Record<string, LocalizedString> = {
  networking: {
    en: "networking",
    np: "नेटवर्किङ",
    jp: "ネットワーキング",
  },
  theory: { en: "theory", np: "सिद्धान्त", jp: "理論" },
  runtime: { en: "runtime", np: "रनटाइम", jp: "ランタイム" },
  core: { en: "core", np: "कोर", jp: "コア" },
  database: { en: "database", np: "डेटाबेस", jp: "データベース" },
  sql: { en: "sql", np: "SQL", jp: "SQL" },
  design: { en: "design", np: "डिजाइन", jp: "設計" },
  api: { en: "api", np: "API", jp: "API" },
  security: { en: "security", np: "सुरक्षा", jp: "セキュリティ" },
  auth: { en: "auth", np: "प्रमाणीकरण", jp: "認証" },
  performance: { en: "performance", np: "प्रदर्शन", jp: "パフォーマンス" },
  cache: { en: "cache", np: "क्यास", jp: "キャッシュ" },
  reliability: { en: "reliability", np: "विश्वसनीयता", jp: "信頼性" },
  ops: { en: "ops", np: "अपरेसन", jp: "運用" },
  architecture: { en: "architecture", np: "आर्किटेक्चर", jp: "アーキテクチャ" },
  nosql: { en: "nosql", np: "NoSQL", jp: "NoSQL" },
  docker: { en: "docker", np: "Docker", jp: "Docker" },
  cicd: { en: "cicd", np: "CI/CD", jp: "CI/CD" },
  cloud: { en: "cloud", np: "क्लाउड", jp: "クラウド" },
  observability: { en: "observability", np: "अवलोकनक्षमता", jp: "オブザーバビリティ" },
};

const DAY: Record<number, LocalizedString> = {
  1: {
    en: "HTTP & REST deep dive",
    np: "HTTP र REST गहिराइ",
    jp: "HTTP と REST の深掘り",
  },
  2: {
    en: "Node.js / Go internals",
    np: "Node.js / Go आन्तरिक संरचना",
    jp: "Node.js / Go の内部",
  },
  3: {
    en: "Database fundamentals",
    np: "डेटाबेस आधारभूत",
    jp: "データベースの基礎",
  },
  4: {
    en: "API design patterns",
    np: "API डिजाइन ढाँचाहरू",
    jp: "API 設計パターン",
  },
  5: {
    en: "Authentication & authorisation",
    np: "प्रमाणीकरण र अधिकार",
    jp: "認証と認可",
  },
  6: {
    en: "Caching strategies",
    np: "क्यासिङ रणनीतिहरू",
    jp: "キャッシュ戦略",
  },
  7: {
    en: "Error handling & logging",
    np: "त्रुटि प्रबन्धन र लगिङ",
    jp: "エラー処理とログ",
  },
  8: {
    en: "Load balancers & reverse proxies",
    np: "लोड ब्यालेन्सर र रिभर्स प्रोक्सी",
    jp: "ロードバランサとリバースプロキシ",
  },
  9: {
    en: "Relational modeling & migrations",
    np: "सम्बन्धात्मक मोडेलिङ र माइग्रेसन",
    jp: "リレーショナルモデルとマイグレーション",
  },
  10: {
    en: "Transactions & isolation levels",
    np: "लेनदेन र आइसोलेसन स्तर",
    jp: "トランザクションと分離レベル",
  },
  11: {
    en: "NoSQL shapes & consistency",
    np: "NoSQL आकार र सुसङ्गति",
    jp: "NoSQL の形と整合性",
  },
  12: {
    en: "Read replicas & CQRS sketch",
    np: "पढाइ प्रतिलिपि र CQRS रूपरेखा",
    jp: "読み取りレプリカと CQRS の概要",
  },
  13: {
    en: "Search & indexing basics",
    np: "खोज र इन्डेक्सिङ आधारभूत",
    jp: "検索とインデックスの基礎",
  },
  14: {
    en: "Backpressure & queues intro",
    np: "ब्याकप्रेसर र लाम परिचय",
    jp: "バックプレッシャとキュー入門",
  },
  15: {
    en: "Linux, processes & systemd",
    np: "Linux, प्रक्रिया र systemd",
    jp: "Linux・プロセス・systemd",
  },
  16: {
    en: "Containers & images",
    np: "कन्टेनर र इमेज",
    jp: "コンテナとイメージ",
  },
  17: {
    en: "CI pipelines & tests in deploy",
    np: "CI पाइपलाइन र डिप्लोयमा परीक्षण",
    jp: "CI パイプラインとデプロイ時のテスト",
  },
  18: {
    en: "IaC & environments",
    np: "IaC र वातावरण",
    jp: "IaC と環境",
  },
  19: {
    en: "Kubernetes mental model",
    np: "Kubernetes मानसिक नमूना",
    jp: "Kubernetes の考え方",
  },
  20: {
    en: "Secrets, config & key rotation",
    np: "गोप्य सामग्री, कन्फिग र कुञ्जी घुमाइ",
    jp: "シークレット・設定・鍵ローテーション",
  },
  21: {
    en: "Deploy strategies & rollbacks",
    np: "डिप्लोय रणनीति र रोलब्याक",
    jp: "デプロイ戦略とロールバック",
  },
  22: {
    en: "Structured logging & correlation IDs",
    np: "संरचित लगिङ र सहसम्बन्ध ID",
    jp: "構造化ログと相関 ID",
  },
  23: {
    en: "Metrics, RED/USE & dashboards",
    np: "मेट्रिक्स, RED/USE र ड्यासबोर्ड",
    jp: "メトリクス・RED/USE・ダッシュボード",
  },
  24: {
    en: "Distributed tracing",
    np: "वितरित ट्रेसिङ",
    jp: "分散トレーシング",
  },
  25: {
    en: "Threat modeling for APIs",
    np: "API का लागि खतरा मोडेलिङ",
    jp: "API の脅威モデリング",
  },
  26: {
    en: "AuthZ patterns & rate limits",
    np: "अधिकरण ढाँचा र दर सीमा",
    jp: "認可パターンとレート制限",
  },
  27: {
    en: "Load testing & capacity",
    np: "लोड परीक्षण र क्षमता",
    jp: "負荷試験とキャパシティ",
  },
  28: {
    en: "SLOs, error budgets & incidents",
    np: "SLO, त्रुटि बजेट र घटनाहरू",
    jp: "SLO・エラーバジェット・インシデント",
  },
  29: {
    en: "Ship a service end-to-end",
    np: "सेवा अन्त्यदेखि अन्त्यसम्म डिप्लोय",
    jp: "サービスを E2E でリリース",
  },
  30: {
    en: "ADRs, docs & portfolio story",
    np: "ADR, कागजात र पोर्टफोलियो कथा",
    jp: "ADR・ドキュメント・ポートフォリオ",
  },
};

const WEEK: Record<string, LocalizedString> = {
  w1: {
    en: "Week 1: Core foundations",
    np: "हप्ता १: मुख्य आधार",
    jp: "第1週：コアの基礎",
  },
  w2: {
    en: "Week 2: System design & databases",
    np: "हप्ता २: प्रणाली डिजाइन र डेटाबेस",
    jp: "第2週：システム設計とデータベース",
  },
  w3: {
    en: "Week 3: DevOps, CI/CD & cloud",
    np: "हप्ता ३: DevOps, CI/CD र क्लाउड",
    jp: "第3週：DevOps・CI/CD・クラウド",
  },
  w4: {
    en: "Week 4: Observability, security & scale",
    np: "हप्ता ४: अवलोकन, सुरक्षा र स्केल",
    jp: "第4週：オブザーバビリティ・セキュリティ・規模",
  },
  capstone: {
    en: "Days 29-30: Capstone & portfolio",
    np: "दिन २९–३०: क्यापस्टोन र पोर्टफोलियो",
    jp: "29–30日目：キャップストーンとポートフォリオ",
  },
};

export function backendWeekTitle(weekId: string): LocalizedString {
  return WEEK[weekId] ?? { en: weekId, np: weekId, jp: weekId };
}

/** Two tag pills for a day card (slugs must exist in {@link BACKEND_TAG}). */
export function backendTags(slugs: [string, string]): { label: LocalizedString; slug: string }[] {
  const pill = (slug: string) => ({
    label: BACKEND_TAG[slug] ?? { en: slug, np: slug, jp: slug },
    slug,
  });
  return [pill(slugs[0]), pill(slugs[1])];
}

export function backendDayTitle(dayNumber: number): LocalizedString {
  return (
    DAY[dayNumber] ?? {
      en: `Day ${dayNumber}`,
      np: `दिन ${dayNumber}`,
      jp: `${dayNumber}日目`,
    }
  );
}
