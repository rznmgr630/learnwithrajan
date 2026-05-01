import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_9_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**NextAuth** (v4) is the de-facto authentication library for Next.js. A single catch-all route — `app/api/auth/[...nextauth]/route.ts` — handles sign-in, sign-out, callbacks, and session management. You wire everything through an `authOptions` object: providers, session strategy, and callbacks.",
      np: "**NextAuth** v4 ले एउटै catch-all route बाट sign-in, sign-out, callback र session सम्हाल्छ। सबै कुरा `authOptions` बाट जोडिन्छ।",
      jp: "**NextAuth** v4 はひとつの catch-all ルートで sign-in・sign-out・コールバック・セッション管理を担います。すべては `authOptions` オブジェクトで設定します。",
    },
    {
      en: "NextAuth supports both **JWT sessions** (stateless, default) and **database sessions** (persisted via an adapter). Google OAuth is the fastest provider to set up; `CredentialsProvider` lets you build a classic username/password flow on top of Prisma and bcrypt.",
      np: "NextAuth ले **JWT** (stateless, default) र **database** session दुवै सम्हाल्छ। Google OAuth सबैभन्दा छिटो; `CredentialsProvider` ले username/password flow बनाउँछ।",
      jp: "NextAuth は **JWT セッション**（ステートレス・デフォルト）と**データベースセッション**（アダプタ経由で永続化）の両方をサポートします。Google OAuth が最速。`CredentialsProvider` でパスワード認証も実装できます。",
    },
  ],
  sections: [
    {
      title: {
        en: "NextAuth setup & Google Provider",
        np: "NextAuth सेटअप र Google Provider",
        jp: "NextAuth のセットアップと Google Provider",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Install the package and add two required environment variables. Then create the catch-all route and export `authOptions` so it can be reused in Server Components.",
            np: "प्याकेज इन्स्टल गरेर दुईवटा env var थप्नुहोस्। त्यसपछि catch-all route बनाउनुहोस् र `authOptions` export गर्नुहोस्।",
            jp: "パッケージをインストールして2つの環境変数を設定します。次に catch-all ルートを作成し、Server Component で再利用できるよう `authOptions` をエクスポートします。",
          },
        },
        {
          type: "code",
          title: { en: "Install & env vars", np: "इन्स्टल र env vars", jp: "インストールと環境変数" },
          code: `npm install next-auth

# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-at-least-32-chars
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret`,
        },
        {
          type: "code",
          title: {
            en: "app/api/auth/[...nextauth]/route.ts",
            np: "catch-all route फाइल",
            jp: "catch-all ルートファイル",
          },
          code: `import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt", // default; use "database" when an adapter is present
  },
  callbacks: {
    async session({ session, token }) {
      // Attach extra data from the JWT token to the session object
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };`,
        },
        {
          type: "paragraph",
          text: {
            en: "In **Google Cloud Console**: create an OAuth 2.0 Client ID under APIs & Services → Credentials. Set the Authorized redirect URI to `http://localhost:3000/api/auth/callback/google` for development and your production URL for production.",
            np: "**Google Cloud Console** मा OAuth 2.0 Client ID बनाउनुहोस्। Redirect URI `http://localhost:3000/api/auth/callback/google` राख्नुहोस्।",
            jp: "**Google Cloud Console** の APIs & Services → 認証情報で OAuth 2.0 クライアント ID を作成し、リダイレクト URI に `http://localhost:3000/api/auth/callback/google` を設定します。",
          },
        },
        {
          type: "diagram",
          id: "nextjs-nextauth-flow",
        },
      ],
    },
    {
      title: {
        en: "Sessions — client & server access",
        np: "Sessions — client र server पहुँच",
        jp: "セッション — クライアントとサーバーからのアクセス",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "On the **client**, wrap your root layout with `SessionProvider` so every Client Component can call `useSession()`. On the **server**, call `getServerSession(authOptions)` directly — no provider wrapper needed.",
            np: "**Client** मा `SessionProvider` ले root layout लाई wrap गर्छ। **Server** मा `getServerSession(authOptions)` सिधै call गर्नुहोस् — कुनै provider wrapper चाहिँदैन।",
            jp: "**クライアント**では `SessionProvider` でルートレイアウトをラップし、各 Client Component で `useSession()` を呼びます。**サーバー**では `getServerSession(authOptions)` を直接呼ぶだけで、プロバイダラッパーは不要です。",
          },
        },
        {
          type: "code",
          title: {
            en: "app/layout.tsx — SessionProvider wrapper",
            np: "SessionProvider wrapper",
            jp: "SessionProvider のラッパー",
          },
          code: `"use client";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}`,
        },
        {
          type: "code",
          title: {
            en: "Client Component — useSession hook",
            np: "useSession hook (Client Component)",
            jp: "useSession フック（Client Component）",
          },
          code: `"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading…</p>;

  if (!session) {
    return <button onClick={() => signIn("google")}>Sign in with Google</button>;
  }

  return (
    <div>
      <p>Welcome, {session.user?.name}</p>
      <button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
    </div>
  );
}`,
        },
        {
          type: "code",
          title: {
            en: "Server Component — getServerSession",
            np: "getServerSession (Server Component)",
            jp: "getServerSession（Server Component）",
          },
          code: `import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/api/auth/signin");

  return <h1>Hello, {session.user?.name}</h1>;
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "`getServerSession` also works inside **Route Handlers**. Pass the same `authOptions` object — NextAuth uses it to verify and decode the session cookie / JWT without making a network round-trip.",
            np: "`getServerSession` Route Handler भित्र पनि काम गर्छ। उही `authOptions` पास गर्नुहोस्।",
            jp: "`getServerSession` は **Route Handler** 内でも動作します。同じ `authOptions` を渡すだけで、ネットワーク往復なしにセッションを検証・デコードできます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Protecting routes with middleware",
        np: "Middleware ले route सुरक्षित गर्ने",
        jp: "ミドルウェアでルートを保護する",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The `withAuth` helper from `next-auth/middleware` is the recommended way to guard a set of paths at the Edge. Create `middleware.ts` at the project root, export `withAuth` as the default, and configure a `matcher` to limit which paths it runs on.",
            np: "`next-auth/middleware` को `withAuth` ले Edge मा path guard गर्छ। Project root मा `middleware.ts` बनाएर `matcher` configure गर्नुहोस्।",
            jp: "`next-auth/middleware` の `withAuth` ヘルパーは Edge でパスを保護する推奨の方法です。プロジェクトルートに `middleware.ts` を作成し、`matcher` で対象パスを絞り込みます。",
          },
        },
        {
          type: "code",
          title: { en: "middleware.ts — route protection", np: "middleware.ts", jp: "middleware.ts" },
          code: `import { withAuth } from "next-auth/middleware";

export default withAuth({
  // Pages to redirect to when unauthenticated
  pages: {
    signIn: "/api/auth/signin",
  },
});

export const config = {
  // Protect everything under /dashboard and /admin
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};`,
        },
        {
          type: "paragraph",
          text: {
            en: "For **fine-grained control** (e.g., role-based checks), use `withAuth` with a custom `authorized` callback that receives the token and can return `false` to block access.",
            np: "**Role-based** control को लागि `authorized` callback प्रयोग गर्नुहोस् जसले token पाउँछ र `false` फर्काएमा access रोक्छ।",
            jp: "**ロールベース**の細かい制御には、トークンを受け取り `false` を返すことでアクセスをブロックできる `authorized` コールバック付きの `withAuth` を使います。",
          },
        },
        {
          type: "code",
          title: {
            en: "middleware.ts — role-based authorized callback",
            np: "Role-based callback",
            jp: "ロールベースの authorized コールバック",
          },
          code: `import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Runs only when authorized() returns true
    console.log("Authenticated user accessing:", req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized({ token }) {
        // Only allow users with role "admin" on /admin/* routes
        if (token?.role === "admin") return true;
        return false;
      },
    },
  }
);

