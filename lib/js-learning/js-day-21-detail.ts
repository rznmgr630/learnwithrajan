import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_21_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "TypeScript adds a type system on top of JavaScript. It catches type errors at compile time — before your code runs — and gives you better IDE autocomplete, refactoring support, and self-documenting interfaces. TypeScript compiles to plain JavaScript, so it works anywhere JavaScript runs.",
      np: "TypeScript ले JavaScript माथि type system add गर्छ। Type errors compile time मा — code run हुनु अघि — catch गर्छ। Better IDE autocomplete, refactoring support, र self-documenting interfaces दिन्छ। TypeScript plain JavaScript मा compile हुन्छ।",
      jp: "TypeScriptはJavaScriptに型システムを追加する。型エラーをコンパイル時（コード実行前）に検出。より良いIDEの自動補完・リファクタリング・自己文書化されたインターフェースを提供。TypeScriptは普通のJavaScriptにコンパイルされる。",
    },
    {
      en: "You do not need to know every TypeScript feature to be productive — the 20% of features that cover 80% of real-world code are: basic types, interfaces, generics, and the utility types (`Partial`, `Required`, `Pick`, `Omit`, `Record`). That is what today covers.",
      np: "Productive हुन हर TypeScript feature जान्नु पर्दैन — 80% real-world code cover गर्ने 20% features: basic types, interfaces, generics, र utility types (`Partial`, `Required`, `Pick`, `Omit`, `Record`)। आज यही cover गरिन्छ।",
      jp: "生産的になるために全TypeScript機能を覚える必要はない — 実際のコードの80%をカバーする20%の機能: 基本型・インターフェース・ジェネリクス・ユーティリティ型が今日の内容。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "BwuLxPH8IDs", title: "TypeScript Course for Beginners" },
      ],
    },
    {
      title: { en: "Basic types and type annotations", np: "Basic types र type annotations", jp: "基本型と型アノテーション" },
      blocks: [
        {
          type: "code",
          title: { en: "Annotating variables, functions and objects", np: "Variables, functions र objects annotate गर्नु", jp: "変数・関数・オブジェクトの型注釈" },
          code: `// ── Primitive types ────────────────────────────────────────────────
let name: string  = "Alice";
let age:  number  = 30;
let isAdmin: boolean = false;

// ── Arrays ────────────────────────────────────────────────────────
let scores: number[]       = [90, 85, 92];
let tags:   Array<string>  = ["ts", "js"];  // generic syntax — same result

// ── Tuple — fixed-length array with specific types at each index ──
let point: [number, number] = [10, 20];
let entry: [string, number] = ["age", 30];

// ── Union types — one OR the other ────────────────────────────────
let id: string | number = 42;
id = "abc123";  // also valid

function printId(id: string | number) {
  // TypeScript forces you to narrow the type before using string-only methods
  if (typeof id === "string") {
    console.log(id.toUpperCase());  // ✅ safe — narrowed to string
  } else {
    console.log(id.toFixed(2));     // ✅ safe — narrowed to number
  }
}

// ── Literal types — only specific values allowed ──────────────────
type Direction = "north" | "south" | "east" | "west";
type StatusCode = 200 | 201 | 400 | 404 | 500;

let heading: Direction = "north";
// heading = "up";  // ❌ Error: not assignable to type Direction

// ── Function type annotations ─────────────────────────────────────
function add(a: number, b: number): number {
  return a + b;
}

// Optional parameter with ?
function greet(name: string, greeting?: string): string {
  return \`\${greeting ?? "Hello"}, \${name}\`;
}

// Default parameters infer the type from the default value
function repeat(str: string, times = 1) {  // times is inferred as number
  return str.repeat(times);
}

// ── void — function that returns nothing ──────────────────────────
function logError(message: string): void {
  console.error(message);
  // returning a value here would be a type error
}

// ── unknown vs any ────────────────────────────────────────────────
// any — opts out of type checking (avoid — it defeats the purpose)
let danger: any = "hello";
danger.toUpperCase();   // no error — TS trusts you
danger.nonExistent();   // no error — dangerous!

// unknown — type-safe alternative to any
let value: unknown = fetchSomething();
// value.toUpperCase();  // ❌ Error — must narrow first
if (typeof value === "string") {
  value.toUpperCase();  // ✅ safe — narrowed
}`,
        },
      ],
    },
    {
      title: { en: "Interfaces and type aliases", np: "Interfaces र type aliases", jp: "インターフェースと型エイリアス" },
      blocks: [
        {
          type: "code",
          title: { en: "Defining object shapes with interface and type", np: "interface र type सँग object shapes define गर्नु", jp: "interfaceとtypeでオブジェクトの形を定義" },
          code: `// ── interface — describe object shape ─────────────────────────────
interface User {
  id:         number;
  name:       string;
  email:      string;
  role?:      "admin" | "user";  // optional property
  readonly createdAt: Date;       // cannot be changed after creation
}

// ── type alias — same result for object types ──────────────────────
type Product = {
  id:    string;
  name:  string;
  price: number;
};

// ── interface vs type: which to use? ──────────────────────────────
// interface: use for objects and classes — can be extended/merged
// type: use for unions, tuples, primitives, and computed types
// For plain objects either works — prefer interface when in doubt

// ── Extending interfaces ───────────────────────────────────────────
interface Animal {
  name: string;
  speak(): void;
}

interface Dog extends Animal {
  breed: string;
  fetch(): void;
}

// ── Intersection types — combine multiple types ────────────────────
type Admin = User & { adminLevel: 1 | 2 | 3 };

// ── Index signatures — objects with dynamic keys ───────────────────
interface StringMap {
  [key: string]: string;  // any string key, string value
}

const translations: StringMap = {
  hello: "नमस्ते",
  bye:   "बिदाई",
};

// ── Function types ────────────────────────────────────────────────
interface Formatter {
  (value: number, decimals?: number): string;
}

const formatPrice: Formatter = (n, d = 2) => n.toFixed(d);

// ── Class implementing an interface ──────────────────────────────
interface Serializable {
  serialize(): string;
  deserialize(data: string): void;
}

class Config implements Serializable {
  private data: Record<string, unknown> = {};

  serialize(): string { return JSON.stringify(this.data); }
  deserialize(data: string): void { this.data = JSON.parse(data); }
}`,
        },
      ],
    },
    {
      title: { en: "Generics", np: "Generics", jp: "ジェネリクス" },
      blocks: [
        {
          type: "code",
          title: { en: "Write reusable code that works with any type", np: "Any type सँग काम गर्ने reusable code लेख्नु", jp: "任意の型で動く再利用可能なコードを書く" },
          code: `// ── Without generics — not type-safe ────────────────────────────
function getFirstAny(arr: any[]): any { return arr[0]; }
const first = getFirstAny([1, 2, 3]);
// first is typed as 'any' — TypeScript cannot help you here

// ── With generics — fully type-safe ──────────────────────────────
function getFirst<T>(arr: T[]): T { return arr[0]; }

const num  = getFirst([1, 2, 3]);       // T = number — inferred automatically
const str  = getFirst(["a", "b", "c"]); // T = string
const user = getFirst<User>([alice]);   // T = User — explicitly specified

// ── Generic interfaces and classes ────────────────────────────────
interface ApiResponse<T> {
  data:    T;
  status:  number;
  message: string;
}

type UsersResponse    = ApiResponse<User[]>;
type ProductResponse  = ApiResponse<Product>;

async function fetchUsers(): Promise<ApiResponse<User[]>> {
  const res = await fetch("/api/users");
  return res.json();
}

// ── Generic constraints — T must have certain properties ──────────
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 30 };
getProperty(user, "name");  // "Alice" — return type is string
getProperty(user, "age");   // 30 — return type is number
// getProperty(user, "email");  // ❌ "email" doesn't exist on user

// ── Multiple type parameters ───────────────────────────────────────
function merge<A, B>(a: A, b: B): A & B {
  return { ...a, ...b } as A & B;
}

const merged = merge({ name: "Alice" }, { age: 30 });
merged.name;  // ✅ string
merged.age;   // ✅ number`,
        },
      ],
    },
    {
      title: { en: "Utility types", np: "Utility types", jp: "ユーティリティ型" },
      blocks: [
        {
          type: "code",
          title: { en: "The most useful built-in TypeScript utility types", np: "सबैभन्दा useful built-in TypeScript utility types", jp: "最も使われるTypeScript組み込みユーティリティ型" },
          code: `interface User {
  id:       number;
  name:     string;
  email:    string;
  password: string;
  role:     "admin" | "user";
  createdAt: Date;
}

// ── Partial<T> — all properties become optional ────────────────────
// Perfect for update/patch operations
type UserUpdate = Partial<User>;
function updateUser(id: number, changes: UserUpdate) { /* ... */ }
updateUser(1, { name: "Bob" });          // only provide what changed

// ── Required<T> — all properties become required ──────────────────
type CompleteUser = Required<User>;      // removes all ? optionals

// ── Pick<T, K> — keep only the listed properties ──────────────────
type UserProfile = Pick<User, "id" | "name" | "email">;
// { id: number; name: string; email: string }
// Use for API response shaping — never return the password

// ── Omit<T, K> — remove listed properties ─────────────────────────
type PublicUser = Omit<User, "password" | "createdAt">;
// { id: number; name: string; email: string; role: "admin" | "user" }

// ── Record<K, V> — object with specific key and value types ────────
type RolePermissions = Record<"admin" | "user", string[]>;
const permissions: RolePermissions = {
  admin: ["read", "write", "delete"],
  user:  ["read"],
};

type IdMap = Record<string, User>;      // string keys → User values

// ── ReturnType<T> — extract the return type of a function ─────────
function createUser(name: string, email: string) {
  return { id: Date.now(), name, email };
}
type NewUser = ReturnType<typeof createUser>;
// { id: number; name: string; email: string }

// ── Readonly<T> — all properties cannot be reassigned ─────────────
type FrozenUser = Readonly<User>;
const user: FrozenUser = { id: 1, name: "Alice", /* ... */ };
// user.name = "Bob";  // ❌ Error: cannot assign to 'name' — it is read-only

// ── NonNullable<T> — removes null and undefined ────────────────────
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;  // string

// ── Combining utility types ────────────────────────────────────────
type CreateUserInput = Omit<User, "id" | "createdAt">;
type UpdateUserInput = Partial<Omit<User, "id" | "createdAt">>;`,
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "What is the difference between interface and type in TypeScript?", np: "TypeScript मा interface र type मा के फरक?", jp: "TypeScriptのinterfaceとtypeの違いは？" },
      answer: {
        en: "For object shapes, they are almost identical and can often be used interchangeably. The key differences: (1) `interface` can be extended with `extends` and can be re-declared to merge declarations (declaration merging) — useful for augmenting third-party library types; (2) `type` can represent unions, tuples, primitive aliases, and computed types that `interface` cannot. Practical rule: use `interface` for objects and class contracts, use `type` for unions, mapped types, and utility-type combinations.",
        np: "Object shapes का लागि लगभग identical — interchange गर्न सकिन्छ। Key differences: (1) `interface` `extends` गर्न र re-declare गर्न (declaration merging) सकिन्छ; (2) `type` unions, tuples, primitives, र computed types represent गर्न सक्छ। Rule: objects/classes का लागि `interface`, unions/mapped types का लागि `type`।",
        jp: "オブジェクトの形については概ね互換。主な違い: (1)`interface`は`extends`による継承と再宣言マージが可能; (2)`type`はユニオン・タプル・プリミティブエイリアス・計算型が表現可能。実践ルール: オブジェクト/クラスには`interface`、ユニオン/マップ型には`type`。",
      },
    },
    {
      question: { en: "What does `unknown` mean and when should I use it instead of `any`?", np: "`unknown` भनेको के हो र `any` को सट्टा कहिले use गर्ने?", jp: "`unknown`の意味と`any`の代わりに使う場面は？" },
      answer: {
        en: "`any` completely disables type checking for a variable — you can call any method, access any property, and TypeScript will not complain. `unknown` is the type-safe alternative: you can assign anything to it, but you cannot use it without first narrowing the type (using `typeof`, `instanceof`, or a type guard). Use `unknown` for values from external sources (API responses, user input, `JSON.parse`) — it forces you to validate before using. Use `any` only as a last resort when migrating JavaScript to TypeScript and you temporarily cannot type something.",
        np: "`any` ले variable को type checking completely disable गर्छ। `unknown` type-safe alternative हो: assign गर्न सकिन्छ तर type narrow नगरी use गर्न मिल्दैन। External sources (API responses, user input, `JSON.parse`) का लागि `unknown` — use गर्नु अगाडि validate गर्न force गर्छ। `any` last resort मात्र।",
        jp: "`any`は型チェックを完全に無効化。`unknown`はtype-safeな代替: 代入はできるが型を絞り込まないと使えない。外部ソース（APIレスポンス・ユーザー入力・JSON.parse）には`unknown`を使い、使用前の検証を強制する。`any`はJSからTSへの移行時の最後の手段として。",
      },
    },
    {
      question: { en: "When should I use generics?", np: "Generics कहिले use गर्ने?", jp: "ジェネリクスをいつ使うべきか？" },
      answer: {
        en: "Use generics when you have a function, class, or interface that works the same way regardless of the specific type — but you want the type information to flow through correctly. Classic examples: `Array<T>`, `Promise<T>`, `Map<K,V>`. You need generics when you find yourself writing the same function twice for different types, or when using `any` loses type information you want to preserve. The signal: if the return type depends on the input type, you likely need a generic.",
        np: "Generics use गर्नुहोस् जब specific type जे भए पनि same तरिकाले काम गर्ने function/class/interface छ — तर type information correctly flow हुनुपर्छ। Classic examples: `Array<T>`, `Promise<T>`, `Map<K,V>`. Return type input type मा depend गर्छ भने likely generic चाहिन्छ।",
        jp: "ジェネリクスは、具体的な型に関わらず同じ動作をする関数/クラス/インターフェースで型情報を正確に伝えたい時に使う。定番例: `Array<T>`・`Promise<T>`・`Map<K,V>`。戻り値の型が入力型に依存する場合がジェネリクスのシグナル。",
      },
    },
  ],
};
