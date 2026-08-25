import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_14_LESSONS: JsLessonDay = {
  day: 14,
  title: { en: "Callbacks & Promises — creation, states & chaining", np: "Callbacks र Promises — creation, states र chaining", jp: "コールバック・Promise — 作成・状態・チェーン" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "callbacks-error-first",
      title: { en: "Callbacks & the Error-First Convention", np: "Callbacks र Error-First Convention", jp: "コールバックとエラーファースト規約" },
      durationMinutes: 9,
      explanation: {
        en: "JavaScript normally runs code <b>synchronously</b> (one task finishes before the next one starts).\n\nFor example:\n\n```javascript\nconsole.log(\"A\");\nconsole.log(\"B\");\nconsole.log(\"C\");\n```\n\nThe output is:\n\n```text\nA\nB\nC\n```\n\nBut some tasks take time, such as:\n\n• Reading a file\n• Calling an API\n• Querying a database\n• Downloading a file\n\nIf JavaScript waited for every slow task, the application could become unresponsive.\n\nThis is where <b>asynchronous</b> (work that can continue while waiting for another task) programming comes in.\n\n---\n\n## 1. What is a Callback?\n\nA <b>callback</b> (a function passed to another function to be called later) is commonly used for asynchronous work.\n\nFor example:\n\n```javascript\nfunction downloadFile(callback) {\n  // Download file...\n\n  callback(\"file downloaded\");\n}\n\ndownloadFile((result) => {\n  console.log(result);\n});\n```\n\nThink of it like:\n\n```text\nStart download\n      ↓\nDo other work\n      ↓\nDownload finishes\n      ↓\nCall callback\n      ↓\nRun callback function\n```\n\nSo a callback basically means:\n\n> <b>\"When you're finished, call this function.\"</b>\n\n---\n\n## 2. Why Use Callbacks?\n\nImagine downloading a file takes 3 seconds.\n\nWe don't want JavaScript to stop everything while waiting.\n\nInstead:\n\n```text\nStart download\n      ↓\nJavaScript continues other work\n      ↓\nDownload finishes\n      ↓\nCallback runs\n```\n\nThis lets the application continue doing other work while the download is happening.\n\n---\n\n## 3. The Function Controls the Callback\n\nThe function receiving the callback decides:\n\n• When to call it\n• Whether to call it\n• How many times to call it\n\nFor example:\n\n```javascript\nfunction greet(callback) {\n  console.log(\"Hello\");\n\n  callback();\n}\n\ngreet(() => {\n  console.log(\"Callback called\");\n});\n```\n\nOutput:\n\n```text\nHello\nCallback called\n```\n\nThe `greet()` function decides when the callback runs.\n\n---\n\n## 4. Error-First Callbacks\n\nOlder Node.js APIs commonly use the <b>error-first convention</b> (a pattern where the error is always the first callback argument).\n\nThe pattern looks like this:\n\n```javascript\ncallback(err, data);\n```\n\nThe first argument is the error.\n\nThe second argument is the result.\n\nFor example:\n\n```javascript\nfunction getUser(callback) {\n  // Imagine something went wrong\n\n  callback(error, null);\n}\n```\n\nIf everything works:\n\n```javascript\ncallback(null, user);\n```\n\nHere:\n\n```text\nnull → No error\nuser → Result\n```\n\n---\n\n## 5. Checking the Error First\n\nBecause the error is always the first argument, we normally check it first.\n\n```javascript\ngetUser((err, user) => {\n  if (err) {\n    console.log(\"Something went wrong\");\n    return;\n  }\n\n  console.log(user);\n});\n```\n\nThe pattern is:\n\n```text\nDid an error happen?\n      ↓\n    Yes → Handle error and stop\n      ↓\n     No\n      ↓\nUse the result\n```\n\nThis is why you'll often see:\n\n```javascript\nif (err) return;\n```\n\nin older Node.js code.\n\n---\n\n## 6. Why `null`?\n\nWhen there is no error, the first argument is usually `null` (a value meaning \"nothing is here\").\n\n```javascript\ncallback(null, user);\n```\n\nThis means:\n\n```text\nFirst argument  → No error\nSecond argument → User data\n```\n\nWhen there is an error:\n\n```javascript\ncallback(error, null);\n```\n\nThis means:\n\n```text\nFirst argument  → Error\nSecond argument → No useful data\n```\n\n---\n\n## 7. It's a Convention\n\nA <b>convention</b> (a commonly followed way of doing something) is not a JavaScript rule.\n\nJavaScript doesn't force you to use:\n\n```javascript\ncallback(err, data);\n```\n\nBut Node.js developers used this pattern widely for many years, so you'll see it often in older Node.js code.\n\n---\n\n## 8. The Problem: Callback Hell\n\nCallbacks work well for simple tasks.\n\nBut imagine we need to do several things:\n\n```text\nGet user\n   ↓\nGet user's orders\n   ↓\nGet order details\n   ↓\nSend email\n```\n\nEach step needs the result from the previous step.\n\nWith callbacks, this can become deeply nested:\n\n```javascript\ngetUser((err, user) => {\n  if (err) return;\n\n  getOrders(user.id, (err, orders) => {\n    if (err) return;\n\n    getOrderDetails(orders[0].id, (err, order) => {\n      if (err) return;\n\n      sendEmail(order, (err) => {\n        if (err) return;\n\n        console.log(\"Email sent\");\n      });\n    });\n  });\n});\n```\n\nThe code keeps moving to the right:\n\n```text\ngetUser\n   └── getOrders\n        └── getOrderDetails\n             └── sendEmail\n```\n\nThis is called <b>callback hell</b> (too many nested callbacks that make code difficult to read).\n\nIt is also called the <b>pyramid of doom</b> (the pyramid-shaped code created by deep nesting).\n\n---\n\n## 9. Why Callback Hell Is Bad\n\nAs the application gets bigger:\n\n• Code becomes harder to read\n• Error handling gets repeated\n• Code becomes deeply nested\n• Changing one step becomes harder\n• Debugging becomes harder\n\nFor example:\n\n```text\nif (err) return;\n     ↓\nif (err) return;\n     ↓\nif (err) return;\n     ↓\nif (err) return;\n```\n\nIt quickly becomes difficult to follow.\n\n---\n\n## 10. Promises Solve This Problem\n\n<b>Promises</b> (objects that represent a future result) provide a cleaner way to handle asynchronous work.\n\nInstead of nesting callbacks:\n\n```javascript\ngetUser((err, user) => {\n  // ...\n});\n```\n\nwe can use:\n\n```javascript\nconst user = await getUser();\nconst orders = await getOrders(user.id);\nconst order = await getOrderDetails(orders[0].id);\nawait sendEmail(order);\n```\n\nNow the code is much easier to read:\n\n```text\nGet user\n   ↓\nGet orders\n   ↓\nGet order details\n   ↓\nSend email\n```\n\nThis is one of the main reasons <b>`async/await`</b> (syntax that makes Promise-based code easier to read) became so popular.",
        np: "JavaScript सामान्यतया code <b>synchronously</b> (एउटा task सकिएपछि मात्र अर्को सुरु हुने) चलाउँछ।\n\nउदाहरणका लागि:\n\n```javascript\nconsole.log(\"A\");\nconsole.log(\"B\");\nconsole.log(\"C\");\n```\n\nOutput यो हो:\n\n```text\nA\nB\nC\n```\n\nतर केही task मा समय लाग्छ, जस्तै:\n\n• File पढ्नु\n• API call गर्नु\n• Database query गर्नु\n• File download गर्नु\n\nJavaScript हरेक ढिलो task कुरेर बस्यो भने, application unresponsive हुन सक्छ।\n\nयहीँ <b>asynchronous</b> (अर्को task कुर्दै गर्दा पनि काम अगाडि बढ्न सक्ने) programming आउँछ।\n\n---\n\n## 1. Callback के हो?\n\n<b>Callback</b> (पछि call गर्नका लागि अर्को function मा पठाइने function) asynchronous काम का लागि सामान्य रूपमा प्रयोग हुन्छ।\n\nउदाहरणका लागि:\n\n```javascript\nfunction downloadFile(callback) {\n  // Download file...\n\n  callback(\"file downloaded\");\n}\n\ndownloadFile((result) => {\n  console.log(result);\n});\n```\n\nयसलाई यसरी सोच्नुहोस्:\n\n```text\nStart download\n      ↓\nDo other work\n      ↓\nDownload finishes\n      ↓\nCall callback\n      ↓\nRun callback function\n```\n\nत्यसैले callback को मुख्य अर्थ:\n\n> <b>\"तिम्रो काम सकिएपछि, यो function call गर।\"</b>\n\n---\n\n## 2. Callback किन प्रयोग गर्ने?\n\nकल्पना गर्नुहोस् file download गर्न 3 seconds लाग्छ।\n\nहामी JavaScript ले कुर्दै सबै चीज रोकेको चाहँदैनौं।\n\nबरु:\n\n```text\nStart download\n      ↓\nJavaScript continues other work\n      ↓\nDownload finishes\n      ↓\nCallback runs\n```\n\nयसले download हुँदै गर्दा पनि application लाई अरू काम गरिरहन दिन्छ।\n\n---\n\n## 3. Function ले Callback नियन्त्रण गर्छ\n\nCallback पाउने function ले निर्णय गर्छ:\n\n• कहिले call गर्ने\n• call गर्ने वा नगर्ने\n• कति पटक call गर्ने\n\nउदाहरणका लागि:\n\n```javascript\nfunction greet(callback) {\n  console.log(\"Hello\");\n\n  callback();\n}\n\ngreet(() => {\n  console.log(\"Callback called\");\n});\n```\n\nOutput:\n\n```text\nHello\nCallback called\n```\n\n`greet()` function ले callback कहिले चल्ने निर्णय गर्छ।\n\n---\n\n## 4. Error-First Callbacks\n\nपुराना Node.js API हरू सामान्यतया <b>error-first convention</b> (error सधैं पहिलो callback argument हुने pattern) प्रयोग गर्छन्।\n\nPattern यस्तो देखिन्छ:\n\n```javascript\ncallback(err, data);\n```\n\nपहिलो argument error हो।\n\nदोस्रो argument result हो।\n\nउदाहरणका लागि:\n\n```javascript\nfunction getUser(callback) {\n  // Imagine something went wrong\n\n  callback(error, null);\n}\n```\n\nसबै ठीक भए:\n\n```javascript\ncallback(null, user);\n```\n\nयहाँ:\n\n```text\nnull → No error\nuser → Result\n```\n\n---\n\n## 5. पहिले Error जाँच्नु\n\nError सधैं पहिलो argument हुने हुनाले, हामी सामान्यतया पहिले त्यही जाँच्छौं।\n\n```javascript\ngetUser((err, user) => {\n  if (err) {\n    console.log(\"Something went wrong\");\n    return;\n  }\n\n  console.log(user);\n});\n```\n\nPattern यो हो:\n\n```text\nDid an error happen?\n      ↓\n    Yes → Handle error and stop\n      ↓\n     No\n      ↓\nUse the result\n```\n\nत्यसैले पुराना Node.js code मा तपाईं प्रायः यो देख्नुहुन्छ:\n\n```javascript\nif (err) return;\n```\n\n---\n\n## 6. `null` किन?\n\nError नहुँदा, पहिलो argument सामान्यतया `null` (\"यहाँ केही छैन\" भन्ने अर्थ दिने value) हुन्छ।\n\n```javascript\ncallback(null, user);\n```\n\nयसको अर्थ:\n\n```text\nFirst argument  → No error\nSecond argument → User data\n```\n\nError हुँदा:\n\n```javascript\ncallback(error, null);\n```\n\nयसको अर्थ:\n\n```text\nFirst argument  → Error\nSecond argument → No useful data\n```\n\n---\n\n## 7. यो एउटा Convention हो\n\n<b>Convention</b> (सामान्य रूपमा पालना गरिने तरिका) JavaScript को नियम होइन।\n\nJavaScript ले तपाईंलाई यो प्रयोग गर्न बाध्य पार्दैन:\n\n```javascript\ncallback(err, data);\n```\n\nतर Node.js developer हरूले वर्षौंसम्म यो pattern व्यापक रूपमा प्रयोग गरे, त्यसैले पुराना Node.js code मा तपाईं यो प्रायः देख्नुहुन्छ।\n\n---\n\n## 8. समस्या: Callback Hell\n\nसरल task का लागि callback राम्रोसँग काम गर्छ।\n\nतर कल्पना गर्नुहोस् हामीले धेरै चीज गर्नुपर्छ:\n\n```text\nGet user\n   ↓\nGet user's orders\n   ↓\nGet order details\n   ↓\nSend email\n```\n\nहरेक step लाई अघिल्लो step को नतिजा चाहिन्छ।\n\nCallback सँग, यो गहिरो रूपमा nested हुन सक्छ:\n\n```javascript\ngetUser((err, user) => {\n  if (err) return;\n\n  getOrders(user.id, (err, orders) => {\n    if (err) return;\n\n    getOrderDetails(orders[0].id, (err, order) => {\n      if (err) return;\n\n      sendEmail(order, (err) => {\n        if (err) return;\n\n        console.log(\"Email sent\");\n      });\n    });\n  });\n});\n```\n\nCode दायाँ तिर सर्दै जान्छ:\n\n```text\ngetUser\n   └── getOrders\n        └── getOrderDetails\n             └── sendEmail\n```\n\nयसलाई <b>callback hell</b> (code पढ्न कठिन बनाउने धेरै nested callback) भनिन्छ।\n\nयसलाई <b>pyramid of doom</b> (गहिरो nesting ले बनाउने pyramid आकारको code) पनि भनिन्छ।\n\n---\n\n## 9. Callback Hell किन नराम्रो छ\n\nApplication ठूलो हुँदै जाँदा:\n\n• Code पढ्न कठिन हुन्छ\n• Error handling दोहोरिन्छ\n• Code गहिरो रूपमा nested हुन्छ\n• एउटा step बदल्नु कठिन हुन्छ\n• Debugging कठिन हुन्छ\n\nउदाहरणका लागि:\n\n```text\nif (err) return;\n     ↓\nif (err) return;\n     ↓\nif (err) return;\n     ↓\nif (err) return;\n```\n\nयो छिट्टै पछ्याउन कठिन हुन्छ।\n\n---\n\n## 10. Promise ले यो समस्या समाधान गर्छ\n\n<b>Promises</b> (भविष्यको नतिजाको प्रतिनिधित्व गर्ने object) asynchronous काम सम्हाल्ने सफा तरिका दिन्छन्।\n\nCallback nest गर्नुको साटो:\n\n```javascript\ngetUser((err, user) => {\n  // ...\n});\n```\n\nहामी यो प्रयोग गर्न सक्छौं:\n\n```javascript\nconst user = await getUser();\nconst orders = await getOrders(user.id);\nconst order = await getOrderDetails(orders[0].id);\nawait sendEmail(order);\n```\n\nअब code पढ्न धेरै सजिलो छ:\n\n```text\nGet user\n   ↓\nGet orders\n   ↓\nGet order details\n   ↓\nSend email\n```\n\n<b>`async/await`</b> (Promise-आधारित code पढ्न सजिलो बनाउने syntax) यति लोकप्रिय हुनुको यो एक मुख्य कारण हो।",
        jp: "JavaScriptは通常、コードを<b>同期的（synchronously）</b>に実行します（1つのタスクが終わってから次が始まる）。\n\nたとえば:\n\n```javascript\nconsole.log(\"A\");\nconsole.log(\"B\");\nconsole.log(\"C\");\n```\n\n出力はこうです:\n\n```text\nA\nB\nC\n```\n\nしかし、時間のかかるタスクもあります:\n\n• ファイルを読む\n• APIを呼ぶ\n• データベースに問い合わせる\n• ファイルをダウンロードする\n\nJavaScriptが遅いタスクをすべて待っていたら、アプリケーションは応答しなくなってしまいます。\n\nそこで登場するのが<b>非同期（asynchronous）</b>（別のタスクを待つ間も処理を進められる）プログラミングです。\n\n---\n\n## 1. コールバックとは?\n\n<b>コールバック</b>（後で呼ばれるために別の関数に渡す関数）は、非同期処理で広く使われます。\n\nたとえば:\n\n```javascript\nfunction downloadFile(callback) {\n  // Download file...\n\n  callback(\"file downloaded\");\n}\n\ndownloadFile((result) => {\n  console.log(result);\n});\n```\n\nこうイメージしてください:\n\n```text\nStart download\n      ↓\nDo other work\n      ↓\nDownload finishes\n      ↓\nCall callback\n      ↓\nRun callback function\n```\n\nつまりコールバックは基本的にこういう意味です:\n\n> <b>「終わったら、この関数を呼んで。」</b>\n\n---\n\n## 2. なぜコールバックを使うのか?\n\nファイルのダウンロードに3秒かかると想像してください。\n\n待っている間、JavaScriptにすべてを止めてほしくはありません。\n\n代わりに:\n\n```text\nStart download\n      ↓\nJavaScript continues other work\n      ↓\nDownload finishes\n      ↓\nCallback runs\n```\n\nこれでダウンロード中もアプリケーションは他の作業を続けられます。\n\n---\n\n## 3. コールバックを制御するのは受け取った関数\n\nコールバックを受け取る関数が決めます:\n\n• いつ呼ぶか\n• 呼ぶか呼ばないか\n• 何回呼ぶか\n\nたとえば:\n\n```javascript\nfunction greet(callback) {\n  console.log(\"Hello\");\n\n  callback();\n}\n\ngreet(() => {\n  console.log(\"Callback called\");\n});\n```\n\n出力:\n\n```text\nHello\nCallback called\n```\n\nコールバックがいつ実行されるかは `greet()` が決めます。\n\n---\n\n## 4. エラーファーストのコールバック\n\n古いNode.jsのAPIは<b>エラーファーストの慣習</b>（エラーが常に第一引数になるパターン）をよく使います。\n\nパターンはこうです:\n\n```javascript\ncallback(err, data);\n```\n\n第一引数はエラーです。\n\n第二引数は結果です。\n\nたとえば:\n\n```javascript\nfunction getUser(callback) {\n  // Imagine something went wrong\n\n  callback(error, null);\n}\n```\n\nすべてうまくいった場合:\n\n```javascript\ncallback(null, user);\n```\n\nここでは:\n\n```text\nnull → No error\nuser → Result\n```\n\n---\n\n## 5. まずエラーを確認する\n\nエラーが常に第一引数なので、通常はまずそれを確認します。\n\n```javascript\ngetUser((err, user) => {\n  if (err) {\n    console.log(\"Something went wrong\");\n    return;\n  }\n\n  console.log(user);\n});\n```\n\nパターンはこうです:\n\n```text\nDid an error happen?\n      ↓\n    Yes → Handle error and stop\n      ↓\n     No\n      ↓\nUse the result\n```\n\nだから古いNode.jsのコードでは次をよく見かけます:\n\n```javascript\nif (err) return;\n```\n\n---\n\n## 6. なぜ `null` なのか?\n\nエラーがないとき、第一引数は通常 `null`（「ここには何もない」という意味の値）になります。\n\n```javascript\ncallback(null, user);\n```\n\nこれはこういう意味です:\n\n```text\nFirst argument  → No error\nSecond argument → User data\n```\n\nエラーがあるとき:\n\n```javascript\ncallback(error, null);\n```\n\nこれはこういう意味です:\n\n```text\nFirst argument  → Error\nSecond argument → No useful data\n```\n\n---\n\n## 7. これは慣習\n\n<b>慣習（convention）</b>（広く従われているやり方）はJavaScriptの規則ではありません。\n\nJavaScriptは次の形を強制しません:\n\n```javascript\ncallback(err, data);\n```\n\nしかしNode.jsの開発者が長年このパターンを広く使ってきたので、古いNode.jsのコードでよく見かけます。\n\n---\n\n## 8. 問題: コールバック地獄\n\n単純なタスクならコールバックはうまく機能します。\n\nしかし、いくつもの処理をする必要があると想像してください:\n\n```text\nGet user\n   ↓\nGet user's orders\n   ↓\nGet order details\n   ↓\nSend email\n```\n\n各ステップは前のステップの結果を必要とします。\n\nコールバックだと、これは深くネストしていきます:\n\n```javascript\ngetUser((err, user) => {\n  if (err) return;\n\n  getOrders(user.id, (err, orders) => {\n    if (err) return;\n\n    getOrderDetails(orders[0].id, (err, order) => {\n      if (err) return;\n\n      sendEmail(order, (err) => {\n        if (err) return;\n\n        console.log(\"Email sent\");\n      });\n    });\n  });\n});\n```\n\nコードはどんどん右へ寄っていきます:\n\n```text\ngetUser\n   └── getOrders\n        └── getOrderDetails\n             └── sendEmail\n```\n\nこれを<b>コールバック地獄</b>（コードを読みにくくする過剰にネストしたコールバック）と呼びます。\n\n<b>破滅のピラミッド（pyramid of doom）</b>とも呼ばれます（深いネストが作るピラミッド形のコード）。\n\n---\n\n## 9. コールバック地獄がなぜ悪いのか\n\nアプリケーションが大きくなるにつれて:\n\n• コードが読みにくくなる\n• エラー処理が繰り返される\n• コードが深くネストする\n• 1つのステップを変えるのが難しくなる\n• デバッグが難しくなる\n\nたとえば:\n\n```text\nif (err) return;\n     ↓\nif (err) return;\n     ↓\nif (err) return;\n     ↓\nif (err) return;\n```\n\nすぐに追いかけるのが難しくなります。\n\n---\n\n## 10. Promiseがこの問題を解決する\n\n<b>Promise</b>（将来の結果を表すオブジェクト）は、非同期処理をより整った形で扱う方法を提供します。\n\nコールバックをネストする代わりに:\n\n```javascript\ngetUser((err, user) => {\n  // ...\n});\n```\n\nこう書けます:\n\n```javascript\nconst user = await getUser();\nconst orders = await getOrders(user.id);\nconst order = await getOrderDetails(orders[0].id);\nawait sendEmail(order);\n```\n\nこれでコードはずっと読みやすくなります:\n\n```text\nGet user\n   ↓\nGet orders\n   ↓\nGet order details\n   ↓\nSend email\n```\n\nこれが<b>`async/await`</b>（Promiseベースのコードを読みやすくする構文）がこれほど普及した主な理由の1つです。",
      },
      diagram: `Synchronous
→ One task finishes before the next starts.

Asynchronous
→ A task can continue in the background while other work happens.

Callback
→ A function passed to another function to be called later.

Error-first callback
→ callback(error, result)

Convention
→ A commonly followed way of doing something.

Callback hell
→ Too many nested callbacks.

Promise
→ An object representing a future result.

async/await
→ A cleaner way to write Promise-based asynchronous code.`,
      codeExample: {
        title: { en: "Callback pattern, error-first convention & callback hell", np: "Callback pattern, error-first convention, callback hell", jp: "コールバックパターン・エラーファースト規約・コールバック地獄" },
        code: `// ── Synchronous vs asynchronous ─────────────────────────────────────
console.log("Start");
setTimeout(() => console.log("Finished"), 2000);   // does NOT block
console.log("End");
// Logs: Start, End, Finished — setTimeout schedules the callback for later

// ── A simple callback ────────────────────────────────────────────────
function greet(name, callback) {
  console.log("Hello " + name);
  callback();                       // "call back" once our work is done
}
greet("Rajan", () => console.log("Callback executed"));

// ── Error-first callback convention ──────────────────────────────────
function divide(a, b, callback) {
  if (b === 0) {
    callback("Cannot divide by zero", null);   // error first, null result
    return;
  }
  callback(null, a / b);                       // null error, real result
}
divide(10, 2, (err, result) => {
  if (err) { console.log(err); return; }
  console.log(result);   // 5
});
divide(10, 0, (err, result) => {
  if (err) { console.log(err); return; }   // "Cannot divide by zero"
});

// ── Real async example — error-first + a delay ───────────────────────
function getUser(id, callback) {
  setTimeout(() => {
    if (!id) { callback("User ID missing", null); return; }
    callback(null, { id, name: "Rajan" });
  }, 1000);
}
getUser(10, (err, user) => {
  if (err) { console.log(err); return; }
  console.log(user);   // { id: 10, name: "Rajan" }
});

// ── Callback hell — why Promises were invented ───────────────────────
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getOrderDetails(orders[0].id, (err, details) => {
      if (err) return handleError(err);
      console.log(details);   // real logic buried 3 levels deep
    });
  });
});`,
      },
      keyTakeaways: [
        { en: "A <b>callback</b> is a function you pass to another function to be called later — \"when you're finished, call this function.\" It was one of the early ways Node.js handled asynchronous work.", np: "<b>Callback</b> पछि call गर्नका लागि अर्को function मा पठाइने function हो — \"तिम्रो काम सकिएपछि, यो function call गर।\" Node.js ले asynchronous काम सम्हाल्ने प्रारम्भिक तरिकाहरूमध्ये यो एक थियो।", jp: "<b>コールバック</b>は後で呼ばれるために別の関数に渡す関数 — 「終わったら、この関数を呼んで。」Node.jsが非同期処理を扱う初期の方法の1つだった。" },
        { en: "The function receiving the callback controls it — when it runs, whether it runs at all, and how many times.", np: "Callback पाउने function ले नै यसलाई नियन्त्रण गर्छ — कहिले चल्ने, चल्ने कि नचल्ने, र कति पटक चल्ने।", jp: "コールバックを受け取った関数がそれを制御する — いつ実行するか、実行するかどうか、何回実行するか。" },
        { en: "The traditional Node.js pattern is <b>error-first</b>: `callback(null, user)` on success, `callback(error, null)` on failure — the error always comes first.", np: "परम्परागत Node.js pattern <b>error-first</b> हो: सफल भए `callback(null, user)`, fail भए `callback(error, null)` — error सधैं पहिले आउँछ।", jp: "従来のNode.jsのパターンは<b>エラーファースト</b>: 成功時は `callback(null, user)`、失敗時は `callback(error, null)` — エラーが常に先に来る。" },
        { en: "Because the error is first, you check it first — that is why `if (err) return;` appears everywhere in older Node.js code.", np: "Error पहिले हुने हुनाले, पहिले त्यही जाँच्नुहुन्छ — त्यसैले पुराना Node.js code मा `if (err) return;` सबैतिर देखिन्छ।", jp: "エラーが先にあるので最初にそれを確認する — 古いNode.jsのコードで `if (err) return;` がどこにでも出てくる理由。" },
        { en: "It is a <b>convention</b>, not a language rule. Nothing in JavaScript enforces `callback(err, data)` — Node.js developers simply followed it for years.", np: "यो <b>convention</b> हो, भाषाको नियम होइन। JavaScript मा `callback(err, data)` लागू गर्ने केही छैन — Node.js developer हरूले वर्षौं यही पछ्याए।", jp: "これは<b>慣習</b>であって言語の規則ではない。JavaScriptに `callback(err, data)` を強制するものはなく、Node.jsの開発者が長年それに従ってきただけ。" },
        { en: "Chaining dependent steps with callbacks nests them deeper and deeper — `getUser` → `getOrders` → `getOrderDetails` → `sendEmail` — which is <b>callback hell</b>, also called the pyramid of doom.", np: "निर्भर step हरू callback ले जोड्दा तिनी गहिरो-गहिरो nested हुन्छन् — `getUser` → `getOrders` → `getOrderDetails` → `sendEmail` — यही <b>callback hell</b> हो, जसलाई pyramid of doom पनि भनिन्छ।", jp: "依存するステップをコールバックでつなぐとどんどん深くネストする — `getUser` → `getOrders` → `getOrderDetails` → `sendEmail` — これが<b>コールバック地獄</b>、別名「破滅のピラミッド」。" },
        { en: "Deep nesting makes code harder to read, repeats error handling, and makes changing one step or debugging much harder.", np: "गहिरो nesting ले code पढ्न कठिन बनाउँछ, error handling दोहोर्याउँछ, र एउटा step बदल्नु वा debugging धेरै कठिन बनाउँछ।", jp: "深いネストはコードを読みにくくし、エラー処理を繰り返させ、1つのステップの変更やデバッグをはるかに難しくする。" },
        { en: "Promises and `async/await` handle the same work far more readably: `const user = await getUser();` then `const orders = await getOrders(user.id);` — flat instead of nested.", np: "Promise र `async/await` ले उही काम धेरै पढ्न सजिलो तरिकाले गर्छन्: `const user = await getUser();` त्यसपछि `const orders = await getOrders(user.id);` — nested नभई सम्म।", jp: "Promiseと `async/await` は同じ処理をずっと読みやすく扱える: `const user = await getUser();` そして `const orders = await getOrders(user.id);` — ネストではなくフラットに。" },
      ],
      commonMistakes: [
        { en: "Calling the callback immediately/synchronously (`function fetchData(callback) { callback(); }`) instead of only after the real async work finishes — this defeats the whole point of a callback.", np: "Callback लाई तुरुन्तै/synchronously call गर्नु (`function fetchData(callback) { callback(); }`) real async काम सकिएपछि मात्र गर्नुको सट्टा — यसले callback को पूरै उद्देश्य नै हराउँछ।", jp: "実際の非同期処理が終わった後だけでなく、コールバックをすぐに／同期的に呼ぶこと（`function fetchData(callback) { callback(); }`）。これはコールバックの意味そのものを失わせる。" },
        { en: "Forgetting to check `err` first inside a callback and using `data` directly, which crashes when the operation actually failed.", np: "Callback भित्र `err` पहिले check गर्न बिर्सेर सिधै `data` प्रयोग गर्नु, operation असफल भएको बेला crash हुन्छ।", jp: "コールバック内で`err`を先にチェックせず`data`を直接使い、実際に失敗したときにクラッシュすること。" },
        { en: "Nesting one callback inside another for every new dependent async step instead of restructuring the code — this is exactly how callback hell grows.", np: "हरेक नयाँ dependent async step का लागि code restructure गर्नुको सट्टा callback भित्र callback nest गर्दै जानु — callback hell यसरी नै बढ्छ।", jp: "コードを再構成せず、依存する非同期ステップが増えるたびにコールバックの中にコールバックをネストしていくこと。これがコールバック地獄が育つ仕組みそのもの。" },
        { en: "Assuming error-first is a JavaScript language rule enforced by the engine — it's only a convention, so a poorly written function can ignore it entirely.", np: "Error-first लाई engine ले enforce गर्ने JavaScript language rule हो भन्ने ठान्नु — यो केवल convention हो, त्यसैले नराम्रो लेखिएको function ले यसलाई पूर्ण रूपमा बेवास्ता गर्न सक्छ।", jp: "エラーファーストをエンジンが強制するJavaScriptの言語規則だと思い込むこと。これは単なる慣習なので、書き方の悪い関数は完全に無視できる。" },
      ],
      quiz: [
        {
          question: { en: "In the error-first callback convention `fn(err, data)`, what does a `null` first argument mean?", np: "Error-first callback convention `fn(err, data)` मा पहिलो argument `null` भएको मतलब के हो?", jp: "エラーファースト規約`fn(err, data)`で第一引数が`null`とはどういう意味？" },
          options: [
            { en: "The operation is still pending", np: "Operation अझै pending छ", jp: "処理はまだ保留中" },
            { en: "The operation succeeded — no error occurred", np: "Operation सफल भयो — कुनै error भएन", jp: "処理が成功した — エラーは発生していない" },
          ],
          correctIndex: 1,
          explanation: { en: "By convention, `null` in the error slot signals success; any other value there signals failure and should be handled first.", np: "Convention अनुसार, error slot मा `null` ले सफलता जनाउँछ; अर्को कुनै value ले असफलता जनाउँछ र पहिले handle गर्नुपर्छ।", jp: "慣習として、エラー位置の`null`は成功を示す。それ以外の値は失敗を示し、最初に処理すべき。" },
        },
        {
          question: { en: "What problem does deeply nesting callbacks for sequential, dependent async steps create?", np: "Sequential, dependent async steps का लागि callbacks गहिरो गरी nest गर्दा के समस्या हुन्छ?", jp: "連続した依存関係のある非同期ステップのためにコールバックを深くネストすると何が問題になる？" },
          options: [
            { en: "Callback hell — code drifts rightward and becomes hard to read and maintain", np: "Callback hell — code दायाँतिर सर्छ र पढ्न/maintain गर्न गाह्रो हुन्छ", jp: "コールバック地獄 — コードが右へずれ、読みにくく保守しにくくなる" },
            { en: "JavaScript throws a compile-time error for nesting too deeply", np: "JavaScript ले धेरै गहिरो nesting भएमा compile-time error throw गर्छ", jp: "JavaScriptがネストが深すぎるとしてコンパイル時エラーを投げる" },
          ],
          correctIndex: 0,
          explanation: { en: "There's no language-level limit on nesting — the real cost is readability and maintainability, which is why Promises were introduced.", np: "Nesting मा language-level limit हुँदैन — real cost readability र maintainability हो, त्यसैले Promises ल्याइयो।", jp: "言語レベルでのネスト制限はない。本当のコストは可読性と保守性であり、それがPromise導入の理由。" },
        },
        {
          question: { en: "Is the error-first callback convention (`fn(err, data)`) enforced by the JavaScript language itself?", np: "Error-first callback convention (`fn(err, data)`) JavaScript language ले नै enforce गर्छ?", jp: "エラーファーストコールバック規約（`fn(err, data)`）はJavaScript言語自体によって強制される？" },
          options: [
            { en: "Yes — JavaScript requires all callbacks to follow this exact shape", np: "हो — JavaScript ले सबै callbacks लाई यही exact shape follow गर्न required गर्छ", jp: "はい — JavaScriptはすべてのコールバックがこの形に従うことを要求する" },
            { en: "No — it's just a widely followed convention, not a language rule", np: "होइन — यो व्यापक रूपमा followed convention मात्र हो, language rule होइन", jp: "いいえ — 広く従われている慣習にすぎず、言語規則ではない" },
          ],
          correctIndex: 1,
          explanation: { en: "Nothing in JavaScript enforces this shape — it's a community/Node.js convention that most APIs happen to follow.", np: "JavaScript मा यो shape enforce गर्ने केही छैन — यो community/Node.js convention हो जुन धेरै APIs ले follow गर्छन्।", jp: "JavaScriptにはこの形を強制するものはない。ほとんどのAPIがたまたま従っているコミュニティ／Node.jsの慣習に過ぎない。" },
        },
      ],
    },
    {
      id: "creating-consuming-promises",
      title: { en: "Creating & Consuming Promises", np: "Promises Create र Consume गर्नु", jp: "Promiseの作成と利用" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>Promise</b> (an object that represents a future result) is used when something doesn't finish immediately.\n\nFor example:\n\n• Calling an API\n• Reading a file\n• Querying a database\n• Waiting for a timer\n\nThink of a restaurant order:\n\n> You order food, but the food isn't ready yet. The order number is your <b>Promise</b>. It represents something you will receive later.\n\n---\n\n## 1. Creating a Promise\n\nWe create a Promise using:\n\n```javascript\nconst promise = new Promise((resolve, reject) => {\n  // Do some work\n});\n```\n\nThe function inside `new Promise()` is called the <b>executor</b> (the function that starts the work).\n\nIt receives two functions:\n\n```javascript\nresolve\nreject\n```\n\n### `resolve()`\n\nCall `resolve()` when the work succeeds.\n\n```javascript\nresolve(\"Success!\");\n```\n\n### `reject()`\n\nCall `reject()` when something goes wrong.\n\n```javascript\nreject(new Error(\"Something went wrong\"));\n```\n\n---\n\n## 2. A Simple Promise\n\n```javascript\nconst promise = new Promise((resolve, reject) => {\n  const success = true;\n\n  if (success) {\n    resolve(\"Task completed\");\n  } else {\n    reject(new Error(\"Task failed\"));\n  }\n});\n```\n\nThe flow is:\n\n```text\nStart Promise\n     ↓\nDo some work\n     ↓\n   Success?\n   ↙     ↘\n Yes      No\n ↓         ↓\nresolve   reject\n```\n\n---\n\n## 3. Promise States\n\nA Promise always has one of <b>three states</b>:\n\n### Pending\n\n<b>Pending</b> (still waiting for the result).\n\n```text\nPromise\n  ↓\nPending\n```\n\nThe work hasn't finished yet.\n\n### Fulfilled\n\n<b>Fulfilled</b> (the work succeeded and produced a result).\n\n```text\nPromise\n  ↓\nFulfilled\n  ↓\n\"Success!\"\n```\n\n### Rejected\n\n<b>Rejected</b> (the work failed).\n\n```text\nPromise\n  ↓\nRejected\n  ↓\nError\n```\n\nThe complete flow is:\n\n```text\n             Pending\n             ↙     ↘\n       resolve     reject\n          ↓           ↓\n     Fulfilled     Rejected\n```\n\nOnce a Promise becomes fulfilled or rejected, it is called <b>settled</b> (finished and cannot change anymore).\n\n---\n\n## 4. A Promise Can Only Settle Once\n\nOnce a Promise is settled, its state cannot change.\n\nFor example:\n\n```javascript\nconst promise = new Promise((resolve, reject) => {\n  resolve(\"First\");\n\n  resolve(\"Second\");\n  reject(new Error(\"Error\"));\n});\n```\n\nThe result will still be:\n\n```text\nFirst\n```\n\nThe first `resolve()` wins.\n\nThe later `resolve()` and `reject()` are ignored.\n\nThink of it like:\n\n```text\nPending\n   ↓\nFulfilled\n   ↓\nCannot change\n```\n\n---\n\n## 5. Consuming a Promise with `.then()`\n\nOnce we have a Promise, we can use `.then()` to handle the successful result.\n\n```javascript\npromise.then((result) => {\n  console.log(result);\n});\n```\n\nIf the Promise resolves with:\n\n```javascript\nresolve(\"Task completed\");\n```\n\nthen:\n\n```text\nPromise fulfilled\n      ↓\n.then()\n      ↓\n\"Task completed\"\n```\n\n---\n\n## 6. Handling Errors with `.catch()`\n\nWe use `.catch()` when the Promise is rejected.\n\n```javascript\npromise.catch((error) => {\n  console.log(error.message);\n});\n```\n\nFor example:\n\n```javascript\nconst promise = new Promise((resolve, reject) => {\n  reject(new Error(\"Something went wrong\"));\n});\n\npromise.catch((error) => {\n  console.log(error.message);\n});\n```\n\nOutput:\n\n```text\nSomething went wrong\n```\n\n---\n\n## 7. `.then()` and `.catch()` Together\n\nUsually you'll see:\n\n```javascript\npromise\n  .then((result) => {\n    console.log(result);\n  })\n  .catch((error) => {\n    console.log(error);\n  });\n```\n\nThink:\n\n```text\nPromise\n   ↓\nSuccess? ──→ .then()\n   ↓\nFailure? ──→ .catch()\n```\n\n---\n\n## 8. `.finally()`\n\n<b>`finally()`</b> (code that runs whether the Promise succeeds or fails) is useful for cleanup.\n\nFor example, imagine we're showing a loading spinner:\n\n```javascript\nshowLoading();\n\nfetchData()\n  .then((data) => {\n    console.log(data);\n  })\n  .catch((error) => {\n    console.log(error);\n  })\n  .finally(() => {\n    hideLoading();\n  });\n```\n\nWhether the request succeeds or fails:\n\n```text\nSuccess ──┐\n          ├──→ finally()\nFailure ──┘\n```\n\nThis makes `finally()` useful for:\n\n• Hiding loading indicators\n• Closing connections\n• Cleaning up resources\n• Resetting temporary state\n\n`finally()` doesn't receive the result or error.\n\n---\n\n## 9. You Must Return the Promise\n\nThis is an important mistake to avoid.\n\nBad:\n\n```javascript\nfunction getUser() {\n  fetch(\"/users/1\");\n}\n```\n\nThe function doesn't return the Promise.\n\nSo:\n\n```javascript\nconst result = getUser();\n\nresult.then(...);\n```\n\nwon't work because `result` is `undefined`.\n\nInstead:\n\n```javascript\nfunction getUser() {\n  return fetch(\"/users/1\");\n}\n```\n\nNow the caller gets the Promise:\n\n```javascript\ngetUser()\n  .then((response) => {\n    console.log(response);\n  })\n  .catch((error) => {\n    console.log(error);\n  });\n```\n\nThink of it like:\n\n```text\ngetUser()\n   ↓\nreturns Promise\n   ↓\n.then()\n   ↓\nGet result\n```\n\n---\n\n## 10. Real Example\n\nLet's create a small Promise:\n\n```javascript\nfunction getUser() {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      resolve({\n        id: 1,\n        name: \"Rajan\"\n      });\n    }, 1000);\n  });\n}\n```\n\nThe <b>`setTimeout()`</b> (runs code after a specified delay) waits one second.\n\nThen the Promise is resolved.\n\nWe can use it:\n\n```javascript\ngetUser()\n  .then((user) => {\n    console.log(user.name);\n  })\n  .catch((error) => {\n    console.log(error.message);\n  })\n  .finally(() => {\n    console.log(\"Finished\");\n  });\n```\n\nAfter one second:\n\n```text\nRajan\nFinished\n```",
        np: "<b>Promise</b> (भविष्यको नतिजाको प्रतिनिधित्व गर्ने object) कुनै चीज तुरुन्तै सकिँदैन भन्ने बेला प्रयोग हुन्छ।\n\nउदाहरणका लागि:\n\n• API call गर्नु\n• File पढ्नु\n• Database query गर्नु\n• Timer कुर्नु\n\nRestaurant को order सोच्नुहोस्:\n\n> तपाईं खाना order गर्नुहुन्छ, तर खाना अझै तयार छैन। Order number तपाईंको <b>Promise</b> हो। यो तपाईंले पछि पाउने चीजको प्रतिनिधित्व गर्छ।\n\n---\n\n## 1. Promise बनाउनु\n\nहामी Promise यसो बनाउँछौं:\n\n```javascript\nconst promise = new Promise((resolve, reject) => {\n  // Do some work\n});\n```\n\n`new Promise()` भित्रको function लाई <b>executor</b> (काम सुरु गर्ने function) भनिन्छ।\n\nयो दुई function पाउँछ:\n\n```javascript\nresolve\nreject\n```\n\n### `resolve()`\n\nकाम सफल भएपछि `resolve()` call गर्नुहोस्।\n\n```javascript\nresolve(\"Success!\");\n```\n\n### `reject()`\n\nकेही गलत भएपछि `reject()` call गर्नुहोस्।\n\n```javascript\nreject(new Error(\"Something went wrong\"));\n```\n\n---\n\n## 2. सरल Promise\n\n```javascript\nconst promise = new Promise((resolve, reject) => {\n  const success = true;\n\n  if (success) {\n    resolve(\"Task completed\");\n  } else {\n    reject(new Error(\"Task failed\"));\n  }\n});\n```\n\nFlow यो हो:\n\n```text\nStart Promise\n     ↓\nDo some work\n     ↓\n   Success?\n   ↙     ↘\n Yes      No\n ↓         ↓\nresolve   reject\n```\n\n---\n\n## 3. Promise States\n\nPromise सधैं <b>तीन state</b> मध्ये एउटामा हुन्छ:\n\n### Pending\n\n<b>Pending</b> (नतिजा कुरिरहेको)।\n\n```text\nPromise\n  ↓\nPending\n```\n\nकाम अझै सकिएको छैन।\n\n### Fulfilled\n\n<b>Fulfilled</b> (काम सफल भयो र नतिजा दियो)।\n\n```text\nPromise\n  ↓\nFulfilled\n  ↓\n\"Success!\"\n```\n\n### Rejected\n\n<b>Rejected</b> (काम fail भयो)।\n\n```text\nPromise\n  ↓\nRejected\n  ↓\nError\n```\n\nपूरा flow यो हो:\n\n```text\n             Pending\n             ↙     ↘\n       resolve     reject\n          ↓           ↓\n     Fulfilled     Rejected\n```\n\nPromise fulfilled वा rejected भएपछि, यसलाई <b>settled</b> (सकिएको र अब बदलिन नसक्ने) भनिन्छ।\n\n---\n\n## 4. Promise एक पटक मात्र Settle हुन सक्छ\n\nPromise settle भएपछि, यसको state बदलिन सक्दैन।\n\nउदाहरणका लागि:\n\n```javascript\nconst promise = new Promise((resolve, reject) => {\n  resolve(\"First\");\n\n  resolve(\"Second\");\n  reject(new Error(\"Error\"));\n});\n```\n\nनतिजा अझै यही हुन्छ:\n\n```text\nFirst\n```\n\nपहिलो `resolve()` जित्छ।\n\nपछिका `resolve()` र `reject()` बेवास्ता हुन्छन्।\n\nयसलाई यसरी सोच्नुहोस्:\n\n```text\nPending\n   ↓\nFulfilled\n   ↓\nCannot change\n```\n\n---\n\n## 5. `.then()` ले Promise प्रयोग गर्नु\n\nPromise भएपछि, हामी सफल नतिजा सम्हाल्न `.then()` प्रयोग गर्न सक्छौं।\n\n```javascript\npromise.then((result) => {\n  console.log(result);\n});\n```\n\nयदि Promise यसो resolve हुन्छ:\n\n```javascript\nresolve(\"Task completed\");\n```\n\nतब:\n\n```text\nPromise fulfilled\n      ↓\n.then()\n      ↓\n\"Task completed\"\n```\n\n---\n\n## 6. `.catch()` ले Error सम्हाल्नु\n\nPromise reject हुँदा हामी `.catch()` प्रयोग गर्छौं।\n\n```javascript\npromise.catch((error) => {\n  console.log(error.message);\n});\n```\n\nउदाहरणका लागि:\n\n```javascript\nconst promise = new Promise((resolve, reject) => {\n  reject(new Error(\"Something went wrong\"));\n});\n\npromise.catch((error) => {\n  console.log(error.message);\n});\n```\n\nOutput:\n\n```text\nSomething went wrong\n```\n\n---\n\n## 7. `.then()` र `.catch()` सँगै\n\nसामान्यतया तपाईं यो देख्नुहुन्छ:\n\n```javascript\npromise\n  .then((result) => {\n    console.log(result);\n  })\n  .catch((error) => {\n    console.log(error);\n  });\n```\n\nसोच्नुहोस्:\n\n```text\nPromise\n   ↓\nSuccess? ──→ .then()\n   ↓\nFailure? ──→ .catch()\n```\n\n---\n\n## 8. `.finally()`\n\n<b>`finally()`</b> (Promise सफल होस् वा fail, चल्ने code) cleanup का लागि उपयोगी छ।\n\nउदाहरणका लागि, कल्पना गर्नुहोस् हामी loading spinner देखाइरहेका छौं:\n\n```javascript\nshowLoading();\n\nfetchData()\n  .then((data) => {\n    console.log(data);\n  })\n  .catch((error) => {\n    console.log(error);\n  })\n  .finally(() => {\n    hideLoading();\n  });\n```\n\nRequest सफल होस् वा fail:\n\n```text\nSuccess ──┐\n          ├──→ finally()\nFailure ──┘\n```\n\nयसले `finally()` लाई यस्ता चीजका लागि उपयोगी बनाउँछ:\n\n• Loading indicator लुकाउनु\n• Connection बन्द गर्नु\n• Resource सफा गर्नु\n• अस्थायी state reset गर्नु\n\n`finally()` ले result वा error पाउँदैन।\n\n---\n\n## 9. Promise Return गर्नै पर्छ\n\nयो बच्नुपर्ने महत्वपूर्ण गल्ती हो।\n\nनराम्रो:\n\n```javascript\nfunction getUser() {\n  fetch(\"/users/1\");\n}\n```\n\nFunction ले Promise return गरेको छैन।\n\nत्यसैले:\n\n```javascript\nconst result = getUser();\n\nresult.then(...);\n```\n\nयो काम गर्दैन किनकि `result` `undefined` हो।\n\nबरु:\n\n```javascript\nfunction getUser() {\n  return fetch(\"/users/1\");\n}\n```\n\nअब caller ले Promise पाउँछ:\n\n```javascript\ngetUser()\n  .then((response) => {\n    console.log(response);\n  })\n  .catch((error) => {\n    console.log(error);\n  });\n```\n\nयसलाई यसरी सोच्नुहोस्:\n\n```text\ngetUser()\n   ↓\nreturns Promise\n   ↓\n.then()\n   ↓\nGet result\n```\n\n---\n\n## 10. वास्तविक उदाहरण\n\nसानो Promise बनाऊँ:\n\n```javascript\nfunction getUser() {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      resolve({\n        id: 1,\n        name: \"Rajan\"\n      });\n    }, 1000);\n  });\n}\n```\n\n<b>`setTimeout()`</b> (तोकिएको delay पछि code चलाउने) एक second कुर्छ।\n\nत्यसपछि Promise resolve हुन्छ।\n\nहामी यसलाई प्रयोग गर्न सक्छौं:\n\n```javascript\ngetUser()\n  .then((user) => {\n    console.log(user.name);\n  })\n  .catch((error) => {\n    console.log(error.message);\n  })\n  .finally(() => {\n    console.log(\"Finished\");\n  });\n```\n\nएक second पछि:\n\n```text\nRajan\nFinished\n```",
        jp: "<b>Promise</b>（将来の結果を表すオブジェクト）は、すぐには終わらない処理に使います。\n\nたとえば:\n\n• APIを呼ぶ\n• ファイルを読む\n• データベースに問い合わせる\n• タイマーを待つ\n\nレストランの注文を思い浮かべてください:\n\n> 料理を注文しても、料理はまだできていません。その注文番号があなたの<b>Promise</b>です。後で受け取るものを表しています。\n\n---\n\n## 1. Promiseを作る\n\nPromiseはこう作ります:\n\n```javascript\nconst promise = new Promise((resolve, reject) => {\n  // Do some work\n});\n```\n\n`new Promise()` の中の関数を<b>executor</b>（処理を開始する関数）と呼びます。\n\nこれは2つの関数を受け取ります:\n\n```javascript\nresolve\nreject\n```\n\n### `resolve()`\n\n処理が成功したら `resolve()` を呼びます。\n\n```javascript\nresolve(\"Success!\");\n```\n\n### `reject()`\n\n問題が起きたら `reject()` を呼びます。\n\n```javascript\nreject(new Error(\"Something went wrong\"));\n```\n\n---\n\n## 2. シンプルなPromise\n\n```javascript\nconst promise = new Promise((resolve, reject) => {\n  const success = true;\n\n  if (success) {\n    resolve(\"Task completed\");\n  } else {\n    reject(new Error(\"Task failed\"));\n  }\n});\n```\n\n流れはこうです:\n\n```text\nStart Promise\n     ↓\nDo some work\n     ↓\n   Success?\n   ↙     ↘\n Yes      No\n ↓         ↓\nresolve   reject\n```\n\n---\n\n## 3. Promiseの状態\n\nPromiseは常に<b>3つの状態</b>のいずれかです:\n\n### Pending（保留）\n\n<b>Pending</b>（まだ結果を待っている）。\n\n```text\nPromise\n  ↓\nPending\n```\n\n処理はまだ終わっていません。\n\n### Fulfilled（成功）\n\n<b>Fulfilled</b>（処理が成功して結果が出た）。\n\n```text\nPromise\n  ↓\nFulfilled\n  ↓\n\"Success!\"\n```\n\n### Rejected（失敗）\n\n<b>Rejected</b>（処理が失敗した）。\n\n```text\nPromise\n  ↓\nRejected\n  ↓\nError\n```\n\n全体の流れはこうです:\n\n```text\n             Pending\n             ↙     ↘\n       resolve     reject\n          ↓           ↓\n     Fulfilled     Rejected\n```\n\nPromiseがfulfilledまたはrejectedになると、<b>settled</b>（確定してもう変わらない）と呼ばれます。\n\n---\n\n## 4. Promiseは一度しか確定しない\n\n一度確定したPromiseの状態は変わりません。\n\nたとえば:\n\n```javascript\nconst promise = new Promise((resolve, reject) => {\n  resolve(\"First\");\n\n  resolve(\"Second\");\n  reject(new Error(\"Error\"));\n});\n```\n\n結果はやはりこうなります:\n\n```text\nFirst\n```\n\n最初の `resolve()` が勝ちます。\n\n後の `resolve()` と `reject()` は無視されます。\n\nこうイメージしてください:\n\n```text\nPending\n   ↓\nFulfilled\n   ↓\nCannot change\n```\n\n---\n\n## 5. `.then()` でPromiseを使う\n\nPromiseを手にしたら、`.then()` で成功した結果を扱えます。\n\n```javascript\npromise.then((result) => {\n  console.log(result);\n});\n```\n\nPromiseがこう解決した場合:\n\n```javascript\nresolve(\"Task completed\");\n```\n\nすると:\n\n```text\nPromise fulfilled\n      ↓\n.then()\n      ↓\n\"Task completed\"\n```\n\n---\n\n## 6. `.catch()` でエラーを扱う\n\nPromiseが拒否されたときは `.catch()` を使います。\n\n```javascript\npromise.catch((error) => {\n  console.log(error.message);\n});\n```\n\nたとえば:\n\n```javascript\nconst promise = new Promise((resolve, reject) => {\n  reject(new Error(\"Something went wrong\"));\n});\n\npromise.catch((error) => {\n  console.log(error.message);\n});\n```\n\n出力:\n\n```text\nSomething went wrong\n```\n\n---\n\n## 7. `.then()` と `.catch()` を一緒に\n\n通常はこう書きます:\n\n```javascript\npromise\n  .then((result) => {\n    console.log(result);\n  })\n  .catch((error) => {\n    console.log(error);\n  });\n```\n\nこう考えてください:\n\n```text\nPromise\n   ↓\nSuccess? ──→ .then()\n   ↓\nFailure? ──→ .catch()\n```\n\n---\n\n## 8. `.finally()`\n\n<b>`finally()`</b>（Promiseが成功しても失敗しても実行されるコード）は後片付けに役立ちます。\n\nたとえば、読み込み中のスピナーを表示しているとしましょう:\n\n```javascript\nshowLoading();\n\nfetchData()\n  .then((data) => {\n    console.log(data);\n  })\n  .catch((error) => {\n    console.log(error);\n  })\n  .finally(() => {\n    hideLoading();\n  });\n```\n\nリクエストが成功しても失敗しても:\n\n```text\nSuccess ──┐\n          ├──→ finally()\nFailure ──┘\n```\n\nそのため `finally()` は次のようなことに役立ちます:\n\n• 読み込み表示を隠す\n• 接続を閉じる\n• リソースを片付ける\n• 一時的な状態をリセットする\n\n`finally()` は結果もエラーも受け取りません。\n\n---\n\n## 9. Promiseを返さなければならない\n\nこれは避けるべき重要な間違いです。\n\n悪い例:\n\n```javascript\nfunction getUser() {\n  fetch(\"/users/1\");\n}\n```\n\nこの関数はPromiseを返していません。\n\nだから:\n\n```javascript\nconst result = getUser();\n\nresult.then(...);\n```\n\n`result` が `undefined` なので動きません。\n\n代わりに:\n\n```javascript\nfunction getUser() {\n  return fetch(\"/users/1\");\n}\n```\n\nこれで呼び出し側がPromiseを受け取れます:\n\n```javascript\ngetUser()\n  .then((response) => {\n    console.log(response);\n  })\n  .catch((error) => {\n    console.log(error);\n  });\n```\n\nこうイメージしてください:\n\n```text\ngetUser()\n   ↓\nreturns Promise\n   ↓\n.then()\n   ↓\nGet result\n```\n\n---\n\n## 10. 実際の例\n\n小さなPromiseを作ってみましょう:\n\n```javascript\nfunction getUser() {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      resolve({\n        id: 1,\n        name: \"Rajan\"\n      });\n    }, 1000);\n  });\n}\n```\n\n<b>`setTimeout()`</b>（指定した遅延の後にコードを実行する）が1秒待ちます。\n\nその後Promiseが解決されます。\n\nこう使えます:\n\n```javascript\ngetUser()\n  .then((user) => {\n    console.log(user.name);\n  })\n  .catch((error) => {\n    console.log(error.message);\n  })\n  .finally(() => {\n    console.log(\"Finished\");\n  });\n```\n\n1秒後:\n\n```text\nRajan\nFinished\n```",
      },
      diagram: `Promise
→ An object representing a future result.

Pending
→ Still waiting.

Fulfilled
→ Success.

Rejected
→ Failed.

Settled
→ Finished; cannot change anymore.

resolve()
→ Mark the Promise as successful.

reject()
→ Mark the Promise as failed.

.then()
→ Handle success.

.catch()
→ Handle errors.

.finally()
→ Run cleanup regardless of success or failure.

return Promise
→ Give the caller the Promise so they can use .then(), .catch(), or await.`,
      codeExample: {
        title: { en: "new Promise(), then(), catch(), finally()", np: "new Promise(), then(), catch(), finally()", jp: "Promiseの作成と then・catch・finally" },
        code: `// ── Simple Promise — resolve immediately ────────────────────────────
const greeting = new Promise(resolve => resolve("Hello JavaScript"));
greeting.then(message => console.log(message));   // "Hello JavaScript"

// ── Creating a Promise with async work ───────────────────────────────
const fetchUser = (id) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) reject(new Error("ID must be positive"));
      else resolve({ id, name: "Alice" });
    }, 1000);
  });

// ── Consuming: then / catch / finally ────────────────────────────────
fetchUser(1)
  .then(user => console.log("Got user:", user.name))
  .catch(err  => console.error("Failed:", err.message))
  .finally(() => console.log("Always runs"));

// ── A Promise can only settle ONCE ───────────────────────────────────
new Promise((resolve, reject) => {
  resolve("first");
  reject(new Error("ignored"));   // too late — already settled, no-op
  resolve("also ignored");        // also a no-op
}).then(value => console.log(value)); // "first"

// ── Real backend example — reject with a real Error ──────────────────
function findUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id) resolve({ id, name: "Rajan" });
      else reject(new Error("User not found"));
    }, 1000);
  });
}
findUser(10)
  .then(user => console.log(user))     // { id: 10, name: "Rajan" }
  .catch(err  => console.log(err.message));

// ── Wrapping a callback API in a Promise ──────────────────────────────
const fs = require("fs");
const readFilePromise = (path) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

readFilePromise("./config.json")
  .then(data => console.log("File contents:", data))
  .catch(err  => console.error("Could not read file:", err.message));`,
      },
      keyTakeaways: [
        { en: "A <b>Promise</b> represents a future result. `new Promise((resolve, reject) => { ... })` runs an <b>executor</b> that calls `resolve()` on success or `reject()` on failure.", np: "<b>Promise</b> भविष्यको नतिजाको प्रतिनिधित्व गर्छ। `new Promise((resolve, reject) => { ... })` ले <b>executor</b> चलाउँछ, जसले सफल भए `resolve()` र fail भए `reject()` call गर्छ।", jp: "<b>Promise</b> は将来の結果を表す。`new Promise((resolve, reject) => { ... })` は<b>executor</b>を実行し、成功時は `resolve()`、失敗時は `reject()` を呼ぶ。" },
        { en: "It starts <b>pending</b>, then becomes <b>fulfilled</b> or <b>rejected</b> — at which point it is <b>settled</b> and can never change again.", np: "यो <b>pending</b> बाट सुरु हुन्छ, त्यसपछि <b>fulfilled</b> वा <b>rejected</b> हुन्छ — त्यसपछि यो <b>settled</b> हुन्छ र फेरि कहिल्यै बदलिन सक्दैन।", jp: "最初は <b>pending</b>、その後 <b>fulfilled</b> か <b>rejected</b> になる。その時点で <b>settled</b> となり、二度と変わらない。" },
        { en: "Only the first settle counts — calling `resolve(\"First\")` then `resolve(\"Second\")` or `reject()` still gives `First`; the later calls are ignored.", np: "पहिलो settle मात्र गन्ती हुन्छ — `resolve(\"First\")` पछि `resolve(\"Second\")` वा `reject()` call गर्दा पनि `First` आउँछ; पछिका call बेवास्ता हुन्छन्।", jp: "有効なのは最初の確定だけ — `resolve(\"First\")` の後に `resolve(\"Second\")` や `reject()` を呼んでも結果は `First`。後の呼び出しは無視される。" },
        { en: "`.then()` handles success, `.catch()` handles errors, and they are normally chained together on the same Promise.", np: "`.then()` ले सफलता सम्हाल्छ, `.catch()` ले error सम्हाल्छ, र सामान्यतया दुबै उही Promise मा chain गरिन्छ।", jp: "`.then()` は成功を、`.catch()` はエラーを扱い、通常は同じPromiseに続けてチェーンする。" },
        { en: "`.finally()` runs whether the Promise succeeded or failed, which makes it the place to hide a loading spinner, close a connection or reset temporary state. It receives neither the result nor the error.", np: "`.finally()` Promise सफल होस् वा fail, चल्छ, त्यसैले loading spinner लुकाउने, connection बन्द गर्ने वा अस्थायी state reset गर्ने ठाउँ यही हो। यसले न result न error पाउँछ।", jp: "`.finally()` はPromiseが成功しても失敗しても実行されるので、スピナーを隠す・接続を閉じる・一時的な状態をリセットする場所になる。結果もエラーも受け取らない。" },
        { en: "Always <b>return</b> the Promise from your function — `return fetch(\"/users/1\")`, not `fetch(\"/users/1\")` — otherwise the caller gets `undefined` and cannot use `.then()` or `await`.", np: "तपाईंको function बाट Promise सधैं <b>return</b> गर्नुहोस् — `return fetch(\"/users/1\")`, `fetch(\"/users/1\")` होइन — नत्र caller ले `undefined` पाउँछ र `.then()` वा `await` प्रयोग गर्न सक्दैन।", jp: "関数からは必ずPromiseを <b>return</b> する — `fetch(\"/users/1\")` ではなく `return fetch(\"/users/1\")`。さもないと呼び出し側は `undefined` を受け取り、`.then()` も `await` も使えない。" },
        { en: "A real Promise often wraps a delayed operation, e.g. `setTimeout()` inside the executor, resolving with the value once the work is done.", np: "वास्तविक Promise प्रायः ढिलो हुने operation लपेट्छ, जस्तै executor भित्र `setTimeout()`, काम सकिएपछि value सँग resolve हुन्छ।", jp: "実際のPromiseは遅延処理を包むことが多い。たとえばexecutorの中で `setTimeout()` を使い、処理が終わったら値でresolveする。" },
        { en: "In one line: a Promise represents a future result — it starts pending, then becomes fulfilled or rejected. Use `.then()` for success, `.catch()` for errors, `.finally()` for cleanup.", np: "एक वाक्यमा: Promise भविष्यको नतिजाको प्रतिनिधित्व गर्छ — pending बाट सुरु हुन्छ, त्यसपछि fulfilled वा rejected हुन्छ। सफलताका लागि `.then()`, error का लागि `.catch()`, cleanup का लागि `.finally()`।", jp: "一言で言えば: Promiseは将来の結果を表す — pendingで始まり、fulfilledかrejectedになる。成功は `.then()`、エラーは `.catch()`、後片付けは `.finally()`。" },
      ],
      commonMistakes: [
        { en: "Writing `new Promise(...)` inside a function but forgetting to `return` it — the caller gets `undefined` instead of a usable Promise.", np: "Function भित्र `new Promise(...)` लेखेर तर `return` गर्न बिर्सनु — caller ले usable Promise को सट्टा `undefined` पाउँछ।", jp: "関数内で`new Promise(...)`を書いたが`return`し忘れること。呼び出し側は使えるPromiseの代わりに`undefined`を受け取る。" },
        { en: "Assuming a later `resolve()` or `reject()` call overrides an earlier one — only the first call to either wins; every call after that is a silent no-op.", np: "पछिको `resolve()` वा `reject()` call ले पहिलेकोलाई override गर्छ भन्ने ठान्नु — पहिलो call मात्र मान्य हुन्छ; त्यसपछिका सबै calls silently no-op हुन्छन्।", jp: "後の`resolve()`や`reject()`が先の呼び出しを上書きすると思い込むこと。実際は最初の呼び出しだけが有効で、それ以降はすべて黙って無視される。" },
        { en: "Rejecting with something other than an `Error` (e.g. `reject(console.log(\"Error\"))`, which rejects with `undefined`) instead of `reject(new Error(\"...\"))`.", np: "`reject(new Error(\"...\"))` को सट्टा `Error` बाहेक अरू केही सँग reject गर्नु (जस्तै `reject(console.log(\"Error\"))`, जसले `undefined` सँग reject गर्छ)।", jp: "`reject(new Error(\"...\"))`の代わりに`Error`以外のものでrejectすること（例：`undefined`でrejectする`reject(console.log(\"Error\"))`）。" },
        { en: "Forgetting `.catch()` entirely, so a failed Promise's error disappears silently instead of being handled.", np: "`.catch()` नै बिर्सनु, जसले गर्दा failed Promise को error handle नभई silently हराउँछ।", jp: "`.catch()`を完全に忘れること。失敗したPromiseのエラーが処理されずに黙って消えてしまう。" },
        { en: "Confusing the Promise object with its eventual value — `const user = fetchUser(); user.name` fails because `fetchUser()` returns a Promise, not the user; you need `.then(user => user.name)`.", np: "Promise object लाई त्यसको eventual value सँग confuse गर्नु — `const user = fetchUser(); user.name` fail हुन्छ किनकि `fetchUser()` ले user होइन Promise फर्काउँछ; `.then(user => user.name)` चाहिन्छ।", jp: "Promiseオブジェクトを最終的な値と混同すること。`const user = fetchUser(); user.name`は失敗する。`fetchUser()`はユーザーではなくPromiseを返すため。`.then(user => user.name)`が必要。" },
      ],
      quiz: [
        {
          question: { en: "If a Promise's executor calls `resolve(\"a\")` and then later calls `reject(new Error(\"b\"))`, what happens?", np: "Promise को executor ले `resolve(\"a\")` call गरेपछि `reject(new Error(\"b\"))` call गर्यो भने के हुन्छ?", jp: "Promiseのエグゼキュータが`resolve(\"a\")`を呼んだ後に`reject(new Error(\"b\"))`を呼んだらどうなる？" },
          options: [
            { en: "Nothing — the Promise is already fulfilled with \"a\"; the reject call is ignored", np: "केही हुँदैन — Promise पहिले नै \"a\" सहित fulfilled भइसक्यो; reject call ignore हुन्छ", jp: "何も起きない — Promiseはすでに\"a\"でfulfilledされており、reject呼び出しは無視される" },
            { en: "The Promise switches to rejected with \"b\"", np: "Promise \"b\" सहित rejected मा switch हुन्छ", jp: "Promiseは\"b\"でrejectedに切り替わる" },
          ],
          correctIndex: 0,
          explanation: { en: "A Promise settles only once — the first resolve/reject call wins, and every call after that has no effect.", np: "Promise एकपल्ट मात्र settle हुन्छ — पहिलो resolve/reject call मान्य हुन्छ, त्यसपछिका calls को कुनै असर हुँदैन।", jp: "Promiseは一度だけ確定する。最初のresolve/reject呼び出しが有効になり、それ以降の呼び出しは効果を持たない。" },
        },
        {
          question: { en: "What is `.catch(fn)` shorthand for?", np: "`.catch(fn)` कसको shorthand हो?", jp: "`.catch(fn)`は何の糖衣構文？" },
          options: [
            { en: "`.then(fn, undefined)`", np: "`.then(fn, undefined)`", jp: "`.then(fn, undefined)`" },
            { en: "`.then(undefined, fn)`", np: "`.then(undefined, fn)`", jp: "`.then(undefined, fn)`" },
          ],
          correctIndex: 1,
          explanation: { en: "`.catch()` registers only a rejection handler, which is exactly what passing `undefined` as `.then()`'s first argument and `fn` as the second does.", np: "`.catch()` ले rejection handler मात्र register गर्छ, जुन `.then()` को पहिलो argument मा `undefined` र दोस्रोमा `fn` पास गरेसरह हो।", jp: "`.catch()`はrejectionハンドラだけを登録する。これは`.then()`の第一引数に`undefined`、第二引数に`fn`を渡すのと同じこと。" },
        },
        {
          question: { en: "Does `.finally(fn)` receive the resolved value or rejection reason as an argument?", np: "`.finally(fn)` ले resolved value वा rejection reason argument को रूपमा पाउँछ?", jp: "`.finally(fn)`は解決値や拒否理由を引数として受け取る？" },
          options: [
            { en: "No — `fn` runs with no arguments, since it must behave the same either way", np: "होइन — `fn` कुनै argument बिना चल्छ, किनकि यसले दुवै अवस्थामा उस्तै behave गर्नुपर्छ", jp: "いいえ — `fn`は引数なしで実行される。どちらの場合も同じ動作をする必要があるため" },
            { en: "Yes — it always receives the resolved value", np: "हो — यसले सधैं resolved value पाउँछ", jp: "はい — 常に解決値を受け取る" },
          ],
          correctIndex: 0,
          explanation: { en: "`.finally()` is meant purely for side effects that must happen regardless of outcome, so it intentionally gets no arguments.", np: "`.finally()` result जे भए पनि हुनुपर्ने side effects का लागि हो, त्यसैले यसले जानाजानी कुनै argument पाउँदैन।", jp: "`.finally()`は結果に関わらず発生すべき副作用のためのものなので、意図的に引数を受け取らない。" },
        },
      ],
    },
    {
      id: "promise-chaining",
      title: { en: "Promise Chaining", np: "Promise Chaining", jp: "Promiseのチェーン" },
      durationMinutes: 9,
      explanation: {
        en: "<b>Promise chaining</b> connects several asynchronous steps one after another instead of nesting them.\n\nThink of an assembly line:\n\n> Each worker finishes one step and passes the result to the next worker.\n\nIn code:\n\n```javascript\nfirstTask()\n  .then(secondTask)\n  .then(thirdTask)\n  .catch(handleError);\n```\n\n---\n\n## 1. Every `.then()` Returns a New Promise\n\nThis is the rule that makes chaining possible.\n\n```text\nfirstTask()      → Promise A\n  .then(...)     → Promise B\n  .then(...)     → Promise C\n```\n\nEach `.then()` gives back a <b>brand-new Promise</b>.\n\nSo whatever you `return` inside a `.then()` callback becomes the value the next `.then()` receives.\n\nFor example:\n\n```javascript\ngetNumber()\n  .then((n) => n * 2)\n  .then((n) => {\n    console.log(n);\n  });\n```\n\nThe flow is:\n\n```text\ngetNumber() → 5\n     ↓\n.then(n => n * 2) → 10\n     ↓\n.then(n => console.log(n)) → 10\n```\n\n---\n\n## 2. Returning a Plain Value\n\nIf the callback returns a plain value (a string, number, object), that value is automatically wrapped in an <b>already-resolved Promise</b>.\n\n```javascript\n.then((user) => user.name)\n```\n\nSo the next step receives the name directly:\n\n```text\nreturn \"Rajan\"\n     ↓\nPromise resolved with \"Rajan\"\n     ↓\nNext .then() receives \"Rajan\"\n```\n\nYou don't have to create a Promise yourself.\n\n---\n\n## 3. Returning Another Promise\n\nIf the callback returns <b>another Promise</b>, the chain pauses and waits for that Promise to settle before continuing.\n\nFor example:\n\n```javascript\ngetUser()\n  .then((user) => getOrders(user.id))\n  .then((orders) => {\n    console.log(orders);\n  });\n```\n\nHere:\n\n```text\ngetUser()\n     ↓\nreturns a Promise from getOrders()\n     ↓\nchain WAITS for it to settle\n     ↓\nnext .then() receives the orders\n```\n\nThis is exactly how you sequence dependent async calls.\n\n---\n\n## 4. Sequencing Dependent Steps\n\nEach step needs the result of the step before it.\n\n```text\nValidate user\n     ↓\nCreate payment\n     ↓\nSave transaction\n```\n\nAs a chain:\n\n```javascript\nvalidateUser(id)\n  .then((user) => createPayment(user))\n  .then((payment) => saveTransaction(payment))\n  .catch((error) => {\n    console.log(error.message);\n  });\n```\n\nThe code stays flat instead of nesting deeper and deeper.\n\n---\n\n## 5. How `fetch()` Uses This\n\nThe browser's `fetch()` API works the same way:\n\n```javascript\nfetch(url)\n  .then((response) => response.json())\n  .then((data) => {\n    console.log(data);\n  });\n```\n\nThe important detail:\n\n```javascript\nresponse.json()\n```\n\nitself returns a Promise, so you <b>return</b> it to let the chain wait for the parsed data.\n\n```text\nfetch(url)\n     ↓\nresponse\n     ↓\nresponse.json() → Promise\n     ↓\ndata\n```\n\n---\n\n## 6. Errors Travel Down the Chain\n\nErrors <b>propagate</b> (travel) automatically down a chain.\n\nIf any `.then()` callback throws, or the Promise it returns rejects, control jumps straight to the nearest `.catch()` further down — skipping every `.then()` in between.\n\n```text\n.then()  ← throws here\n   ↓\n.then()  ← skipped\n   ↓\n.then()  ← skipped\n   ↓\n.catch() ← runs\n```\n\n---\n\n## 7. One `.catch()` at the End\n\nBecause errors skip ahead, a chain usually needs only <b>one</b> `.catch()` at the end.\n\n```javascript\nstepOne()\n  .then(stepTwo)\n  .then(stepThree)\n  .then(stepFour)\n  .catch((error) => {\n    console.log(error.message);\n  });\n```\n\nThat single `.catch()` acts as a safety net for every step above it.\n\nCompare that with callbacks, where you repeat `if (err) return;` at every level.\n\n---\n\n## 8. The Most Common Bug: Forgetting `return`\n\nThis is the mistake to watch for.\n\nBad:\n\n```javascript\ngetUser()\n  .then((user) => {\n    getOrders(user.id);\n  })\n  .then((orders) => {\n    console.log(orders);\n  });\n```\n\nNothing is returned from the first `.then()`, so the chain doesn't wait.\n\nThe next step receives:\n\n```text\nundefined\n```\n\nGood:\n\n```javascript\ngetUser()\n  .then((user) => {\n    return getOrders(user.id);\n  })\n  .then((orders) => {\n    console.log(orders);\n  });\n```\n\nNow the chain waits for the real result.\n\n```text\nNo return  → next .then() gets undefined\nWith return → next .then() waits for the Promise\n```",
        np: "<b>Promise chaining</b> ले धेरै asynchronous step लाई nest गर्नुको साटो एकपछि अर्को जोड्छ।\n\nAssembly line सोच्नुहोस्:\n\n> हरेक कामदारले एउटा step सक्काउँछ र नतिजा अर्को कामदारलाई दिन्छ।\n\nCode मा:\n\n```javascript\nfirstTask()\n  .then(secondTask)\n  .then(thirdTask)\n  .catch(handleError);\n```\n\n---\n\n## 1. हरेक `.then()` ले नयाँ Promise फर्काउँछ\n\nचaining सम्भव बनाउने नियम यही हो।\n\n```text\nfirstTask()      → Promise A\n  .then(...)     → Promise B\n  .then(...)     → Promise C\n```\n\nहरेक `.then()` ले <b>बिल्कुल नयाँ Promise</b> फर्काउँछ।\n\nत्यसैले `.then()` callback भित्र तपाईंले जे `return` गर्नुहुन्छ, त्यही अर्को `.then()` ले पाउने value बन्छ।\n\nउदाहरणका लागि:\n\n```javascript\ngetNumber()\n  .then((n) => n * 2)\n  .then((n) => {\n    console.log(n);\n  });\n```\n\nFlow यो हो:\n\n```text\ngetNumber() → 5\n     ↓\n.then(n => n * 2) → 10\n     ↓\n.then(n => console.log(n)) → 10\n```\n\n---\n\n## 2. साधारण Value फर्काउनु\n\nCallback ले साधारण value (string, number, object) फर्काए, त्यो value स्वतः <b>पहिले नै resolve भइसकेको Promise</b> मा लपेटिन्छ।\n\n```javascript\n.then((user) => user.name)\n```\n\nत्यसैले अर्को step ले नाम सिधै पाउँछ:\n\n```text\nreturn \"Rajan\"\n     ↓\nPromise resolved with \"Rajan\"\n     ↓\nNext .then() receives \"Rajan\"\n```\n\nतपाईंले आफैं Promise बनाउनु पर्दैन।\n\n---\n\n## 3. अर्को Promise फर्काउनु\n\nCallback ले <b>अर्को Promise</b> फर्काए, chain रोकिन्छ र त्यो Promise settle हुने बेलासम्म कुर्छ।\n\nउदाहरणका लागि:\n\n```javascript\ngetUser()\n  .then((user) => getOrders(user.id))\n  .then((orders) => {\n    console.log(orders);\n  });\n```\n\nयहाँ:\n\n```text\ngetUser()\n     ↓\nreturns a Promise from getOrders()\n     ↓\nchain WAITS for it to settle\n     ↓\nnext .then() receives the orders\n```\n\nनिर्भर async call क्रमबद्ध गर्ने तरिका ठ्याक्कै यही हो।\n\n---\n\n## 4. निर्भर Step क्रमबद्ध गर्नु\n\nहरेक step लाई अघिल्लो step को नतिजा चाहिन्छ।\n\n```text\nValidate user\n     ↓\nCreate payment\n     ↓\nSave transaction\n```\n\nChain को रूपमा:\n\n```javascript\nvalidateUser(id)\n  .then((user) => createPayment(user))\n  .then((payment) => saveTransaction(payment))\n  .catch((error) => {\n    console.log(error.message);\n  });\n```\n\nCode गहिरो-गहिरो nested नभई सम्म रहन्छ।\n\n---\n\n## 5. `fetch()` ले यसलाई कसरी प्रयोग गर्छ\n\nBrowser को `fetch()` API यही तरिकाले काम गर्छ:\n\n```javascript\nfetch(url)\n  .then((response) => response.json())\n  .then((data) => {\n    console.log(data);\n  });\n```\n\nमहत्वपूर्ण कुरा:\n\n```javascript\nresponse.json()\n```\n\nयसले आफैं Promise फर्काउँछ, त्यसैले chain लाई parse भएको data कुर्न दिनका लागि तपाईंले यसलाई <b>return</b> गर्नुहुन्छ।\n\n```text\nfetch(url)\n     ↓\nresponse\n     ↓\nresponse.json() → Promise\n     ↓\ndata\n```\n\n---\n\n## 6. Error Chain तल यात्रा गर्छ\n\nError स्वतः chain तल <b>propagate</b> (यात्रा) गर्छ।\n\nकुनै `.then()` callback ले throw गरे, वा यसले फर्काएको Promise reject भए, control सिधै तलको सबैभन्दा नजिकको `.catch()` मा जान्छ — बीचका हरेक `.then()` छोड्दै।\n\n```text\n.then()  ← throws here\n   ↓\n.then()  ← skipped\n   ↓\n.then()  ← skipped\n   ↓\n.catch() ← runs\n```\n\n---\n\n## 7. अन्तमा एउटै `.catch()`\n\nError अगाडि छोड्दै जाने हुनाले, chain लाई सामान्यतया अन्तमा <b>एउटै</b> `.catch()` चाहिन्छ।\n\n```javascript\nstepOne()\n  .then(stepTwo)\n  .then(stepThree)\n  .then(stepFour)\n  .catch((error) => {\n    console.log(error.message);\n  });\n```\n\nत्यो एउटै `.catch()` माथिका हरेक step का लागि safety net बन्छ।\n\nCallback सँग तुलना गर्नुहोस्, जहाँ तपाईंले हरेक level मा `if (err) return;` दोहोर्याउनुहुन्छ।\n\n---\n\n## 8. सबैभन्दा सामान्य Bug: `return` बिर्सनु\n\nयही गल्तीमा ध्यान दिनुपर्छ।\n\nनराम्रो:\n\n```javascript\ngetUser()\n  .then((user) => {\n    getOrders(user.id);\n  })\n  .then((orders) => {\n    console.log(orders);\n  });\n```\n\nपहिलो `.then()` बाट केही return भएको छैन, त्यसैले chain कुर्दैन।\n\nअर्को step यो पाउँछ:\n\n```text\nundefined\n```\n\nराम्रो:\n\n```javascript\ngetUser()\n  .then((user) => {\n    return getOrders(user.id);\n  })\n  .then((orders) => {\n    console.log(orders);\n  });\n```\n\nअब chain वास्तविक नतिजा कुर्छ।\n\n```text\nNo return  → next .then() gets undefined\nWith return → next .then() waits for the Promise\n```",
        jp: "<b>Promiseチェーン</b>は、複数の非同期ステップをネストせずに一列につなげます。\n\n組み立てラインを思い浮かべてください:\n\n> 各作業者が1つの工程を終え、その結果を次の作業者に渡します。\n\nコードでは:\n\n```javascript\nfirstTask()\n  .then(secondTask)\n  .then(thirdTask)\n  .catch(handleError);\n```\n\n---\n\n## 1. すべての `.then()` は新しいPromiseを返す\n\nチェーンを可能にしているのがこの規則です。\n\n```text\nfirstTask()      → Promise A\n  .then(...)     → Promise B\n  .then(...)     → Promise C\n```\n\n各 `.then()` は<b>まったく新しいPromise</b>を返します。\n\nそのため `.then()` のコールバックの中で `return` したものが、次の `.then()` が受け取る値になります。\n\nたとえば:\n\n```javascript\ngetNumber()\n  .then((n) => n * 2)\n  .then((n) => {\n    console.log(n);\n  });\n```\n\n流れはこうです:\n\n```text\ngetNumber() → 5\n     ↓\n.then(n => n * 2) → 10\n     ↓\n.then(n => console.log(n)) → 10\n```\n\n---\n\n## 2. 普通の値を返す\n\nコールバックが普通の値（文字列・数値・オブジェクト）を返すと、その値は自動的に<b>すでに解決済みのPromise</b>に包まれます。\n\n```javascript\n.then((user) => user.name)\n```\n\nだから次のステップは名前をそのまま受け取ります:\n\n```text\nreturn \"Rajan\"\n     ↓\nPromise resolved with \"Rajan\"\n     ↓\nNext .then() receives \"Rajan\"\n```\n\n自分でPromiseを作る必要はありません。\n\n---\n\n## 3. 別のPromiseを返す\n\nコールバックが<b>別のPromise</b>を返すと、チェーンは一旦止まり、そのPromiseが確定するまで待ちます。\n\nたとえば:\n\n```javascript\ngetUser()\n  .then((user) => getOrders(user.id))\n  .then((orders) => {\n    console.log(orders);\n  });\n```\n\nここでは:\n\n```text\ngetUser()\n     ↓\nreturns a Promise from getOrders()\n     ↓\nchain WAITS for it to settle\n     ↓\nnext .then() receives the orders\n```\n\n依存関係のある非同期呼び出しを順番に並べる方法がまさにこれです。\n\n---\n\n## 4. 依存するステップを順に並べる\n\n各ステップは前のステップの結果を必要とします。\n\n```text\nValidate user\n     ↓\nCreate payment\n     ↓\nSave transaction\n```\n\nチェーンにすると:\n\n```javascript\nvalidateUser(id)\n  .then((user) => createPayment(user))\n  .then((payment) => saveTransaction(payment))\n  .catch((error) => {\n    console.log(error.message);\n  });\n```\n\nコードは深くネストせず、フラットなままです。\n\n---\n\n## 5. `fetch()` はこれをどう使うか\n\nブラウザの `fetch()` APIも同じ仕組みです:\n\n```javascript\nfetch(url)\n  .then((response) => response.json())\n  .then((data) => {\n    console.log(data);\n  });\n```\n\n大事な点:\n\n```javascript\nresponse.json()\n```\n\nこれ自体がPromiseを返すので、パース済みのデータをチェーンに待たせるために<b>return</b>します。\n\n```text\nfetch(url)\n     ↓\nresponse\n     ↓\nresponse.json() → Promise\n     ↓\ndata\n```\n\n---\n\n## 6. エラーはチェーンを下っていく\n\nエラーは自動的にチェーンを下へ<b>伝播（propagate）</b>します。\n\nどこかの `.then()` コールバックが例外を投げるか、返したPromiseが拒否されると、制御は間にあるすべての `.then()` を飛ばして、下にある最も近い `.catch()` へ直行します。\n\n```text\n.then()  ← throws here\n   ↓\n.then()  ← skipped\n   ↓\n.then()  ← skipped\n   ↓\n.catch() ← runs\n```\n\n---\n\n## 7. 最後に `.catch()` を1つ\n\nエラーが途中を飛ばすので、チェーンには通常、最後に<b>1つ</b>の `.catch()` があれば十分です。\n\n```javascript\nstepOne()\n  .then(stepTwo)\n  .then(stepThree)\n  .then(stepFour)\n  .catch((error) => {\n    console.log(error.message);\n  });\n```\n\nその1つの `.catch()` が、上のすべてのステップの安全網になります。\n\nコールバックでは各階層で `if (err) return;` を繰り返していたのと比べてみてください。\n\n---\n\n## 8. 最もよくあるバグ: `return` を忘れる\n\nこれが注意すべき間違いです。\n\n悪い例:\n\n```javascript\ngetUser()\n  .then((user) => {\n    getOrders(user.id);\n  })\n  .then((orders) => {\n    console.log(orders);\n  });\n```\n\n最初の `.then()` から何も返していないので、チェーンは待ちません。\n\n次のステップが受け取るのは:\n\n```text\nundefined\n```\n\n良い例:\n\n```javascript\ngetUser()\n  .then((user) => {\n    return getOrders(user.id);\n  })\n  .then((orders) => {\n    console.log(orders);\n  });\n```\n\nこれでチェーンは本当の結果を待ちます。\n\n```text\nNo return  → next .then() gets undefined\nWith return → next .then() waits for the Promise\n```",
      },
      diagram: `Promise chaining
→ Run async steps one after another instead of nesting them.

.then() returns a new Promise
→ That is what makes chaining possible.

return a plain value
→ Wrapped in an already-resolved Promise for the next .then().

return another Promise
→ The chain waits for it to settle before continuing.

Error propagation
→ A throw or rejection skips every .then() and jumps to the nearest .catch().

One .catch() at the end
→ A single safety net for every step above it.

Forgetting return
→ The next .then() gets undefined instead of the real result.`,
      codeExample: {
        title: { en: "Chaining async steps without nesting", np: "Nesting बिना async steps chain गर्नु", jp: "ネストなしで非同期ステップをチェーン" },
        code: `// ── Promise chain vs callback hell — same logic, cleaner structure ──
getUser(userId)
  .then(user    => getOrders(user.id))
  .then(orders  => getOrderDetails(orders[0].id))
  .then(details => render(details))
  .catch(err    => showError(err));  // ONE catch handles errors from every step above

// ── Returning a value vs returning a Promise from .then() ───────────
Promise.resolve(1)
  .then(n => n + 1)                    // returns 2 — wrapped in a resolved Promise
  .then(n => Promise.resolve(n * 2))   // returns a Promise — chain waits for it
  .then(n => console.log(n));          // 4

// ── Real backend example — each step feeds the next ──────────────────
function validateUser() { return Promise.resolve({ id: 10, name: "Rajan" }); }
function createPayment(user) { return Promise.resolve({ paymentId: 500, userId: user.id }); }
function saveTransaction(payment) { return Promise.resolve("Transaction saved"); }

validateUser()
  .then(user    => createPayment(user))
  .then(payment => saveTransaction(payment))
  .then(message => console.log(message))   // "Transaction saved"
  .catch(err    => console.log(err));

// ── The fetch() API — a real-world Promise chain ──────────────────────
fetch("https://api.example.com/users")
  .then(response => response.json())   // response.json() ALSO returns a Promise
  .then(users    => console.log(users))
  .catch(err     => console.log(err));

// ── Errors skip straight to the nearest .catch() ─────────────────────
Promise.resolve()
  .then(() => { throw new Error("step 2 failed"); })
  .then(() => console.log("this never runs"))   // skipped entirely
  .catch(err => console.error("Caught:", err.message)); // "Caught: step 2 failed"

// ── Common mistake: forgetting to return inside .then() ─────────────
// ❌ Bug — nothing is returned, so the next .then() gets undefined
getUser(userId)
  .then(user => {
    fetchOrders(user.id);   // forgot return!
  })
  .then(orders => console.log(orders)); // undefined

// ✅ Fixed — returning the Promise lets the chain wait for the real result
getUser(userId)
  .then(user => fetchOrders(user.id))   // return the Promise
  .then(orders => console.log(orders)); // the actual orders array`,
      },
      keyTakeaways: [
        { en: "<b>Promise chaining</b> runs dependent async steps one after another instead of nesting them: `firstTask().then(secondTask).then(thirdTask).catch(handleError)`.", np: "<b>Promise chaining</b> ले निर्भर async step हरू nest गर्नुको साटो एकपछि अर्को चलाउँछ: `firstTask().then(secondTask).then(thirdTask).catch(handleError)`।", jp: "<b>Promiseチェーン</b>は依存する非同期ステップをネストせず一列に実行する: `firstTask().then(secondTask).then(thirdTask).catch(handleError)`。" },
        { en: "Every `.then()` returns a brand-new Promise, so whatever you `return` inside a `.then()` callback becomes the value the next `.then()` receives.", np: "हरेक `.then()` ले बिल्कुल नयाँ Promise फर्काउँछ, त्यसैले `.then()` callback भित्र तपाईंले जे `return` गर्नुहुन्छ त्यही अर्को `.then()` ले पाउने value बन्छ।", jp: "すべての `.then()` はまったく新しいPromiseを返すので、`.then()` のコールバック内で `return` したものが次の `.then()` が受け取る値になる。" },
        { en: "Returning a plain value wraps it in an already-resolved Promise automatically — you don't need to create one yourself.", np: "साधारण value फर्काउँदा त्यो स्वतः पहिले नै resolve भइसकेको Promise मा लपेटिन्छ — तपाईंले आफैं बनाउनु पर्दैन।", jp: "普通の値を返すと自動的に解決済みのPromiseに包まれる — 自分で作る必要はない。" },
        { en: "Returning another Promise makes the chain pause and wait for it to settle — `getUser().then(user => getOrders(user.id))` — which is how you sequence dependent calls.", np: "अर्को Promise फर्काउँदा chain रोकिन्छ र त्यो settle हुन कुर्छ — `getUser().then(user => getOrders(user.id))` — यसै तरिकाले निर्भर call क्रमबद्ध गरिन्छ।", jp: "別のPromiseを返すとチェーンは一旦止まり、それが確定するまで待つ — `getUser().then(user => getOrders(user.id))` — これが依存する呼び出しを順に並べる方法。" },
        { en: "`fetch()` works exactly this way: `fetch(url).then(response => response.json()).then(data => ...)` — `response.json()` returns a Promise, so you return it to let the chain wait.", np: "`fetch()` ठ्याक्कै यही तरिकाले काम गर्छ: `fetch(url).then(response => response.json()).then(data => ...)` — `response.json()` ले Promise फर्काउँछ, त्यसैले chain कुर्न दिनका लागि यसलाई return गर्नुहोस्।", jp: "`fetch()` はまさにこの仕組み: `fetch(url).then(response => response.json()).then(data => ...)` — `response.json()` はPromiseを返すので、チェーンを待たせるためにreturnする。" },
        { en: "Errors propagate down the chain — a throw or rejection skips every `.then()` in between and jumps to the nearest `.catch()`.", np: "Error chain तल propagate हुन्छ — throw वा rejection ले बीचका हरेक `.then()` छोड्छ र सबैभन्दा नजिकको `.catch()` मा जान्छ।", jp: "エラーはチェーンを下に伝播する — 例外や拒否は間のすべての `.then()` を飛ばし、最も近い `.catch()` へ移る。" },
        { en: "That is why one `.catch()` at the end is usually enough: it acts as a single safety net for every step above it, instead of repeating `if (err) return;` like callbacks did.", np: "त्यसैले अन्तमा एउटै `.catch()` सामान्यतया पर्याप्त हुन्छ: callback जस्तै `if (err) return;` दोहोर्याउनुको साटो यो माथिका हरेक step का लागि एउटै safety net बन्छ।", jp: "だから最後の `.catch()` 1つで通常は足りる: コールバックのように `if (err) return;` を繰り返す代わりに、上のすべてのステップの安全網になる。" },
        { en: "The most common bug is forgetting to `return` a nested async call inside `.then()` — without it, the next `.then()` receives `undefined` instead of waiting for the real result.", np: "सबैभन्दा सामान्य bug `.then()` भित्रको nested async call लाई `return` गर्न बिर्सनु हो — यसबिना, अर्को `.then()` ले वास्तविक नतिजा कुर्नुको साटो `undefined` पाउँछ।", jp: "最もよくあるバグは `.then()` の中でネストした非同期呼び出しの `return` を忘れること — それがないと次の `.then()` は本当の結果を待たず `undefined` を受け取る。" },
      ],
      commonMistakes: [
        { en: "Forgetting to `return` a nested async call inside `.then()` — the next `.then()` then receives `undefined` instead of waiting for the real result.", np: "`.then()` भित्र nested async call `return` गर्न बिर्सनु — त्यसपछिको `.then()` ले वास्तविक result पर्खनुको सट्टा `undefined` पाउँछ।", jp: "`.then()`内でネストした非同期呼び出しの`return`を忘れること。次の`.then()`は本当の結果を待つ代わりに`undefined`を受け取る。" },
        { en: "Wrapping an already-available value in a new Promise unnecessarily (`return new Promise(resolve => resolve(user))`) instead of just `return user` — `.then()` already handles plain values fine.", np: "पहिले नै उपलब्ध value लाई अनावश्यक रूपमा नयाँ Promise भित्र wrap गर्नु (`return new Promise(resolve => resolve(user))`) `return user` को सट्टा — `.then()` ले plain values पहिले नै राम्रोसँग handle गर्छ।", jp: "すでに利用可能な値を単に`return user`とする代わりに不必要に新しいPromiseでラップすること（`return new Promise(resolve => resolve(user))`）。`.then()`は通常の値をすでにうまく処理する。" },
        { en: "Chaining steps in the wrong logical order (e.g. `savePayment().then(createPayment).then(validateUser)`) — each step needs the previous step's result, so the order must match the real dependency.", np: "Steps लाई गलत logical order मा chain गर्नु (जस्तै `savePayment().then(createPayment).then(validateUser)`) — हरेक step ले अघिल्लो step को result चाहिन्छ, त्यसैले order real dependency सँग मिल्नुपर्छ।", jp: "誤った論理順序でステップをチェーンすること（例：`savePayment().then(createPayment).then(validateUser)`）。各ステップは前のステップの結果を必要とするため、順序は実際の依存関係と一致する必要がある。" },
        { en: "Adding a `.catch()` after every single `.then()` instead of one at the end of the chain — this duplicates handling and can accidentally swallow errors from later steps.", np: "Chain को अन्तमा एउटा `.catch()` राख्नुको सट्टा हरेक `.then()` पछि छुट्टै `.catch()` थप्नु — यसले handling duplicate गर्छ र पछिका steps का errors गलतीले swallow गर्न सक्छ।", jp: "チェーンの最後に1つの`.catch()`を置く代わりに、各`.then()`の後に個別の`.catch()`を追加すること。処理が重複し、後のステップのエラーを誤って握りつぶす可能性がある。" },
        { en: "Assuming a rejected Promise only stops the very next `.then()` — it actually skips all remaining `.then()` calls until it finds a `.catch()`.", np: "Rejected Promise ले केवल त्यसपछिको `.then()` लाई मात्र रोक्छ भन्ने ठान्नु — वास्तवमा यसले `.catch()` नभेट्दासम्म बाँकी सबै `.then()` calls skip गर्छ।", jp: "rejectされたPromiseが次の`.then()`だけを止めると思い込むこと。実際には`.catch()`が見つかるまで残りのすべての`.then()`をスキップする。" },
      ],
      quiz: [
        {
          question: { en: "What does calling `.then()` on a Promise return?", np: "Promise मा `.then()` call गर्दा के फर्काउँछ?", jp: "Promiseに対して`.then()`を呼ぶと何が返る？" },
          options: [
            { en: "The same Promise it was called on", np: "जुन Promise मा call गरिएको थियो त्यही", jp: "呼び出された同じPromise" },
            { en: "A brand-new Promise", np: "एउटा नयाँ Promise", jp: "新しいPromise" },
          ],
          correctIndex: 1,
          explanation: { en: "Every `.then()` call produces a new Promise, which is exactly what allows further `.then()`/`.catch()` calls to be chained onto it.", np: "हरेक `.then()` call ले नयाँ Promise बनाउँछ, यसैले थप `.then()`/`.catch()` calls chain गर्न सकिन्छ।", jp: "各`.then()`呼び出しは新しいPromiseを生成する。これがさらに`.then()`/`.catch()`をチェーンできる理由。" },
        },
        {
          question: { en: "In `Promise.resolve(1).then(n => Promise.resolve(n * 2)).then(n => console.log(n))`, what gets logged?", np: "`Promise.resolve(1).then(n => Promise.resolve(n * 2)).then(n => console.log(n))` मा के log हुन्छ?", jp: "`Promise.resolve(1).then(n => Promise.resolve(n * 2)).then(n => console.log(n))`で何がログに出る？" },
          options: [
            { en: "2 — the chain waits for the returned Promise to settle before continuing", np: "2 — chain ले फर्काएको Promise settle नभएसम्म पर्खन्छ", jp: "2 — チェーンは返されたPromiseが確定するのを待ってから続行する" },
            { en: "A pending Promise object, not a number", np: "एउटा pending Promise object, number होइन", jp: "数値ではなくpending状態のPromiseオブジェクト" },
          ],
          correctIndex: 0,
          explanation: { en: "When a `.then()` callback returns a Promise, the chain automatically waits for it to settle and passes along its resolved value.", np: "`.then()` callback ले Promise फर्काउँदा, chain ले त्यो settle नभएसम्म automatically पर्खन्छ र resolved value पास गर्छ।", jp: "`.then()`のコールバックがPromiseを返すと、チェーンは自動的にそれが確定するのを待ち、解決した値を渡す。" },
        },
        {
          question: { en: "In `.then(a).then(b).then(c).catch(err)`, if `b` throws an error, does `c`'s `.then()` callback still run?", np: "`.then(a).then(b).then(c).catch(err)` मा `b` ले error throw गर्यो भने `c` को `.then()` callback चल्छ?", jp: "`.then(a).then(b).then(c).catch(err)`で`b`がエラーを投げたら、`c`の`.then()`コールバックは実行される？" },
          options: [
            { en: "Yes — `c` still runs with the error as its argument", np: "हो — `c` अझै error लाई argument को रूपमा लिएर चल्छ", jp: "はい — `c`はエラーを引数として実行される" },
            { en: "No — the error skips straight to `.catch(err)`, bypassing `c`", np: "होइन — error सिधै `.catch(err)` मा जान्छ, `c` bypass गरेर", jp: "いいえ — エラーは`c`を飛ばして直接`.catch(err)`にジャンプする" },
          ],
          correctIndex: 1,
          explanation: { en: "A thrown error inside a `.then()` callback propagates past every remaining `.then()` in the chain until it reaches a `.catch()`.", np: "`.then()` callback भित्र throw भएको error ले `.catch()` नभेट्दासम्म बाँकी सबै `.then()` लाई bypass गर्छ।", jp: "`.then()`コールバック内で投げられたエラーは、`.catch()`に到達するまでチェーン内の残りのすべての`.then()`を飛び越えて伝播する。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "In the error-first callback convention, what does the first argument represent?", np: "Error-first callback convention मा पहिलो argument ले के represent गर्छ?", jp: "エラーファーストコールバック規約で第一引数は何を表す？" },
      options: [{ en: "The error (null on success)", np: "Error (सफल भए null)", jp: "エラー（成功時はnull）" }, { en: "The result data", np: "Result data", jp: "結果データ" }],
      correctIndex: 0,
      explanation: { en: "By convention the first argument is always the error, `null` if nothing went wrong.", np: "Convention अनुसार पहिलो argument सधैं error हो, केही गडबड नभए `null`।", jp: "慣習として第一引数は常にエラーで、問題がなければ`null`。" },
    },
    {
      question: { en: "What is 'callback hell'?", np: "'Callback hell' के हो?", jp: "「コールバック地獄」とは何か？" },
      options: [{ en: "A JavaScript runtime error thrown after too many callbacks", np: "धेरै callbacks पछि JavaScript runtime ले throw गर्ने error", jp: "コールバックが多すぎる後にJavaScriptランタイムが投げるエラー" }, { en: "Deeply nested callbacks for dependent async steps, hard to read and maintain", np: "Dependent async steps का लागि गहिरो nested callbacks, पढ्न/maintain गर्न गाह्रो", jp: "依存する非同期ステップのために深くネストされたコールバックで、読みにくく保守しにくい" }],
      correctIndex: 1,
      explanation: { en: "It's a readability/maintainability problem, not a runtime error — and it's exactly what Promises were designed to fix.", np: "यो readability/maintainability समस्या हो, runtime error होइन — र यही समस्या समाधान गर्न Promises बनाइयो।", jp: "これは可読性・保守性の問題であり、ランタイムエラーではない。まさにPromiseが解決するために設計されたもの。" },
    },
    {
      question: { en: "Is the error-first callback convention enforced by the JavaScript language?", np: "Error-first callback convention JavaScript language ले enforce गर्छ?", jp: "エラーファーストコールバック規約はJavaScript言語によって強制される？" },
      options: [{ en: "No — it's just a widely followed convention", np: "होइन — यो व्यापक रूपमा followed convention मात्र हो", jp: "いいえ — 広く従われている慣習にすぎない" }, { en: "Yes — it's part of the language spec", np: "हो — यो language spec को भाग हो", jp: "はい — 言語仕様の一部" }],
      correctIndex: 0,
      explanation: { en: "It's a Node.js/community convention, not something the JavaScript engine enforces.", np: "यो Node.js/community convention हो, JavaScript engine ले enforce गर्ने कुरा होइन।", jp: "これはNode.js／コミュニティの慣習であり、JavaScriptエンジンが強制するものではない。" },
    },
    {
      question: { en: "What runs the executor function passed to `new Promise((resolve, reject) => {...})`, and when?", np: "`new Promise((resolve, reject) => {...})` मा pass गरिएको executor function कहिले चल्छ?", jp: "`new Promise((resolve, reject) => {...})`に渡されたエグゼキュータ関数はいつ実行される？" },
      options: [{ en: "Only when `.then()` is called on the Promise", np: "Promise मा `.then()` call गरेपछि मात्र", jp: "Promiseに`.then()`が呼ばれたときのみ" }, { en: "Immediately, as soon as the Promise is constructed", np: "Promise construct हुनेबित्तिकै तुरुन्तै", jp: "Promiseが構築されるとすぐに" }],
      correctIndex: 1,
      explanation: { en: "The executor runs synchronously and immediately when the Promise constructor is invoked, not later.", np: "Executor Promise constructor invoke हुनेबित्तिकै synchronously र immediately चल्छ, पछि होइन।", jp: "エグゼキュータはPromiseコンストラクタが呼ばれたときに同期的かつ即座に実行される。後からではない。" },
    },
    {
      question: { en: "If a Promise's executor calls `resolve()` and then later calls `reject()`, what happens?", np: "Promise को executor ले `resolve()` पछि `reject()` call गर्यो भने के हुन्छ?", jp: "Promiseのエグゼキュータが`resolve()`の後に`reject()`を呼んだらどうなる？" },
      options: [{ en: "The reject call is ignored — the Promise already settled as fulfilled", np: "Reject call ignore हुन्छ — Promise पहिले नै fulfilled भइसक्यो", jp: "reject呼び出しは無視される — Promiseはすでにfulfilledとして確定している" }, { en: "The Promise becomes rejected instead", np: "Promise बरु rejected हुन्छ", jp: "代わりにPromiseはrejectedになる" }],
      correctIndex: 0,
      explanation: { en: "A Promise can only settle once; the first resolve/reject call wins and every subsequent call is a no-op.", np: "Promise एकपल्ट मात्र settle हुन्छ; पहिलो resolve/reject call मान्य हुन्छ, त्यसपछिका calls को असर हुँदैन।", jp: "Promiseは一度だけ確定できる。最初のresolve/reject呼び出しが有効になり、それ以降の呼び出しは何もしない。" },
    },
    {
      question: { en: "What does `.catch(fn)` do internally?", np: "`.catch(fn)` ले internally के गर्छ?", jp: "`.catch(fn)`は内部で何をする？" },
      options: [{ en: "It creates a completely separate error-handling mechanism from `.then()`", np: "यसले `.then()` भन्दा पूर्ण फरक error-handling mechanism बनाउँछ", jp: "`.then()`とは完全に別のエラー処理メカニズムを作る" }, { en: "It's shorthand for `.then(undefined, fn)`", np: "यो `.then(undefined, fn)` को shorthand हो", jp: "`.then(undefined, fn)`の糖衣構文" }],
      correctIndex: 1,
      explanation: { en: "`.catch()` just registers a rejection handler, equivalent to passing `undefined` then `fn` into `.then()`.", np: "`.catch()` ले केवल rejection handler register गर्छ, `.then()` मा `undefined` अनि `fn` पास गरेसरह।", jp: "`.catch()`は単にrejectionハンドラを登録するだけで、`.then()`に`undefined`と`fn`を渡すのと同じ。" },
    },
    {
      question: { en: "What does `.then()` always return?", np: "`.then()` ले सधैं के फर्काउँछ?", jp: "`.then()`は常に何を返す？" },
      options: [{ en: "A brand-new Promise", np: "एउटा नयाँ Promise", jp: "新しいPromise" }, { en: "The exact same Promise it was called on", np: "जुन Promise मा call गरिएको थियो त्यही", jp: "呼び出された同じPromise" }],
      correctIndex: 0,
      explanation: { en: "Each `.then()` call returns a new Promise, which is what makes chaining `.then().then()` possible.", np: "हरेक `.then()` call ले नयाँ Promise फर्काउँछ, यसैले `.then().then()` chain गर्न सकिन्छ।", jp: "各`.then()`呼び出しは新しいPromiseを返す。これが`.then().then()`のチェーンを可能にする。" },
    },
    {
      question: { en: "If a `.then()` callback returns a plain value like `5` instead of a Promise, what happens to the chain?", np: "`.then()` callback ले Promise को सट्टा `5` जस्तो plain value फर्काए chain मा के हुन्छ?", jp: "`.then()`コールバックがPromiseの代わりに`5`のような通常の値を返すとチェーンはどうなる？" },
      options: [{ en: "The chain throws a TypeError because a non-Promise was returned", np: "Non-Promise फर्काएकोले chain ले TypeError throw गर्छ", jp: "Promise以外が返されたためチェーンはTypeErrorを投げる" }, { en: "The value is automatically wrapped in a resolved Promise and the chain continues", np: "Value automatically resolved Promise मा wrap हुन्छ र chain जारी रहन्छ", jp: "その値は自動的に解決済みPromiseにラップされ、チェーンは続行する" }],
      correctIndex: 1,
      explanation: { en: "Plain return values from `.then()` are automatically wrapped in an already-resolved Promise so chaining keeps working.", np: "`.then()` बाट फर्काएका plain values automatically resolved Promise मा wrap हुन्छन् ताकि chaining चलिरहोस्।", jp: "`.then()`から返された通常の値は自動的に解決済みPromiseにラップされ、チェーンが機能し続ける。" },
    },
    {
      question: { en: "If any step in a `.then()` chain throws or returns a rejected Promise, where does control go?", np: "`.then()` chain को कुनै step ले throw गर्यो वा rejected Promise फर्काए control कहाँ जान्छ?", jp: "`.then()`チェーンのどこかのステップが例外を投げるかrejectされたPromiseを返すと、制御はどこへ行く？" },
      options: [{ en: "It skips all remaining `.then()` calls and jumps to the nearest `.catch()`", np: "यसले बाँकी सबै `.then()` calls skip गरी नजिकको `.catch()` मा जान्छ", jp: "残りのすべての`.then()`をスキップし、最も近い`.catch()`にジャンプする" }, { en: "It stops the entire script immediately with an unhandled error", np: "यसले unhandled error सहित पूरै script तुरुन्तै रोक्छ", jp: "未処理エラーでスクリプト全体を即座に停止する" }],
      correctIndex: 0,
      explanation: { en: "Errors propagate down a Promise chain past every remaining `.then()` until they're caught by a `.catch()`.", np: "Errors Promise chain मा बाँकी सबै `.then()` bypass गरी `.catch()` ले catch नगरेसम्म propagate हुन्छन्।", jp: "エラーはPromiseチェーンを伝わり、`.catch()`にキャッチされるまで残りのすべての`.then()`を通過する。" },
    },
  ],
};
