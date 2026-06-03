import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_19_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "JavaScript manages memory automatically using garbage collection — you don't call `free()` like in C. But automatic does not mean perfect. Memory leaks happen when objects stay in memory longer than they should, and they are one of the hardest categories of bugs to find because they don't cause an immediate crash.",
      np: "JavaScript ले garbage collection प्रयोग गरेर automatically memory manage गर्छ — C जस्तो `free()` call गर्नु पर्दैन। तर automatic भनेको perfect होइन। Memory leaks तब हुन्छ जब objects लाई आवश्यकता भन्दा बढी समय memory मा राखिन्छ — immediate crash नहुनाले find गर्न सबैभन्दा गाह्रो bugs मध्ये एक।",
      jp: "JavaScriptはガベージコレクションで自動的にメモリを管理する。しかし自動=完璧ではない。オブジェクトが必要以上に長くメモリに残るとメモリリークが発生する。即座にクラッシュしないため発見が最も難しいバグの一つ。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "LaxbdIyBkL0", title: "JavaScript Memory Management & Garbage Collection" },
      ],
    },
    {
      title: { en: "Stack vs Heap", np: "Stack vs Heap", jp: "スタックとヒープ" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "JavaScript uses two memory regions. The **stack** is fast and small — it stores primitive values (`number`, `string`, `boolean`, etc.) and function call frames. It is automatically managed as functions enter and exit. The **heap** is large and slower — it stores objects, arrays, functions, and closures. Heap memory is managed by the garbage collector.",
            np: "JavaScript दुईवटा memory regions प्रयोग गर्छ। **Stack** fast र small छ — primitive values र function call frames store गर्छ। Functions enter/exit हुँदा automatically manage हुन्छ। **Heap** large र slower छ — objects, arrays, functions, closures store गर्छ। Heap memory garbage collector ले manage गर्छ।",
            jp: "JavaScriptは2つのメモリ領域を使用。**スタック**は高速・小容量 — プリミティブ値と関数呼び出しフレームを格納。関数の出入りで自動管理。**ヒープ**は大容量・低速 — オブジェクト・配列・関数・クロージャを格納。GCが管理。",
          },
        },
        {
          type: "code",
          title: { en: "What goes where in memory", np: "Memory मा के कहाँ जान्छ", jp: "メモリのどこに何が格納されるか" },
          code: `// ── Stack: primitive values ────────────────────────────────────────
let a = 42;          // stored on the stack — copy semantics
let b = a;           // b gets its OWN copy of 42
b = 100;
console.log(a);      // 42 — a is unchanged (primitives copy by value)

let str = "hello";   // small strings are often stored on the stack or interned

// ── Heap: objects and reference types ─────────────────────────────
let obj1 = { x: 1 };  // OBJECT stored on the heap; obj1 is a REFERENCE (pointer) on the stack
let obj2 = obj1;       // obj2 gets a copy of the REFERENCE, not the object
obj2.x = 99;
console.log(obj1.x);   // 99 — both variables point to the SAME object

// ── How garbage collection decides what to free ───────────────────
let user = { name: "Alice" };  // heap object — referenced by 'user'
user = null;                   // no more references → eligible for GC

function createClosure() {
  const bigData = new Array(1000000).fill(0);  // on the heap
  return function() {
    return bigData.length;  // closure keeps bigData alive!
  };
}

const fn = createClosure();  // bigData is NOT GC'd — fn holds a reference
fn = null;                   // NOW bigData can be GC'd — no more references`,
        },
      ],
    },
    {
      title: { en: "Garbage collection — Mark and Sweep", np: "Garbage collection — Mark and Sweep", jp: "ガベージコレクション — マークアンドスイープ" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Modern JavaScript engines use a **mark-and-sweep** algorithm. Starting from 'roots' (global variables, current call stack, closures), the GC marks every object it can reach by following references. Any object that was NOT marked is unreachable — meaning no code can ever access it — so its memory is freed. This is why circular references are no longer a problem in modern JS: if two objects only reference each other but neither is reachable from a root, they are both collected.",
            np: "Modern JS engines **mark-and-sweep** algorithm प्रयोग गर्छन्। 'Roots' (global variables, current call stack, closures) बाट सुरु गरेर GC ले references follow गर्दै reach गर्न सकिने हरेक object mark गर्छ। Mark नभएका objects unreachable हुन् — कुनै code ले access गर्न सक्दैन — त्यसैले तिनीहरूको memory free हुन्छ।",
            jp: "モダンJSエンジンは**マークアンドスイープ**アルゴリズムを使用。ルート（グローバル変数・コールスタック・クロージャ）から参照をたどって到達できる全オブジェクトをマーク。マークされないオブジェクトは到達不能→メモリを解放。循環参照もルートから辿れなければ収集される。",
          },
        },
        {
          type: "code",
          title: { en: "The four classic memory leak patterns", np: "चार classic memory leak patterns", jp: "4つの典型的なメモリリークパターン" },
          code: `// ── Leak 1: Forgotten event listeners ────────────────────────────
// ❌ The element is removed from the DOM but the listener keeps it alive
function setup() {
  const btn = document.querySelector("#btn");
  btn.addEventListener("click", handleClick);
  // If btn is later removed from DOM without removing the listener,
  // btn stays in memory because the event system holds a reference
}

// ✅ Always remove listeners when no longer needed
function setup() {
  const btn = document.querySelector("#btn");
  btn.addEventListener("click", handleClick);

  return () => btn.removeEventListener("click", handleClick);  // cleanup
}

// ── Leak 2: Timers that never clear ──────────────────────────────
// ❌ setInterval keeps closure alive forever
function startPolling() {
  const heavyData = loadLargeDataset();
  setInterval(() => {
    process(heavyData);  // heavyData is captured in the closure — never GC'd
  }, 1000);
}

// ✅ Store the timer ID and clear it when done
let timerId;
function startPolling() {
  const heavyData = loadLargeDataset();
  timerId = setInterval(() => process(heavyData), 1000);
}
function stopPolling() {
  clearInterval(timerId);
}

// ── Leak 3: Growing caches with no eviction ───────────────────────
// ❌ Cache grows unbounded — objects never removed
const cache = {};
function rememberResult(key, fn) {
  if (!cache[key]) cache[key] = fn();
  return cache[key];
}

// ✅ Use a Map with a max size, or WeakMap for object keys
const MAX = 1000;
const lruCache = new Map();
function rememberResult(key, fn) {
  if (lruCache.has(key)) return lruCache.get(key);
  const value = fn();
  lruCache.set(key, value);
  if (lruCache.size > MAX) {
    // Delete the oldest entry (Maps preserve insertion order)
    lruCache.delete(lruCache.keys().next().value);
  }
  return value;
}

// ── Leak 4: Closures holding large data unnecessarily ────────────
// ❌ smallValue captures the whole bigData array via closure
function processData(bigData) {
  const smallValue = bigData[0];
  setTimeout(() => {
    console.log(bigData);  // whole bigData lives in memory until timeout fires
  }, 10000);
}

// ✅ Extract only what you need
function processData(bigData) {
  const firstItem = bigData[0];
  bigData = null;            // explicitly allow GC (within this function scope)
  setTimeout(() => {
    console.log(firstItem);  // only firstItem is kept alive
  }, 10000);
}`,
        },
      ],
    },
    {
      title: { en: "WeakMap and WeakSet — GC-friendly references", np: "WeakMap र WeakSet — GC-friendly references", jp: "WeakMapとWeakSet — GCに優しい参照" },
      blocks: [
        {
          type: "code",
          title: { en: "Storing metadata without preventing garbage collection", np: "GC prevent नगरी metadata store गर्नु", jp: "GCを妨げずにメタデータを格納する" },
          code: `// ── Regular Map — holds strong references ────────────────────────
const map = new Map();
let user = { name: "Alice" };
map.set(user, { clicks: 5 });
user = null;
// Even though user is null, { name: "Alice" } is NOT garbage collected
// because the Map still holds a reference to it as a key

// ── WeakMap — holds WEAK references ──────────────────────────────
const weakMap = new WeakMap();
let user2 = { name: "Bob" };
weakMap.set(user2, { clicks: 3 });
user2 = null;
// { name: "Bob" } CAN be garbage collected — WeakMap does not prevent GC
// When user2 is GC'd, its WeakMap entry disappears automatically

// ── WeakMap use cases ────────────────────────────────────────────
// 1. Attaching metadata to objects without memory leaks:
const domCache = new WeakMap();

function getMetadata(element) {
  if (!domCache.has(element)) {
    domCache.set(element, { created: Date.now(), clicks: 0 });
  }
  return domCache.get(element);
}
// When the DOM element is removed, its metadata is automatically GC'd

// 2. Private data (before class private fields existed):
const _private = new WeakMap();

class Counter {
  constructor() {
    _private.set(this, { count: 0 });
  }
  increment() {
    _private.get(this).count++;
  }
  get value() {
    return _private.get(this).count;
  }
}

// ── WeakMap limitations ───────────────────────────────────────────
// Keys MUST be objects (not primitives)
// Not iterable — no forEach, no .keys(), no .values()
// Cannot check .size (GC timing is non-deterministic)

// ── WeakSet — like a Set but with weak references ─────────────────
const seen = new WeakSet();

function processOnce(obj) {
  if (seen.has(obj)) return;
  seen.add(obj);
  doProcess(obj);
  // When obj is GC'd, the WeakSet entry is automatically removed
}

// ── WeakRef — a direct weak reference to an object ────────────────
const cache = new Map();

function storeInCache(key, value) {
  cache.set(key, new WeakRef(value));
}

function getFromCache(key) {
  const ref = cache.get(key);
  return ref?.deref();  // returns the object or undefined if it was GC'd
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "How do I find memory leaks in JavaScript?", np: "JavaScript मा memory leaks कसरी find गर्ने?", jp: "JavaScriptのメモリリークを見つけるには？" },
      answer: {
        en: "Chrome DevTools Memory tab is your main tool. Take a heap snapshot before and after a suspected leak (e.g. open and close a modal 10 times), compare them, and look for objects that are growing. The Allocation Instrumentation on Timeline shows memory allocations over time — a steadily growing heap line (no drops after GC) indicates a leak. Also watch the Performance Monitor panel for JS heap size growing continuously. Common culprits: event listeners on detached DOM nodes, intervals/timeouts never cleared, closures over large data.",
        np: "Chrome DevTools Memory tab मुख्य tool हो। Suspected leak भन्दा पहिले र पछि heap snapshot लिनुहोस् (modal 10 पटक open/close), compare गर्नुहोस्, growing objects हेर्नुहोस्। Allocation Instrumentation on Timeline ले time over memory allocations देखाउँछ। Common culprits: detached DOM nodes मा event listeners, clear नभएका intervals/timeouts, large data माथि closures।",
        jp: "Chrome DevToolsのMemoryタブが主なツール。疑わしいリーク前後でヒープスナップショットを取り（モーダルを10回開閉など）比較して増加するオブジェクトを探す。Allocation Instrumentationでメモリ使用量の推移を確認。ヒープが継続的に増加（GC後も下がらない）はリークの兆候。主な原因：切り離されたDOMノードへのリスナー・未クリアのタイマー・大量データへのクロージャ。",
      },
    },
    {
      question: { en: "What is the difference between WeakMap and Map?", np: "WeakMap र Map मा के फरक?", jp: "WeakMapとMapの違いは？" },
      answer: {
        en: "A regular Map holds strong references to its keys — as long as the Map exists, the key objects are kept alive even if there are no other references to them. A WeakMap holds weak references — if the key object has no other references, it can be garbage collected, and the WeakMap entry disappears automatically. WeakMaps are not iterable and have no `size` property. Use WeakMap when you want to associate data with an object but don't want that data to prevent the object from being GC'd — typical for DOM node metadata, private state, and caches.",
        np: "Regular Map ले keys लाई strong references hold गर्छ — Map exist जबसम्म key objects alive रहन्छन्। WeakMap ले weak references hold गर्छ — key object को कुनै अर्को reference छैन भने GC हुन सक्छ, WeakMap entry automatically disappear हुन्छ। DOM node metadata, private state, caches का लागि WeakMap।",
        jp: "通常のMapはキーへの強参照を保持 — 他の参照がなくてもMapが存在する限りキーオブジェクトは生きている。WeakMapは弱参照 — 他に参照がなければGCされ、エントリも自動消去。イテレート不可・sizeプロパティなし。DOMノードのメタデータ・プライベート状態・キャッシュに使う。",
      },
    },
  ],
};
