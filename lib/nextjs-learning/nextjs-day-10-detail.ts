import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_10_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 10 covers two Mosh course sections: **Sending Emails** with `react-email` + Resend, and **Optimizations** (images, fonts, scripts, SEO metadata, and lazy loading). These are the final polish steps before shipping a Next.js app to production.",
      np: "Day 10 मा दुई section छन्: **Email** (`react-email` + Resend) र **Optimizations** (image, font, script, SEO, lazy loading)।",
      jp: "Day 10 は2つのセクションです: `react-email` + Resend による**メール送信**と、画像・フォント・スクリプト・SEO・遅延読み込みの**最適化**です。",
    },
  ],
  sections: [
    {
      title: {
        en: "React Email setup & templates",
        np: "React Email सेटअप र templates",
        jp: "React Email のセットアップとテンプレート",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`react-email` lets you write HTML emails as React components. The preview server (`npx email dev`) renders them live in the browser so you can iterate quickly. Resend is the recommended sending service — one API call dispatches the compiled HTML.",
            np: "`react-email` ले React component मा HTML email लेख्न दिन्छ। Preview server (`npx email dev`) ले browser मा live render देखाउँछ। Resend ले email पठाउँछ।",
            jp: "`react-email` で React コンポーネントとして HTML メールを書けます。プレビューサーバー（`npx email dev`）がブラウザ上でライブ表示します。送信には Resend を使います。",
          },
        },
        {
          type: "code",
          title: { en: "Install packages", np: "प्याकेज इन्स्टल", jp: "パッケージのインストール" },
          code: `npm install react-email @react-email/components resend`,
        },
        {
          type: "code",
          title: { en: "emails/WelcomeEmail.tsx — template", np: "Email template", jp: "メールテンプレート" },
          code: `import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Link,
  Button,
  Img,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
  verifyUrl: string;
}

export default function WelcomeEmail({ name, verifyUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f9fafb" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: "32px 16px" }}>
          <Heading style={{ color: "#111827" }}>Welcome, {name}!</Heading>
          <Text style={{ color: "#374151" }}>
            Thanks for signing up. Please verify your email address.
          </Text>
          <Button
            href={verifyUrl}
            style={{
              backgroundColor: "#4f46e5",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: 6,
              textDecoration: "none",
            }}
          >
            Verify Email
          </Button>
          <Text style={{ color: "#6b7280", fontSize: 12 }}>
            Or copy this link: <Link href={verifyUrl}>{verifyUrl}</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "Email clients support only **inline styles** — CSS classes and CSS-in-JS are stripped. Use the `Tailwind` component from `@react-email/tailwind` to write Tailwind utility classes that are automatically inlined at build time.",
            np: "Email client ले **inline styles** मात्र support गर्छ। `@react-email/tailwind` को `Tailwind` component ले Tailwind class लाई auto-inline गर्छ।",
            jp: "メールクライアントは**インラインスタイル**のみをサポートします。`@react-email/tailwind` の `Tailwind` コンポーネントを使うと、Tailwind のユーティリティクラスがビルド時に自動インライン化されます。",
          },
        },
        {
          type: "code",
          title: {
            en: "app/api/send-welcome/route.ts — Resend integration",
            np: "Resend ले email पठाउने",
            jp: "Resend でメール送信",
          },
          code: `import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import WelcomeEmail from "@/emails/WelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Welcome to Acme!",
    react: <WelcomeEmail name={name} verifyUrl="https://acme.com/verify" />,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ id: data?.id });
}`,
        },
      ],
    },
    {
      title: {
        en: "Image optimization with next/image",
        np: "next/image सँग image optimization",
        jp: "next/image による画像最適化",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The `<Image>` component from `next/image` automatically converts images to **WebP/AVIF**, serves the right size per viewport, lazy-loads by default (preventing layout shift with reserved space), and compresses on the fly. For local images, `width` + `height` are inferred from the import. For remote images, they must be explicit or you can use the `fill` prop inside a positioned container.",
            np: "`<Image>` component ले **WebP/AVIF** convert, viewport अनुसार size, default lazy-load, र layout shift रोक्छ। Local image मा size auto-infer हुन्छ; remote मा explicit width/height चाहिन्छ।",
            jp: "`<Image>` コンポーネントは自動的に **WebP/AVIF** に変換し、ビューポートに合わせたサイズを配信し、デフォルトで遅延読み込みしてレイアウトシフトを防ぎます。ローカル画像はインポートからサイズを推定します。リモート画像は明示的な width/height が必要か、配置済みコンテナ内で `fill` プロップを使います。",
          },
        },
        {
          type: "code",
          title: { en: "next/image usage examples", np: "next/image उदाहरण", jp: "next/image の使用例" },
          code: `import Image from "next/image";
