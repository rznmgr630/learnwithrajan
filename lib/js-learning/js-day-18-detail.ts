import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_18_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Generators are functions that can be paused and resumed. Unlike a regular function that runs to completion and returns once, a generator can yield multiple values over time and be resumed from where it left off. They are the foundation of async generators, lazy sequences, and some state machine patterns.",
      np: "Generators pause र resume गर्न सकिने functions हुन्। Regular function एक पटक run भएर return गर्छ, तर generator धेरै values yield गर्न सक्छ र रोकिएको ठाउँबाट resume हुन सक्छ। Async generators, lazy sequences, र state machines को foundation हो।",
      jp: "ジェネレータは一時停止・再開できる関数。通常の関数は一度だけ実行して返るが、ジェネレータは複数の値を段階的にyieldし、停止した場所から再開できる。async generators・遅延シーケンス・ステートマシンの基盤。",
    },
    {
      en: "Iterators are objects with a `next()` method that returns `{ value, done }`. Arrays, strings, Maps, Sets, and generators are all iterable — they implement the iterator protocol and work with `for...of`, spread, and destructuring. You can make your own objects iterable with `Symbol.iterator`.",
      np: "Iterators `{ value, done }` return गर्ने `next()` method भएका objects हुन्। Arrays, strings, Maps, Sets, generators सबै iterable छन् — iterator protocol implement गर्छन् र `for...of`, spread, destructuring सँग काम गर्छन्। `Symbol.iterator` सँग आफ्नै objects iterable बनाउन सकिन्छ।",
      jp: "イテレータは`{value, done}`を返す`next()`メソッドを持つオブジェクト。配列・文字列・Map・Set・ジェネレータは全てイテラブル。`Symbol.iterator`で独自オブジェクトをイテラブルにできる。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "ategZqxHkz4", title: "JavaScript Generators — Complete Guide" },
      ],
    },
    {
      title: { en: "Generator functions", np: "Generator functions", jp: "ジェネレータ関数" },
      blocks: [
        {
          type: "code",
          title: { en: "function*, yield, and the generator object", np: "function*, yield र generator object", jp: "function*・yield・ジェネレータオブジェクト" },
          code: `// ── Defining a generator ──────────────────────────────────────────
function* counter() {
  console.log("start");
  yield 1;           // pause here, return 1
  console.log("resumed");
  yield 2;           // pause here, return 2
  yield 3;           // pause here, return 3
  console.log("done");
  return "finished"; // the final return value (done: true)
}

// ── Using the generator ───────────────────────────────────────────
const gen = counter();  // calling the function creates the generator object — code doesn't run yet

gen.next();  // { value: 1, done: false }  — "start" printed
gen.next();  // { value: 2, done: false }  — "resumed" printed
gen.next();  // { value: 3, done: false }
gen.next();  // { value: "finished", done: true } — "done" printed

// After done: true, further .next() calls return { value: undefined, done: true }

// ── Iterating a generator with for...of ───────────────────────────
for (const n of counter()) {
  console.log(n);  // 1, 2, 3 (return value is ignored by for...of)
}

// ── Spreading a generator ─────────────────────────────────────────
const values = [...counter()];  // [1, 2, 3]

// ── Infinite generators — lazy sequences ──────────────────────────
function* naturals(start = 1) {
  let n = start;
  while (true) {        // infinite loop is OK — the generator pauses at each yield
    yield n++;
  }
}

const nums = naturals();
nums.next().value;  // 1
nums.next().value;  // 2
nums.next().value;  // 3

// Take the first N values from an infinite generator:
function take(n, iterable) {
  const result = [];
  for (const value of iterable) {
    result.push(value);
    if (result.length === n) break;
  }
  return result;
}

take(5, naturals(10));  // [10, 11, 12, 13, 14]

// ── Passing values back with next(value) ──────────────────────────
function* calculator() {
  const a = yield "Enter first number:";
  const b = yield "Enter second number:";
  return a + b;
}

const calc = calculator();
calc.next();        // { value: "Enter first number:", done: false }
calc.next(10);      // { value: "Enter second number:", done: false }  — a = 10
calc.next(20);      // { value: 30, done: true }  — b = 20, returns 10 + 20`,
        },
      ],
    },
    {
      title: { en: "Iterators and the iterator protocol", np: "Iterators र iterator protocol", jp: "イテレータとイテレータプロトコル" },
      blocks: [
        {
          type: "code",
          title: { en: "Making custom objects iterable with Symbol.iterator", np: "Symbol.iterator सँग custom objects iterable बनाउनु", jp: "Symbol.iteratorでカスタムオブジェクトをイテラブルにする" },
          code: `// ── The iterator protocol ────────────────────────────────────────
// An iterable has [Symbol.iterator]() that returns an iterator.
// An iterator has next() that returns { value, done }.

// ── Built-in iterables ────────────────────────────────────────────
// Arrays, Strings, Maps, Sets, generators all implement this protocol

const arr = [1, 2, 3];
const iter = arr[Symbol.iterator]();
iter.next();  // { value: 1, done: false }
iter.next();  // { value: 2, done: false }
iter.next();  // { value: 3, done: false }
iter.next();  // { value: undefined, done: true }

// for...of, spread, destructuring all use this protocol internally
for (const char of "hello") console.log(char);  // h, e, l, l, o
const [first, ...rest] = new Map([["a", 1], ["b", 2]]);

// ── Making a custom class iterable ────────────────────────────────
class Range {
  constructor(start, end, step = 1) {
    this.start = start;
    this.end   = end;
    this.step  = step;
  }

  [Symbol.iterator]() {
    let current = this.start;
    const end  = this.end;
    const step = this.step;

    return {
      next() {
        if (current <= end) {
          const value = current;
          current += step;
          return { value, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
}

const range = new Range(1, 10, 2);
[...range];                       // [1, 3, 5, 7, 9]
for (const n of new Range(0, 4)) console.log(n);  // 0, 1, 2, 3, 4

// ── Simpler: use a generator as [Symbol.iterator] ─────────────────
class Range2 {
  constructor(start, end) { this.start = start; this.end = end; }

  *[Symbol.iterator]() {
    for (let i = this.start; i <= this.end; i++) yield i;
  }
}

[...new Range2(1, 5)];  // [1, 2, 3, 4, 5]`,
        },
      ],
    },
    {
      title: { en: "Async generators — paginating APIs lazily", np: "Async generators — lazily paginating APIs", jp: "async generator — APIの遅延ページング" },
      blocks: [
        {
          type: "code",
          title: { en: "async function* and for await...of", np: "async function* र for await...of", jp: "async function*とfor await...of" },
          code: `// ── Async generator — yields Promises instead of plain values ──────
async function* paginate(url) {
  let nextUrl = url;

  while (nextUrl) {
    const response = await fetch(nextUrl);     // await inside a generator!
    const data     = await response.json();

    yield data.items;                          // yield a page of results

    nextUrl = data.nextPageUrl ?? null;        // move to next page (or stop)
  }
}

// ── Consuming with for await...of ─────────────────────────────────
for await (const page of paginate("/api/products?page=1")) {
  console.log("Got page:", page.length, "items");
  // Process page here — the next page is only fetched when needed
}

// ── Flattening paginated results ───────────────────────────────────
async function* flatPaginate(url) {
  for await (const page of paginate(url)) {
    yield* page;  // yield each item individually from the page array
  }
}

for await (const product of flatPaginate("/api/products")) {
  console.log(product.name);  // each product, one at a time
}

// ── Async generator with early exit ───────────────────────────────
async function getFirst10Products() {
  const products = [];
  for await (const product of flatPaginate("/api/products")) {
    products.push(product);
    if (products.length >= 10) break;  // stops the async generator early
  }
  return products;
}

// ── Async iterable class ──────────────────────────────────────────
class EventStream {
  constructor(eventSource) { this.eventSource = eventSource; }

  async *[Symbol.asyncIterator]() {
    const queue = [];
    let resolve;

    const next = () => new Promise(r => { resolve = r; });

    this.eventSource.onmessage = (event) => {
      queue.push(event.data);
      resolve?.();
      resolve = null;
    };

    while (true) {
      if (queue.length) yield queue.shift();
      else await next();
    }
  }
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "What is the difference between a generator and an async function?", np: "Generator र async function मा के फरक?", jp: "ジェネレータとasync関数の違いは？" },
      answer: {
        en: "An async function returns a single Promise that eventually resolves or rejects. It cannot produce multiple values over time. A generator can produce multiple values using `yield` — it is a pull-based producer (the caller asks for the next value). An async generator combines both: it can `yield` multiple values over time, and each yielded value can be awaited. Use generators for lazy sequences and custom iterables. Use async generators for lazy async data streams like API pagination.",
        np: "Async function एउटा Promise return गर्छ जुन eventually resolve/reject हुन्छ — multiple values produce गर्न सक्दैन। Generator ले `yield` गरेर multiple values produce गर्छ — caller ले अर्को value माग्छ। Async generator ले दुवै combine गर्छ: lazy sequences र async streams का लागि।",
        jp: "async関数は一つのPromiseを返すだけ。ジェネレータは`yield`で複数の値を段階的に生成できる（呼び出し側が次の値を要求するプル型）。async generatorは両者を組み合わせる。APIページングのような遅延非同期データストリームに使う。",
      },
    },
    {
      question: { en: "When would I actually use a generator in production?", np: "Production मा generator actually कहिले use गर्ने?", jp: "実際の本番コードでジェネレータをいつ使うか？" },
      answer: {
        en: "Common production uses: (1) async pagination — yield each page from an API without loading all data at once; (2) infinite sequences that are consumed lazily; (3) implementing cancellable async workflows (the saga pattern in Redux-Saga); (4) streaming data processing — transform a stream item by item; (5) implementing custom iterables for domain objects. Generators are less common than Promises in day-to-day work, but understanding them is important for advanced patterns and interviews.",
        np: "Production use cases: (1) async pagination — एकैसाथ सबै data load नगरी; (2) lazy infinite sequences; (3) cancellable async workflows (Redux-Saga); (4) streaming data processing; (5) domain objects मा custom iterables। Day-to-day Promises भन्दा कम common, तर advanced patterns र interviews का लागि important।",
        jp: "本番での用途: (1)API非同期ページング; (2)遅延無限シーケンス; (3)キャンセル可能な非同期ワークフロー(Redux-Saga); (4)ストリームデータ処理; (5)ドメインオブジェクトのカスタムイテラブル。日常的にはPromiseより少ないが、高度なパターンと面接に重要。",
      },
    },
  ],
};