export const config = { matcher: ["/admin/:path*"] };`,
        },
      ],
    },
    {
      title: {
        en: "CredentialsProvider & user registration",
        np: "CredentialsProvider र user registration",
        jp: "CredentialsProvider とユーザー登録",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Use `CredentialsProvider` for a custom email/password flow. The `authorize` callback receives the submitted credentials, looks up the user in your database, and verifies the password with **bcrypt**. Return `null` to reject.",
            np: "`CredentialsProvider` ले custom email/password flow बनाउँछ। `authorize` callback ले credentials पाउँछ, DB मा user खोज्छ, र **bcrypt** ले password verify गर्छ।",
            jp: "`CredentialsProvider` でカスタムメール/パスワードフローを実装します。`authorize` コールバックが認証情報を受け取り、DB でユーザーを検索し、**bcrypt** でパスワードを検証します。",
          },
        },
        {
          type: "code",
          title: {
            en: "authOptions with CredentialsProvider",
            np: "CredentialsProvider authOptions",
            jp: "CredentialsProvider を含む authOptions",
          },
          code: `import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.hashedPassword) return null;

        const isValid = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!isValid) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
};`,
        },
        {
          type: "code",
          title: {
            en: "POST /api/register — hash password & create user",
            np: "User registration endpoint",
            jp: "ユーザー登録エンドポイント",
          },
          code: `// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, hashedPassword },
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "When using **database sessions** (instead of JWT), install `@auth/prisma-adapter` and pass it as the `adapter` field in `authOptions`. NextAuth will automatically persist users, sessions, and OAuth accounts to your Prisma database.",
            np: "**database session** चाहिएमा `@auth/prisma-adapter` install गरेर `adapter` field मा पास गर्नुहोस्। NextAuth ले users, sessions, र accounts आफैले DB मा save गर्छ।",
            jp: "**データベースセッション**を使う場合は `@auth/prisma-adapter` をインストールし、`authOptions` の `adapter` フィールドに渡します。NextAuth がユーザー・セッション・OAuth アカウントを自動的に Prisma DB へ永続化します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Using the Prisma Adapter (database sessions)",
            np: "Prisma Adapter — database session",
            jp: "Prisma Adapter（データベースセッション）",
          },
          code: `import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "database" },
};`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between JWT and database sessions?",
        np: "JWT र database session मा के फरक छ?",
        jp: "JWT セッションとデータベースセッションの違いは？",
      },
      answer: {
        en: "**JWT sessions** (default) store session data inside a signed, encrypted cookie — the server needs no DB lookup on every request, but you cannot easily invalidate a token before it expires. **Database sessions** store a random token in a cookie and the actual session data in the DB — invalidation is instant (just delete the row), but every authenticated request hits the database.",
        np: "**JWT** ले encrypted cookie मा data राख्छ — DB lookup चाहिँदैन तर expire अघि token रद्द गर्न सकिँदैन। **Database session** ले DB मा data राख्छ — instant invalidation तर हरेक request मा DB hit।",
        jp: "**JWT**（デフォルト）は署名・暗号化された Cookie にセッションデータを格納します。サーバーは DB ルックアップ不要ですが、期限前のトークン無効化は困難です。**データベースセッション**は Cookie にランダムトークンのみ格納し、セッション実体は DB に置きます。即時無効化は可能ですが、毎回 DB アクセスが必要です。",
      },
    },
    {
      question: {
        en: "Can I use multiple providers at once (e.g., Google + GitHub + Credentials)?",
        np: "एकैचोटि धेरै provider (Google + GitHub + Credentials) राख्न सकिन्छ?",
        jp: "複数のプロバイダ（Google + GitHub + Credentials など）を同時に使えますか？",
      },
      answer: {
        en: "Yes — add as many providers as you need to the `providers` array in `authOptions`. NextAuth renders a built-in sign-in page that lists all configured providers. When using `CredentialsProvider` alongside OAuth providers you must keep `session.strategy: 'jwt'` (the Prisma Adapter does not support credential sessions out-of-the-box).",
        np: "हो — `providers` array मा जति चाहिन्छ provider राख्नुहोस्। NextAuth ले सबै provider देखाउने sign-in page बनाउँछ। `CredentialsProvider` OAuth सँगै प्रयोग गर्दा `strategy: 'jwt'` राख्नु पर्छ।",
        jp: "はい。`authOptions` の `providers` 配列に必要なだけ追加できます。NextAuth は設定されたすべてのプロバイダを一覧する組み込みサインインページを表示します。`CredentialsProvider` と OAuth を併用する場合は `session.strategy: 'jwt'` を維持してください（Prisma Adapter はデフォルトで Credentials セッションをサポートしません）。",
      },
    },
    {
      question: {
        en: "How do I add custom fields (e.g., `role`, `id`) to the session object?",
        np: "Session object मा custom fields (`role`, `id`) कसरी थप्ने?",
        jp: "セッションオブジェクトに `role` や `id` などのカスタムフィールドを追加するには？",
      },
      answer: {
        en: "Use the `callbacks` in `authOptions`. In the `jwt` callback, attach the value to the token (e.g., `token.role = user.role`). In the `session` callback, copy it from the token to `session.user`. You should also extend the TypeScript types by augmenting the `next-auth` module: declare `interface Session { user: { role?: string } }` in a `types/next-auth.d.ts` file.",
        np: "`authOptions` को `callbacks` प्रयोग गर्नुहोस्। `jwt` callback मा token मा value थप्नुहोस्, `session` callback मा token बाट `session.user` मा copy गर्नुहोस्। TypeScript type augmentation पनि गर्नुहोस्।",
        jp: "`authOptions` の `callbacks` を使います。`jwt` コールバックでトークンに値を追加し（例: `token.role = user.role`）、`session` コールバックでトークンから `session.user` へコピーします。`types/next-auth.d.ts` で `interface Session { user: { role?: string } }` と型拡張も忘れずに。",
      },
    },
    {
      question: {
        en: "Why does `getServerSession` require `authOptions` as an argument?",
        np: "`getServerSession` लाई `authOptions` किन argument चाहिन्छ?",
        jp: "`getServerSession` に `authOptions` が必要なのはなぜですか？",
      },
      answer: {
        en: "`getServerSession` runs entirely on the server without access to the `[...nextauth]` route. It needs `authOptions` to know the secret for verifying the JWT / session cookie, the session strategy, and any custom callbacks that shape the session object. Without it, NextAuth cannot decode or validate the cookie.",
        np: "`getServerSession` ले `[...nextauth]` route access गर्दैन। `authOptions` ले JWT verify गर्न secret, strategy, र custom callbacks थाहा पाउँछ।",
        jp: "`getServerSession` は `[...nextauth]` ルートにアクセスせずサーバー上で完結します。JWT / セッション Cookie の検証に必要なシークレット・セッション戦略・カスタムコールバックを知るために `authOptions` が必要です。",
      },
    },
    {
      question: {
        en: "How do I protect a specific API Route Handler?",
        np: "Specific API Route Handler कसरी protect गर्ने?",
        jp: "特定の API Route Handler を保護するには？",
      },
      answer: {
        en: "Call `getServerSession(authOptions)` at the top of the handler and return a `401` response if the session is `null`. The middleware approach is better for protecting many routes in bulk, but per-route checks give you finer control (e.g., check a role on the session before proceeding).",
        np: "Handler को शुरुमा `getServerSession(authOptions)` call गरेर session `null` भए `401` फर्काउनुहोस्। Middleware ले bulk protection दिन्छ, तर per-route check ले fine-grained control दिन्छ।",
        jp: "ハンドラの先頭で `getServerSession(authOptions)` を呼び、セッションが `null` なら `401` を返します。多数のルートを一括保護するにはミドルウェアが便利ですが、ルート単位のチェックでより細かい制御（ロール確認など）が可能です。",
      },
    },
    {
      question: {
        en: "Is NextAuth v4 compatible with the Next.js 15 App Router?",
        np: "NextAuth v4 Next.js 15 App Router सँग compatible छ?",
        jp: "NextAuth v4 は Next.js 15 の App Router と互換性がありますか？",
      },
      answer: {
        en: "NextAuth v4 works with the App Router but requires a small shim: export the handler as both `GET` and `POST` from `app/api/auth/[...nextauth]/route.ts` (shown above). For a fully App-Router-native experience, consider **Auth.js v5** (the successor to NextAuth v4) which has first-class App Router support and a simplified `auth()` helper that replaces both `getServerSession` and `useSession` in many cases.",
        np: "NextAuth v4 App Router सँग काम गर्छ — handler लाई `GET` र `POST` दुवैमा export गर्नुहोस्। पूर्ण App Router support को लागि **Auth.js v5** (NextAuth v4 को उत्तराधिकारी) विचार गर्नुहोस्।",
        jp: "NextAuth v4 は App Router で動作しますが、`app/api/auth/[...nextauth]/route.ts` からハンドラを `GET` と `POST` の両方でエクスポートする必要があります。より App Router ネイティブな体験には、`getServerSession` と `useSession` を多くの場面で置き換える `auth()` ヘルパーを持つ **Auth.js v5** を検討してください。",
      },
    },
  ],
};
