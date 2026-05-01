import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_7_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Prisma** is a type-safe ORM for Node.js and TypeScript. It consists of three parts: the **Prisma CLI** (migration and codegen), the **Prisma Schema** (`schema.prisma` — your single source of truth for models), and **Prisma Client** (the auto-generated, fully-typed query builder). In a Next.js project you store the client in a singleton to avoid exhausting database connections during hot reload in development.",
      np: "Prisma एक type-safe ORM हो। CLI, Schema (`schema.prisma`), र Client — तीन भाग। Next.js मा development hot reload को कारण connection exhaust नगर्न singleton pattern प्रयोग गरिन्छ।",
      jp: "Prisma は型安全な ORM です。CLI・スキーマ・クライアントの 3 要素で構成され、Next.js では hot reload による接続枯渇を防ぐためシングルトンパターンを使います。",
    },
  ],
  sections: [
    {
      title: {
        en: "Schema & migrations",
        np: "Schema र migrations",
        jp: "スキーマとマイグレーション",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Run **`npm install prisma @prisma/client`** then **`npx prisma init`** to scaffold `prisma/schema.prisma` and a `.env` file with `DATABASE_URL`. Define your models in the schema, then run **`npx prisma migrate dev --name <description>`** to generate a SQL migration, apply it to the database, and regenerate Prisma Client in one step.",
            np: "`npm install prisma @prisma/client` र `npx prisma init` गर्नुहोस्। `schema.prisma` मा model define गरेर `npx prisma migrate dev` चलाउनुहोस्।",
            jp: "`npm install prisma @prisma/client` と `npx prisma init` でセットアップ。モデルを定義後 `npx prisma migrate dev` で migration 生成・適用・クライアント再生成を一括実行。",
          },
        },
        {
          type: "diagram",
          id: "nextjs-prisma-workflow",
        },
        {
          type: "code",
          title: {
            en: "prisma/schema.prisma — datasource, generator, and models",
            np: "schema.prisma उदाहरण",
            jp: "schema.prisma の例",
          },
          code: `// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"        // or "postgresql", "sqlite"
  url      = env("DATABASE_URL")
}

model Product {
  id          Int       @id @default(autoincrement())
  name        String    @db.VarChar(255)
  price       Float
  inStock     Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  category    Category? @relation(fields: [categoryId], references: [id])
  categoryId  Int?
}

model Category {
  id       Int       @id @default(autoincrement())
  name     String    @unique
  products Product[]
}`,
        },
        {
          type: "code",
          title: {
            en: "Running migrations and common Prisma CLI commands",
            np: "Migration commands",
            jp: "Migration と主要 CLI コマンド",
          },
          code: `# Create .env + prisma/schema.prisma scaffold
npx prisma init

# Apply schema changes to DB + regenerate client
npx prisma migrate dev --name add_product_table

# Apply migrations without generating a new one (CI / production)
npx prisma migrate deploy

# Open Prisma Studio (visual DB browser)
npx prisma studio

# Regenerate Prisma Client after manual schema edits
npx prisma generate

# Reset the database (drops all data — dev only!)
npx prisma migrate reset`,
        },
        {
          type: "table",
          caption: {
            en: "Common Prisma field attributes",
            np: "Prisma field attributes",
            jp: "主要な Prisma フィールド属性",
          },
          headers: [
            { en: "Attribute", np: "Attribute", jp: "属性" },
            { en: "Purpose", np: "उद्देश्य", jp: "用途" },
          ],
          rows: [
            [
              { en: "`@id`", np: "`@id`", jp: "`@id`" },
              { en: "Marks the primary key field", np: "Primary key चिन्ह", jp: "主キーのマーク" },
            ],
            [
              { en: "`@default(autoincrement())`", np: "`@default(autoincrement())`", jp: "`@default(autoincrement())`" },
              { en: "Auto-incrementing integer ID", np: "Auto-increment ID", jp: "自動増分 ID" },
            ],
            [
              { en: "`@unique`", np: "`@unique`", jp: "`@unique`" },
              { en: "Adds a unique constraint", np: "Unique constraint", jp: "ユニーク制約を追加" },
            ],
            [
              { en: "`@default(now())`", np: "`@default(now())`", jp: "`@default(now())`" },
              { en: "Sets current timestamp on insert", np: "Insert मा timestamp set", jp: "挿入時に現在時刻を設定" },
            ],
            [
              { en: "`@updatedAt`", np: "`@updatedAt`", jp: "`@updatedAt`" },
              { en: "Auto-updates timestamp on every save", np: "Save मा timestamp update", jp: "保存のたびに timestamp を自動更新" },
            ],
            [
              { en: "`@relation`", np: "`@relation`", jp: "`@relation`" },
              { en: "Defines a foreign-key relationship", np: "Foreign key सम्बन्ध", jp: "外部キーリレーションを定義" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Prisma Client singleton",
        np: "Prisma Client singleton",
        jp: "Prisma Client シングルトン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "In development, Next.js hot-reloads modules on every file save. Without a singleton, each reload would create a new `PrismaClient` instance and open a new database connection pool — eventually you'd hit the database's connection limit. The standard fix is to store the client on the Node.js **`globalThis`** object, which survives hot reloads.",
            np: "Development hot reload मा हरेक save मा नयाँ `PrismaClient` बन्छ र connection exhaust हुन्छ। `globalThis` मा store गरेर singleton बनाइन्छ।",
            jp: "開発中の hot reload で `PrismaClient` が大量生成されないよう、`globalThis` にシングルトンを保持します。",
          },
        },
        {
          type: "code",
          title: {
            en: "lib/db.ts — PrismaClient singleton",
            np: "lib/db.ts singleton pattern",
            jp: "lib/db.ts シングルトンパターン",
          },
          code: `import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "In production, the module is loaded once and the `PrismaClient` is instantiated once — the `globalThis` trick is only needed in development. Import `prisma` from this file everywhere in your app.",
            np: "Production मा module एक पटक load हुन्छ, `globalThis` trick development मा मात्र चाहिन्छ। App भरि `@/lib/db` बाट `prisma` import गर्नुहोस्।",
            jp: "本番環境ではモジュールは一度しかロードされません。`globalThis` はあくまで開発用の対策です。",
          },
        },
      ],
    },
    {
      title: {
        en: "CRUD operations",
        np: "CRUD operations",
        jp: "CRUD 操作",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Prisma Client methods follow the pattern `prisma.<model>.<operation>()`. All methods are **async** and return fully-typed results. The model name in the client matches the lowercase version of your schema model name.",
            np: "Prisma Client methods: `prisma.<model>.<operation>()` — सबै async र fully typed।",
            jp: "Prisma のメソッドは `prisma.<model>.<operation>()` の形式で、すべて async かつ完全に型付けされています。",
          },
        },
        {
          type: "code",
          title: {
            en: "Full CRUD example — products",
            np: "Products CRUD उदाहरण",
            jp: "Products の CRUD 全操作例",
          },
          code: `import { prisma } from "@/lib/db";

// ─── READ ───────────────────────────────────────────────

// All products, ordered by createdAt
const products = await prisma.product.findMany({
  orderBy: { createdAt: "desc" },
  take: 20,         // limit
  skip: 0,          // offset
});

// Single product by primary key (null if not found)
const product = await prisma.product.findUnique({
  where: { id: 1 },
});

// First product matching a condition (null if not found)
const cheap = await prisma.product.findFirst({
  where: { price: { lt: 10 } },
});

// Products in a category with relation included
const withCategory = await prisma.product.findMany({
  where: { inStock: true },
  include: { category: true },   // eager-load relation
});

// ─── CREATE ─────────────────────────────────────────────

const newProduct = await prisma.product.create({
  data: {
    name: "Wireless Mouse",
    price: 29.99,
    inStock: true,
  },
});

// ─── UPDATE ─────────────────────────────────────────────

const updated = await prisma.product.update({
  where: { id: newProduct.id },
  data: { price: 24.99, inStock: false },
});

// ─── DELETE ─────────────────────────────────────────────

await prisma.product.delete({
  where: { id: newProduct.id },
});

// ─── AGGREGATE ──────────────────────────────────────────

const stats = await prisma.product.aggregate({
  _count: true,
  _avg: { price: true },
  _min: { price: true },
  _max: { price: true },
});`,
        },
      ],
    },
    {
      title: {
        en: "Common Prisma patterns",
        np: "Common Prisma patterns",
        jp: "よく使う Prisma パターン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Handle Prisma errors by catching **`PrismaClientKnownRequestError`**. The `code` property maps to Prisma error codes — for example `P2025` means 'Record not found' and `P2002` means 'Unique constraint violation'. Use **transactions** (`prisma.$transaction([...])`) when you need multiple writes to succeed or fail together.",
            np: "`PrismaClientKnownRequestError` catch गर्नुहोस्। `P2025` = record not found, `P2002` = unique constraint। Multiple writes को लागि `prisma.$transaction` प्रयोग गर्नुहोस्।",
            jp: "`PrismaClientKnownRequestError` でエラーを処理します。`P2025` はレコード未検出、`P2002` はユニーク制約違反。複数の書き込みには `prisma.$transaction` を使います。",
          },
        },
        {
          type: "code",
          title: {
            en: "Error handling and transactions",
            np: "Error handling र transactions",
            jp: "エラーハンドリングとトランザクション",
          },
          code: `import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

// ─── ERROR HANDLING ──────────────────────────────────────

async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      // Record not found — return 404 to the caller
      return null;
    }
    throw error; // Re-throw unexpected errors
  }
}

// ─── TRANSACTION ─────────────────────────────────────────

// Sequential transaction — operations run in order
async function transferStock(fromId: number, toId: number, qty: number) {
  await prisma.$transaction([
    prisma.product.update({
      where: { id: fromId },
      data: { stock: { decrement: qty } },
    }),
    prisma.product.update({
      where: { id: toId },
      data: { stock: { increment: qty } },
    }),
  ]);
}

// Interactive transaction — more control (e.g. read-then-write)
async function purchaseProduct(productId: number, userId: number) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
    });
    if (!product || !product.inStock) {
      throw new Error("Product unavailable");
    }
    await tx.product.update({
      where: { id: productId },
      data: { inStock: false },
    });
    return tx.order.create({
      data: { productId, userId },
    });
  });
}`,
        },
        {
          type: "code",
          title: {
            en: "Seeding the database — prisma/seed.ts",
            np: "Database seeding",
            jp: "データベースシーディング",
          },
          code: `// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [{ name: "Electronics" }, { name: "Clothing" }],
    skipDuplicates: true,
  });

  const electronics = await prisma.category.findFirst({
    where: { name: "Electronics" },
  });

  await prisma.product.createMany({
    data: [
      { name: "Keyboard", price: 79.99, categoryId: electronics!.id },
      { name: "Monitor", price: 349.0, categoryId: electronics!.id },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

// Add to package.json:
// "prisma": { "seed": "ts-node prisma/seed.ts" }
// Then run: npx prisma db seed`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why do I need the PrismaClient singleton pattern?",
        np: "PrismaClient singleton किन चाहिन्छ?",
        jp: "PrismaClient のシングルトンパターンが必要な理由は？",
      },
      answer: {
        en: "Next.js uses **hot module replacement (HMR)** in development — every time you save a file, modified modules are re-evaluated. Without a singleton, each re-evaluation creates a new `PrismaClient` instance that opens its own connection pool. Most databases (MySQL, PostgreSQL) have a hard cap on simultaneous connections. The `globalThis` singleton ensures the same instance is reused between HMR cycles, keeping your connection count at 1 during development.",
        np: "Development मा HMR ले हरेक save मा module re-evaluate गर्छ, नयाँ `PrismaClient` बन्छ र connection pool बढ्छ। `globalThis` singleton ले connection count 1 मा राख्छ।",
        jp: "開発時の HMR でファイルを保存するたびにモジュールが再評価され、新しい `PrismaClient` が作られます。`globalThis` シングルトンでインスタンスを使い回し、接続数を 1 に保ちます。",
      },
    },
    {
      question: {
        en: "Can I use Prisma with PostgreSQL instead of MySQL?",
        np: "MySQL को सट्टा PostgreSQL प्रयोग गर्न सकिन्छ?",
        jp: "MySQL の代わりに PostgreSQL を使えますか？",
      },
      answer: {
        en: "Yes. Change the `provider` in `schema.prisma` to `\"postgresql\"` and update `DATABASE_URL` to the Postgres connection string format (`postgresql://user:password@host:5432/dbname`). Prisma abstracts away most dialect differences — most queries are identical. Some field attributes like `@db.VarChar` are provider-specific, but the rest of your schema stays the same. Prisma also supports SQLite (great for local dev without a server), MongoDB, CockroachDB, and Microsoft SQL Server.",
        np: "`schema.prisma` मा `provider = \"postgresql\"` र connection string अपडेट गर्नुहोस्। SQLite, MongoDB, CockroachDB पनि supported छन्।",
        jp: "`provider = \"postgresql\"` に変更し `DATABASE_URL` を Postgres 形式に更新するだけです。SQLite、MongoDB、CockroachDB も対応しています。",
      },
    },
    {
      question: {
        en: "How do I seed the database?",
        np: "Database कसरी seed गर्ने?",
        jp: "データベースをシードするには？",
      },
      answer: {
        en: "Create a `prisma/seed.ts` file and add a `prisma.seed` script in `package.json` pointing to it: `\"seed\": \"ts-node prisma/seed.ts\"`. Then run **`npx prisma db seed`**. The seed script runs with its own `PrismaClient` instance (no singleton needed) and you can use `createMany` with `skipDuplicates: true` to make it idempotent.",
        np: "`prisma/seed.ts` बनाउनुहोस् र `package.json` मा seed script add गर्नुहोस्। `npx prisma db seed` ले run हुन्छ।",
        jp: "`prisma/seed.ts` を作り `package.json` の `prisma.seed` にポイントします。`npx prisma db seed` で実行できます。",
      },
    },
    {
      question: {
        en: "What happens if I rename a field in the schema?",
        np: "Schema मा field rename गरे के हुन्छ?",
        jp: "スキーマでフィールド名を変更するとどうなりますか？",
      },
      answer: {
        en: "Prisma will generate a migration that **drops the old column and adds a new one**, which means the data in that column is lost. To safely rename, use `prisma migrate dev` to create the migration file, then manually edit the SQL to use `ALTER TABLE RENAME COLUMN` (PostgreSQL) or the equivalent, and apply it. Alternatively use the `@map` attribute to rename the Prisma field while keeping the database column name unchanged.",
        np: "Prisma ले old column drop गरेर new column add गर्छ — data loss हुन्छ। Safe rename को लागि migration SQL manually edit गर्नुहोस् वा `@map` attribute प्रयोग गर्नुहोस्।",
        jp: "Prisma は古いカラムを削除して新しいカラムを追加するため、データが失われます。安全にリネームするには migration SQL を手動編集するか `@map` 属性を使います。",
      },
    },
    {
      question: {
        en: "How do Prisma relations work?",
        np: "Prisma relations कसरी काम गर्छ?",
        jp: "Prisma のリレーションはどのように機能しますか？",
      },
      answer: {
        en: "Declare relations using the `@relation` attribute that references the foreign key field(s). Prisma creates two sides of the relation — a scalar foreign key field (e.g. `categoryId Int?`) and a relation field (e.g. `category Category?`). The relation field is virtual — it exists only in the Prisma schema, not as a database column. Use `include: { category: true }` in queries to eager-load the relation, or `select` to pick specific fields.",
        np: "`@relation` attribute ले foreign key define गर्छ। Relation field virtual हो — database column होइन। `include` ले eager-load गर्न सकिन्छ।",
        jp: "`@relation` で外部キーを定義します。リレーションフィールドは仮想（DB カラムなし）。`include` でイーガーロードできます。",
      },
    },
    {
      question: {
        en: "What is the difference between `findUnique` and `findFirst`?",
        np: "`findUnique` र `findFirst` मा के फरक छ?",
        jp: "`findUnique` と `findFirst` の違いは？",
      },
      answer: {
        en: "**`findUnique`** only accepts `where` conditions on `@id` or `@unique` fields. It is guaranteed to return at most one record and generates a SQL query with a unique constraint lookup. **`findFirst`** accepts any `where` condition (including non-unique fields) and returns the first matching row. `findFirst` supports `orderBy` and `skip`; `findUnique` does not. Use `findUnique` when you have a unique identifier — it is slightly more efficient and semantically clearer.",
        np: "`findUnique` ले `@id` वा `@unique` field मात्र accept गर्छ। `findFirst` ले जुनसुकै condition accept गर्छ। Unique identifier भएमा `findUnique` प्रयोग गर्नुहोस्।",
        jp: "`findUnique` は `@id` や `@unique` フィールドのみ受け付けます。`findFirst` は任意の条件を受け付け `orderBy` や `skip` もサポートします。ユニーク識別子があるなら `findUnique` が明確で効率的です。",
      },
    },
  ],
};
