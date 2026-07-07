import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_7_LESSONS: JsLessonDay = {
  day: 7,
  title: { en: "The this Keyword — Contexts, call, apply & bind", np: "this Keyword — Contexts, call, apply, bind", jp: "this・call・apply・bind" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "four-rules-of-this",
      title: { en: "The Four Rules of this", np: "this का चार Rules", jp: "thisの4つのルール" },
      durationMinutes: 9,
      explanation: {
        en: "`this` is confusing because its value is decided by <b>how</b> a function is called, not where it is written — a single function can have a completely different `this` on every call. There are exactly four rules, checked in this priority order:\n\n• <b>Default binding</b> — called as a plain function (`showThis()`): `this` is `undefined` in strict mode, or the global object in sloppy mode\n• <b>Implicit binding</b> — called as a method on an object (`user.greet()`): `this` is the object to the left of the dot\n• <b>Explicit binding</b> — called via `call()`, `apply()`, or `bind()`: `this` is whatever you explicitly pass in\n• <b>new binding</b> — called with `new` (`new Person()`): `this` is a brand-new empty object\n\nA common gotcha is <b>losing implicit binding</b>: extracting a method off its object (`const fn = user.greet`) or passing it as a callback (`setTimeout(user.greet, 1000)`) detaches it from `user` — when it's called later, there's no object to the left of a dot anymore, so it falls back to default binding.",
        np: "`this` को value function कसरी call भयो त्यसले निर्धारण गर्छ, कहाँ लेखियो त्यसले होइन। चार rules: default (plain call), implicit (object.method()), explicit (call/apply/bind), र new binding। Method extract गर्दा वा callback को रूपमा pass गर्दा implicit binding हराउन सक्छ।",
        jp: "thisの値は関数の書かれた場所ではなく呼び出され方で決まる。4つのルール: デフォルト（プレーン呼び出し）、暗黙的（object.method()）、明示的（call/apply/bind）、new束縛。メソッドを取り出したりコールバックとして渡すと暗黙的束縛が失われる。",
      },
      diagram: `Priority order (checked top to bottom):

1. new binding       new Person()          this = brand-new object
2. Explicit binding   fn.call(obj)          this = obj (whatever you pass)
3. Implicit binding   user.greet()          this = user (left of the dot)
4. Default binding    showThis()            this = undefined (strict) / global

const fn = user.greet;   ← detached from 'user'!
fn();                     ← falls back to Default binding — 'this' is lost`,
      codeExample: {
        title: { en: "The four binding rules, in order of priority", np: "चार binding rules, priority order मा", jp: "優先順位順の4つの束縛ルール" },
        code: `// ── Rule 1: Default binding — called as a plain function ─────────────
function showThis() { console.log(this); }
showThis();
// Strict mode: undefined  |  Sloppy mode: window/global

// ── Rule 2: Implicit binding — called as an object method ──────────
const user = {
  name: "Alice",
  greet() { console.log(this.name); },   // 'this' is the object left of the dot
};
user.greet();  // "Alice"

// ── Implicit binding LOST (common gotcha) ──────────────────────────
const fn = user.greet;         // extracted — no longer attached to 'user'
fn();                          // undefined — 'this' fell back to default binding
setTimeout(user.greet, 1000);  // same problem — setTimeout calls it bare

// ── Rule 3: Explicit binding — call(), apply(), bind() ─────────────
function introduce(greeting) { console.log(\`\${greeting}, I'm \${this.name}\`); }
const alice = { name: "Alice" };

introduce.call(alice, "Hello");     // "Hello, I'm Alice" — args one by one
introduce.apply(alice, ["Hey"]);    // "Hey, I'm Alice"   — args as an array
const aliceIntro = introduce.bind(alice);  // returns a NEW function, 'this' fixed forever
aliceIntro("Howdy");                 // "Howdy, I'm Alice"

// ── Rule 4: new binding — called with new ─────────────────────────
function Person(name) {
  this.name = name;   // 'this' is a brand-new object created by 'new'
}
const p = new Person("Alice");
p.name;  // "Alice"`,
      },
      keyTakeaways: [
        { en: "`this` is determined entirely by the call site (how a function is invoked), not by where the function was defined — the same function can have a different `this` every time it's called.", np: "`this` पूर्ण रूपमा call site (कसरी invoke भयो) ले निर्धारण गर्छ, function कहाँ define भयो त्यसले होइन।", jp: "thisは呼び出し場所（呼び出され方）によって完全に決まる。定義場所ではない。同じ関数でも呼ぶたびにthisが変わりうる。" },
        { en: "The four rules have a strict priority order: `new` binding beats explicit binding, which beats implicit binding, which beats default binding.", np: "चार rules को strict priority order छ: new binding > explicit binding > implicit binding > default binding।", jp: "4つのルールには厳密な優先順位がある: new束縛 > 明示的束縛 > 暗黙的束縛 > デフォルト束縛。" },
        { en: "Extracting a method from its object (`const fn = obj.method`) or passing it as a bare callback detaches `this` — the fix is `bind()`, an arrow function wrapper, or calling it through the object.", np: "Object बाट method extract गर्दा (`const fn = obj.method`) वा bare callback को रूपमा pass गर्दा `this` छुटिन्छ — fix: `bind()`, arrow function, वा object मार्फत call।", jp: "オブジェクトからメソッドを取り出す（`const fn = obj.method`）か、そのままコールバックとして渡すとthisが外れる。修正には`bind()`、アロー関数、またはオブジェクト経由の呼び出しを使う。" },
      ],
      commonMistakes: [
        { en: "Passing `user.greet` as a callback (e.g. to `setTimeout` or an event listener) and being surprised `this` is no longer `user` when it runs.", np: "`user.greet` लाई callback को रूपमा (जस्तै `setTimeout` मा) pass गरेर, चलाउँदा `this` `user` नरहेकोमा अचम्मित हुनु।", jp: "`user.greet`を（`setTimeout`などに）コールバックとして渡し、実行時に`this`が`user`でなくなっていることに驚くこと。" },
        { en: "Forgetting that arrow functions ignore all four `this` rules entirely — `call()`/`apply()`/`bind()` cannot change an arrow function's `this`.", np: "Arrow functions ले चारै `this` rules बेवास्ता गर्छन् भन्ने बिर्सनु — `call()`/`apply()`/`bind()` ले arrow function को `this` बदल्न सक्दैन।", jp: "アロー関数が4つのthisルールをすべて無視することを忘れること。`call()`/`apply()`/`bind()`はアロー関数のthisを変更できない。" },
        { en: "Confusing `call()` and `apply()` argument order — `call` takes arguments one by one, `apply` takes a single array; mixing them up passes the wrong values.", np: "`call()` र `apply()` का arguments order मिलाउनु — `call` ले individual arguments लिन्छ, `apply` ले array लिन्छ।", jp: "`call()`と`apply()`の引数の渡し方を混同すること。callは個別、applyは配列で受け取る。" },
      ],
      quiz: [
        {
          question: { en: "What is `this` inside `showThis()` when called as a plain function in strict mode?", np: "Strict mode मा plain function को रूपमा call हुँदा `showThis()` भित्र `this` के हो?", jp: "strictモードでプレーン関数として呼び出された`showThis()`内の`this`は？" },
          options: [
            { en: "The global object", np: "Global object", jp: "グローバルオブジェクト" },
            { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
          ],
          correctIndex: 1,
          explanation: { en: "Default binding in strict mode leaves `this` as undefined rather than falling back to the global object.", np: "Strict mode मा default binding ले `this` लाई global object मा नखसाई undefined नै राख्छ।", jp: "strictモードのデフォルト束縛では、グローバルオブジェクトにフォールバックせずthisはundefinedのままになる。" },
        },
        {
          question: { en: "What happens when you do `const fn = user.greet; fn();`?", np: "`const fn = user.greet; fn();` गर्दा के हुन्छ?", jp: "`const fn = user.greet; fn();`をすると何が起こる？" },
          options: [
            { en: "`this` inside greet is still `user`", np: "greet भित्रको `this` अझै `user` नै हो", jp: "greet内のthisはまだuser" },
            { en: "`this` is lost — greet is now called with default binding, not implicit binding", np: "`this` हराउन्छ — greet अब default binding मार्फत call हुन्छ, implicit binding होइन", jp: "thisが失われる — greetはデフォルト束縛で呼ばれ、暗黙的束縛ではない" },
          ],
          correctIndex: 1,
          explanation: { en: "Extracting the function detaches it from the object; when called bare, there's no object to the left of a dot, so implicit binding no longer applies.", np: "Function extract गर्दा object बाट छुट्छ; bare call हुँदा dot को बायाँतिर कुनै object नहुने भएकाले implicit binding लागू हुँदैन।", jp: "関数を取り出すとオブジェクトから切り離される。そのまま呼ばれるとドットの左にオブジェクトがないため暗黙的束縛は適用されない。" },
        },
        {
          question: { en: "Between `call()` and `bind()`, which one invokes the function immediately?", np: "`call()` र `bind()` मध्ये कुनले function तुरुन्तै invoke गर्छ?", jp: "`call()`と`bind()`のうち即座に関数を呼び出すのはどちら？" },
          options: [
            { en: "`call()`", np: "`call()`", jp: "`call()`" },
            { en: "`bind()`", np: "`bind()`", jp: "`bind()`" },
          ],
          correctIndex: 0,
          explanation: { en: "call() and apply() invoke the function right away with the given this. bind() instead returns a new function for later use, without calling it.", np: "call() र apply() ले तुरुन्तै given this सँग function call गर्छन्। bind() ले पछि प्रयोग गर्न नयाँ function फर्काउँछ, call गर्दैन।", jp: "call()とapply()は指定されたthisで即座に関数を呼び出す。bind()は呼び出さずに後で使うための新しい関数を返す。" },
        },
      ],
    },
    {
      id: "arrow-functions-and-this",
      title: { en: "Arrow Functions & this", np: "Arrow Functions र this", jp: "アロー関数とthis" },
      durationMinutes: 9,
      explanation: {
        en: "Arrow functions do NOT have their own `this` at all. Instead, they capture the `this` of whatever function or scope contains them <b>at the moment they are created</b> — this is called lexical `this`. Because of that, none of the four binding rules from the previous lesson apply to them, and `call()`/`apply()`/`bind()` cannot override an arrow function's `this`.\n\nThis makes arrow functions perfect for callbacks inside a class method or another function, where you want `this` to stay pointed at the surrounding object — but it makes them the <b>wrong</b> choice for object methods defined directly with `{ method: () => {} }`, because at the moment that arrow is created, the surrounding scope is the module, not the object literal.",
        np: "Arrow functions को आफ्नै `this` हुँदैन — यिनले create भएको बेलाको surrounding scope बाट `this` capture गर्छन् (lexical this)। यसैले class method भित्र callback का लागि उत्तम, तर object literal मा method को रूपमा गलत choice।",
        jp: "アロー関数には独自のthisがない。作成時の周囲のスコープからthisをキャプチャする（レキシカルthis）。クラスメソッド内のコールバックには最適だが、オブジェクトリテラルのメソッドとしては誤った選択。",
      },
      diagram: `class Timer {
  start() {
    setInterval(function () { this.seconds++ }, 1000);
    //          └── regular fn: 'this' is undefined here ❌

    setInterval(() => { this.seconds++ }, 1000);
    //          └── arrow fn: captures 'this' from start() → the Timer instance ✅
  }
}

const obj = {
  count: 0,
  bad:  () => { this.count++ },   // 'this' captured from MODULE scope, not obj ❌
  good() { this.count++ },         // regular method — 'this' is obj when called obj.good() ✅
};`,
      codeExample: {
        title: { en: "Arrow functions capture this from their lexical context", np: "Arrow functions ले lexical context बाट this capture गर्छ", jp: "アロー関数はレキシカルコンテキストのthisをキャプチャする" },
        code: `class Timer {
  constructor() { this.seconds = 0; }

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

// ── Arrow function as an object method — wrong! ────────────────────
const counter = {
  count: 0,
  // ❌ Captures 'this' from the surrounding module scope, not the object
  increment: () => { this.count++; },
  // ✅ Regular method — 'this' is the object when called as counter.incrementFixed()
  incrementFixed() { this.count++; },
};

// ── The canonical, correct pattern ─────────────────────────────────
class UserList {
  constructor(users) { this.users = users; }
  getNames() {
    // Arrow function inside .map(): 'this' still refers to the UserList instance
    return this.users.map(user => \`\${user.name} (list size: \${this.users.length})\`);
  }
}`,
      },
      keyTakeaways: [
        { en: "Arrow functions have no `this` of their own — they capture `this` lexically from the enclosing scope at the moment they are created, and that binding never changes.", np: "Arrow functions को आफ्नै `this` हुँदैन — create भएको बेला enclosing scope बाट lexically `this` capture गर्छन्, र त्यो binding कहिल्यै बदलिँदैन।", jp: "アロー関数には独自のthisがない。作成時に囲むスコープからレキシカルにthisをキャプチャし、その束縛は変わらない。" },
        { en: "Use an arrow function for a callback INSIDE a class method or function when you want `this` to stay pointed at the instance/enclosing scope.", np: "Class method वा function भित्र callback का लागि arrow function प्रयोग गर्नुहोस् जब `this` instance/enclosing scope मै रहनुपर्छ।", jp: "thisをインスタンス/囲むスコープに保ちたい場合、クラスメソッドや関数内のコールバックにアロー関数を使う。" },
        { en: "Never use an arrow function to define an object literal method directly (`{ method: () => {} }`) — at creation time its lexical scope is the surrounding module, not the object.", np: "Object literal मा method को रूपमा arrow function कहिल्यै प्रयोग नगर्नुहोस् (`{ method: () => {} }`) — creation बेला lexical scope object होइन, module हो।", jp: "オブジェクトリテラルのメソッドを直接アロー関数で定義しない（`{ method: () => {} }`）。作成時のレキシカルスコープはオブジェクトではなく周囲のモジュール。" },
      ],
      commonMistakes: [
        { en: "Writing `setInterval(function() { this.x++ }, 1000)` inside a class method and being confused why `this` is `undefined` — a regular function loses the surrounding `this`.", np: "Class method भित्र `setInterval(function() { this.x++ }, 1000)` लेखेर `this` `undefined` किन भयो भनेर confuse हुनु।", jp: "クラスメソッド内で`setInterval(function() { this.x++ }, 1000)`と書き、thisがundefinedになる理由が分からず混乱すること。" },
        { en: "Defining an object method as an arrow function (`increment: () => { this.count++ }`) expecting `this` to be the object — it captures the module scope instead.", np: "Object method लाई arrow function (`increment: () => { this.count++ }`) को रूपमा लेखेर `this` object हुनेछ भनी आशा गर्नु — बरु module scope capture हुन्छ।", jp: "オブジェクトメソッドをアロー関数（`increment: () => { this.count++ }`）として定義し、thisがオブジェクトになると期待すること。実際はモジュールスコープをキャプチャする。" },
        { en: "Trying to use `.call()`, `.apply()`, or `.bind()` on an arrow function to change its `this` — arrow functions ignore all explicit binding attempts.", np: "Arrow function मा `this` बदलन `.call()`, `.apply()`, `.bind()` प्रयोग गर्ने प्रयास गर्नु — arrow functions ले सबै explicit binding लाई बेवास्ता गर्छन्।", jp: "アロー関数のthisを変更するために`.call()`、`.apply()`、`.bind()`を使おうとすること。アロー関数はすべての明示的束縛の試みを無視する。" },
      ],
      quiz: [
        {
          question: { en: "Where does an arrow function get its `this` from?", np: "Arrow function ले आफ्नो `this` कहाँबाट पाउँछ?", jp: "アロー関数はthisをどこから取得する？" },
          options: [
            { en: "From the object it is called on, like a regular method", np: "यसलाई call गरिने object बाट, regular method जस्तै", jp: "通常のメソッドのように呼び出されたオブジェクトから" },
            { en: "From the enclosing lexical scope at the time it was created", np: "Create भएको बेलाको enclosing lexical scope बाट", jp: "作成時の囲むレキシカルスコープから" },
          ],
          correctIndex: 1,
          explanation: { en: "Arrow functions have no this-binding mechanism of their own; they simply inherit whatever this was in scope when the arrow was defined.", np: "Arrow functions सँग आफ्नै this-binding mechanism हुँदैन; यिनले arrow define हुँदाको scope को this नै inherit गर्छन्।", jp: "アロー関数には独自のthis束縛機構がない。定義時のスコープにあったthisをそのまま継承する。" },
        },
        {
          question: { en: "Why is an arrow function the WRONG choice for `const obj = { count: 0, inc: () => { this.count++ } }`?", np: "`const obj = { count: 0, inc: () => { this.count++ } }` मा arrow function किन गलत choice हो?", jp: "`const obj = { count: 0, inc: () => { this.count++ } }`でアロー関数が間違った選択なのはなぜ？" },
          options: [
            { en: "Because at creation time, `this` is captured from the module scope, not from `obj`", np: "किनकि creation बेला `this` module scope बाट capture हुन्छ, `obj` बाट होइन", jp: "作成時にthisはobjからではなくモジュールスコープからキャプチャされるため" },
            { en: "Because arrow functions can't access object properties at all", np: "किनकि arrow functions ले object properties access नै गर्न सक्दैनन्", jp: "アロー関数はオブジェクトのプロパティに全くアクセスできないため" },
          ],
          correctIndex: 0,
          explanation: { en: "The arrow is defined in the object literal's surrounding scope, not inside a call to inc() on obj, so it never sees obj as this.", np: "Arrow object literal को surrounding scope मा define हुन्छ, obj मा inc() call भित्र होइन, त्यसैले यसले कहिल्यै obj लाई this को रूपमा देख्दैन।", jp: "アローはobjに対するinc()の呼び出し内ではなく、オブジェクトリテラルを囲むスコープで定義されるため、objをthisとして見ることはない。" },
        },
        {
          question: { en: "Can `.bind()` change what `this` refers to inside an arrow function?", np: "`.bind()` ले arrow function भित्र `this` ले के जनाउँछ बदल्न सक्छ?", jp: "`.bind()`はアロー関数内のthisが指すものを変更できる？" },
          options: [
            { en: "No — arrow functions ignore all explicit binding attempts", np: "होइन — arrow functions ले सबै explicit binding प्रयासलाई बेवास्ता गर्छन्", jp: "いいえ — アロー関数はすべての明示的束縛の試みを無視する" },
            { en: "Yes, exactly like a regular function", np: "हो, regular function जस्तै ठ्याक्कै", jp: "はい、通常の関数とまったく同じ" },
          ],
          correctIndex: 0,
          explanation: { en: "Since arrow functions never had a dynamic this-binding mechanism to begin with, there is nothing for bind()/call()/apply() to override.", np: "Arrow functions मा सुरुदेखि नै dynamic this-binding mechanism नभएकाले, bind()/call()/apply() ले override गर्ने केही हुँदैन।", jp: "アロー関数には最初から動的なthis束縛機構がないため、bind()/call()/apply()が上書きするものが何もない。" },
        },
      ],
    },
    {
      id: "call-apply-bind",
      title: { en: "call, apply, and bind in Depth", np: "call, apply, bind विस्तारमा", jp: "call・apply・bindの詳細" },
      durationMinutes: 9,
      explanation: {
        en: "All three methods explicitly control what `this` is inside a function, but they differ in when they run and how arguments are passed:\n\n• <b>call(thisArg, a, b, c)</b> — invokes the function immediately, with arguments passed individually\n• <b>apply(thisArg, [a, b, c])</b> — invokes the function immediately, with arguments passed as a single array — useful when your arguments already exist as an array\n• <b>bind(thisArg, a, b)</b> — does NOT invoke the function; it returns a brand-new function with `this` (and optionally some leading arguments) permanently fixed, ready to be called later\n\nA classic use case for `bind()` is fixing `this` for an event handler or a callback that will be invoked much later, by code that has no idea what object it \"belongs\" to. With the spread operator available in modern JS, `apply` is rarely needed on its own — `fn.call(thisArg, ...args)` covers the same case.",
        np: "तीनैले `this` explicitly control गर्छन् तर फरक तरिकाले: call ले arguments individually लिन्छ, apply ले array मा लिन्छ, दुवैले तुरुन्तै call गर्छन्। bind ले तुरुन्तै call गर्दैन — this permanently fixed भएको नयाँ function फर्काउँछ, पछि call गर्न।",
        jp: "3つとも明示的にthisを制御するが方法が異なる: callは個別引数、applyは配列引数で、両方とも即座に呼び出す。bindは即座に呼び出さず、thisが固定された新しい関数を返し後で使う。",
      },
      diagram: `                 Calls now?   Arguments as        Returns
call(obj,a,b)      YES        a, b (individual)   fn's return value
apply(obj,[a,b])   YES        [a, b] (array)      fn's return value
bind(obj,a,b)      NO         pre-filled (a, b)    a NEW function

bind() is like currying 'this' itself — the returned function
remembers its 'this' and any pre-filled args forever.`,
      codeExample: {
        title: { en: "call, apply, and bind side by side", np: "call, apply, bind एकैसाथ", jp: "call・apply・bindの比較" },
        code: `function introduce(greeting, punctuation) {
  console.log(\`\${greeting}, I'm \${this.name}\${punctuation}\`);
}

const alice = { name: "Alice" };
const bob   = { name: "Bob" };

// ── call — pass 'this' and arguments one by one ───────────────────
introduce.call(alice, "Hello", "!");   // "Hello, I'm Alice!"
introduce.call(bob,   "Hi", ".");      // "Hi, I'm Bob."

// ── apply — pass 'this' and arguments as an array ──────────────────
introduce.apply(alice, ["Hey", "?"]);  // "Hey, I'm Alice?"

// ── bind — returns a NEW function with 'this' permanently fixed ────
const aliceIntro = introduce.bind(alice, "Howdy");  // 'greeting' pre-filled too
aliceIntro("!");  // "Howdy, I'm Alice!"
aliceIntro("?");  // "Howdy, I'm Alice?"

// ── Real use case: borrowing an array method for an array-like ─────
function sumArguments() {
  // 'arguments' is array-like but not a real array — borrow Array's reduce
  return Array.prototype.reduce.call(arguments, (sum, n) => sum + n, 0);
}
sumArguments(1, 2, 3);  // 6

// ── Real use case: fixing 'this' for an event handler ───────────────
class Button {
  constructor(label) {
    this.label = label;
    this.onClick = this.onClick.bind(this);  // permanently fix 'this' to the instance
  }
  onClick() { console.log(\`\${this.label} clicked\`); }
}
const btn = new Button("Submit");
// document.addEventListener("click", btn.onClick);  // 'this' stays correct even when detached`,
      },
      keyTakeaways: [
        { en: "`call(thisArg, a, b)` and `apply(thisArg, [a, b])` both invoke the function immediately — they differ only in how arguments are passed (individually vs. as an array).", np: "`call(thisArg, a, b)` र `apply(thisArg, [a, b])` दुवैले function तुरुन्तै invoke गर्छन् — फरक arguments pass गर्ने तरिकामा मात्र (individual vs array)।", jp: "`call(thisArg, a, b)`と`apply(thisArg, [a, b])`はどちらも関数を即座に呼び出す。違いは引数の渡し方（個別か配列か）だけ。" },
        { en: "`bind(thisArg)` does NOT call the function — it returns a new function with `this` permanently locked in, for use later as a callback or event handler.", np: "`bind(thisArg)` ले function call गर्दैन — यसले `this` permanently locked भएको नयाँ function फर्काउँछ, पछि callback वा event handler का लागि।", jp: "`bind(thisArg)`は関数を呼び出さない。thisが永久に固定された新しい関数を返し、後でコールバックやイベントハンドラとして使う。" },
        { en: "A common real-world use of `bind()` is fixing `this` on a class method before passing it as a callback, so the method still works correctly once detached from the instance.", np: "`bind()` को सामान्य real-world use: callback को रूपमा pass गर्नुअघि class method मा `this` fix गर्नु, ताकि instance बाट detach भएपछि पनि सहि काम गरोस्।", jp: "`bind()`の一般的な実用例は、コールバックとして渡す前にクラスメソッドのthisを固定すること。インスタンスから切り離されても正しく動作する。" },
      ],
      commonMistakes: [
        { en: "Mixing up `call`'s individual-argument signature with `apply`'s array signature — passing an array to `call` sends the whole array as a single argument, not spread out.", np: "`call` को individual-argument signature र `apply` को array signature मिलाउनु — `call` मा array pass गर्दा array नै एउटा argument बन्छ, फैलिँदैन।", jp: "callの個別引数シグネチャとapplyの配列シグネチャを混同すること。callに配列を渡すと配列全体が1つの引数として送られる。" },
        { en: "Calling `bind()` and expecting the function to run immediately — `bind()` only returns a new function; you still have to call that returned function.", np: "`bind()` call गरेर function तुरुन्तै चल्छ भन्ने आशा गर्नु — `bind()` ले नयाँ function मात्र फर्काउँछ; त्यो returned function लाई अझै call गर्नुपर्छ।", jp: "`bind()`を呼び出すと即座に関数が実行されると期待すること。`bind()`は新しい関数を返すだけで、その関数はまだ呼び出す必要がある。" },
        { en: "Forgetting to bind a class method used as an event handler, then being confused why `this` is `undefined` inside it when the event fires.", np: "Event handler को रूपमा प्रयोग हुने class method bind गर्न बिर्सनु, अनि event fire हुँदा `this` `undefined` भएकोमा confuse हुनु।", jp: "イベントハンドラとして使うクラスメソッドをbindし忘れ、イベント発火時にthisがundefinedになって混乱すること。" },
      ],
      quiz: [
        {
          question: { en: "What is the main difference between `call()` and `apply()`?", np: "`call()` र `apply()` बीचको मुख्य फरक के हो?", jp: "`call()`と`apply()`の主な違いは？" },
          options: [
            { en: "call passes arguments individually; apply passes them as a single array", np: "call ले arguments individually pass गर्छ; apply ले single array मा pass गर्छ", jp: "callは引数を個別に渡す。applyは単一の配列として渡す" },
            { en: "call returns a new function; apply invokes immediately", np: "call ले नयाँ function फर्काउँछ; apply ले तुरुन्तै invoke गर्छ", jp: "callは新しい関数を返す。applyは即座に呼び出す" },
          ],
          correctIndex: 0,
          explanation: { en: "Both invoke the function right away with a given this — only the argument-passing format differs.", np: "दुवैले given this सँग तुरुन्तै function invoke गर्छन् — argument-passing format मात्र फरक हो।", jp: "両方とも指定されたthisで即座に関数を呼び出す。引数の渡し方だけが異なる。" },
        },
        {
          question: { en: "Does `bind()` call the function immediately?", np: "`bind()` ले function तुरुन्तै call गर्छ?", jp: "`bind()`は関数を即座に呼び出す？" },
          options: [
            { en: "No — it returns a new function to be called later", np: "होइन — यसले पछि call गर्न नयाँ function फर्काउँछ", jp: "いいえ — 後で呼び出すための新しい関数を返す" },
            { en: "Yes, exactly like call()", np: "हो, call() जस्तै ठ्याक्कै", jp: "はい、call()とまったく同じ" },
          ],
          correctIndex: 0,
          explanation: { en: "bind() is the only one of the three that doesn't invoke — it produces a reusable, this-locked function instead.", np: "तीनमध्ये bind() मात्र invoke गर्दैन — बरु reusable, this-locked function उत्पादन गर्छ।", jp: "3つのうちbind()だけが呼び出さない。代わりに再利用可能なthis固定関数を生成する。" },
        },
        {
          question: { en: "Why is it common to write `this.onClick = this.onClick.bind(this)` inside a class constructor?", np: "Class constructor भित्र `this.onClick = this.onClick.bind(this)` लेख्नु किन सामान्य हो?", jp: "クラスのコンストラクタ内で`this.onClick = this.onClick.bind(this)`と書くのが一般的なのはなぜ？" },
          options: [
            { en: "So the method keeps working correctly once it's passed elsewhere as a bare callback, detached from the instance", np: "ताकि method अन्यत्र bare callback को रूपमा pass हुँदा, instance बाट detach भए पनि सहि काम गर्न जारी राखोस्", jp: "メソッドが他の場所に生のコールバックとして渡され、インスタンスから切り離されても正しく動作し続けるように" },
            { en: "It's required syntax for all class methods", np: "यो सबै class methods का लागि आवश्यक syntax हो", jp: "すべてのクラスメソッドに必要な構文だから" },
          ],
          correctIndex: 0,
          explanation: { en: "Without binding, passing a method as a callback (e.g. to an event listener) loses implicit binding, and 'this' becomes undefined when it runs.", np: "Bind नगरे, method लाई callback को रूपमा pass गर्दा implicit binding हराउन्छ, र चलाउँदा 'this' undefined हुन्छ।", jp: "束縛しないと、メソッドをコールバックとして渡すと暗黙的束縛が失われ、実行時にthisがundefinedになる。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "What is `this` inside a plain function call in strict mode?", np: "Strict mode मा plain function call भित्र `this` के हो?", jp: "strictモードでのプレーンな関数呼び出し内のthisは？" },
      options: [{ en: "`undefined`", np: "`undefined`", jp: "`undefined`" }, { en: "The global object", np: "Global object", jp: "グローバルオブジェクト" }],
      correctIndex: 0,
      explanation: { en: "Strict mode default binding does not fall back to the global object.", np: "Strict mode default binding ले global object मा फिर्ता जाँदैन।", jp: "strictモードのデフォルト束縛はグローバルオブジェクトにフォールバックしない。" },
    },
    {
      question: { en: "What happens to `this` when you extract a method off its object and call it bare?", np: "Method लाई object बाट extract गरेर bare call गर्दा `this` को हुन्छ?", jp: "オブジェクトからメソッドを取り出して生で呼び出すとthisはどうなる？" },
      options: [{ en: "It's lost — falls back to default binding", np: "हराउन्छ — default binding मा फिर्ता जान्छ", jp: "失われる — デフォルト束縛にフォールバックする" }, { en: "It stays pointed at the original object", np: "मूल object मै रहन्छ", jp: "元のオブジェクトを指したままになる" }],
      correctIndex: 0,
      explanation: { en: "Without the object to the left of a dot at the call site, implicit binding cannot apply.", np: "Call site मा dot को बायाँ object नभई implicit binding लागू हुँदैन।", jp: "呼び出し場所でドットの左にオブジェクトがなければ暗黙的束縛は適用されない。" },
    },
    {
      question: { en: "Which binding rule wins if a function is both called with `new` and bound with `bind()`?", np: "Function `new` सँग call भएको छ र `bind()` ले पनि bind भएको छ भने कुन rule जित्छ?", jp: "関数が`new`で呼ばれ、かつ`bind()`で束縛されている場合、どちらのルールが勝つ？" },
      options: [{ en: "`new` binding — it has the highest priority", np: "`new` binding — highest priority", jp: "`new`束縛 — 最も優先度が高い" }, { en: "Explicit binding always wins", np: "Explicit binding ले सधैं जित्छ", jp: "明示的束縛が常に勝つ" }],
      correctIndex: 0,
      explanation: { en: "new binding sits above explicit binding in the priority order of the four this rules.", np: "चार this rules को priority order मा new binding explicit binding भन्दा माथि छ।", jp: "4つのthisルールの優先順位では、new束縛は明示的束縛より上位にある。" },
    },
    {
      question: { en: "Where does an arrow function's `this` come from?", np: "Arrow function को `this` कहाँबाट आउँछ?", jp: "アロー関数のthisはどこから来る？" },
      options: [{ en: "The lexical scope surrounding it at creation time", np: "Creation बेलाको surrounding lexical scope", jp: "作成時の周囲のレキシカルスコープ" }, { en: "Whatever object it's later called on", np: "पछि जुन object मा call हुन्छ त्यही", jp: "後で呼び出されるオブジェクト" }],
      correctIndex: 0,
      explanation: { en: "Arrow functions have no dynamic this-binding — they inherit this from where they were defined.", np: "Arrow functions मा dynamic this-binding हुँदैन — यिनले define भएको ठाउँबाट this inherit गर्छन्।", jp: "アロー関数には動的なthis束縛がない。定義された場所からthisを継承する。" },
    },
    {
      question: { en: "Is an arrow function a good choice for an object literal method like `{ inc: () => { this.count++ } }`?", np: "`{ inc: () => { this.count++ } }` जस्तो object literal method का लागि arrow function राम्रो choice हो?", jp: "`{ inc: () => { this.count++ } }`のようなオブジェクトリテラルのメソッドにアロー関数は適切？" },
      options: [{ en: "No — it captures this from the module scope, not the object", np: "होइन — यसले module scope बाट this capture गर्छ, object बाट होइन", jp: "いいえ — オブジェクトではなくモジュールスコープからthisをキャプチャする" }, { en: "Yes — it always refers to the object it's defined on", np: "हो — यो सधैं define भएको object लाई जनाउँछ", jp: "はい — 常に定義されたオブジェクトを指す" }],
      correctIndex: 0,
      explanation: { en: "The arrow's lexical scope at creation time is the module, not the object literal being built.", np: "Arrow को creation बेलाको lexical scope module हो, बन्दै गरेको object literal होइन।", jp: "アローの作成時のレキシカルスコープは、構築中のオブジェクトリテラルではなくモジュール。" },
    },
    {
      question: { en: "Can `bind()` override an arrow function's `this`?", np: "`bind()` ले arrow function को `this` override गर्न सक्छ?", jp: "`bind()`はアロー関数のthisを上書きできる？" },
      options: [{ en: "No — arrow functions ignore explicit binding entirely", np: "होइन — arrow functions ले explicit binding लाई पूर्ण बेवास्ता गर्छन्", jp: "いいえ — アロー関数は明示的束縛を完全に無視する" }, { en: "Yes, just like a regular function", np: "हो, regular function जस्तै", jp: "はい、通常の関数と同じ" }],
      correctIndex: 0,
      explanation: { en: "There is no dynamic this-binding to override on an arrow function in the first place.", np: "Arrow function मा override गर्ने dynamic this-binding सुरुदेखि नै हुँदैन।", jp: "そもそもアロー関数には上書きすべき動的なthis束縛が存在しない。" },
    },
    {
      question: { en: "What is the key difference in how `call()` and `apply()` pass arguments?", np: "`call()` र `apply()` ले arguments pass गर्ने तरिकामा मुख्य फरक के हो?", jp: "`call()`と`apply()`の引数の渡し方の主な違いは？" },
      options: [{ en: "call takes individual arguments; apply takes a single array", np: "call ले individual arguments लिन्छ; apply ले single array लिन्छ", jp: "callは個別の引数を受け取る。applyは単一の配列を受け取る" }, { en: "They pass arguments identically", np: "दुवैले arguments उस्तै तरिकाले pass गर्छन्", jp: "両者は引数を同じように渡す" }],
      correctIndex: 0,
      explanation: { en: "This is the sole functional difference between the two methods; both invoke immediately.", np: "यही दुई methods बीचको एकमात्र functional फरक हो; दुवैले तुरुन्तै invoke गर्छन्।", jp: "これが2つのメソッドの唯一の機能的な違い。両方とも即座に呼び出す。" },
    },
    {
      question: { en: "Does `bind()` invoke the function immediately?", np: "`bind()` ले function तुरुन्तै invoke गर्छ?", jp: "`bind()`は関数を即座に呼び出す？" },
      options: [{ en: "No — it returns a new function for later use", np: "होइन — यसले पछि प्रयोगका लागि नयाँ function फर्काउँछ", jp: "いいえ — 後で使うための新しい関数を返す" }, { en: "Yes, immediately", np: "हो, तुरुन्तै", jp: "はい、即座に" }],
      correctIndex: 0,
      explanation: { en: "bind() is the odd one out among the three — it never calls the function itself.", np: "तीनमध्ये bind() अलग हो — यसले function आफैं कहिल्यै call गर्दैन।", jp: "3つの中でbind()は例外的で、関数自体を決して呼び出さない。" },
    },
    {
      question: { en: "Why bind a class method used as an event handler in the constructor?", np: "Constructor मा event handler को रूपमा प्रयोग हुने class method किन bind गर्ने?", jp: "コンストラクタでイベントハンドラとして使うクラスメソッドをなぜbindするのか？" },
      options: [{ en: "So `this` stays correct once the method is detached and called by the event system", np: "ताकि method detach भएर event system ले call गर्दा पनि `this` सहि रहोस्", jp: "メソッドが切り離され、イベントシステムによって呼び出されてもthisが正しいままであるように" }, { en: "It's purely a stylistic convention with no functional effect", np: "यो कुनै functional असर नभएको केवल stylistic convention हो", jp: "機能的な効果はなく、純粋にスタイル上の慣習" }],
      correctIndex: 0,
      explanation: { en: "Event systems call the handler bare, without the instance to the left of a dot, so binding is what preserves the correct this.", np: "Event system ले handler लाई bare call गर्छ, dot को बायाँ instance बिना, त्यसैले bind ले नै सहि this जोगाउँछ।", jp: "イベントシステムはハンドラをドットの左にインスタンスなしで生で呼び出すため、束縛が正しいthisを保持する。" },
    },
  ],
};
