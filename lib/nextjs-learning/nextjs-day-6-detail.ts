import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_6_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Route Handlers** (the `app/` directory's successor to `pages/api/`) let you build REST APIs directly inside your Next.js project. Each `route.ts` file exports named async functions — `GET`, `POST`, `PUT`, `PATCH`, `DELETE` — that receive a **`NextRequest`** and return a **`NextResponse`**. Combine them with **Zod** for runtime schema validation and you get a type-safe API without a separate backend.",
      np: "Route Handlers (`route.ts`) ले Next.js भित्रै REST API बनाउन दिन्छ। `GET`, `POST`, आदि async functions export गरिन्छ। Zod सँग मिलाएर type-safe validation गर्न सकिन्छ।",
      jp: "Route Handlers (`route.ts`) を使うと Next.js 内で REST API を構築できます。`GET`/`POST` などを async 関数としてエクスポートし、Zod と組み合わせて型安全なバリデーションを実現します。",
    },
  ],
  sections: [
    {
      title: {
        en: "Route Handler anatomy",
        np: "Route Handler संरचना",
        jp: "Route Handler の構造",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Place `route.ts` inside `app/api/<resource>/` for collection endpoints and `app/api/<resource>/[id]/` for single-item endpoints. The file name must be exactly `route.ts` — Next.js ignores any other filename. Export one or more HTTP method functions. They receive a `NextRequest` (extends the Web `Request`) and must return a `Response` or `NextResponse`.",
            np: "Collection को लागि `app/api/<resource>/route.ts` र single item को लागि `app/api/<resource>/[id]/route.ts` राख्नुहोस्।",
            jp: "コレクションは `app/api/<resource>/route.ts`、単一リソースは `[id]/route.ts` に配置します。",
          },
        },
        {
          type: "diagram",
          id: "nextjs-api-route-flow",
        },
        {
          type: "code",
          title: {
            en: "app/api/products/route.ts — GET collection + POST with Zod",
            np: "GET collection र POST with Zod उदाहरण",
            jp: "GET コレクションと Zod 付き POST の例",
          },
          code: `import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

// Zod schema — reuse for POST and PUT
const productSchema = z.object({
  name: z.string().min(1).max(255),
  price: z.number().positive(),
  inStock: z.boolean().optional().default(true),
});

// GET /api/products — return all products
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

// POST /api/products — create a product
export async function POST(request: NextRequest) {
  const body = await request.json();

  const result = productSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.errors },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: result.data,
  });

  return NextResponse.json(product, { status: 201 });
}`,
        },
      ],
    },
    {
      title: {
        en: "Single-resource CRUD",
        np: "Single-resource CRUD",
        jp: "単一リソースの CRUD",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "For operations on a specific record, create `app/api/products/[id]/route.ts`. The second argument to each handler is `{ params }` — a plain object containing the dynamic segment values. Always validate that the parsed `id` is a valid number (or UUID) before hitting the database.",
            np: "Single record को लागि `[id]/route.ts` बनाउनुहोस्। Handler को दोस्रो argument `{ params }` मा dynamic segment values हुन्छ।",
            jp: "単一レコードには `[id]/route.ts` を作ります。第 2 引数 `{ params }` に動的セグメントの値が入ります。",
          },
        },
        {
          type: "code",
          title: {
            en: "app/api/products/[id]/route.ts — GET, PUT, DELETE",
            np: "GET, PUT, DELETE उदाहरण",
            jp: "GET・PUT・DELETE の例",
          },
          code: `import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const productUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  price: z.number().positive().optional(),
  inStock: z.boolean().optional(),
});

interface RouteContext {
  params: { id: string };
}

// GET /api/products/:id
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

// PUT /api/products/:id — full or partial update
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const body = await request.json();
  const result = productUpdateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: result.error.errors }, { status: 400 });
  }

  const updated = await prisma.product.update({
    where: { id },
    data: result.data,
  });

  return NextResponse.json(updated);
}

// DELETE /api/products/:id
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({}, { status: 204 });
}`,
        },
      ],
    },
    {
      title: {
        en: "Zod validation patterns",
        np: "Zod validation patterns",
        jp: "Zod バリデーションパターン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Zod** is a TypeScript-first schema declaration library. Define a schema once and reuse it for both runtime validation and static type inference. Use **`safeParse`** (returns `{ success, data, error }`) instead of `parse` (throws) so you can control the HTTP response. The `error.errors` array is a flat list of `ZodIssue` objects with `path`, `message`, and `code` — safe to serialize and return to the client.",
            np: "Zod ले schema एक पटक define गरेर validation र type inference दुवैमा reuse गर्न दिन्छ। `safeParse` प्रयोग गर्नुहोस् जसले throw गर्दैन।",
            jp: "Zod はランタイムバリデーションと静的型推論を一つのスキーマで実現します。`safeParse` は throw しないため HTTP レスポンスを制御できます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Zod schema definition and type inference",
            np: "Zod schema र type inference",
            jp: "Zod スキーマ定義と型推論",
          },
          code: `import { z } from "zod";

// Schema declaration
export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  price: z.number().positive("Price must be positive"),
  categoryId: z.number().int().optional(),
  inStock: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
});

// Infer TypeScript type from schema — stays in sync automatically
export type ProductInput = z.infer<typeof productSchema>;

// Partial schema for PATCH/PUT updates
export const productUpdateSchema = productSchema.partial();
export type ProductUpdate = z.infer<typeof productUpdateSchema>;`,
        },
        {
          type: "code",
          title: {
            en: "Using safeParse and returning structured validation errors",
            np: "safeParse र structured errors",
            jp: "safeParse と構造化エラーレスポンスの例",
          },
          code: `import { NextRequest, NextResponse } from "next/server";
import { productSchema } from "@/lib/schemas/product";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = productSchema.safeParse(body);

  if (!result.success) {
    // result.error.errors is an array of ZodIssue objects
    // Each has: { path, message, code }
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: result.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  // result.data is fully typed as ProductInput
  const { name, price, inStock } = result.data;

  // ... create in database
  return NextResponse.json({ name, price, inStock }, { status: 201 });
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`z.string().email()`**, **`z.string().url()`**, **`z.string().regex()`** — common string validators.",
              np: "`z.string().email()`, `.url()`, `.regex()` — common validators।",
              jp: "`z.string().email()`、`.url()`、`.regex()` はよく使うバリデータです。",
            },
            {
              en: "**`z.enum(['ACTIVE', 'ARCHIVED'])`** — validates against a literal union.",
              np: "`z.enum([...])` ले literal union validate गर्छ।",
              jp: "`z.enum([...])` でリテラルユニオンを検証します。",
            },
            {
              en: "**`schema.refine(fn, message)`** — custom async or sync cross-field validation.",
              np: "`schema.refine()` ले custom validation गर्छ।",
              jp: "`schema.refine()` でカスタムバリデーションを追加できます。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Can Route Handlers access the database directly?",
        np: "Route Handlers ले database directly access गर्न सक्छ?",
        jp: "Route Handlers からデータベースに直接アクセスできますか？",
      },
      answer: {
        en: "Yes. Route Handlers run exclusively on the server, so they can import and use any Node.js library including database clients like **Prisma**, **Drizzle**, or raw `pg`. They are never bundled into the client. The key is to avoid importing them from Client Components.",
        np: "हो। Route Handlers server मा मात्र run हुन्छ, त्यसैले Prisma, Drizzle, वा raw `pg` जस्ता database library import गर्न सकिन्छ।",
        jp: "はい。Route Handlers はサーバーのみで動くため、Prisma や Drizzle などの DB クライアントを直接使えます。",
      },
    },
    {
      question: {
        en: "How do I add authentication/middleware to a Route Handler?",
        np: "Route Handler मा authentication/middleware कसरी थप्ने?",
        jp: "Route Handler に認証/ミドルウェアを追加するには？",
      },
      answer: {
        en: "For global auth, use `middleware.ts` at the project root — it runs before every request and can redirect or modify headers. For per-route auth, call a helper function at the top of your handler (e.g. `const session = await getServerSession(authOptions)` with **NextAuth**) and return a 401 response if the session is absent. Avoid duplicating auth logic by extracting it into a reusable `withAuth` wrapper function.",
        np: "Global auth को लागि `middleware.ts` प्रयोग गर्नुहोस्। Per-route auth को लागि handler को सुरुमा `getServerSession()` call गर्नुहोस् र 401 return गर्नुहोस्।",
        jp: "グローバル認証には `middleware.ts` を使います。ルートごとには `getServerSession()` などをハンドラ先頭で呼び、セッションがなければ 401 を返します。",
      },
    },
    {
      question: {
        en: "What is the difference between Route Handlers and Server Actions?",
        np: "Route Handlers र Server Actions मा के फरक छ?",
        jp: "Route Handlers と Server Actions の違いは？",
      },
      answer: {
        en: "**Route Handlers** expose HTTP endpoints consumable by any client (mobile apps, third-party services, curl). They use standard HTTP verbs and are best for public or external APIs. **Server Actions** are RPC-style functions called directly from React components — they require no separate fetch call and integrate naturally with `useFormStatus` and Next.js caching. Use Server Actions for internal form submissions and mutations tied to your UI; use Route Handlers when you need a proper REST API.",
        np: "Route Handlers external HTTP API को लागि हो (mobile, third-party)। Server Actions internal form submission र mutation को लागि — direct function call गर्न सकिन्छ।",
        jp: "Route Handlers は外部クライアントにも公開できる HTTP API です。Server Actions は UI に紐づいた内部的な RPC で、フォーム送信やミューテーションに適します。",
      },
    },
    {
      question: {
        en: "Can I stream responses from a Route Handler?",
        np: "Route Handler बाट response stream गर्न सकिन्छ?",
        jp: "Route Handler からレスポンスをストリームできますか？",
      },
      answer: {
        en: "Yes. Return a `Response` with a `ReadableStream` body. This is useful for Server-Sent Events (SSE) or streaming AI responses. Next.js Route Handlers sit on top of the Web Streams API, so standard `TransformStream` and `ReadableStream` constructors work. For AI streaming specifically, the **Vercel AI SDK** provides helper utilities (`StreamingTextResponse`, etc.).",
        np: "`ReadableStream` body भएको `Response` return गर्दा streaming काम गर्छ। SSE वा AI response streaming को लागि उपयोगी।",
        jp: "`ReadableStream` ボディの `Response` を返すことでストリーミングが可能です。SSE や AI レスポンスのストリーミングに活用できます。",
      },
    },
    {
      question: {
        en: "How do I handle CORS in Route Handlers?",
        np: "Route Handlers मा CORS कसरी handle गर्ने?",
        jp: "Route Handlers で CORS を設定するには？",
      },
      answer: {
        en: "Set CORS headers manually on the response, or handle the `OPTIONS` preflight request by exporting an `OPTIONS` function. For a global CORS policy, use `next.config.js` headers configuration or a `middleware.ts` that appends `Access-Control-Allow-Origin` and related headers to every matching response.",
        np: "Response मा manually CORS headers set गर्नुहोस् वा `OPTIONS` function export गर्नुहोस्। Global policy को लागि `middleware.ts` मा headers थप्नुहोस्।",
        jp: "レスポンスに手動で CORS ヘッダーを設定するか `OPTIONS` 関数をエクスポートします。グローバルポリシーは `middleware.ts` で管理できます。",
      },
    },
    {
      question: {
        en: "Should business logic live in the route handler or a separate service layer?",
        np: "Business logic route handler मा राख्ने कि service layer मा?",
        jp: "ビジネスロジックはルートハンドラに置くべきですか、サービス層に分けるべきですか？",
      },
      answer: {
        en: "For small projects, keeping logic in the handler is fine. As your app grows, extract business logic into **service functions** in a `lib/` or `services/` folder. Route handlers should then only handle HTTP concerns: parsing the request, calling the service, and serialising the response. This makes the logic testable without spinning up an HTTP server and reusable from Server Actions.",
        np: "सानो project को लागि handler मा राख्न ठीक छ। बड्दो project मा `lib/` वा `services/` मा business logic extract गर्नुहोस् — testable र reusable हुन्छ।",
        jp: "小規模なら handler 内で問題ありません。成長に伴い `lib/` や `services/` にロジックを抽出すると、テストや再利用が容易になります。",
      },
    },
  ],
};
