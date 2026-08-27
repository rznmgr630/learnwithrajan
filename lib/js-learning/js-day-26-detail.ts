import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_26_DETAIL: RoadmapDayDetail = {
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
      title: { en: "Basic types, inference and narrowing", np: "आधारभूत type, inference र narrowing", jp: "基本の型・推論・絞り込み" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>TypeScript</b> is a static type system layered on top of JavaScript. It describes what kind of values your variables, functions and APIs are expected to hold, and catches a large class of mistakes before the code runs. The goal is not to annotate everything — it is to make <b>contracts explicit</b>, improve editor help, and make refactoring safe.",
            np: "<b>TypeScript</b> JavaScript माथि राखिएको static type system हो। तपाईंका variable, function र API ले कस्ता मान बोक्ने अपेक्षा छ भन्ने वर्णन गर्छ, र code चल्नुअघि नै धेरै गल्ती समात्छ। लक्ष्य सबैतिर annotation थप्नु होइन — <b>सम्झौता स्पष्ट</b> बनाउनु, editor को सहयोग बढाउनु र refactor सुरक्षित बनाउनु हो।",
            jp: "<b>TypeScript</b> はJavaScriptの上に載る静的型システム。変数・関数・APIがどんな値を持つ想定かを記述し、実行前に多くの誤りを捕まえる。目的はあらゆる場所に注釈を足すことではなく、<b>契約を明示</b>し、エディタの支援を強め、リファクタリングを安全にすること。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "Much of the time you do not need an annotation at all: `const name = \"Alice\"` is already `string`. Annotate when the type communicates a contract or removes ambiguity. A <b>union</b> such as `string | number` says a value may be either, and TypeScript then refuses operations that are not valid for both until you <b>narrow</b> it with a check like `typeof id === \"string\"`. <b>Literal types</b> take this further: `type Status = \"pending\" | \"success\" | \"failed\"` accepts those three strings and nothing else.",
            np: "धेरैजसो बेला annotation चाहिँदैन: `const name = \"Alice\"` पहिले नै `string` हो। Type ले सम्झौता बताउँछ वा अस्पष्टता हटाउँछ भने मात्र annotate गर्नुहोस्। `string | number` जस्तो <b>union</b> ले मान दुबैमध्ये हुन सक्छ भन्छ, र `typeof id === \"string\"` जस्तो जाँचले <b>narrow</b> नगरेसम्म TypeScript ले दुबैका लागि मान्य नहुने operation अस्वीकार गर्छ। <b>Literal type</b> ले अझ अगाडि लैजान्छ: `type Status = \"pending\" | \"success\" | \"failed\"` ले ती तीन string मात्र लिन्छ।",
            jp: "多くの場合、注釈は不要。`const name = \"Alice\"` はすでに `string` になる。型が契約を伝えるときや曖昧さを消すときに注釈する。`string | number` のような<b>ユニオン</b>は値がどちらでもありうることを示し、`typeof id === \"string\"` のような判定で<b>絞り込む</b>まで、両方に有効でない操作は拒まれる。<b>リテラル型</b>はさらに厳しく、`type Status = \"pending\" | \"success\" | \"failed\"` はその3つの文字列しか受け付けない。",
          },
        },
        {
          type: "code",
          title: { en: "Inference, unions, narrowing and literal types", np: "Inference, union, narrowing र literal type", jp: "推論・ユニオン・絞り込み・リテラル型" },
          code: `// ── Let inference do the work ─────────────────────────────────────
const name = "Alice";     // string
const age = 30;           // number
const active = true;      // boolean

// Annotate when it states a contract, not to restate the obvious
const scores: number[] = [90, 85, 92];
const tags: Array<string> = ["javascript", "typescript"];

// ── Tuples — position carries meaning ─────────────────────────────
const point: [number, number] = [10, 20];
const entry: [string, number] = ["age", 30];

// ── Unions and narrowing ──────────────────────────────────────────
function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());   // narrowed to string here
  } else {
    console.log(id.toFixed(2));      // narrowed to number here
  }
}

//   string | number
//         │
//   typeof id === "string"
//         │
//    ┌────┴────┐
//    ▼         ▼
//  string    number

// ── Literal types — only these values ─────────────────────────────
type Direction = "north" | "south" | "east" | "west";

let heading: Direction = "north";
// heading = "up";   // Error: not assignable to Direction

// ── Functions — parameters and return ─────────────────────────────
function add(a: number, b: number): number {
  return a + b;
}

function greet(name: string, greeting?: string): string {
  return \`\${greeting ?? "Hello"}, \${name}\`;
}

function repeat(text: string, times = 1) {   // times inferred as number
  return text.repeat(times);
}`,
        },
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
        { type: "youtube", videoId: "BwuLxPH8IDs", title: "TypeScript Course for Beginners" },
      ],
    },
    {
      title: { en: "`any` vs `unknown` — where type safety goes to die", np: "`any` vs `unknown` — type safety कहाँ मर्छ", jp: "`any` と `unknown` — 型安全が失われる場所" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`any` tells TypeScript \"trust me, do not check this\". Every property access and method call on an `any` compiles, including the ones that will throw at runtime, so a single `any` can quietly disable checking across a whole call chain. `unknown` is the safe counterpart: it accepts any value but lets you do nothing with it until you <b>prove</b> the type by narrowing. Reach for `unknown` at the edges of your program — parsed JSON, a `catch` binding, a third-party payload — and narrow inward.",
            np: "`any` ले TypeScript लाई \"मलाई विश्वास गर, यो नजाँच\" भन्छ। `any` मा हरेक property पहुँच र method call compile हुन्छ, runtime मा error दिनेहरू पनि, त्यसैले एउटै `any` ले पूरै call chain मा जाँच चुपचाप बन्द गर्न सक्छ। `unknown` सुरक्षित जोडी हो: यसले जुनसुकै मान लिन्छ तर narrow गरेर type <b>प्रमाणित</b> नगरेसम्म केही गर्न दिँदैन। Program का किनारमा — parse भएको JSON, `catch` को binding, तेस्रो पक्षको payload — `unknown` प्रयोग गरी भित्रतिर narrow गर्नुहोस्।",
            jp: "`any` は「信じて、確認しないで」とTypeScriptに告げる。`any` に対するプロパティ参照もメソッド呼び出しもすべて通る。実行時に落ちるものまで通るので、たった1つの `any` が呼び出し連鎖全体の検査を黙って無効にしうる。`unknown` は安全な対になる型で、どんな値も受けるが、絞り込んで型を<b>証明</b>するまで何もさせない。パースしたJSON・`catch` の束縛・外部のペイロードなど、プログラムの境界では `unknown` を使い、内側へ向けて絞り込む。",
          },
        },
        {
          type: "code",
          title: { en: "Why one is safe and the other is not", np: "एउटा किन सुरक्षित छ र अर्को किन छैन", jp: "一方が安全で他方が安全でない理由" },
          code: `// ── any — checking is switched off ────────────────────────────────
let loose: any = "hello";

loose.toUpperCase();      // fine
loose.doesNotExist();     // also compiles, throws at runtime
loose.a.b.c;              // also compiles

// ── unknown — you must prove the type first ───────────────────────
let value: unknown = JSON.parse(input);

// value.toUpperCase();   // Error: 'value' is of type 'unknown'

if (typeof value === "string") {
  value.toUpperCase();    // narrowed, and now allowed
}

// ── The rule ──────────────────────────────────────────────────────
// any      -> disables type safety
// unknown  -> requires you to prove the type

// Narrowing an unknown object takes two steps
function process(data: unknown) {
  if (typeof data === "object" && data !== null && "value" in data) {
    return (data as { value: number }).value;
  }
  throw new TypeError("unexpected payload");
}`,
        },
      ],
    },
    {
      title: { en: "Interfaces and type aliases", np: "Interface र type alias", jp: "インターフェースと型エイリアス" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "An <b>interface</b> describes the shape of an object: which properties exist, which are optional with `?`, and which are `readonly`. A <b>type alias</b> can describe the same shape, and also the things an interface cannot — unions, tuples and intersections. Interfaces extend with `extends` and merge across declarations, which is what makes them the natural fit for object and class contracts; reach for `type` when you are composing or computing a type rather than declaring a plain shape.",
            np: "<b>Interface</b> ले object को आकार वर्णन गर्छ: कुन property छन्, `?` ले कुन वैकल्पिक छन्, र कुन `readonly` छन्। <b>Type alias</b> ले उही आकार, र interface ले नसक्ने कुरा — union, tuple र intersection — पनि वर्णन गर्न सक्छ। Interface `extends` ले बढ्छन् र declaration बीच merge हुन्छन्, त्यसैले object र class सम्झौताका लागि स्वाभाविक छन्; सादा आकार घोषणा नगरी type जोड्दै वा गणना गर्दै हुनुहुन्छ भने `type` रोज्नुहोस्।",
            jp: "<b>インターフェース</b>はオブジェクトの形、つまりどのプロパティがあり、どれが `?` で任意で、どれが `readonly` かを記述する。<b>型エイリアス</b>は同じ形に加え、インターフェースにできないこと、つまりユニオン・タプル・インターセクションも表せる。インターフェースは `extends` で拡張でき宣言をまたいでマージされるため、オブジェクトやクラスの契約に自然に合う。単なる形の宣言ではなく型を合成・計算するときは `type` を選ぶ。",
          },
        },
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
      title: { en: "Generics — reuse without losing the type", np: "Generics — type नगुमाई पुनःप्रयोग", jp: "ジェネリクス — 型を失わない再利用" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A generic is a type the caller fills in. `function getFirst(values: any[])` works for every array but throws away what it knew, so the result is `any`. `function getFirst<T>(values: T[]): T` keeps the connection: passing `number[]` gives back `number`, passing `string[]` gives back `string`. <b>Constraints</b> narrow what a generic may be — `K extends keyof T` says the key must actually exist on the object, so `getProperty(user, \"email\")` is rejected at compile time when `User` has no `email`.",
            np: "Generic भनेको caller ले भर्ने type हो। `function getFirst(values: any[])` हरेक array मा चल्छ तर आफूले जानेको फालिदिन्छ, त्यसैले नतिजा `any` हुन्छ। `function getFirst<T>(values: T[]): T` ले सम्बन्ध जोगाउँछ: `number[]` दिँदा `number`, `string[]` दिँदा `string` फर्काउँछ। <b>Constraint</b> ले generic के हुन सक्छ सीमित गर्छ — `K extends keyof T` ले key object मा साँच्चै हुनुपर्छ भन्छ, त्यसैले `User` मा `email` नभए `getProperty(user, \"email\")` compile मै अस्वीकार हुन्छ।",
            jp: "ジェネリクスは呼び出し側が埋める型。`function getFirst(values: any[])` はどんな配列でも動くが分かっていた情報を捨てるので結果は `any`。`function getFirst<T>(values: T[]): T` は関係を保ち、`number[]` を渡せば `number`、`string[]` を渡せば `string` が返る。<b>制約</b>はジェネリクスが取りうる型を狭める。`K extends keyof T` はキーが実際にそのオブジェクトに存在することを求めるので、`User` に `email` がなければ `getProperty(user, \"email\")` はコンパイル時に弾かれる。",
          },
        },
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
      title: { en: "Utility types — derive, do not duplicate", np: "Utility type — नक्कल नगरी व्युत्पन्न गर्नुहोस्", jp: "ユーティリティ型 — 複製せず導出する" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Utility types transform a type you already have, so one definition stays the single source of truth. `Partial<T>` makes every property optional, which is exactly the shape of a PATCH body. `Pick<T, K>` keeps only the listed properties and `Omit<T, K>` drops them, which is how you build a public response type from an internal record. `Record<K, V>` builds a keyed map, `ReturnType<typeof fn>` reads a function's result type, and `Readonly<T>` freezes the shape. They compose: `Partial<Omit<User, \"id\" | \"createdAt\">>` is an update payload described in one line.",
            np: "Utility type ले पहिले नै भएको type रूपान्तरण गर्छ, त्यसैले एउटै परिभाषा सत्यको एक स्रोत रहन्छ। `Partial<T>` ले हरेक property वैकल्पिक बनाउँछ, जुन ठ्याक्कै PATCH body को आकार हो। `Pick<T, K>` ले सूचीका property मात्र राख्छ र `Omit<T, K>` ले हटाउँछ, यसरी नै भित्री record बाट सार्वजनिक response type बन्छ। `Record<K, V>` ले key भएको map बनाउँछ, `ReturnType<typeof fn>` ले function को नतिजा type पढ्छ, र `Readonly<T>` ले आकार जमाउँछ। यी जोडिन्छन्: `Partial<Omit<User, \"id\" | \"createdAt\">>` एक लाइनको update payload हो।",
            jp: "ユーティリティ型は既存の型を変換するので、定義ひとつが単一の情報源のまま保たれる。`Partial<T>` は全プロパティを任意にし、これはPATCHボディの形そのもの。`Pick<T, K>` は挙げたものだけを残し、`Omit<T, K>` は落とす。内部レコードから公開レスポンス型を作るのはこれ。`Record<K, V>` はキー付きのマップを作り、`ReturnType<typeof fn>` は関数の戻り値型を読み、`Readonly<T>` は形を凍らせる。組み合わせもでき、`Partial<Omit<User, \"id\" | \"createdAt\">>` は更新用ペイロードを1行で表す。",
          },
        },
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
    {
      title: { en: "Mistakes worth avoiding", np: "जोगिनुपर्ने गल्ती", jp: "避けたい間違い" },
      blocks: [
        {
          type: "table",
          caption: { en: "Three habits that undo the type system", np: "Type system बिगार्ने तीन बानी", jp: "型システムを台無しにする3つの癖" },
          headers: [{ en: "Habit", np: "बानी", jp: "癖" }, { en: "Why it hurts", np: "किन बिगार्छ", jp: "何が問題か" }, { en: "Do this instead", np: "बरु यसो गर्नुहोस्", jp: "代わりにこうする" }],
          rows: [
            [{ en: "`any` on a parameter", np: "Parameter मा `any`", jp: "引数に `any`" }, { en: "Every access compiles, including the ones that throw", np: "हरेक पहुँच compile हुन्छ, error दिनेहरू पनि", jp: "落ちるものも含め、すべての参照が通る" }, { en: "Take `unknown` and narrow before use", np: "`unknown` लिनुहोस् र प्रयोगअघि narrow गर्नुहोस्", jp: "`unknown` を受け、使う前に絞り込む" }],
            [{ en: "Hand-written `CreateUser` and `UpdateUser`", np: "हातले लेखिएको `CreateUser` र `UpdateUser`", jp: "手書きの `CreateUser` と `UpdateUser`" }, { en: "Two definitions drift apart as the model changes", np: "Model बदलिँदा दुई परिभाषा फरक पर्दै जान्छन्", jp: "モデルが変わると2つの定義がずれていく" }, { en: "Derive with `Omit` and `Partial`", np: "`Omit` र `Partial` ले व्युत्पन्न गर्नुहोस्", jp: "`Omit` と `Partial` で導出する" }],
            [{ en: "`const name: string = \"Alice\"`", np: "`const name: string = \"Alice\"`", jp: "`const name: string = \"Alice\"`" }, { en: "Restates what inference already knows", np: "Inference ले जानेकै कुरा दोहोर्‍याउँछ", jp: "推論がすでに知っていることを繰り返す" }, { en: "Annotate contracts, not obvious literals", np: "Literal होइन, सम्झौता annotate गर्नुहोस्", jp: "自明なリテラルではなく契約に注釈する" }],
          ],
        },
      ],
    },
  ],
  quiz: [
    {
      question: { en: "What is the main advantage of `unknown` over `any`?", np: "`any` भन्दा `unknown` को मुख्य फाइदा के हो?", jp: "`any` に対する `unknown` の主な利点は?" },
      options: [
        { en: "`unknown` is faster at runtime", np: "`unknown` runtime मा छिटो हुन्छ", jp: "実行時に速い" },
        { en: "`unknown` disables checking entirely", np: "`unknown` ले जाँच पूरै बन्द गर्छ", jp: "検査を完全に無効にする" },
        { en: "`unknown` automatically becomes a string", np: "`unknown` स्वतः string बन्छ", jp: "自動的に文字列になる" },
        { en: "`unknown` requires you to narrow the type before using it", np: "`unknown` ले प्रयोगअघि type narrow गर्न बाध्य पार्छ", jp: "使う前に型を絞り込ませる" },
      ],
      correctIndex: 3,
      explanation: { en: "`any` compiles every access, including the ones that throw at runtime.", np: "`any` ले हरेक पहुँच compile गर्छ, runtime मा error दिनेहरू पनि।", jp: "`any` は実行時に落ちるものまで含め、すべての参照を通す。" },
    },
    {
      question: { en: "For `function first<T>(items: T[]): T`, what is the type of `first([1, 2, 3])`?", np: "`function first<T>(items: T[]): T` मा `first([1, 2, 3])` को type के हो?", jp: "`function first<T>(items: T[]): T` のとき `first([1, 2, 3])` の型は?" },
      options: [
        { en: "`number`", np: "`number`", jp: "`number`" },
        { en: "`unknown`", np: "`unknown`", jp: "`unknown`" },
        { en: "`any`", np: "`any`", jp: "`any`" },
        { en: "`number[]`", np: "`number[]`", jp: "`number[]`" },
      ],
      correctIndex: 0,
      explanation: { en: "The generic keeps the link between the argument and the result.", np: "Generic ले argument र नतिजाबीचको सम्बन्ध जोगाउँछ।", jp: "ジェネリクスが引数と結果の結び付きを保つ。" },
    },
    {
      question: { en: "What does `Partial<User>` produce?", np: "`Partial<User>` ले के बनाउँछ?", jp: "`Partial<User>` は何を作るか?" },
      options: [
        { en: "A type with every property removed", np: "हरेक property हटाइएको type", jp: "すべてのプロパティを取り除いた型" },
        { en: "A type where every property is read-only", np: "हरेक property read-only भएको type", jp: "すべてが読み取り専用になった型" },
        { en: "A type where every property is optional", np: "हरेक property वैकल्पिक भएको type", jp: "すべてのプロパティが任意になった型" },
        { en: "A type where every property is `any`", np: "हरेक property `any` भएको type", jp: "すべてが `any` になった型" },
      ],
      correctIndex: 2,
      explanation: { en: "That is exactly the shape of a PATCH or update payload.", np: "यो ठ्याक्कै PATCH वा update payload को आकार हो।", jp: "これはPATCHや更新ペイロードの形そのもの。" },
    },
    {
      question: { en: "What does `Omit<User, \"password\">` produce?", np: "`Omit<User, \"password\">` ले के बनाउँछ?", jp: "`Omit<User, \"password\">` は何を作るか?" },
      options: [
        { en: "A type containing only `password`", np: "`password` मात्र भएको type", jp: "`password` だけを含む型" },
        { en: "All of `User` except `password`", np: "`password` बाहेक `User` का सबै", jp: "`password` を除く `User` のすべて" },
        { en: "A type where `password` is optional", np: "`password` वैकल्पिक भएको type", jp: "`password` が任意になった型" },
        { en: "An unrelated new type", np: "असम्बन्धित नयाँ type", jp: "無関係な新しい型" },
      ],
      correctIndex: 1,
      explanation: { en: "It is how you build a public response type from an internal record.", np: "भित्री record बाट सार्वजनिक response type यसै गरी बन्छ।", jp: "内部レコードから公開レスポンス型を作る方法。" },
    },
    {
      question: { en: "What is type narrowing?", np: "Type narrowing के हो?", jp: "型の絞り込みとは?" },
      options: [
        { en: "Reducing the number of properties on a type", np: "Type का property संख्या घटाउनु", jp: "型のプロパティ数を減らすこと" },
        { en: "Using a check such as `typeof` so TypeScript knows which union member you have", np: "`typeof` जस्तो जाँच गरेर TypeScript लाई union को कुन सदस्य हो भन्न दिनु", jp: "`typeof` などの判定で、ユニオンのどの型かをTypeScriptに知らせること" },
        { en: "Converting a type to `any`", np: "Type लाई `any` मा बदल्नु", jp: "型を `any` に変換すること" },
      ],
      correctIndex: 1,
      explanation: { en: "Inside the branch, only the operations valid for that member are allowed.", np: "Branch भित्र, त्यो सदस्यका लागि मान्य operation मात्र अनुमति हुन्छ।", jp: "その分岐の中では、その型に有効な操作だけが許される。" },
    },
    {
      question: { en: "When should you prefer `type` over `interface`?", np: "`interface` भन्दा `type` कहिले रोज्ने?", jp: "`interface` より `type` を選ぶのはいつか?" },
      options: [
        { en: "For unions, tuples and intersections, which an interface cannot express", np: "Union, tuple र intersection का लागि, जुन interface ले व्यक्त गर्न सक्दैन", jp: "インターフェースでは表せないユニオン・タプル・インターセクションのため" },
        { en: "Always, interfaces are deprecated", np: "सधैं, interface अप्रचलित छन्", jp: "常に。interfaceは非推奨だから" },
        { en: "Only inside classes", np: "Class भित्र मात्र", jp: "クラスの中だけ" },
      ],
      correctIndex: 0,
      explanation: { en: "For a plain object contract either works; interfaces also merge and extend.", np: "सादा object सम्झौतामा दुबै चल्छन्; interface merge र extend पनि हुन्छन्।", jp: "素のオブジェクト契約はどちらでもよい。インターフェースはマージと拡張もできる。" },
    },
    {
      question: { en: "What does the constraint `K extends keyof T` guarantee?", np: "`K extends keyof T` constraint ले केको ग्यारेन्टी गर्छ?", jp: "制約 `K extends keyof T` は何を保証するか?" },
      options: [
        { en: "That the object is readonly", np: "Object readonly छ भन्ने", jp: "オブジェクトが読み取り専用であること" },
        { en: "That the value is a string", np: "मान string हो भन्ने", jp: "値が文字列であること" },
        { en: "That the key actually exists on the object", np: "Key object मा साँच्चै छ भन्ने", jp: "そのキーがオブジェクトに実在すること" },
      ],
      correctIndex: 2,
      explanation: { en: "`getProperty(user, \"email\")` fails to compile when `User` has no `email`.", np: "`User` मा `email` नभए `getProperty(user, \"email\")` compile हुँदैन।", jp: "`User` に `email` がなければ `getProperty(user, \"email\")` はコンパイルできない。" },
    },
    {
      question: { en: "Why derive `UpdateUser` from `User` instead of writing it out?", np: "`UpdateUser` हातले लेख्नुको सट्टा `User` बाट किन व्युत्पन्न गर्ने?", jp: "`UpdateUser` を手書きせず `User` から導出する理由は?" },
      options: [
        { en: "Two hand-written definitions drift apart as the model changes", np: "हातले लेखिएका दुई परिभाषा model बदलिँदा फरक पर्दै जान्छन्", jp: "手書きの2つの定義はモデルの変化とともにずれていくから" },
        { en: "It compiles faster", np: "यो छिटो compile हुन्छ", jp: "コンパイルが速いから" },
        { en: "Derived types are checked at runtime", np: "व्युत्पन्न type runtime मा जाँचिन्छन्", jp: "導出した型は実行時に検査されるから" },
      ],
      correctIndex: 0,
      explanation: { en: "One definition stays the single source of truth.", np: "एउटै परिभाषा सत्यको एक स्रोत रहन्छ।", jp: "定義ひとつが単一の情報源であり続ける。" },
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
