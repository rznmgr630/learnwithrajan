import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_20_LESSONS: JsLessonDay = {
  day: 20,
  title: { en: "DOM, events, event bubbling & delegation", np: "DOM, events, bubbling र delegation", jp: "DOM・イベント・バブリング・委譲" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "querying-modifying-dom",
      title: { en: "Querying & Modifying the DOM", np: "DOM Query र Modify गर्नु", jp: "DOMのクエリと変更" },
      durationMinutes: 9,
      explanation: {
        en: "The <b>DOM (Document Object Model)</b> is the browser's JavaScript representation of an HTML document.\n\nWhen a browser loads HTML, it turns the document into a tree of objects that JavaScript can query, read, modify, create and remove.\n\n```text\nHTML\n │\n ▼\nDOM Tree\n │\n ├── document\n │    ├── body\n │    │    ├── h1\n │    │    └── button\n │    └── footer\n │\n ▼\nJavaScript\n │\n ├── Find elements\n ├── Read content\n ├── Change content\n ├── Change classes\n ├── Change attributes\n └── Create elements\n```\n\nThe most important DOM skill is understanding the difference between <b>finding</b> an element and <b>modifying</b> one.\n\n---\n\n### Querying elements\n\n`querySelector()` returns the <b>first element</b> matching a CSS selector.\n\n```javascript\nconst heading = document.querySelector(\"h1\");\n```\n\nIt accepts normal CSS selectors:\n\n```javascript\ndocument.querySelector(\"#app\");\ndocument.querySelector(\".card\");\ndocument.querySelector(\"button\");\ndocument.querySelector(\".card button\");\ndocument.querySelector(\"[data-id='123']\");\n```\n\nIf nothing matches, it returns `null`:\n\n```javascript\nconst element = document.querySelector(\".does-not-exist\");\n\nconsole.log(element); // null\n```\n\n`querySelectorAll()` returns <b>all matching elements</b>:\n\n```javascript\nconst buttons = document.querySelectorAll(\"button\");\n\nconsole.log(buttons.length); // 3\n```\n\n> `querySelector()` → first match\n> `querySelectorAll()` → all matches\n\n`querySelectorAll()` returns a <b>static NodeList</b>, meaning the collection does not automatically update when matching elements are later added or removed.\n\n`getElementById()` is designed specifically for IDs:\n\n```javascript\nconst app = document.getElementById(\"app\");\n```\n\nYou cannot pass arbitrary CSS selectors to it. `document.getElementById(\".card\")` does not work; use `document.querySelector(\".card\")` instead.\n\n---\n\n### 1. Basic — change text\n\n```html\n<h1 id=\"title\">Hello World</h1>\n```\n\n```javascript\nconst title = document.querySelector(\"#title\");\n\ntitle.textContent = \"Hello JavaScript!\";\n```\n\n<b>Why `textContent`?</b> It treats the value as text, not HTML:\n\n```javascript\ntitle.textContent = \"<strong>Hello</strong>\";\n```\n\nThe browser displays the literal characters `<strong>Hello</strong>`. It does not create a `<strong>` element. That makes `textContent` the safer choice for untrusted user input.\n\n---\n\n### 2. Intermediate — classes and attributes\n\n```javascript\nconst button = document.querySelector(\"#save\");\n\nbutton.classList.add(\"active\");\nbutton.classList.remove(\"active\");\nbutton.classList.toggle(\"active\");\n\nconsole.log(button.classList.contains(\"active\"));\n```\n\nThis is preferable to rewriting the whole `class` attribute by hand.\n\nAttributes work similarly:\n\n```javascript\nbutton.setAttribute(\"disabled\", \"\");\n\nconsole.log(button.getAttribute(\"disabled\"));\n\nbutton.removeAttribute(\"disabled\");\n```\n\nCustom data attributes are read the same way, or through `dataset`:\n\n```html\n<button data-user-id=\"42\">Delete</button>\n```\n\n```javascript\nconst button = document.querySelector(\"button\");\n\nconsole.log(button.getAttribute(\"data-user-id\")); // \"42\"\nconsole.log(button.dataset.userId);               // \"42\"\n```\n\n---\n\n### 3. Advanced — create and insert elements\n\n```html\n<ul id=\"users\"></ul>\n```\n\n```javascript\nconst list = document.querySelector(\"#users\");\n\nconst li = document.createElement(\"li\");\n\nli.textContent = \"Rajan\";\n\nlist.appendChild(li);\n```\n\nCreating an element alone changes nothing on screen. It exists in memory but is not connected to the document until you insert it.\n\nBuilding several at once:\n\n```javascript\nconst users = [\"Rajan\", \"John\", \"Sarah\"];\n\nconst list = document.querySelector(\"#users\");\n\nfor (const user of users) {\n  const li = document.createElement(\"li\");\n\n  li.textContent = user;\n\n  list.append(li);\n}\n```\n\n---\n\n### `textContent` vs `innerHTML`\n\n```javascript\nelement.textContent = \"<h1>Hello</h1>\"; // shows the literal text\nelement.innerHTML = \"<h1>Hello</h1>\";   // parses it as HTML\n```\n\n`innerHTML` is useful when you intentionally need markup, but it becomes dangerous with untrusted input:\n\n```javascript\nelement.innerHTML = username; // potential XSS\nelement.textContent = username; // safe\n```\n\n```text\nUser input\n    │\n    ▼\ntextContent\n    │\n    ▼\nSafe text\n\n\nUser input\n    │\n    ▼\ninnerHTML\n    │\n    ▼\nBrowser parses HTML\n    │\n    ▼\nPotential XSS\n```\n\n---\n\n### `style` vs `classList`\n\nYou can set styles directly:\n\n```javascript\nbox.style.width = \"200px\";\nbox.style.backgroundColor = \"blue\";\n```\n\nThat works, but prefer CSS classes for presentation:\n\n```javascript\nbox.classList.add(\"expanded\");\n```\n\n> <b>JavaScript controls behaviour; CSS controls presentation.</b>\n\nUse `style` when the value is genuinely dynamic, such as `box.style.width = \\`${width}px\\`;`.\n\n---\n\n### `append()` vs `appendChild()`\n\n`appendChild()` accepts a single Node and returns the inserted node. `append()` is newer and more flexible — it accepts strings and multiple items:\n\n```javascript\nparent.append(element1, element2, \"Hello\");\n```\n\n---\n\n### Quick comparison\n\n```text\nquerySelector()     → first match, Element or null\nquerySelectorAll()  → all matches, static NodeList\ngetElementById()    → by id, Element or null\ntextContent         → read/write plain text\ninnerHTML           → read/write parsed HTML\nclassList add/remove/toggle/contains\nsetAttribute / getAttribute / removeAttribute\ncreateElement()     → detached element in memory\nappend() / appendChild()  → insert into the document\nstyle               → inline CSS\n```",
        np: "<b>DOM (Document Object Model)</b> HTML document को browser भित्रको JavaScript प्रतिनिधित्व हो।\n\nBrowser ले HTML load गर्दा, document लाई object को tree मा बदल्छ जसलाई JavaScript ले query, read, modify, create र remove गर्न सक्छ।\n\n```text\nHTML\n │\n ▼\nDOM Tree\n │\n ├── document\n │    ├── body\n │    │    ├── h1\n │    │    └── button\n │    └── footer\n │\n ▼\nJavaScript\n │\n ├── Find elements\n ├── Read content\n ├── Change content\n ├── Change classes\n ├── Change attributes\n └── Create elements\n```\n\nसबैभन्दा महत्वपूर्ण DOM सीप हो — element <b>खोज्नु</b> र element <b>बदल्नु</b> बीचको भिन्नता बुझ्नु।\n\n---\n\n### Element query गर्नु\n\n`querySelector()` ले CSS selector सँग मिल्ने <b>पहिलो element</b> फर्काउँछ।\n\n```javascript\nconst heading = document.querySelector(\"h1\");\n```\n\nयसले सामान्य CSS selector लिन्छ:\n\n```javascript\ndocument.querySelector(\"#app\");\ndocument.querySelector(\".card\");\ndocument.querySelector(\"button\");\ndocument.querySelector(\".card button\");\ndocument.querySelector(\"[data-id='123']\");\n```\n\nकेही नमिले `null` फर्काउँछ:\n\n```javascript\nconst element = document.querySelector(\".does-not-exist\");\n\nconsole.log(element); // null\n```\n\n`querySelectorAll()` ले <b>सबै मिल्ने element</b> फर्काउँछ:\n\n```javascript\nconst buttons = document.querySelectorAll(\"button\");\n\nconsole.log(buttons.length); // 3\n```\n\n> `querySelector()` → पहिलो match\n> `querySelectorAll()` → सबै match\n\n`querySelectorAll()` ले <b>static NodeList</b> फर्काउँछ, अर्थात् पछि element थपिँदा वा हटाइँदा त्यो संग्रह आफैं अद्यावधिक हुँदैन।\n\n`getElementById()` विशेष गरी ID का लागि हो:\n\n```javascript\nconst app = document.getElementById(\"app\");\n```\n\nयसमा जथाभावी CSS selector दिन मिल्दैन। `document.getElementById(\".card\")` काम गर्दैन; बरु `document.querySelector(\".card\")` प्रयोग गर्नुहोस्।\n\n---\n\n### 1. आधारभूत — text बदल्नु\n\n```html\n<h1 id=\"title\">Hello World</h1>\n```\n\n```javascript\nconst title = document.querySelector(\"#title\");\n\ntitle.textContent = \"Hello JavaScript!\";\n```\n\n<b>किन `textContent`?</b> यसले मानलाई HTML होइन, text ठान्छ:\n\n```javascript\ntitle.textContent = \"<strong>Hello</strong>\";\n```\n\nBrowser ले अक्षरशः `<strong>Hello</strong>` देखाउँछ। `<strong>` element बन्दैन। त्यसैले अविश्वसनीय user input का लागि `textContent` सुरक्षित छनौट हो।\n\n---\n\n### 2. मध्यम — class र attribute\n\n```javascript\nconst button = document.querySelector(\"#save\");\n\nbutton.classList.add(\"active\");\nbutton.classList.remove(\"active\");\nbutton.classList.toggle(\"active\");\n\nconsole.log(button.classList.contains(\"active\"));\n```\n\nपूरै `class` attribute हातले लेख्नुभन्दा यो राम्रो हो।\n\nAttribute पनि उस्तै:\n\n```javascript\nbutton.setAttribute(\"disabled\", \"\");\n\nconsole.log(button.getAttribute(\"disabled\"));\n\nbutton.removeAttribute(\"disabled\");\n```\n\nCustom data attribute उही तरिकाले, वा `dataset` मार्फत पढिन्छ:\n\n```html\n<button data-user-id=\"42\">Delete</button>\n```\n\n```javascript\nconst button = document.querySelector(\"button\");\n\nconsole.log(button.getAttribute(\"data-user-id\")); // \"42\"\nconsole.log(button.dataset.userId);               // \"42\"\n```\n\n---\n\n### 3. उन्नत — element बनाउनु र राख्नु\n\n```html\n<ul id=\"users\"></ul>\n```\n\n```javascript\nconst list = document.querySelector(\"#users\");\n\nconst li = document.createElement(\"li\");\n\nli.textContent = \"Rajan\";\n\nlist.appendChild(li);\n```\n\nElement बनाउँदैमा screen मा केही बदलिँदैन। यो memory मा हुन्छ तर insert नगरेसम्म document सँग जोडिँदैन।\n\nधेरै सँगै बनाउँदा:\n\n```javascript\nconst users = [\"Rajan\", \"John\", \"Sarah\"];\n\nconst list = document.querySelector(\"#users\");\n\nfor (const user of users) {\n  const li = document.createElement(\"li\");\n\n  li.textContent = user;\n\n  list.append(li);\n}\n```\n\n---\n\n### `textContent` vs `innerHTML`\n\n```javascript\nelement.textContent = \"<h1>Hello</h1>\"; // अक्षरशः text देखाउँछ\nelement.innerHTML = \"<h1>Hello</h1>\";   // HTML भनी parse गर्छ\n```\n\nजानाजान markup चाहिँदा `innerHTML` उपयोगी छ, तर अविश्वसनीय input सँग खतरनाक बन्छ:\n\n```javascript\nelement.innerHTML = username; // सम्भावित XSS\nelement.textContent = username; // सुरक्षित\n```\n\n```text\nUser input\n    │\n    ▼\ntextContent\n    │\n    ▼\nSafe text\n\n\nUser input\n    │\n    ▼\ninnerHTML\n    │\n    ▼\nBrowser parses HTML\n    │\n    ▼\nPotential XSS\n```\n\n---\n\n### `style` vs `classList`\n\nStyle सिधै सेट गर्न सकिन्छ:\n\n```javascript\nbox.style.width = \"200px\";\nbox.style.backgroundColor = \"blue\";\n```\n\nकाम त गर्छ, तर presentation का लागि CSS class नै रोज्नुहोस्:\n\n```javascript\nbox.classList.add(\"expanded\");\n```\n\n> <b>JavaScript ले व्यवहार नियन्त्रण गर्छ; CSS ले प्रस्तुति।</b>\n\nमान साँच्चै गतिशील हुँदा मात्र `style` प्रयोग गर्नुहोस्, जस्तै `box.style.width = \\`${width}px\\`;`।\n\n---\n\n### `append()` vs `appendChild()`\n\n`appendChild()` ले एउटा Node लिन्छ र insert भएको node फर्काउँछ। `append()` नयाँ र लचिलो छ — यसले string र धेरै item लिन्छ:\n\n```javascript\nparent.append(element1, element2, \"Hello\");\n```\n\n---\n\n### छोटो तुलना\n\n```text\nquerySelector()     → पहिलो match, Element वा null\nquerySelectorAll()  → सबै match, static NodeList\ngetElementById()    → id ले, Element वा null\ntextContent         → सादा text पढ्ने/लेख्ने\ninnerHTML           → parse भएको HTML पढ्ने/लेख्ने\nclassList add/remove/toggle/contains\nsetAttribute / getAttribute / removeAttribute\ncreateElement()     → memory मा छुट्टै element\nappend() / appendChild()  → document मा राख्ने\nstyle               → inline CSS\n```",
        jp: "<b>DOM（Document Object Model）</b>は、HTML文書をブラウザがJavaScript向けに表現したものです。\n\nブラウザはHTMLを読み込むと、文書をオブジェクトのツリーに変換します。JavaScriptはそれを検索・読み取り・変更・生成・削除できます。\n\n```text\nHTML\n │\n ▼\nDOM Tree\n │\n ├── document\n │    ├── body\n │    │    ├── h1\n │    │    └── button\n │    └── footer\n │\n ▼\nJavaScript\n │\n ├── Find elements\n ├── Read content\n ├── Change content\n ├── Change classes\n ├── Change attributes\n └── Create elements\n```\n\n最も大切なのは、要素を<b>見つける</b>ことと<b>変更する</b>ことの違いを理解することです。\n\n---\n\n### 要素を探す\n\n`querySelector()` はCSSセレクターに一致する<b>最初の要素</b>を返します。\n\n```javascript\nconst heading = document.querySelector(\"h1\");\n```\n\n普通のCSSセレクターが使えます:\n\n```javascript\ndocument.querySelector(\"#app\");\ndocument.querySelector(\".card\");\ndocument.querySelector(\"button\");\ndocument.querySelector(\".card button\");\ndocument.querySelector(\"[data-id='123']\");\n```\n\n一致がなければ `null` です:\n\n```javascript\nconst element = document.querySelector(\".does-not-exist\");\n\nconsole.log(element); // null\n```\n\n`querySelectorAll()` は<b>一致するすべての要素</b>を返します:\n\n```javascript\nconst buttons = document.querySelectorAll(\"button\");\n\nconsole.log(buttons.length); // 3\n```\n\n> `querySelector()` → 最初の一致\n> `querySelectorAll()` → すべての一致\n\n`querySelectorAll()` が返すのは<b>静的なNodeList</b>で、後から要素が追加・削除されても自動更新されません。\n\n`getElementById()` はID専用です:\n\n```javascript\nconst app = document.getElementById(\"app\");\n```\n\n任意のCSSセレクターは渡せません。`document.getElementById(\".card\")` は動かないので、`document.querySelector(\".card\")` を使います。\n\n---\n\n### 1. 基本 — テキストを変える\n\n```html\n<h1 id=\"title\">Hello World</h1>\n```\n\n```javascript\nconst title = document.querySelector(\"#title\");\n\ntitle.textContent = \"Hello JavaScript!\";\n```\n\n<b>なぜ `textContent` か</b>。値をHTMLではなくテキストとして扱うからです:\n\n```javascript\ntitle.textContent = \"<strong>Hello</strong>\";\n```\n\nブラウザは `<strong>Hello</strong>` という文字をそのまま表示し、`<strong>` 要素は作りません。信頼できない入力の表示に安全なのはこちらです。\n\n---\n\n### 2. 中級 — クラスと属性\n\n```javascript\nconst button = document.querySelector(\"#save\");\n\nbutton.classList.add(\"active\");\nbutton.classList.remove(\"active\");\nbutton.classList.toggle(\"active\");\n\nconsole.log(button.classList.contains(\"active\"));\n```\n\n`class` 属性を丸ごと書き換えるより、こちらが安全です。\n\n属性も同様に扱えます:\n\n```javascript\nbutton.setAttribute(\"disabled\", \"\");\n\nconsole.log(button.getAttribute(\"disabled\"));\n\nbutton.removeAttribute(\"disabled\");\n```\n\nデータ属性も同じように、あるいは `dataset` で読めます:\n\n```html\n<button data-user-id=\"42\">Delete</button>\n```\n\n```javascript\nconst button = document.querySelector(\"button\");\n\nconsole.log(button.getAttribute(\"data-user-id\")); // \"42\"\nconsole.log(button.dataset.userId);               // \"42\"\n```\n\n---\n\n### 3. 上級 — 要素を作って挿入する\n\n```html\n<ul id=\"users\"></ul>\n```\n\n```javascript\nconst list = document.querySelector(\"#users\");\n\nconst li = document.createElement(\"li\");\n\nli.textContent = \"Rajan\";\n\nlist.appendChild(li);\n```\n\n作っただけでは画面は変わりません。メモリ上に存在するだけで、挿入するまで文書につながりません。\n\nまとめて作る場合:\n\n```javascript\nconst users = [\"Rajan\", \"John\", \"Sarah\"];\n\nconst list = document.querySelector(\"#users\");\n\nfor (const user of users) {\n  const li = document.createElement(\"li\");\n\n  li.textContent = user;\n\n  list.append(li);\n}\n```\n\n---\n\n### `textContent` と `innerHTML`\n\n```javascript\nelement.textContent = \"<h1>Hello</h1>\"; // 文字としてそのまま表示\nelement.innerHTML = \"<h1>Hello</h1>\";   // HTMLとして解釈\n```\n\n意図してマークアップを入れるなら `innerHTML` が便利ですが、信頼できない入力では危険です:\n\n```javascript\nelement.innerHTML = username; // XSSの恐れ\nelement.textContent = username; // 安全\n```\n\n```text\nUser input\n    │\n    ▼\ntextContent\n    │\n    ▼\nSafe text\n\n\nUser input\n    │\n    ▼\ninnerHTML\n    │\n    ▼\nBrowser parses HTML\n    │\n    ▼\nPotential XSS\n```\n\n---\n\n### `style` と `classList`\n\nスタイルは直接設定できます:\n\n```javascript\nbox.style.width = \"200px\";\nbox.style.backgroundColor = \"blue\";\n```\n\n動きはしますが、見た目はCSSクラスに任せる方が良いです:\n\n```javascript\nbox.classList.add(\"expanded\");\n```\n\n> <b>JavaScriptは振る舞いを、CSSは見た目を担当する。</b>\n\n`box.style.width = \\`${width}px\\`;` のように値が本当に動的なときだけ `style` を使います。\n\n---\n\n### `append()` と `appendChild()`\n\n`appendChild()` はNodeを1つ受け取り、挿入したノードを返します。`append()` は新しく柔軟で、文字列や複数の項目を受け取れます:\n\n```javascript\nparent.append(element1, element2, \"Hello\");\n```\n\n---\n\n### 早見表\n\n```text\nquerySelector()     → 最初の一致、Elementかnull\nquerySelectorAll()  → すべての一致、静的NodeList\ngetElementById()    → idで取得、Elementかnull\ntextContent         → プレーンテキストの読み書き\ninnerHTML           → 解釈されたHTMLの読み書き\nclassList add/remove/toggle/contains\nsetAttribute / getAttribute / removeAttribute\ncreateElement()     → メモリ上の未接続の要素\nappend() / appendChild()  → 文書へ挿入\nstyle               → インラインCSS\n```",
      },
      diagram: `HTML

<div id="app">
    <h1 class="title">Hello</h1>

    <button>Save</button>
    <button>Delete</button>
</div>


            ↓ Browser parses HTML


DOM

document
   │
   └── #app
        │
        ├── .title
        │
        ├── button
        │
        └── button


            ↓ JavaScript


querySelector(".title")
        │
        ▼
     <h1>


querySelectorAll("button")
        │
        ▼
   [button, button]


Creating vs inserting

createElement("li")        list.append(li)
        │                          │
        ▼                          ▼
   in memory only            visible on the page`,
      codeExample: {
        title: { en: "Find it, then change it", np: "पहिले खोज्नुहोस्, अनि बदल्नुहोस्", jp: "見つけてから変える" },
        code: `// ── 1. Basic — find an element and change its text ────────────────
const title = document.querySelector("#title");

title.textContent = "Hello JavaScript!"; // treated as text, never markup

// ── 2. Intermediate — classes, attributes and data attributes ─────
const button = document.querySelector("#save");

button.classList.add("active");
button.classList.toggle("active");
console.log(button.classList.contains("active"));

button.setAttribute("disabled", "");
button.removeAttribute("disabled");

console.log(button.dataset.userId); // from data-user-id="42"

// ── 3. Advanced — build elements and insert them ──────────────────
const users = ["Rajan", "John", "Sarah"];
const list = document.querySelector("#users");

for (const user of users) {
  const li = document.createElement("li"); // exists only in memory
  li.textContent = user;
  list.append(li);                          // now it is on the page
}

// ── Safe vs unsafe when the value comes from a user ───────────────
element.textContent = username; // safe
// element.innerHTML = username; // potential XSS

// ── Guard against a missing element ───────────────────────────────
const maybe = document.querySelector("#missing"); // null when absent
maybe?.classList.add("active");`,
      },
      keyTakeaways: [
        { en: "`querySelector()` returns the <b>first</b> match or `null`; `querySelectorAll()` returns a <b>static NodeList</b> of all matches.", np: "`querySelector()` ले <b>पहिलो</b> match वा `null` फर्काउँछ; `querySelectorAll()` ले सबै match को <b>static NodeList</b> फर्काउँछ।", jp: "`querySelector()` は<b>最初</b>の一致か `null` を、`querySelectorAll()` はすべての一致の<b>静的NodeList</b>を返す。" },
        { en: "`getElementById()` takes an id only, not an arbitrary CSS selector.", np: "`getElementById()` ले id मात्र लिन्छ, जथाभावी CSS selector होइन।", jp: "`getElementById()` はidのみを受け取り、任意のCSSセレクターは受け付けない。" },
        { en: "`textContent` writes plain text; `innerHTML` parses the string as HTML.", np: "`textContent` ले सादा text लेख्छ; `innerHTML` ले string लाई HTML भनी parse गर्छ।", jp: "`textContent` はプレーンテキストを書き、`innerHTML` は文字列をHTMLとして解釈する。" },
        { en: "Use `textContent` for untrusted input — `innerHTML` opens an <b>XSS</b> risk.", np: "अविश्वसनीय input का लागि `textContent` प्रयोग गर्नुहोस् — `innerHTML` ले <b>XSS</b> जोखिम खोल्छ।", jp: "信頼できない入力には `textContent` を使う。`innerHTML` は<b>XSS</b>のリスクを開く。" },
        { en: "`classList` has `add()`, `remove()`, `toggle()` and `contains()` — prefer it over rewriting `class`.", np: "`classList` मा `add()`, `remove()`, `toggle()` र `contains()` छन् — `class` पुनर्लेखन गर्नुभन्दा यही रोज्नुहोस्।", jp: "`classList` には `add()`・`remove()`・`toggle()`・`contains()` がある。`class` の書き換えより優先する。" },
        { en: "`createElement()` only builds a <b>detached</b> element; nothing appears until you `append()` it.", np: "`createElement()` ले <b>छुट्टै</b> element मात्र बनाउँछ; `append()` नगरेसम्म केही देखिँदैन।", jp: "`createElement()` は<b>未接続</b>の要素を作るだけ。`append()` するまで何も現れない。" },
        { en: "Prefer `classList` over inline `style` — JavaScript controls behaviour, CSS controls presentation.", np: "Inline `style` भन्दा `classList` रोज्नुहोस् — JavaScript ले व्यवहार, CSS ले प्रस्तुति नियन्त्रण गर्छ।", jp: "インラインの `style` より `classList` を優先する。JavaScriptは振る舞い、CSSは見た目。" },
      ],
      commonMistakes: [
        { en: "<b>Assuming `querySelector()` returns every match</b> — `document.querySelector(\"button\")` gives only the first button. Use `querySelectorAll()` for all of them.", np: "<b>`querySelector()` ले सबै match फर्काउँछ भन्ने ठान्नु</b> — `document.querySelector(\"button\")` ले पहिलो button मात्र दिन्छ। सबैका लागि `querySelectorAll()` प्रयोग गर्नुहोस्।", jp: "<b>`querySelector()` が全件を返すと思う</b> — `document.querySelector(\"button\")` は最初の1つだけ。全部なら `querySelectorAll()`。" },
        { en: "<b>Forgetting a query can return `null`</b> — `document.querySelector(\"#missing\").textContent = \"Hi\"` throws. Guard with `if (el)` or `el?.textContent`.", np: "<b>Query ले `null` फर्काउन सक्छ भनी बिर्सनु</b> — `document.querySelector(\"#missing\").textContent = \"Hi\"` ले error दिन्छ। `if (el)` वा `el?.textContent` ले जोगिनुहोस्।", jp: "<b>クエリが `null` を返しうることを忘れる</b> — `document.querySelector(\"#missing\").textContent = \"Hi\"` は例外になる。`if (el)` か `el?.textContent` で守る。" },
        { en: "<b>Using `innerHTML` for user input</b> — `element.innerHTML = username` is an XSS risk. Use `element.textContent = username` when you only need text.", np: "<b>User input का लागि `innerHTML` प्रयोग गर्नु</b> — `element.innerHTML = username` XSS जोखिम हो। text मात्र चाहिँदा `element.textContent = username` प्रयोग गर्नुहोस्।", jp: "<b>ユーザー入力に `innerHTML` を使う</b> — `element.innerHTML = username` はXSSのリスク。テキストだけなら `element.textContent = username`。" },
        { en: "<b>Creating an element but never inserting it</b> — `document.createElement(\"li\")` alone changes nothing. You still need `list.append(li)`.", np: "<b>Element बनाएर insert नगर्नु</b> — `document.createElement(\"li\")` ले मात्र केही बदल्दैन। `list.append(li)` अझै चाहिन्छ।", jp: "<b>要素を作って挿入し忘れる</b> — `document.createElement(\"li\")` だけでは何も変わらない。`list.append(li)` が必要。" },
        { en: "<b>Setting every style from JavaScript</b> — long chains of `element.style.*` are hard to maintain. Add a class such as `element.classList.add(\"error\")` and keep the rules in CSS.", np: "<b>हरेक style JavaScript बाट सेट गर्नु</b> — `element.style.*` को लामो शृंखला मर्मत गर्न गाह्रो हुन्छ। `element.classList.add(\"error\")` जस्तो class थप्नुहोस् र नियम CSS मै राख्नुहोस्।", jp: "<b>すべてのスタイルをJavaScriptで設定する</b> — `element.style.*` の羅列は保守が難しい。`element.classList.add(\"error\")` のようにクラスを足し、ルールはCSSに置く。" },
      ],
      quiz: [
        {
          question: { en: "What does `document.querySelector(\".card\")` return?", np: "`document.querySelector(\".card\")` ले के फर्काउँछ?", jp: "`document.querySelector(\".card\")` は何を返すか?" },
          options: [
            { en: "The first `.card`", np: "पहिलो `.card`", jp: "最初の `.card`" },
            { en: "Every `.card`", np: "हरेक `.card`", jp: "すべての `.card`" },
            { en: "An array", np: "एउटा array", jp: "配列" },
            { en: "Always `null`", np: "सधैं `null`", jp: "常に `null`" },
          ],
          correctIndex: 0,
          explanation: { en: "It returns `null` when nothing matches.", np: "केही नमिले यसले `null` फर्काउँछ।", jp: "一致がなければ `null` を返す。" },
        },
        {
          question: { en: "Which is safer for displaying untrusted user input?", np: "अविश्वसनीय user input देखाउन कुन सुरक्षित छ?", jp: "信頼できないユーザー入力の表示に安全なのは?" },
          options: [
            { en: "`innerHTML`", np: "`innerHTML`", jp: "`innerHTML`" },
            { en: "`textContent`", np: "`textContent`", jp: "`textContent`" },
            { en: "`style`", np: "`style`", jp: "`style`" },
            { en: "`classList`", np: "`classList`", jp: "`classList`" },
          ],
          correctIndex: 1,
          explanation: { en: "It writes characters, so markup in the input is never parsed.", np: "यसले अक्षर लेख्छ, त्यसैले input को markup कहिल्यै parse हुँदैन।", jp: "文字として書くので、入力内のマークアップは解釈されない。" },
        },
        {
          question: { en: "What does `element.classList.toggle(\"active\")` do?", np: "`element.classList.toggle(\"active\")` ले के गर्छ?", jp: "`element.classList.toggle(\"active\")` は何をするか?" },
          options: [
            { en: "Always adds `active`", np: "सधैं `active` थप्छ", jp: "常に `active` を追加する" },
            { en: "Always removes `active`", np: "सधैं `active` हटाउँछ", jp: "常に `active` を削除する" },
            { en: "Adds it if absent, removes it if present", np: "नभए थप्छ, भए हटाउँछ", jp: "無ければ追加し、有れば削除する" },
            { en: "Deletes the element", np: "Element नै मेटाउँछ", jp: "要素を削除する" },
          ],
          correctIndex: 2,
          explanation: { en: "Use `contains()` when you only want to check.", np: "जाँच मात्र गर्नु छ भने `contains()` प्रयोग गर्नुहोस्।", jp: "確認だけなら `contains()` を使う。" },
        },
        {
          question: { en: "What does `document.createElement(\"li\")` do on its own?", np: "`document.createElement(\"li\")` ले आफैंले के गर्छ?", jp: "`document.createElement(\"li\")` だけでは何が起きるか?" },
          options: [
            { en: "Immediately displays an element", np: "तुरुन्तै element देखाउँछ", jp: "すぐに要素を表示する" },
            { en: "Finds an existing element", np: "पहिले नै भएको element खोज्छ", jp: "既存の要素を探す" },
            { en: "Deletes an element", np: "Element मेटाउँछ", jp: "要素を削除する" },
            { en: "Creates a detached element in memory", np: "Memory मा छुट्टै element बनाउँछ", jp: "メモリ上に未接続の要素を作る" },
          ],
          correctIndex: 3,
          explanation: { en: "It becomes visible only after `append()` or `appendChild()`.", np: "`append()` वा `appendChild()` पछि मात्र देखिन्छ।", jp: "`append()` か `appendChild()` の後で初めて見える。" },
        },
        {
          question: { en: "What does `document.querySelectorAll(\"button\")` return?", np: "`document.querySelectorAll(\"button\")` ले के फर्काउँछ?", jp: "`document.querySelectorAll(\"button\")` は何を返すか?" },
          options: [
            { en: "A static NodeList", np: "एउटा static NodeList", jp: "静的なNodeList" },
            { en: "An array", np: "एउटा array", jp: "配列" },
            { en: "The first button", np: "पहिलो button", jp: "最初のボタン" },
            { en: "An HTML string", np: "एउटा HTML string", jp: "HTML文字列" },
          ],
          correctIndex: 0,
          explanation: { en: "Static means it does not update when the DOM changes later.", np: "Static को अर्थ पछि DOM बदलिँदा यो अद्यावधिक हुँदैन।", jp: "静的とは、後でDOMが変わっても更新されないという意味。" },
        },
      ],
    },
    {
      id: "events-addeventlistener",
      title: { en: "Events & addEventListener", np: "Events र addEventListener", jp: "イベントとaddEventListener" },
      durationMinutes: 9,
      explanation: {
        en: "An <b>event</b> is something that happens in the browser — a user clicks a button, types into an input, submits a form, moves the mouse, or the page finishes loading.\n\nJavaScript responds to these using <b>`addEventListener()`</b>:\n\n```javascript\nelement.addEventListener(\"click\", handler);\n```\n\nThat means: \"when this element receives a `click` event, run this function.\"\n\nUnlike `onclick`, multiple listeners can be attached to the same event without replacing each other:\n\n```javascript\nconst button = document.querySelector(\"#save\");\n\nbutton.addEventListener(\"click\", () => {\n  console.log(\"Saving...\");\n});\n\nbutton.addEventListener(\"click\", () => {\n  console.log(\"Analytics recorded\");\n});\n```\n\nBoth functions run when the button is clicked.\n\n```text\nUser clicks button\n       │\n       ▼\n   click event\n       │\n       ▼\nbutton.addEventListener()\n       │\n       ▼\n  handler function\n       │\n       ▼\n   JavaScript runs\n```\n\n---\n\n### 1. Basic — respond to a click\n\n```html\n<button id=\"hello\">Say Hello</button>\n```\n\n```javascript\nconst button = document.querySelector(\"#hello\");\n\nbutton.addEventListener(\"click\", () => {\n  console.log(\"Hello!\");\n});\n```\n\nEvery time the button is clicked, the handler runs.\n\n---\n\n### 2. Intermediate — the event object\n\nEvery handler receives an <b>event object</b> describing what happened.\n\n```javascript\nconst input = document.querySelector(\"#name\");\n\ninput.addEventListener(\"input\", (event) => {\n  console.log(event.target.value);\n});\n```\n\nIf the user types `Rajan`, then `event.target.value` is `\"Rajan\"`.\n\n<b>`target` vs `currentTarget`</b> is an important distinction:\n\n```javascript\ncontainer.addEventListener(\"click\", (event) => {\n  console.log(event.target);\n  console.log(event.currentTarget);\n});\n```\n\n```text\n<div id=\"container\">\n    <button>Click me</button>\n</div>\n\n             Click\n               │\n               ▼\n        ┌─────────────┐\n        │   button    │ ← event.target\n        └─────────────┘\n               │\n               │ bubbles\n               ▼\n        ┌─────────────┐\n        │  container  │ ← event.currentTarget\n        └─────────────┘\n```\n\n• <b>`event.target`</b> — the actual element where the event originated.\n• <b>`event.currentTarget`</b> — the element whose listener is currently running.\n\n---\n\n### 3. Advanced — removing a listener\n\nTo remove a listener you must pass the <b>same function reference</b> that was registered.\n\n```javascript\nconst button = document.querySelector(\"#save\");\n\nfunction handleSave() {\n  console.log(\"Saved!\");\n}\n\nbutton.addEventListener(\"click\", handleSave);\n\nbutton.removeEventListener(\"click\", handleSave);\n```\n\nThis does <b>not</b> work:\n\n```javascript\nbutton.addEventListener(\"click\", () => {\n  console.log(\"Saved!\");\n});\n\nbutton.removeEventListener(\"click\", () => {\n  console.log(\"Saved!\");\n});\n```\n\nEven though the functions look identical, they are different function objects:\n\n```text\nFunction A                 Function B\n    │                          │\n    ▼                          ▼\ndifferent reference     different reference\n\n        not the same\n```\n\nIf you need to remove a listener later, keep the reference in a variable.\n\n---\n\n### `preventDefault()` vs `stopPropagation()`\n\nThese are commonly confused, but they solve completely different problems.\n\n<b>`preventDefault()`</b> stops the browser's default action:\n\n```javascript\nconst form = document.querySelector(\"#signup\");\n\nform.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n\n  console.log(\"Handle submission with JavaScript\");\n});\n```\n\n```text\nsubmit event\n     │\n     ├── Browser default action\n     │       └── page reload  stopped\n     │\n     └── JavaScript handler\n             └── continues\n```\n\n<b>`stopPropagation()`</b> stops the event from travelling further along the propagation path:\n\n```javascript\nconst parent = document.querySelector(\"#parent\");\nconst button = document.querySelector(\"#child\");\n\nparent.addEventListener(\"click\", () => {\n  console.log(\"Parent clicked\");\n});\n\nbutton.addEventListener(\"click\", (event) => {\n  event.stopPropagation();\n\n  console.log(\"Button clicked\");\n});\n```\n\nClicking the button logs only `Button clicked`.\n\n---\n\n### Event propagation\n\nEvents do not simply happen on one element. They travel through a path:\n\n```text\n             document\n                ▲\n                │ bubbling\n             parent\n                ▲\n                │\n             button\n                │\n                ▼\n             target\n```\n\nThe browser processes events through:\n\n```text\nCapture phase\n     ↓\nTarget phase\n     ↓\nBubble phase\n```\n\nYou can listen during the capture phase:\n\n```javascript\nparent.addEventListener(\"click\", handler, { capture: true });\n```\n\nWithout `capture: true`, listeners run during the bubbling phase.\n\n---\n\n### Common events\n\n```text\nclick       mouse click\ndblclick    double click\ninput       input value changes\nchange      value committed\nsubmit      form submitted\nkeydown     keyboard key pressed\nkeyup       keyboard key released\nfocus       element receives focus\nblur        element loses focus\nmouseenter  pointer enters element\nmouseleave  pointer leaves element\n```\n\n```javascript\ndocument.querySelector(\"#search\")\n  .addEventListener(\"keydown\", (event) => {\n    if (event.key === \"Enter\") {\n      console.log(\"Search!\");\n    }\n  });\n```\n\n---\n\n### Listener options\n\n```javascript\nbutton.addEventListener(\"click\", handleClick, { once: true });\n```\n\n`once: true` removes the listener automatically after it runs once.\n\n```javascript\nbutton.addEventListener(\"click\", handleClick, { passive: true });\n```\n\nA passive listener tells the browser the handler will not call `preventDefault()`.\n\n---\n\n### The rule to remember\n\n> <b>`preventDefault()` controls the browser's default behaviour. `stopPropagation()` controls the event's journey through the DOM.</b>",
        np: "<b>Event</b> भनेको browser मा हुने कुनै घटना हो — user ले button click गर्नु, input मा type गर्नु, form submit गर्नु, mouse चलाउनु, वा page load सकिनु।\n\nJavaScript ले यिनलाई <b>`addEventListener()`</b> मार्फत जवाफ दिन्छ:\n\n```javascript\nelement.addEventListener(\"click\", handler);\n```\n\nअर्थात्: \"यो element ले `click` event पायो भने, यो function चलाऊ।\"\n\n`onclick` भन्दा फरक, एउटै event मा धेरै listener जोड्न सकिन्छ र तिनले एकअर्कालाई प्रतिस्थापन गर्दैनन्:\n\n```javascript\nconst button = document.querySelector(\"#save\");\n\nbutton.addEventListener(\"click\", () => {\n  console.log(\"Saving...\");\n});\n\nbutton.addEventListener(\"click\", () => {\n  console.log(\"Analytics recorded\");\n});\n```\n\nButton click हुँदा दुबै function चल्छन्।\n\n```text\nUser clicks button\n       │\n       ▼\n   click event\n       │\n       ▼\nbutton.addEventListener()\n       │\n       ▼\n  handler function\n       │\n       ▼\n   JavaScript runs\n```\n\n---\n\n### 1. आधारभूत — click मा जवाफ\n\n```html\n<button id=\"hello\">Say Hello</button>\n```\n\n```javascript\nconst button = document.querySelector(\"#hello\");\n\nbutton.addEventListener(\"click\", () => {\n  console.log(\"Hello!\");\n});\n```\n\nButton जति पटक click हुन्छ, handler त्यति पटक चल्छ।\n\n---\n\n### 2. मध्यम — event object\n\nहरेक handler ले के भयो भन्ने बताउने <b>event object</b> पाउँछ।\n\n```javascript\nconst input = document.querySelector(\"#name\");\n\ninput.addEventListener(\"input\", (event) => {\n  console.log(event.target.value);\n});\n```\n\nUser ले `Rajan` type गरे, `event.target.value` `\"Rajan\"` हुन्छ।\n\n<b>`target` vs `currentTarget`</b> महत्वपूर्ण भिन्नता हो:\n\n```javascript\ncontainer.addEventListener(\"click\", (event) => {\n  console.log(event.target);\n  console.log(event.currentTarget);\n});\n```\n\n```text\n<div id=\"container\">\n    <button>Click me</button>\n</div>\n\n             Click\n               │\n               ▼\n        ┌─────────────┐\n        │   button    │ ← event.target\n        └─────────────┘\n               │\n               │ bubbles\n               ▼\n        ┌─────────────┐\n        │  container  │ ← event.currentTarget\n        └─────────────┘\n```\n\n• <b>`event.target`</b> — event वास्तवमा सुरु भएको element।\n• <b>`event.currentTarget`</b> — जसको listener अहिले चलिरहेको छ त्यो element।\n\n---\n\n### 3. उन्नत — listener हटाउनु\n\nListener हटाउन दर्ता गरिएकै <b>function reference</b> दिनुपर्छ।\n\n```javascript\nconst button = document.querySelector(\"#save\");\n\nfunction handleSave() {\n  console.log(\"Saved!\");\n}\n\nbutton.addEventListener(\"click\", handleSave);\n\nbutton.removeEventListener(\"click\", handleSave);\n```\n\nयो <b>काम गर्दैन</b>:\n\n```javascript\nbutton.addEventListener(\"click\", () => {\n  console.log(\"Saved!\");\n});\n\nbutton.removeEventListener(\"click\", () => {\n  console.log(\"Saved!\");\n});\n```\n\nFunction उस्तै देखिए पनि, ती फरक object हुन्:\n\n```text\nFunction A                 Function B\n    │                          │\n    ▼                          ▼\ndifferent reference     different reference\n\n        not the same\n```\n\nपछि हटाउनुपर्ने भए reference variable मा राख्नुहोस्।\n\n---\n\n### `preventDefault()` vs `stopPropagation()`\n\nयी बारम्बार अल्मलिन्छन्, तर पूर्णतः फरक समस्या हल गर्छन्।\n\n<b>`preventDefault()`</b> ले browser को default कार्य रोक्छ:\n\n```javascript\nconst form = document.querySelector(\"#signup\");\n\nform.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n\n  console.log(\"Handle submission with JavaScript\");\n});\n```\n\n```text\nsubmit event\n     │\n     ├── Browser default action\n     │       └── page reload  stopped\n     │\n     └── JavaScript handler\n             └── continues\n```\n\n<b>`stopPropagation()`</b> ले event लाई propagation path मा अगाडि जान रोक्छ:\n\n```javascript\nconst parent = document.querySelector(\"#parent\");\nconst button = document.querySelector(\"#child\");\n\nparent.addEventListener(\"click\", () => {\n  console.log(\"Parent clicked\");\n});\n\nbutton.addEventListener(\"click\", (event) => {\n  event.stopPropagation();\n\n  console.log(\"Button clicked\");\n});\n```\n\nButton click गर्दा `Button clicked` मात्र देखिन्छ।\n\n---\n\n### Event propagation\n\nEvent एउटै element मा मात्र हुँदैन। तिनी बाटो हुँदै यात्रा गर्छन्:\n\n```text\n             document\n                ▲\n                │ bubbling\n             parent\n                ▲\n                │\n             button\n                │\n                ▼\n             target\n```\n\nBrowser ले event यसरी process गर्छ:\n\n```text\nCapture phase\n     ↓\nTarget phase\n     ↓\nBubble phase\n```\n\nCapture phase मा सुन्न सकिन्छ:\n\n```javascript\nparent.addEventListener(\"click\", handler, { capture: true });\n```\n\n`capture: true` नभए listener bubbling phase मा चल्छन्।\n\n---\n\n### सामान्य event\n\n```text\nclick       mouse click\ndblclick    double click\ninput       input value बदलिनु\nchange      value टुंगिनु\nsubmit      form submit हुनु\nkeydown     key थिचिनु\nkeyup       key छाडिनु\nfocus       element ले focus पाउनु\nblur        element ले focus गुमाउनु\nmouseenter  pointer भित्र पस्नु\nmouseleave  pointer बाहिर जानु\n```\n\n```javascript\ndocument.querySelector(\"#search\")\n  .addEventListener(\"keydown\", (event) => {\n    if (event.key === \"Enter\") {\n      console.log(\"Search!\");\n    }\n  });\n```\n\n---\n\n### Listener option\n\n```javascript\nbutton.addEventListener(\"click\", handleClick, { once: true });\n```\n\n`once: true` ले एक पटक चलेपछि listener आफैं हट्छ।\n\n```javascript\nbutton.addEventListener(\"click\", handleClick, { passive: true });\n```\n\nPassive listener ले handler ले `preventDefault()` बोलाउँदैन भनी browser लाई बताउँछ।\n\n---\n\n### सम्झनुपर्ने नियम\n\n> <b>`preventDefault()` ले browser को default व्यवहार नियन्त्रण गर्छ। `stopPropagation()` ले DOM मा event को यात्रा नियन्त्रण गर्छ।</b>",
        jp: "<b>イベント</b>とは、ブラウザで起きる出来事です。ボタンのクリック、入力、フォーム送信、マウス移動、ページの読み込み完了などがそれにあたります。\n\nJavaScriptは<b>`addEventListener()`</b>でこれに応答します:\n\n```javascript\nelement.addEventListener(\"click\", handler);\n```\n\n意味は「この要素が `click` イベントを受け取ったら、この関数を実行する」です。\n\n`onclick` と違い、同じイベントに複数のリスナーを付けても互いを上書きしません:\n\n```javascript\nconst button = document.querySelector(\"#save\");\n\nbutton.addEventListener(\"click\", () => {\n  console.log(\"Saving...\");\n});\n\nbutton.addEventListener(\"click\", () => {\n  console.log(\"Analytics recorded\");\n});\n```\n\nクリックすると両方が実行されます。\n\n```text\nUser clicks button\n       │\n       ▼\n   click event\n       │\n       ▼\nbutton.addEventListener()\n       │\n       ▼\n  handler function\n       │\n       ▼\n   JavaScript runs\n```\n\n---\n\n### 1. 基本 — クリックに応答する\n\n```html\n<button id=\"hello\">Say Hello</button>\n```\n\n```javascript\nconst button = document.querySelector(\"#hello\");\n\nbutton.addEventListener(\"click\", () => {\n  console.log(\"Hello!\");\n});\n```\n\nクリックのたびにハンドラーが走ります。\n\n---\n\n### 2. 中級 — イベントオブジェクト\n\nすべてのハンドラーは、何が起きたかを表す<b>イベントオブジェクト</b>を受け取ります。\n\n```javascript\nconst input = document.querySelector(\"#name\");\n\ninput.addEventListener(\"input\", (event) => {\n  console.log(event.target.value);\n});\n```\n\n`Rajan` と入力すれば `event.target.value` は `\"Rajan\"` です。\n\n<b>`target` と `currentTarget`</b> の違いは重要です:\n\n```javascript\ncontainer.addEventListener(\"click\", (event) => {\n  console.log(event.target);\n  console.log(event.currentTarget);\n});\n```\n\n```text\n<div id=\"container\">\n    <button>Click me</button>\n</div>\n\n             Click\n               │\n               ▼\n        ┌─────────────┐\n        │   button    │ ← event.target\n        └─────────────┘\n               │\n               │ bubbles\n               ▼\n        ┌─────────────┐\n        │  container  │ ← event.currentTarget\n        └─────────────┘\n```\n\n• <b>`event.target`</b> — イベントが実際に発生した要素。\n• <b>`event.currentTarget`</b> — 今リスナーが動いている要素。\n\n---\n\n### 3. 上級 — リスナーを外す\n\n外すには、登録したときと<b>同じ関数参照</b>を渡す必要があります。\n\n```javascript\nconst button = document.querySelector(\"#save\");\n\nfunction handleSave() {\n  console.log(\"Saved!\");\n}\n\nbutton.addEventListener(\"click\", handleSave);\n\nbutton.removeEventListener(\"click\", handleSave);\n```\n\nこれは<b>動きません</b>:\n\n```javascript\nbutton.addEventListener(\"click\", () => {\n  console.log(\"Saved!\");\n});\n\nbutton.removeEventListener(\"click\", () => {\n  console.log(\"Saved!\");\n});\n```\n\n見た目が同じでも、別の関数オブジェクトだからです:\n\n```text\nFunction A                 Function B\n    │                          │\n    ▼                          ▼\ndifferent reference     different reference\n\n        not the same\n```\n\n後で外すなら、参照を変数に保持しておきます。\n\n---\n\n### `preventDefault()` と `stopPropagation()`\n\n混同されがちですが、まったく別の問題を解きます。\n\n<b>`preventDefault()`</b> はブラウザの既定動作を止めます:\n\n```javascript\nconst form = document.querySelector(\"#signup\");\n\nform.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n\n  console.log(\"Handle submission with JavaScript\");\n});\n```\n\n```text\nsubmit event\n     │\n     ├── Browser default action\n     │       └── page reload  stopped\n     │\n     └── JavaScript handler\n             └── continues\n```\n\n<b>`stopPropagation()`</b> はイベントが伝播経路を先へ進むのを止めます:\n\n```javascript\nconst parent = document.querySelector(\"#parent\");\nconst button = document.querySelector(\"#child\");\n\nparent.addEventListener(\"click\", () => {\n  console.log(\"Parent clicked\");\n});\n\nbutton.addEventListener(\"click\", (event) => {\n  event.stopPropagation();\n\n  console.log(\"Button clicked\");\n});\n```\n\nボタンをクリックすると `Button clicked` だけが出ます。\n\n---\n\n### イベントの伝播\n\nイベントは1つの要素で完結せず、経路をたどります:\n\n```text\n             document\n                ▲\n                │ bubbling\n             parent\n                ▲\n                │\n             button\n                │\n                ▼\n             target\n```\n\nブラウザはこの順に処理します:\n\n```text\nCapture phase\n     ↓\nTarget phase\n     ↓\nBubble phase\n```\n\nキャプチャ段階で待ち受けることもできます:\n\n```javascript\nparent.addEventListener(\"click\", handler, { capture: true });\n```\n\n`capture: true` がなければ、リスナーはバブリング段階で走ります。\n\n---\n\n### よく使うイベント\n\n```text\nclick       クリック\ndblclick    ダブルクリック\ninput       入力値の変化\nchange      値の確定\nsubmit      フォーム送信\nkeydown     キーを押した\nkeyup       キーを離した\nfocus       フォーカスを得た\nblur        フォーカスを失った\nmouseenter  ポインタが入った\nmouseleave  ポインタが出た\n```\n\n```javascript\ndocument.querySelector(\"#search\")\n  .addEventListener(\"keydown\", (event) => {\n    if (event.key === \"Enter\") {\n      console.log(\"Search!\");\n    }\n  });\n```\n\n---\n\n### リスナーのオプション\n\n```javascript\nbutton.addEventListener(\"click\", handleClick, { once: true });\n```\n\n`once: true` は一度実行された後に自動で外れます。\n\n```javascript\nbutton.addEventListener(\"click\", handleClick, { passive: true });\n```\n\npassiveなリスナーは、`preventDefault()` を呼ばないとブラウザに伝えます。\n\n---\n\n### 覚えるべき規則\n\n> <b>`preventDefault()` はブラウザの既定動作を、`stopPropagation()` はDOM内でのイベントの旅路を制御する。</b>",
      },
      diagram: `User clicks button
       │
       ▼
   click event
       │
       ▼
button.addEventListener()
       │
       ▼
  handler function
       │
       ▼
   JavaScript runs


target vs currentTarget

<div id="container">
    <button>Click me</button>
</div>

             Click
               │
               ▼
        ┌─────────────┐
        │   button    │ ← event.target
        └─────────────┘
               │
               │ bubbles
               ▼
        ┌─────────────┐
        │  container  │ ← event.currentTarget
        └─────────────┘


Two methods, two different jobs

preventDefault()          stopPropagation()
       │                          │
       ▼                          ▼
stops the browser's        stops the event from
default action             travelling further`,
      codeExample: {
        title: { en: "Listening, reading and unlistening", np: "सुन्ने, पढ्ने र सुन्न छाड्ने", jp: "登録し、読み取り、解除する" },
        code: `// ── 1. Basic — respond to a click ─────────────────────────────────
const button = document.querySelector("#hello");

button.addEventListener("click", () => {
  console.log("Hello!");
});

// Two listeners on the same event both run
button.addEventListener("click", () => console.log("Analytics recorded"));

// ── 2. Intermediate — the event object ────────────────────────────
const input = document.querySelector("#name");

input.addEventListener("input", (event) => {
  console.log(event.target.value); // what the user typed
});

container.addEventListener("click", (event) => {
  console.log(event.target);        // where the click started
  console.log(event.currentTarget); // where this listener lives
});

// ── 3. Advanced — removing needs the same reference ───────────────
function handleSave() {
  console.log("Saved!");
}

button.addEventListener("click", handleSave);
button.removeEventListener("click", handleSave); // works

// An identical-looking arrow function is a different object
// button.removeEventListener("click", () => console.log("Saved!")); // no-op

// ── preventDefault vs stopPropagation ─────────────────────────────
form.addEventListener("submit", (event) => {
  event.preventDefault(); // no page reload
});

child.addEventListener("click", (event) => {
  event.stopPropagation(); // the parent listener never fires
});

// ── Options ───────────────────────────────────────────────────────
button.addEventListener("click", handleSave, { once: true });`,
      },
      keyTakeaways: [
        { en: "`addEventListener()` registers a function to run when an event happens.", np: "`addEventListener()` ले event हुँदा चल्ने function दर्ता गर्छ।", jp: "`addEventListener()` はイベント発生時に走る関数を登録する。" },
        { en: "Multiple listeners can coexist on the same event; they do not replace each other.", np: "एउटै event मा धेरै listener सँगै रहन सक्छन्; तिनले एकअर्कालाई प्रतिस्थापन गर्दैनन्।", jp: "同じイベントに複数のリスナーが共存でき、互いを置き換えない。" },
        { en: "Every handler receives an <b>event object</b> describing what happened.", np: "हरेक handler ले के भयो भन्ने बताउने <b>event object</b> पाउँछ।", jp: "すべてのハンドラーは、何が起きたかを表す<b>イベントオブジェクト</b>を受け取る。" },
        { en: "<b>`event.target`</b> is where the event originated; <b>`event.currentTarget`</b> is where the listener is attached.", np: "<b>`event.target`</b> event सुरु भएको ठाउँ हो; <b>`event.currentTarget`</b> listener जोडिएको ठाउँ।", jp: "<b>`event.target`</b> は発生元、<b>`event.currentTarget`</b> はリスナーが付いている要素。" },
        { en: "`preventDefault()` stops the browser's default action, such as a form reload.", np: "`preventDefault()` ले browser को default कार्य रोक्छ, जस्तै form reload।", jp: "`preventDefault()` はフォームの再読み込みなど、ブラウザの既定動作を止める。" },
        { en: "`stopPropagation()` stops the event travelling further through the DOM.", np: "`stopPropagation()` ले event लाई DOM मा अझ अगाडि जान रोक्छ।", jp: "`stopPropagation()` はイベントがDOMをさらに進むのを止める。" },
        { en: "`removeEventListener()` needs the <b>same function reference</b> that was registered.", np: "`removeEventListener()` लाई दर्ता गरिएकै <b>function reference</b> चाहिन्छ।", jp: "`removeEventListener()` には登録時と<b>同じ関数参照</b>が必要。" },
      ],
      commonMistakes: [
        { en: "<b>Calling the function instead of passing it</b> — `button.addEventListener(\"click\", handleClick())` runs it immediately. Pass `handleClick` without the parentheses.", np: "<b>Function पास गर्नुको सट्टा बोलाउनु</b> — `button.addEventListener(\"click\", handleClick())` ले तुरुन्तै चलाउँछ। कोष्ठकबिना `handleClick` पास गर्नुहोस्।", jp: "<b>関数を渡さず呼んでしまう</b> — `button.addEventListener(\"click\", handleClick())` は即座に実行してしまう。括弧なしで `handleClick` を渡す。" },
        { en: "<b>Using a new function when removing</b> — an identical-looking arrow function is a different object, so `removeEventListener()` does nothing. Keep the reference in a variable.", np: "<b>हटाउँदा नयाँ function प्रयोग गर्नु</b> — उस्तै देखिने arrow function फरक object हो, त्यसैले `removeEventListener()` ले केही गर्दैन। Reference variable मा राख्नुहोस्।", jp: "<b>解除時に新しい関数を渡す</b> — 見た目が同じでも別オブジェクトなので `removeEventListener()` は何もしない。参照を変数に保持する。" },
        { en: "<b>Confusing `target` and `currentTarget`</b> — they differ whenever the event originates from a child element.", np: "<b>`target` र `currentTarget` अल्मल्याउनु</b> — event child element बाट सुरु हुँदा यी फरक हुन्छन्।", jp: "<b>`target` と `currentTarget` を混同する</b> — 子要素から発生したときは両者が異なる。" },
        { en: "<b>Using `stopPropagation()` to prevent default browser behaviour</b> — it does not stop a link navigating or a form submitting. Use `preventDefault()` for that.", np: "<b>Browser को default व्यवहार रोक्न `stopPropagation()` प्रयोग गर्नु</b> — यसले link navigate वा form submit रोक्दैन। त्यसका लागि `preventDefault()` प्रयोग गर्नुहोस्।", jp: "<b>既定動作を止めるつもりで `stopPropagation()` を使う</b> — リンク遷移やフォーム送信は止まらない。それには `preventDefault()`。" },
      ],
      quiz: [
        {
          question: { en: "What does `addEventListener()` primarily do?", np: "`addEventListener()` ले मुख्यतः के गर्छ?", jp: "`addEventListener()` は主に何をするか?" },
          options: [
            { en: "Creates a new DOM element", np: "नयाँ DOM element बनाउँछ", jp: "新しいDOM要素を作る" },
            { en: "Registers a function to respond to an event", np: "Event मा जवाफ दिने function दर्ता गर्छ", jp: "イベントに応答する関数を登録する" },
            { en: "Stops an event", np: "Event रोक्छ", jp: "イベントを止める" },
            { en: "Removes an event", np: "Event हटाउँछ", jp: "イベントを削除する" },
          ],
          correctIndex: 1,
          explanation: { en: "Several listeners can be registered for the same event.", np: "एउटै event का लागि धेरै listener दर्ता गर्न सकिन्छ।", jp: "同じイベントに複数のリスナーを登録できる。" },
        },
        {
          question: { en: "What does `event.target` represent?", np: "`event.target` ले के जनाउँछ?", jp: "`event.target` は何を表すか?" },
          options: [
            { en: "The element where the listener was registered", np: "Listener दर्ता भएको element", jp: "リスナーが登録された要素" },
            { en: "The parent element", np: "Parent element", jp: "親要素" },
            { en: "The element where the event originated", np: "Event सुरु भएको element", jp: "イベントが発生した要素" },
            { en: "The document", np: "Document", jp: "document" },
          ],
          correctIndex: 2,
          explanation: { en: "`event.currentTarget` is the element the listener is attached to.", np: "`event.currentTarget` listener जोडिएको element हो।", jp: "`event.currentTarget` はリスナーが付いている要素。" },
        },
        {
          question: { en: "What does `preventDefault()` do?", np: "`preventDefault()` ले के गर्छ?", jp: "`preventDefault()` は何をするか?" },
          options: [
            { en: "Stops event bubbling", np: "Event bubbling रोक्छ", jp: "イベントのバブリングを止める" },
            { en: "Removes the event listener", np: "Event listener हटाउँछ", jp: "リスナーを削除する" },
            { en: "Deletes the DOM element", np: "DOM element मेटाउँछ", jp: "DOM要素を削除する" },
            { en: "Stops the browser's default action", np: "Browser को default कार्य रोक्छ", jp: "ブラウザの既定動作を止める" },
          ],
          correctIndex: 3,
          explanation: { en: "Bubbling is stopped by `stopPropagation()` instead.", np: "Bubbling चाहिँ `stopPropagation()` ले रोक्छ।", jp: "バブリングを止めるのは `stopPropagation()`。" },
        },
        {
          question: { en: "What is required to remove an event listener?", np: "Event listener हटाउन के चाहिन्छ?", jp: "イベントリスナーを外すのに必要なものは?" },
          options: [
            { en: "The same function reference", np: "उही function reference", jp: "同じ関数参照" },
            { en: "A new function with the same code", np: "उही code भएको नयाँ function", jp: "同じコードの新しい関数" },
            { en: "The event object", np: "Event object", jp: "イベントオブジェクト" },
            { en: "The element's id", np: "Element को id", jp: "要素のid" },
          ],
          correctIndex: 0,
          explanation: { en: "Two identical-looking functions are still different objects.", np: "उस्तै देखिने दुई function पनि फरक object हुन्।", jp: "見た目が同じ関数でも別のオブジェクト。" },
        },
        {
          question: { en: "Two `click` listeners log `\"A\"` and `\"B\"` on the same button. What happens on one click?", np: "एउटै button मा दुई `click` listener ले `\"A\"` र `\"B\"` log गर्छन्। एक click मा के हुन्छ?", jp: "同じボタンに `\"A\"` と `\"B\"` を出力する2つの `click` リスナーがある。1回のクリックで何が起きるか?" },
          options: [
            { en: "Only `A`", np: "`A` मात्र", jp: "`A` だけ" },
            { en: "`A` then `B`", np: "`A` अनि `B`", jp: "`A` の次に `B`" },
            { en: "Only `B`", np: "`B` मात्र", jp: "`B` だけ" },
            { en: "Nothing", np: "केही होइन", jp: "何も起きない" },
          ],
          correctIndex: 1,
          explanation: { en: "`addEventListener()` adds; it does not replace an earlier listener.", np: "`addEventListener()` ले थप्छ; अघिल्लो listener हटाउँदैन।", jp: "`addEventListener()` は追加であり、前のリスナーを置き換えない。" },
        },
      ],
    },
    {
      id: "event-bubbling-delegation",
      title: { en: "Event Bubbling, Capturing & Delegation", np: "Event Bubbling, Capturing र Delegation", jp: "イベントバブリング・キャプチャリング・委譲" },
      durationMinutes: 9,
      explanation: {
        en: "When an event happens on a nested element, it does not simply run on that element. The event travels through the DOM tree. This is called <b>event propagation</b> and has three stages:\n\n```text\n        document\n           │\n           ▼\n    Capture Phase\n           │\n           ▼\n       Target\n           │\n           ▼\n    Bubble Phase\n           │\n           ▼\n        document\n```\n\nThe two important phases:\n\n• <b>Capturing</b> — the event travels from the root toward the target.\n• <b>Bubbling</b> — the event travels from the target back up through its ancestors.\n\nMost commonly used events such as `click`, `input` and `submit` bubble. Some, such as `focus`, `blur`, `mouseenter` and `mouseleave`, do not.\n\nBy default, `addEventListener()` listens during the <b>bubbling</b> phase.\n\n---\n\n### 1. Basic — event bubbling\n\n```html\n<div id=\"parent\">\n  <button id=\"child\">Click me</button>\n</div>\n```\n\n```javascript\nconst parent = document.querySelector(\"#parent\");\nconst child = document.querySelector(\"#child\");\n\nparent.addEventListener(\"click\", () => {\n  console.log(\"Parent\");\n});\n\nchild.addEventListener(\"click\", () => {\n  console.log(\"Child\");\n});\n```\n\nClicking the button logs:\n\n```text\nChild\nParent\n```\n\n```text\nbutton\n  ↓\nevent happens\n  ↓\nbutton handler\n  ↓\nevent bubbles\n  ↓\nparent handler\n```\n\n---\n\n### 2. Intermediate — capturing vs bubbling\n\n```javascript\nparent.addEventListener(\"click\", () => {\n  console.log(\"Parent - capture\");\n}, { capture: true });\n\nchild.addEventListener(\"click\", () => {\n  console.log(\"Child\");\n});\n\nparent.addEventListener(\"click\", () => {\n  console.log(\"Parent - bubble\");\n});\n```\n\nClicking the button produces:\n\n```text\nParent - capture\nChild\nParent - bubble\n```\n\nThe capture listener runs <b>before</b> the target; the normal listener runs during bubbling, <b>after</b> the target. You can also write `parent.addEventListener(\"click\", handler, true)`, but `{ capture: true }` is clearer.\n\n---\n\n### 3. Advanced — event delegation\n\nImagine a list containing hundreds of buttons:\n\n```html\n<ul id=\"users\">\n  <li><button data-id=\"1\">Rajan</button></li>\n  <li><button data-id=\"2\">John</button></li>\n  <li><button data-id=\"3\">Sarah</button></li>\n</ul>\n```\n\nA naive approach attaches a listener to every button:\n\n```javascript\ndocument.querySelectorAll(\"#users button\")\n  .forEach(button => {\n    button.addEventListener(\"click\", handleClick);\n  });\n```\n\nInstead, attach one listener to the parent:\n\n```javascript\nconst users = document.querySelector(\"#users\");\n\nusers.addEventListener(\"click\", (event) => {\n  const button = event.target.closest(\"button\");\n\n  if (!button) return;\n\n  console.log(\"User ID:\", button.dataset.id);\n});\n```\n\n```text\n                #users\n                   │\n            ONE event listener\n                   │\n       ┌───────────┼───────────┐\n       ▼           ▼           ▼\n    button       button      button\n      1             2           3\n\n       ▲\n       │\n   event bubbles\n       │\n       └──────► #users\n```\n\nThis is <b>event delegation</b>.\n\n---\n\n### Why `closest()` matters\n\n```html\n<button class=\"delete\">\n  <span>Trash</span>\n  Delete\n</button>\n```\n\nIf the user clicks the `<span>`, then `event.target` is the `<span>`, not the button. So this fails:\n\n```javascript\nif (event.target.matches(\".delete\")) {\n  // never runs for a click on the span\n}\n```\n\nInstead:\n\n```javascript\nconst button = event.target.closest(\".delete\");\n\nif (!button) return;\n\nconsole.log(\"Delete clicked\");\n```\n\n`closest()` starts at the target and walks upward until it finds a matching element:\n\n```text\nevent.target\n     │\n     ▼\n   <span>\n     │\n     ▼\n <button class=\"delete\">  ← closest(\".delete\")\n     │\n     ▼\n   <div>\n```\n\nThis makes delegation work even when the user clicks an icon or `<span>` inside the interactive element.\n\n---\n\n### Dynamic elements\n\nDelegation is especially useful when elements are created <b>after</b> the listener was registered.\n\n```javascript\nconst list = document.querySelector(\"#list\");\n\nlist.addEventListener(\"click\", (event) => {\n  const item = event.target.closest(\".item\");\n\n  if (!item) return;\n\n  console.log(\"Clicked:\", item.textContent);\n});\n```\n\nLater:\n\n```javascript\nlist.insertAdjacentHTML(\n  \"beforeend\",\n  `<button class=\"item\">New Item</button>`\n);\n```\n\nThe new button works automatically. You never need to call `newButton.addEventListener(...)`, because the parent listener is already there and the event bubbles to it.\n\n---\n\n### `stopPropagation()`\n\n```javascript\nchild.addEventListener(\"click\", (event) => {\n  event.stopPropagation();\n\n  console.log(\"Child\");\n});\n```\n\nNow only `Child` is logged; the parent does not receive the bubbled event.\n\nRemember: `stopPropagation()` <b>does not prevent the browser's default action</b>. For that, use `preventDefault()`. They solve different problems.\n\n---\n\n### Bubbling vs capturing\n\n```text\n              Capturing              Bubbling\nDirection     root → target          target → root\nDefault?      no                     yes\nListener      { capture: true }      normal listener\nParent runs   before the child       after the child\nCommon use    special ordering       event delegation\n```\n\n---\n\n### The idea to remember\n\n> <b>Bubbling lets an event from a child reach its ancestors. Event delegation takes advantage of that by putting one listener on a parent instead of many listeners on individual children.</b>",
        np: "Nested element मा event हुँदा, यो त्यही element मा मात्र चल्दैन। Event DOM tree हुँदै यात्रा गर्छ। यसलाई <b>event propagation</b> भनिन्छ र यसका तीन चरण छन्:\n\n```text\n        document\n           │\n           ▼\n    Capture Phase\n           │\n           ▼\n       Target\n           │\n           ▼\n    Bubble Phase\n           │\n           ▼\n        document\n```\n\nदुई महत्वपूर्ण चरण:\n\n• <b>Capturing</b> — event root बाट target तिर जान्छ।\n• <b>Bubbling</b> — event target बाट माथि ancestor तिर फर्किन्छ।\n\n`click`, `input` र `submit` जस्ता धेरै प्रयोग हुने event bubble हुन्छन्। `focus`, `blur`, `mouseenter` र `mouseleave` जस्ता केही हुँदैनन्।\n\nपूर्वनिर्धारित रूपमा, `addEventListener()` <b>bubbling</b> चरणमा सुन्छ।\n\n---\n\n### 1. आधारभूत — event bubbling\n\n```html\n<div id=\"parent\">\n  <button id=\"child\">Click me</button>\n</div>\n```\n\n```javascript\nconst parent = document.querySelector(\"#parent\");\nconst child = document.querySelector(\"#child\");\n\nparent.addEventListener(\"click\", () => {\n  console.log(\"Parent\");\n});\n\nchild.addEventListener(\"click\", () => {\n  console.log(\"Child\");\n});\n```\n\nButton click गर्दा:\n\n```text\nChild\nParent\n```\n\n```text\nbutton\n  ↓\nevent happens\n  ↓\nbutton handler\n  ↓\nevent bubbles\n  ↓\nparent handler\n```\n\n---\n\n### 2. मध्यम — capturing vs bubbling\n\n```javascript\nparent.addEventListener(\"click\", () => {\n  console.log(\"Parent - capture\");\n}, { capture: true });\n\nchild.addEventListener(\"click\", () => {\n  console.log(\"Child\");\n});\n\nparent.addEventListener(\"click\", () => {\n  console.log(\"Parent - bubble\");\n});\n```\n\nButton click गर्दा:\n\n```text\nParent - capture\nChild\nParent - bubble\n```\n\nCapture listener target <b>अघि</b> चल्छ; सामान्य listener bubbling मा, target <b>पछि</b>। `parent.addEventListener(\"click\", handler, true)` पनि लेख्न सकिन्छ, तर `{ capture: true }` स्पष्ट छ।\n\n---\n\n### 3. उन्नत — event delegation\n\nसयौं button भएको list कल्पना गर्नुहोस्:\n\n```html\n<ul id=\"users\">\n  <li><button data-id=\"1\">Rajan</button></li>\n  <li><button data-id=\"2\">John</button></li>\n  <li><button data-id=\"3\">Sarah</button></li>\n</ul>\n```\n\nसिधा तरिकाले हरेक button मा listener जोड्छ:\n\n```javascript\ndocument.querySelectorAll(\"#users button\")\n  .forEach(button => {\n    button.addEventListener(\"click\", handleClick);\n  });\n```\n\nबरु, parent मा एउटै listener जोड्नुहोस्:\n\n```javascript\nconst users = document.querySelector(\"#users\");\n\nusers.addEventListener(\"click\", (event) => {\n  const button = event.target.closest(\"button\");\n\n  if (!button) return;\n\n  console.log(\"User ID:\", button.dataset.id);\n});\n```\n\n```text\n                #users\n                   │\n            ONE event listener\n                   │\n       ┌───────────┼───────────┐\n       ▼           ▼           ▼\n    button       button      button\n      1             2           3\n\n       ▲\n       │\n   event bubbles\n       │\n       └──────► #users\n```\n\nयही <b>event delegation</b> हो।\n\n---\n\n### `closest()` किन महत्वपूर्ण छ\n\n```html\n<button class=\"delete\">\n  <span>Trash</span>\n  Delete\n</button>\n```\n\nUser ले `<span>` click गरे, `event.target` `<span>` हुन्छ, button होइन। त्यसैले यो असफल हुन्छ:\n\n```javascript\nif (event.target.matches(\".delete\")) {\n  // span मा click हुँदा कहिल्यै चल्दैन\n}\n```\n\nबरु:\n\n```javascript\nconst button = event.target.closest(\".delete\");\n\nif (!button) return;\n\nconsole.log(\"Delete clicked\");\n```\n\n`closest()` target बाट सुरु गरी मिल्ने element नभेटेसम्म माथि जान्छ:\n\n```text\nevent.target\n     │\n     ▼\n   <span>\n     │\n     ▼\n <button class=\"delete\">  ← closest(\".delete\")\n     │\n     ▼\n   <div>\n```\n\nत्यसैले user ले भित्रको icon वा `<span>` click गर्दा पनि delegation काम गर्छ।\n\n---\n\n### गतिशील element\n\nListener दर्ता भएपछि <b>बनेका</b> element का लागि delegation विशेष उपयोगी छ।\n\n```javascript\nconst list = document.querySelector(\"#list\");\n\nlist.addEventListener(\"click\", (event) => {\n  const item = event.target.closest(\".item\");\n\n  if (!item) return;\n\n  console.log(\"Clicked:\", item.textContent);\n});\n```\n\nपछि:\n\n```javascript\nlist.insertAdjacentHTML(\n  \"beforeend\",\n  `<button class=\"item\">New Item</button>`\n);\n```\n\nनयाँ button स्वतः काम गर्छ। `newButton.addEventListener(...)` बोलाउनु पर्दैन, किनकि parent listener पहिले नै छ र event त्यहाँसम्म bubble हुन्छ।\n\n---\n\n### `stopPropagation()`\n\n```javascript\nchild.addEventListener(\"click\", (event) => {\n  event.stopPropagation();\n\n  console.log(\"Child\");\n});\n```\n\nअब `Child` मात्र देखिन्छ; parent ले bubble भएको event पाउँदैन।\n\nसम्झनुहोस्: `stopPropagation()` ले <b>browser को default कार्य रोक्दैन</b>। त्यसका लागि `preventDefault()` प्रयोग गर्नुहोस्। दुबैले फरक समस्या हल गर्छन्।\n\n---\n\n### Bubbling vs capturing\n\n```text\n              Capturing              Bubbling\nदिशा          root → target          target → root\nपूर्वनिर्धारित? होइन                  हो\nListener      { capture: true }      सामान्य listener\nParent चल्छ   child अघि              child पछि\nसामान्य प्रयोग विशेष क्रम              event delegation\n```\n\n---\n\n### सम्झनुपर्ने विचार\n\n> <b>Bubbling ले child को event लाई ancestor सम्म पुर्‍याउँछ। Event delegation ले त्यही फाइदा उठाउँदै धेरै child मा होइन, एउटा parent मा एउटै listener राख्छ।</b>",
        jp: "入れ子の要素でイベントが起きると、その要素だけで完結せず、イベントはDOMツリーを旅します。これを<b>イベントの伝播</b>と呼び、3つの段階があります:\n\n```text\n        document\n           │\n           ▼\n    Capture Phase\n           │\n           ▼\n       Target\n           │\n           ▼\n    Bubble Phase\n           │\n           ▼\n        document\n```\n\n重要なのは2つです:\n\n• <b>キャプチャ</b> — ルートからターゲットへ向かう。\n• <b>バブリング</b> — ターゲットから祖先へ戻っていく。\n\n`click`・`input`・`submit` などよく使うイベントはバブルします。`focus`・`blur`・`mouseenter`・`mouseleave` などはバブルしません。\n\n既定では `addEventListener()` は<b>バブリング</b>段階で待ち受けます。\n\n---\n\n### 1. 基本 — バブリング\n\n```html\n<div id=\"parent\">\n  <button id=\"child\">Click me</button>\n</div>\n```\n\n```javascript\nconst parent = document.querySelector(\"#parent\");\nconst child = document.querySelector(\"#child\");\n\nparent.addEventListener(\"click\", () => {\n  console.log(\"Parent\");\n});\n\nchild.addEventListener(\"click\", () => {\n  console.log(\"Child\");\n});\n```\n\nボタンをクリックすると:\n\n```text\nChild\nParent\n```\n\n```text\nbutton\n  ↓\nevent happens\n  ↓\nbutton handler\n  ↓\nevent bubbles\n  ↓\nparent handler\n```\n\n---\n\n### 2. 中級 — キャプチャとバブリング\n\n```javascript\nparent.addEventListener(\"click\", () => {\n  console.log(\"Parent - capture\");\n}, { capture: true });\n\nchild.addEventListener(\"click\", () => {\n  console.log(\"Child\");\n});\n\nparent.addEventListener(\"click\", () => {\n  console.log(\"Parent - bubble\");\n});\n```\n\nボタンをクリックすると:\n\n```text\nParent - capture\nChild\nParent - bubble\n```\n\nキャプチャのリスナーはターゲットより<b>前</b>に、通常のリスナーはバブリング中、つまりターゲットの<b>後</b>に走ります。`parent.addEventListener(\"click\", handler, true)` とも書けますが、`{ capture: true }` の方が明快です。\n\n---\n\n### 3. 上級 — イベント委譲\n\n何百ものボタンを含むリストを想像してください:\n\n```html\n<ul id=\"users\">\n  <li><button data-id=\"1\">Rajan</button></li>\n  <li><button data-id=\"2\">John</button></li>\n  <li><button data-id=\"3\">Sarah</button></li>\n</ul>\n```\n\n素朴な方法はすべてのボタンにリスナーを付けます:\n\n```javascript\ndocument.querySelectorAll(\"#users button\")\n  .forEach(button => {\n    button.addEventListener(\"click\", handleClick);\n  });\n```\n\n代わりに、親に1つだけ付けます:\n\n```javascript\nconst users = document.querySelector(\"#users\");\n\nusers.addEventListener(\"click\", (event) => {\n  const button = event.target.closest(\"button\");\n\n  if (!button) return;\n\n  console.log(\"User ID:\", button.dataset.id);\n});\n```\n\n```text\n                #users\n                   │\n            ONE event listener\n                   │\n       ┌───────────┼───────────┐\n       ▼           ▼           ▼\n    button       button      button\n      1             2           3\n\n       ▲\n       │\n   event bubbles\n       │\n       └──────► #users\n```\n\nこれが<b>イベント委譲</b>です。\n\n---\n\n### `closest()` が効く理由\n\n```html\n<button class=\"delete\">\n  <span>Trash</span>\n  Delete\n</button>\n```\n\n`<span>` をクリックすると `event.target` はボタンではなく `<span>` です。だからこれは失敗します:\n\n```javascript\nif (event.target.matches(\".delete\")) {\n  // spanのクリックでは走らない\n}\n```\n\n代わりに:\n\n```javascript\nconst button = event.target.closest(\".delete\");\n\nif (!button) return;\n\nconsole.log(\"Delete clicked\");\n```\n\n`closest()` はターゲットから始めて、一致する要素が見つかるまで上へたどります:\n\n```text\nevent.target\n     │\n     ▼\n   <span>\n     │\n     ▼\n <button class=\"delete\">  ← closest(\".delete\")\n     │\n     ▼\n   <div>\n```\n\nこれで、内側のアイコンや `<span>` をクリックしても委譲が機能します。\n\n---\n\n### 動的に増える要素\n\nリスナー登録<b>後</b>に作られる要素にこそ委譲が効きます。\n\n```javascript\nconst list = document.querySelector(\"#list\");\n\nlist.addEventListener(\"click\", (event) => {\n  const item = event.target.closest(\".item\");\n\n  if (!item) return;\n\n  console.log(\"Clicked:\", item.textContent);\n});\n```\n\n後から:\n\n```javascript\nlist.insertAdjacentHTML(\n  \"beforeend\",\n  `<button class=\"item\">New Item</button>`\n);\n```\n\n新しいボタンは自動的に動きます。親のリスナーが既にあり、イベントがそこまでバブルするので `newButton.addEventListener(...)` は不要です。\n\n---\n\n### `stopPropagation()`\n\n```javascript\nchild.addEventListener(\"click\", (event) => {\n  event.stopPropagation();\n\n  console.log(\"Child\");\n});\n```\n\n`Child` だけが出力され、親はバブルしたイベントを受け取りません。\n\n注意: `stopPropagation()` は<b>ブラウザの既定動作を止めません</b>。それには `preventDefault()` を使います。役割が違います。\n\n---\n\n### バブリングとキャプチャ\n\n```text\n              Capturing              Bubbling\n方向          root → target          target → root\n既定?         いいえ                  はい\nリスナー      { capture: true }      通常のリスナー\n親が走るのは  子より前                子より後\n主な用途      特殊な順序制御          イベント委譲\n```\n\n---\n\n### 覚えるべき考え\n\n> <b>バブリングは子のイベントを祖先へ届ける。イベント委譲はそれを利用し、多数の子ではなく1つの親にリスナーを置く。</b>",
      },
      diagram: `CAPTURE
──────────────────────────────►

document
   ↓
grandparent
   ↓
parent
   ↓
button ← TARGET


BUBBLE
◄──────────────────────────────

button ← TARGET
   ↑
parent
   ↑
grandparent
   ↑
document


Delegation: one listener, any number of children

                #users
                   │
            ONE event listener
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
    button       button      button
      1             2           3

       ▲
       │
   event bubbles
       │
       └──────► #users


closest() walks up from the click

event.target
     │
     ▼
   <span>
     │
     ▼
 <button class="delete">  ← closest(".delete")
     │
     ▼
   <div>`,
      codeExample: {
        title: { en: "One listener instead of many", np: "धेरैको सट्टा एउटै listener", jp: "多数ではなく1つのリスナー" },
        code: `// ── 1. Basic — the event bubbles from child to parent ─────────────
parent.addEventListener("click", () => console.log("Parent"));
child.addEventListener("click", () => console.log("Child"));
// clicking the button logs Child, then Parent

// ── 2. Intermediate — capture runs before the target ──────────────
parent.addEventListener("click", () => console.log("Parent - capture"), {
  capture: true,
});
child.addEventListener("click", () => console.log("Child"));
parent.addEventListener("click", () => console.log("Parent - bubble"));
// Parent - capture, Child, Parent - bubble

// ── 3. Advanced — one listener for every row ──────────────────────
const users = document.querySelector("#users");

users.addEventListener("click", (event) => {
  const button = event.target.closest("button"); // handles clicks on inner spans
  if (!button) return;                            // click landed outside a button

  console.log("User ID:", button.dataset.id);
});

// Rows added later need no listener of their own
users.insertAdjacentHTML("beforeend", \`<li><button data-id="4">New</button></li>\`);

// ── Stopping the journey, not the default action ──────────────────
child.addEventListener("click", (event) => {
  event.stopPropagation(); // the parent handler never runs
  // event.preventDefault(); // this is what stops navigation or submission
});`,
      },
      keyTakeaways: [
        { en: "Event propagation has three stages: <b>capture</b>, <b>target</b> and <b>bubble</b>.", np: "Event propagation का तीन चरण छन्: <b>capture</b>, <b>target</b> र <b>bubble</b>।", jp: "イベントの伝播は<b>キャプチャ</b>・<b>ターゲット</b>・<b>バブル</b>の3段階。" },
        { en: "`addEventListener()` listens during <b>bubbling</b> unless you pass `{ capture: true }`.", np: "`{ capture: true }` नदिएसम्म `addEventListener()` <b>bubbling</b> मा सुन्छ।", jp: "`{ capture: true }` を渡さない限り `addEventListener()` は<b>バブリング</b>で待ち受ける。" },
        { en: "Bubbling means a click on a child also reaches its ancestors' listeners.", np: "Bubbling को अर्थ child मा गरेको click ancestor का listener सम्म पनि पुग्छ।", jp: "バブリングとは、子へのクリックが祖先のリスナーにも届くということ。" },
        { en: "<b>Event delegation</b> puts one listener on a parent instead of many on children.", np: "<b>Event delegation</b> ले child मा धेरैको सट्टा parent मा एउटै listener राख्छ।", jp: "<b>イベント委譲</b>は、子に多数ではなく親に1つのリスナーを置く。" },
        { en: "`event.target.closest(selector)` finds the intended element even when a child was clicked.", np: "`event.target.closest(selector)` ले child click हुँदा पनि लक्षित element भेट्टाउँछ।", jp: "`event.target.closest(selector)` は子がクリックされても目的の要素を見つける。" },
        { en: "Delegation automatically covers elements created <b>after</b> the listener was registered.", np: "Delegation ले listener दर्ता भएपछि <b>बनेका</b> element स्वतः समेट्छ।", jp: "委譲はリスナー登録<b>後</b>に作られた要素も自動的に扱う。" },
        { en: "`stopPropagation()` stops the journey; `preventDefault()` stops the browser's default action.", np: "`stopPropagation()` ले यात्रा रोक्छ; `preventDefault()` ले browser को default कार्य।", jp: "`stopPropagation()` は旅路を、`preventDefault()` は既定動作を止める。" },
      ],
      commonMistakes: [
        { en: "<b>Assuming events only run on the clicked element</b> — a click on a child also triggers a parent's handler because the event bubbles.", np: "<b>Event click भएको element मा मात्र चल्छ भन्ने ठान्नु</b> — event bubble हुने भएकाले child को click ले parent को handler पनि चलाउँछ।", jp: "<b>イベントはクリックされた要素だけで走ると思う</b> — バブルするので、子のクリックは親のハンドラーも呼ぶ。" },
        { en: "<b>Attaching hundreds of identical listeners</b> — `buttons.forEach(b => b.addEventListener(\"click\", handleClick))` works, but delegation from the parent is cleaner for large or dynamic lists.", np: "<b>सयौं उस्तै listener जोड्नु</b> — `buttons.forEach(b => b.addEventListener(\"click\", handleClick))` ले काम त गर्छ, तर ठूलो वा गतिशील list का लागि parent बाट delegation सफा हुन्छ।", jp: "<b>同じリスナーを何百も付ける</b> — `buttons.forEach(b => b.addEventListener(\"click\", handleClick))` でも動くが、大きく動的なリストには親からの委譲が明快。" },
        { en: "<b>Using `event.target` without checking it</b> — `event.target.closest(\".delete\").remove()` throws when the click landed outside `.delete`. Return early with `if (!button) return;`.", np: "<b>`event.target` जाँच नगरी प्रयोग गर्नु</b> — click `.delete` बाहिर परे `event.target.closest(\".delete\").remove()` ले error दिन्छ। `if (!button) return;` ले अघि नै फर्किनुहोस्।", jp: "<b>`event.target` を確認せず使う</b> — クリックが `.delete` の外なら `event.target.closest(\".delete\").remove()` は例外になる。`if (!button) return;` で早期に戻る。" },
        { en: "<b>Matching with `matches()` when the click can land on a child</b> — clicking a `<span>` inside `.delete` fails `event.target.matches(\".delete\")`. Use `closest()` instead.", np: "<b>Click child मा पर्न सक्दा `matches()` प्रयोग गर्नु</b> — `.delete` भित्रको `<span>` click गर्दा `event.target.matches(\".delete\")` असफल हुन्छ। बरु `closest()` प्रयोग गर्नुहोस्।", jp: "<b>子がクリックされうるのに `matches()` を使う</b> — `.delete` 内の `<span>` をクリックすると `event.target.matches(\".delete\")` は一致しない。`closest()` を使う。" },
        { en: "<b>Thinking `stopPropagation()` prevents default browser behaviour</b> — it controls propagation only. Use `preventDefault()` for link navigation or form submission.", np: "<b>`stopPropagation()` ले browser को default व्यवहार रोक्छ भन्ने ठान्नु</b> — यसले propagation मात्र नियन्त्रण गर्छ। Link navigation वा form submission का लागि `preventDefault()` प्रयोग गर्नुहोस्।", jp: "<b>`stopPropagation()` が既定動作を防ぐと思う</b> — それは伝播だけを制御する。リンク遷移やフォーム送信には `preventDefault()`。" },
      ],
      quiz: [
        {
          question: { en: "What is the normal direction of event bubbling?", np: "Event bubbling को सामान्य दिशा के हो?", jp: "バブリングの通常の方向は?" },
          options: [
            { en: "Parent to child", np: "Parent बाट child", jp: "親から子へ" },
            { en: "Browser to server", np: "Browser बाट server", jp: "ブラウザからサーバーへ" },
            { en: "Child to parent", np: "Child बाट parent", jp: "子から親へ" },
            { en: "Target to unrelated elements", np: "Target बाट असम्बन्धित element तिर", jp: "ターゲットから無関係な要素へ" },
          ],
          correctIndex: 2,
          explanation: { en: "Capturing goes the other way, from the root down to the target.", np: "Capturing उल्टो दिशामा, root बाट target सम्म जान्छ।", jp: "キャプチャは逆向きで、ルートからターゲットへ下る。" },
        },
        {
          question: { en: "How do you listen during the capture phase?", np: "Capture phase मा कसरी सुन्ने?", jp: "キャプチャ段階で待ち受けるには?" },
          options: [
            { en: "Call `addEventListener` with only the type and the handler", np: "`addEventListener` लाई type र handler मात्र दिएर बोलाउने", jp: "型とハンドラーだけで `addEventListener` を呼ぶ" },
            { en: "Call `element.addEvent(\"capture\", handler)`", np: "`element.addEvent(\"capture\", handler)` बोलाउने", jp: "`element.addEvent(\"capture\", handler)` を呼ぶ" },
            { en: "Call `element.capture(\"click\", handler)`", np: "`element.capture(\"click\", handler)` बोलाउने", jp: "`element.capture(\"click\", handler)` を呼ぶ" },
            { en: "Pass a `capture: true` option as the third argument", np: "तेस्रो argument मा `capture: true` option दिने", jp: "第3引数に `capture: true` のオプションを渡す" },
          ],
          correctIndex: 3,
          explanation: { en: "Passing `true` as the third argument works too, but is less readable.", np: "तेस्रो argument मा `true` दिँदा पनि हुन्छ, तर कम पठनीय छ।", jp: "第3引数に `true` を渡しても動くが、読みにくい。" },
        },
        {
          question: { en: "What is the main idea behind event delegation?", np: "Event delegation पछाडिको मुख्य विचार के हो?", jp: "イベント委譲の要点は?" },
          options: [
            { en: "Attach one listener to a parent and use bubbling", np: "Parent मा एउटै listener जोडेर bubbling प्रयोग गर्नु", jp: "親に1つ付けてバブリングを利用する" },
            { en: "Attach a listener to every child", np: "हरेक child मा listener जोड्नु", jp: "すべての子にリスナーを付ける" },
            { en: "Stop all events", np: "सबै event रोक्नु", jp: "すべてのイベントを止める" },
            { en: "Disable event propagation", np: "Event propagation निष्क्रिय पार्नु", jp: "伝播を無効にする" },
          ],
          correctIndex: 0,
          explanation: { en: "It also covers children added after the listener was registered.", np: "यसले listener दर्ता भएपछि थपिएका child पनि समेट्छ।", jp: "登録後に追加された子もカバーできる。" },
        },
        {
          question: { en: "Why is `closest()` useful in event delegation?", np: "Event delegation मा `closest()` किन उपयोगी छ?", jp: "イベント委譲で `closest()` が役立つ理由は?" },
          options: [
            { en: "It stops bubbling", np: "यसले bubbling रोक्छ", jp: "バブリングを止めるから" },
            { en: "It finds the nearest matching ancestor, or the target itself", np: "यसले सबैभन्दा नजिकको मिल्ने ancestor, वा target आफैं भेट्टाउँछ", jp: "最も近い一致する祖先、またはターゲット自身を見つけるから" },
            { en: "It creates a new element", np: "यसले नयाँ element बनाउँछ", jp: "新しい要素を作るから" },
            { en: "It removes an event listener", np: "यसले event listener हटाउँछ", jp: "リスナーを外すから" },
          ],
          correctIndex: 1,
          explanation: { en: "That is what makes a click on an inner icon or span still work.", np: "त्यसैले भित्रको icon वा span मा click गर्दा पनि काम गर्छ।", jp: "だから内側のアイコンやspanをクリックしても動く。" },
        },
        {
          question: { en: "With listeners on both `#parent` and `#child`, what happens when the button is clicked?", np: "`#parent` र `#child` दुबैमा listener हुँदा, button click गर्दा के हुन्छ?", jp: "`#parent` と `#child` の両方にリスナーがあるとき、ボタンをクリックすると?" },
          options: [
            { en: "`parent` only", np: "`parent` मात्र", jp: "`parent` だけ" },
            { en: "`child` only", np: "`child` मात्र", jp: "`child` だけ" },
            { en: "`child`, then `parent`", np: "`child`, अनि `parent`", jp: "`child` の次に `parent`" },
            { en: "`parent`, then `child`", np: "`parent`, अनि `child`", jp: "`parent` の次に `child`" },
          ],
          correctIndex: 2,
          explanation: { en: "The target handler runs first, then the event bubbles upward.", np: "पहिले target को handler चल्छ, अनि event माथि bubble हुन्छ।", jp: "まずターゲットのハンドラーが走り、その後イベントが上へバブルする。" },
        },
      ],
      youtubeIds: ["aVSf0b1jVKk", "3KJI1WZGDrg"],
    },
  ],
  finalQuiz: [
    {
      question: { en: "What does `document.querySelector(\".card\")` return when several `.card` elements exist?", np: "धेरै `.card` element हुँदा `document.querySelector(\".card\")` ले के फर्काउँछ?", jp: "`.card` が複数あるとき `document.querySelector(\".card\")` は何を返すか?" },
      options: [
        { en: "The first one", np: "पहिलो", jp: "最初の1つ" },
        { en: "All of them", np: "सबै", jp: "すべて" },
        { en: "An array", np: "एउटा array", jp: "配列" },
      ],
      correctIndex: 0,
      explanation: { en: "Use `querySelectorAll()` when you need every match.", np: "सबै match चाहिँदा `querySelectorAll()` प्रयोग गर्नुहोस्।", jp: "全件が必要なら `querySelectorAll()` を使う。" },
    },
    {
      question: { en: "Which property is safe for displaying untrusted user input?", np: "अविश्वसनीय user input देखाउन कुन property सुरक्षित छ?", jp: "信頼できないユーザー入力の表示に安全なのは?" },
      options: [
        { en: "`innerHTML`", np: "`innerHTML`", jp: "`innerHTML`" },
        { en: "`textContent`", np: "`textContent`", jp: "`textContent`" },
        { en: "`outerHTML`", np: "`outerHTML`", jp: "`outerHTML`" },
      ],
      correctIndex: 1,
      explanation: { en: "`innerHTML` parses the string as markup, which is an XSS risk.", np: "`innerHTML` ले string लाई markup भनी parse गर्छ, जुन XSS जोखिम हो।", jp: "`innerHTML` は文字列をマークアップとして解釈し、XSSのリスクになる。" },
    },
    {
      question: { en: "What does `document.createElement(\"li\")` do on its own?", np: "`document.createElement(\"li\")` ले आफैंले के गर्छ?", jp: "`document.createElement(\"li\")` だけでは何が起きるか?" },
      options: [
        { en: "Replaces the body", np: "Body प्रतिस्थापन गर्छ", jp: "bodyを置き換える" },
        { en: "Adds it to the page immediately", np: "तुरुन्तै page मा थप्छ", jp: "すぐにページへ追加する" },
        { en: "Creates a detached element in memory", np: "Memory मा छुट्टै element बनाउँछ", jp: "メモリ上に未接続の要素を作る" },
      ],
      correctIndex: 2,
      explanation: { en: "It appears only after `append()` or `appendChild()`.", np: "`append()` वा `appendChild()` पछि मात्र देखिन्छ।", jp: "`append()` か `appendChild()` の後で初めて現れる。" },
    },
    {
      question: { en: "What does `element.classList.toggle(\"active\")` do?", np: "`element.classList.toggle(\"active\")` ले के गर्छ?", jp: "`element.classList.toggle(\"active\")` は何をするか?" },
      options: [
        { en: "Adds the class if absent, removes it if present", np: "नभए class थप्छ, भए हटाउँछ", jp: "無ければ追加し、有れば削除する" },
        { en: "Always adds the class", np: "सधैं class थप्छ", jp: "常に追加する" },
        { en: "Removes the element", np: "Element हटाउँछ", jp: "要素を削除する" },
      ],
      correctIndex: 0,
      explanation: { en: "`contains()` checks without changing anything.", np: "`contains()` ले केही नबदली जाँच्छ।", jp: "`contains()` は何も変えずに確認する。" },
    },
    {
      question: { en: "What does `event.target` represent?", np: "`event.target` ले के जनाउँछ?", jp: "`event.target` は何を表すか?" },
      options: [
        { en: "The element the listener is attached to", np: "Listener जोडिएको element", jp: "リスナーが付いている要素" },
        { en: "The element where the event originated", np: "Event सुरु भएको element", jp: "イベントが発生した要素" },
        { en: "The document root", np: "Document को root", jp: "documentのルート" },
      ],
      correctIndex: 1,
      explanation: { en: "`event.currentTarget` is the element holding the listener.", np: "`event.currentTarget` listener भएको element हो।", jp: "リスナーを持つ要素は `event.currentTarget`。" },
    },
    {
      question: { en: "What is required to remove a listener with `removeEventListener()`?", np: "`removeEventListener()` ले listener हटाउन के चाहिन्छ?", jp: "`removeEventListener()` でリスナーを外すのに必要なものは?" },
      options: [
        { en: "The element's id", np: "Element को id", jp: "要素のid" },
        { en: "A new function with identical code", np: "उही code भएको नयाँ function", jp: "同じコードの新しい関数" },
        { en: "The same function reference used to add it", np: "थप्दा प्रयोग गरिएकै function reference", jp: "追加時と同じ関数参照" },
      ],
      correctIndex: 2,
      explanation: { en: "Two identical-looking arrow functions are different objects.", np: "उस्तै देखिने दुई arrow function फरक object हुन्।", jp: "見た目が同じアロー関数でも別のオブジェクト。" },
    },
    {
      question: { en: "Which method stops a form from reloading the page on submit?", np: "Submit मा form ले page reload नगरोस् भन्नाका लागि कुन method?", jp: "送信時にページを再読み込みさせないのはどのメソッドか?" },
      options: [
        { en: "`event.preventDefault()`", np: "`event.preventDefault()`", jp: "`event.preventDefault()`" },
        { en: "`event.stopPropagation()`", np: "`event.stopPropagation()`", jp: "`event.stopPropagation()`" },
        { en: "`event.stopImmediatePropagation()`", np: "`event.stopImmediatePropagation()`", jp: "`event.stopImmediatePropagation()`" },
      ],
      correctIndex: 0,
      explanation: { en: "`stopPropagation()` controls the event's path, not the browser default.", np: "`stopPropagation()` ले event को बाटो नियन्त्रण गर्छ, browser को default होइन।", jp: "`stopPropagation()` は経路を制御し、既定動作は止めない。" },
    },
    {
      question: { en: "In which phase does `addEventListener()` listen by default?", np: "`addEventListener()` पूर्वनिर्धारित रूपमा कुन phase मा सुन्छ?", jp: "`addEventListener()` は既定でどの段階で待ち受けるか?" },
      options: [
        { en: "Capturing", np: "Capturing", jp: "キャプチャ" },
        { en: "Bubbling", np: "Bubbling", jp: "バブリング" },
        { en: "Target only", np: "Target मात्र", jp: "ターゲットのみ" },
      ],
      correctIndex: 1,
      explanation: { en: "Pass `{ capture: true }` to listen on the way down instead.", np: "ओर्लंदो बाटोमा सुन्न `{ capture: true }` दिनुहोस्।", jp: "下りの経路で待ち受けるには `{ capture: true }` を渡す。" },
    },
    {
      question: { en: "Why does event delegation use `event.target.closest(selector)`?", np: "Event delegation ले `event.target.closest(selector)` किन प्रयोग गर्छ?", jp: "イベント委譲で `event.target.closest(selector)` を使う理由は?" },
      options: [
        { en: "It is faster than `matches()`", np: "यो `matches()` भन्दा छिटो छ", jp: "`matches()` より速いから" },
        { en: "It stops the event bubbling further", np: "यसले event लाई अझ bubble हुन रोक्छ", jp: "イベントのさらなるバブリングを止めるから" },
        { en: "The click may land on a child such as an icon or span", np: "Click icon वा span जस्तो child मा पर्न सक्छ", jp: "クリックがアイコンやspanなど子要素に当たりうるから" },
      ],
      correctIndex: 2,
      explanation: { en: "`closest()` walks up from the target until it finds the real button.", np: "`closest()` target बाट माथि गएर वास्तविक button भेट्टाउँछ।", jp: "`closest()` はターゲットから上へたどって本来のボタンを見つける。" },
    },
  ],
};