import heroImg from "@/public/hero.jpg"; // local — size inferred

// Local image (size inferred from file)
<Image src={heroImg} alt="Hero image" priority />

// Remote image (must declare dimensions or use fill)
<Image
  src="https://res.cloudinary.com/demo/image/upload/sample.jpg"
  alt="Remote photo"
  width={800}
  height={600}
/>

// Fill a container — parent must have position: relative and defined size
<div style={{ position: "relative", width: "100%", height: 400 }}>
  <Image
    src="/background.jpg"
    alt="Background"
    fill
    style={{ objectFit: "cover" }}
  />
</div>`,
        },
        {
          type: "paragraph",
          text: {
            en: "The `priority` prop disables lazy loading and adds a `<link rel=preload>` — use it **only** on the above-the-fold LCP image to improve Largest Contentful Paint. Overusing `priority` defeats the purpose.",
            np: "`priority` prop ले lazy loading बन्द गरेर preload थप्छ — यो **केवल** above-the-fold LCP image मा प्रयोग गर्नुहोस्।",
            jp: "`priority` プロップは遅延読み込みを無効にして `<link rel=preload>` を追加します。LCP を改善するため、ファーストビューの LCP 画像**のみ**に使用してください。",
          },
        },
        {
          type: "code",
          title: {
            en: "next.config.ts — allow remote image domains",
            np: "Remote image domain config",
            jp: "リモート画像ドメインの設定",
          },
          code: `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;`,
        },
        {
          type: "diagram",
          id: "nextjs-image-optimization",
        },
      ],
    },
    {
      title: {
        en: "Fonts & third-party scripts",
        np: "Fonts र third-party scripts",
        jp: "フォントとサードパーティスクリプト",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`next/font/google` downloads the font at build time and self-hosts it — no runtime request to Google. This eliminates FOUT (flash of unstyled text) and avoids privacy leaks to third-party CDNs. `next/font/local` handles custom font files the same way.",
            np: "`next/font/google` ले build time मा font download गरेर self-host गर्छ — runtime मा Google request हुँदैन। FOUT हट्छ र privacy पनि सुरक्षित हुन्छ।",
            jp: "`next/font/google` はビルド時にフォントをダウンロードしてセルフホストします。実行時の Google へのリクエストがなくなり、FOUT（未スタイルテキストの点滅）と第三者CDNへのプライバシー漏洩を防ぎます。",
          },
        },
        {
          type: "code",
          title: {
            en: "app/layout.tsx — next/font/google",
            np: "next/font/google setup",
            jp: "next/font/google の設定",
          },
          code: `import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",   // Expose as CSS variable
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={\`\${inter.variable} \${robotoMono.variable}\`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "For **third-party scripts** (analytics, chat widgets), use `<Script>` from `next/script` instead of a raw `<script>` tag. The `strategy` prop controls when the script loads: `beforeInteractive` (critical, blocks HTML parse), `afterInteractive` (after hydration, default), or `lazyOnload` (idle time).",
            np: "**Third-party script** को लागि `next/script` को `<Script>` प्रयोग गर्नुहोस्। `strategy` ले कहिले load हुन्छ त्यो control गर्छ: `beforeInteractive`, `afterInteractive`, वा `lazyOnload`।",
            jp: "**サードパーティスクリプト**には生の `<script>` タグの代わりに `next/script` の `<Script>` を使います。`strategy` プロップで読み込みタイミングを制御します: `beforeInteractive`（クリティカル・HTML パースをブロック）、`afterInteractive`（ハイドレーション後・デフォルト）、`lazyOnload`（アイドル時）。",
          },
        },
        {
          type: "code",
          title: {
            en: "<Script> strategy examples",
            np: "<Script> strategy उदाहरण",
            jp: "<Script> strategy の使用例",
          },
          code: `import Script from "next/script";

// Analytics — load after page becomes interactive (default)
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
  strategy="afterInteractive"
/>

// Chat widget — low priority; load during idle time
<Script
  src="https://cdn.example.com/widget.js"
  strategy="lazyOnload"
  onLoad={() => console.log("Widget loaded")}
/>

// Cookie consent — must run before the page renders
<Script src="/consent-banner.js" strategy="beforeInteractive" />`,
        },
      ],
    },
    {
      title: {
        en: "SEO metadata & lazy loading",
        np: "SEO metadata र lazy loading",
        jp: "SEO メタデータと遅延読み込み",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Next.js App Router uses the **Metadata API** for SEO. Export a `metadata` constant (static) or a `generateMetadata` async function (dynamic) from any `page.tsx` or `layout.tsx`. Next merges parent and child metadata automatically.",
            np: "App Router ले **Metadata API** प्रयोग गर्छ। `page.tsx` वा `layout.tsx` बाट `metadata` constant (static) वा `generateMetadata` function (dynamic) export गर्नुहोस्। Parent/child metadata auto-merge हुन्छ।",
            jp: "App Router は **Metadata API** を使います。`page.tsx` や `layout.tsx` から静的な `metadata` 定数、または動的な `generateMetadata` 非同期関数をエクスポートします。親と子のメタデータは自動的にマージされます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Static metadata + generateMetadata pattern",
            np: "Static metadata र generateMetadata",
            jp: "静的メタデータと generateMetadata の例",
          },
          code: `import type { Metadata } from "next";

// Static — for layout.tsx or simple pages
export const metadata: Metadata = {
  title: {
    template: "%s | Acme",
    default: "Acme",
  },
  description: "Build amazing products faster.",
  openGraph: {
    title: "Acme",
    description: "Build amazing products faster.",
    url: "https://acme.com",
    siteName: "Acme",
    images: [{ url: "https://acme.com/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Acme",
    images: ["https://acme.com/og.png"],
  },
  robots: { index: true, follow: true },
};

// Dynamic — for pages that depend on params (e.g., /products/[id])
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await fetch(\`https://api.acme.com/products/\${params.id}\`).then(
    (r) => r.json()
  );
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [{ url: product.imageUrl }],
    },
  };
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Lazy loading** with `dynamic()` from `next/dynamic` splits a component into its own JS chunk that is only fetched when the component first renders. Set `ssr: false` for browser-only libraries (e.g., a map or chart that accesses `window`). Provide a `loading` placeholder for a smooth UX.",
            np: "`next/dynamic` को `dynamic()` ले component लाई छुट्टै JS chunk मा split गर्छ। Browser-only library को लागि `ssr: false` राख्नुहोस्। `loading` placeholder ले smooth UX दिन्छ।",
            jp: "`next/dynamic` の `dynamic()` はコンポーネントを独立した JS チャンクに分割し、初回レンダリング時のみ取得します。`window` にアクセスするマップやチャートなどのブラウザ専用ライブラリには `ssr: false` を設定します。",
          },
        },
        {
          type: "code",
          title: { en: "dynamic() import examples", np: "dynamic() import उदाहरण", jp: "dynamic() インポートの例" },
          code: `import dynamic from "next/dynamic";

// Basic lazy load — code-split into separate chunk
const HeavyChart = dynamic(() => import("@/components/HeavyChart"), {
  loading: () => <p>Loading chart…</p>,
});

// Browser-only (no SSR) — useful for libraries that use window/document
const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <div style={{ height: 400, background: "#e5e7eb" }} />,
});

export default function AnalyticsPage() {
  return (
    <main>
      <HeavyChart />
      <MapComponent />
    </main>
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "For dynamic `og:image` generation, Next.js provides `ImageResponse` from `next/og`. Create a `app/og/route.tsx` Route Handler that returns a rendered JSX tree as a PNG — useful for blog posts or product pages with unique social images per page.",
            np: "Dynamic `og:image` को लागि `next/og` को `ImageResponse` प्रयोग गर्नुहोस्। `app/og/route.tsx` मा JSX render गरेर PNG फर्काउन सकिन्छ।",
            jp: "動的な `og:image` には `next/og` の `ImageResponse` を使います。`app/og/route.tsx` Route Handler が JSX ツリーを PNG としてレンダリングして返します。ブログ記事や商品ページのユニークなソーシャル画像に役立ちます。",
          },
        },
        {
          type: "code",
          title: {
            en: "app/og/route.tsx — dynamic OG image",
            np: "Dynamic OG image route",
            jp: "動的 OG 画像ルート",
          },
          code: `import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") ?? "My Site";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#4f46e5",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 72,
          color: "#fff",
          padding: 40,
        }}
      >
        {title}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Do I need to configure `remotePatterns` for Cloudinary images?",
        np: "Cloudinary image को लागि `remotePatterns` configure गर्नु पर्छ?",
        jp: "Cloudinary 画像に `remotePatterns` の設定は必要ですか？",
      },
      answer: {
        en: "Yes — any remote image domain must be explicitly allowed in `next.config.ts` under `images.remotePatterns` (the older `images.domains` still works but is deprecated). Add `{ protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' }`. Without this, Next.js will throw an error for security reasons — it prevents arbitrary image proxying that could be abused.",
        np: "हो — `next.config.ts` मा `images.remotePatterns` मा Cloudinary domain add गर्नुहोस्। नभए Next.js ले security error दिन्छ।",
        jp: "はい。`next.config.ts` の `images.remotePatterns` に Cloudinary ドメインを明示的に許可する必要があります（旧 `images.domains` は非推奨）。これがないと、任意の画像プロキシの悪用を防ぐためセキュリティエラーが発生します。",
      },
    },
    {
      question: {
        en: "Why use `next/font` instead of a Google Fonts `<link>` tag?",
        np: "Google Fonts `<link>` tag को सट्टा `next/font` किन?",
        jp: "Google Fonts の `<link>` タグの代わりに `next/font` を使う理由は？",
      },
      answer: {
        en: "A `<link>` tag causes an extra DNS lookup + download from Google's CDN on every page load, which adds latency and leaks the visitor's IP to Google. `next/font` downloads the font at build time and serves it from your own domain — same origin, no extra DNS, zero layout shift (the font size metrics prevent FOUT), and no privacy concern.",
        np: "`<link>` tag ले हर request मा Google CDN DNS lookup गर्छ। `next/font` ले build time मा download गरेर आफ्नै domain बाट serve गर्छ — कम latency, FOUT हैन, privacy safe।",
        jp: "`<link>` タグは毎回 Google CDN への DNS ルックアップと取得が発生し、遅延と訪問者 IP の漏洩につながります。`next/font` はビルド時にダウンロードして自ドメインから配信します。追加 DNS なし・FOUT なし・プライバシー問題なしです。",
      },
    },
    {
      question: {
        en: "Can I use `react-email` outside Next.js (e.g., in a Node.js backend)?",
        np: "Next.js बाहिर (e.g., Node.js backend) मा `react-email` प्रयोग गर्न सकिन्छ?",
        jp: "`react-email` は Next.js 以外（Node.js バックエンドなど）でも使えますか？",
      },
      answer: {
        en: "Yes — `react-email` is framework-agnostic. Use `render()` from `@react-email/render` to convert the React component to an HTML string, then pass that string to any email service (Nodemailer, SendGrid, SES, etc.). The only requirement is a React-compatible environment (Node.js 18+).",
        np: "हो — `@react-email/render` को `render()` ले React component लाई HTML string मा convert गर्छ। त्यसपछि कुनै पनि email service मा pass गर्नुहोस्।",
        jp: "はい。`react-email` はフレームワーク非依存です。`@react-email/render` の `render()` で React コンポーネントを HTML 文字列に変換し、任意のメールサービス（Nodemailer・SendGrid・SES など）に渡せます。",
      },
    },
    {
      question: {
        en: "What is the difference between `beforeInteractive` and `afterInteractive` script strategies?",
        np: "`beforeInteractive` र `afterInteractive` script strategy मा के फरक छ?",
        jp: "`beforeInteractive` と `afterInteractive` のスクリプト戦略の違いは？",
      },
      answer: {
        en: "`beforeInteractive` injects the script into the initial HTML server response (inside `<head>`) and blocks page rendering until it executes — use only for critical scripts like polyfills or consent managers that must run before any JavaScript. `afterInteractive` (the default) defers the script until after Next.js hydrates the page client-side — appropriate for analytics, tag managers, and anything that can wait a few hundred milliseconds.",
        np: "`beforeInteractive` ले script लाई HTML server response मा inject गरेर page render रोक्छ — polyfill वा consent manager जस्ता critical script को लागि। `afterInteractive` ले hydration पछि load गर्छ — analytics र tag manager को लागि उपयुक्त।",
        jp: "`beforeInteractive` はスクリプトを初期 HTML サーバーレスポンス（`<head>` 内）に注入し、実行されるまでページレンダリングをブロックします。ポリフィルやコンセント管理など、JavaScript より先に動く必要があるクリティカルなスクリプトのみに使用してください。`afterInteractive`（デフォルト）はクライアント側のハイドレーション後にスクリプトを遅延させます。アナリティクスやタグマネージャーに適しています。",
      },
    },
    {
      question: {
        en: "Do lazy-loaded components (via `dynamic()`) affect SEO?",
        np: "`dynamic()` ले lazy load गरिएका component ले SEO मा असर गर्छ?",
        jp: "`dynamic()` で遅延読み込みされたコンポーネントは SEO に影響しますか？",
      },
      answer: {
        en: "Server-rendered lazy-loaded components (without `ssr: false`) are still included in the initial HTML sent to crawlers — SEO is unaffected. Only components with `ssr: false` are excluded from the server render; if their content is important for SEO, do not use `ssr: false`. Googlebot is capable of executing JavaScript, but deferring critical content to the client always risks it being missed or indexed later.",
        np: "`ssr: false` नभएका lazy-loaded component server HTML मा include हुन्छन् — SEO मा असर हुँदैन। `ssr: false` भएका component server render हुँदैनन्; SEO-important content मा `ssr: false` नराख्नुहोस्।",
        jp: "`ssr: false` なしの遅延読み込みコンポーネントは、クローラーに送られる初期 HTML に含まれるため SEO への影響はありません。`ssr: false` のコンポーネントはサーバーレンダリングから除外されます。SEO 上重要なコンテンツには `ssr: false` を使わないでください。",
      },
    },
    {
      question: {
        en: "How do I generate a dynamic `og:image` for each page?",
        np: "हरेक page को लागि dynamic `og:image` कसरी बनाउने?",
        jp: "各ページに動的な `og:image` を生成するには？",
      },
      answer: {
        en: "Create an `app/og/route.tsx` Edge Route Handler that uses `ImageResponse` from `next/og`. Pass page-specific data as query params (e.g., `?title=My+Post`) and reference the URL in `generateMetadata` — `openGraph.images: [{ url: '/og?title=My+Post' }]`. The route renders JSX to a PNG on the Edge at request time.",
        np: "`app/og/route.tsx` Edge Route Handler बनाएर `next/og` को `ImageResponse` प्रयोग गर्नुहोस्। `generateMetadata` मा `openGraph.images` मा यो URL reference गर्नुहोस्।",
        jp: "`next/og` の `ImageResponse` を使う Edge Route Handler `app/og/route.tsx` を作成します。ページ固有データをクエリパラメータで渡し（例: `?title=My+Post`）、`generateMetadata` の `openGraph.images` でその URL を参照します。",
      },
    },
  ],
};
