import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_21_LESSONS: JsLessonDay = {
  day: 21,
  title: { en: "Modern web APIs — Fetch, Storage & AbortController", np: "Modern Web APIs — Fetch, Storage", jp: "Fetch・Storage・AbortController" },
  totalMinutes: 27,
  difficulty: { en: "Intermediate", np: "Intermediate", jp: "中級" },
  lessons: [
    {
      id: "fetch-api",
      title: { en: "The Fetch API", np: "Fetch API", jp: "Fetch API" },
      durationMinutes: 9,
      explanation: {
        en: "The <b>Fetch API</b> is the modern JavaScript API for making HTTP requests from the browser and other JavaScript environments.\n\n```javascript\nconst response = await fetch(\"https://api.example.com/users\");\n```\n\nThe important thing to understand is that `fetch()` does <b>not</b> immediately give you the response data. It returns a <b>Promise</b>:\n\n```text\nfetch(url)\n   │\n   ▼\nPromise\n   │\n   │ server responds\n   ▼\nResponse object\n   │\n   ▼\nresponse.json()\n   │\n   ▼\nPromise\n   │\n   ▼\nJavaScript data\n```\n\nThis is why `fetch()` works naturally with `async`/`await`.\n\n---\n\n### 1. Basic — a GET request\n\n```javascript\nconst response = await fetch(\n  \"https://api.example.com/users\"\n);\n\nconst users = await response.json();\n\nconsole.log(users);\n```\n\nThere are actually <b>two asynchronous operations</b> here. `await fetch(url)` waits for the HTTP response, and `await response.json()` reads and parses the response body.\n\n---\n\n### 2. Intermediate — always check `response.ok`\n\nOne of the biggest `fetch()` mistakes is assuming that a `404` or `500` automatically causes `fetch()` to reject. It does not.\n\n```javascript\nconst response = await fetch(\n  \"https://api.example.com/users/999\"\n);\n\nconsole.log(response.ok);     // false\nconsole.log(response.status); // 404\n```\n\n```text\n404 Not Found\n\nfetch()\n   │\n   ▼\nPromise resolves\n   │\n   ▼\nResponse\n   │\n   ├── ok: false\n   └── status: 404\n```\n\nSo handle HTTP errors yourself:\n\n```javascript\nasync function getUser(id) {\n  const response = await fetch(\n    `https://api.example.com/users/${id}`\n  );\n\n  if (!response.ok) {\n    throw new Error(\n      `Request failed: ${response.status}`\n    );\n  }\n\n  return response.json();\n}\n```\n\n```javascript\ntry {\n  const user = await getUser(10);\n  console.log(user);\n} catch (error) {\n  console.error(error);\n}\n```\n\n<b>The distinction that matters:</b>\n\n```text\nNetwork-level failure\n       │\n       ▼\nfetch rejects\n\n\nHTTP error: 404 / 500\n       │\n       ▼\nfetch resolves\n       │\n       ▼\nresponse.ok === false\n```\n\nA dropped connection or DNS failure rejects the promise. A server that answers with an error status still counts as a completed HTTP transaction.\n\n---\n\n### 3. Advanced — POST JSON data\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nconst response = await fetch(\n  \"https://api.example.com/users\",\n  {\n    method: \"POST\",\n\n    headers: {\n      \"Content-Type\": \"application/json\"\n    },\n\n    body: JSON.stringify(user)\n  }\n);\n\nif (!response.ok) {\n  throw new Error(`HTTP ${response.status}`);\n}\n\nconst createdUser = await response.json();\n```\n\nNotice `body: JSON.stringify(user)`. `fetch()` does <b>not</b> automatically turn a JavaScript object into JSON — you serialize it explicitly:\n\n```text\nJavaScript object\n      │\n      │ JSON.stringify()\n      ▼\nJSON string\n      │\n      │ HTTP request\n      ▼\nServer\n```\n\nAnd the server's JSON response travels the opposite direction:\n\n```text\nJSON response\n      │\n      │ response.json()\n      ▼\nJavaScript object\n```\n\n---\n\n### Reading the response body\n\nA `Response` offers several ways to consume its body:\n\n```javascript\nconst data = await response.json();       // parsed JavaScript data\nconst text = await response.text();       // plain text, HTML, XML\nconst blob = await response.blob();       // binary data such as images\nconst buffer = await response.arrayBuffer(); // raw bytes\n```\n\nA blob is handy for files and images:\n\n```javascript\nconst imageResponse = await fetch(\"/image.png\");\nconst imageBlob = await imageResponse.blob();\n\nconst imageUrl = URL.createObjectURL(imageBlob);\n\ndocument.querySelector(\"img\").src = imageUrl;\n```\n\n---\n\n### The body can only be consumed once\n\n```javascript\nconst response = await fetch(url);\n\nconst data = await response.json();\nconst again = await response.json(); // error\n```\n\nThe body is a <b>stream</b> that has already been consumed:\n\n```text\nResponse body\n     │\n     ▼\n response.json()\n     │\n     ▼\n   consumed\n     │\n     ▼\n cannot consume again\n```\n\nIf you genuinely need two independent reads, clone the response first:\n\n```javascript\nconst response = await fetch(url);\n\nconst copy = response.clone();\n\nconst data = await response.json();\nconst raw = await copy.text();\n```\n\n---\n\n### Request configuration\n\n`fetch()` accepts a second argument with request options:\n\n```javascript\nfetch(url, {\n  method: \"POST\",\n\n  headers: {\n    \"Content-Type\": \"application/json\",\n    \"Authorization\": \"Bearer token\"\n  },\n\n  body: JSON.stringify({ name: \"Rajan\" })\n});\n```\n\n```text\nmethod       GET, POST, PUT, PATCH, DELETE...\nheaders      HTTP headers\nbody         data sent to the server\ncredentials  cookie handling\nmode         CORS behaviour\ncache        browser HTTP cache behaviour\n```\n\n<b>`credentials`</b> controls cookies:\n\n```javascript\nfetch(\"/api/profile\", { credentials: \"include\" });\n```\n\nThe common values are `\"omit\"`, `\"same-origin\"` and `\"include\"`. Including credentials is still subject to the browser's security rules and the server's CORS configuration.\n\n<b>`headers`</b> carry metadata about the request:\n\n```javascript\nconst response = await fetch(\"/api/users\", {\n  headers: {\n    \"Authorization\": \"Bearer abc123\",\n    \"Accept\": \"application/json\"\n  }\n});\n```\n\n---\n\n### GET vs POST\n\n```text\nGET\n────\nClient ───────────────► Server\n       \"Give me users\"\n\n\nPOST\n─────\nClient ───────────────► Server\n       \"Create this user\"\n       { name: \"Rajan\" }\n```\n\n---\n\n### Production error handling\n\nA production-ready request distinguishes <b>network errors</b> from <b>HTTP errors</b>:\n\n```javascript\nasync function fetchUsers() {\n  try {\n    const response = await fetch(\"/api/users\");\n\n    if (!response.ok) {\n      throw new Error(\n        `HTTP error: ${response.status}`\n      );\n    }\n\n    return await response.json();\n  } catch (error) {\n    console.error(\"Request failed:\", error);\n    throw error;\n  }\n}\n```\n\nThe `try/catch` handles a rejected `fetch()` as well as the error you explicitly throw for a non-2xx response.\n\n---\n\n### The five rules\n\n1. `fetch()` returns a Promise.\n2. `fetch()` does not reject just because the server returns 404 or 500.\n3. Always check `response.ok` or `response.status`.\n4. Reading the response body is another asynchronous operation.\n5. A response body can normally be consumed only once.\n\n> <b>`fetch()` handles the HTTP transaction; `Response` gives you the result; body methods such as `json()` actually consume and decode the data.</b>",
        np: "<b>Fetch API</b> browser र अन्य JavaScript वातावरणबाट HTTP request गर्ने आधुनिक JavaScript API हो।\n\n```javascript\nconst response = await fetch(\"https://api.example.com/users\");\n```\n\nबुझ्नुपर्ने मुख्य कुरा — `fetch()` ले तुरुन्तै response को data दिँदैन। यसले <b>Promise</b> फर्काउँछ:\n\n```text\nfetch(url)\n   │\n   ▼\nPromise\n   │\n   │ server responds\n   ▼\nResponse object\n   │\n   ▼\nresponse.json()\n   │\n   ▼\nPromise\n   │\n   ▼\nJavaScript data\n```\n\nत्यसैले `fetch()` `async`/`await` सँग स्वाभाविक रूपमा मिल्छ।\n\n---\n\n### 1. आधारभूत — GET request\n\n```javascript\nconst response = await fetch(\n  \"https://api.example.com/users\"\n);\n\nconst users = await response.json();\n\nconsole.log(users);\n```\n\nयहाँ वास्तवमा <b>दुई asynchronous operation</b> छन्। `await fetch(url)` ले HTTP response कुर्छ, र `await response.json()` ले response body पढेर parse गर्छ।\n\n---\n\n### 2. मध्यम — सधैं `response.ok` जाँच्नुहोस्\n\n`fetch()` को सबैभन्दा ठूलो भ्रम — `404` वा `500` आउँदा `fetch()` आफैं reject हुन्छ भन्ने ठान्नु। हुँदैन।\n\n```javascript\nconst response = await fetch(\n  \"https://api.example.com/users/999\"\n);\n\nconsole.log(response.ok);     // false\nconsole.log(response.status); // 404\n```\n\n```text\n404 Not Found\n\nfetch()\n   │\n   ▼\nPromise resolves\n   │\n   ▼\nResponse\n   │\n   ├── ok: false\n   └── status: 404\n```\n\nत्यसैले HTTP error आफैं सम्हाल्नुहोस्:\n\n```javascript\nasync function getUser(id) {\n  const response = await fetch(\n    `https://api.example.com/users/${id}`\n  );\n\n  if (!response.ok) {\n    throw new Error(\n      `Request failed: ${response.status}`\n    );\n  }\n\n  return response.json();\n}\n```\n\n```javascript\ntry {\n  const user = await getUser(10);\n  console.log(user);\n} catch (error) {\n  console.error(error);\n}\n```\n\n<b>महत्वपूर्ण भिन्नता:</b>\n\n```text\nNetwork-level failure\n       │\n       ▼\nfetch rejects\n\n\nHTTP error: 404 / 500\n       │\n       ▼\nfetch resolves\n       │\n       ▼\nresponse.ok === false\n```\n\nConnection टुट्नु वा DNS असफल हुनुले promise reject गर्छ। Error status दिने server ले भने HTTP transaction पूरा गरेकै मानिन्छ।\n\n---\n\n### 3. उन्नत — JSON data POST गर्नु\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nconst response = await fetch(\n  \"https://api.example.com/users\",\n  {\n    method: \"POST\",\n\n    headers: {\n      \"Content-Type\": \"application/json\"\n    },\n\n    body: JSON.stringify(user)\n  }\n);\n\nif (!response.ok) {\n  throw new Error(`HTTP ${response.status}`);\n}\n\nconst createdUser = await response.json();\n```\n\n`body: JSON.stringify(user)` मा ध्यान दिनुहोस्। `fetch()` ले JavaScript object लाई स्वतः JSON बनाउँदैन — तपाईंले स्पष्ट रूपमा serialize गर्नुपर्छ:\n\n```text\nJavaScript object\n      │\n      │ JSON.stringify()\n      ▼\nJSON string\n      │\n      │ HTTP request\n      ▼\nServer\n```\n\nServer को JSON response उल्टो दिशामा आउँछ:\n\n```text\nJSON response\n      │\n      │ response.json()\n      ▼\nJavaScript object\n```\n\n---\n\n### Response body पढ्नु\n\n`Response` ले body खपत गर्ने धेरै तरिका दिन्छ:\n\n```javascript\nconst data = await response.json();       // parse भएको JavaScript data\nconst text = await response.text();       // सादा text, HTML, XML\nconst blob = await response.blob();       // image जस्तो binary data\nconst buffer = await response.arrayBuffer(); // कच्चा byte\n```\n\nFile र image का लागि blob उपयोगी छ:\n\n```javascript\nconst imageResponse = await fetch(\"/image.png\");\nconst imageBlob = await imageResponse.blob();\n\nconst imageUrl = URL.createObjectURL(imageBlob);\n\ndocument.querySelector(\"img\").src = imageUrl;\n```\n\n---\n\n### Body एक पटक मात्र खपत हुन्छ\n\n```javascript\nconst response = await fetch(url);\n\nconst data = await response.json();\nconst again = await response.json(); // error\n```\n\nBody एउटा <b>stream</b> हो जुन पहिले नै खपत भइसक्यो:\n\n```text\nResponse body\n     │\n     ▼\n response.json()\n     │\n     ▼\n   consumed\n     │\n     ▼\n cannot consume again\n```\n\nसाँच्चै दुई पटक पढ्नुपर्ने भए, पहिले response clone गर्नुहोस्:\n\n```javascript\nconst response = await fetch(url);\n\nconst copy = response.clone();\n\nconst data = await response.json();\nconst raw = await copy.text();\n```\n\n---\n\n### Request configuration\n\n`fetch()` ले request option भएको दोस्रो argument लिन्छ:\n\n```javascript\nfetch(url, {\n  method: \"POST\",\n\n  headers: {\n    \"Content-Type\": \"application/json\",\n    \"Authorization\": \"Bearer token\"\n  },\n\n  body: JSON.stringify({ name: \"Rajan\" })\n});\n```\n\n```text\nmethod       GET, POST, PUT, PATCH, DELETE...\nheaders      HTTP header\nbody         server लाई पठाइने data\ncredentials  cookie व्यवस्थापन\nmode         CORS व्यवहार\ncache        browser HTTP cache व्यवहार\n```\n\n<b>`credentials`</b> ले cookie नियन्त्रण गर्छ:\n\n```javascript\nfetch(\"/api/profile\", { credentials: \"include\" });\n```\n\nसामान्य मान `\"omit\"`, `\"same-origin\"` र `\"include\"` हुन्। Credential पठाउँदा पनि browser को सुरक्षा नियम र server को CORS विन्यास लागू हुन्छ।\n\n<b>`headers`</b> ले request बारे metadata बोक्छ:\n\n```javascript\nconst response = await fetch(\"/api/users\", {\n  headers: {\n    \"Authorization\": \"Bearer abc123\",\n    \"Accept\": \"application/json\"\n  }\n});\n```\n\n---\n\n### GET vs POST\n\n```text\nGET\n────\nClient ───────────────► Server\n       \"Give me users\"\n\n\nPOST\n─────\nClient ───────────────► Server\n       \"Create this user\"\n       { name: \"Rajan\" }\n```\n\n---\n\n### Production मा error handling\n\nProduction-योग्य request ले <b>network error</b> र <b>HTTP error</b> छुट्याउँछ:\n\n```javascript\nasync function fetchUsers() {\n  try {\n    const response = await fetch(\"/api/users\");\n\n    if (!response.ok) {\n      throw new Error(\n        `HTTP error: ${response.status}`\n      );\n    }\n\n    return await response.json();\n  } catch (error) {\n    console.error(\"Request failed:\", error);\n    throw error;\n  }\n}\n```\n\n`try/catch` ले reject भएको `fetch()` र non-2xx का लागि तपाईंले throw गरेको error दुबै सम्हाल्छ।\n\n---\n\n### पाँच नियम\n\n1. `fetch()` ले Promise फर्काउँछ।\n2. Server ले 404 वा 500 दिँदैमा `fetch()` reject हुँदैन।\n3. सधैं `response.ok` वा `response.status` जाँच्नुहोस्।\n4. Response body पढ्नु अर्को asynchronous operation हो।\n5. Response body सामान्यतया एक पटक मात्र खपत हुन्छ।\n\n> <b>`fetch()` ले HTTP transaction सम्हाल्छ; `Response` ले नतिजा दिन्छ; `json()` जस्ता body method ले वास्तवमा data खपत गरी decode गर्छन्।</b>",
        jp: "<b>Fetch API</b> は、ブラウザなどのJavaScript環境からHTTPリクエストを送るための最新のAPIです。\n\n```javascript\nconst response = await fetch(\"https://api.example.com/users\");\n```\n\n大切なのは、`fetch()` がレスポンスのデータをすぐには返さないことです。返すのは<b>Promise</b>です:\n\n```text\nfetch(url)\n   │\n   ▼\nPromise\n   │\n   │ server responds\n   ▼\nResponse object\n   │\n   ▼\nresponse.json()\n   │\n   ▼\nPromise\n   │\n   ▼\nJavaScript data\n```\n\nだから `fetch()` は `async`/`await` と自然に噛み合います。\n\n---\n\n### 1. 基本 — GETリクエスト\n\n```javascript\nconst response = await fetch(\n  \"https://api.example.com/users\"\n);\n\nconst users = await response.json();\n\nconsole.log(users);\n```\n\nここには実は<b>2つの非同期処理</b>があります。`await fetch(url)` はHTTPレスポンスを待ち、`await response.json()` は本文を読み取って解析します。\n\n---\n\n### 2. 中級 — 必ず `response.ok` を確認する\n\n`fetch()` の最大の誤解は、`404` や `500` なら自動的に拒否されると思うことです。そうはなりません。\n\n```javascript\nconst response = await fetch(\n  \"https://api.example.com/users/999\"\n);\n\nconsole.log(response.ok);     // false\nconsole.log(response.status); // 404\n```\n\n```text\n404 Not Found\n\nfetch()\n   │\n   ▼\nPromise resolves\n   │\n   ▼\nResponse\n   │\n   ├── ok: false\n   └── status: 404\n```\n\nしたがってHTTPエラーは自分で扱います:\n\n```javascript\nasync function getUser(id) {\n  const response = await fetch(\n    `https://api.example.com/users/${id}`\n  );\n\n  if (!response.ok) {\n    throw new Error(\n      `Request failed: ${response.status}`\n    );\n  }\n\n  return response.json();\n}\n```\n\n```javascript\ntry {\n  const user = await getUser(10);\n  console.log(user);\n} catch (error) {\n  console.error(error);\n}\n```\n\n<b>重要な区別:</b>\n\n```text\nNetwork-level failure\n       │\n       ▼\nfetch rejects\n\n\nHTTP error: 404 / 500\n       │\n       ▼\nfetch resolves\n       │\n       ▼\nresponse.ok === false\n```\n\n接続断やDNSの失敗はPromiseを拒否します。エラーステータスを返すサーバーは、HTTPのやり取り自体は完了しています。\n\n---\n\n### 3. 上級 — JSONをPOSTする\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nconst response = await fetch(\n  \"https://api.example.com/users\",\n  {\n    method: \"POST\",\n\n    headers: {\n      \"Content-Type\": \"application/json\"\n    },\n\n    body: JSON.stringify(user)\n  }\n);\n\nif (!response.ok) {\n  throw new Error(`HTTP ${response.status}`);\n}\n\nconst createdUser = await response.json();\n```\n\n`body: JSON.stringify(user)` に注目してください。`fetch()` はJavaScriptオブジェクトを自動でJSONにはしません。明示的に直列化します:\n\n```text\nJavaScript object\n      │\n      │ JSON.stringify()\n      ▼\nJSON string\n      │\n      │ HTTP request\n      ▼\nServer\n```\n\nサーバーからのJSONは逆向きに流れます:\n\n```text\nJSON response\n      │\n      │ response.json()\n      ▼\nJavaScript object\n```\n\n---\n\n### レスポンス本文の読み方\n\n`Response` は本文を消費する方法をいくつか提供します:\n\n```javascript\nconst data = await response.json();       // 解析済みのデータ\nconst text = await response.text();       // テキスト・HTML・XML\nconst blob = await response.blob();       // 画像などのバイナリ\nconst buffer = await response.arrayBuffer(); // 生のバイト列\n```\n\nファイルや画像にはblobが便利です:\n\n```javascript\nconst imageResponse = await fetch(\"/image.png\");\nconst imageBlob = await imageResponse.blob();\n\nconst imageUrl = URL.createObjectURL(imageBlob);\n\ndocument.querySelector(\"img\").src = imageUrl;\n```\n\n---\n\n### 本文は一度しか消費できない\n\n```javascript\nconst response = await fetch(url);\n\nconst data = await response.json();\nconst again = await response.json(); // エラー\n```\n\n本文はすでに消費された<b>ストリーム</b>だからです:\n\n```text\nResponse body\n     │\n     ▼\n response.json()\n     │\n     ▼\n   consumed\n     │\n     ▼\n cannot consume again\n```\n\n本当に2回読む必要があるなら、先にレスポンスを複製します:\n\n```javascript\nconst response = await fetch(url);\n\nconst copy = response.clone();\n\nconst data = await response.json();\nconst raw = await copy.text();\n```\n\n---\n\n### リクエストの設定\n\n`fetch()` は第2引数にオプションを受け取ります:\n\n```javascript\nfetch(url, {\n  method: \"POST\",\n\n  headers: {\n    \"Content-Type\": \"application/json\",\n    \"Authorization\": \"Bearer token\"\n  },\n\n  body: JSON.stringify({ name: \"Rajan\" })\n});\n```\n\n```text\nmethod       GET, POST, PUT, PATCH, DELETE...\nheaders      HTTPヘッダー\nbody         サーバーへ送るデータ\ncredentials  クッキーの扱い\nmode         CORSの挙動\ncache        ブラウザHTTPキャッシュの挙動\n```\n\n<b>`credentials`</b> はクッキーを制御します:\n\n```javascript\nfetch(\"/api/profile\", { credentials: \"include\" });\n```\n\nよく使う値は `\"omit\"`・`\"same-origin\"`・`\"include\"` です。資格情報を含める場合も、ブラウザの安全規則とサーバーのCORS設定に従います。\n\n<b>`headers`</b> はリクエストのメタ情報を運びます:\n\n```javascript\nconst response = await fetch(\"/api/users\", {\n  headers: {\n    \"Authorization\": \"Bearer abc123\",\n    \"Accept\": \"application/json\"\n  }\n});\n```\n\n---\n\n### GETとPOST\n\n```text\nGET\n────\nClient ───────────────► Server\n       \"Give me users\"\n\n\nPOST\n─────\nClient ───────────────► Server\n       \"Create this user\"\n       { name: \"Rajan\" }\n```\n\n---\n\n### 本番向けのエラー処理\n\n本番のリクエストは<b>ネットワークエラー</b>と<b>HTTPエラー</b>を区別します:\n\n```javascript\nasync function fetchUsers() {\n  try {\n    const response = await fetch(\"/api/users\");\n\n    if (!response.ok) {\n      throw new Error(\n        `HTTP error: ${response.status}`\n      );\n    }\n\n    return await response.json();\n  } catch (error) {\n    console.error(\"Request failed:\", error);\n    throw error;\n  }\n}\n```\n\n`try/catch` は拒否された `fetch()` も、2xx以外に対して自分でthrowしたエラーも受け止めます。\n\n---\n\n### 5つの規則\n\n1. `fetch()` はPromiseを返す。\n2. サーバーが404や500を返しても `fetch()` は拒否しない。\n3. 必ず `response.ok` か `response.status` を確認する。\n4. 本文の読み取りはもう1つの非同期処理。\n5. レスポンス本文は通常1回しか消費できない。\n\n> <b>`fetch()` はHTTPのやり取りを担い、`Response` は結果を渡し、`json()` などの本文メソッドが実際にデータを消費して復号する。</b>",
      },
      diagram: `Your JavaScript
      │
      │ fetch()
      ▼
HTTP Request
      │
      ├── GET
      ├── POST
      ├── PUT
      └── DELETE
      │
      ▼
     Server
      │
      ▼
HTTP Response
      │
      ▼
Response object
      │
      ├── status
      ├── headers
      ├── ok
      └── body
             │
             ▼
       response.json()
             │
             ▼
        JavaScript data


Two different failures, two different paths

Network-level failure          HTTP error: 404 / 500
       │                              │
       ▼                              ▼
 fetch rejects                  fetch resolves
       │                              │
       ▼                              ▼
   catch block                 response.ok === false


The body is a one-shot stream

Response body
     │
     ▼
 response.json()
     │
     ▼
   consumed
     │
     ▼
 cannot consume again`,
      codeExample: {
        title: { en: "From request to parsed data", np: "Request देखि parse भएको data सम्म", jp: "リクエストから解析済みデータまで" },
        code: `// ── 1. Basic — two awaits, not one ────────────────────────────────
const response = await fetch("https://api.example.com/users");
const users = await response.json(); // reading the body is async too

// ── 2. Intermediate — a 404 still resolves ────────────────────────
async function getUser(id) {
  const response = await fetch(\`https://api.example.com/users/\${id}\`);

  if (!response.ok) {
    // fetch never threw here; the status has to be checked by hand
    throw new Error(\`Request failed: \${response.status}\`);
  }

  return response.json();
}

// ── 3. Advanced — POST JSON with the right headers ────────────────
const created = await fetch("https://api.example.com/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Rajan", age: 30 }), // not automatic
});

// ── Other ways to read the body ───────────────────────────────────
// await response.text();        plain text, HTML, XML
// await response.blob();        images and files
// await response.arrayBuffer(); raw bytes

// ── The body is consumed once, so clone for a second read ─────────
const res = await fetch(url);
const copy = res.clone();

const data = await res.json();
const raw = await copy.text();

// ── Production shape: network errors and HTTP errors together ─────
async function fetchUsers() {
  try {
    const response = await fetch("/api/users");
    if (!response.ok) throw new Error(\`HTTP error: \${response.status}\`);
    return await response.json();
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
}`,
      },
      keyTakeaways: [
        { en: "`fetch()` returns a <b>`Promise<Response>`</b>, not the data itself.", np: "`fetch()` ले data होइन, <b>`Promise<Response>`</b> फर्काउँछ।", jp: "`fetch()` が返すのはデータではなく<b>`Promise<Response>`</b>。" },
        { en: "Reading the body with `json()`, `text()` or `blob()` is a <b>second asynchronous step</b>.", np: "`json()`, `text()` वा `blob()` ले body पढ्नु <b>दोस्रो asynchronous चरण</b> हो।", jp: "`json()`・`text()`・`blob()` による本文の読み取りは<b>2つ目の非同期処理</b>。" },
        { en: "`fetch()` <b>does not reject</b> on 404 or 500 — only network-level failures reject.", np: "404 वा 500 मा `fetch()` <b>reject हुँदैन</b> — network-स्तरका असफलतामा मात्र reject हुन्छ।", jp: "404や500で `fetch()` は<b>拒否されない</b>。拒否されるのはネットワークレベルの失敗だけ。" },
        { en: "Always check <b>`response.ok`</b> or `response.status` before using the data.", np: "Data प्रयोग गर्नुअघि सधैं <b>`response.ok`</b> वा `response.status` जाँच्नुहोस्।", jp: "データを使う前に必ず<b>`response.ok`</b> か `response.status` を確認する。" },
        { en: "`fetch()` does not serialize automatically — send objects with <b>`JSON.stringify()`</b> and a `Content-Type` header.", np: "`fetch()` ले स्वतः serialize गर्दैन — object पठाउँदा <b>`JSON.stringify()`</b> र `Content-Type` header दिनुहोस्।", jp: "`fetch()` は自動で直列化しない。オブジェクトは<b>`JSON.stringify()`</b> と `Content-Type` ヘッダーで送る。" },
        { en: "A response body is a stream that can normally be <b>consumed only once</b>; use `response.clone()` for a second read.", np: "Response body एउटा stream हो जुन सामान्यतया <b>एक पटक मात्र खपत</b> हुन्छ; दोस्रो पटक पढ्न `response.clone()` प्रयोग गर्नुहोस्।", jp: "レスポンス本文は通常<b>1回しか消費できない</b>ストリーム。2回読むには `response.clone()`。" },
        { en: "The second `fetch()` argument carries `method`, `headers`, `body`, `credentials`, `mode` and `cache`.", np: "`fetch()` को दोस्रो argument ले `method`, `headers`, `body`, `credentials`, `mode` र `cache` बोक्छ।", jp: "`fetch()` の第2引数が `method`・`headers`・`body`・`credentials`・`mode`・`cache` を運ぶ。" },
      ],
      commonMistakes: [
        { en: "<b>Assuming `fetch()` rejects on 404</b> — a `try/catch` around `fetch(\"/missing\")` still reaches the success branch, because the HTTP request itself completed. Check `response.ok` and throw yourself.", np: "<b>404 मा `fetch()` reject हुन्छ भन्ने ठान्नु</b> — `fetch(\"/missing\")` वरिपरिको `try/catch` अझै success शाखामै पुग्छ, किनकि HTTP request आफैं पूरा भयो। `response.ok` जाँचेर आफैं throw गर्नुहोस्।", jp: "<b>404で `fetch()` が拒否されると思う</b> — `fetch(\"/missing\")` を `try/catch` で囲んでも成功側に進む。HTTPのやり取り自体は完了しているため。`response.ok` を確認して自分でthrowする。" },
        { en: "<b>Forgetting to parse the response</b> — `console.log(response)` prints a `Response` object, not your users. You still need `await response.json()`.", np: "<b>Response parse गर्न बिर्सनु</b> — `console.log(response)` ले तपाईंको user होइन, `Response` object देखाउँछ। `await response.json()` अझै चाहिन्छ।", jp: "<b>レスポンスの解析を忘れる</b> — `console.log(response)` はユーザーではなく `Response` オブジェクトを出す。`await response.json()` が必要。" },
        { en: "<b>Forgetting `JSON.stringify()`</b> — passing `body: { name: \"Rajan\" }` does not send JSON. Serialize the object and set `Content-Type: application/json`.", np: "<b>`JSON.stringify()` बिर्सनु</b> — `body: { name: \"Rajan\" }` दिँदा JSON पठाइँदैन। Object serialize गरी `Content-Type: application/json` सेट गर्नुहोस्।", jp: "<b>`JSON.stringify()` を忘れる</b> — `body: { name: \"Rajan\" }` ではJSONは送られない。直列化し `Content-Type: application/json` を設定する。" },
        { en: "<b>Reading the body twice</b> — calling `response.json()` and then `response.text()` on the same response throws, because the stream is already consumed. Call `response.clone()` first.", np: "<b>Body दुई पटक पढ्नु</b> — एउटै response मा `response.json()` अनि `response.text()` बोलाउँदा error आउँछ, किनकि stream पहिले नै खपत भइसक्यो। पहिले `response.clone()` बोलाउनुहोस्।", jp: "<b>本文を2回読む</b> — 同じレスポンスで `response.json()` の後に `response.text()` を呼ぶと例外になる。先に `response.clone()` を呼ぶ。" },
      ],
      quiz: [
        {
          question: { en: "What does `fetch()` return?", np: "`fetch()` ले के फर्काउँछ?", jp: "`fetch()` は何を返すか?" },
          options: [
            { en: "A `Response`", np: "एउटा `Response`", jp: "`Response`" },
            { en: "A `Promise` that resolves to a `Response`", np: "`Response` मा resolve हुने `Promise`", jp: "`Response` に解決される `Promise`" },
            { en: "A JSON object", np: "एउटा JSON object", jp: "JSONオブジェクト" },
            { en: "A string", np: "एउटा string", jp: "文字列" },
          ],
          correctIndex: 1,
          explanation: { en: "That is why `fetch()` pairs naturally with `await`.", np: "त्यसैले `fetch()` `await` सँग स्वाभाविक रूपमा मिल्छ।", jp: "だから `fetch()` は `await` と自然に組み合わさる。" },
        },
        {
          question: { en: "What happens when the server returns `404`?", np: "Server ले `404` फर्काउँदा के हुन्छ?", jp: "サーバーが `404` を返すとどうなるか?" },
          options: [
            { en: "`fetch()` always rejects", np: "`fetch()` सधैं reject हुन्छ", jp: "`fetch()` は必ず拒否される" },
            { en: "The browser crashes", np: "Browser crash हुन्छ", jp: "ブラウザがクラッシュする" },
            { en: "`fetch()` resolves with `response.ok === false`", np: "`response.ok === false` सहित `fetch()` resolve हुन्छ", jp: "`response.ok === false` で解決される" },
            { en: "`fetch()` retries automatically", np: "`fetch()` आफैं फेरि प्रयास गर्छ", jp: "`fetch()` が自動で再試行する" },
          ],
          correctIndex: 2,
          explanation: { en: "Only network-level failures reject the promise.", np: "Network-स्तरका असफलताले मात्र promise reject गर्छन्।", jp: "Promiseを拒否するのはネットワークレベルの失敗だけ。" },
        },
        {
          question: { en: "How do you parse a JSON response?", np: "JSON response कसरी parse गर्ने?", jp: "JSONレスポンスはどう解析するか?" },
          options: [
            { en: "`response.parse()`", np: "`response.parse()`", jp: "`response.parse()`" },
            { en: "`response.json()`", np: "`response.json()`", jp: "`response.json()`" },
            { en: "`JSON.parse(response)`", np: "`JSON.parse(response)`", jp: "`JSON.parse(response)`" },
            { en: "`response.data()`", np: "`response.data()`", jp: "`response.data()`" },
          ],
          correctIndex: 1,
          explanation: { en: "It returns a promise, so it needs its own `await`.", np: "यसले promise फर्काउँछ, त्यसैले छुट्टै `await` चाहिन्छ।", jp: "Promiseを返すので、それ自体に `await` が要る。" },
        },
        {
          question: { en: "Why use `JSON.stringify()` when sending JSON?", np: "JSON पठाउँदा `JSON.stringify()` किन प्रयोग गर्ने?", jp: "JSONを送るとき `JSON.stringify()` を使う理由は?" },
          options: [
            { en: "To encrypt the request", np: "Request encrypt गर्न", jp: "リクエストを暗号化するため" },
            { en: "To convert a JavaScript object into a JSON string", np: "JavaScript object लाई JSON string बनाउन", jp: "JavaScriptオブジェクトをJSON文字列に変換するため" },
            { en: "To parse the response", np: "Response parse गर्न", jp: "レスポンスを解析するため" },
            { en: "To create a Promise", np: "Promise बनाउन", jp: "Promiseを作るため" },
          ],
          correctIndex: 1,
          explanation: { en: "`fetch()` does not serialize the body for you.", np: "`fetch()` ले तपाईंका लागि body serialize गर्दैन।", jp: "`fetch()` は本文を代わりに直列化してくれない。" },
        },
        {
          question: { en: "What happens when `response.json()` is called twice on the same response?", np: "एउटै response मा `response.json()` दुई पटक बोलाउँदा के हुन्छ?", jp: "同じレスポンスで `response.json()` を2回呼ぶとどうなるか?" },
          options: [
            { en: "Both calls work", np: "दुबै call काम गर्छन्", jp: "両方とも動く" },
            { en: "The second returns the same data", np: "दोस्रोले उही data फर्काउँछ", jp: "2回目も同じデータを返す" },
            { en: "The second consumption fails", np: "दोस्रो खपत असफल हुन्छ", jp: "2回目の消費が失敗する" },
            { en: "The request runs twice", np: "Request दुई पटक चल्छ", jp: "リクエストが2回走る" },
          ],
          correctIndex: 2,
          explanation: { en: "Clone the response first when you genuinely need two reads.", np: "साँच्चै दुई पटक पढ्नुपर्ने भए पहिले response clone गर्नुहोस्।", jp: "本当に2回読むなら、先にレスポンスを複製する。" },
        },
      ],
    },
    {
      id: "abortcontroller",
      title: { en: "AbortController — Cancelling Requests", np: "AbortController — Requests Cancel गर्नु", jp: "AbortController — リクエストのキャンセル" },
      durationMinutes: 9,
      explanation: {
        en: "An `AbortController` is a small standalone object with one job: giving you a way to cancel an in-flight operation. Calling `new AbortController()` gives you a `.signal` property (an `AbortSignal`) and an `.abort()` method. You pass the `signal` into `fetch`'s options object (`fetch(url, { signal })`), and later, calling `controller.abort()` immediately cancels that request — the `fetch` promise rejects with an error whose `.name` is `\"AbortError\"`. Because `AbortError` is a normal rejection, you distinguish it from a genuine failure inside your `catch` block by checking `err.name`, so you don't accidentally show the user an error message for a cancellation they caused on purpose.\n\nThis matters most inside component lifecycles: a component might start a `fetch` in a `useEffect`, but if the component unmounts (the user navigates away) before the response arrives, setting state from that stale response can throw warnings or cause bugs. The fix is to create one `AbortController` per effect run, pass its signal into `fetch`, and return a cleanup function that calls `controller.abort()` — React calls that cleanup automatically right before the effect re-runs or the component unmounts, so any request that hasn't resolved yet is cancelled cleanly.\n\nTwo very common patterns build directly on this. A <b>fetch timeout</b> — since `fetch` itself has no built-in timeout — pairs `AbortController` with `setTimeout`: start a timer that calls `controller.abort()` after N milliseconds, and clear that timer if the request finishes first. A <b>debounced search box</b> uses the same idea to avoid race conditions: every time the user types, abort whatever search request is still in flight before starting a new one, so an old, slow response can never overwrite the results of a newer, faster one.",
        np: "`AbortController` एउटा सानो standalone object हो जसको काम एउटै हो: in-flight operation cancel गर्ने तरिका दिनु। `new AbortController()` ले `.signal` property (एउटा `AbortSignal`) र `.abort()` method दिन्छ। `signal` लाई `fetch` को options object मा pass गरिन्छ (`fetch(url, { signal })`), र पछि `controller.abort()` call गर्दा त्यो request तुरुन्तै cancel हुन्छ — `fetch` promise `.name` `\"AbortError\"` भएको error सँग reject हुन्छ। `AbortError` सामान्य rejection नै भएकाले, `catch` block भित्र `err.name` check गरेर यसलाई genuine failure बाट छुट्याउनुपर्छ, ताकि आफैले जानाजानी गरेको cancellation लाई error message को रूपमा user लाई नदेखाइन्।\n\nयो component lifecycles भित्र सबैभन्दा महत्वपूर्ण हुन्छ: कुनै component ले `useEffect` भित्र `fetch` सुरु गर्न सक्छ, तर response आउनु अघि नै component unmount भएमा (user अन्तै गएमा), त्यो stale response बाट state set गर्दा warnings वा bugs आउन सक्छन्। Fix भनेको हरेक effect run का लागि एउटा `AbortController` बनाउने, त्यसको signal `fetch` मा pass गर्ने, र `controller.abort()` call गर्ने cleanup function return गर्ने हो — React ले effect फेरि चल्नु अघि वा component unmount हुनु अघि नै त्यो cleanup automatic रूपमा call गर्छ, त्यसैले resolve नभएको जुनसुकै request cleanly cancel हुन्छ।\n\nयसैमा आधारित दुई निकै common patterns छन्। <b>Fetch timeout</b> — किनकि `fetch` मा आफैं built-in timeout हुँदैन — `AbortController` लाई `setTimeout` सँग जोड्छ: N milliseconds पछि `controller.abort()` call गर्ने timer सुरु गर्नुहोस्, र request पहिले नै पूरा भएमा त्यो timer clear गर्नुहोस्। <b>Debounced search box</b> ले उही idea प्रयोग गरी race conditions रोक्छ: user ले टाइप गर्दा हरेक पटक, नयाँ request सुरु गर्नु अघि in-flight रहेको पुरानो search request abort गरिन्छ, ताकि पुरानो ढिलो response ले नयाँ छिटो response को result कहिल्यै overwrite नगरोस्।",
        jp: "`AbortController`は1つの仕事だけを持つ小さな単独オブジェクト — 実行中の処理をキャンセルする手段を提供する。`new AbortController()`は`.signal`プロパティ（`AbortSignal`）と`.abort()`メソッドを返す。その`signal`を`fetch`のオプションに渡し（`fetch(url, { signal })`）、後で`controller.abort()`を呼ぶとそのリクエストは即座にキャンセルされる — `fetch`のPromiseは`.name`が`\"AbortError\"`であるエラーでrejectされる。`AbortError`は通常のrejectionなので、`catch`ブロック内で`err.name`を確認して本当の失敗と区別する必要がある。そうしないと、自分で意図的に起こしたキャンセルに対してユーザーにエラーメッセージを表示してしまう。\n\nこれはコンポーネントのライフサイクル内で特に重要になる。コンポーネントが`useEffect`内で`fetch`を開始しても、応答が届く前にコンポーネントがアンマウントされる（ユーザーが離脱する）と、その古い応答からstateを設定すると警告やバグの原因になる。解決策は各エフェクト実行ごとに1つの`AbortController`を作り、そのsignalを`fetch`に渡し、`controller.abort()`を呼ぶクリーンアップ関数を返すこと — Reactはエフェクトが再実行される直前やコンポーネントがアンマウントされる直前にそのクリーンアップを自動で呼ぶため、まだ解決していないリクエストはきれいにキャンセルされる。\n\nこの上に2つの非常によくあるパターンが成り立つ。<b>fetchのタイムアウト</b> — `fetch`自体には組み込みのタイムアウトがないため — `AbortController`を`setTimeout`と組み合わせる: Nミリ秒後に`controller.abort()`を呼ぶタイマーを開始し、リクエストが先に完了したらそのタイマーをクリアする。<b>デバウンスされた検索ボックス</b>は同じ考え方でレースコンディションを防ぐ: ユーザーが入力するたびに、新しいリクエストを開始する前に実行中の古い検索リクエストをabortし、古く遅い応答が新しく速い応答の結果を上書きすることを防ぐ。",
      },
      diagram: `const controller = new AbortController();
fetch(url, { signal: controller.signal })
      │
      ├─ request completes normally   → Promise RESOLVES
      │
      └─ controller.abort() called    → Promise REJECTS
                                           err.name === "AbortError"

Cleanup pattern (e.g. inside useEffect):

  mount ──► new controller ──► fetch(url,{signal}) ──► setState(data)
                                      │
  unmount ─────────────────────► controller.abort()  ← cleanup fn, runs first

Fetch timeout:                 Debounced search:
  setTimeout(5000ms) ─┐          keystroke 1 → controller1 = new fetch
  controller.abort() ◄┘          keystroke 2 → controller1.abort() [cancel old]
  (fires if request               → controller2 = new fetch
   is too slow)                  keystroke 3 → controller2.abort(), controller3 = new fetch
                                   → only the LAST request's response survives`,
      codeExample: {
        title: { en: "Cancelling fetch requests with AbortController", np: "AbortController सँग fetch requests cancel गर्नु", jp: "AbortControllerでfetchリクエストをキャンセルする" },
        code: `// ── Basic cancellation ────────────────────────────────────────────
const controller = new AbortController();

fetch("/api/report", { signal: controller.signal })
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => {
    if (err.name === "AbortError") {
      console.log("Request was cancelled — not a real error");
    } else {
      console.error("Fetch actually failed:", err);
    }
  });

controller.abort();   // cancel it — the promise above rejects with AbortError

// ── Cancel on unmount inside a React component ─────────────────────
useEffect(() => {
  const controller = new AbortController();

  async function loadReport() {
    try {
      const res = await fetch("/api/report", { signal: controller.signal });
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      setReport(await res.json());
    } catch (err) {
      if (err.name !== "AbortError") setError(err);   // ignore expected cancellations
    }
  }

  loadReport();
  return () => controller.abort();   // runs before the next effect / on unmount
}, [reportId]);

// ── Timeout wrapper — abort if the server is too slow ───────────────
async function fetchWithTimeout(url, timeoutMs = 5000, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } catch (err) {
    if (err.name === "AbortError") throw new Error(\`Timed out after \${timeoutMs}ms\`);
    throw err;
  } finally {
    clearTimeout(timer);   // no leftover timer either way
  }
}

// ── Debounced search — always cancel the previous in-flight request ─
let activeController = null;

searchInput.addEventListener("input", async (event) => {
  activeController?.abort();          // kill whatever search was still running
  activeController = new AbortController();

  try {
    const res = await fetch(
      \`/api/search?q=\${encodeURIComponent(event.target.value)}\`,
      { signal: activeController.signal }
    );
    renderResults(await res.json());
  } catch (err) {
    if (err.name !== "AbortError") showError(err);
  }
});`,
      },
      keyTakeaways: [
        { en: "Pass `controller.signal` into `fetch`'s options; calling `controller.abort()` rejects that fetch with an `AbortError` — check `err.name` to tell it apart from a real failure.", np: "`controller.signal` लाई `fetch` को options मा pass गर्नुहोस्; `controller.abort()` call गर्दा त्यो fetch `AbortError` सँग reject हुन्छ — genuine failure बाट छुट्याउन `err.name` check गर्नुहोस्।", jp: "`controller.signal`を`fetch`のオプションに渡す。`controller.abort()`を呼ぶとそのfetchは`AbortError`でrejectされる — 本当の失敗と区別するには`err.name`を確認する。" },
        { en: "Create one `AbortController` per effect run and call `.abort()` in the effect's cleanup function so a component never sets state from a stale, unmounted request.", np: "हरेक effect run का लागि एउटा `AbortController` बनाउनुहोस् र effect को cleanup function मा `.abort()` call गर्नुहोस्, ताकि component ले कहिल्यै stale, unmounted request बाट state set नगरोस्।", jp: "各エフェクト実行ごとに1つの`AbortController`を作り、エフェクトのクリーンアップ関数で`.abort()`を呼ぶことで、コンポーネントが古い・アンマウント済みのリクエストからstateを設定することを防ぐ。" },
        { en: "A fetch timeout pairs `setTimeout` with `controller.abort()`; a debounced search aborts the previous controller before every new request so an old response can never overwrite a newer one.", np: "Fetch timeout ले `setTimeout` लाई `controller.abort()` सँग जोड्छ; debounced search ले हरेक नयाँ request अघि पुरानो controller abort गर्छ ताकि पुरानो response ले नयाँलाई कहिल्यै overwrite नगरोस्।", jp: "fetchのタイムアウトは`setTimeout`と`controller.abort()`を組み合わせる。デバウンスされた検索は新しいリクエストごとに前のコントローラーをabortし、古い応答が新しい応答を上書きすることを防ぐ。" },
      ],
      commonMistakes: [
        { en: "Not checking `err.name === \"AbortError\"` in the `catch` block, so an intentional cancellation gets displayed to the user as a real error.", np: "`catch` block मा `err.name === \"AbortError\"` check नगर्नु, जसले गर्दा जानाजानी गरेको cancellation लाई user लाई real error को रूपमा देखाइन्छ।", jp: "`catch`ブロックで`err.name === \"AbortError\"`を確認せず、意図的なキャンセルがユーザーに本当のエラーとして表示されること。" },
        { en: "Forgetting to call `controller.abort()` in a cleanup function, letting a stale request set state after the component has already unmounted.", np: "Cleanup function मा `controller.abort()` call गर्न बिर्सनु, component पहिले नै unmount भइसकेपछि stale request ले state set गर्न दिनु।", jp: "クリーンアップ関数で`controller.abort()`を呼び忘れ、コンポーネントがすでにアンマウントされた後に古いリクエストがstateを設定してしまうこと。" },
        { en: "Reusing the same `AbortController` for multiple requests instead of creating a fresh one each time — once aborted, a controller's `signal` stays aborted forever.", np: "हरेक पटक नयाँ नबनाई same `AbortController` लाई multiple requests का लागि पुन: प्रयोग गर्नु — एकपटक abort भएपछि controller को `signal` सधैंभरि aborted नै रहन्छ।", jp: "毎回新しく作らず同じ`AbortController`を複数のリクエストに再利用すること — 一度abortされるとコントローラーの`signal`は永久にabort状態のままになる。" },
      ],
      quiz: [
        {
          question: { en: "What is the `.name` of the error a `fetch` promise rejects with when its request is aborted?", np: "Request abort हुँदा `fetch` promise कुन `.name` भएको error सँग reject हुन्छ?", jp: "リクエストがabortされたとき、`fetch`のPromiseはどの`.name`のエラーでrejectする？" },
          options: [
            { en: "`\"AbortError\"`", np: "`\"AbortError\"`", jp: "`\"AbortError\"`" },
            { en: "`\"NetworkError\"`", np: "`\"NetworkError\"`", jp: "`\"NetworkError\"`" },
          ],
          correctIndex: 0,
          explanation: { en: "Aborting a fetch always produces an error whose name is AbortError, which is how you distinguish an intentional cancellation from a real failure.", np: "Fetch abort गर्दा सधैं AbortError नाम भएको error उत्पन्न हुन्छ, जसले जानाजानी गरेको cancellation लाई real failure बाट छुट्याउन दिन्छ।", jp: "fetchをabortすると常に名前がAbortErrorのエラーが生成される。これで意図的なキャンセルと本当の失敗を区別する。" },
        },
        {
          question: { en: "Where should `controller.abort()` be called to prevent a React component from setting state after it unmounts?", np: "Component unmount भएपछि state set हुनबाट रोक्न `controller.abort()` कहाँ call गर्नुपर्छ?", jp: "コンポーネントがアンマウントされた後にstateが設定されるのを防ぐには、`controller.abort()`をどこで呼ぶべき？" },
          options: [
            { en: "Inside the cleanup function returned from `useEffect`", np: "`useEffect` बाट return हुने cleanup function भित्र", jp: "`useEffect`から返されるクリーンアップ関数の中" },
            { en: "Inside the `.then()` success callback", np: "`.then()` success callback भित्र", jp: "`.then()`の成功コールバックの中" },
          ],
          correctIndex: 0,
          explanation: { en: "React automatically runs the effect's cleanup function on unmount (or before the next run), making it the correct place to cancel a pending request.", np: "React ले unmount हुँदा (वा अर्को run अघि) effect को cleanup function automatic रूपमा चलाउँछ, जसले pending request cancel गर्ने सहि ठाउँ बनाउँछ।", jp: "Reactはアンマウント時（または次の実行前）にエフェクトのクリーンアップ関数を自動で実行するため、保留中のリクエストをキャンセルする正しい場所となる。" },
        },
        {
          question: { en: "In a debounced search box, what should happen the moment the user types a new character?", np: "Debounced search box मा user ले नयाँ character टाइप गर्ने क्षणमा के हुनुपर्छ?", jp: "デバウンスされた検索ボックスで、ユーザーが新しい文字を入力した瞬間に何が起こるべき？" },
          options: [
            { en: "Abort the previous in-flight request before starting a new one", np: "नयाँ सुरु गर्नु अघि पुरानो in-flight request abort गर्नुपर्छ", jp: "新しいリクエストを開始する前に前の実行中リクエストをabortする" },
            { en: "Let every previous request keep running and only render the last one", np: "हरेक पुरानो request चलिरहन दिनुपर्छ र अन्तिम मात्र render गर्नुपर्छ", jp: "すべての前のリクエストを実行させ続け、最後のものだけをレンダリングする" },
          ],
          correctIndex: 0,
          explanation: { en: "Aborting the previous request prevents a race condition where an old, slower response could arrive after and overwrite the results of a newer search.", np: "पुरानो request abort गर्दा race condition रोकिन्छ जहाँ पुरानो, ढिलो response पछि आएर नयाँ search को result overwrite गर्न सक्छ।", jp: "前のリクエストをabortすることで、古く遅い応答が後から到着して新しい検索結果を上書きするというレースコンディションを防ぐ。" },
        },
      ],
    },
    {
      id: "web-storage",
      title: { en: "Web Storage — localStorage & sessionStorage", np: "Web Storage — localStorage र sessionStorage", jp: "Web Storage — localStorageとsessionStorage" },
      durationMinutes: 9,
      explanation: {
        en: "`localStorage` and `sessionStorage` share the exact same simple API: `setItem(key, value)` saves a value, `getItem(key)` reads it back (or returns `null` if the key doesn't exist), `removeItem(key)` deletes one entry, and `clear()` wipes everything for that origin. The one rule that trips people up: <b>every key and value is always a string</b>. If you save a number or object directly, it gets silently coerced with `String()` — so the standard pattern is to `JSON.stringify()` an object before `setItem`, and `JSON.parse()` the result after `getItem`, wrapped in a `try/catch` in case the stored data is ever corrupted or missing.\n\nBoth storages share a browser-enforced quota of roughly <b>5-10 MB per origin</b> — try to exceed it and `setItem` throws a `QuotaExceededError`, which real code should catch rather than let crash the page. The difference between the two is lifetime and scope: `localStorage` persists indefinitely until code or the user explicitly clears it (surviving tab closes and browser restarts), while `sessionStorage` is scoped to a single tab and is wiped the moment that tab closes — even a duplicate tab of the same page starts with empty `sessionStorage`. A subtle detail about the `storage` event: it fires on `window` whenever `localStorage` changes, but only in <b>other</b> tabs/windows of the same origin — the tab that made the change never receives its own event, which makes it useful for syncing state (like a logout) across open tabs.\n\nWeb Storage isn't the only browser persistence option. Cookies hold far less data (~4KB) but are automatically sent to the server with every matching request, which is exactly why session/auth data historically lived there. `IndexedDB` sits at the other end — a full transactional database capable of storing hundreds of megabytes with structured querying, suited for offline apps and large datasets that Web Storage's flat string API can't handle well. On security: because any JavaScript running on your page — including an injected `XSS` payload — can freely read `localStorage`, it is <b>not</b> a safe place for sensitive, long-lived credentials like refresh tokens. The safer pattern is an `httpOnly` cookie for anything long-lived and sensitive (JavaScript cannot read `httpOnly` cookies at all), reserving `localStorage`/`sessionStorage` for non-sensitive UI state like theme, form drafts, or short-lived access tokens.",
        np: "`localStorage` र `sessionStorage` ले ठ्याक्कै उही simple API share गर्छन्: `setItem(key, value)` ले value save गर्छ, `getItem(key)` ले फेरि read गर्छ (key नभएमा `null` फर्काउँछ), `removeItem(key)` ले एउटा entry delete गर्छ, र `clear()` ले त्यो origin को सबै कुरा हटाउँछ। मानिसहरू सबैभन्दा बिर्सने नियम: <b>हरेक key र value सधैं string हुन्छ</b>। Number वा object directly save गरेमा, यो silently `String()` ले coerce हुन्छ — त्यसैले standard pattern भनेको object लाई `setItem` अघि `JSON.stringify()` गर्ने, र `getItem` पछि result लाई `JSON.parse()` गर्ने हो, र stored data कहिलेकाहीं corrupted वा missing हुनसक्ने भएकोले `try/catch` मा wrap गर्ने हो।\n\nदुवै storages ले browser-enforced roughly <b>5-10 MB per origin</b> quota share गर्छन् — यो exceed गर्ने प्रयास गर्दा `setItem` ले `QuotaExceededError` throw गर्छ, जसलाई real code मा page crash हुन नदिन catch गर्नुपर्छ। दुई बीचको फरक भनेको lifetime र scope हो: `localStorage` code वा user ले explicitly clear नगरेसम्म (tab बन्द र browser restart पछि पनि बाँचेर) forever persist हुन्छ, जबकि `sessionStorage` एउटै tab मा scoped हुन्छ र त्यो tab बन्द भएको क्षणमै wipe हुन्छ — same page को duplicate tab पनि empty `sessionStorage` सँग सुरु हुन्छ। `storage` event को एउटा subtle detail: `localStorage` change हुनासाथ यो `window` मा fire हुन्छ, तर same origin को <b>अन्य</b> tabs/windows मा मात्र — change गर्ने tab ले आफ्नै event कहिल्यै पाउँदैन, जसले खुला tabs हरूमा state sync गर्न (जस्तै logout) उपयोगी बनाउँछ।\n\nWeb Storage मात्र browser persistence option होइन। Cookies ले धेरै कम data (~4KB) राख्छन् तर हरेक matching request सँग automatic रूपमा server मा पठाइन्छन्, जो नै session/auth data historically त्यहाँ राख्ने कारण हो। `IndexedDB` अर्को छेउमा छ — सयौं megabytes structured querying सहित store गर्न सक्ने full transactional database, offline apps र Web Storage को flat string API ले राम्ररी handle नगर्ने large datasets का लागि उपयुक्त। Security बारेमा: तपाईंको page मा चल्ने जुनसुकै JavaScript — injected `XSS` payload समावेश गरी — ले `localStorage` freely read गर्न सक्ने भएकोले, यो refresh tokens जस्ता sensitive, long-lived credentials का लागि <b>safe छैन</b>। सुरक्षित pattern भनेको long-lived र sensitive जुनसुकै कुरा का लागि `httpOnly` cookie हो (JavaScript ले `httpOnly` cookies बिल्कुल read गर्न सक्दैन), र `localStorage`/`sessionStorage` लाई theme, form drafts, वा short-lived access tokens जस्ता non-sensitive UI state का लागि छोड्ने हो।",
        jp: "`localStorage`と`sessionStorage`はまったく同じシンプルなAPIを共有する: `setItem(key, value)`は値を保存し、`getItem(key)`は読み戻す（キーが存在しない場合は`null`を返す）、`removeItem(key)`は1つのエントリを削除し、`clear()`はそのオリジンのすべてを消す。多くの人が引っかかる唯一のルール: <b>キーと値は常に文字列</b>である。数値やオブジェクトを直接保存すると`String()`で暗黙に変換されてしまう — そのため標準的なパターンは、`setItem`の前にオブジェクトを`JSON.stringify()`し、`getItem`の後に結果を`JSON.parse()`することで、保存データが壊れていたり存在しない場合に備えて`try/catch`で囲む。\n\n両ストレージともブラウザが強制するオリジンあたり約<b>5-10 MB</b>のクォータを共有する — これを超えようとすると`setItem`は`QuotaExceededError`をスローするので、実際のコードはページをクラッシュさせず捕捉すべき。2つの違いは有効期間とスコープ: `localStorage`はコードやユーザーが明示的にクリアしない限り無期限に持続する（タブを閉じてもブラウザを再起動しても残る）。一方`sessionStorage`は単一タブにスコープされ、そのタブが閉じた瞬間に消える — 同じページの複製タブでも空の`sessionStorage`から始まる。`storage`イベントの微妙な点: `localStorage`が変更されると`window`上で発火するが、これは同一オリジンの<b>他の</b>タブ/ウィンドウのみである — 変更を行ったタブ自身は自分のイベントを受け取らない。これは開いているタブ間で状態（ログアウトなど）を同期させるのに便利。\n\nWeb Storageはブラウザの永続化オプションの唯一の手段ではない。Cookieはずっと少ないデータ（約4KB）しか保持できないが、一致するすべてのリクエストと共に自動的にサーバーへ送信される — これこそセッション/認証データが歴史的にそこに置かれてきた理由。`IndexedDB`はその対極にある — 数百メガバイトを構造化クエリ付きで保存できる完全なトランザクションデータベースで、オフラインアプリやWeb Storageのフラットな文字列APIではうまく扱えない大規模データに適している。セキュリティについて: ページ上で動く任意のJavaScript — 注入された`XSS`ペイロードも含む — が`localStorage`を自由に読めるため、リフレッシュトークンのような重要で長期的な認証情報を置くのに<b>安全ではない</b>。より安全なパターンは、長期的で重要なものには`httpOnly`Cookie（JavaScriptは`httpOnly`Cookieを一切読めない）を使い、`localStorage`/`sessionStorage`はテーマ・フォームの下書き・短命なアクセストークンなど非機密なUI状態に限定することである。",
      },
      diagram: `                 localStorage              sessionStorage
lifetime          forever (until cleared)   until TAB closes
scope             same origin, ALL tabs     current tab ONLY
capacity          ~5-10 MB                  ~5-10 MB

API (identical for both):
  setItem(key, value)   → value coerced to STRING
  getItem(key)          → string | null
  removeItem(key)
  clear()

Objects need JSON:
  setItem("user", JSON.stringify({ name: "Alice" }))
  JSON.parse(getItem("user"))          → { name: "Alice" }

storage event:
  Tab A: localStorage.setItem("theme","dark")
  Tab A window ─── does NOT get "storage" event
  Tab B window ─── DOES get "storage" event   ← fires in OTHER tabs only

localStorage   ── XSS script CAN read it ──►  NOT safe for long-lived secrets
httpOnly cookie ── JS cannot read it at all ──► safer for refresh tokens`,
      codeExample: {
        title: { en: "Reading, writing and choosing the right storage", np: "सहि storage read, write र choose गर्नु", jp: "適切なストレージの読み書きと選択" },
        code: `// ── Basic API — identical for localStorage and sessionStorage ──────
localStorage.setItem("theme", "dark");
localStorage.getItem("theme");        // "dark"
localStorage.getItem("missingKey");   // null — not an error
localStorage.removeItem("theme");
localStorage.clear();                 // wipes EVERY key for this origin

// ── Values are always strings — JSON for anything else ──────────────
const settings = { theme: "dark", fontSize: 16 };
localStorage.setItem("settings", JSON.stringify(settings));

const stored = JSON.parse(localStorage.getItem("settings") ?? "null");
console.log(stored?.fontSize);   // 16

// ── Safe read/write helpers that survive corrupted/missing data ─────
function readStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;   // JSON.parse blew up — treat it as if it wasn't there
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // storage is full — roughly a 5-10MB ceiling per origin
    console.error("QuotaExceededError:", err);
  }
}

// ── sessionStorage — same API, scoped to this tab only ──────────────
sessionStorage.setItem("wizardStep", "2");    // cleared automatically when the tab closes
// a duplicate of this tab in a new window starts with an EMPTY sessionStorage

// ── Reacting to changes made in OTHER tabs ──────────────────────────
window.addEventListener("storage", (event) => {
  // Only fires here if a DIFFERENT tab changed localStorage — never this tab's own writes
  if (event.key === "authToken" && event.newValue === null) {
    // another tab logged out — mirror it here too
    window.location.reload();
  }
});

// ── Security: don't put long-lived secrets in localStorage ──────────
// localStorage.setItem("refreshToken", token);  // readable by any injected XSS script
// Better: keep the refresh token in an httpOnly cookie (set by the server,
// completely invisible to JavaScript) and hold only a short-lived access
// token in memory (a plain JS variable, gone on page reload).`,
      },
      keyTakeaways: [
        { en: "`localStorage`/`sessionStorage` share the same `setItem`/`getItem`/`removeItem`/`clear` API but differ in lifetime (forever vs per-tab); values are always strings, so objects need `JSON.stringify`/`JSON.parse`.", np: "`localStorage`/`sessionStorage` ले उही `setItem`/`getItem`/`removeItem`/`clear` API share गर्छन् तर lifetime (forever vs per-tab) मा फरक हुन्छन्; values सधैं strings हुन्छन्, त्यसैले objects लाई `JSON.stringify`/`JSON.parse` चाहिन्छ।", jp: "`localStorage`/`sessionStorage`は同じ`setItem`/`getItem`/`removeItem`/`clear`APIを共有するが、有効期間（永続 vs タブ単位）が異なる。値は常に文字列なので、オブジェクトには`JSON.stringify`/`JSON.parse`が必要。" },
        { en: "Both have a roughly 5-10MB per-origin quota (`QuotaExceededError` if exceeded); the `storage` event only fires in other tabs, never the tab that made the change.", np: "दुवैको roughly 5-10MB per-origin quota हुन्छ (exceed भएमा `QuotaExceededError`); `storage` event अन्य tabs मा मात्र fire हुन्छ, change गर्ने tab मा कहिल्यै फायर हुँदैन।", jp: "両方ともオリジンあたり約5-10MBのクォータがある（超えると`QuotaExceededError`）。`storage`イベントは他のタブでのみ発火し、変更したタブ自身では発火しない。" },
        { en: "Cookies are smaller but auto-sent with every request, `IndexedDB` handles large structured data; avoid storing long-lived sensitive tokens in `localStorage` (XSS risk) — prefer `httpOnly` cookies.", np: "Cookies साना हुन्छन् तर हरेक request सँग auto-sent हुन्छन्, `IndexedDB` ले large structured data handle गर्छ; `localStorage` (XSS risk) मा long-lived sensitive tokens राख्नबाट जोगिनुहोस् — `httpOnly` cookies prefer गर्नुहोस्।", jp: "Cookieは小さいが全リクエストで自動送信され、`IndexedDB`は大きな構造化データを扱う。`localStorage`（XSSリスク）に長期的な機密トークンを保存するのは避け、`httpOnly`Cookieを優先する。" },
      ],
      commonMistakes: [
        { en: "Storing an object or number directly without `JSON.stringify`, then getting back a coerced/broken string like `\"[object Object]\"`.", np: "`JSON.stringify` बिना object वा number directly store गर्नु, त्यसपछि `\"[object Object]\"` जस्तो coerced/broken string फर्किनु।", jp: "`JSON.stringify`せずにオブジェクトや数値を直接保存し、`\"[object Object]\"`のような変換された壊れた文字列が返ってくること。" },
        { en: "Expecting the `storage` event to fire in the same tab/window that made the change, when it only fires in other tabs of the same origin.", np: "`storage` event change गर्ने same tab/window मा नै fire हुनेछ भनी आशा गर्नु, जब यो same origin को अन्य tabs मा मात्र fire हुन्छ।", jp: "`storage`イベントが変更を行った同じタブ/ウィンドウで発火すると期待するが、実際は同一オリジンの他のタブでのみ発火すること。" },
        { en: "Storing a long-lived auth/refresh token in `localStorage`, exposing it to any injected XSS script instead of using an `httpOnly` cookie.", np: "`httpOnly` cookie प्रयोग गर्नुको सट्टा long-lived auth/refresh token `localStorage` मा store गर्नु, यसलाई injected XSS script मा exposed बनाउनु।", jp: "`httpOnly`Cookieを使う代わりに長期的な認証/リフレッシュトークンを`localStorage`に保存し、注入されたXSSスクリプトに晒すこと。" },
      ],
      quiz: [
        {
          question: { en: "What type are all `localStorage` keys and values, no matter what you originally pass in?", np: "मूलतः जुनसुकै type pass गरे पनि सबै `localStorage` keys र values कुन type हुन्छन्?", jp: "元々何を渡したかにかかわらず、すべての`localStorage`のキーと値はどの型になる？" },
          options: [
            { en: "Always strings", np: "सधैं strings", jp: "常に文字列" },
            { en: "Whatever type was originally passed in", np: "मूलतः जुन type pass गरिएको थियो त्यही", jp: "元々渡した型のまま" },
          ],
          correctIndex: 0,
          explanation: { en: "localStorage/sessionStorage coerce every key and value to a string; objects must be JSON.stringify'd first to survive round-tripping.", np: "localStorage/sessionStorage ले हरेक key र value लाई string मा coerce गर्छन्; objects बचाउन पहिले JSON.stringify गर्नुपर्छ।", jp: "localStorage/sessionStorageはすべてのキーと値を文字列に変換する。オブジェクトを正しく保存するには先にJSON.stringifyする必要がある。" },
        },
        {
          question: { en: "When is `sessionStorage` automatically cleared?", np: "`sessionStorage` automatic रूपमा कहिले clear हुन्छ?", jp: "`sessionStorage`はいつ自動的にクリアされる？" },
          options: [
            { en: "When the tab it belongs to is closed", np: "यो belong भएको tab बन्द हुँदा", jp: "それが属するタブが閉じられたとき" },
            { en: "Only when `clear()` is called manually", np: "`clear()` manually call गरेमा मात्र", jp: "手動で`clear()`が呼ばれたときのみ" },
          ],
          correctIndex: 0,
          explanation: { en: "sessionStorage is scoped to a single tab's session and is wiped automatically the moment that tab closes, unlike localStorage.", np: "sessionStorage एउटै tab को session मा scoped हुन्छ र त्यो tab बन्द भएको क्षणमै automatic रूपमा wipe हुन्छ, localStorage भन्दा फरक।", jp: "sessionStorageは単一タブのセッションにスコープされ、そのタブが閉じた瞬間に自動的にクリアされる。localStorageとは異なる。" },
        },
        {
          question: { en: "Which tab(s) receive the `window` `\"storage\"` event when `localStorage` is changed?", np: "`localStorage` change हुँदा `window` को `\"storage\"` event कुन tab(s) मा पाइन्छ?", jp: "`localStorage`が変更されたとき、`window`の`\"storage\"`イベントはどのタブで受け取られる？" },
          options: [
            { en: "Only other tabs of the same origin — never the tab that made the change", np: "Same origin को अन्य tabs मा मात्र — change गर्ने tab मा कहिल्यै होइन", jp: "同一オリジンの他のタブのみ — 変更を行ったタブでは決して発火しない" },
            { en: "Every tab, including the one that made the change", np: "सबै tabs, change गर्ने tab सहित", jp: "変更を行ったタブも含むすべてのタブ" },
          ],
          correctIndex: 0,
          explanation: { en: "The storage event deliberately excludes the originating tab, which is why it's used to sync state like a logout across other open tabs.", np: "Storage event ले originating tab लाई जानाजानी exclude गर्छ, त्यसैले यो अन्य खुला tabs मा logout जस्तो state sync गर्न प्रयोग हुन्छ।", jp: "storageイベントは意図的に発生元のタブを除外する。これが他の開いているタブでログアウトのような状態を同期するために使われる理由。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "Does `fetch` reject its promise for a `404` or `500` response?", np: "`fetch` ले `404` वा `500` response का लागि आफ्नो promise reject गर्छ?", jp: "`fetch`は`404`や`500`レスポンスに対してPromiseをrejectする？" },
      options: [{ en: "No — it resolves normally; check `response.ok`", np: "होइन — यो normally resolve हुन्छ; `response.ok` check गर्नुहोस्", jp: "しない — 正常にresolveする。`response.ok`を確認する" }, { en: "Yes — fetch always throws on 4xx/5xx status codes", np: "हो — fetch ले सधैं 4xx/5xx status codes मा throw गर्छ", jp: "する — fetchは常に4xx/5xxステータスコードでスローする" }],
      correctIndex: 0,
      explanation: { en: "fetch only rejects on network-level failures; any completed HTTP response, including error statuses, resolves the promise, so you must check response.ok yourself.", np: "fetch ले network-level failure मा मात्र reject गर्छ; error statuses सहित कुनै पनि completed HTTP response ले promise resolve गर्छ, त्यसैले आफैं response.ok check गर्नुपर्छ।", jp: "fetchはネットワークレベルの失敗でのみrejectする。エラーステータスを含むあらゆる完了したHTTPレスポンスはPromiseを解決するため、自分でresponse.okを確認する必要がある。" },
    },
    {
      question: { en: "How many times can a `Response` body be read without calling `clone()` first?", np: "पहिले `clone()` call नगरी `Response` body कति पटक read गर्न सकिन्छ?", jp: "先に`clone()`を呼ばずに`Response`のボディは何回読める？" },
      options: [{ en: "Once", np: "एकपटक", jp: "1回" }, { en: "Unlimited times", np: "असीमित पटक", jp: "無制限" }],
      correctIndex: 0,
      explanation: { en: "The response body is a stream that can only be consumed once; a second read without clone() throws an error.", np: "Response body एउटा stream हो जो एकपटक मात्र consume हुन सक्छ; clone() बिना दोस्रो पटक read गर्दा error आउँछ।", jp: "レスポンスボディは一度しか消費できないストリームであり、clone()なしで2回目に読むとエラーになる。" },
    },
    {
      question: { en: "What must a `POST` request set so the server knows the body is JSON?", np: "Server ले body JSON हो भनेर थाहा पाउन `POST` request मा के set गर्नुपर्छ?", jp: "サーバーがボディがJSONであると認識するために`POST`リクエストで何を設定する必要がある？" },
      options: [{ en: "A `Content-Type: application/json` header", np: "`Content-Type: application/json` header", jp: "`Content-Type: application/json`ヘッダー" }, { en: "Nothing — fetch detects it automatically", np: "केही छैन — fetch ले automatic रूपमा detect गर्छ", jp: "何もない — fetchが自動で検出する" }],
      correctIndex: 0,
      explanation: { en: "fetch never inspects or serializes the body for you; the Content-Type header plus a JSON.stringify'd body is required.", np: "fetch ले body कहिल्यै आफैं inspect वा serialize गर्दैन; Content-Type header र JSON.stringify गरिएको body दुवै चाहिन्छ।", jp: "fetchはボディを自動で検査・シリアライズすることはない。Content-TypeヘッダーとJSON.stringifyされたボディの両方が必要。" },
    },
    {
      question: { en: "What is the `.name` of the error a `fetch` promise rejects with after `controller.abort()` is called?", np: "`controller.abort()` call गरेपछि `fetch` promise कुन `.name` भएको error सँग reject हुन्छ?", jp: "`controller.abort()`が呼ばれた後、`fetch`のPromiseはどの`.name`のエラーでrejectする？" },
      options: [{ en: "`\"AbortError\"`", np: "`\"AbortError\"`", jp: "`\"AbortError\"`" }, { en: "`\"TypeError\"`", np: "`\"TypeError\"`", jp: "`\"TypeError\"`" }],
      correctIndex: 0,
      explanation: { en: "Aborting a fetch always produces an error named AbortError, letting you distinguish an intentional cancellation from a real failure.", np: "Fetch abort गर्दा सधैं AbortError नाम भएको error उत्पन्न हुन्छ, जसले जानाजानी गरेको cancellation लाई real failure बाट छुट्याउन दिन्छ।", jp: "fetchをabortすると常にAbortErrorという名前のエラーが生成され、意図的なキャンセルと本当の失敗を区別できる。" },
    },
    {
      question: { en: "Where should `controller.abort()` be called to stop a React component from setting state after it unmounts?", np: "Component unmount भएपछि state set हुनबाट रोक्न `controller.abort()` कहाँ call गर्नुपर्छ?", jp: "コンポーネントがアンマウントされた後にstateが設定されるのを止めるには、`controller.abort()`をどこで呼ぶべき？" },
      options: [{ en: "In the cleanup function returned from `useEffect`", np: "`useEffect` बाट return हुने cleanup function मा", jp: "`useEffect`から返されるクリーンアップ関数の中" }, { en: "In the `.then()` success callback", np: "`.then()` success callback मा", jp: "`.then()`の成功コールバックの中" }],
      correctIndex: 0,
      explanation: { en: "React runs the effect's cleanup automatically on unmount or before the next run, making it the right place to cancel a pending request.", np: "React ले effect को cleanup unmount मा वा अर्को run अघि automatic रूपमा चलाउँछ, जसले pending request cancel गर्ने सहि ठाउँ बनाउँछ।", jp: "Reactはアンマウント時または次の実行前にエフェクトのクリーンアップを自動実行するため、保留中のリクエストをキャンセルする正しい場所となる。" },
    },
    {
      question: { en: "What type are all `localStorage` values stored as, regardless of what you pass to `setItem`?", np: "`setItem` मा जे pass गरे पनि सबै `localStorage` values कुन type मा store हुन्छन्?", jp: "`setItem`に何を渡しても、すべての`localStorage`の値はどの型で保存される？" },
      options: [{ en: "Strings", np: "Strings", jp: "文字列" }, { en: "Whatever type was originally passed in", np: "मूलतः जुन type pass गरिएको थियो त्यही", jp: "元々渡した型のまま" }],
      correctIndex: 0,
      explanation: { en: "localStorage coerces every value to a string; objects must be JSON.stringify'd before storing and JSON.parse'd after reading.", np: "localStorage ले हरेक value लाई string मा coerce गर्छ; objects store गर्नु अघि JSON.stringify र read गरेपछि JSON.parse गर्नुपर्छ।", jp: "localStorageはすべての値を文字列に変換する。オブジェクトは保存前にJSON.stringify、読み取り後にJSON.parseする必要がある。" },
    },
    {
      question: { en: "Which tab(s) receive the `window` `\"storage\"` event when `localStorage` changes?", np: "`localStorage` change हुँदा `window` को `\"storage\"` event कुन tab(s) मा पाइन्छ?", jp: "`localStorage`が変更されたとき、`window`の`\"storage\"`イベントはどのタブで受け取られる？" },
      options: [{ en: "Only other tabs of the same origin", np: "Same origin को अन्य tabs मा मात्र", jp: "同一オリジンの他のタブのみ" }, { en: "All tabs, including the one that made the change", np: "सबै tabs, change गर्ने tab सहित", jp: "変更を行ったタブも含むすべてのタブ" }],
      correctIndex: 0,
      explanation: { en: "The storage event deliberately never fires in the tab that made the change, which is why it's used to sync state like a logout across other open tabs.", np: "Storage event change गर्ने tab मा जानाजानी कहिल्यै fire हुँदैन, त्यसैले यो अन्य खुला tabs मा logout जस्तो state sync गर्न प्रयोग हुन्छ।", jp: "storageイベントは変更を行ったタブでは意図的に発火しない。これが他の開いているタブでログアウトのような状態を同期するために使われる理由。" },
    },
    {
      question: { en: "Why should a long-lived refresh token generally NOT be stored in `localStorage`?", np: "Long-lived refresh token लाई सामान्यतया `localStorage` मा किन store गर्नु हुँदैन?", jp: "長期的なリフレッシュトークンを一般的に`localStorage`に保存すべきでない理由は？" },
      options: [{ en: "Any injected XSS script can freely read localStorage", np: "जुनसुकै injected XSS script ले localStorage freely read गर्न सक्छ", jp: "注入されたXSSスクリプトがlocalStorageを自由に読めるため" }, { en: "localStorage values get cleared too frequently", np: "localStorage values धेरै बारम्बार clear हुन्छन्", jp: "localStorageの値が頻繁にクリアされすぎるため" }],
      correctIndex: 0,
      explanation: { en: "Because localStorage is readable by any JavaScript on the page, an XSS vulnerability exposes long-lived tokens; httpOnly cookies are safer since JavaScript cannot read them at all.", np: "localStorage page मा चल्ने जुनसुकै JavaScript ले read गर्न सक्ने भएकोले, XSS vulnerability ले long-lived tokens expose गर्छ; httpOnly cookies बढी सुरक्षित छन् किनकि JavaScript ले तिनलाई बिल्कुल read गर्न सक्दैन।", jp: "localStorageはページ上の任意のJavaScriptから読めるため、XSS脆弱性が長期的なトークンを晒してしまう。httpOnly CookieはJavaScriptが一切読めないためより安全。" },
    },
  ],
};
