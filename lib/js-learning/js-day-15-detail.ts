import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_15_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "The DOM (Document Object Model) is the browser's representation of a web page as a tree of objects. JavaScript can read and modify it to make pages dynamic. Events are how the browser tells your code that something happened — a click, a key press, a form submission.",
      np: "DOM (Document Object Model) browser ले web page लाई objects को tree को रूपमा represent गर्दछ। JavaScript ले pages dynamic बनाउन यसलाई read र modify गर्न सक्छ। Events ले browser ले तपाईंको code लाई केही भयो भनेर बताउँछ।",
      jp: "DOM（Document Object Model）はブラウザがWebページをオブジェクトのツリーとして表現したもの。JavaScriptはそれを読み書きしてページを動的にする。イベントはブラウザがコードにクリック・キー入力・フォーム送信などを通知する仕組み。",
    },
    {
      en: "Event delegation is one of the most important performance patterns in frontend JavaScript. Instead of attaching an event listener to every list item, you attach one listener to the parent and let events bubble up. This works for thousands of items without the memory cost of thousands of listeners.",
      np: "Event delegation frontend JavaScript को सबैभन्दा महत्त्वपूर्ण performance patterns मध्ये एक हो। हर list item मा listener attach गर्नुको सट्टा एउटा listener parent मा attach गर्नुहोस् र events bubble up हुन दिनुहोस्।",
      jp: "イベント委譲はフロントエンドJSの重要なパフォーマンスパターン。各リストアイテムにリスナーをつける代わりに、親一つにリスナーをつけてバブリングを利用する。数千アイテムでもメモリコストは1つのリスナー分。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "y17RuWkWdn8", title: "JavaScript DOM Manipulation — Crash Course" },
      ],
    },
    {
      title: { en: "Querying and modifying the DOM", np: "DOM query र modify गर्नु", jp: "DOMのクエリと変更" },
      blocks: [
        {
          type: "code",
          title: { en: "Selecting elements and changing them", np: "Elements select र change गर्नु", jp: "要素の選択と変更" },
          code: `// ── Selecting elements ────────────────────────────────────────────
// querySelector — returns the FIRST matching element (or null)
const title   = document.querySelector("h1");
const btn     = document.querySelector("#submit-btn");      // by id
const inputs  = document.querySelectorAll("input[type='text']"); // all matching

// Older methods (still work, fast for id/class lookups)
const byId    = document.getElementById("app");
const byClass = document.getElementsByClassName("card");   // HTMLCollection (live)
const byTag   = document.getElementsByTagName("p");         // HTMLCollection (live)

// ── Reading and writing text content ──────────────────────────────
const heading = document.querySelector("h1");

heading.textContent;              // "Hello World"   (raw text, safe)
heading.innerHTML;                // "<span>Hello</span> World" (HTML markup)

heading.textContent = "New Title"; // set text (safe — escapes HTML)
heading.innerHTML   = "<em>New</em> Title"; // set HTML (careful with user input — XSS risk!)

// ── Modifying attributes and styles ──────────────────────────────
const img = document.querySelector("img");

img.src          = "/new-image.jpg";  // attribute
img.alt          = "New image";
img.setAttribute("data-id", "42");
img.getAttribute("data-id");          // "42"
img.removeAttribute("alt");
img.hasAttribute("src");              // true

// Styles — use CSS classes instead of inline styles when possible
heading.style.color     = "red";       // inline style (ok for dynamic values)
heading.style.fontSize  = "2rem";

// Prefer class manipulation:
heading.classList.add("highlight");
heading.classList.remove("highlight");
heading.classList.toggle("active");    // add if absent, remove if present
heading.classList.contains("active");  // true or false
heading.className;                     // full class string

// ── Creating and inserting elements ──────────────────────────────
const li = document.createElement("li");
li.textContent = "New item";
li.classList.add("list-item");

const ul = document.querySelector("ul");
ul.appendChild(li);                    // add as last child
ul.prepend(li);                        // add as first child
ul.insertBefore(li, ul.children[2]);   // insert before index 2

// Modern insertion methods (cleaner):
ul.append(li);                         // like appendChild but accepts strings too
ul.before(li);                         // insert before the ul itself
ul.after(li);                          // insert after the ul itself

// Removing elements:
li.remove();                           // remove from DOM directly
ul.removeChild(li);                    // older way`,
        },
      ],
    },
    {
      title: { en: "Events — listening and responding", np: "Events — listen र respond गर्नु", jp: "イベント — リスニングと応答" },
      blocks: [
        {
          type: "code",
          title: { en: "addEventListener, removeEventListener, and the event object", np: "addEventListener र event object", jp: "addEventListener・removeEventListener・イベントオブジェクト" },
          code: `// ── Adding event listeners ────────────────────────────────────────
const btn = document.querySelector("#btn");

function handleClick(event) {
  console.log("Clicked!", event.type);  // "click"
  console.log("Target:", event.target); // the element that was clicked
  console.log("X:", event.clientX, "Y:", event.clientY); // mouse position
}

btn.addEventListener("click", handleClick);

// ── Removing a listener — must pass the SAME function reference ───
btn.removeEventListener("click", handleClick); // ✅ removes it
// btn.removeEventListener("click", () => {}); // ❌ won't work — different function

// ── Common event types ────────────────────────────────────────────
element.addEventListener("click",       handler);  // mouse click
element.addEventListener("dblclick",    handler);  // double click
element.addEventListener("mouseenter",  handler);  // mouse enters (no bubbling)
element.addEventListener("mouseleave",  handler);  // mouse leaves (no bubbling)
element.addEventListener("keydown",     handler);  // key pressed
element.addEventListener("keyup",       handler);  // key released
element.addEventListener("input",       handler);  // input value changed (real-time)
element.addEventListener("change",      handler);  // value committed (blur or select)
element.addEventListener("submit",      handler);  // form submitted
element.addEventListener("focus",       handler);  // element gains focus
element.addEventListener("blur",        handler);  // element loses focus
document.addEventListener("DOMContentLoaded", handler);  // DOM fully parsed

// ── The event object ──────────────────────────────────────────────
form.addEventListener("submit", (event) => {
  event.preventDefault();      // prevent default browser action (form submit = page reload)
  event.stopPropagation();     // stop event bubbling to parent elements

  const input = document.querySelector("#email");
  console.log(input.value);   // read the input value
});

// ── Keyboard events ───────────────────────────────────────────────
document.addEventListener("keydown", (event) => {
  console.log(event.key);     // "Enter", "a", "ArrowUp", "Escape"
  console.log(event.code);    // "Enter", "KeyA", "ArrowUp", "Escape" (layout-independent)
  console.log(event.ctrlKey, event.shiftKey, event.altKey);  // modifier keys

  if (event.key === "Escape") closeModal();
  if (event.ctrlKey && event.key === "s") saveDocument();
});`,
        },
      ],
    },
    {
      title: { en: "Event bubbling, capturing & delegation", np: "Event bubbling, capturing र delegation", jp: "イベントバブリング・キャプチャ・委譲" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "When an event fires on an element, it first travels DOWN the DOM tree from the root to the target (capture phase), then travels BACK UP from the target to the root (bubble phase). Most events bubble — `click`, `keydown`, `input`, `submit`. A few do not — `focus`, `blur`, `mouseenter`, `mouseleave`. By default, `addEventListener` listens in the bubble phase.",
            np: "Event fire हुँदा पहिले DOM tree मा ROOT बाट TARGET सम्म DOWN जान्छ (capture phase), त्यसपछि TARGET बाट ROOT सम्म BACK UP जान्छ (bubble phase)। अधिकांश events bubble हुन्छन् — `click`, `keydown`, `input`, `submit`. केही हुँदैनन् — `focus`, `blur`, `mouseenter`।",
            jp: "イベント発生時、まずDOMツリーをルートからターゲットへDOWN（キャプチャフェーズ）、次にターゲットからルートへUP（バブルフェーズ）。ほとんどのイベントはバブリングする。`addEventListener`はデフォルトでバブルフェーズでリスニング。",
          },
        },
        {
          type: "code",
          title: { en: "Event bubbling and delegation in practice", np: "Event bubbling र delegation practice मा", jp: "イベントバブリングと委譲の実践" },
          code: `// ── Bubbling in action ────────────────────────────────────────────
// <div id="outer">          ← click event bubbles UP to here last
//   <div id="inner">        ← click event bubbles UP to here
//     <button id="btn">     ← click event starts here
//   </div>
// </div>

document.getElementById("outer").addEventListener("click", () => console.log("outer"));
document.getElementById("inner").addEventListener("click", () => console.log("inner"));
document.getElementById("btn").addEventListener("click",   () => console.log("btn"));

// Clicking the button outputs: btn → inner → outer (bottom to top)

// ── event.stopPropagation() — stop the event from bubbling ────────
document.getElementById("btn").addEventListener("click", (event) => {
  event.stopPropagation();  // "inner" and "outer" will NOT fire
  console.log("btn only");
});

// ── Event delegation — one listener handles many children ─────────
// ❌ Naive approach — a listener per item (expensive, misses future items)
document.querySelectorAll(".todo-item").forEach(item => {
  item.addEventListener("click", handleTodoClick);  // 100 items = 100 listeners!
});

// ✅ Event delegation — one listener on the parent
const list = document.querySelector("#todo-list");

list.addEventListener("click", (event) => {
  // event.target is the element that was actually clicked
  const item = event.target.closest(".todo-item"); // handles clicks on child elements too

  if (!item) return;  // click was not on a todo item

  const id = item.dataset.id;
  handleTodoClick(id);
});

// Delegation advantages:
// 1. One listener instead of N → less memory
// 2. Works for dynamically added elements (items added after the listener is set up)
// 3. Easier to remove (remove one listener vs N)

// ── Capture phase — listen as event travels DOWN the tree ─────────
document.getElementById("outer").addEventListener(
  "click",
  () => console.log("outer (capture)"),
  true  // { capture: true } — listen during capture phase
);
// Now outer fires BEFORE inner and btn (top-down)`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`event.target`** is the element that was actually clicked (the deepest one). **`event.currentTarget`** is the element the listener is attached to. They are different when using delegation.",
              np: "**`event.target`** actually click भएको element हो (सबैभन्दा गहिरो)। **`event.currentTarget`** listener attach भएको element हो। Delegation use गर्दा दुवै फरक हुन्छन्।",
              jp: "**`event.target`**は実際にクリックされた要素（最も深い要素）。**`event.currentTarget`**はリスナーがアタッチされた要素。委譲では両者が異なる。",
            },
            {
              en: "**`event.preventDefault()`** stops the browser's default action (form submit reloads the page, anchor tag navigates). It does NOT stop event propagation — use `stopPropagation()` for that.",
              np: "**`event.preventDefault()`** browser को default action रोक्छ (form submit ले page reload, anchor ले navigate)। Event propagation रोक्दैन — त्यसका लागि `stopPropagation()`।",
              jp: "**`event.preventDefault()`**はブラウザのデフォルト動作を阻止（フォーム送信でのページリロード、アンカーのナビゲーション）。イベント伝播は止めない — それには`stopPropagation()`。",
            },
            {
              en: "**`element.closest(selector)`** walks up the DOM from the element and returns the nearest ancestor matching the selector (or the element itself). Use it in delegation to find the right container when the user might have clicked a child element.",
              np: "**`element.closest(selector)`** element बाट DOM tree माथि walk गर्छ र selector match गर्ने nearest ancestor (वा element itself) return गर्छ। Delegation मा user ले child element click गर्दा सही container find गर्न use गर्नुहोस्।",
              jp: "**`element.closest(selector)`**は要素からDOMを上にたどり、セレクタに一致する最近の祖先（または要素自身）を返す。委譲でユーザーが子要素をクリックした際の正しいコンテナ検索に使う。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "What is the difference between innerHTML and textContent?", np: "innerHTML र textContent मा के फरक?", jp: "innerHTMLとtextContentの違いは？" },
      answer: {
        en: "`textContent` reads and writes the raw text of an element and all its descendants — it ignores HTML markup and escapes any HTML you write to it, so it is safe for user-generated content. `innerHTML` reads and writes the actual HTML markup. When you read it, you get the HTML source. When you write it, the browser parses and renders it as HTML. Never set `innerHTML` with user-provided content — it is an XSS attack vector. Use `textContent` for text and `createElement`/`append` for dynamic HTML.",
        np: "`textContent` raw text read/write गर्छ र HTML markup escape गर्छ — user content का लागि safe। `innerHTML` actual HTML markup read/write गर्छ। User-provided content मा `innerHTML` set गर्नु XSS attack vector हो। Text का लागि `textContent`, dynamic HTML का लागि `createElement`/`append`।",
        jp: "`textContent`はテキストを読み書きし、HTMLをエスケープするため安全。`innerHTML`はHTMLマークアップを読み書きする。ユーザー提供コンテンツを`innerHTML`にセットするのはXSSの攻撃ベクター。テキストは`textContent`、動的HTMLは`createElement`/`append`を使う。",
      },
    },
    {
      question: { en: "When should I use event delegation?", np: "Event delegation कहिले use गर्ने?", jp: "イベント委譲はいつ使うべきか？" },
      answer: {
        en: "Use delegation when: (1) you have many similar elements that need the same handler — a list of 100 items, a table with 1000 rows; (2) elements are added or removed dynamically — a TODO list where items are added, a live search result list; (3) you are setting up listeners before the DOM is fully built. For a small number of static elements (like 3 navigation buttons), attaching listeners directly is simpler and equally correct.",
        np: "Delegation use गर्नुहोस् जब: (1) धेरै similar elements लाई same handler चाहिन्छ — 100 items को list; (2) elements dynamically add/remove हुन्छन् — TODO list; (3) DOM fully built हुनु अगाडि listeners setup गर्नु परेको। थोरै static elements (3 navigation buttons) का लागि directly attach गर्नु simplest।",
        jp: "委譲を使う場合: (1)同じハンドラが必要な要素が多い — 100アイテムのリスト; (2)要素が動的に追加・削除される — TODOリスト; (3)DOM構築前にリスナーを設定する場合。少数の静的要素（ナビボタン3つなど）なら直接アタッチが簡単で適切。",
      },
    },
    {
      question: { en: "What is the difference between event.target and event.currentTarget?", np: "event.target र event.currentTarget मा के फरक?", jp: "event.targetとevent.currentTargetの違いは？" },
      answer: {
        en: "`event.target` is the element the event originally fired on — the exact element the user clicked, typed in, etc. It changes as the event bubbles. `event.currentTarget` is the element the current listener is attached to — it stays the same throughout the listener's execution. In event delegation, `event.currentTarget` is always the parent you attached the listener to, while `event.target` is the child that was actually interacted with.",
        np: "`event.target` event originally fire भएको element — user ले exactly click गरेको। Bubble हुँदा बदलिन्छ। `event.currentTarget` current listener attach भएको element — listener execution भर same रहन्छ। Delegation मा `currentTarget` parent हो, `target` interact भएको child।",
        jp: "`event.target`はイベントが最初に発生した要素 — ユーザーが実際にクリックした要素。バブリングで変わる。`event.currentTarget`はリスナーがアタッチされた要素 — リスナー実行中は変わらない。委譲では`currentTarget`は親、`target`は実際に操作された子。",
      },
    },
  ],
};
