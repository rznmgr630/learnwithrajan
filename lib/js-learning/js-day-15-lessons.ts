import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_15_LESSONS: JsLessonDay = {
  day: 15,
  title: { en: "DOM, events, event bubbling & delegation", np: "DOM, events, bubbling र delegation", jp: "DOM・イベント・バブリング・委譲" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "querying-modifying-dom",
      title: { en: "Querying & Modifying the DOM", np: "DOM Query र Modify गर्नु", jp: "DOMのクエリと変更" },
      durationMinutes: 9,
      explanation: {
        en: "`document.querySelector(selector)` returns the <b>first</b> matching element (or `null`), while `document.querySelectorAll(selector)` returns a static list of every match — both accept any valid CSS selector. `document.getElementById(id)` is an older, narrower method that only matches by id, but it is still fast and common. Once you have an element, `textContent` reads/writes its raw text (safe — it escapes any HTML you assign to it), while `innerHTML` reads/writes actual HTML markup — assigning untrusted user input to `innerHTML` is a classic <b>XSS</b> (cross-site scripting) vulnerability, because the browser parses and runs whatever markup you hand it.\n\nBeyond text, you can toggle CSS classes with `classList.add()`, `classList.remove()`, and `classList.toggle()` — the preferred way to change appearance, since it keeps styling in CSS rather than JS. `setAttribute()`/`getAttribute()`/`removeAttribute()` manage arbitrary HTML attributes, and `element.style.property` sets one inline CSS property directly (useful for runtime-computed values, but overused it fights your stylesheet). To add brand-new content, `document.createElement(tag)` builds a detached element in memory, and `parentNode.appendChild(newElement)` (or the newer `append()`) inserts it into the live DOM — nothing appears on screen until that insertion happens.",
        np: "`document.querySelector(selector)` ले <b>पहिलो</b> matching element (वा `null`) फर्काउँछ, जबकि `document.querySelectorAll(selector)` ले सबै matches को static list फर्काउँछ — दुवैले कुनै पनि valid CSS selector accept गर्छन्। `document.getElementById(id)` पुरानो, साँघुरो method हो जसले केवल id ले match गर्छ, तर अझै fast र common छ। Element पाएपछि, `textContent` ले raw text read/write गर्छ (safe — assign गरेको जुनसुकै HTML escape गर्छ), जबकि `innerHTML` ले actual HTML markup read/write गर्छ — untrusted user input लाई `innerHTML` मा assign गर्नु classic <b>XSS</b> vulnerability हो, किनकि browser ले जे markup दिए पनि parse गरेर चलाउँछ।\n\nText बाहेक, `classList.add()`, `classList.remove()`, र `classList.toggle()` ले CSS classes toggle गर्न सकिन्छ — यो appearance change गर्ने preferred तरिका हो, किनकि styling CSS मा नै रहन्छ। `setAttribute()`/`getAttribute()`/`removeAttribute()` ले arbitrary HTML attributes manage गर्छन्, र `element.style.property` ले एउटा inline CSS property directly set गर्छ। नयाँ content थप्न, `document.createElement(tag)` ले memory मा detached element बनाउँछ, र `parentNode.appendChild(newElement)` (वा नयाँ `append()`) ले live DOM मा insert गर्छ — insertion नभएसम्म screen मा केही देखिँदैन।",
        jp: "`document.querySelector(selector)`は最初に一致する要素（または`null`）を返し、`document.querySelectorAll(selector)`はすべての一致を含む静的なリストを返す — どちらも有効なCSSセレクタを受け付ける。`document.getElementById(id)`はidでのみ一致する古く限定的なメソッドだが、今も高速でよく使われる。要素を取得したら、`textContent`は生のテキストを読み書きする（安全 — 代入したHTMLをエスケープする）。一方`innerHTML`は実際のHTMLマークアップを読み書きする — 信頼できないユーザー入力を`innerHTML`に代入するのは典型的な<b>XSS</b>（クロスサイトスクリプティング）脆弱性であり、ブラウザは渡されたマークアップを何でも解析・実行してしまう。\n\nテキスト以外にも、`classList.add()`・`classList.remove()`・`classList.toggle()`でCSSクラスを切り替えられる — スタイリングをCSS側に保てるため見た目を変える推奨方法。`setAttribute()`/`getAttribute()`/`removeAttribute()`は任意のHTML属性を管理し、`element.style.property`は1つのインラインCSSプロパティを直接設定する（実行時に決まる値に便利だが、多用するとスタイルシートと競合する）。新しいコンテンツを追加するには、`document.createElement(tag)`でメモリ上に未接続の要素を作り、`parentNode.appendChild(newElement)`（または新しい`append()`）でライブDOMに挿入する — 挿入されるまで画面には何も表示されない。",
      },
      diagram: `document
  └─ <ul id="list">
        ├─ <li class="item">Apple</li>
        ├─ <li class="item">Banana</li>
        └─ <li class="item">Cherry</li>

querySelector(".item")      → FIRST match only       → <li>Apple</li>
querySelectorAll(".item")   → ALL matches (static)    → [Apple, Banana, Cherry]
getElementById("list")      → matches by id only      → <ul id="list">

textContent = "Hi"          → safe, escapes HTML       ┐
innerHTML   = "<b>Hi</b>"   → parsed and rendered as HTML ┘ ← XSS risk with untrusted input`,
      codeExample: {
        title: { en: "Selecting, reading and modifying DOM elements", np: "DOM elements select, read र modify गर्नु", jp: "DOM要素の選択・読み取り・変更" },
        code: `// ── Selecting elements ────────────────────────────────────────────
const heading = document.querySelector("h1");             // first match, or null
const cards   = document.querySelectorAll(".card");        // NodeList of ALL matches
const byId    = document.getElementById("app");            // fastest, id only

// ── Reading vs writing text/HTML ──────────────────────────────────
heading.textContent;                  // "Hello World"              — raw text only
heading.innerHTML;                    // "<span>Hello</span> World" — HTML markup

heading.textContent = "New Title";        // safe — any HTML you pass is escaped as text
heading.innerHTML   = "<em>New</em> Title"; // renders as HTML — DANGEROUS with user input

// Never do this with untrusted data — it's a classic XSS vector:
// comment.innerHTML = userSuppliedText;   // attacker could inject <img onerror=...>
comment.textContent = userSuppliedText;    // safe — always shown as plain text, never executed

// ── Classes, attributes & inline styles ───────────────────────────
heading.classList.add("highlight");
heading.classList.remove("highlight");
heading.classList.toggle("active");        // adds if absent, removes if present
heading.classList.contains("active");      // true / false

const img = document.querySelector("img");
img.setAttribute("data-id", "42");
img.getAttribute("data-id");               // "42"
img.removeAttribute("alt");

heading.style.color    = "red";            // inline style — fine for runtime-computed values
heading.style.fontSize = "2rem";           // prefer classList for static styling

// ── Creating and inserting new elements ───────────────────────────
const li = document.createElement("li");
li.textContent = "New item";
li.classList.add("list-item");

const list = document.querySelector("ul");
list.appendChild(li);                      // insert as the last child
list.append("plain text works here too");  // modern — accepts elements AND strings
list.prepend(li);                          // insert as the first child

li.remove();                               // remove an element directly, no parent lookup needed`,
      },
      keyTakeaways: [
        { en: "`querySelector` returns the first match (or `null`) and `querySelectorAll` returns every match as a static list; both accept any CSS selector, unlike `getElementById`, which only matches by id.", np: "`querySelector` ले पहिलो match (वा `null`) फर्काउँछ र `querySelectorAll` ले सबै matches को static list फर्काउँछ; दुवैले कुनै पनि CSS selector accept गर्छन्, `getElementById` भन्दा फरक जसले केवल id ले match गर्छ।", jp: "`querySelector`は最初の一致（または`null`）を返し、`querySelectorAll`はすべての一致を静的なリストで返す。どちらも任意のCSSセレクタを受け付けるが、`getElementById`はidでのみ一致する。" },
        { en: "`textContent` is safe for untrusted text (it escapes HTML); `innerHTML` parses real markup, so assigning user-supplied strings to it is a classic XSS vector — use `textContent` or `createElement` instead.", np: "`textContent` untrusted text का लागि safe छ (HTML escape गर्छ); `innerHTML` ले actual markup parse गर्छ, त्यसैले user-supplied strings लाई assign गर्नु classic XSS vector हो — यसको सट्टा `textContent` वा `createElement` प्रयोग गर्नुहोस्।", jp: "`textContent`は信頼できないテキストに対して安全（HTMLをエスケープする）。`innerHTML`は実際のマークアップを解析するため、ユーザー入力を代入するのは典型的なXSSベクターとなる — 代わりに`textContent`か`createElement`を使う。" },
        { en: "`classList.add/remove/toggle` is the preferred way to change appearance (styling stays in CSS); `createElement` plus `appendChild`/`append` is how brand-new elements get inserted into the live DOM.", np: "`classList.add/remove/toggle` appearance बदल्ने preferred तरिका हो (styling CSS मा नै रहन्छ); `createElement` र `appendChild`/`append` ले नयाँ elements लाई live DOM मा insert गर्छ।", jp: "`classList.add/remove/toggle`は見た目を変える推奨方法（スタイリングはCSS側に保てる）。`createElement`と`appendChild`/`append`で新しい要素をライブDOMに挿入する。" },
      ],
      commonMistakes: [
        { en: "Assigning untrusted or user-generated content to `innerHTML` instead of `textContent`, opening an XSS hole.", np: "Untrusted वा user-generated content लाई `textContent` को सट्टा `innerHTML` मा assign गर्नु, XSS hole खोल्नु।", jp: "信頼できない、あるいはユーザー生成コンテンツを`textContent`ではなく`innerHTML`に代入し、XSSの穴を開けること。" },
        { en: "Forgetting `querySelectorAll` returns a NodeList, not a single element, and trying to call element methods on it directly instead of looping with `forEach`.", np: "`querySelectorAll` ले single element होइन, NodeList फर्काउँछ भनेर बिर्सनु, र `forEach` ले loop गर्नुको सट्टा त्यसमा directly element methods call गर्ने प्रयास गर्नु।", jp: "`querySelectorAll`が単一要素ではなくNodeListを返すことを忘れ、`forEach`でループする代わりにそれに直接要素のメソッドを呼び出そうとすること。" },
        { en: "Building a new element with `createElement` but forgetting to `appendChild`/`append` it into the DOM — it exists in memory but never appears on the page.", np: "`createElement` ले नयाँ element बनाउने तर DOM मा `appendChild`/`append` गर्न बिर्सनु — यो memory मा हुन्छ तर page मा कहिल्यै देखिँदैन।", jp: "`createElement`で新しい要素を作ったが、DOMに`appendChild`/`append`するのを忘れること — メモリ上には存在するがページには決して表示されない。" },
      ],
      quiz: [
        {
          question: { en: "What does `document.querySelector(\".missing\")` return if no element matches?", np: "कुनै पनि element match नभएमा `document.querySelector(\".missing\")` ले के फर्काउँछ?", jp: "一致する要素がない場合、`document.querySelector(\".missing\")`は何を返す？" },
          options: [
            { en: "`null`", np: "`null`", jp: "`null`" },
            { en: "It throws an error", np: "यसले error throw गर्छ", jp: "エラーをスローする" },
          ],
          correctIndex: 0,
          explanation: { en: "querySelector returns null rather than throwing when nothing matches, so you should always check before using the result.", np: "querySelector ले कुनै match नभएमा throw नगरी null फर्काउँछ, त्यसैले result प्रयोग गर्नु अघि जाँच गर्नुपर्छ।", jp: "querySelectorは何も一致しない場合、エラーをスローせずnullを返す。使う前に必ずチェックすべき。" },
        },
        {
          question: { en: "Which property is safe to assign untrusted, user-supplied text to?", np: "Untrusted, user-supplied text assign गर्न कुन property safe छ?", jp: "信頼できないユーザー入力のテキストを代入するのに安全なプロパティはどちら？" },
          options: [
            { en: "`textContent`", np: "`textContent`", jp: "`textContent`" },
            { en: "`innerHTML`", np: "`innerHTML`", jp: "`innerHTML`" },
          ],
          correctIndex: 0,
          explanation: { en: "textContent always escapes what it's given and displays it as plain text; innerHTML parses it as real markup, opening an XSS risk.", np: "textContent ले जे दिए पनि escape गरेर plain text को रूपमा देखाउँछ; innerHTML ले actual markup को रूपमा parse गर्छ, XSS risk खोल्छ।", jp: "textContentは渡されたものを常にエスケープしプレーンテキストとして表示する。innerHTMLは実際のマークアップとして解析し、XSSのリスクを開く。" },
        },
        {
          question: { en: "If an element already has the class `\"active\"`, what does `classList.toggle(\"active\")` do?", np: "Element मा पहिले नै `\"active\"` class छ भने, `classList.toggle(\"active\")` ले के गर्छ?", jp: "要素にすでに`\"active\"`クラスがある場合、`classList.toggle(\"active\")`は何をする？" },
          options: [
            { en: "Removes the class", np: "Class हटाउँछ", jp: "クラスを削除する" },
            { en: "Adds a duplicate copy of the class", np: "Class को duplicate copy थप्छ", jp: "クラスの重複コピーを追加する" },
          ],
          correctIndex: 0,
          explanation: { en: "toggle() flips the class's presence — adds it if absent, removes it if present, and classes can't be duplicated anyway.", np: "toggle() ले class को presence flip गर्छ — नभए थप्छ, भए हटाउँछ, र classes जहिल्यै पनि duplicate हुन सक्दैनन्।", jp: "toggle()はクラスの有無を反転する — なければ追加、あれば削除。クラスはそもそも重複できない。" },
        },
      ],
    },
    {
      id: "events-addeventlistener",
      title: { en: "Events & addEventListener", np: "Events र addEventListener", jp: "イベントとaddEventListener" },
      durationMinutes: 9,
      explanation: {
        en: "`element.addEventListener(type, handler)` attaches a function that runs whenever an event of that `type` fires on the element, and multiple listeners can be attached to the same event without overwriting each other (unlike the older `onclick = fn` style). To later remove one with `removeEventListener(type, handler)`, you must pass the exact <b>same function reference</b> you registered — a new anonymous arrow function that merely looks the same will not match, so listeners you intend to remove later must be a named function stored in a variable.\n\nEvery handler receives an `event` object describing what happened. `event.target` is the actual element the event originated on (the one the user clicked or typed into), while `event.currentTarget` is the element the listener itself is attached to — they differ whenever the event bubbled up from a descendant. Two methods control the event's effect on the rest of the page: `event.preventDefault()` cancels the browser's default behaviour for that event (a form's automatic page reload on submit, a link's navigation), and `event.stopPropagation()` stops the event from continuing to bubble up to ancestor elements — these solve different problems and are not interchangeable.",
        np: "`element.addEventListener(type, handler)` ले त्यो `type` को event element मा fire हुँदा चल्ने function attach गर्छ, र same event मा multiple listeners overwrite नभई attach हुन सक्छन् (पुरानो `onclick = fn` भन्दा फरक)। पछि `removeEventListener(type, handler)` ले remove गर्न, register गरेकै <b>same function reference</b> pass गर्नुपर्छ — same देखिने नयाँ anonymous arrow function ले match गर्दैन, त्यसैले पछि remove गर्नुपर्ने listeners variable मा named function को रूपमा राख्नुपर्छ।\n\nहरेक handler ले के भयो भन्ने बताउने `event` object पाउँछ। `event.target` वास्तवमा event originate भएको element हो (user ले click/type गरेको), जबकि `event.currentTarget` listener attach भएको element हो — event bubble भएमा दुवै फरक हुन्छन्। `event.preventDefault()` ले browser को default behaviour cancel गर्छ (form submit को page reload, link को navigation), र `event.stopPropagation()` ले event लाई ancestor elements सम्म bubble हुन रोक्छ — यी दुई फरक समस्या solve गर्छन्, interchangeable होइनन्।",
        jp: "`element.addEventListener(type, handler)`はそのtypeのイベントが要素上で発生するたびに実行される関数をアタッチし、同じイベントに複数のリスナーを（古い`onclick = fn`方式と違い）上書きせずに追加できる。後で`removeEventListener(type, handler)`で削除するには、登録したのと全く同じ<b>関数の参照</b>を渡す必要がある — 見た目が同じでも新しい匿名アロー関数では一致しないため、後で削除する予定のリスナーは変数に保存した名前付き関数にする。\n\n各ハンドラは何が起きたかを記述する`event`オブジェクトを受け取る。`event.target`はイベントが実際に発生した要素（ユーザーがクリック/入力した要素）、`event.currentTarget`はリスナー自身がアタッチされた要素 — イベントが子孫からバブリングした場合は両者が異なる。`event.preventDefault()`はブラウザのデフォルト動作をキャンセルし（フォーム送信時の自動ページリロード、リンクのナビゲーション）、`event.stopPropagation()`はイベントが祖先要素へバブリングし続けるのを止める — これらは異なる問題を解決するもので、置き換え可能ではない。",
      },
      diagram: `btn.addEventListener("click", handleClick);   ← registers handleClick

  User clicks <button> ──────────► event fires
                                     │
                                     ▼
                           handleClick(event)
                             event.target           → element actually clicked
                             event.currentTarget     → element the listener is on
                             event.preventDefault()  → cancel default browser action
                             event.stopPropagation() → stop bubbling to ancestors

btn.removeEventListener("click", handleClick);   ✔ same reference — removes it
btn.removeEventListener("click", () => {});      ✘ different function — does nothing`,
      codeExample: {
        title: { en: "addEventListener, the event object, and safe removal", np: "addEventListener, event object, safe removal", jp: "addEventListener・イベントオブジェクト・安全な削除" },
        code: `// ── Adding a listener ─────────────────────────────────────────────
const btn = document.querySelector("#submit-btn");

function handleClick(event) {
  console.log("Clicked:", event.type);                 // "click"
  console.log("target:", event.target);                // element the user actually clicked
  console.log("currentTarget:", event.currentTarget);   // element the listener is attached to
}

btn.addEventListener("click", handleClick);

// ── Removing a listener — MUST pass the same function reference ──
btn.removeEventListener("click", handleClick);        // removes it — same reference
// btn.removeEventListener("click", () => { ... });   // no-op — different function object

// This is why "removable" listeners can't be anonymous inline arrows:
// btn.addEventListener("click", () => console.log("hi")); // can never be removed later!

// ── preventDefault vs stopPropagation ─────────────────────────────
const form = document.querySelector("#signup-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();      // stop the browser's default page reload on submit
  // ... validate and submit via fetch() instead
});

document.querySelector("#outer").addEventListener("click", (event) => {
  event.stopPropagation();     // stop this click from bubbling up to ancestors
  console.log("only this handler runs, ancestors never see the click");
});

// ── Common event types ─────────────────────────────────────────────
element.addEventListener("click",   handler);
element.addEventListener("input",   handler);   // fires on every keystroke
element.addEventListener("change",  handler);   // fires when value is committed (blur/select)
element.addEventListener("keydown", (event) => {
  console.log(event.key);      // "Enter", "a", "Escape"
  if (event.key === "Escape") closeModal();
});`,
      },
      keyTakeaways: [
        { en: "`addEventListener` lets you attach multiple listeners to the same event on the same element, unlike the old `onclick = fn` style, which overwrites the previous handler.", np: "`addEventListener` ले same element को same event मा multiple listeners attach गर्न दिन्छ, पुरानो `onclick = fn` style भन्दा फरक जसले अघिल्लो handler overwrite गर्छ।", jp: "`addEventListener`は同じ要素の同じイベントに複数のリスナーをアタッチできる。前のハンドラを上書きする古い`onclick = fn`方式とは異なる。" },
        { en: "`removeEventListener` only works if you pass the exact same function reference used in `addEventListener` — anonymous inline functions can never be removed later.", np: "`removeEventListener` ले `addEventListener` मा प्रयोग गरेकै exact same function reference pass गरे मात्र काम गर्छ — anonymous inline functions पछि कहिल्यै remove हुन सक्दैनन्।", jp: "`removeEventListener`は`addEventListener`で使ったのと全く同じ関数の参照を渡した場合にのみ機能する — 匿名のインライン関数は後で削除できない。" },
        { en: "`preventDefault()` cancels the browser's default action; `stopPropagation()` stops bubbling to ancestors — they solve different problems and neither implies the other.", np: "`preventDefault()` ले browser को default action cancel गर्छ; `stopPropagation()` ले ancestors सम्म bubbling रोक्छ — यी दुई फरक समस्या solve गर्छन्, एउटाले अर्कोलाई implies गर्दैन।", jp: "`preventDefault()`はブラウザのデフォルト動作をキャンセルし、`stopPropagation()`は祖先へのバブリングを止める — これらは異なる問題を解決するもので、一方が他方を意味しない。" },
      ],
      commonMistakes: [
        { en: "Passing a new anonymous arrow function to `removeEventListener`, expecting it to remove a previously-added listener that merely looks the same.", np: "`removeEventListener` मा नयाँ anonymous arrow function pass गरेर, केवल same देखिने पहिले थपिएको listener remove हुन्छ भन्ने आशा गर्नु।", jp: "`removeEventListener`に新しい匿名アロー関数を渡し、見た目が同じというだけで以前追加したリスナーが削除されると期待すること。" },
        { en: "Confusing `event.target` (where the event started) with `event.currentTarget` (where the listener is attached), especially inside delegated handlers.", np: "`event.target` (event सुरु भएको ठाउँ) र `event.currentTarget` (listener attach भएको ठाउँ) लाई भ्रमित गर्नु, विशेष गरी delegated handlers भित्र।", jp: "`event.target`（イベントが開始した場所）と`event.currentTarget`（リスナーがアタッチされている場所）を混同すること。特に委譲ハンドラ内で。" },
        { en: "Calling `stopPropagation()` when the actual goal was `preventDefault()` (or vice versa) — the two methods don't stop the same thing.", np: "वास्तविक लक्ष्य `preventDefault()` भएको बेला `stopPropagation()` call गर्नु (वा उल्टो) — यी दुई methods ले उही कुरा रोक्दैनन्।", jp: "本来の目的が`preventDefault()`だったのに`stopPropagation()`を呼ぶこと（またはその逆）— この2つのメソッドは同じものを止めるわけではない。" },
      ],
      quiz: [
        {
          question: { en: "To remove a listener with `removeEventListener`, what must you pass as the handler?", np: "`removeEventListener` ले listener remove गर्न handler को रूपमा के pass गर्नुपर्छ?", jp: "`removeEventListener`でリスナーを削除するには、ハンドラとして何を渡す必要がある？" },
          options: [
            { en: "The exact same function reference used in addEventListener", np: "addEventListener मा प्रयोग गरेकै exact same function reference", jp: "addEventListenerで使ったのと全く同じ関数の参照" },
            { en: "Any function containing identical code", np: "उस्तै code भएको जुनसुकै function", jp: "同一のコードを含む任意の関数" },
          ],
          correctIndex: 0,
          explanation: { en: "removeEventListener compares function identity, not behaviour — a lookalike function that isn't the same reference will not match.", np: "removeEventListener ले function identity compare गर्छ, behaviour होइन — same नभएको function match हुँदैन।", jp: "removeEventListenerは関数の同一性を比較する。振る舞いではない — 見た目が同じでも参照が異なれば一致しない。" },
        },
        {
          question: { en: "What does `event.preventDefault()` do?", np: "`event.preventDefault()` ले के गर्छ?", jp: "`event.preventDefault()`は何をする？" },
          options: [
            { en: "Stops the browser's default action for that event", np: "त्यो event को browser को default action रोक्छ", jp: "そのイベントに対するブラウザのデフォルト動作を止める" },
            { en: "Stops the event from bubbling to ancestor elements", np: "Event लाई ancestor elements सम्म bubble हुनबाट रोक्छ", jp: "イベントが祖先要素へバブリングするのを止める" },
          ],
          correctIndex: 0,
          explanation: { en: "preventDefault cancels the browser's built-in behaviour (like a form submit reloading the page); stopPropagation is the one that stops bubbling.", np: "preventDefault ले browser को built-in behaviour cancel गर्छ (जस्तै form submit को page reload); bubbling रोक्ने त stopPropagation हो।", jp: "preventDefaultはブラウザ組み込みの動作（フォーム送信によるページリロードなど）をキャンセルする。バブリングを止めるのはstopPropagationの方。" },
        },
        {
          question: { en: "Inside a listener attached to a parent element, what does `event.currentTarget` refer to?", np: "Parent element मा attach भएको listener भित्र, `event.currentTarget` ले केलाई refer गर्छ?", jp: "親要素にアタッチされたリスナー内で、`event.currentTarget`は何を指す？" },
          options: [
            { en: "The parent element the listener is attached to", np: "Listener attach भएको parent element", jp: "リスナーがアタッチされている親要素" },
            { en: "The exact child element that was clicked", np: "वास्तवमा click भएको exact child element", jp: "実際にクリックされた子要素" },
          ],
          correctIndex: 0,
          explanation: { en: "currentTarget always stays fixed as the element the handler is attached to; the clicked child is event.target instead.", np: "currentTarget सधैं handler attach भएको element नै रहन्छ; click भएको child भने event.target हो।", jp: "currentTargetは常にハンドラがアタッチされた要素のままである。クリックされた子要素はevent.targetの方。" },
        },
      ],
    },
    {
      id: "event-bubbling-delegation",
      title: { en: "Event Bubbling, Capturing & Delegation", np: "Event Bubbling, Capturing र Delegation", jp: "イベントバブリング・キャプチャリング・委譲" },
      durationMinutes: 9,
      explanation: {
        en: "When an event fires on a nested element, it travels through the DOM tree in two phases: first <b>capturing</b> — from the root document down to the target — then <b>bubbling</b> — back up from the target through every ancestor to the root. Most events bubble (`click`, `input`, `submit`); a few don't (`focus`, `blur`, `mouseenter`/`mouseleave`). `addEventListener` listens in the bubble phase by default; passing `true` (or `{ capture: true }`) as a third argument switches it to the capture phase instead, so ancestor listeners fire before the target's own listener.\n\n<b>Event delegation</b> exploits bubbling: instead of attaching a listener to every individual child (expensive in memory, and blind to children added later), you attach one listener to a shared ancestor and inspect `event.target` inside it to figure out which child was actually interacted with. `element.closest(selector)` is the standard tool for this — it walks up from `event.target` and returns the nearest ancestor (or the element itself) matching the selector, correctly handling clicks that land on a child of the item you actually care about, such as an icon inside a button.",
        np: "Nested element मा event fire हुँदा, यो DOM tree मा दुई phases मा यात्रा गर्छ: पहिले <b>capturing</b> — root document बाट target सम्म down — त्यसपछि <b>bubbling</b> — target बाट प्रत्येक ancestor हुँदै root सम्म फेरि माथि। अधिकांश events bubble हुन्छन् (`click`, `input`, `submit`); केही हुँदैनन् (`focus`, `blur`, `mouseenter`/`mouseleave`)। `addEventListener` ले default रूपमा bubble phase मा listen गर्छ; तेस्रो argument को रूपमा `true` (वा `{ capture: true }`) pass गर्दा capture phase मा switch हुन्छ, जसले गर्दा ancestor listeners target को आफ्नै listener भन्दा पहिले fire हुन्छन्।\n\n<b>Event delegation</b> ले bubbling को फाइदा उठाउँछ: हरेक individual child मा listener attach गर्नुको सट्टा (memory मा महँगो, र पछि थपिएका children लाई अनदेखा), एउटा shared ancestor मा एउटै listener attach गरी त्यसभित्र `event.target` जाँचेर वास्तवमा कुन child सँग interact भयो पत्ता लगाइन्छ। `element.closest(selector)` यसको standard tool हो — यसले `event.target` बाट माथि walk गर्छ र selector match गर्ने nearest ancestor (वा element आफैं) फर्काउँछ, जसले वास्तविक interested item को child (जस्तै button भित्रको icon) मा click परे पनि सहि handle गर्छ।",
        jp: "ネストされた要素でイベントが発生すると、DOMツリーを2つのフェーズで移動する。まず<b>キャプチャリング</b> — ルートドキュメントからターゲットへ下降し、次に<b>バブリング</b> — ターゲットから各祖先を通ってルートへ再び上昇する。ほとんどのイベントはバブリングする（`click`・`input`・`submit`）。一部はしない（`focus`・`blur`・`mouseenter`/`mouseleave`）。`addEventListener`はデフォルトでバブルフェーズをリスニングする。第3引数に`true`（または`{ capture: true }`）を渡すとキャプチャフェーズに切り替わり、祖先のリスナーがターゲット自身のリスナーより先に発火する。\n\n<b>イベント委譲</b>はバブリングを利用する — 個々の子要素すべてにリスナーをつける代わりに（メモリコストが高く、後で追加された子要素に気づけない）、共通の祖先に1つのリスナーをつけ、その中で`event.target`を調べて実際に操作された子要素を特定する。`element.closest(selector)`はこのための標準的な手段で、`event.target`から上にたどりセレクタに一致する最も近い祖先（または要素自身）を返す。これにより、本来関心のある項目の子要素（ボタン内のアイコンなど）でクリックが発生した場合も正しく処理できる。",
      },
      diagram: `        <div id="outer">                  3. outer   ▲ bubble phase (UP)
          <div id="inner">                2. inner   │  fires: btn → inner → outer
            <button id="btn">click me</button>  1. btn  ← event STARTS here (target)
          </div>
        </div>

capture phase (DOWN, top→bottom, opt-in with true):  outer → inner → btn
bubble  phase (UP,   bottom→top, DEFAULT):            btn → inner → outer

Event delegation:
  <ul id="list">                    ← ONE listener attached HERE
    <li class="item">Apple</li>     ← click bubbles up from any <li>
    <li class="item">Banana</li>    ← including items added LATER
  </ul>
  list.addEventListener("click", e => {
    const item = e.target.closest(".item");   // find which <li> was actually clicked
    if (item) handleClick(item);
  });`,
      codeExample: {
        title: { en: "Bubbling, capturing and event delegation", np: "Bubbling, capturing र event delegation", jp: "バブリング・キャプチャリング・イベント委譲" },
        code: `// ── Bubbling — events travel UP from target to ancestors ─────────
// <div id="outer"><div id="inner"><button id="btn">Click</button></div></div>

document.querySelector("#outer").addEventListener("click", () => console.log("outer"));
document.querySelector("#inner").addEventListener("click", () => console.log("inner"));
document.querySelector("#btn").addEventListener("click",   () => console.log("btn"));

// Clicking the button logs, in order: "btn" -> "inner" -> "outer" (target first, then up)

// ── stopPropagation() — cut the bubble short ──────────────────────
document.querySelector("#btn").addEventListener("click", (event) => {
  event.stopPropagation();     // "inner" and "outer" handlers will NOT run
  console.log("btn only");
});

// ── Capture phase — listen on the way DOWN instead ────────────────
document.querySelector("#outer").addEventListener(
  "click",
  () => console.log("outer (capture)"),
  true                          // 3rd arg true = { capture: true }
);
// Now "outer (capture)" logs BEFORE the bubble-phase handlers fire

// ── Event delegation — one listener for many (and future) children ──
// Naive — a listener per row; 1000 rows = 1000 listeners, and misses new rows
document.querySelectorAll(".todo-item").forEach((item) => {
  item.addEventListener("click", handleTodoClick);
});

// Delegation — one listener on the stable parent
const list = document.querySelector("#todo-list");

list.addEventListener("click", (event) => {
  const item = event.target.closest(".todo-item"); // handles clicks on nested icons/text too
  if (!item) return;                                // click was outside any todo item

  const id = item.dataset.id;
  handleTodoClick(id);
});

// Delegation still works for items added AFTER this listener was set up:
const newItem = document.createElement("li");
newItem.className = "todo-item";
newItem.dataset.id = "99";
list.appendChild(newItem);   // clicking it triggers the delegated handler above — no new listener needed`,
      },
      keyTakeaways: [
        { en: "Events travel down (capture) then up (bubble); `addEventListener` listens on the bubble phase by default, and most events bubble except a few like `focus`/`blur`.", np: "Events पहिले down जान्छन् (capture) त्यसपछि up (bubble); `addEventListener` ले default रूपमा bubble phase मा listen गर्छ, र `focus`/`blur` जस्ता केही बाहेक अधिकांश events bubble हुन्छन्।", jp: "イベントはまず下降（キャプチャ）し、次に上昇（バブル）する。`addEventListener`はデフォルトでバブルフェーズをリスニングし、`focus`/`blur`など一部を除きほとんどのイベントがバブリングする。" },
        { en: "Event delegation attaches one listener to a shared parent instead of one per child, saving memory and automatically covering elements added to the DOM later.", np: "Event delegation ले हरेक child मा एउटा-एउटा को सट्टा एउटा shared parent मा एउटै listener attach गर्छ, memory बचाउँछ र पछि DOM मा थपिएका elements पनि automatic रूपमा cover गर्छ।", jp: "イベント委譲は子要素ごとに1つずつではなく、共有の親に1つのリスナーをアタッチする。メモリを節約し、後でDOMに追加された要素も自動的にカバーする。" },
        { en: "`element.closest(selector)` inside a delegated handler finds the right ancestor matching a class even when `event.target` is a nested child of that element.", np: "Delegated handler भित्र `element.closest(selector)` ले `event.target` त्यो element को nested child भए पनि class match गर्ने सही ancestor फेला पार्छ।", jp: "委譲ハンドラ内の`element.closest(selector)`は、`event.target`がその要素のネストされた子であっても、クラスに一致する正しい祖先を見つける。" },
      ],
      commonMistakes: [
        { en: "Attaching a separate listener to every list item instead of delegating to the parent, wasting memory and silently missing items added after page load.", np: "Parent मा delegate गर्नुको सट्टा हरेक list item मा छुट्टै listener attach गर्नु, memory खेर फाल्नु र page load पछि थपिएका items silently miss गर्नु।", jp: "親に委譲せず各リストアイテムに個別のリスナーをアタッチすること。メモリを無駄にし、ページ読み込み後に追加されたアイテムを黙って見逃す。" },
        { en: "Using `event.target` directly in a delegated handler without `closest()`, breaking when the click lands on a nested child like an icon inside the row.", np: "`closest()` बिना delegated handler मा `event.target` directly प्रयोग गर्नु, click row भित्रको icon जस्तो nested child मा परेमा break हुनु।", jp: "`closest()`なしで委譲ハンドラ内で`event.target`を直接使うこと。クリックが行内のアイコンのようなネストされた子要素に当たると壊れる。" },
        { en: "Assuming `stopPropagation()` also prevents the default browser action (or vice versa with `preventDefault()`) — the two methods control unrelated things.", np: "`stopPropagation()` ले default browser action पनि रोक्छ भन्ने ठान्नु (वा उल्टो `preventDefault()` सँग) — यी दुई methods ले असंबंधित कुरा control गर्छन्।", jp: "`stopPropagation()`がデフォルトのブラウザ動作も阻止する（またはその逆で`preventDefault()`）と思い込むこと — この2つのメソッドは無関係のものを制御する。" },
      ],
      quiz: [
        {
          question: { en: "When the innermost `<button>` in a nested structure is clicked, in what order do bubble-phase listeners on btn, inner, and outer fire?", np: "Nested structure मा सबैभन्दा भित्री `<button>` click हुँदा, btn, inner, र outer मा bubble-phase listeners कुन क्रममा fire हुन्छन्?", jp: "ネストされた構造の最も内側の`<button>`がクリックされたとき、btn・inner・outerのバブルフェーズのリスナーはどの順で発火する？" },
          options: [
            { en: "Target first, then up through ancestors: btn, inner, outer", np: "पहिले target, त्यसपछि ancestors हुँदै माथि: btn, inner, outer", jp: "まずターゲット、次に祖先へ: btn、inner、outerの順" },
            { en: "Ancestors first, then down to the target: outer, inner, btn", np: "पहिले ancestors, त्यसपछि target सम्म तल: outer, inner, btn", jp: "まず祖先、次にターゲットへ: outer、inner、btnの順" },
          ],
          correctIndex: 0,
          explanation: { en: "The bubble phase starts at the exact target and travels upward, so the deepest element's listener always fires first.", np: "Bubble phase exact target बाट सुरु भई माथि जान्छ, त्यसैले सबैभन्दा गहिरो element को listener सधैं पहिले fire हुन्छ।", jp: "バブルフェーズは正確なターゲットから始まり上へ進むため、最も深い要素のリスナーが常に最初に発火する。" },
        },
        {
          question: { en: "What is the main advantage of event delegation over attaching a listener to every child?", np: "हरेक child मा listener attach गर्नु भन्दा event delegation को मुख्य फाइदा के हो?", jp: "すべての子要素にリスナーをアタッチするより、イベント委譲の主な利点は何？" },
          options: [
            { en: "One listener also automatically handles children added to the DOM later", np: "एउटै listener ले पछि DOM मा थपिएका children पनि automatic रूपमा handle गर्छ", jp: "1つのリスナーが後でDOMに追加された子要素も自動的に処理する" },
            { en: "It makes the click event fire faster", np: "यसले click event छिटो fire गराउँछ", jp: "クリックイベントをより速く発火させる" },
          ],
          correctIndex: 0,
          explanation: { en: "Because the listener sits on a stable ancestor and relies on bubbling, it keeps working for elements that don't exist yet at setup time.", np: "Listener स्थिर ancestor मा रहने र bubbling मा भर पर्ने भएकाले, setup समयमा नभएका elements का लागि पनि यसले काम गरिरहन्छ।", jp: "リスナーは安定した祖先に置かれバブリングに依存するため、セットアップ時点でまだ存在しない要素に対しても機能し続ける。" },
        },
        {
          question: { en: "Why use `element.closest(selector)` inside a delegated click handler instead of comparing `event.target` directly?", np: "Delegated click handler भित्र `event.target` directly compare गर्नुको सट्टा `element.closest(selector)` किन प्रयोग गर्ने?", jp: "委譲されたクリックハンドラ内で`event.target`を直接比較する代わりに`element.closest(selector)`を使う理由は？" },
          options: [
            { en: "Because the actual click target might be a nested child of the element you care about", np: "किनकि actual click target तपाईंलाई चासो भएको element को nested child हुन सक्छ", jp: "実際のクリックターゲットが、関心のある要素のネストされた子である可能性があるため" },
            { en: "Because closest() runs faster than querySelector()", np: "किनकि closest() ले querySelector() भन्दा छिटो चल्छ", jp: "closest()がquerySelector()より高速に実行されるため" },
          ],
          correctIndex: 0,
          explanation: { en: "closest() walks up from the exact click point to find the nearest matching ancestor, correctly handling clicks on nested icons or text inside the item.", np: "closest() ले exact click point बाट माथि walk गरी nearest matching ancestor फेला पार्छ, item भित्रको nested icon वा text मा click परे पनि सहि handle गर्छ।", jp: "closest()は正確なクリック位置から上にたどり、最も近い一致する祖先を見つける。アイテム内のネストされたアイコンやテキストへのクリックも正しく処理する。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "Does `querySelectorAll` return the first match or every match?", np: "`querySelectorAll` ले पहिलो match फर्काउँछ कि सबै matches?", jp: "`querySelectorAll`は最初の一致を返す、それともすべての一致？" },
      options: [{ en: "Every match, as a static list", np: "सबै matches, static list को रूपमा", jp: "すべての一致を静的なリストで" }, { en: "Only the first match", np: "केवल पहिलो match", jp: "最初の一致のみ" }],
      correctIndex: 0,
      explanation: { en: "querySelectorAll always returns a static NodeList of every matching element; use querySelector for just the first.", np: "querySelectorAll ले सधैं सबै matching elements को static NodeList फर्काउँछ; पहिलो मात्र चाहिएमा querySelector प्रयोग गर्नुहोस्।", jp: "querySelectorAllは常にすべての一致要素の静的なNodeListを返す。最初の1つだけならquerySelectorを使う。" },
    },
    {
      question: { en: "Which is safe to set with untrusted user input: `textContent` or `innerHTML`?", np: "Untrusted user input set गर्न कुन safe छ: `textContent` कि `innerHTML`?", jp: "信頼できないユーザー入力を設定するのに安全なのは`textContent`と`innerHTML`のどちら？" },
      options: [{ en: "textContent", np: "textContent", jp: "textContent" }, { en: "innerHTML", np: "innerHTML", jp: "innerHTML" }],
      correctIndex: 0,
      explanation: { en: "textContent always escapes and displays plain text; innerHTML parses real markup, which is an XSS risk with untrusted input.", np: "textContent ले सधैं escape गरेर plain text देखाउँछ; innerHTML ले actual markup parse गर्छ, untrusted input सँग XSS risk हुन्छ।", jp: "textContentは常にエスケープしプレーンテキストとして表示する。innerHTMLは実際のマークアップを解析するため、信頼できない入力でXSSリスクとなる。" },
    },
    {
      question: { en: "What happens if you call `classList.toggle(\"active\")` on an element that already has the `\"active\"` class?", np: "पहिले नै `\"active\"` class भएको element मा `classList.toggle(\"active\")` call गर्दा के हुन्छ?", jp: "すでに`\"active\"`クラスがある要素で`classList.toggle(\"active\")`を呼ぶとどうなる？" },
      options: [{ en: "The class is removed", np: "Class हटिन्छ", jp: "クラスが削除される" }, { en: "Nothing changes", np: "केही परिवर्तन हुँदैन", jp: "何も変わらない" }],
      correctIndex: 0,
      explanation: { en: "toggle() flips presence — it removes the class if it's already there.", np: "toggle() ले presence flip गर्छ — पहिले नै भए हटाउँछ।", jp: "toggle()は存在を反転する — すでにあれば削除する。" },
    },
    {
      question: { en: "What must you pass to `removeEventListener` for it to actually remove a listener?", np: "`removeEventListener` ले वास्तवमा listener remove गर्न के pass गर्नुपर्छ?", jp: "`removeEventListener`が実際にリスナーを削除するために何を渡す必要がある？" },
      options: [{ en: "The exact same function reference used in addEventListener", np: "addEventListener मा प्रयोग गरेकै exact same function reference", jp: "addEventListenerで使ったのと全く同じ関数の参照" }, { en: "A new function with the same code", np: "उस्तै code भएको नयाँ function", jp: "同じコードを持つ新しい関数" }],
      correctIndex: 0,
      explanation: { en: "removeEventListener matches by function identity, not by behaviour.", np: "removeEventListener ले function identity ले match गर्छ, behaviour ले होइन।", jp: "removeEventListenerは振る舞いではなく関数の同一性で一致させる。" },
    },
    {
      question: { en: "In a listener attached to a parent, what does `event.target` refer to versus `event.currentTarget`?", np: "Parent मा attach भएको listener मा, `event.target` ले `event.currentTarget` भन्दा फरक के लाई refer गर्छ?", jp: "親にアタッチされたリスナーにおいて、`event.target`は`event.currentTarget`と対比して何を指す？" },
      options: [{ en: "target = element actually interacted with; currentTarget = element the listener is on", np: "target = वास्तवमा interact भएको element; currentTarget = listener भएको element", jp: "target = 実際に操作された要素、currentTarget = リスナーがある要素" }, { en: "They always refer to the same element", np: "दुवैले सधैं उही element लाई refer गर्छन्", jp: "常に同じ要素を指す" }],
      correctIndex: 0,
      explanation: { en: "target is the originating element; currentTarget stays fixed as the element the handler is attached to — they diverge whenever the event bubbled.", np: "target originate भएको element हो; currentTarget handler भएको element नै रहन्छ — event bubble भएमा दुवै फरक हुन्छन्।", jp: "targetはイベント発生元の要素、currentTargetはハンドラがアタッチされた要素のまま — イベントがバブリングすると両者は異なる。" },
    },
    {
      question: { en: "What does `event.stopPropagation()` do, as opposed to `event.preventDefault()`?", np: "`event.preventDefault()` को तुलनामा `event.stopPropagation()` ले के गर्छ?", jp: "`event.preventDefault()`とは対照的に、`event.stopPropagation()`は何をする？" },
      options: [{ en: "Stops the event bubbling further up to ancestor elements", np: "Event लाई ancestor elements सम्म थप bubble हुनबाट रोक्छ", jp: "イベントが祖先要素へさらにバブリングするのを止める" }, { en: "Cancels the browser's default action for the event", np: "Event को browser default action cancel गर्छ", jp: "イベントに対するブラウザのデフォルト動作をキャンセルする" }],
      correctIndex: 0,
      explanation: { en: "stopPropagation halts bubbling; preventDefault is the one that cancels default browser behaviour — they are not interchangeable.", np: "stopPropagation ले bubbling रोक्छ; default browser behaviour cancel गर्ने त preventDefault हो — यी interchangeable होइनन्।", jp: "stopPropagationはバブリングを止める。デフォルトのブラウザ動作をキャンセルするのはpreventDefaultの方 — 置き換え可能ではない。" },
    },
    {
      question: { en: "When a nested element is clicked, does the bubble phase fire from the target upward, or from the root downward?", np: "Nested element click हुँदा, bubble phase target बाट माथि fire हुन्छ कि root बाट तल?", jp: "ネストされた要素がクリックされたとき、バブルフェーズはターゲットから上へ発火するのか、ルートから下へなのか？" },
      options: [{ en: "From the target upward through its ancestors", np: "Target बाट यसका ancestors हुँदै माथि", jp: "ターゲットから祖先を通って上へ" }, { en: "From the root document downward to the target", np: "Root document बाट target सम्म तल", jp: "ルートドキュメントからターゲットへ下へ" }],
      correctIndex: 0,
      explanation: { en: "Bubbling travels upward from the exact target through every ancestor to the root; the downward pass is the separate capture phase.", np: "Bubbling exact target बाट प्रत्येक ancestor हुँदै root सम्म माथि जान्छ; तलतिरको pass छुट्टै capture phase हो।", jp: "バブリングは正確なターゲットから各祖先を通ってルートへ上に進む。下方向のパスは別のキャプチャフェーズ。" },
    },
    {
      question: { en: "What is the main benefit of event delegation for a list whose items are added dynamically?", np: "Items dynamically थपिने list का लागि event delegation को मुख्य फाइदा के हो?", jp: "アイテムが動的に追加されるリストにおけるイベント委譲の主な利点は？" },
      options: [{ en: "The single parent listener automatically covers items added after setup", np: "Single parent listener ले setup पछि थपिएका items लाई automatic रूपमा cover गर्छ", jp: "単一の親リスナーが設定後に追加されたアイテムも自動的にカバーする" }, { en: "It avoids the need for event objects entirely", np: "यसले event objects को आवश्यकता पूर्ण रूपमा हटाउँछ", jp: "イベントオブジェクトの必要性を完全になくす" }],
      correctIndex: 0,
      explanation: { en: "Because the listener relies on bubbling from a stable ancestor, it keeps working for children that didn't exist when it was set up.", np: "Listener स्थिर ancestor बाट bubbling मा भर पर्ने भएकाले, setup हुँदा नभएका children का लागि पनि यसले काम गर्न जारी राख्छ।", jp: "リスナーは安定した祖先からのバブリングに依存するため、設定時に存在しなかった子要素に対しても機能し続ける。" },
    },
    {
      question: { en: "Inside a delegated click handler, why is `event.target.closest(\".item\")` used instead of `event.target` alone?", np: "Delegated click handler भित्र, `event.target` मात्र को सट्टा `event.target.closest(\".item\")` किन प्रयोग हुन्छ?", jp: "委譲されたクリックハンドラ内で、`event.target`だけでなく`event.target.closest(\".item\")`が使われる理由は？" },
      options: [{ en: "The click might land on a nested child rather than the item itself", np: "Click item आफैंमा नभई nested child मा पर्न सक्छ", jp: "クリックがアイテム自体ではなくネストされた子要素に当たることがあるため" }, { en: "closest() is required syntax for all event handlers", np: "closest() सबै event handlers का लागि required syntax हो", jp: "closest()はすべてのイベントハンドラに必要な構文だから" }],
      correctIndex: 0,
      explanation: { en: "closest() walks up from the exact click point to find the nearest ancestor matching the selector, handling clicks on nested content correctly.", np: "closest() ले exact click point बाट माथि walk गरी selector match गर्ने nearest ancestor फेला पार्छ, nested content मा click परे पनि सहि handle गर्छ।", jp: "closest()は正確なクリック位置から上にたどり、セレクタに一致する最も近い祖先を見つけ、ネストされたコンテンツへのクリックも正しく処理する。" },
    },
  ],
};
