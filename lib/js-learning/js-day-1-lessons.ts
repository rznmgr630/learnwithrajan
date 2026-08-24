import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_1_LESSONS: JsLessonDay = {
  day: 1,
  title: { en: "Introduction, Advantages & How JavaScript Runs", np: "परिचय, फाइदा र JavaScript कसरी चल्छ", jp: "入門・利点・JavaScriptの動き方" },
  totalMinutes: 30,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "javascript-history",
      title: { en: "JavaScript: Advantages & Short History", np: "JavaScript: फाइदा र छोटो इतिहास", jp: "JavaScript: 利点と短い歴史" },
      durationMinutes: 9,
      explanation: {
        en: "### What is JavaScript?\n\n<b>JavaScript</b> (a programming language mainly used to make websites interactive) runs in browsers and can also run outside browsers using environments like Node.js.\n\nIt is used for:\n\n• Websites and web apps\n• Backend servers\n• Mobile apps\n• Desktop apps\n• APIs\n• Automation\n• Full-stack applications\n\n---\n\n## Short History of JavaScript\n\nJavaScript was created by <b>Brendan Eich</b> in <b>1995</b> while working at Netscape.\n\nThe original goal was simple: make web pages more interactive.\n\n### Timeline\n\n```text\n1995\n ↓\nJavaScript created by Brendan Eich\n ↓\n1996\n ↓\nMicrosoft creates JScript\n ↓\n1997\n ↓\nJavaScript standardized as ECMAScript\n ↓\n2009\n ↓\nNode.js brings JavaScript to the server\n ↓\n2015\n ↓\nES6 / ES2015 introduces major modern features\n ↓\nToday\n ↓\nJavaScript is used across the full stack\n```\n\nThe official standard is called <b>ECMAScript</b> (the specification that defines how JavaScript should work).\n\n---\n\n## Why Is JavaScript Popular?\n\n### 1. Runs in the Browser\n\nJavaScript is built into modern browsers.\n\n```javascript\nconsole.log(\"Hello\");\n```\n\nYou don't need to install a separate programming language just to run it in a browser.\n\n---\n\n### 2. Full-Stack Development\n\nWith <b>Node.js</b> (a runtime that lets JavaScript run outside the browser), you can use JavaScript for both frontend and backend.\n\n```text\nFrontend\nReact / Next.js\n       ↓\nJavaScript\n       ↓\nBackend\nNode.js\n       ↓\nDatabase\nPostgreSQL / MySQL\n```\n\nThis allows one language to be used across the application.\n\n---\n\n### 3. Huge Ecosystem\n\n<b>Ecosystem</b> (the collection of libraries, tools, frameworks, and packages around a language) is one of JavaScript's biggest advantages.\n\nPopular tools include:\n\n```text\nReact\nNext.js\nNode.js\nExpress\nNestJS\nTypeScript\nVue\nAngular\n```\n\nThere are also millions of packages available through npm.\n\n---\n\n### 4. Fast Development\n\nJavaScript has many ready-made libraries and tools.\n\nInstead of building everything from scratch, developers can use existing solutions.\n\n```javascript\nimport express from \"express\";\n```\n\nThis can greatly reduce development time.\n\n---\n\n### 5. Asynchronous Programming\n\n<b>Asynchronous programming</b> (starting work that can finish later without blocking everything else) makes JavaScript useful for:\n\n• API requests\n• Database queries\n• File operations\n• Timers\n• Real-time applications\n\nExample:\n\n```javascript\nconst data = await fetch(\"/api/users\");\n```\n\nWhile waiting for the network response, the application can continue handling other work.\n\n---\n\n### 6. Huge Community\n\nJavaScript has a very large developer community.\n\nThat means:\n\n• Lots of tutorials\n• Many open-source projects\n• Many libraries\n• Easy-to-find solutions\n• Strong job market",
        np: "### JavaScript के हो?\n\n<b>JavaScript</b> (मुख्यतया website लाई interactive बनाउन प्रयोग हुने programming language) browser मा चल्छ र Node.js जस्ता environment प्रयोग गरी browser बाहिर पनि चल्न सक्छ।\n\nयो यसका लागि प्रयोग हुन्छ:\n\n• Website र web app\n• Backend server\n• Mobile app\n• Desktop app\n• API\n• Automation\n• Full-stack application\n\n---\n\n## JavaScript को छोटो इतिहास\n\nJavaScript <b>Brendan Eich</b> ले <b>1995</b> मा Netscape मा काम गर्दा बनाएका थिए।\n\nमूल लक्ष्य सरल थियो: web page लाई अझ interactive बनाउनु।\n\n### Timeline\n\n```text\n1995\n ↓\nJavaScript created by Brendan Eich\n ↓\n1996\n ↓\nMicrosoft creates JScript\n ↓\n1997\n ↓\nJavaScript standardized as ECMAScript\n ↓\n2009\n ↓\nNode.js brings JavaScript to the server\n ↓\n2015\n ↓\nES6 / ES2015 introduces major modern features\n ↓\nToday\n ↓\nJavaScript is used across the full stack\n```\n\nआधिकारिक standard लाई <b>ECMAScript</b> (JavaScript कसरी काम गर्नुपर्छ भन्ने परिभाषित गर्ने specification) भनिन्छ।\n\n---\n\n## JavaScript किन लोकप्रिय छ?\n\n### 1. Browser मा चल्छ\n\nJavaScript आधुनिक browser मा नै बनेको हुन्छ।\n\n```javascript\nconsole.log(\"Hello\");\n```\n\nBrowser मा चलाउनका लागि छुट्टै programming language install गर्नु पर्दैन।\n\n---\n\n### 2. Full-Stack Development\n\n<b>Node.js</b> (JavaScript लाई browser बाहिर चलाउन दिने runtime) सँग, तपाईं frontend र backend दुबैका लागि JavaScript प्रयोग गर्न सक्नुहुन्छ।\n\n```text\nFrontend\nReact / Next.js\n       ↓\nJavaScript\n       ↓\nBackend\nNode.js\n       ↓\nDatabase\nPostgreSQL / MySQL\n```\n\nयसले पूरै application मा एउटै भाषा प्रयोग गर्न दिन्छ।\n\n---\n\n### 3. ठूलो Ecosystem\n\n<b>Ecosystem</b> (भाषा वरिपरिका library, tool, framework र package को संग्रह) JavaScript का सबैभन्दा ठूला फाइदामध्ये एक हो।\n\nलोकप्रिय tool मा पर्छन्:\n\n```text\nReact\nNext.js\nNode.js\nExpress\nNestJS\nTypeScript\nVue\nAngular\n```\n\nnpm मार्फत लाखौं package पनि उपलब्ध छन्।\n\n---\n\n### 4. छिटो Development\n\nJavaScript मा धेरै तयारी library र tool छन्।\n\nसबै चीज सुरुबाट बनाउनुको साटो, developer ले अवस्थित समाधान प्रयोग गर्न सक्छन्।\n\n```javascript\nimport express from \"express\";\n```\n\nयसले development समय धेरै घटाउन सक्छ।\n\n---\n\n### 5. Asynchronous Programming\n\n<b>Asynchronous programming</b> (अरू सबै नरोकी पछि सकिन सक्ने काम सुरु गर्नु) ले JavaScript लाई यसका लागि उपयोगी बनाउँछ:\n\n• API request\n• Database query\n• File operation\n• Timer\n• Real-time application\n\nउदाहरण:\n\n```javascript\nconst data = await fetch(\"/api/users\");\n```\n\nNetwork response कुर्दै गर्दा पनि application ले अरू काम गरिरहन सक्छ।\n\n---\n\n### 6. ठूलो Community\n\nJavaScript को developer community धेरै ठूलो छ।\n\nत्यसको अर्थ:\n\n• धेरै tutorial\n• धेरै open-source project\n• धेरै library\n• सजिलै भेटिने समाधान\n• बलियो job market",
        jp: "### JavaScriptとは?\n\n<b>JavaScript</b>（主にWebサイトを対話的にするために使うプログラミング言語）はブラウザで動き、Node.jsのような環境を使えばブラウザの外でも動きます。\n\n次のような用途に使われます:\n\n• WebサイトとWebアプリ\n• バックエンドのサーバー\n• モバイルアプリ\n• デスクトップアプリ\n• API\n• 自動化\n• フルスタックのアプリケーション\n\n---\n\n## JavaScriptの短い歴史\n\nJavaScriptは<b>Brendan Eich</b>が<b>1995年</b>、Netscape在籍時に作りました。\n\n当初の目的はシンプルで、Webページをもっと対話的にすることでした。\n\n### 年表\n\n```text\n1995\n ↓\nJavaScript created by Brendan Eich\n ↓\n1996\n ↓\nMicrosoft creates JScript\n ↓\n1997\n ↓\nJavaScript standardized as ECMAScript\n ↓\n2009\n ↓\nNode.js brings JavaScript to the server\n ↓\n2015\n ↓\nES6 / ES2015 introduces major modern features\n ↓\nToday\n ↓\nJavaScript is used across the full stack\n```\n\n公式の標準は<b>ECMAScript</b>（JavaScriptがどう動くべきかを定める仕様）と呼ばれます。\n\n---\n\n## なぜJavaScriptは人気なのか?\n\n### 1. ブラウザで動く\n\nJavaScriptは現代のブラウザに組み込まれています。\n\n```javascript\nconsole.log(\"Hello\");\n```\n\nブラウザで動かすためだけに別の言語をインストールする必要はありません。\n\n---\n\n### 2. フルスタック開発\n\n<b>Node.js</b>（JavaScriptをブラウザの外で動かすランタイム）を使えば、フロントエンドにもバックエンドにもJavaScriptを使えます。\n\n```text\nFrontend\nReact / Next.js\n       ↓\nJavaScript\n       ↓\nBackend\nNode.js\n       ↓\nDatabase\nPostgreSQL / MySQL\n```\n\nアプリ全体を1つの言語で書けるようになります。\n\n---\n\n### 3. 巨大なエコシステム\n\n<b>エコシステム</b>（言語の周りにあるライブラリ・ツール・フレームワーク・パッケージの集まり）はJavaScript最大の強みの1つです。\n\nよく使われるツール:\n\n```text\nReact\nNext.js\nNode.js\nExpress\nNestJS\nTypeScript\nVue\nAngular\n```\n\nnpmを通じて数百万のパッケージも利用できます。\n\n---\n\n### 4. 開発が速い\n\nJavaScriptには出来合いのライブラリやツールがたくさんあります。\n\nすべてを一から作る代わりに、既存の解決策を使えます。\n\n```javascript\nimport express from \"express\";\n```\n\nこれで開発時間を大きく減らせます。\n\n---\n\n### 5. 非同期プログラミング\n\n<b>非同期プログラミング</b>（他をすべて止めずに、後で終わる処理を始めること）により、JavaScriptは次のような場面で力を発揮します:\n\n• APIリクエスト\n• データベースへの問い合わせ\n• ファイル操作\n• タイマー\n• リアルタイムアプリケーション\n\n例:\n\n```javascript\nconst data = await fetch(\"/api/users\");\n```\n\nネットワークの応答を待つ間も、アプリは他の処理を続けられます。\n\n---\n\n### 6. 大きなコミュニティ\n\nJavaScriptには非常に大きな開発者コミュニティがあります。\n\nつまり:\n\n• チュートリアルが豊富\n• オープンソースのプロジェクトが多い\n• ライブラリが多い\n• 解決策を見つけやすい\n• 求人市場が大きい",
      },
      diagram: `                 JavaScript
                     |
       +-------------+-------------+
       |             |             |
    Browser        Server        Apps
       |             |             |
    React         Node.js      React Native
    Next.js       NestJS       Electron
       |             |             |
       +-------------+-------------+
                     |
                Full Stack`,
      codeExample: {
        title: { en: "Where JavaScript runs today", np: "JavaScript आज कहाँ चल्छ", jp: "JavaScriptが今どこで動くか" },
        code: `// In the browser
console.log("Hello");

// On the server, with Node.js
import express from "express";

const app = express();

app.get("/api/users", (req, res) => {
  res.json([{ id: 1, name: "Rajan" }]);
});

// Asynchronous work: the app keeps going while this request is in flight
const data = await fetch("/api/users");`,
      },
      keyTakeaways: [
        { en: "JavaScript was created in <b>1995</b> by <b>Brendan Eich</b>.", np: "JavaScript <b>1995</b> मा <b>Brendan Eich</b> ले बनाएका थिए।", jp: "JavaScriptは<b>1995年</b>に<b>Brendan Eich</b>が作った。" },
        { en: "It was originally created to make web pages interactive.", np: "यो सुरुमा web page लाई interactive बनाउन बनाइएको थियो।", jp: "もともとはWebページを対話的にするために作られた。" },
        { en: "<b>ECMAScript</b> is the standard that defines JavaScript.", np: "<b>ECMAScript</b> JavaScript लाई परिभाषित गर्ने standard हो।", jp: "<b>ECMAScript</b> はJavaScriptを定義する標準。" },
        { en: "JavaScript runs in browsers and on servers.", np: "JavaScript browser र server दुबैमा चल्छ।", jp: "JavaScriptはブラウザでもサーバーでも動く。" },
        { en: "<b>Node.js</b> made JavaScript useful for backend development.", np: "<b>Node.js</b> ले JavaScript लाई backend development का लागि उपयोगी बनायो।", jp: "<b>Node.js</b> がJavaScriptをバックエンド開発に使えるものにした。" },
        { en: "JavaScript has a huge ecosystem and community.", np: "JavaScript को ठूलो ecosystem र community छ।", jp: "JavaScriptには巨大なエコシステムとコミュニティがある。" },
        { en: "It supports <b>asynchronous programming</b>.", np: "यसले <b>asynchronous programming</b> लाई समर्थन गर्छ।", jp: "<b>非同期プログラミング</b>に対応している。" },
        { en: "It can be used for frontend, backend, mobile, desktop, and more.", np: "यो frontend, backend, mobile, desktop र अझ धेरैका लागि प्रयोग गर्न सकिन्छ।", jp: "フロントエンド・バックエンド・モバイル・デスクトップなど幅広く使える。" },
      ],
      commonMistakes: [
        { en: "<b>JavaScript and Java are the same</b> — they are completely different languages. The similar names are mostly a historical naming decision.", np: "<b>JavaScript र Java उही हुन्</b> — यी पूरै फरक भाषा हुन्। मिल्दो नाम प्रायः ऐतिहासिक निर्णय मात्र हो।", jp: "<b>JavaScriptとJavaは同じ</b> — まったく別の言語。名前が似ているのは主に歴史的な命名の経緯によるもの。" },
        { en: "<b>JavaScript only works in browsers</b> — it also runs outside them, in `Node.js`, `Deno` and `Bun`.", np: "<b>JavaScript browser मा मात्र चल्छ</b> — यो `Node.js`, `Deno` र `Bun` मा browser बाहिर पनि चल्छ।", jp: "<b>JavaScriptはブラウザでしか動かない</b> — `Node.js`・`Deno`・`Bun` などブラウザの外でも動く。" },
        { en: "<b>ECMAScript and JavaScript are completely different languages</b> — ECMAScript is the standard, and JavaScript is an implementation of it.", np: "<b>ECMAScript र JavaScript पूरै फरक भाषा हुन्</b> — ECMAScript standard हो, र JavaScript त्यसको implementation हो।", jp: "<b>ECMAScriptとJavaScriptはまったく別の言語</b> — ECMAScriptは標準で、JavaScriptはその実装。" },
      ],
      quiz: [
        {
          question: { en: "When was JavaScript created?", np: "JavaScript कहिले बनाइयो?", jp: "JavaScriptはいつ作られたか?" },
          options: [
            { en: "1989", np: "1989", jp: "1989" },
            { en: "1995", np: "1995", jp: "1995" },
            { en: "2005", np: "2005", jp: "2005" },
          ],
          correctIndex: 1,
          explanation: { en: "Brendan Eich built the first version at Netscape in 1995.", np: "Brendan Eich ले 1995 मा Netscape मा पहिलो संस्करण बनाए।", jp: "Brendan Eichが1995年にNetscapeで最初のバージョンを作った。" },
        },
        {
          question: { en: "Who created JavaScript?", np: "JavaScript कसले बनाए?", jp: "JavaScriptを作ったのは誰か?" },
          options: [
            { en: "Brendan Eich", np: "Brendan Eich", jp: "Brendan Eich" },
            { en: "James Gosling", np: "James Gosling", jp: "James Gosling" },
            { en: "Dennis Ritchie", np: "Dennis Ritchie", jp: "Dennis Ritchie" },
          ],
          correctIndex: 0,
          explanation: { en: "James Gosling created Java and Dennis Ritchie created C, which is a common mix-up.", np: "James Gosling ले Java र Dennis Ritchie ले C बनाए, जुन प्रायः भ्रममा पारिन्छ।", jp: "James GoslingはJava、Dennis RitchieはCを作った。よく混同される。" },
        },
        {
          question: { en: "What is ECMAScript?", np: "ECMAScript के हो?", jp: "ECMAScriptとは何か?" },
          options: [
            { en: "A database", np: "एउटा database", jp: "データベース" },
            { en: "A JavaScript framework", np: "एउटा JavaScript framework", jp: "JavaScriptのフレームワーク" },
            { en: "The standard/specification for JavaScript", np: "JavaScript का लागि standard/specification", jp: "JavaScriptの標準・仕様" },
          ],
          correctIndex: 2,
          explanation: { en: "The spec defines how the language should behave; JavaScript is an implementation of it.", np: "Spec ले भाषा कसरी व्यवहार गर्नुपर्छ भन्ने परिभाषित गर्छ; JavaScript त्यसको implementation हो।", jp: "仕様が言語の振る舞いを定め、JavaScriptはその実装。" },
        },
        {
          question: { en: "What allowed JavaScript to become widely used on servers?", np: "JavaScript लाई server मा व्यापक रूपमा प्रयोग हुन केले सम्भव बनायो?", jp: "JavaScriptがサーバーで広く使われるようになったきっかけは?" },
          options: [
            { en: "CSS", np: "CSS", jp: "CSS" },
            { en: "Node.js", np: "Node.js", jp: "Node.js" },
            { en: "HTML", np: "HTML", jp: "HTML" },
          ],
          correctIndex: 1,
          explanation: { en: "Node.js gave JavaScript a runtime outside the browser in 2009.", np: "Node.js ले 2009 मा JavaScript लाई browser बाहिरको runtime दियो।", jp: "Node.jsが2009年にブラウザ外のランタイムを提供した。" },
        },
      ],
    },
    {
      id: "how-javascript-works",
      title: { en: "How JavaScript Works Behind the Scenes", np: "JavaScript पर्दा पछाडि कसरी काम गर्छ", jp: "JavaScriptは裏側でどう動くのか" },
      durationMinutes: 9,
      explanation: {
        en: "To understand JavaScript deeply, you need to know how JavaScript <b>executes code</b>.\n\nThree important questions are:\n\n• Is JavaScript <b>synchronous</b> (runs one task at a time in order)?\n• Is JavaScript <b>single-threaded</b> (has one main thread for executing JavaScript code)?\n• What is an <b>Execution Context</b> (the environment where JavaScript code is executed)?\n\n---\n\n### Execution Context\n\n<b>Execution Context</b> (the environment where JavaScript code runs) can be thought of as a big box.\n\n```text\n        Execution Context\n       +-------------------+\n       |                   |\n       |  Memory           |\n       |  Component        |\n       |                   |\n       |  Code             |\n       |  Component        |\n       |                   |\n       +-------------------+\n```\n\nEvery time JavaScript runs code, it does so inside an execution context.\n\nThe execution context has two important parts:\n\n1. <b>Memory Component</b>\n2. <b>Code Component</b>\n\n---\n\n### 1. Memory Component\n\n<b>Memory Component</b> (the place where JavaScript stores variables and functions) keeps data as key-value pairs.\n\nExample:\n\n```javascript\nconst age = 30;\n\nfunction greet() {\n  console.log(\"Hello\");\n}\n```\n\nJavaScript stores information about them in memory:\n\n```text\nMemory\n----------------\nage    → 30\n\ngreet  → function\n```\n\nThe Memory Component is also called the <b>Variable Environment</b> (the environment that stores variables and functions).\n\n---\n\n### 2. Code Component\n\n<b>Code Component</b> (the part where JavaScript executes code) runs the code.\n\nJavaScript normally executes code <b>one line at a time</b>.\n\n```javascript\nconst a = 10;\nconst b = 20;\n\nconsole.log(a + b);\n```\n\nIt runs roughly like:\n\n```text\nLine 1 → Line 2 → Line 3\n```\n\nThe Code Component is also called the <b>Thread of Execution</b> (the path JavaScript follows while executing code).\n\n---\n\n## Synchronous and Single-Threaded\n\nJavaScript is <b>single-threaded</b> (one main thread executes JavaScript code).\n\nThis means it can execute one piece of JavaScript code at a time.\n\nJavaScript is also <b>synchronous</b> (code normally runs in order, one step after another).\n\n```javascript\nconsole.log(\"A\");\nconsole.log(\"B\");\nconsole.log(\"C\");\n```\n\nOutput:\n\n```text\nA\nB\nC\n```\n\nJavaScript finishes one statement before moving to the next.\n\n```text\nA\n↓\nB\n↓\nC\n```\n\nLater, you'll learn how JavaScript can handle things like API requests and timers without blocking the entire application. This is where <b>asynchronous</b> (work that can finish later) behavior, the <b>Web APIs</b>, <b>callback queue</b>, and <b>event loop</b> come in.",
        np: "JavaScript लाई गहिरो रूपमा बुझ्न, JavaScript ले <b>code कसरी execute गर्छ</b> भन्ने थाहा हुनुपर्छ।\n\nतीन महत्वपूर्ण प्रश्न:\n\n• JavaScript <b>synchronous</b> (एक पटकमा एउटा task, क्रमैसँग) हो?\n• JavaScript <b>single-threaded</b> (JavaScript code चलाउन एउटा मुख्य thread) हो?\n• <b>Execution Context</b> (JavaScript code चल्ने वातावरण) के हो?\n\n---\n\n### Execution Context\n\n<b>Execution Context</b> (JavaScript code चल्ने वातावरण) लाई ठूलो बाकस जस्तै सोच्न सकिन्छ।\n\n```text\n        Execution Context\n       +-------------------+\n       |                   |\n       |  Memory           |\n       |  Component        |\n       |                   |\n       |  Code             |\n       |  Component        |\n       |                   |\n       +-------------------+\n```\n\nJavaScript ले जहिले पनि code चलाउँदा execution context भित्रै चलाउँछ।\n\nExecution context का दुई महत्वपूर्ण भाग छन्:\n\n1. <b>Memory Component</b>\n2. <b>Code Component</b>\n\n---\n\n### 1. Memory Component\n\n<b>Memory Component</b> (JavaScript ले variable र function राख्ने ठाउँ) ले data लाई key-value जोडीका रूपमा राख्छ।\n\nउदाहरण:\n\n```javascript\nconst age = 30;\n\nfunction greet() {\n  console.log(\"Hello\");\n}\n```\n\nJavaScript ले तिनको जानकारी memory मा राख्छ:\n\n```text\nMemory\n----------------\nage    → 30\n\ngreet  → function\n```\n\nMemory Component लाई <b>Variable Environment</b> (variable र function राख्ने वातावरण) पनि भनिन्छ।\n\n---\n\n### 2. Code Component\n\n<b>Code Component</b> (JavaScript ले code execute गर्ने भाग) ले code चलाउँछ।\n\nJavaScript सामान्यतया <b>एक पटकमा एउटा line</b> चलाउँछ।\n\n```javascript\nconst a = 10;\nconst b = 20;\n\nconsole.log(a + b);\n```\n\nयो मोटामोटी यसरी चल्छ:\n\n```text\nLine 1 → Line 2 → Line 3\n```\n\nCode Component लाई <b>Thread of Execution</b> (code चलाउँदा JavaScript ले पछ्याउने बाटो) पनि भनिन्छ।\n\n---\n\n## Synchronous र Single-Threaded\n\nJavaScript <b>single-threaded</b> (एउटा मुख्य thread ले JavaScript code चलाउँछ) हो।\n\nयसको अर्थ यसले एक पटकमा एउटा JavaScript code मात्र चलाउन सक्छ।\n\nJavaScript <b>synchronous</b> (code सामान्यतया क्रमैसँग, एक पछि अर्को चल्छ) पनि हो।\n\n```javascript\nconsole.log(\"A\");\nconsole.log(\"B\");\nconsole.log(\"C\");\n```\n\nOutput:\n\n```text\nA\nB\nC\n```\n\nJavaScript ले एउटा statement सक्काएर मात्र अर्कोमा जान्छ।\n\n```text\nA\n↓\nB\n↓\nC\n```\n\nपछि, तपाईं JavaScript ले पूरै application नरोकी API request र timer जस्ता चीज कसरी सम्हाल्छ भन्ने सिक्नुहुनेछ। यहीँ <b>asynchronous</b> (पछि सकिन सक्ने काम) व्यवहार, <b>Web APIs</b>, <b>callback queue</b>, र <b>event loop</b> आउँछन्।",
        jp: "JavaScriptを深く理解するには、JavaScriptが<b>どうコードを実行するか</b>を知る必要があります。\n\n大事な問いは3つ:\n\n• JavaScriptは<b>同期的</b>（一度に1つのタスクを順に実行する）か?\n• JavaScriptは<b>シングルスレッド</b>（JavaScriptコードを実行するメインスレッドが1つ）か?\n• <b>実行コンテキスト</b>（JavaScriptコードが実行される環境）とは何か?\n\n---\n\n### 実行コンテキスト\n\n<b>実行コンテキスト</b>（JavaScriptコードが動く環境）は、大きな箱だと考えられます。\n\n```text\n        Execution Context\n       +-------------------+\n       |                   |\n       |  Memory           |\n       |  Component        |\n       |                   |\n       |  Code             |\n       |  Component        |\n       |                   |\n       +-------------------+\n```\n\nJavaScriptがコードを走らせるときは、必ず実行コンテキストの中で行われます。\n\n実行コンテキストには重要な部分が2つあります:\n\n1. <b>メモリコンポーネント</b>\n2. <b>コードコンポーネント</b>\n\n---\n\n### 1. メモリコンポーネント\n\n<b>メモリコンポーネント</b>（JavaScriptが変数と関数を保存する場所）は、データをキーと値の組で保持します。\n\n例:\n\n```javascript\nconst age = 30;\n\nfunction greet() {\n  console.log(\"Hello\");\n}\n```\n\nJavaScriptはそれらの情報をメモリに保存します:\n\n```text\nMemory\n----------------\nage    → 30\n\ngreet  → function\n```\n\nメモリコンポーネントは<b>変数環境（Variable Environment）</b>（変数と関数を保存する環境）とも呼ばれます。\n\n---\n\n### 2. コードコンポーネント\n\n<b>コードコンポーネント</b>（JavaScriptがコードを実行する部分）がコードを走らせます。\n\nJavaScriptは通常、<b>1行ずつ</b>実行します。\n\n```javascript\nconst a = 10;\nconst b = 20;\n\nconsole.log(a + b);\n```\n\nおおよそこう動きます:\n\n```text\nLine 1 → Line 2 → Line 3\n```\n\nコードコンポーネントは<b>実行のスレッド（Thread of Execution）</b>（実行中にJavaScriptがたどる道筋）とも呼ばれます。\n\n---\n\n## 同期的でシングルスレッド\n\nJavaScriptは<b>シングルスレッド</b>（1つのメインスレッドがJavaScriptコードを実行する）です。\n\nつまり、一度に1つのJavaScriptコードしか実行できません。\n\nJavaScriptは<b>同期的</b>（コードは通常、順に1ステップずつ実行される）でもあります。\n\n```javascript\nconsole.log(\"A\");\nconsole.log(\"B\");\nconsole.log(\"C\");\n```\n\n出力:\n\n```text\nA\nB\nC\n```\n\nJavaScriptは1つの文を終えてから次に進みます。\n\n```text\nA\n↓\nB\n↓\nC\n```\n\n後の日には、アプリ全体を止めずにAPIリクエストやタイマーを扱う方法を学びます。そこで<b>非同期</b>（後で終わる処理）の振る舞い、<b>Web API</b>、<b>コールバックキュー</b>、<b>イベントループ</b>が登場します。",
      },
      diagram: `              JavaScript
                   |
                   ↓
          Execution Context
                   |
          +--------+--------+
          |                 |
          ↓                 ↓
       Memory             Code
     Component          Component
          |                 |
          ↓                 ↓
 Variables &           Executes code
 Functions             one at a time
          |                 |
          ↓                 ↓
 Variable              Thread of
 Environment           Execution`,
      codeExample: {
        title: { en: "One execution context, two components", np: "एउटा execution context, दुई component", jp: "1つの実行コンテキスト、2つの部品" },
        code: `const a = 10;
const b = 20;

function add(x, y) {
  return x + y;
}

const result = add(a, b);

console.log(result);

// Execution Context
// │
// ├── Memory Component
// │   ├── a      → 10
// │   ├── b      → 20
// │   ├── add    → function
// │   └── result → 30
// │
// └── Code Component
//     ├── const a = 10
//     ├── const b = 20
//     ├── add(a, b)
//     └── console.log(result)`,
      },
      keyTakeaways: [
        { en: "<b>Execution Context</b> → environment where JavaScript code runs.", np: "<b>Execution Context</b> → JavaScript code चल्ने वातावरण।", jp: "<b>実行コンテキスト</b> → JavaScriptコードが動く環境。" },
        { en: "<b>Memory Component</b> → stores variables and functions.", np: "<b>Memory Component</b> → variable र function राख्छ।", jp: "<b>メモリコンポーネント</b> → 変数と関数を保存する。" },
        { en: "<b>Variable Environment</b> → another name for the Memory Component.", np: "<b>Variable Environment</b> → Memory Component कै अर्को नाम।", jp: "<b>変数環境</b> → メモリコンポーネントの別名。" },
        { en: "<b>Code Component</b> → executes JavaScript code.", np: "<b>Code Component</b> → JavaScript code execute गर्छ।", jp: "<b>コードコンポーネント</b> → JavaScriptコードを実行する。" },
        { en: "<b>Thread of Execution</b> → another name for the Code Component.", np: "<b>Thread of Execution</b> → Code Component कै अर्को नाम।", jp: "<b>実行のスレッド</b> → コードコンポーネントの別名。" },
        { en: "<b>Single-threaded</b> → JavaScript has one main thread for executing JS code.", np: "<b>Single-threaded</b> → JavaScript सँग JS code चलाउने एउटा मुख्य thread हुन्छ।", jp: "<b>シングルスレッド</b> → JSコードを実行するメインスレッドは1つ。" },
        { en: "<b>Synchronous</b> → code normally runs one step at a time and in order.", np: "<b>Synchronous</b> → code सामान्यतया एक पटकमा एक पाइला, क्रमैसँग चल्छ।", jp: "<b>同期的</b> → コードは通常、順に1ステップずつ実行される。" },
        { en: "JavaScript can handle asynchronous work using other parts of the runtime, which you'll learn later.", np: "JavaScript ले runtime का अरू भाग प्रयोग गरी asynchronous काम सम्हाल्न सक्छ, जुन तपाईं पछि सिक्नुहुनेछ।", jp: "JavaScriptはランタイムの他の部分を使って非同期処理を扱える。これは後で学ぶ。" },
      ],
      commonMistakes: [
        { en: "<b>Thinking the Memory Component executes code</b> — memory stores data, the Code Component executes.", np: "<b>Memory Component ले code execute गर्छ भन्ने ठान्नु</b> — memory ले data राख्छ, Code Component ले execute गर्छ।", jp: "<b>メモリコンポーネントがコードを実行すると思う</b> — メモリはデータを保存し、実行するのはコードコンポーネント。" },
        { en: "<b>Thinking single-threaded means JavaScript can never do multiple things</b> — JS execution uses one main thread, but the runtime uses other systems for timers, network requests and file operations. That is the event loop.", np: "<b>Single-threaded को अर्थ JavaScript ले कहिल्यै धेरै काम गर्न सक्दैन भन्ने ठान्नु</b> — JS execution ले एउटा मुख्य thread प्रयोग गर्छ, तर runtime ले timer, network request र file operation का लागि अरू प्रणाली प्रयोग गर्छ। यही event loop हो।", jp: "<b>シングルスレッド＝複数のことが一切できない、と思う</b> — JSの実行はメインスレッド1つだが、ランタイムはタイマー・ネットワーク・ファイル操作に別の仕組みを使う。それがイベントループ。" },
        { en: "<b>Thinking synchronous means the entire application must always wait</b> — synchronous JS runs one step at a time, while asynchronous operations let other work happen during the wait.", np: "<b>Synchronous को अर्थ पूरै application सधैं कुर्नुपर्छ भन्ने ठान्नु</b> — synchronous JS एक पटकमा एक पाइला चल्छ, जब कि asynchronous operation ले कुर्दै गर्दा अरू काम हुन दिन्छ।", jp: "<b>同期的＝アプリ全体が常に待たされる、と思う</b> — 同期的なJSは1ステップずつ動くが、非同期処理は待っている間に他の作業を進められる。" },
      ],
      quiz: [
        {
          question: { en: "What is an Execution Context?", np: "Execution Context के हो?", jp: "実行コンテキストとは何か?" },
          options: [
            { en: "A database", np: "एउटा database", jp: "データベース" },
            { en: "The environment where JavaScript code runs", np: "JavaScript code चल्ने वातावरण", jp: "JavaScriptコードが動く環境" },
            { en: "A JavaScript variable", np: "एउटा JavaScript variable", jp: "JavaScriptの変数" },
          ],
          correctIndex: 1,
          explanation: { en: "Every piece of JavaScript runs inside one, and it holds both memory and the code being executed.", np: "हरेक JavaScript यसै भित्र चल्छ, र यसमा memory र चलिरहेको code दुबै हुन्छन्।", jp: "すべてのJavaScriptはこの中で動き、メモリと実行中のコードの両方を持つ。" },
        },
        {
          question: { en: "What does the Memory Component store?", np: "Memory Component ले के राख्छ?", jp: "メモリコンポーネントは何を保存するか?" },
          options: [
            { en: "Variables and functions", np: "Variable र function", jp: "変数と関数" },
            { en: "Only HTML", np: "HTML मात्र", jp: "HTMLだけ" },
            { en: "Only errors", np: "Error मात्र", jp: "エラーだけ" },
          ],
          correctIndex: 0,
          explanation: { en: "It keeps them as key-value pairs, which is why it is also called the variable environment.", np: "यसले तिनलाई key-value जोडीमा राख्छ, त्यसैले यसलाई variable environment पनि भनिन्छ।", jp: "キーと値の組で保持するため、変数環境とも呼ばれる。" },
        },
        {
          question: { en: "What is another name for the Memory Component?", np: "Memory Component कै अर्को नाम के हो?", jp: "メモリコンポーネントの別名は?" },
          options: [
            { en: "Event Loop", np: "Event Loop", jp: "イベントループ" },
            { en: "Variable Environment", np: "Variable Environment", jp: "変数環境" },
            { en: "Call Stack", np: "Call Stack", jp: "コールスタック" },
          ],
          correctIndex: 1,
          explanation: { en: "The Code Component has a second name too: the thread of execution.", np: "Code Component को पनि अर्को नाम छ: thread of execution।", jp: "コードコンポーネントにも別名がある: 実行のスレッド。" },
        },
        {
          question: { en: "What does single-threaded mean?", np: "Single-threaded को अर्थ के हो?", jp: "シングルスレッドとはどういう意味か?" },
          options: [
            { en: "JavaScript has one main thread for executing JS code", np: "JavaScript सँग JS code चलाउने एउटा मुख्य thread हुन्छ", jp: "JSコードを実行するメインスレッドが1つあるということ" },
            { en: "JavaScript cannot use the internet", np: "JavaScript ले internet प्रयोग गर्न सक्दैन", jp: "JavaScriptはインターネットを使えない" },
            { en: "JavaScript can execute everything at once", np: "JavaScript ले सबै एकैचोटि execute गर्न सक्छ", jp: "JavaScriptはすべてを同時に実行できる" },
          ],
          correctIndex: 0,
          explanation: { en: "One thread runs your JavaScript; the surrounding runtime handles timers and requests separately.", np: "एउटा thread ले तपाईंको JavaScript चलाउँछ; वरिपरिको runtime ले timer र request छुट्टै सम्हाल्छ।", jp: "1つのスレッドがJavaScriptを実行し、周囲のランタイムがタイマーやリクエストを別に処理する。" },
        },
        {
          question: { en: "What does synchronous mean?", np: "Synchronous को अर्थ के हो?", jp: "同期的とはどういう意味か?" },
          options: [
            { en: "Code runs randomly", np: "Code अनियमित रूपमा चल्छ", jp: "コードがランダムに実行される" },
            { en: "Code normally runs one step at a time in order", np: "Code सामान्यतया क्रमैसँग एक पटकमा एक पाइला चल्छ", jp: "コードは通常、順に1ステップずつ実行される" },
            { en: "Code never waits", np: "Code कहिल्यै कुर्दैन", jp: "コードは決して待たない" },
          ],
          correctIndex: 1,
          explanation: { en: "Each statement finishes before the next one starts.", np: "हरेक statement सकिएपछि मात्र अर्को सुरु हुन्छ।", jp: "各文が終わってから次が始まる。" },
        },
      ],
      youtubeId: "ZvbzSrg0afE",
    },
    {
      id: "execution-context-call-stack",
      title: { en: "What Happens When You Run JavaScript Code?", np: "JavaScript code चलाउँदा के हुन्छ?", jp: "JavaScriptコードを実行すると何が起こるか?" },
      durationMinutes: 12,
      explanation: {
        en: "When you run JavaScript code, the <b>JavaScript engine</b> (the program that reads and runs JavaScript) creates an <b>Execution Context</b> (the environment where the code runs).\n\nThe most important idea is:\n\n> <b>JavaScript code runs inside an Execution Context.</b>\n\nFor a normal JavaScript program, the first one created is the <b>Global Execution Context (GEC)</b> (the main execution environment for your program).\n\n---\n\n## Execution Context\n\nAn Execution Context has two main parts:\n\n```text\nExecution Context\n│\n├── Memory Component\n│   └── Stores variables and functions\n│\n└── Code Component\n    └── Executes code\n```\n\nThe Memory Component is also called the <b>Variable Environment</b>.\n\nThe Code Component is also called the <b>Thread of Execution</b>.\n\n---\n\n## Two Phases\n\nWhen an Execution Context is created, JavaScript goes through two main phases:\n\n### 1. Memory Creation Phase\n\n<b>Memory Creation Phase</b> (the phase where JavaScript prepares memory for variables and functions).\n\nExample:\n\n```javascript\nvar n = 2;\n\nfunction square(num) {\n  var ans = num * num;\n  return ans;\n}\n\nvar square2 = square(n);\nvar square4 = square(4);\n```\n\nBefore executing the code, JavaScript prepares memory:\n\n```text\nMemory\n------------------\nn       → undefined\nsquare  → function\nsquare2 → undefined\nsquare4 → undefined\n```\n\nVariables get `undefined` (a placeholder meaning no value has been assigned yet).\n\nFunctions get their function code.\n\n---\n\n### 2. Code Execution Phase\n\n<b>Code Execution Phase</b> (the phase where JavaScript runs the code line by line).\n\n```javascript\nvar n = 2;\n```\n\nNow:\n\n```text\nn → undefined\n```\n\nbecomes:\n\n```text\nn → 2\n```\n\nThen JavaScript reaches:\n\n```javascript\nvar square2 = square(n);\n```\n\nThis <b>function invocation</b> (calling a function) creates a new Execution Context.\n\n---\n\n## Function Execution Context\n\nWhenever a function is called, JavaScript creates a new Execution Context for that function.\n\n```javascript\nsquare(n);\n```\n\ncreates something like:\n\n```text\nGlobal Execution Context\n        │\n        ↓\nSquare Execution Context\n```\n\nThe function's Execution Context also has:\n\n```text\nSquare Execution Context\n│\n├── Memory\n│   ├── num → undefined\n│   └── ans → undefined\n│\n└── Code\n```\n\n### Memory Creation\n\n```text\nnum → undefined\nans → undefined\n```\n\n### Code Execution\n\nThe argument `n` is `2`, so:\n\n```text\nnum → 2\n```\n\nThen:\n\n```javascript\nvar ans = num * num;\n```\n\nbecomes:\n\n```text\nans → 4\n```\n\nThen:\n\n```javascript\nreturn ans;\n```\n\nreturns `4` to the place where the function was called.\n\n```text\nsquare(n) → 4\n\nsquare2 → 4\n```\n\nOnce the function finishes, its Execution Context is removed.\n\n---\n\n## Parameter vs Argument\n\nThese two terms are important:\n\n```javascript\nfunction square(num) {\n  return num * num;\n}\n\nsquare(2);\n```\n\n<b>Parameter</b> (the variable defined in the function):\n\n```javascript\nnum\n```\n\n<b>Argument</b> (the actual value passed to the function):\n\n```javascript\n2\n```\n\nSo:\n\n```text\nnum ← 2\n```\n\n---\n\n## Call Stack\n\nHow does JavaScript manage all these Execution Contexts?\n\nIt uses the <b>Call Stack</b> (a stack that keeps track of which Execution Context is currently running).\n\nThink of it like a stack of plates. The last plate added is the first one removed.\n\nWhen the program starts:\n\n```text\n┌─────────────┐\n│     GEC     │\n└─────────────┘\n```\n\nWhen `square()` is called:\n\n```text\n┌─────────────┐\n│  square()   │\n├─────────────┤\n│     GEC     │\n└─────────────┘\n```\n\nWhen `square()` finishes:\n\n```text\n┌─────────────┐\n│     GEC     │\n└─────────────┘\n```\n\nThe function Execution Context is <b>popped</b> (removed from the top of the stack).",
        np: "तपाईंले JavaScript code चलाउँदा, <b>JavaScript engine</b> (JavaScript पढ्ने र चलाउने program) ले <b>Execution Context</b> (code चल्ने वातावरण) बनाउँछ।\n\nसबैभन्दा महत्वपूर्ण विचार यो हो:\n\n> <b>JavaScript code Execution Context भित्र चल्छ।</b>\n\nसामान्य JavaScript program का लागि, पहिलो बन्ने <b>Global Execution Context (GEC)</b> (तपाईंको program को मुख्य execution वातावरण) हो।\n\n---\n\n## Execution Context\n\nExecution Context का दुई मुख्य भाग हुन्छन्:\n\n```text\nExecution Context\n│\n├── Memory Component\n│   └── Stores variables and functions\n│\n└── Code Component\n    └── Executes code\n```\n\nMemory Component लाई <b>Variable Environment</b> पनि भनिन्छ।\n\nCode Component लाई <b>Thread of Execution</b> पनि भनिन्छ।\n\n---\n\n## दुई Phase\n\nExecution Context बन्दा, JavaScript दुई मुख्य phase बाट जान्छ:\n\n### 1. Memory Creation Phase\n\n<b>Memory Creation Phase</b> (JavaScript ले variable र function का लागि memory तयार गर्ने phase)।\n\nउदाहरण:\n\n```javascript\nvar n = 2;\n\nfunction square(num) {\n  var ans = num * num;\n  return ans;\n}\n\nvar square2 = square(n);\nvar square4 = square(4);\n```\n\nCode चलाउनुअघि, JavaScript ले memory तयार गर्छ:\n\n```text\nMemory\n------------------\nn       → undefined\nsquare  → function\nsquare2 → undefined\nsquare4 → undefined\n```\n\nVariable ले `undefined` (अझै कुनै value assign गरिएको छैन भन्ने placeholder) पाउँछन्।\n\nFunction ले आफ्नो function code पाउँछन्।\n\n---\n\n### 2. Code Execution Phase\n\n<b>Code Execution Phase</b> (JavaScript ले code line by line चलाउने phase)।\n\n```javascript\nvar n = 2;\n```\n\nअब:\n\n```text\nn → undefined\n```\n\nयो बन्छ:\n\n```text\nn → 2\n```\n\nत्यसपछि JavaScript यहाँ पुग्छ:\n\n```javascript\nvar square2 = square(n);\n```\n\nयो <b>function invocation</b> (function call गर्नु) ले नयाँ Execution Context बनाउँछ।\n\n---\n\n## Function Execution Context\n\nजब पनि function call हुन्छ, JavaScript ले त्यो function का लागि नयाँ Execution Context बनाउँछ।\n\n```javascript\nsquare(n);\n```\n\nले यस्तो बनाउँछ:\n\n```text\nGlobal Execution Context\n        │\n        ↓\nSquare Execution Context\n```\n\nFunction को Execution Context मा पनि हुन्छ:\n\n```text\nSquare Execution Context\n│\n├── Memory\n│   ├── num → undefined\n│   └── ans → undefined\n│\n└── Code\n```\n\n### Memory Creation\n\n```text\nnum → undefined\nans → undefined\n```\n\n### Code Execution\n\nArgument `n` `2` हो, त्यसैले:\n\n```text\nnum → 2\n```\n\nत्यसपछि:\n\n```javascript\nvar ans = num * num;\n```\n\nयो बन्छ:\n\n```text\nans → 4\n```\n\nत्यसपछि:\n\n```javascript\nreturn ans;\n```\n\nले function call भएको ठाउँमा `4` फर्काउँछ।\n\n```text\nsquare(n) → 4\n\nsquare2 → 4\n```\n\nFunction सकिएपछि, यसको Execution Context हट्छ।\n\n---\n\n## Parameter vs Argument\n\nयी दुई शब्द महत्वपूर्ण छन्:\n\n```javascript\nfunction square(num) {\n  return num * num;\n}\n\nsquare(2);\n```\n\n<b>Parameter</b> (function मा परिभाषित variable):\n\n```javascript\nnum\n```\n\n<b>Argument</b> (function लाई पठाइएको वास्तविक value):\n\n```javascript\n2\n```\n\nत्यसैले:\n\n```text\nnum ← 2\n```\n\n---\n\n## Call Stack\n\nJavaScript ले यी सबै Execution Context कसरी व्यवस्थापन गर्छ?\n\nयसले <b>Call Stack</b> (कुन Execution Context अहिले चलिरहेको छ भन्ने हिसाब राख्ने stack) प्रयोग गर्छ।\n\nयसलाई थाकिएका थालको चाङ जस्तै सोच्नुहोस्। अन्तिम राखिएको थाल पहिले निकालिन्छ।\n\nProgram सुरु हुँदा:\n\n```text\n┌─────────────┐\n│     GEC     │\n└─────────────┘\n```\n\n`square()` call हुँदा:\n\n```text\n┌─────────────┐\n│  square()   │\n├─────────────┤\n│     GEC     │\n└─────────────┘\n```\n\n`square()` सकिँदा:\n\n```text\n┌─────────────┐\n│     GEC     │\n└─────────────┘\n```\n\nFunction को Execution Context <b>pop</b> (stack को टुप्पोबाट हटाइन्छ) हुन्छ।",
        jp: "JavaScriptのコードを実行すると、<b>JavaScriptエンジン</b>（JavaScriptを読んで実行するプログラム）が<b>実行コンテキスト</b>（コードが動く環境）を作ります。\n\n最も大事な考えはこれです:\n\n> <b>JavaScriptのコードは実行コンテキストの中で動く。</b>\n\n普通のJavaScriptプログラムでは、最初に作られるのが<b>グローバル実行コンテキスト（GEC）</b>（プログラムの主な実行環境）です。\n\n---\n\n## 実行コンテキスト\n\n実行コンテキストには主に2つの部分があります:\n\n```text\nExecution Context\n│\n├── Memory Component\n│   └── Stores variables and functions\n│\n└── Code Component\n    └── Executes code\n```\n\nメモリコンポーネントは<b>変数環境</b>とも呼ばれます。\n\nコードコンポーネントは<b>実行のスレッド</b>とも呼ばれます。\n\n---\n\n## 2つのフェーズ\n\n実行コンテキストが作られると、JavaScriptは主に2つのフェーズを通ります:\n\n### 1. メモリ生成フェーズ\n\n<b>メモリ生成フェーズ</b>（変数と関数のためにメモリを準備するフェーズ）。\n\n例:\n\n```javascript\nvar n = 2;\n\nfunction square(num) {\n  var ans = num * num;\n  return ans;\n}\n\nvar square2 = square(n);\nvar square4 = square(4);\n```\n\nコードを実行する前に、JavaScriptはメモリを準備します:\n\n```text\nMemory\n------------------\nn       → undefined\nsquare  → function\nsquare2 → undefined\nsquare4 → undefined\n```\n\n変数には `undefined`（まだ値が代入されていないことを示す仮の値）が入ります。\n\n関数にはその関数のコードが入ります。\n\n---\n\n### 2. コード実行フェーズ\n\n<b>コード実行フェーズ</b>（JavaScriptがコードを1行ずつ実行するフェーズ）。\n\n```javascript\nvar n = 2;\n```\n\nこれで:\n\n```text\nn → undefined\n```\n\nが次のようになります:\n\n```text\nn → 2\n```\n\nそしてJavaScriptはここに到達します:\n\n```javascript\nvar square2 = square(n);\n```\n\nこの<b>関数呼び出し</b>が新しい実行コンテキストを作ります。\n\n---\n\n## 関数の実行コンテキスト\n\n関数が呼ばれるたびに、JavaScriptはその関数のための実行コンテキストを作ります。\n\n```javascript\nsquare(n);\n```\n\nはこのようなものを作ります:\n\n```text\nGlobal Execution Context\n        │\n        ↓\nSquare Execution Context\n```\n\n関数の実行コンテキストにも次があります:\n\n```text\nSquare Execution Context\n│\n├── Memory\n│   ├── num → undefined\n│   └── ans → undefined\n│\n└── Code\n```\n\n### メモリ生成\n\n```text\nnum → undefined\nans → undefined\n```\n\n### コード実行\n\n引数 `n` は `2` なので:\n\n```text\nnum → 2\n```\n\n次に:\n\n```javascript\nvar ans = num * num;\n```\n\nはこうなります:\n\n```text\nans → 4\n```\n\nそして:\n\n```javascript\nreturn ans;\n```\n\nが呼び出し元に `4` を返します。\n\n```text\nsquare(n) → 4\n\nsquare2 → 4\n```\n\n関数が終わると、その実行コンテキストは取り除かれます。\n\n---\n\n## 仮引数と実引数\n\nこの2つの用語は重要です:\n\n```javascript\nfunction square(num) {\n  return num * num;\n}\n\nsquare(2);\n```\n\n<b>仮引数（Parameter）</b>（関数側で定義された変数）:\n\n```javascript\nnum\n```\n\n<b>実引数（Argument）</b>（関数に渡される実際の値）:\n\n```javascript\n2\n```\n\nつまり:\n\n```text\nnum ← 2\n```\n\n---\n\n## コールスタック\n\nJavaScriptはこれらの実行コンテキストをどう管理するのでしょうか?\n\n<b>コールスタック</b>（今どの実行コンテキストが動いているかを追うスタック）を使います。\n\n皿の積み重ねだと考えてください。最後に置いた皿が最初に取られます。\n\nプログラムが始まったとき:\n\n```text\n┌─────────────┐\n│     GEC     │\n└─────────────┘\n```\n\n`square()` が呼ばれたとき:\n\n```text\n┌─────────────┐\n│  square()   │\n├─────────────┤\n│     GEC     │\n└─────────────┘\n```\n\n`square()` が終わったとき:\n\n```text\n┌─────────────┐\n│     GEC     │\n└─────────────┘\n```\n\n関数の実行コンテキストは<b>pop</b>（スタックの一番上から取り除かれる）されます。",
      },
      diagram: `JavaScript Program
        │
        ↓
Global Execution Context
        │
        ├── Memory Creation Phase
        │       ↓
        │   Variables → undefined
        │   Functions → function code
        │
        └── Code Execution Phase
                │
                ↓
          Function Call
                │
                ↓
       New Execution Context
                │
        ┌───────┴───────┐
        ↓               ↓
     Memory            Code
        │               │
        ↓               ↓
    Parameters       Execute function
    Variables             │
                          ↓
                       return
                          │
                          ↓
              Function Context removed


        Call Stack

        ┌───────────┐
        │  square() │  ← current
        ├───────────┤
        │   GEC     │
        └───────────┘`,
      codeExample: {
        title: { en: "Two phases, then the call stack", np: "दुई phase, त्यसपछि call stack", jp: "2つのフェーズ、そしてコールスタック" },
        code: `var n = 2;

function square(num) {
  var ans = num * num;
  return ans;
}

var square2 = square(n);
var square4 = square(4);

// 1.  Create Global Execution Context
// 2.  Memory Creation
//       n       → undefined
//       square  → function
//       square2 → undefined
//       square4 → undefined
// 3.  Code Execution: n → 2
// 4.  Call square(2)
// 5.  New Function Execution Context: num → 2, ans → 4
// 6.  return 4
// 7.  square2 → 4
// 8.  Function context is removed
// 9.  Call square(4)
// 10. New Function Execution Context: num → 4, ans → 16
// 11. return 16
// 12. square4 → 16
// 13. Program finishes`,
      },
      keyTakeaways: [
        { en: "<b>Execution Context</b> → environment where JavaScript code runs.", np: "<b>Execution Context</b> → JavaScript code चल्ने वातावरण।", jp: "<b>実行コンテキスト</b> → JavaScriptコードが動く環境。" },
        { en: "<b>Global Execution Context</b> → main context created when the program starts.", np: "<b>Global Execution Context</b> → program सुरु हुँदा बन्ने मुख्य context।", jp: "<b>グローバル実行コンテキスト</b> → プログラム開始時に作られる主なコンテキスト。" },
        { en: "<b>Memory Creation Phase</b> → prepares variables and functions.", np: "<b>Memory Creation Phase</b> → variable र function तयार गर्छ।", jp: "<b>メモリ生成フェーズ</b> → 変数と関数を準備する。" },
        { en: "<b>Code Execution Phase</b> → runs the code.", np: "<b>Code Execution Phase</b> → code चलाउँछ।", jp: "<b>コード実行フェーズ</b> → コードを実行する。" },
        { en: "Variables initially get `undefined` during memory creation in the simplified model; functions are available from that phase.", np: "सरलीकृत model मा memory creation मा variable ले सुरुमा `undefined` पाउँछन्; function त्यही phase देखि उपलब्ध हुन्छन्।", jp: "簡略化したモデルでは、メモリ生成時に変数は `undefined` になり、関数はその時点から使える。" },
        { en: "Calling a function creates a <b>new Execution Context</b>.", np: "Function call गर्दा <b>नयाँ Execution Context</b> बन्छ।", jp: "関数を呼ぶと<b>新しい実行コンテキスト</b>が作られる。" },
        { en: "<b>Parameter</b> → variable defined by the function. <b>Argument</b> → value passed to the function.", np: "<b>Parameter</b> → function ले परिभाषित गरेको variable। <b>Argument</b> → function लाई पठाइएको value।", jp: "<b>仮引数</b> → 関数が定義する変数。<b>実引数</b> → 関数に渡す値。" },
        { en: "<b>Call Stack</b> → manages the order of Execution Contexts: pushed when called, popped when finished.", np: "<b>Call Stack</b> → Execution Context को क्रम व्यवस्थापन गर्छ: call हुँदा push, सकिँदा pop।", jp: "<b>コールスタック</b> → 実行コンテキストの順序を管理する。呼ばれたらpush、終わったらpop。" },
      ],
      commonMistakes: [
        { en: "<b>Thinking the function creates an Execution Context when it is defined</b> — writing `function square() {}` creates nothing. The context appears when you call `square()`.", np: "<b>Function परिभाषित हुँदै Execution Context बन्छ भन्ने ठान्नु</b> — `function square() {}` लेख्दा केही बन्दैन। Context `square()` call गर्दा बन्छ।", jp: "<b>関数は定義した時点で実行コンテキストを作ると思う</b> — `function square() {}` を書くだけでは何も作られない。`square()` を呼んだときに作られる。" },
        { en: "<b>Confusing parameter and argument</b> — in `function add(x) {}` then `add(10)`, `x` is the parameter and `10` is the argument.", np: "<b>Parameter र argument भ्रममा पार्नु</b> — `function add(x) {}` अनि `add(10)` मा, `x` parameter हो र `10` argument हो।", jp: "<b>仮引数と実引数を混同する</b> — `function add(x) {}` に対する `add(10)` では、`x` が仮引数、`10` が実引数。" },
        { en: "<b>Thinking the function Execution Context stays forever</b> — it is removed as soon as the function returns.", np: "<b>Function को Execution Context सधैं रहन्छ भन्ने ठान्नु</b> — function return गर्ने बित्तिकै यो हट्छ।", jp: "<b>関数の実行コンテキストがずっと残ると思う</b> — 関数がreturnした時点で取り除かれる。" },
        { en: "<b>Confusing the Call Stack with an Execution Context</b> — a context is where code runs; the stack manages the order of those contexts.", np: "<b>Call Stack र Execution Context भ्रममा पार्नु</b> — context code चल्ने ठाउँ हो; stack ले ती context को क्रम व्यवस्थापन गर्छ।", jp: "<b>コールスタックと実行コンテキストを混同する</b> — コンテキストはコードが動く場所、スタックはその順序を管理する仕組み。" },
      ],
      quiz: [
        {
          question: { en: "What is created when a JavaScript program starts?", np: "JavaScript program सुरु हुँदा के बन्छ?", jp: "JavaScriptプログラムが始まると何が作られるか?" },
          options: [
            { en: "Promise", np: "Promise", jp: "Promise" },
            { en: "Global Execution Context", np: "Global Execution Context", jp: "グローバル実行コンテキスト" },
            { en: "Callback", np: "Callback", jp: "コールバック" },
          ],
          correctIndex: 1,
          explanation: { en: "The GEC is the first context; function contexts are stacked on top of it later.", np: "GEC पहिलो context हो; function context पछि यसमाथि थपिन्छन्।", jp: "GECが最初のコンテキストで、関数のコンテキストは後からその上に積まれる。" },
        },
        {
          question: { en: "What happens during the Memory Creation Phase?", np: "Memory Creation Phase मा के हुन्छ?", jp: "メモリ生成フェーズでは何が起こるか?" },
          options: [
            { en: "Code is executed", np: "Code execute हुन्छ", jp: "コードが実行される" },
            { en: "Variables and functions get memory", np: "Variable र function ले memory पाउँछन्", jp: "変数と関数にメモリが割り当てられる" },
            { en: "The program stops", np: "Program रोकिन्छ", jp: "プログラムが止まる" },
          ],
          correctIndex: 1,
          explanation: { en: "Variables are set to `undefined` and functions are stored with their code, before any line runs.", np: "कुनै line चल्नुअघि variable `undefined` मा सेट हुन्छन् र function आफ्नो code सँग राखिन्छन्।", jp: "どの行も実行される前に、変数は `undefined` に設定され、関数はコードごと保存される。" },
        },
        {
          question: { en: "What happens when a function is called?", np: "Function call हुँदा के हुन्छ?", jp: "関数が呼ばれると何が起こるか?" },
          options: [
            { en: "A new Execution Context is created", np: "नयाँ Execution Context बन्छ", jp: "新しい実行コンテキストが作られる" },
            { en: "The Call Stack disappears", np: "Call Stack हराउँछ", jp: "コールスタックが消える" },
            { en: "The browser closes", np: "Browser बन्द हुन्छ", jp: "ブラウザが閉じる" },
          ],
          correctIndex: 0,
          explanation: { en: "It is pushed onto the call stack and popped again when the function returns.", np: "यो call stack मा push हुन्छ र function return गर्दा फेरि pop हुन्छ।", jp: "コールスタックにpushされ、関数がreturnすると再びpopされる。" },
        },
        {
          question: { en: "In `function square(num) {}` called as `square(2)`, what is `2`?", np: "`function square(num) {}` लाई `square(2)` भनी call गर्दा, `2` के हो?", jp: "`function square(num) {}` を `square(2)` と呼ぶとき、`2` は何か?" },
          options: [
            { en: "Parameter", np: "Parameter", jp: "仮引数" },
            { en: "Argument", np: "Argument", jp: "実引数" },
            { en: "Variable Environment", np: "Variable Environment", jp: "変数環境" },
          ],
          correctIndex: 1,
          explanation: { en: "`num` is the parameter defined by the function; `2` is the argument passed in.", np: "`num` function ले परिभाषित गरेको parameter हो; `2` पठाइएको argument हो।", jp: "`num` は関数が定義する仮引数、`2` は渡される実引数。" },
        },
        {
          question: { en: "What does the Call Stack do?", np: "Call Stack ले के गर्छ?", jp: "コールスタックは何をするか?" },
          options: [
            { en: "Stores database data", np: "Database को data राख्छ", jp: "データベースのデータを保存する" },
            { en: "Manages the order of Execution Contexts", np: "Execution Context को क्रम व्यवस्थापन गर्छ", jp: "実行コンテキストの順序を管理する" },
            { en: "Creates HTML", np: "HTML बनाउँछ", jp: "HTMLを作る" },
          ],
          correctIndex: 1,
          explanation: { en: "Last in, first out: the newest context runs, and leaves first when it returns.", np: "Last in, first out: सबैभन्दा नयाँ context चल्छ, र return गर्दा पहिले हट्छ।", jp: "後入れ先出し: 最新のコンテキストが動き、returnすると最初に外れる。" },
        },
      ],
      youtubeId: "iLWTnMzWtj4",
    },
  ],
  finalQuiz: [
    {
      question: { en: "Which environment lets JavaScript run outside the browser?", np: "कुन environment ले JavaScript लाई browser बाहिर चलाउन दिन्छ?", jp: "JavaScriptをブラウザの外で動かせる環境はどれか?" },
      options: [
        { en: "Node.js", np: "Node.js", jp: "Node.js" },
        { en: "ECMAScript", np: "ECMAScript", jp: "ECMAScript" },
        { en: "npm", np: "npm", jp: "npm" },
      ],
      correctIndex: 0,
      explanation: { en: "Node.js gave JavaScript a server-side runtime in 2009.", np: "Node.js ले 2009 मा JavaScript लाई server-side runtime दियो।", jp: "Node.jsが2009年にサーバー側のランタイムを与えた。" },
    },
    {
      question: { en: "Which two components make up an execution context?", np: "Execution context कुन दुई component ले बन्छ?", jp: "実行コンテキストを構成する2つの部品は?" },
      options: [
        { en: "Memory and Code", np: "Memory र Code", jp: "メモリとコード" },
        { en: "Stack and Heap", np: "Stack र Heap", jp: "スタックとヒープ" },
        { en: "Browser and Server", np: "Browser र Server", jp: "ブラウザとサーバー" },
      ],
      correctIndex: 0,
      explanation: { en: "Memory holds variables and functions; Code is the thread of execution.", np: "Memory ले variable र function राख्छ; Code thread of execution हो।", jp: "メモリは変数と関数を保持し、コードは実行のスレッド。" },
    },
    {
      question: { en: "During memory creation, what value does a `var` variable get?", np: "Memory creation मा `var` variable ले कुन value पाउँछ?", jp: "メモリ生成フェーズで `var` の変数にはどの値が入るか?" },
      options: [
        { en: "`null`", np: "`null`", jp: "`null`" },
        { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
        { en: "Its final value", np: "आफ्नो अन्तिम value", jp: "最終的な値" },
      ],
      correctIndex: 1,
      explanation: { en: "The assignment happens later, in the code execution phase.", np: "Assignment पछि, code execution phase मा हुन्छ।", jp: "代入は後のコード実行フェーズで行われる。" },
    },
    {
      question: { en: "When is a function's execution context removed?", np: "Function को execution context कहिले हट्छ?", jp: "関数の実行コンテキストはいつ取り除かれるか?" },
      options: [
        { en: "When the function is defined", np: "Function परिभाषित हुँदा", jp: "関数が定義されたとき" },
        { en: "When the function returns", np: "Function return गर्दा", jp: "関数がreturnしたとき" },
        { en: "When the page closes", np: "Page बन्द हुँदा", jp: "ページを閉じたとき" },
      ],
      correctIndex: 1,
      explanation: { en: "It is popped off the call stack as soon as the function finishes.", np: "Function सकिने बित्तिकै यो call stack बाट pop हुन्छ।", jp: "関数が終わるとすぐコールスタックからpopされる。" },
    },
  ],
};
