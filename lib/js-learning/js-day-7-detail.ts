import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_7_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "`this` is one of the most confusing parts of JavaScript because its value is determined by **how** a function is called, not where it is defined (unless it is an arrow function). Once you understand the four rules — and the three methods that let you override them — `this` stops being mysterious.",
      np: "`this` JavaScript को सबभन्दा confusing भाग हो किनभने यसको value function कहाँ define गरिएको छ त्यसले होइन, **कसरी** call हुन्छ त्यसले निर्धारण गर्छ (arrow function बाहेक)। चार rules र तीन override methods सिकेपछि `this` रहस्यमय हुँदैन।",
      jp: "`this`はJavaScriptで最も混乱しやすい部分の一つ。定義場所ではなく**呼び出し方**によって値が決まる（アロー関数を除く）。4つのルールと3つのオーバーライドメソッドを理解すれば謎ではなくなる。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "NV9sHLX-jZU", title: "JavaScript this Keyword Explained" },
      ],
    },
    {
      title: { en: "The four rules of this", np: "this का चार rules", jp: "thisの4つのルール" },
      blocks: [
        {
          type: "code",
          title: { en: "How this is determined in each context", np: "हरेक context मा this कसरी निर्धारण हुन्छ", jp: "各コンテキストでのthisの決まり方" },
          code: `// ── Rule 1: Default binding — called as a plain function ─────────────
function showThis() {
  console.log(this);
}
showThis();
// In strict mode ("use strict"): undefined
// In sloppy mode (non-strict): window (browser) or global (Node.js)

// ── Rule 2: Implicit binding — called as an object method ──────────
const user = {
  name: "Alice",
  greet() {
    console.log(this.name);  // 'this' is the object to the left of the dot
  },
};
user.greet();  // "Alice" — 'this' is user

// ── Implicit binding lost (common gotcha) ──────────────────────────
const fn = user.greet;   // extract the function from the object
fn();                    // undefined — 'this' is no longer bound to user

setTimeout(user.greet, 1000);  // also loses binding — setTimeout calls fn without object context

// ── Rule 3: Explicit binding — call(), apply(), bind() ─────────────
function introduce(greeting, punctuation) {
  console.log(\`\${greeting}, I'm \${this.name}\${punctuation}\`);
}

const alice = { name: "Alice" };
const bob   = { name: "Bob" };

// call — pass 'this' and arguments one by one
introduce.call(alice, "Hello", "!");   // "Hello, I'm Alice!"
introduce.call(bob,   "Hi", ".");      // "Hi, I'm Bob."

// apply — pass 'this' and arguments as an array
introduce.apply(alice, ["Hey", "?"]);  // "Hey, I'm Alice?"

// bind — returns a NEW function with 'this' permanently fixed
const aliceIntro = introduce.bind(alice, "Howdy");  // pre-fill first arg too
aliceIntro("!");  // "Howdy, I'm Alice!"
aliceIntro("?");  // "Howdy, I'm Alice?"

// ── Rule 4: new binding — called with new ─────────────────────────
function Person(name) {
  // When called with 'new', 'this' is a brand new empty object
  this.name = name;
  // 'this' is automatically returned (no need for explicit return)
}
const alice2 = new Person("Alice");
alice2.name;  // "Alice"`,
        },
      ],
    },
    {
      title: { en: "Arrow functions & this", np: "Arrow functions र this", jp: "アロー関数とthis" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Arrow functions do NOT have their own `this`. Instead, they capture the `this` value from the surrounding lexical context — the `this` of the function or class that contains them at the time they are created. This makes them ideal for callbacks and methods on class instances, but wrong for object methods where you want `this` to refer to the object.",
            np: "Arrow functions को आफ्नै `this` हुँदैन। बरु यिनले surrounding lexical context बाट `this` capture गर्छन् — create हुँदाको containing function वा class को `this`। Callbacks र class instance methods का लागि ideal, तर object methods का लागि गलत।",
            jp: "アロー関数には独自の`this`がない。代わりに作成時の周囲のレキシカルコンテキストの`this`をキャプチャする。コールバックやクラスインスタンスメソッドに最適だが、オブジェクトのメソッドには不向き。",
          },
        },
        {
          type: "code",
          title: { en: "Arrow functions capture this from their lexical context", np: "Arrow functions ले lexical context बाट this capture गर्छ", jp: "アロー関数はレキシカルコンテキストのthisをキャプチャする" },
          code: `// ── Problem: losing 'this' in a callback ─────────────────────────
class Timer {
  constructor() {
    this.seconds = 0;
  }

  // ❌ Regular function — 'this' is undefined inside the callback
  startBroken() {
    setInterval(function () {
      this.seconds++;   // TypeError: Cannot set property 'seconds' of undefined
    }, 1000);
  }

  // ✅ Arrow function — captures 'this' from startFixed's context (the Timer instance)
  startFixed() {
    setInterval(() => {
      this.seconds++;   // 'this' is the Timer instance
    }, 1000);
  }
}

// ── Arrow function as object method — wrong! ──────────────────────
const counter = {
  count: 0,
  // ❌ Arrow function captures 'this' from the module scope (not the object)
  increment: () => {
    this.count++;   // 'this' is undefined (module scope) or global — not counter
  },
  // ✅ Regular method — 'this' is the object when called as counter.increment()
  incrementFixed() {
    this.count++;
  },
};

// ── Class methods + callbacks — the canonical pattern ─────────────
class UserList {
  constructor(users) {
    this.users = users;
  }

  getNames() {
    // Arrow function in map: 'this' refers to the UserList instance
    return this.users.map(user => \`\${user.name} (id: \${this.id})\`);
  }
}`,
        },
      ],
    },
    {
      title: { en: "call, apply, and bind in depth", np: "call, apply, bind विस्तारमा", jp: "call・apply・bindの詳細" },
      blocks: [
        {
          type: "table",
          headers: [
            { en: "Method", np: "Method", jp: "メソッド" },
            { en: "Calls immediately?", np: "तुरन्त call?", jp: "即座に呼び出す?" },
            { en: "Arguments passed as", np: "Arguments कसरी?", jp: "引数の渡し方" },
            { en: "Returns", np: "Return", jp: "戻り値" },
            { en: "Main use case", np: "मुख्य use", jp: "主な用途" },
          ],
          rows: [
            [
              { en: "`call(thisArg, arg1, arg2, ...)`", np: "call", jp: "call" },
              { en: "Yes", np: "हो", jp: "はい" },
              { en: "Individual arguments", np: "Individual args", jp: "個別の引数" },
              { en: "Return value of fn", np: "fn को return value", jp: "fnの戻り値" },
              { en: "Borrow a method from another object", np: "अर्को object बाट method borrow", jp: "別オブジェクトのメソッドを借用" },
            ],
            [
              { en: "`apply(thisArg, [arg1, arg2])`", np: "apply", jp: "apply" },
              { en: "Yes", np: "हो", jp: "はい" },
              { en: "Array of arguments", np: "Array", jp: "配列" },
              { en: "Return value of fn", np: "fn को return value", jp: "fnの戻り値" },
              { en: "When arguments are already in an array", np: "Arguments array मा छन् भने", jp: "引数が配列にある場合" },
            ],
            [
              { en: "`bind(thisArg, arg1, arg2, ...)`", np: "bind", jp: "bind" },
              { en: "No", np: "होइन", jp: "いいえ" },
              { en: "Pre-filled arguments (partial application)", np: "Pre-fill arguments", jp: "事前埋め込み引数" },
              { en: "New function", np: "नयाँ function", jp: "新しい関数" },
              { en: "Event handlers, partial application, fixing context", np: "Event handler, partial application", jp: "イベントハンドラ・部分適用・コンテキスト固定" },
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "What does 'this' refer to inside a class method?", np: "Class method भित्र 'this' ले के बुझाउँछ?", jp: "クラスメソッド内のthisは何を指すか？" },
      answer: {
        en: "Inside a class method called on an instance, `this` refers to the instance. When you do `const obj = new MyClass()` and then `obj.myMethod()`, `this` inside `myMethod` is `obj`. However, if you extract the method and call it without the object (`const fn = obj.myMethod; fn()`), `this` is undefined in strict mode. This is why you sometimes need to use arrow functions or bind in React class components to ensure `this` stays bound.",
        np: "Instance मा call भएको class method भित्र `this` ले instance नै बुझाउँछ। तर method extract गरेर object बिना call गर्दा (`const fn = obj.myMethod; fn()`) `this` strict mode मा undefined हुन्छ। त्यसैले React class components मा arrow functions वा bind प्रयोग गरिन्छ।",
        jp: "インスタンスで呼び出されたクラスメソッド内の`this`はそのインスタンスを指す。しかしメソッドを取り出してオブジェクトなしで呼ぶと、strictモードではundefinedになる。Reactクラスコンポーネントでアローやbindが使われる理由。",
      },
    },
    {
      question: { en: "What is the difference between call() and apply()?", np: "call() र apply() मा के फरक?", jp: "call()とapply()の違いは？" },
      answer: {
        en: "Both invoke a function immediately with a specified `this` value. The difference is how arguments are passed: `call` takes individual arguments separated by commas (`fn.call(thisArg, a, b, c)`), while `apply` takes an array of arguments (`fn.apply(thisArg, [a, b, c])`). With the spread operator available in modern JS, `apply` is rarely needed — `fn.call(thisArg, ...args)` achieves the same thing.",
        np: "दुवैले function तुरन्त call गर्छन् specified `this` सहित। फरक arguments pass गर्ने तरिका हो: `call` individual arguments (`fn.call(thisArg, a, b, c)`), `apply` array (`fn.apply(thisArg, [a, b, c])`। Modern JS मा spread operator छ भनेपछि `apply` कम प्रयोग हुन्छ।",
        jp: "どちらも指定したthisで関数をすぐに呼び出す。違いは引数の渡し方: callはカンマ区切り、applyは配列。モダンJSではスプレッド演算子があるのでapplyの使用頻度は低い。",
      },
    },
  ],
};
