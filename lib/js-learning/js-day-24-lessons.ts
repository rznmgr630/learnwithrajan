import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_24_LESSONS: JsLessonDay = {
  day: 24,
  title: { en: "Memory management — stack, heap, GC & leak detection", np: "Memory management", jp: "メモリ管理・GC・リーク検出" },
  totalMinutes: 27,
  difficulty: { en: "Advanced", np: "Advanced", jp: "上級" },
  lessons: [
    {
      id: "stack-heap-gc",
      title: { en: "Stack vs Heap & Garbage Collection", np: "Stack vs Heap र Garbage Collection", jp: "スタックとヒープ・ガベージコレクション" },
      durationMinutes: 9,
      explanation: {
        en: "JavaScript needs memory to store values, objects and the information required while functions are running. Two useful concepts for understanding this are the <b>stack</b> and the <b>heap</b>.\n\nThe <b>stack</b> is used for function execution and short-lived data such as local bindings and call frames. When a function returns, its call frame is removed.\n\nThe <b>heap</b> is where engines keep dynamically allocated data — objects, arrays, functions and anything that can outlive a particular function call.\n\n```text\n                 JavaScript Memory\n\n        ┌──────────────────────────────┐\n        │            STACK             │\n        │                              │\n        │  function calls              │\n        │  local execution state       │\n        │  references / primitive data │\n        │                              │\n        └──────────────┬───────────────┘\n                       │\n                       │ references\n                       ▼\n        ┌──────────────────────────────┐\n        │             HEAP             │\n        │                              │\n        │  Objects                     │\n        │  Arrays                      │\n        │  Functions                   │\n        │  Closures                    │\n        │                              │\n        └──────────────────────────────┘\n```\n\n> <b>Important:</b> \"primitives live on the stack and objects live on the heap\" is a useful learning model, not a strict rule of the language. The actual memory representation is engine-dependent.\n\n---\n\n### References in practice\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n```\n\n```text\nStack                         Heap\n\nuser ───────────────────────► {\n                                name: \"Rajan\",\n                                age: 30\n                              }\n```\n\nNow assign it to a second variable:\n\n```javascript\nconst user2 = user;\n```\n\n```text\nStack                         Heap\n\nuser  ──────────────────────►\n                               ┌─────────────────┐\nuser2 ───────────────────────► │ name: \"Rajan\"   │\n                               │ age: 30         │\n                               └─────────────────┘\n```\n\nBoth variables refer to the <b>same object</b>, so:\n\n```javascript\nuser2.age = 31;\n\nconsole.log(user.age); // 31\n```\n\n---\n\n### 1. Basic — primitive values are independent\n\n```javascript\nlet a = 10;\nlet b = a;\n\nb = 20;\n\nconsole.log(a); // 10\nconsole.log(b); // 20\n```\n\nThe assignment gives `b` its own value:\n\n```text\na = 10\n\nb = a\n\na ──► 10\nb ──► 10\n\nb = 20\n\na ──► 10\nb ──► 20\n```\n\n---\n\n### 2. Intermediate — objects are shared through references\n\n```javascript\nconst user1 = { name: \"Rajan\" };\n\nconst user2 = user1;\n\nuser2.name = \"Alex\";\n\nconsole.log(user1.name); // \"Alex\"\n```\n\n`const user2 = user1;` does <b>not</b> create a new object:\n\n```text\nuser1 ───────┐\n             ▼\n        ┌───────────────┐\n        │ name: \"Alex\"  │\n        └───────────────┘\n             ▲\n             │\nuser2 ───────┘\n```\n\nIf you need independence, make a copy:\n\n```javascript\nconst user2 = { ...user1 };\n\nuser2.name = \"Alex\";\n\nconsole.log(user1.name); // \"Rajan\"\n```\n\n---\n\n### 3. Advanced — closures keep data alive\n\n```javascript\nfunction createCounter() {\n  let count = 0;\n\n  return function () {\n    count++;\n\n    return count;\n  };\n}\n\nconst counter = createCounter();\n\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\n```\n\n`createCounter()` has already returned, so you might expect `count` to disappear. But the returned function still references it:\n\n```text\ncreateCounter()\n\n   count = 0\n       │\n       │ closure keeps reference\n       ▼\n┌──────────────────┐\n│ returned function│\n│                  │\n│ count++          │\n└──────────────────┘\n```\n\nAs long as `counter` is reachable, the state the closure needs stays reachable too. That is what makes closures powerful, and also why an unnecessarily long-lived closure can retain memory.\n\n---\n\n### Garbage collection\n\nJavaScript manages memory automatically through <b>garbage collection</b>. You never free objects by hand. When an object is no longer reachable from running code, the engine can eventually reclaim it.\n\nThe key idea is <b>reachability</b>:\n\n```text\nGC Roots\n   │\n   ├── global variables\n   ├── active execution\n   └── live closures\n          │\n          ▼\n       Object A\n          │\n          ▼\n       Object B\n```\n\nAnything that cannot be reached from the roots is eligible for collection.\n\n---\n\n### Mark-and-sweep\n\nA common strategy is <b>mark-and-sweep</b>, in two stages.\n\n<b>Mark</b> — start from the roots and follow every reference:\n\n```text\nRoot\n │\n ▼\nObject A ─────► Object B\n │\n ▼\nObject C\n```\n\n<b>Sweep</b> — anything not marked is unreachable and can be reclaimed:\n\n```text\nBefore GC:\n\nRoot → A → B\n\nX → Y\n\nAfter GC:\n\nRoot → A → B\n\nX → Y   collected\n```\n\n---\n\n### Circular references are not automatically leaks\n\nA common misconception is that a cycle leaks memory. Modern collectors do not simply count references.\n\n```javascript\nlet user = { name: \"Rajan\" };\n\nlet profile = { owner: user };\n\nuser.profile = profile;\n```\n\n```text\nuser ─────► profile\n  ▲           │\n  └───────────┘\n```\n\nNow drop both variables:\n\n```javascript\nuser = null;\nprofile = null;\n```\n\nNothing reachable points into the cycle any more, so the whole cycle is collectable:\n\n```text\nGC Roots\n\n   X\n\n   ↓\n\nuser ───► profile\n ▲          │\n └──────────┘\n\nNo path from a root\n        ↓\n   unreachable\n        ↓\n     collected\n```\n\n---\n\n### Memory leaks\n\nGarbage collection does <b>not</b> mean an application can never leak. A leak happens when something stays reachable even though the application no longer needs it.\n\n```javascript\nconst button = document.querySelector(\"#button\");\n\nconst largeData = new Array(1_000_000).fill(\"data\");\n\nfunction handleClick() {\n  console.log(largeData.length);\n}\n\nbutton.addEventListener(\"click\", handleClick);\n```\n\nIf the listener stays attached unnecessarily, it can keep that data alive longer than intended. Timers do the same:\n\n```javascript\nconst id = setInterval(() => {\n  console.log(\"running\");\n}, 1000);\n\nclearInterval(id);\n```\n\n> <b>Garbage collection removes unreachable memory. It cannot remove something your program is still accidentally keeping reachable.</b>\n\n---\n\n### Stack overflow vs memory leak\n\nThese are different problems. A <b>stack overflow</b> comes from excessive recursion:\n\n```javascript\nfunction forever() {\n  forever();\n}\n\nforever(); // RangeError: Maximum call stack size exceeded\n```\n\nA <b>memory leak</b> is memory retained because objects stay reachable when they should not:\n\n```text\nApplication\n    │\n    ├── needed object\n    │\n    └── accidentally retained object\n                         │\n                         ▼\n                    large data\n```\n\nThe call stack is not necessarily overflowing at all.\n\n---\n\n### Five ideas to remember\n\n1. The stack tracks function execution.\n2. Objects are shared through references.\n3. Closures can keep outer state reachable after a function returns.\n4. Garbage collection is based on reachability, not on \"the function finished\".\n5. Circular references are not inherently leaks; an unreachable cycle can still be collected.",
        np: "JavaScript लाई मान, object र function चल्दा चाहिने जानकारी राख्न memory चाहिन्छ। यो बुझ्न दुई उपयोगी अवधारणा हुन् — <b>stack</b> र <b>heap</b>।\n\n<b>Stack</b> function execution र local binding तथा call frame जस्ता छोटो आयुका data का लागि प्रयोग हुन्छ। Function return हुँदा यसको call frame हट्छ।\n\n<b>Heap</b> मा engine ले गतिशील रूपमा छुट्याइएका data राख्छ — object, array, function र कुनै पनि function call भन्दा बढी टिक्न सक्ने कुरा।\n\n```text\n                 JavaScript Memory\n\n        ┌──────────────────────────────┐\n        │            STACK             │\n        │                              │\n        │  function calls              │\n        │  local execution state       │\n        │  references / primitive data │\n        │                              │\n        └──────────────┬───────────────┘\n                       │\n                       │ references\n                       ▼\n        ┌──────────────────────────────┐\n        │             HEAP             │\n        │                              │\n        │  Objects                     │\n        │  Arrays                      │\n        │  Functions                   │\n        │  Closures                    │\n        │                              │\n        └──────────────────────────────┘\n```\n\n> <b>महत्वपूर्ण:</b> \"primitive stack मा र object heap मा बस्छन्\" सिक्नका लागि उपयोगी model हो, भाषाको कडा नियम होइन। वास्तविक memory प्रतिनिधित्व engine-अनुसार फरक हुन्छ।\n\n---\n\n### व्यवहारमा reference\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n```\n\n```text\nStack                         Heap\n\nuser ───────────────────────► {\n                                name: \"Rajan\",\n                                age: 30\n                              }\n```\n\nअब दोस्रो variable मा दिनुहोस्:\n\n```javascript\nconst user2 = user;\n```\n\n```text\nStack                         Heap\n\nuser  ──────────────────────►\n                               ┌─────────────────┐\nuser2 ───────────────────────► │ name: \"Rajan\"   │\n                               │ age: 30         │\n                               └─────────────────┘\n```\n\nदुबै variable <b>एउटै object</b> लाई जनाउँछन्, त्यसैले:\n\n```javascript\nuser2.age = 31;\n\nconsole.log(user.age); // 31\n```\n\n---\n\n### 1. आधारभूत — primitive मान स्वतन्त्र हुन्छन्\n\n```javascript\nlet a = 10;\nlet b = a;\n\nb = 20;\n\nconsole.log(a); // 10\nconsole.log(b); // 20\n```\n\nAssignment ले `b` लाई आफ्नै मान दिन्छ:\n\n```text\na = 10\n\nb = a\n\na ──► 10\nb ──► 10\n\nb = 20\n\na ──► 10\nb ──► 20\n```\n\n---\n\n### 2. मध्यम — object reference मार्फत बाँडिन्छन्\n\n```javascript\nconst user1 = { name: \"Rajan\" };\n\nconst user2 = user1;\n\nuser2.name = \"Alex\";\n\nconsole.log(user1.name); // \"Alex\"\n```\n\n`const user2 = user1;` ले नयाँ object <b>बनाउँदैन</b>:\n\n```text\nuser1 ───────┐\n             ▼\n        ┌───────────────┐\n        │ name: \"Alex\"  │\n        └───────────────┘\n             ▲\n             │\nuser2 ───────┘\n```\n\nस्वतन्त्रता चाहिए, copy बनाउनुहोस्:\n\n```javascript\nconst user2 = { ...user1 };\n\nuser2.name = \"Alex\";\n\nconsole.log(user1.name); // \"Rajan\"\n```\n\n---\n\n### 3. उन्नत — closure ले data जीवित राख्छ\n\n```javascript\nfunction createCounter() {\n  let count = 0;\n\n  return function () {\n    count++;\n\n    return count;\n  };\n}\n\nconst counter = createCounter();\n\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\n```\n\n`createCounter()` पहिले नै return भइसक्यो, त्यसैले `count` हराउँछ भन्ने लाग्न सक्छ। तर फर्केको function ले यसलाई अझै जनाउँछ:\n\n```text\ncreateCounter()\n\n   count = 0\n       │\n       │ closure keeps reference\n       ▼\n┌──────────────────┐\n│ returned function│\n│                  │\n│ count++          │\n└──────────────────┘\n```\n\n`counter` पुग्न सकिने रहेसम्म, closure लाई चाहिने अवस्था पनि पुग्न सकिने रहन्छ। यसैले closure शक्तिशाली छन्, र यसैले अनावश्यक रूपमा लामो आयुका closure ले memory रोक्न सक्छन्।\n\n---\n\n### Garbage collection\n\nJavaScript ले <b>garbage collection</b> मार्फत memory आफैं व्यवस्थापन गर्छ। तपाईंले हातले object मुक्त गर्नुपर्दैन। चलिरहेको code बाट object पुग्न नसकिने भएपछि, engine ले यसको memory फिर्ता लिन सक्छ।\n\nमुख्य विचार <b>reachability</b> हो:\n\n```text\nGC Roots\n   │\n   ├── global variables\n   ├── active execution\n   └── live closures\n          │\n          ▼\n       Object A\n          │\n          ▼\n       Object B\n```\n\nRoot बाट पुग्न नसकिने जुनसुकै कुरा संकलनयोग्य हुन्छ।\n\n---\n\n### Mark-and-sweep\n\nसामान्य रणनीति <b>mark-and-sweep</b> हो, दुई चरणमा।\n\n<b>Mark</b> — root बाट सुरु गरी हरेक reference पछ्याउनुहोस्:\n\n```text\nRoot\n │\n ▼\nObject A ─────► Object B\n │\n ▼\nObject C\n```\n\n<b>Sweep</b> — mark नभएको जुनसुकै पुग्न नसकिने हो र फिर्ता लिन सकिन्छ:\n\n```text\nBefore GC:\n\nRoot → A → B\n\nX → Y\n\nAfter GC:\n\nRoot → A → B\n\nX → Y   collected\n```\n\n---\n\n### Circular reference स्वतः leak होइन\n\nCycle ले memory leak गर्छ भन्ने सामान्य भ्रम हो। आधुनिक collector ले reference मात्र गन्दैनन्।\n\n```javascript\nlet user = { name: \"Rajan\" };\n\nlet profile = { owner: user };\n\nuser.profile = profile;\n```\n\n```text\nuser ─────► profile\n  ▲           │\n  └───────────┘\n```\n\nअब दुबै variable छाड्नुहोस्:\n\n```javascript\nuser = null;\nprofile = null;\n```\n\nअब cycle भित्र पुग्न सकिने कुनै बाटो छैन, त्यसैले पूरै cycle संकलनयोग्य छ:\n\n```text\nGC Roots\n\n   X\n\n   ↓\n\nuser ───► profile\n ▲          │\n └──────────┘\n\nNo path from a root\n        ↓\n   unreachable\n        ↓\n     collected\n```\n\n---\n\n### Memory leak\n\nGarbage collection हुँदैमा application ले कहिल्यै leak गर्दैन भन्ने <b>होइन</b>। Application लाई अब नचाहिए पनि केही कुरा पुग्न सकिने रहँदा leak हुन्छ।\n\n```javascript\nconst button = document.querySelector(\"#button\");\n\nconst largeData = new Array(1_000_000).fill(\"data\");\n\nfunction handleClick() {\n  console.log(largeData.length);\n}\n\nbutton.addEventListener(\"click\", handleClick);\n```\n\nListener अनावश्यक रूपमा जोडिइरहे, यसले त्यो data सोचेभन्दा लामो समय जीवित राख्न सक्छ। Timer ले पनि उही गर्छ:\n\n```javascript\nconst id = setInterval(() => {\n  console.log(\"running\");\n}, 1000);\n\nclearInterval(id);\n```\n\n> <b>Garbage collection ले पुग्न नसकिने memory हटाउँछ। तपाईंको program ले अनजानमा पुग्न सकिने बनाइराखेको कुरा यसले हटाउन सक्दैन।</b>\n\n---\n\n### Stack overflow vs memory leak\n\nयी फरक समस्या हुन्। <b>Stack overflow</b> अत्यधिक recursion बाट आउँछ:\n\n```javascript\nfunction forever() {\n  forever();\n}\n\nforever(); // RangeError: Maximum call stack size exceeded\n```\n\n<b>Memory leak</b> भनेको हुनुनपर्ने बेला object पुग्न सकिने रहँदा memory रोकिनु हो:\n\n```text\nApplication\n    │\n    ├── needed object\n    │\n    └── accidentally retained object\n                         │\n                         ▼\n                    large data\n```\n\nयहाँ call stack नाघेको हुनै पर्दैन।\n\n---\n\n### सम्झनुपर्ने पाँच विचार\n\n1. Stack ले function execution को हिसाब राख्छ।\n2. Object reference मार्फत बाँडिन्छन्।\n3. Function return भएपछि पनि closure ले बाहिरी अवस्था पुग्न सकिने बनाइराख्न सक्छ।\n4. Garbage collection reachability मा आधारित छ, \"function सकियो\" मा होइन।\n5. Circular reference आफैंमा leak होइनन्; पुग्न नसकिने cycle पनि संकलन हुन सक्छ।",
        jp: "JavaScriptは、値やオブジェクト、そして関数の実行中に必要な情報を保持するためにメモリを使います。これを理解するのに便利なのが<b>スタック</b>と<b>ヒープ</b>です。\n\n<b>スタック</b>は関数の実行と、ローカル束縛や呼び出しフレームのような短命なデータに使われます。関数が戻ると、そのフレームは取り除かれます。\n\n<b>ヒープ</b>にはエンジンが動的に確保したデータ、つまりオブジェクト・配列・関数など、特定の関数呼び出しより長生きしうるものが置かれます。\n\n```text\n                 JavaScript Memory\n\n        ┌──────────────────────────────┐\n        │            STACK             │\n        │                              │\n        │  function calls              │\n        │  local execution state       │\n        │  references / primitive data │\n        │                              │\n        └──────────────┬───────────────┘\n                       │\n                       │ references\n                       ▼\n        ┌──────────────────────────────┐\n        │             HEAP             │\n        │                              │\n        │  Objects                     │\n        │  Arrays                      │\n        │  Functions                   │\n        │  Closures                    │\n        │                              │\n        └──────────────────────────────┘\n```\n\n> <b>注意:</b>「プリミティブはスタック、オブジェクトはヒープ」は学習用の便利なモデルであって、言語仕様の厳密な規定ではありません。実際の表現はエンジン次第です。\n\n---\n\n### 参照の実際\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n```\n\n```text\nStack                         Heap\n\nuser ───────────────────────► {\n                                name: \"Rajan\",\n                                age: 30\n                              }\n```\n\nもう1つの変数に代入すると:\n\n```javascript\nconst user2 = user;\n```\n\n```text\nStack                         Heap\n\nuser  ──────────────────────►\n                               ┌─────────────────┐\nuser2 ───────────────────────► │ name: \"Rajan\"   │\n                               │ age: 30         │\n                               └─────────────────┘\n```\n\nどちらの変数も<b>同じオブジェクト</b>を指すので:\n\n```javascript\nuser2.age = 31;\n\nconsole.log(user.age); // 31\n```\n\n---\n\n### 1. 基本 — プリミティブは独立している\n\n```javascript\nlet a = 10;\nlet b = a;\n\nb = 20;\n\nconsole.log(a); // 10\nconsole.log(b); // 20\n```\n\n代入によって `b` は自分の値を持ちます:\n\n```text\na = 10\n\nb = a\n\na ──► 10\nb ──► 10\n\nb = 20\n\na ──► 10\nb ──► 20\n```\n\n---\n\n### 2. 中級 — オブジェクトは参照で共有される\n\n```javascript\nconst user1 = { name: \"Rajan\" };\n\nconst user2 = user1;\n\nuser2.name = \"Alex\";\n\nconsole.log(user1.name); // \"Alex\"\n```\n\n`const user2 = user1;` は新しいオブジェクトを<b>作りません</b>:\n\n```text\nuser1 ───────┐\n             ▼\n        ┌───────────────┐\n        │ name: \"Alex\"  │\n        └───────────────┘\n             ▲\n             │\nuser2 ───────┘\n```\n\n独立させたいならコピーを作ります:\n\n```javascript\nconst user2 = { ...user1 };\n\nuser2.name = \"Alex\";\n\nconsole.log(user1.name); // \"Rajan\"\n```\n\n---\n\n### 3. 上級 — クロージャがデータを生かし続ける\n\n```javascript\nfunction createCounter() {\n  let count = 0;\n\n  return function () {\n    count++;\n\n    return count;\n  };\n}\n\nconst counter = createCounter();\n\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\n```\n\n`createCounter()` はすでに戻っているので `count` は消えると思うかもしれません。しかし返された関数がそれを参照し続けています:\n\n```text\ncreateCounter()\n\n   count = 0\n       │\n       │ closure keeps reference\n       ▼\n┌──────────────────┐\n│ returned function│\n│                  │\n│ count++          │\n└──────────────────┘\n```\n\n`counter` に到達できる限り、クロージャが必要とする状態にも到達できます。これがクロージャの強みであり、不必要に長生きするクロージャがメモリを抱え込む理由でもあります。\n\n---\n\n### ガベージコレクション\n\nJavaScriptは<b>ガベージコレクション</b>でメモリを自動管理します。手でオブジェクトを解放することはありません。実行中のコードから到達できなくなれば、エンジンはいずれ回収できます。\n\n鍵は<b>到達可能性</b>です:\n\n```text\nGC Roots\n   │\n   ├── global variables\n   ├── active execution\n   └── live closures\n          │\n          ▼\n       Object A\n          │\n          ▼\n       Object B\n```\n\nルートから到達できないものは回収の対象になります。\n\n---\n\n### マーク・アンド・スイープ\n\n代表的な方式が<b>マーク・アンド・スイープ</b>で、2段階です。\n\n<b>マーク</b> — ルートから参照をたどります:\n\n```text\nRoot\n │\n ▼\nObject A ─────► Object B\n │\n ▼\nObject C\n```\n\n<b>スイープ</b> — マークされなかったものは到達不能で、回収できます:\n\n```text\nBefore GC:\n\nRoot → A → B\n\nX → Y\n\nAfter GC:\n\nRoot → A → B\n\nX → Y   collected\n```\n\n---\n\n### 循環参照は自動的にリークではない\n\n循環がメモリリークを起こすというのはよくある誤解です。現代のコレクタは参照を数えているわけではありません。\n\n```javascript\nlet user = { name: \"Rajan\" };\n\nlet profile = { owner: user };\n\nuser.profile = profile;\n```\n\n```text\nuser ─────► profile\n  ▲           │\n  └───────────┘\n```\n\n両方の変数を手放すと:\n\n```javascript\nuser = null;\nprofile = null;\n```\n\n循環の中へ到達する経路がなくなるので、循環ごと回収できます:\n\n```text\nGC Roots\n\n   X\n\n   ↓\n\nuser ───► profile\n ▲          │\n └──────────┘\n\nNo path from a root\n        ↓\n   unreachable\n        ↓\n     collected\n```\n\n---\n\n### メモリリーク\n\nガベージコレクションがあるからリークしない、という話では<b>ありません</b>。もう必要ないのに到達可能なままのものがあれば、それがリークです。\n\n```javascript\nconst button = document.querySelector(\"#button\");\n\nconst largeData = new Array(1_000_000).fill(\"data\");\n\nfunction handleClick() {\n  console.log(largeData.length);\n}\n\nbutton.addEventListener(\"click\", handleClick);\n```\n\nリスナーが不要に残ると、そのデータを意図より長く生かします。タイマーも同じです:\n\n```javascript\nconst id = setInterval(() => {\n  console.log(\"running\");\n}, 1000);\n\nclearInterval(id);\n```\n\n> <b>ガベージコレクションが消せるのは到達不能なメモリだけ。プログラムがうっかり到達可能に保っているものは消せない。</b>\n\n---\n\n### スタックオーバーフローとメモリリーク\n\n両者は別問題です。<b>スタックオーバーフロー</b>は過剰な再帰から起きます:\n\n```javascript\nfunction forever() {\n  forever();\n}\n\nforever(); // RangeError: Maximum call stack size exceeded\n```\n\n<b>メモリリーク</b>は、本来不要なオブジェクトが到達可能なままでメモリが保持されることです:\n\n```text\nApplication\n    │\n    ├── needed object\n    │\n    └── accidentally retained object\n                         │\n                         ▼\n                    large data\n```\n\nコールスタックが溢れているとは限りません。\n\n---\n\n### 覚えておく5つ\n\n1. スタックは関数の実行を追う。\n2. オブジェクトは参照で共有される。\n3. 関数が戻った後も、クロージャは外側の状態を到達可能に保てる。\n4. ガベージコレクションは「関数が終わったか」ではなく到達可能性で決まる。\n5. 循環参照そのものはリークではない。到達不能な循環は回収できる。",
      },
      diagram: `                 JavaScript Memory

        ┌──────────────────────────────┐
        │            STACK             │
        │  function calls              │
        │  local execution state       │
        │  references / primitive data │
        └──────────────┬───────────────┘
                       │ references
                       ▼
        ┌──────────────────────────────┐
        │             HEAP             │
        │  Objects   Arrays            │
        │  Functions Closures          │
        └──────────────────────────────┘


Two names, one object

user1 ───────┐
             ▼
        ┌───────────────┐
        │ name: "Alex"  │
        └───────────────┘
             ▲
             │
user2 ───────┘


Reachability decides, not scope

GC Roots
   │
   ├── global variables
   ├── active execution
   └── live closures
          │
          ▼
       Object A ─────► Object B

       X ─────► Y      no path from a root
                             ↓
                          collected


An unreachable cycle is still collectable

user ───► profile
 ▲          │
 └──────────┘
       │
       ▼
 nothing points in
       │
       ▼
   collected`,
      codeExample: {
        title: { en: "References, closures and reachability", np: "Reference, closure र reachability", jp: "参照・クロージャ・到達可能性" },
        code: `// ── 1. Basic — primitives copy, objects do not ────────────────────
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 — b got its own value

const user1 = { name: "Rajan" };
const user2 = user1;      // same object, not a copy
user2.name = "Alex";
console.log(user1.name);  // "Alex"

const independent = { ...user1 }; // now it really is a copy

// ── 2. Intermediate — a closure keeps outer state reachable ───────
function createCounter() {
  let count = 0;          // survives after createCounter returns

  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();
counter(); // 1
counter(); // 2

// ── 3. Advanced — an unreachable cycle is still collectable ───────
let user = { name: "Rajan" };
let profile = { owner: user };
user.profile = profile;   // a cycle

user = null;
profile = null;           // nothing reachable points in, so it can go

// ── A leak is reachability you did not intend ─────────────────────
const largeData = new Array(1_000_000).fill("data");

function handleClick() {
  console.log(largeData.length); // the listener keeps largeData alive
}

button.addEventListener("click", handleClick);
button.removeEventListener("click", handleClick); // release it when done

const id = setInterval(() => console.log("running"), 1000);
clearInterval(id);

// ── Stack overflow is a different failure from a leak ─────────────
function forever() {
  forever(); // RangeError: Maximum call stack size exceeded
}`,
      },
      keyTakeaways: [
        { en: "The <b>stack</b> tracks function execution; the <b>heap</b> holds dynamically allocated data.", np: "<b>Stack</b> ले function execution को हिसाब राख्छ; <b>heap</b> ले गतिशील रूपमा छुट्याइएको data राख्छ।", jp: "<b>スタック</b>は関数の実行を追い、<b>ヒープ</b>は動的に確保したデータを保持する。" },
        { en: "Assigning an object copies the <b>reference</b>, not the object — both names point at the same value.", np: "Object assign गर्दा object होइन, <b>reference</b> copy हुन्छ — दुबै नामले उही मान जनाउँछन्।", jp: "オブジェクトの代入はオブジェクトではなく<b>参照</b>を複製する。どちらの名前も同じ値を指す。" },
        { en: "Primitives behave independently: `b = a` gives `b` its own value.", np: "Primitive स्वतन्त्र रूपमा व्यवहार गर्छन्: `b = a` ले `b` लाई आफ्नै मान दिन्छ।", jp: "プリミティブは独立して振る舞う。`b = a` は `b` に自分の値を与える。" },
        { en: "A <b>closure</b> keeps its outer state reachable after the enclosing function has returned.", np: "<b>Closure</b> ले बाहिरी function return भएपछि पनि आफ्नो बाहिरी अवस्था पुग्न सकिने राख्छ।", jp: "<b>クロージャ</b>は、外側の関数が戻った後も外側の状態を到達可能に保つ。" },
        { en: "Garbage collection is based on <b>reachability from GC roots</b>, not on a function finishing.", np: "Garbage collection <b>GC root बाट पुग्न सकिने</b> कुरामा आधारित छ, function सकिनुमा होइन।", jp: "ガベージコレクションは関数の終了ではなく<b>GCルートからの到達可能性</b>で決まる。" },
        { en: "<b>Mark-and-sweep</b> marks everything reachable, then reclaims what was not marked.", np: "<b>Mark-and-sweep</b> ले पुग्न सकिने सबै mark गर्छ, अनि mark नभएको फिर्ता लिन्छ।", jp: "<b>マーク・アンド・スイープ</b>は到達可能なものを印付けし、印のないものを回収する。" },
        { en: "A <b>circular reference is not a leak</b> — an unreachable cycle can still be collected.", np: "<b>Circular reference leak होइन</b> — पुग्न नसकिने cycle पनि संकलन हुन सक्छ।", jp: "<b>循環参照はリークではない</b>。到達不能な循環は回収できる。" },
        { en: "A leak is memory your program is still keeping reachable by accident, such as a forgotten listener or timer.", np: "Leak भनेको तपाईंको program ले अनजानमा पुग्न सकिने बनाइराखेको memory हो, जस्तै बिर्सिएको listener वा timer।", jp: "リークとは、忘れたリスナーやタイマーのように、プログラムがうっかり到達可能に保っているメモリのこと。" },
      ],
      commonMistakes: [
        { en: "<b>Assuming assignment copies an object</b> — after `const b = a; b.value = 20;`, `a.value` is also `20`. Use `{ ...a }` when you need independent state.", np: "<b>Assignment ले object copy गर्छ भन्ने ठान्नु</b> — `const b = a; b.value = 20;` पछि `a.value` पनि `20` हुन्छ। स्वतन्त्र अवस्था चाहिँदा `{ ...a }` प्रयोग गर्नुहोस्।", jp: "<b>代入がオブジェクトを複製すると思う</b> — `const b = a; b.value = 20;` の後、`a.value` も `20`。独立させたいなら `{ ...a }` を使う。" },
        { en: "<b>Thinking GC runs the instant an object becomes unused</b> — `user = null` makes it <b>eligible</b>; the engine decides when to actually reclaim it.", np: "<b>Object अप्रयोग हुनासाथ GC चल्छ भन्ने ठान्नु</b> — `user = null` ले यसलाई <b>योग्य</b> बनाउँछ; कहिले साँच्चै फिर्ता लिने engine ले तय गर्छ।", jp: "<b>使わなくなった瞬間にGCが走ると思う</b> — `user = null` は<b>対象になる</b>だけで、実際に回収する時期はエンジンが決める。" },
        { en: "<b>Believing circular references always leak</b> — `a.b = b; b.a = a;` is fine. A cycle only leaks if something reachable still points into it.", np: "<b>Circular reference सधैं leak गर्छ भन्ने विश्वास गर्नु</b> — `a.b = b; b.a = a;` ठीकै छ। पुग्न सकिने कुनै कुराले भित्र देखाइरहेको छ भने मात्र cycle ले leak गर्छ।", jp: "<b>循環参照は必ずリークすると思う</b> — `a.b = b; b.a = a;` は問題ない。到達可能な何かが中を指している場合だけリークになる。" },
        { en: "<b>Treating stack and heap as a language rule</b> — the specification does not require a particular memory layout. It is an engine-level mental model, useful for reasoning about calls, references and lifetime.", np: "<b>Stack र heap लाई भाषाको नियम ठान्नु</b> — specification ले कुनै निश्चित memory layout माग्दैन। यो engine-स्तरको मानसिक model हो, call, reference र आयु बुझ्न उपयोगी।", jp: "<b>スタックとヒープを言語の規則と考える</b> — 仕様は特定のメモリ配置を要求しない。呼び出し・参照・寿命を考えるためのエンジンレベルのモデル。" },
      ],
      quiz: [
        {
          question: { en: "For `const a = { count: 1 }; const b = a; b.count = 2;`, what is `a.count`?", np: "`const a = { count: 1 }; const b = a; b.count = 2;` मा `a.count` के हो?", jp: "`const a = { count: 1 }; const b = a; b.count = 2;` のとき `a.count` は?" },
          options: [
            { en: "`2`", np: "`2`", jp: "`2`" },
            { en: "`1`", np: "`1`", jp: "`1`" },
            { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
            { en: "An error", np: "एउटा error", jp: "エラー" },
          ],
          correctIndex: 0,
          explanation: { en: "`b` holds the same reference, so there is only one object.", np: "`b` सँग उही reference छ, त्यसैले object एउटै हो।", jp: "`b` は同じ参照を持つので、オブジェクトは1つしかない。" },
        },
        {
          question: { en: "Why can a closure keep an outer variable alive?", np: "Closure ले बाहिरी variable किन जीवित राख्न सक्छ?", jp: "クロージャが外側の変数を生かし続けられるのはなぜか?" },
          options: [
            { en: "The closure keeps a reference to the outer state it uses", np: "Closure ले आफूले प्रयोग गर्ने बाहिरी अवस्थाको reference राख्छ", jp: "使っている外側の状態への参照を保持するから" },
            { en: "The garbage collector ignores closures", np: "Garbage collector ले closure बेवास्ता गर्छ", jp: "GCがクロージャを無視するから" },
            { en: "Closures copy all outer variables", np: "Closure ले सबै बाहिरी variable copy गर्छ", jp: "外側の変数をすべて複製するから" },
            { en: "Variables inside functions are stored permanently", np: "Function भित्रका variable सधैंका लागि राखिन्छन्", jp: "関数内の変数は永久に保存されるから" },
          ],
          correctIndex: 0,
          explanation: { en: "Reachability, not scope exit, decides what survives.", np: "के बाँच्छ भन्ने scope सकिनुले होइन, reachability ले तय गर्छ।", jp: "何が残るかはスコープの終了ではなく到達可能性が決める。" },
        },
        {
          question: { en: "What makes an object eligible for garbage collection?", np: "Object लाई garbage collection योग्य केले बनाउँछ?", jp: "オブジェクトがGCの対象になる条件は?" },
          options: [
            { en: "Its enclosing function returns", np: "यसको बाहिरी function return हुनु", jp: "囲っている関数が戻ること" },
            { en: "Its reference count reaches zero", np: "यसको reference count शून्य पुग्नु", jp: "参照カウントが0になること" },
            { en: "It becomes unreachable from the GC roots", np: "यो GC root बाट पुग्न नसकिने हुनु", jp: "GCルートから到達できなくなること" },
            { en: "It has no properties left", np: "यसमा कुनै property नबाँकी रहनु", jp: "プロパティが1つも残っていないこと" },
          ],
          correctIndex: 2,
          explanation: { en: "That is why an unreachable cycle can still be collected.", np: "त्यसैले पुग्न नसकिने cycle पनि संकलन हुन सक्छ।", jp: "だからこそ到達不能な循環も回収できる。" },
        },
        {
          question: { en: "For `function test() { const obj = { value: 10 }; return () => obj.value; } const fn = test();`, what is true?", np: "`function test() { const obj = { value: 10 }; return () => obj.value; } const fn = test();` मा के सत्य हो?", jp: "`function test() { const obj = { value: 10 }; return () => obj.value; } const fn = test();` について正しいのは?" },
          options: [
            { en: "`obj` must disappear as soon as `test()` returns", np: "`test()` return हुनासाथ `obj` हराउनैपर्छ", jp: "`test()` が戻った瞬間に `obj` は消えねばならない" },
            { en: "`obj` is copied onto the stack permanently", np: "`obj` सधैंका लागि stack मा copy हुन्छ", jp: "`obj` は永久にスタックへコピーされる" },
            { en: "`obj` stays reachable through the returned function", np: "फर्केको function मार्फत `obj` पुग्न सकिने रहन्छ", jp: "返された関数を通じて `obj` は到達可能なまま" },
            { en: "`obj` becomes a global variable", np: "`obj` global variable बन्छ", jp: "`obj` はグローバル変数になる" },
          ],
          correctIndex: 2,
          explanation: { en: "As long as `fn` is reachable, so is the state it closes over.", np: "`fn` पुग्न सकिने रहेसम्म, यसले समेटेको अवस्था पनि पुग्न सकिने रहन्छ।", jp: "`fn` に到達できる限り、それが閉じ込めた状態にも到達できる。" },
        },
        {
          question: { en: "Which statement is correct?", np: "कुन भनाइ सही छ?", jp: "正しい記述はどれか?" },
          options: [
            { en: "Circular references can never be garbage collected", np: "Circular reference कहिल्यै garbage collect हुँदैनन्", jp: "循環参照は決して回収されない" },
            { en: "Garbage collection runs immediately after every function returns", np: "हरेक function return पछि तुरुन्तै garbage collection चल्छ", jp: "関数が戻るたび即座にGCが走る" },
            { en: "Developers free objects manually with `free()`", np: "Developer ले `free()` ले हातले object मुक्त गर्छन्", jp: "開発者が `free()` で手動解放する" },
            { en: "An unreachable circular structure can be garbage collected", np: "पुग्न नसकिने circular संरचना garbage collect हुन सक्छ", jp: "到達不能な循環構造は回収されうる" },
          ],
          correctIndex: 3,
          explanation: { en: "Modern collectors trace reachability rather than counting references.", np: "आधुनिक collector ले reference गन्नुभन्दा reachability पछ्याउँछन्।", jp: "現代のコレクタは参照を数えるのではなく到達可能性をたどる。" },
        },
      ],
    },
    {
      id: "memory-leaks",
      title: { en: "The Four Classic Memory Leak Patterns", np: "चार Classic Memory Leak Patterns", jp: "4つの典型的なメモリリークパターン" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>memory leak</b> happens when your application keeps objects reachable even though it no longer needs them.\n\nGarbage collection can only reclaim <b>unreachable</b> memory. If an event listener, timer, cache or closure still holds a reference, the collector considers that data reachable.\n\nFour classic patterns are worth recognising:\n\n```text\n1. Forgotten Event Listener\n        ↓\n   Element stays reachable\n\n2. Uncleared Timer\n        ↓\n   Closure stays reachable\n\n3. Unbounded Cache\n        ↓\n   Data grows forever\n\n4. Over-Capturing Closure\n        ↓\n   Large data stays alive unnecessarily\n```\n\n---\n\n### 1. Forgotten event listeners\n\n```javascript\nconst button = document.querySelector(\"#button\");\n\nfunction handleClick() {\n  console.log(\"clicked\");\n}\n\nbutton.addEventListener(\"click\", handleClick);\n```\n\nIf the application later removes the element but never cleans up the listener, the listener can keep objects reachable. The safe pattern pairs every registration with a removal:\n\n```javascript\nbutton.addEventListener(\"click\", handleClick);\n\nbutton.removeEventListener(\"click\", handleClick);\n```\n\n> <b>Whatever creates a listener should also provide a cleanup path for it.</b>\n\nA tidy way to express that is to return the cleanup function:\n\n```javascript\nfunction setupButton(button) {\n  function handleClick() {\n    console.log(\"clicked\");\n  }\n\n  button.addEventListener(\"click\", handleClick);\n\n  return function cleanup() {\n    button.removeEventListener(\"click\", handleClick);\n  };\n}\n\nconst cleanup = setupButton(button);\n\ncleanup(); // when the button or component is destroyed\n```\n\nThis matters most in UI applications where elements are created and destroyed repeatedly.\n\n---\n\n### 2. Timers that never get cleared\n\nTimers keep closures, and everything those closures capture, reachable.\n\n```javascript\nfunction startPolling() {\n  const largeData = new Array(1_000_000).fill(\"data\");\n\n  setInterval(() => {\n    console.log(largeData.length);\n  }, 1000);\n}\n\nstartPolling();\n```\n\n```text\nsetInterval\n     │\n     ▼\ncallback\n     │\n     ▼\nclosure\n     │\n     ▼\nlargeData\n```\n\nThe bigger problem is that calling the function again does not replace the first interval:\n\n```javascript\nstartPolling();\nstartPolling();\nstartPolling();\n```\n\nYou now have three independent intervals:\n\n```text\nTimer #1 → Closure → Data #1\nTimer #2 → Closure → Data #2\nTimer #3 → Closure → Data #3\n```\n\nStore the id so you can stop it:\n\n```javascript\nlet intervalId;\n\nfunction startPolling() {\n  intervalId = setInterval(() => {\n    console.log(\"polling...\");\n  }, 1000);\n}\n\nfunction stopPolling() {\n  clearInterval(intervalId);\n}\n```\n\n> <b>Every long-lived timer should have a clear cleanup strategy.</b>\n\n---\n\n### 3. Unbounded caches\n\nCaching improves performance, but a cache that grows forever becomes a memory problem.\n\n```javascript\nconst cache = new Map();\n\nfunction getUser(id) {\n  if (cache.has(id)) {\n    return cache.get(id);\n  }\n\n  const user = fetchUser(id);\n\n  cache.set(id, user);\n\n  return user;\n}\n```\n\nWith millions of distinct ids, nothing ever removes old entries:\n\n```text\ncache\n├── user-1\n├── user-2\n├── user-3\n├── ...\n└── user-1000000\n```\n\nThe cache stays reachable, so every value in it stays reachable too. Give it a limit:\n\n```javascript\nconst cache = new Map();\n\nfunction setCache(key, value) {\n  cache.set(key, value);\n\n  if (cache.size > 100) {\n    const oldestKey = cache.keys().next().value;\n    cache.delete(oldestKey);\n  }\n}\n```\n\n```text\nMaximum: 100 entries\n\n1 → 2 → 3 → ... → 100\n                 ↓\n              add 101\n                 ↓\n              remove 1\n```\n\nThat is the basic idea behind an <b>LRU (Least Recently Used)</b> cache.\n\n---\n\n### 4. Closures that capture too much\n\n```javascript\nfunction createHandler(largeArray) {\n  return function handleClick() {\n    console.log(largeArray[0]);\n  };\n}\n\nconst handler = createHandler(\n  new Array(1_000_000).fill(\"data\")\n);\n```\n\nThe callback needs one item, but the closure keeps the whole variable:\n\n```text\nhandler\n   │\n   ▼\nclosure\n   │\n   ▼\nlargeArray\n   │\n   ├── item\n   ├── item\n   ├── ...\n   └── 1,000,000 items\n```\n\nExtract what you actually need before creating the closure:\n\n```javascript\nfunction createHandler(largeArray) {\n  const firstItem = largeArray[0];\n\n  return function handleClick() {\n    console.log(firstItem);\n  };\n}\n```\n\n```text\nhandler\n   │\n   ▼\nclosure\n   │\n   ▼\nfirstItem\n```\n\n> <b>Capture only what the long-lived callback actually needs.</b>\n\n---\n\n### The four patterns side by side\n\n```text\nPattern                   What stays reachable            Typical fix\nForgotten listener        handler and related refs        removeEventListener()\nUncleared timer           timer → callback → closure      clearInterval / clearTimeout\nUnbounded cache           cache → every stored value      eviction, size limit, WeakMap\nOver-capturing closure    closure → unnecessary big data  capture only what is needed\n```\n\n---\n\n### `WeakMap` for object-keyed caches\n\nIf the cache keys are <b>objects</b>, a `WeakMap` can be a better fit:\n\n```javascript\nconst cache = new WeakMap();\n\nlet user = { id: 1 };\n\ncache.set(user, { permissions: [\"read\", \"write\"] });\n```\n\nIf the application later drops the object:\n\n```javascript\nuser = null;\n```\n\nthe `WeakMap` does not keep it alive merely because it was used as a key:\n\n```text\nBefore:\n\nApplication ──► user\n                  ▲\n                  │\n               WeakMap\n\n\nAfter:\n\nApplication ──► nothing\n\nWeakMap does not prevent\nthe user object from being collected.\n```\n\nUse it when the cache should follow the lifetime of its object keys.\n\n---\n\n### The setup and cleanup habit\n\nThe best architecture makes both halves explicit:\n\n```javascript\nfunction setup(element) {\n  const timerId = setInterval(() => {\n    console.log(\"running\");\n  }, 1000);\n\n  function handleClick() {\n    console.log(\"clicked\");\n  }\n\n  element.addEventListener(\"click\", handleClick);\n\n  return function cleanup() {\n    clearInterval(timerId);\n    element.removeEventListener(\"click\", handleClick);\n  };\n}\n\nconst cleanup = setup(button);\n\ncleanup();\n```\n\n```text\nSETUP\n │\n ├── addEventListener()\n └── setInterval()\n       │\n       ▼\n     application runs\n       │\n       ▼\nCLEANUP\n │\n ├── removeEventListener()\n └── clearInterval()\n```\n\nThis <b>setup then cleanup</b> pattern is one of the most valuable habits in long-running JavaScript applications.",
        np: "Application ले अब नचाहिने object पनि पुग्न सकिने बनाइराख्दा <b>memory leak</b> हुन्छ।\n\nGarbage collection ले <b>पुग्न नसकिने</b> memory मात्र फिर्ता लिन सक्छ। Event listener, timer, cache वा closure ले अझै reference राखेको छ भने collector ले त्यो data पुग्न सकिने ठान्छ।\n\nचिन्न लायक चार classic ढाँचा:\n\n```text\n1. Forgotten Event Listener\n        ↓\n   Element stays reachable\n\n2. Uncleared Timer\n        ↓\n   Closure stays reachable\n\n3. Unbounded Cache\n        ↓\n   Data grows forever\n\n4. Over-Capturing Closure\n        ↓\n   Large data stays alive unnecessarily\n```\n\n---\n\n### 1. बिर्सिएका event listener\n\n```javascript\nconst button = document.querySelector(\"#button\");\n\nfunction handleClick() {\n  console.log(\"clicked\");\n}\n\nbutton.addEventListener(\"click\", handleClick);\n```\n\nApplication ले पछि element हटाए पनि listener कहिल्यै सफा नगरे, listener ले object पुग्न सकिने बनाइराख्न सक्छ। सुरक्षित ढाँचाले हरेक दर्तालाई हटाइसँग जोड्छ:\n\n```javascript\nbutton.addEventListener(\"click\", handleClick);\n\nbutton.removeEventListener(\"click\", handleClick);\n```\n\n> <b>जसले listener बनाउँछ, उसैले यसको सफाइको बाटो पनि दिनुपर्छ।</b>\n\nयसलाई व्यक्त गर्ने सफा तरिका — cleanup function फर्काउनु:\n\n```javascript\nfunction setupButton(button) {\n  function handleClick() {\n    console.log(\"clicked\");\n  }\n\n  button.addEventListener(\"click\", handleClick);\n\n  return function cleanup() {\n    button.removeEventListener(\"click\", handleClick);\n  };\n}\n\nconst cleanup = setupButton(button);\n\ncleanup(); // button वा component नष्ट हुँदा\n```\n\nElement बारम्बार बन्ने र नष्ट हुने UI application मा यो सबैभन्दा महत्वपूर्ण छ।\n\n---\n\n### 2. कहिल्यै clear नगरिएका timer\n\nTimer ले closure, र ती closure ले समेटेको सबै कुरा, पुग्न सकिने राख्छन्।\n\n```javascript\nfunction startPolling() {\n  const largeData = new Array(1_000_000).fill(\"data\");\n\n  setInterval(() => {\n    console.log(largeData.length);\n  }, 1000);\n}\n\nstartPolling();\n```\n\n```text\nsetInterval\n     │\n     ▼\ncallback\n     │\n     ▼\nclosure\n     │\n     ▼\nlargeData\n```\n\nठूलो समस्या — function फेरि बोलाउँदा पहिलो interval प्रतिस्थापन हुँदैन:\n\n```javascript\nstartPolling();\nstartPolling();\nstartPolling();\n```\n\nअब तीन स्वतन्त्र interval छन्:\n\n```text\nTimer #1 → Closure → Data #1\nTimer #2 → Closure → Data #2\nTimer #3 → Closure → Data #3\n```\n\nId राख्नुहोस् ताकि रोक्न सकियोस्:\n\n```javascript\nlet intervalId;\n\nfunction startPolling() {\n  intervalId = setInterval(() => {\n    console.log(\"polling...\");\n  }, 1000);\n}\n\nfunction stopPolling() {\n  clearInterval(intervalId);\n}\n```\n\n> <b>हरेक लामो आयुको timer सँग स्पष्ट सफाइ रणनीति हुनुपर्छ।</b>\n\n---\n\n### 3. सीमारहित cache\n\nCache ले कार्यक्षमता बढाउँछ, तर सधैं बढ्ने cache memory समस्या बन्छ।\n\n```javascript\nconst cache = new Map();\n\nfunction getUser(id) {\n  if (cache.has(id)) {\n    return cache.get(id);\n  }\n\n  const user = fetchUser(id);\n\n  cache.set(id, user);\n\n  return user;\n}\n```\n\nलाखौं फरक id सँग, पुराना entry कहिल्यै हट्दैनन्:\n\n```text\ncache\n├── user-1\n├── user-2\n├── user-3\n├── ...\n└── user-1000000\n```\n\nCache पुग्न सकिने रहन्छ, त्यसैले यसका हरेक मान पनि पुग्न सकिने रहन्छन्। सीमा राख्नुहोस्:\n\n```javascript\nconst cache = new Map();\n\nfunction setCache(key, value) {\n  cache.set(key, value);\n\n  if (cache.size > 100) {\n    const oldestKey = cache.keys().next().value;\n    cache.delete(oldestKey);\n  }\n}\n```\n\n```text\nMaximum: 100 entries\n\n1 → 2 → 3 → ... → 100\n                 ↓\n              add 101\n                 ↓\n              remove 1\n```\n\nयही <b>LRU (Least Recently Used)</b> cache को आधारभूत विचार हो।\n\n---\n\n### 4. धेरै समेट्ने closure\n\n```javascript\nfunction createHandler(largeArray) {\n  return function handleClick() {\n    console.log(largeArray[0]);\n  };\n}\n\nconst handler = createHandler(\n  new Array(1_000_000).fill(\"data\")\n);\n```\n\nCallback लाई एउटा item चाहिन्छ, तर closure ले पूरै variable राख्छ:\n\n```text\nhandler\n   │\n   ▼\nclosure\n   │\n   ▼\nlargeArray\n   │\n   ├── item\n   ├── item\n   ├── ...\n   └── 1,000,000 items\n```\n\nClosure बनाउनुअघि साँच्चै चाहिने कुरा झिक्नुहोस्:\n\n```javascript\nfunction createHandler(largeArray) {\n  const firstItem = largeArray[0];\n\n  return function handleClick() {\n    console.log(firstItem);\n  };\n}\n```\n\n```text\nhandler\n   │\n   ▼\nclosure\n   │\n   ▼\nfirstItem\n```\n\n> <b>लामो आयुको callback लाई साँच्चै चाहिने कुरा मात्र समेट्नुहोस्।</b>\n\n---\n\n### चारै ढाँचा सँगै\n\n```text\nढाँचा                     के पुग्न सकिने रहन्छ            सामान्य समाधान\nबिर्सिएको listener        handler र सम्बन्धित reference   removeEventListener()\nClear नगरिएको timer       timer → callback → closure      clearInterval / clearTimeout\nसीमारहित cache            cache → हरेक राखिएको मान         eviction, आकार सीमा, WeakMap\nधेरै समेट्ने closure       closure → अनावश्यक ठूलो data     चाहिने कुरा मात्र समेट्ने\n```\n\n---\n\n### Object-key भएको cache का लागि `WeakMap`\n\nCache को key <b>object</b> हो भने, `WeakMap` बढी उपयुक्त हुन सक्छ:\n\n```javascript\nconst cache = new WeakMap();\n\nlet user = { id: 1 };\n\ncache.set(user, { permissions: [\"read\", \"write\"] });\n```\n\nApplication ले पछि object छाडे:\n\n```javascript\nuser = null;\n```\n\nKey का रूपमा प्रयोग भएकै भरमा `WeakMap` ले यसलाई जीवित राख्दैन:\n\n```text\nBefore:\n\nApplication ──► user\n                  ▲\n                  │\n               WeakMap\n\n\nAfter:\n\nApplication ──► nothing\n\nWeakMap does not prevent\nthe user object from being collected.\n```\n\nCache ले आफ्ना object key कै आयु पछ्याउनुपर्ने बेला प्रयोग गर्नुहोस्।\n\n---\n\n### Setup र cleanup को बानी\n\nउत्तम संरचनाले दुबै आधा स्पष्ट बनाउँछ:\n\n```javascript\nfunction setup(element) {\n  const timerId = setInterval(() => {\n    console.log(\"running\");\n  }, 1000);\n\n  function handleClick() {\n    console.log(\"clicked\");\n  }\n\n  element.addEventListener(\"click\", handleClick);\n\n  return function cleanup() {\n    clearInterval(timerId);\n    element.removeEventListener(\"click\", handleClick);\n  };\n}\n\nconst cleanup = setup(button);\n\ncleanup();\n```\n\n```text\nSETUP\n │\n ├── addEventListener()\n └── setInterval()\n       │\n       ▼\n     application runs\n       │\n       ▼\nCLEANUP\n │\n ├── removeEventListener()\n └── clearInterval()\n```\n\nयो <b>setup अनि cleanup</b> ढाँचा लामो समय चल्ने JavaScript application का सबैभन्दा बहुमूल्य बानीमध्ये एक हो।",
        jp: "<b>メモリリーク</b>とは、もう必要ないのにアプリがオブジェクトを到達可能なまま保っている状態です。\n\nガベージコレクションが回収できるのは<b>到達不能</b>なメモリだけです。イベントリスナー・タイマー・キャッシュ・クロージャのいずれかが参照を握っていれば、そのデータは到達可能と見なされます。\n\n覚えておきたい古典的な4パターン:\n\n```text\n1. Forgotten Event Listener\n        ↓\n   Element stays reachable\n\n2. Uncleared Timer\n        ↓\n   Closure stays reachable\n\n3. Unbounded Cache\n        ↓\n   Data grows forever\n\n4. Over-Capturing Closure\n        ↓\n   Large data stays alive unnecessarily\n```\n\n---\n\n### 1. 外し忘れたリスナー\n\n```javascript\nconst button = document.querySelector(\"#button\");\n\nfunction handleClick() {\n  console.log(\"clicked\");\n}\n\nbutton.addEventListener(\"click\", handleClick);\n```\n\n後で要素を取り除いてもリスナーを片付けないと、オブジェクトが到達可能なままになりえます。安全な形は、登録ごとに解除を対にすることです:\n\n```javascript\nbutton.addEventListener(\"click\", handleClick);\n\nbutton.removeEventListener(\"click\", handleClick);\n```\n\n> <b>リスナーを作る側が、その片付け方も用意する。</b>\n\nきれいに表す方法は、クリーンアップ関数を返すことです:\n\n```javascript\nfunction setupButton(button) {\n  function handleClick() {\n    console.log(\"clicked\");\n  }\n\n  button.addEventListener(\"click\", handleClick);\n\n  return function cleanup() {\n    button.removeEventListener(\"click\", handleClick);\n  };\n}\n\nconst cleanup = setupButton(button);\n\ncleanup(); // ボタンやコンポーネントが破棄されるとき\n```\n\n要素が繰り返し生成・破棄されるUIでは特に重要です。\n\n---\n\n### 2. 解除されないタイマー\n\nタイマーはクロージャと、そのクロージャが取り込んだすべてを到達可能に保ちます。\n\n```javascript\nfunction startPolling() {\n  const largeData = new Array(1_000_000).fill(\"data\");\n\n  setInterval(() => {\n    console.log(largeData.length);\n  }, 1000);\n}\n\nstartPolling();\n```\n\n```text\nsetInterval\n     │\n     ▼\ncallback\n     │\n     ▼\nclosure\n     │\n     ▼\nlargeData\n```\n\nさらに厄介なのは、もう一度呼んでも最初のintervalが置き換わらないことです:\n\n```javascript\nstartPolling();\nstartPolling();\nstartPolling();\n```\n\n独立したintervalが3つ動きます:\n\n```text\nTimer #1 → Closure → Data #1\nTimer #2 → Closure → Data #2\nTimer #3 → Closure → Data #3\n```\n\n止められるようにIDを保持します:\n\n```javascript\nlet intervalId;\n\nfunction startPolling() {\n  intervalId = setInterval(() => {\n    console.log(\"polling...\");\n  }, 1000);\n}\n\nfunction stopPolling() {\n  clearInterval(intervalId);\n}\n```\n\n> <b>長生きするタイマーには、必ず片付けの筋道を用意する。</b>\n\n---\n\n### 3. 上限のないキャッシュ\n\nキャッシュは性能を上げますが、際限なく育てばメモリ問題になります。\n\n```javascript\nconst cache = new Map();\n\nfunction getUser(id) {\n  if (cache.has(id)) {\n    return cache.get(id);\n  }\n\n  const user = fetchUser(id);\n\n  cache.set(id, user);\n\n  return user;\n}\n```\n\nIDが何百万通りもあると、古い項目は決して消えません:\n\n```text\ncache\n├── user-1\n├── user-2\n├── user-3\n├── ...\n└── user-1000000\n```\n\nキャッシュが到達可能な限り、その中の値もすべて到達可能です。上限を設けます:\n\n```javascript\nconst cache = new Map();\n\nfunction setCache(key, value) {\n  cache.set(key, value);\n\n  if (cache.size > 100) {\n    const oldestKey = cache.keys().next().value;\n    cache.delete(oldestKey);\n  }\n}\n```\n\n```text\nMaximum: 100 entries\n\n1 → 2 → 3 → ... → 100\n                 ↓\n              add 101\n                 ↓\n              remove 1\n```\n\nこれが<b>LRU（Least Recently Used）</b>キャッシュの基本的な考えです。\n\n---\n\n### 4. 取り込みすぎるクロージャ\n\n```javascript\nfunction createHandler(largeArray) {\n  return function handleClick() {\n    console.log(largeArray[0]);\n  };\n}\n\nconst handler = createHandler(\n  new Array(1_000_000).fill(\"data\")\n);\n```\n\nコールバックが必要なのは1要素なのに、クロージャは変数ごと保持します:\n\n```text\nhandler\n   │\n   ▼\nclosure\n   │\n   ▼\nlargeArray\n   │\n   ├── item\n   ├── item\n   ├── ...\n   └── 1,000,000 items\n```\n\nクロージャを作る前に、必要なものだけ取り出します:\n\n```javascript\nfunction createHandler(largeArray) {\n  const firstItem = largeArray[0];\n\n  return function handleClick() {\n    console.log(firstItem);\n  };\n}\n```\n\n```text\nhandler\n   │\n   ▼\nclosure\n   │\n   ▼\nfirstItem\n```\n\n> <b>長生きするコールバックが本当に必要とするものだけを取り込む。</b>\n\n---\n\n### 4パターンの比較\n\n```text\nパターン                  何が到達可能に残るか            主な対処\n外し忘れたリスナー        ハンドラーと関連する参照        removeEventListener()\n解除されないタイマー      タイマー → コールバック → 閉包  clearInterval / clearTimeout\n上限のないキャッシュ      キャッシュ → 保存した全値       追い出し・上限・WeakMap\n取り込みすぎる閉包        閉包 → 不要に大きなデータ       必要なものだけ取り込む\n```\n\n---\n\n### オブジェクトをキーにするなら `WeakMap`\n\nキーが<b>オブジェクト</b>なら `WeakMap` が向くことがあります:\n\n```javascript\nconst cache = new WeakMap();\n\nlet user = { id: 1 };\n\ncache.set(user, { permissions: [\"read\", \"write\"] });\n```\n\n後でアプリがそのオブジェクトを手放すと:\n\n```javascript\nuser = null;\n```\n\nキーに使われていたというだけで `WeakMap` がそれを生かし続けることはありません:\n\n```text\nBefore:\n\nApplication ──► user\n                  ▲\n                  │\n               WeakMap\n\n\nAfter:\n\nApplication ──► nothing\n\nWeakMap does not prevent\nthe user object from being collected.\n```\n\nキャッシュがキーの寿命に従うべきときに使います。\n\n---\n\n### セットアップとクリーンアップの習慣\n\n良い設計は、両方を明示します:\n\n```javascript\nfunction setup(element) {\n  const timerId = setInterval(() => {\n    console.log(\"running\");\n  }, 1000);\n\n  function handleClick() {\n    console.log(\"clicked\");\n  }\n\n  element.addEventListener(\"click\", handleClick);\n\n  return function cleanup() {\n    clearInterval(timerId);\n    element.removeEventListener(\"click\", handleClick);\n  };\n}\n\nconst cleanup = setup(button);\n\ncleanup();\n```\n\n```text\nSETUP\n │\n ├── addEventListener()\n └── setInterval()\n       │\n       ▼\n     application runs\n       │\n       ▼\nCLEANUP\n │\n ├── removeEventListener()\n └── clearInterval()\n```\n\nこの<b>セットアップとクリーンアップ</b>の型は、長く動き続けるJavaScriptアプリで最も価値ある習慣のひとつです。",
      },
      diagram: `The four patterns

1. Forgotten Event Listener      2. Uncleared Timer
        ↓                                ↓
   Element stays reachable        setInterval
                                       │
3. Unbounded Cache                     ▼
        ↓                          callback
   Data grows forever                  │
                                       ▼
4. Over-Capturing Closure           closure
        ↓                              │
   Large data stays alive              ▼
                                   largeData


An unbounded cache never lets go

cache
├── user-1
├── user-2
├── user-3
├── ...
└── user-1000000        nothing evicts the old entries


Capture less, retain less

handler                    handler
   │                          │
   ▼                          ▼
closure                    closure
   │                          │
   ▼                          ▼
largeArray                 firstItem
   │
   └── 1,000,000 items


Setup and cleanup, always in pairs

SETUP
 │
 ├── addEventListener()
 └── setInterval()
       │
       ▼
     application runs
       │
       ▼
CLEANUP
 │
 ├── removeEventListener()
 └── clearInterval()`,
      codeExample: {
        title: { en: "Four leaks and their cleanups", np: "चार leak र तिनका सफाइ", jp: "4つのリークと片付け方" },
        code: `// ── 1. Forgotten listener — pair every add with a remove ──────────
function setupButton(button) {
  function handleClick() {
    console.log("clicked");
  }

  button.addEventListener("click", handleClick);

  return function cleanup() {
    button.removeEventListener("click", handleClick); // same reference
  };
}

const cleanupButton = setupButton(button);
cleanupButton();

// ── 2. Uncleared timer — calling twice starts two timers ──────────
let intervalId;

function startPolling() {
  if (intervalId) return;              // do not stack a second interval

  intervalId = setInterval(() => console.log("polling..."), 1000);
}

function stopPolling() {
  clearInterval(intervalId);
  intervalId = null;
}

// ── 3. Unbounded cache — give it a ceiling ────────────────────────
const cache = new Map();

function setCache(key, value) {
  cache.set(key, value);

  if (cache.size > 100) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);           // the idea behind an LRU cache
  }
}

// A WeakMap suits object keys: it does not keep them alive
const objectCache = new WeakMap();

// ── 4. Over-capturing closure — take the value, not the array ─────
function createHandler(largeArray) {
  const firstItem = largeArray[0];     // the closure now retains one item

  return function handleClick() {
    console.log(firstItem);
  };
}

// ── The habit: one setup, one cleanup ─────────────────────────────
function setup(element) {
  const timerId = setInterval(() => console.log("running"), 1000);

  function handleClick() {
    console.log("clicked");
  }

  element.addEventListener("click", handleClick);

  return function cleanup() {
    clearInterval(timerId);
    element.removeEventListener("click", handleClick);
  };
}`,
      },
      keyTakeaways: [
        { en: "A leak is memory that stays <b>reachable</b> after the application stops needing it.", np: "Leak भनेको application लाई नचाहिएपछि पनि <b>पुग्न सकिने</b> रहेको memory हो।", jp: "リークとは、アプリが必要としなくなった後も<b>到達可能</b>なまま残るメモリのこと。" },
        { en: "A <b>forgotten listener</b> can keep an element and its data alive — pair `addEventListener` with `removeEventListener`.", np: "<b>बिर्सिएको listener</b> ले element र यसको data जीवित राख्न सक्छ — `addEventListener` लाई `removeEventListener` सँग जोड्नुहोस्।", jp: "<b>外し忘れたリスナー</b>は要素とデータを生かし続ける。`addEventListener` は `removeEventListener` と対にする。" },
        { en: "An <b>uncleared timer</b> retains its callback and everything the closure captured; calling the starter twice runs two timers.", np: "<b>Clear नगरिएको timer</b> ले आफ्नो callback र closure ले समेटेको सबै राख्छ; starter दुई पटक बोलाउँदा दुई timer चल्छन्।", jp: "<b>解除されないタイマー</b>はコールバックとクロージャの取り込み全体を保持する。開始関数を2回呼べばタイマーは2つ動く。" },
        { en: "An <b>unbounded cache</b> grows forever — add a size limit, eviction or expiry.", np: "<b>सीमारहित cache</b> सधैं बढ्छ — आकार सीमा, eviction वा म्याद थप्नुहोस्।", jp: "<b>上限のないキャッシュ</b>は際限なく育つ。上限・追い出し・期限を設ける。" },
        { en: "An <b>over-capturing closure</b> retains a whole array when it needed one item — extract the value first.", np: "<b>धेरै समेट्ने closure</b> ले एउटा item चाहिँदा पूरै array राख्छ — पहिले मान झिक्नुहोस्।", jp: "<b>取り込みすぎるクロージャ</b>は1要素で足りるのに配列全体を保持する。先に値を取り出す。" },
        { en: "`WeakMap` suits object-keyed caches because it does not keep its keys alive.", np: "`WeakMap` object-key भएका cache का लागि उपयुक्त छ किनकि यसले आफ्ना key जीवित राख्दैन।", jp: "`WeakMap` はキーを生かし続けないので、オブジェクトをキーにするキャッシュに向く。" },
        { en: "The <b>setup then cleanup</b> pattern — return a function that undoes everything setup did — is the habit that prevents all four.", np: "<b>Setup अनि cleanup</b> ढाँचा — setup ले गरेको सबै फिर्ता गर्ने function फर्काउनु — यी चारै रोक्ने बानी हो।", jp: "<b>セットアップとクリーンアップ</b>の型、つまり行ったことをすべて元に戻す関数を返す習慣が、4つすべてを防ぐ。" },
      ],
      commonMistakes: [
        { en: "<b>Starting multiple intervals</b> — calling `start()` three times creates three timers, not one. Guard with `if (timerId) return;` and clear it in `stop()`.", np: "<b>धेरै interval सुरु गर्नु</b> — `start()` तीन पटक बोलाउँदा एउटा होइन, तीन timer बन्छन्। `if (timerId) return;` ले जोगिनुहोस् र `stop()` मा clear गर्नुहोस्।", jp: "<b>intervalを複数開始する</b> — `start()` を3回呼べばタイマーは1つでなく3つ。`if (timerId) return;` で守り、`stop()` で解除する。" },
        { en: "<b>Creating listeners that cannot be removed</b> — an inline arrow in `addEventListener` and another in `removeEventListener` are different objects, so nothing is removed. Keep the reference.", np: "<b>हटाउन नसकिने listener बनाउनु</b> — `addEventListener` मा र `removeEventListener` मा छुट्टै inline arrow फरक object हुन्, त्यसैले केही हट्दैन। Reference राख्नुहोस्।", jp: "<b>外せないリスナーを作る</b> — `addEventListener` と `removeEventListener` に別々のアロー関数を書けば別オブジェクトなので何も外れない。参照を保持する。" },
        { en: "<b>Letting a cache grow forever</b> — `cache.set(key, value)` with continuously unique keys never releases anything. Decide on a retention policy before shipping it.", np: "<b>Cache लाई सधैं बढ्न दिनु</b> — लगातार अनौठा key सँग `cache.set(key, value)` ले कहिल्यै केही छाड्दैन। पठाउनुअघि retention नीति तय गर्नुहोस्।", jp: "<b>キャッシュを無制限に育てる</b> — 毎回異なるキーで `cache.set(key, value)` すれば何も解放されない。出す前に保持方針を決める。" },
        { en: "<b>Expecting garbage collection to fix an active timer</b> — a running `setInterval` is still in use, so nothing about it is unreachable. Call `clearInterval(timer)`.", np: "<b>चलिरहेको timer garbage collection ले ठीक पार्छ भन्ने आशा गर्नु</b> — चलिरहेको `setInterval` अझै प्रयोगमै छ, त्यसैले यसको केही पनि पुग्न नसकिने हुँदैन। `clearInterval(timer)` बोलाउनुहोस्।", jp: "<b>動作中のタイマーをGCが片付けると期待する</b> — 動いている `setInterval` は使用中なので、到達不能なものは何もない。`clearInterval(timer)` を呼ぶ。" },
      ],
      quiz: [
        {
          question: { en: "What is the most important cleanup for an event listener?", np: "Event listener का लागि सबैभन्दा महत्वपूर्ण सफाइ के हो?", jp: "イベントリスナーで最も重要な片付けは?" },
          options: [
            { en: "`deleteEventListener()`", np: "`deleteEventListener()`", jp: "`deleteEventListener()`" },
            { en: "`clearEventListener()`", np: "`clearEventListener()`", jp: "`clearEventListener()`" },
            { en: "`removeEventListener()`", np: "`removeEventListener()`", jp: "`removeEventListener()`" },
            { en: "`stopEventListener()`", np: "`stopEventListener()`", jp: "`stopEventListener()`" },
          ],
          correctIndex: 2,
          explanation: { en: "It needs the same function reference that was registered.", np: "यसलाई दर्ता गरिएकै function reference चाहिन्छ।", jp: "登録時と同じ関数参照が必要。" },
        },
        {
          question: { en: "What happens if `setInterval(() => console.log(\"hello\"), 1000)` is called twice?", np: "`setInterval(() => console.log(\"hello\"), 1000)` दुई पटक बोलाए के हुन्छ?", jp: "`setInterval(() => console.log(\"hello\"), 1000)` を2回呼ぶとどうなるか?" },
          options: [
            { en: "The second replaces the first", np: "दोस्रोले पहिलोलाई प्रतिस्थापन गर्छ", jp: "2つ目が1つ目を置き換える" },
            { en: "Two independent intervals run", np: "दुई स्वतन्त्र interval चल्छन्", jp: "独立したintervalが2つ動く" },
            { en: "Only one interval can exist", np: "एउटा मात्र interval रहन सक्छ", jp: "intervalは1つしか存在できない" },
            { en: "JavaScript throws an error", np: "JavaScript ले error दिन्छ", jp: "JavaScriptがエラーを投げる" },
          ],
          correctIndex: 1,
          explanation: { en: "Each one keeps its own callback and closure reachable.", np: "हरेकले आफ्नै callback र closure पुग्न सकिने राख्छ।", jp: "それぞれが自分のコールバックとクロージャを到達可能に保つ。" },
        },
        {
          question: { en: "Why can an unbounded `Map` cause a memory leak?", np: "सीमारहित `Map` ले किन memory leak गराउन सक्छ?", jp: "上限のない `Map` がメモリリークを招くのはなぜか?" },
          options: [
            { en: "A `Map` can never be garbage collected", np: "`Map` कहिल्यै garbage collect हुन सक्दैन", jp: "`Map` は決して回収されないから" },
            { en: "A `Map` stores everything on the call stack", np: "`Map` ले सबै call stack मा राख्छ", jp: "`Map` がすべてをコールスタックに置くから" },
            { en: "A `Map` duplicates every value", np: "`Map` ले हरेक मान नक्कल गर्छ", jp: "`Map` がすべての値を複製するから" },
            { en: "Its entries stay reachable for as long as the map retains them", np: "Map ले राखेसम्म यसका entry पुग्न सकिने रहन्छन्", jp: "マップが保持する限り項目が到達可能なままだから" },
          ],
          correctIndex: 3,
          explanation: { en: "Add a size limit, eviction policy or expiry before shipping it.", np: "पठाउनुअघि आकार सीमा, eviction नीति वा म्याद थप्नुहोस्।", jp: "出す前に上限・追い出し方針・期限を加える。" },
        },
        {
          question: { en: "What is the best reason to use a `WeakMap` for some caches?", np: "केही cache का लागि `WeakMap` प्रयोग गर्ने उत्तम कारण के हो?", jp: "一部のキャッシュに `WeakMap` を使う最大の理由は?" },
          options: [
            { en: "It sorts keys automatically", np: "यसले key स्वतः क्रमबद्ध गर्छ", jp: "キーを自動で整列するから" },
            { en: "It allows duplicate keys", np: "यसले दोहोरिएका key दिन्छ", jp: "重複キーを許すから" },
            { en: "It does not strongly retain its object keys", np: "यसले आफ्ना object key बलियो गरी राख्दैन", jp: "オブジェクトのキーを強く保持しないから" },
            { en: "It stores values on the stack", np: "यसले मान stack मा राख्छ", jp: "値をスタックに置くから" },
          ],
          correctIndex: 2,
          explanation: { en: "The cache then follows the lifetime of the objects it describes.", np: "अनि cache ले आफूले वर्णन गरेका object कै आयु पछ्याउँछ।", jp: "そうすればキャッシュは対象オブジェクトの寿命に従う。" },
        },
        {
          question: { en: "What is the main problem with `function createHandler(hugeArray) { return () => console.log(hugeArray[0]); }`?", np: "`function createHandler(hugeArray) { return () => console.log(hugeArray[0]); }` को मुख्य समस्या के हो?", jp: "`function createHandler(hugeArray) { return () => console.log(hugeArray[0]); }` の主な問題は?" },
          options: [
            { en: "The callback keeps the entire `hugeArray` reachable", np: "Callback ले पूरै `hugeArray` पुग्न सकिने राख्छ", jp: "コールバックが `hugeArray` 全体を到達可能に保つ" },
            { en: "Arrow functions cannot create closures", np: "Arrow function ले closure बनाउन सक्दैन", jp: "アロー関数はクロージャを作れない" },
            { en: "Arrays cannot be captured by a closure", np: "Array लाई closure ले समेट्न सक्दैन", jp: "配列はクロージャに取り込めない" },
            { en: "`hugeArray[0]` is copied automatically", np: "`hugeArray[0]` स्वतः copy हुन्छ", jp: "`hugeArray[0]` は自動で複製される" },
          ],
          correctIndex: 0,
          explanation: { en: "Read the item into a local variable before returning the closure.", np: "Closure फर्काउनुअघि item लाई local variable मा पढ्नुहोस्।", jp: "クロージャを返す前に、その要素をローカル変数へ読み出す。" },
        },
      ],
    },
    {
      id: "weakmap-weakset",
      title: { en: "WeakMap, WeakSet & WeakRef", np: "WeakMap, WeakSet र WeakRef", jp: "WeakMap・WeakSet・WeakRef" },
      durationMinutes: 9,
      explanation: {
        en: "JavaScript provides three related tools for working with <b>weak references</b>:\n\n• <b>`WeakMap`</b> — associates data with objects without keeping those objects alive\n• <b>`WeakSet`</b> — tracks objects without keeping them alive\n• <b>`WeakRef`</b> — holds a weak reference to a single object\n\nThe difference from `Map` and `Set` is <b>garbage-collection behaviour</b>. A normal `Map` strongly references its keys:\n\n```javascript\nconst map = new Map();\n\nlet user = { name: \"Rajan\" };\n\nmap.set(user, \"metadata\");\n\nuser = null;\n```\n\nThe `Map` still references the object, so it stays reachable:\n\n```text\nMap\n │\n ▼\nUser object\n```\n\nWith a `WeakMap`, once nothing else reaches the object:\n\n```text\nApplication\n\nuser ──► null\n\nWeakMap ──weak──► User object\n                         ↓\n                   eligible for GC\n```\n\nThe collector is free to reclaim the object and its entry.\n\n> <b>Weak does not mean \"less important\". It means the reference does not prevent garbage collection.</b>\n\n---\n\n### 1. Basic — `WeakMap` for object metadata\n\n```javascript\nconst metadata = new WeakMap();\n\nlet user = {\n  id: 1,\n  name: \"Rajan\"\n};\n\nmetadata.set(user, {\n  lastLogin: \"today\",\n  clicks: 5\n});\n\nconsole.log(metadata.get(user));\n// { lastLogin: \"today\", clicks: 5 }\n```\n\nThe metadata is attached to the object without you maintaining a separate cleanup system. When the application drops `user`, the entry can go with it.\n\n---\n\n### 2. Intermediate — tracking DOM elements\n\n```javascript\nconst clickCounts = new WeakMap();\n\nfunction track(element) {\n  clickCounts.set(element, 0);\n}\n\nfunction recordClick(element) {\n  const count = clickCounts.get(element) ?? 0;\n\n  clickCounts.set(element, count + 1);\n}\n```\n\n```javascript\nconst button = document.querySelector(\"#save\");\n\ntrack(button);\n\nrecordClick(button);\nrecordClick(button);\n\nconsole.log(clickCounts.get(button)); // 2\n```\n\nIf the button is removed and nothing else keeps it reachable, the `WeakMap` does not stand in the way of collection. That is exactly what you want for metadata about objects whose lifetime you do not control.\n\n---\n\n### 3. Advanced — `WeakMap` for private instance state\n\nBefore JavaScript had `#privateField`, a `WeakMap` was how you kept per-instance private data.\n\n```javascript\nconst privateData = new WeakMap();\n\nclass BankAccount {\n  constructor(balance) {\n    privateData.set(this, { balance });\n  }\n\n  deposit(amount) {\n    const data = privateData.get(this);\n\n    data.balance += amount;\n  }\n\n  getBalance() {\n    return privateData.get(this).balance;\n  }\n}\n\nconst account = new BankAccount(100);\n\naccount.deposit(50);\n\nconsole.log(account.getBalance()); // 150\nconsole.log(account.balance);      // undefined\n```\n\n```text\naccount\n   │\n   │ weak key\n   ▼\nWeakMap\n   │\n   ▼\n{ balance: 150 }\n```\n\nModern code should prefer a private field:\n\n```javascript\nclass BankAccount {\n  #balance;\n\n  constructor(balance) {\n    this.#balance = balance;\n  }\n}\n```\n\nBut the `WeakMap` pattern is worth understanding, because it shows how weakly associated state works.\n\n---\n\n### `WeakMap` limitations, and why they exist\n\n<b>Keys must be objects.</b>\n\n```javascript\nconst map = new WeakMap();\n\nmap.set(\"user\", 123); // TypeError\nmap.set({}, 123);     // works\n```\n\n<b>No iteration.</b> There is no `keys()`, `values()`, `entries()` or `forEach()`, and `for...of` does not work. This is deliberate: if you could enumerate a `WeakMap`, you could observe exactly when garbage collection removed an entry.\n\n<b>No `.size`.</b> The number of entries can change on its own when collection runs, so there is no reliable count to expose.\n\n---\n\n### `WeakSet`\n\n`WeakSet` follows the same principle but simply tracks objects instead of associating values with them.\n\n```javascript\nconst processed = new WeakSet();\n\nconst user = { id: 1 };\n\nprocessed.add(user);\n\nconsole.log(processed.has(user)); // true\n\nprocessed.delete(user);\n```\n\nA practical use is marking objects as already handled:\n\n```javascript\nconst processed = new WeakSet();\n\nfunction processUser(user) {\n  if (processed.has(user)) {\n    return;\n  }\n\n  console.log(\"Processing:\", user.name);\n\n  processed.add(user);\n}\n```\n\n```javascript\nconst user = { name: \"Rajan\" };\n\nprocessUser(user); // Processing: Rajan\nprocessUser(user); // nothing\n```\n\nThe object is remembered as processed, but the `WeakSet` never becomes the reason it stays alive.\n\n---\n\n### `WeakMap` vs `WeakSet`\n\n```text\n                  WeakMap            WeakSet\nStores            key → value        objects\nKeys / items      objects            objects\nHeld weakly       the keys           the items\n.get() / .set()   yes                no\n.add()            no                 yes\n.has() .delete()  yes                yes\nIteration         no                 no\n.size             no                 no\nMain use          object metadata    object tracking\n```\n\n---\n\n### `WeakRef`\n\n`WeakRef` goes one level lower: instead of a collection, it is a <b>single weak reference to one object</b>.\n\n```javascript\nlet user = { name: \"Rajan\" };\n\nconst ref = new WeakRef(user);\n```\n\nYou read it through `deref()`:\n\n```javascript\nconst value = ref.deref();\n\nconsole.log(value); // { name: \"Rajan\" }, or undefined if collected\n```\n\nYou can never assume the object is still there:\n\n```javascript\nconst maybeUser = ref.deref();\n\nif (maybeUser) {\n  console.log(maybeUser.name);\n}\n```\n\nA cache that does not force its entries to stay alive:\n\n```javascript\nconst cache = new Map();\n\nfunction cacheUser(id, user) {\n  cache.set(id, new WeakRef(user));\n}\n\nfunction getCachedUser(id) {\n  const ref = cache.get(id);\n\n  if (!ref) return undefined;\n\n  const user = ref.deref();\n\n  if (!user) {\n    cache.delete(id);\n    return undefined;\n  }\n\n  return user;\n}\n```\n\n```text\nMap\n │\n ├── \"user-1\" → WeakRef ──weak──► User\n ├── \"user-2\" → WeakRef ──weak──► User\n └── \"user-3\" → WeakRef ──weak──► User\n```\n\nThis is an advanced technique. For most applications, reach for `WeakMap` or `WeakSet` when they fit naturally.\n\n---\n\n### Choosing between them\n\n```text\nNeed object → metadata?\n        │\n        ▼\n     WeakMap\n\n\nNeed to remember objects\nwithout keeping them alive?\n        │\n        ▼\n     WeakSet\n\n\nNeed a weak reference\nto one specific object?\n        │\n        ▼\n     WeakRef\n\n\nNeed iteration, size,\nprimitive keys, or predictable entries?\n        │\n        ▼\n       Map / Set\n```\n\n> <b>Use `Map` and `Set` by default. Reach for `WeakMap` or `WeakSet` when the collection should not decide the lifetime of what it tracks. Use `WeakRef` only for advanced, GC-sensitive designs.</b>",
        np: "JavaScript ले <b>weak reference</b> सँग काम गर्न तीन सम्बन्धित उपकरण दिन्छ:\n\n• <b>`WeakMap`</b> — object लाई जीवित नराखी तिनीसँग data जोड्छ\n• <b>`WeakSet`</b> — object लाई जीवित नराखी तिनको हिसाब राख्छ\n• <b>`WeakRef`</b> — एउटै object को weak reference राख्छ\n\n`Map` र `Set` भन्दा भिन्नता <b>garbage-collection व्यवहार</b> मा छ। सामान्य `Map` ले आफ्ना key लाई बलियो गरी जनाउँछ:\n\n```javascript\nconst map = new Map();\n\nlet user = { name: \"Rajan\" };\n\nmap.set(user, \"metadata\");\n\nuser = null;\n```\n\n`Map` ले अझै object जनाउँछ, त्यसैले यो पुग्न सकिने रहन्छ:\n\n```text\nMap\n │\n ▼\nUser object\n```\n\n`WeakMap` सँग, अरू कसैले object सम्म नपुगेपछि:\n\n```text\nApplication\n\nuser ──► null\n\nWeakMap ──weak──► User object\n                         ↓\n                   eligible for GC\n```\n\nCollector ले object र यसको entry फिर्ता लिन पाउँछ।\n\n> <b>Weak को अर्थ \"कम महत्वपूर्ण\" होइन। यसको अर्थ त्यो reference ले garbage collection रोक्दैन।</b>\n\n---\n\n### 1. आधारभूत — object metadata का लागि `WeakMap`\n\n```javascript\nconst metadata = new WeakMap();\n\nlet user = {\n  id: 1,\n  name: \"Rajan\"\n};\n\nmetadata.set(user, {\n  lastLogin: \"today\",\n  clicks: 5\n});\n\nconsole.log(metadata.get(user));\n// { lastLogin: \"today\", clicks: 5 }\n```\n\nछुट्टै सफाइ प्रणाली नचलाई metadata object सँग जोडिन्छ। Application ले `user` छाड्दा, entry पनि सँगै जान सक्छ।\n\n---\n\n### 2. मध्यम — DOM element को हिसाब\n\n```javascript\nconst clickCounts = new WeakMap();\n\nfunction track(element) {\n  clickCounts.set(element, 0);\n}\n\nfunction recordClick(element) {\n  const count = clickCounts.get(element) ?? 0;\n\n  clickCounts.set(element, count + 1);\n}\n```\n\n```javascript\nconst button = document.querySelector(\"#save\");\n\ntrack(button);\n\nrecordClick(button);\nrecordClick(button);\n\nconsole.log(clickCounts.get(button)); // 2\n```\n\nButton हटाइयो र अरू कसैले यसलाई पुग्न सकिने नराखे, `WeakMap` संकलनको बाधा बन्दैन। आफूले आयु नियन्त्रण नगर्ने object का metadata का लागि ठ्याक्कै यही चाहिन्छ।\n\n---\n\n### 3. उन्नत — private instance state का लागि `WeakMap`\n\nJavaScript मा `#privateField` आउनुअघि, प्रति-instance private data राख्ने तरिका `WeakMap` नै थियो।\n\n```javascript\nconst privateData = new WeakMap();\n\nclass BankAccount {\n  constructor(balance) {\n    privateData.set(this, { balance });\n  }\n\n  deposit(amount) {\n    const data = privateData.get(this);\n\n    data.balance += amount;\n  }\n\n  getBalance() {\n    return privateData.get(this).balance;\n  }\n}\n\nconst account = new BankAccount(100);\n\naccount.deposit(50);\n\nconsole.log(account.getBalance()); // 150\nconsole.log(account.balance);      // undefined\n```\n\n```text\naccount\n   │\n   │ weak key\n   ▼\nWeakMap\n   │\n   ▼\n{ balance: 150 }\n```\n\nआधुनिक code ले private field रोज्नुपर्छ:\n\n```javascript\nclass BankAccount {\n  #balance;\n\n  constructor(balance) {\n    this.#balance = balance;\n  }\n}\n```\n\nतर `WeakMap` ढाँचा बुझ्न लायक छ, किनकि यसले कमजोर रूपमा जोडिएको अवस्था कसरी काम गर्छ देखाउँछ।\n\n---\n\n### `WeakMap` का सीमा, र किन छन्\n\n<b>Key object नै हुनुपर्छ।</b>\n\n```javascript\nconst map = new WeakMap();\n\nmap.set(\"user\", 123); // TypeError\nmap.set({}, 123);     // हुन्छ\n```\n\n<b>Iteration छैन।</b> `keys()`, `values()`, `entries()` वा `forEach()` छैनन्, र `for...of` काम गर्दैन। यो जानाजान हो: `WeakMap` गन्न पाइने भए, garbage collection ले entry कहिले हटायो भन्ने ठ्याक्कै देख्न सकिन्थ्यो।\n\n<b>`.size` छैन।</b> Collection चल्दा entry को संख्या आफैं बदलिन सक्छ, त्यसैले भरपर्दो गन्ती देखाउने कुरै छैन।\n\n---\n\n### `WeakSet`\n\n`WeakSet` ले उही सिद्धान्त पछ्याउँछ, तर मान जोड्नुको सट्टा object को हिसाब मात्र राख्छ।\n\n```javascript\nconst processed = new WeakSet();\n\nconst user = { id: 1 };\n\nprocessed.add(user);\n\nconsole.log(processed.has(user)); // true\n\nprocessed.delete(user);\n```\n\nव्यावहारिक प्रयोग — object पहिले नै सम्हालिएको भनी चिन्ह लगाउनु:\n\n```javascript\nconst processed = new WeakSet();\n\nfunction processUser(user) {\n  if (processed.has(user)) {\n    return;\n  }\n\n  console.log(\"Processing:\", user.name);\n\n  processed.add(user);\n}\n```\n\n```javascript\nconst user = { name: \"Rajan\" };\n\nprocessUser(user); // Processing: Rajan\nprocessUser(user); // केही होइन\n```\n\nObject process भइसकेको सम्झिन्छ, तर `WeakSet` यो जीवित रहनुको कारण कहिल्यै बन्दैन।\n\n---\n\n### `WeakMap` vs `WeakSet`\n\n```text\n                  WeakMap            WeakSet\nराख्छ              key → value        object\nKey / item        object             object\nकमजोर रूपमा       key                item\n.get() / .set()   छ                  छैन\n.add()            छैन                छ\n.has() .delete()  छ                  छ\nIteration         छैन                छैन\n.size             छैन                छैन\nमुख्य प्रयोग       object metadata    object tracking\n```\n\n---\n\n### `WeakRef`\n\n`WeakRef` एक तह तल जान्छ: collection होइन, यो <b>एउटै object को एउटै weak reference</b> हो।\n\n```javascript\nlet user = { name: \"Rajan\" };\n\nconst ref = new WeakRef(user);\n```\n\n`deref()` ले पढ्नुहुन्छ:\n\n```javascript\nconst value = ref.deref();\n\nconsole.log(value); // { name: \"Rajan\" }, वा संकलन भइसके undefined\n```\n\nObject अझै छ भनी कहिल्यै मान्न सकिन्न:\n\n```javascript\nconst maybeUser = ref.deref();\n\nif (maybeUser) {\n  console.log(maybeUser.name);\n}\n```\n\nआफ्ना entry जीवित रहन बाध्य नपार्ने cache:\n\n```javascript\nconst cache = new Map();\n\nfunction cacheUser(id, user) {\n  cache.set(id, new WeakRef(user));\n}\n\nfunction getCachedUser(id) {\n  const ref = cache.get(id);\n\n  if (!ref) return undefined;\n\n  const user = ref.deref();\n\n  if (!user) {\n    cache.delete(id);\n    return undefined;\n  }\n\n  return user;\n}\n```\n\n```text\nMap\n │\n ├── \"user-1\" → WeakRef ──weak──► User\n ├── \"user-2\" → WeakRef ──weak──► User\n └── \"user-3\" → WeakRef ──weak──► User\n```\n\nयो उन्नत प्रविधि हो। धेरैजसो application मा स्वाभाविक रूपमा मिल्दा `WeakMap` वा `WeakSet` नै रोज्नुहोस्।\n\n---\n\n### कुन छान्ने\n\n```text\nObject → metadata चाहियो?\n        │\n        ▼\n     WeakMap\n\n\nObject जीवित नराखी\nसम्झनुपर्‍यो?\n        │\n        ▼\n     WeakSet\n\n\nएउटै object को\nweak reference चाहियो?\n        │\n        ▼\n     WeakRef\n\n\nIteration, size, primitive key,\nवा पूर्वानुमानयोग्य entry चाहियो?\n        │\n        ▼\n       Map / Set\n```\n\n> <b>पूर्वनिर्धारित रूपमा `Map` र `Set` प्रयोग गर्नुहोस्। Collection ले आफूले हिसाब राखेको कुराको आयु तय गर्नु नहुने बेला `WeakMap` वा `WeakSet` रोज्नुहोस्। `WeakRef` उन्नत, GC-संवेदनशील डिजाइनमा मात्र प्रयोग गर्नुहोस्।</b>",
        jp: "JavaScriptには<b>弱参照</b>を扱う3つの道具があります:\n\n• <b>`WeakMap`</b> — オブジェクトを生かし続けずにデータを結び付ける\n• <b>`WeakSet`</b> — オブジェクトを生かし続けずに記録する\n• <b>`WeakRef`</b> — 1つのオブジェクトへの弱参照を持つ\n\n`Map` や `Set` との違いは<b>ガベージコレクションの振る舞い</b>です。通常の `Map` はキーを強く参照します:\n\n```javascript\nconst map = new Map();\n\nlet user = { name: \"Rajan\" };\n\nmap.set(user, \"metadata\");\n\nuser = null;\n```\n\n`Map` がまだ参照しているので、オブジェクトは到達可能なままです:\n\n```text\nMap\n │\n ▼\nUser object\n```\n\n`WeakMap` なら、ほかに到達経路がなくなった時点で:\n\n```text\nApplication\n\nuser ──► null\n\nWeakMap ──weak──► User object\n                         ↓\n                   eligible for GC\n```\n\nコレクタはオブジェクトごとその項目を回収できます。\n\n> <b>「弱い」は「重要度が低い」ではない。その参照がガベージコレクションを妨げない、という意味。</b>\n\n---\n\n### 1. 基本 — オブジェクトのメタデータに `WeakMap`\n\n```javascript\nconst metadata = new WeakMap();\n\nlet user = {\n  id: 1,\n  name: \"Rajan\"\n};\n\nmetadata.set(user, {\n  lastLogin: \"today\",\n  clicks: 5\n});\n\nconsole.log(metadata.get(user));\n// { lastLogin: \"today\", clicks: 5 }\n```\n\n別途の後片付けの仕組みを持たずに、メタデータをオブジェクトへ結び付けられます。アプリが `user` を手放せば、項目も一緒に消えます。\n\n---\n\n### 2. 中級 — DOM要素を記録する\n\n```javascript\nconst clickCounts = new WeakMap();\n\nfunction track(element) {\n  clickCounts.set(element, 0);\n}\n\nfunction recordClick(element) {\n  const count = clickCounts.get(element) ?? 0;\n\n  clickCounts.set(element, count + 1);\n}\n```\n\n```javascript\nconst button = document.querySelector(\"#save\");\n\ntrack(button);\n\nrecordClick(button);\nrecordClick(button);\n\nconsole.log(clickCounts.get(button)); // 2\n```\n\nボタンが取り除かれ、ほかに到達経路がなければ、`WeakMap` は回収を妨げません。寿命を自分で制御できないオブジェクトのメタデータには、まさにこれが欲しいところです。\n\n---\n\n### 3. 上級 — インスタンスの私的状態に `WeakMap`\n\n`#privateField` が入る前は、インスタンスごとの私的データは `WeakMap` で持っていました。\n\n```javascript\nconst privateData = new WeakMap();\n\nclass BankAccount {\n  constructor(balance) {\n    privateData.set(this, { balance });\n  }\n\n  deposit(amount) {\n    const data = privateData.get(this);\n\n    data.balance += amount;\n  }\n\n  getBalance() {\n    return privateData.get(this).balance;\n  }\n}\n\nconst account = new BankAccount(100);\n\naccount.deposit(50);\n\nconsole.log(account.getBalance()); // 150\nconsole.log(account.balance);      // undefined\n```\n\n```text\naccount\n   │\n   │ weak key\n   ▼\nWeakMap\n   │\n   ▼\n{ balance: 150 }\n```\n\n現代のコードはプライベートフィールドを選ぶべきです:\n\n```javascript\nclass BankAccount {\n  #balance;\n\n  constructor(balance) {\n    this.#balance = balance;\n  }\n}\n```\n\nそれでも `WeakMap` の型は、弱く結び付いた状態の仕組みを示すので理解しておく価値があります。\n\n---\n\n### `WeakMap` の制限と、その理由\n\n<b>キーはオブジェクトのみ。</b>\n\n```javascript\nconst map = new WeakMap();\n\nmap.set(\"user\", 123); // TypeError\nmap.set({}, 123);     // 有効\n```\n\n<b>反復できない。</b> `keys()`・`values()`・`entries()`・`forEach()` はなく、`for...of` も使えません。これは意図的です。列挙できてしまうと、ガベージコレクションが項目を消した瞬間を観測できてしまいます。\n\n<b>`.size` がない。</b> 回収が走れば項目数は勝手に変わるので、信頼できる数を公開できません。\n\n---\n\n### `WeakSet`\n\n`WeakSet` は同じ原理で、値を結び付けるのではなくオブジェクトを記録します。\n\n```javascript\nconst processed = new WeakSet();\n\nconst user = { id: 1 };\n\nprocessed.add(user);\n\nconsole.log(processed.has(user)); // true\n\nprocessed.delete(user);\n```\n\n実用的なのは、処理済みの印を付けることです:\n\n```javascript\nconst processed = new WeakSet();\n\nfunction processUser(user) {\n  if (processed.has(user)) {\n    return;\n  }\n\n  console.log(\"Processing:\", user.name);\n\n  processed.add(user);\n}\n```\n\n```javascript\nconst user = { name: \"Rajan\" };\n\nprocessUser(user); // Processing: Rajan\nprocessUser(user); // 何も起きない\n```\n\n処理済みとして覚えつつ、`WeakSet` がそのオブジェクトを生かす理由にはなりません。\n\n---\n\n### `WeakMap` と `WeakSet`\n\n```text\n                  WeakMap            WeakSet\n保存するもの      キー → 値          オブジェクト\nキー / 要素       オブジェクト       オブジェクト\n弱く保持          キー               要素\n.get() / .set()   あり               なし\n.add()            なし               あり\n.has() .delete()  あり               あり\n反復              不可               不可\n.size             なし               なし\n主な用途          メタデータ         オブジェクトの記録\n```\n\n---\n\n### `WeakRef`\n\n`WeakRef` はもう一段下です。コレクションではなく、<b>1つのオブジェクトへの1つの弱参照</b>です。\n\n```javascript\nlet user = { name: \"Rajan\" };\n\nconst ref = new WeakRef(user);\n```\n\n読み出しは `deref()` です:\n\n```javascript\nconst value = ref.deref();\n\nconsole.log(value); // { name: \"Rajan\" }、回収済みなら undefined\n```\n\nまだ存在すると仮定してはいけません:\n\n```javascript\nconst maybeUser = ref.deref();\n\nif (maybeUser) {\n  console.log(maybeUser.name);\n}\n```\n\n項目を生かし続けないキャッシュ:\n\n```javascript\nconst cache = new Map();\n\nfunction cacheUser(id, user) {\n  cache.set(id, new WeakRef(user));\n}\n\nfunction getCachedUser(id) {\n  const ref = cache.get(id);\n\n  if (!ref) return undefined;\n\n  const user = ref.deref();\n\n  if (!user) {\n    cache.delete(id);\n    return undefined;\n  }\n\n  return user;\n}\n```\n\n```text\nMap\n │\n ├── \"user-1\" → WeakRef ──weak──► User\n ├── \"user-2\" → WeakRef ──weak──► User\n └── \"user-3\" → WeakRef ──weak──► User\n```\n\nこれは上級の手法です。多くのアプリでは、素直に当てはまるなら `WeakMap` か `WeakSet` を選びます。\n\n---\n\n### どれを選ぶか\n\n```text\nオブジェクト → メタデータ?\n        │\n        ▼\n     WeakMap\n\n\n生かし続けずに\n覚えておきたい?\n        │\n        ▼\n     WeakSet\n\n\n特定の1つへの\n弱参照が要る?\n        │\n        ▼\n     WeakRef\n\n\n反復・サイズ・プリミティブのキー・\n予測できる項目が要る?\n        │\n        ▼\n       Map / Set\n```\n\n> <b>既定では `Map` と `Set` を使う。コレクションが対象の寿命を決めるべきでないときに `WeakMap` や `WeakSet` を選ぶ。`WeakRef` はGCに敏感な上級設計のときだけ。</b>",
      },
      diagram: `Map                          WeakMap

┌──────────────┐             ┌──────────────┐
│     Map      │             │   WeakMap    │
└──────┬───────┘             └──────┬───────┘
       │ strong                     │ weak
       ▼                            ▼
   ┌──────────┐                 ┌──────────┐
   │  Object  │                 │  Object  │
   └──────────┘                 └──────────┘

Object stays alive           Can be collected when
while the Map is             nothing else reaches it
reachable


Private state, held weakly

account
   │
   │ weak key
   ▼
WeakMap
   │
   ▼
{ balance: 150 }


A cache that does not pin its entries

Map
 │
 ├── "user-1" → WeakRef ──weak──► User
 ├── "user-2" → WeakRef ──weak──► User
 └── "user-3" → WeakRef ──weak──► User


Choosing between them

Need object → metadata?          → WeakMap
Remember objects, not keep them? → WeakSet
Weak reference to one object?    → WeakRef
Iteration, size, primitive keys? → Map / Set`,
      codeExample: {
        title: { en: "References that let go", np: "छाड्न सक्ने reference", jp: "手放せる参照" },
        code: `// ── 1. Basic — metadata that does not pin the object ──────────────
const metadata = new WeakMap();

let user = { id: 1, name: "Rajan" };

metadata.set(user, { lastLogin: "today", clicks: 5 });
metadata.get(user); // { lastLogin: "today", clicks: 5 }

user = null; // the object and its entry can now be collected

// ── 2. Intermediate — per-element state for the DOM ───────────────
const clickCounts = new WeakMap();

function recordClick(element) {
  const count = clickCounts.get(element) ?? 0;
  clickCounts.set(element, count + 1); // removing the element frees this
}

// ── 3. Advanced — private instance state before #fields existed ───
const privateData = new WeakMap();

class BankAccount {
  constructor(balance) {
    privateData.set(this, { balance });
  }

  getBalance() {
    return privateData.get(this).balance;
  }
}

new BankAccount(100).balance; // undefined — not a public property

// Modern code should just use a private field
class Better {
  #balance;
}

// ── The limits are deliberate ─────────────────────────────────────
const map = new WeakMap();

// map.set("user", 123); // TypeError — keys must be objects
// map.size;             // undefined — collection changes it on its own
// for (const e of map) {} // not iterable: it would expose GC timing

// ── WeakSet — remember objects without keeping them ───────────────
const processed = new WeakSet();

function processUser(user) {
  if (processed.has(user)) return; // already handled
  processed.add(user);
}

// ── WeakRef — one weak reference, always check deref() ────────────
const ref = new WeakRef({ name: "Rajan" });

const maybe = ref.deref();
if (maybe) console.log(maybe.name); // undefined once collected`,
      },
      keyTakeaways: [
        { en: "A <b>`WeakMap`</b> associates data with an object without keeping that object alive.", np: "<b>`WeakMap`</b> ले object लाई जीवित नराखी यससँग data जोड्छ।", jp: "<b>`WeakMap`</b> はオブジェクトを生かし続けずにデータを結び付ける。" },
        { en: "A normal `Map` holds its keys <b>strongly</b>, so an entry alone keeps the key reachable.", np: "सामान्य `Map` ले आफ्ना key <b>बलियो</b> गरी राख्छ, त्यसैले entry मात्रैले key पुग्न सकिने बनाइराख्छ।", jp: "通常の `Map` はキーを<b>強く</b>保持するので、項目があるだけでキーが到達可能になる。" },
        { en: "`WeakMap` keys must be <b>objects</b> — primitives throw a `TypeError`.", np: "`WeakMap` का key <b>object</b> नै हुनुपर्छ — primitive ले `TypeError` दिन्छ।", jp: "`WeakMap` のキーは<b>オブジェクト</b>のみ。プリミティブは `TypeError` になる。" },
        { en: "There is <b>no iteration and no `.size`</b>, because either would let you observe when collection ran.", np: "<b>Iteration र `.size` छैनन्</b>, किनकि दुबैले collection कहिले चल्यो भनी देख्न दिन्थे।", jp: "<b>反復も `.size` もない</b>。どちらも回収の時期を観測できてしまうから。" },
        { en: "A <b>`WeakSet`</b> tracks membership — useful for marking objects as already processed.", np: "<b>`WeakSet`</b> ले सदस्यता जनाउँछ — object पहिले नै process भइसकेको चिन्ह लगाउन उपयोगी।", jp: "<b>`WeakSet`</b> は所属を記録する。処理済みの印付けに便利。" },
        { en: "A <b>`WeakRef`</b> holds one weak reference; `deref()` returns the object or `undefined`.", np: "<b>`WeakRef`</b> ले एउटै weak reference राख्छ; `deref()` ले object वा `undefined` फर्काउँछ।", jp: "<b>`WeakRef`</b> は1つの弱参照を持つ。`deref()` はオブジェクトか `undefined` を返す。" },
        { en: "Collection timing is <b>not deterministic</b> — weak collections are not a notification mechanism.", np: "Collection कहिले हुन्छ <b>निश्चित छैन</b> — weak collection सूचना दिने संयन्त्र होइनन्।", jp: "回収の時期は<b>決定的でない</b>。弱いコレクションは通知の仕組みではない。" },
        { en: "Default to `Map` and `Set`; reach for the weak versions only when the collection should not decide lifetime.", np: "पूर्वनिर्धारित रूपमा `Map` र `Set`; collection ले आयु तय गर्नु नहुने बेला मात्र weak संस्करण रोज्नुहोस्।", jp: "既定は `Map` と `Set`。コレクションが寿命を決めるべきでないときだけ弱い版を使う。" },
      ],
      commonMistakes: [
        { en: "<b>Using a primitive as a `WeakMap` key</b> — `cache.set(\"user-1\", \"data\")` throws a `TypeError`. Keys have to be objects.", np: "<b>`WeakMap` को key मा primitive प्रयोग गर्नु</b> — `cache.set(\"user-1\", \"data\")` ले `TypeError` दिन्छ। Key object नै हुनुपर्छ।", jp: "<b>`WeakMap` のキーにプリミティブを使う</b> — `cache.set(\"user-1\", \"data\")` は `TypeError`。キーはオブジェクトでなければならない。" },
        { en: "<b>Expecting a `WeakMap` to be iterable</b> — there is no `for...of`, `keys()` or `.size`. If you need those, `Map` is the right structure.", np: "<b>`WeakMap` iterable हो भन्ने आशा गर्नु</b> — `for...of`, `keys()` वा `.size` छैनन्। ती चाहिए, सही संरचना `Map` हो।", jp: "<b>`WeakMap` を反復できると思う</b> — `for...of`・`keys()`・`.size` はない。必要なら `Map` が正しい選択。" },
        { en: "<b>Reaching for `WeakRef` everywhere</b> — weak references make behaviour depend on collection timing. Prefer `WeakMap` or `WeakSet` unless you genuinely need to test whether an object is still alive.", np: "<b>जताततै `WeakRef` प्रयोग गर्नु</b> — weak reference ले व्यवहारलाई collection को समयमा निर्भर बनाउँछ। Object अझै जीवित छ कि भनी साँच्चै जाँच्नुपर्ने नभए `WeakMap` वा `WeakSet` रोज्नुहोस्।", jp: "<b>どこでも `WeakRef` を使う</b> — 弱参照は挙動を回収の時期に依存させる。生存確認が本当に必要でなければ `WeakMap` か `WeakSet` を選ぶ。" },
        { en: "<b>Treating a `WeakMap` as a cleanup notification</b> — setting `object = null` gives you no callback and no guaranteed timing. Collection is not observable.", np: "<b>`WeakMap` लाई सफाइको सूचना ठान्नु</b> — `object = null` गर्दा कुनै callback आउँदैन र समयको ग्यारेन्टी हुँदैन। Collection देख्न सकिँदैन।", jp: "<b>`WeakMap` を後片付けの通知と考える</b> — `object = null` してもコールバックは来ず、時期の保証もない。回収は観測できない。" },
      ],
      quiz: [
        {
          question: { en: "What is the key difference between `Map` and `WeakMap`?", np: "`Map` र `WeakMap` बीचको मुख्य भिन्नता के हो?", jp: "`Map` と `WeakMap` の決定的な違いは?" },
          options: [
            { en: "`WeakMap` is faster in every situation", np: "`WeakMap` हरेक अवस्थामा छिटो हुन्छ", jp: "`WeakMap` はあらゆる場面で速い" },
            { en: "`WeakMap` only stores strings", np: "`WeakMap` ले string मात्र राख्छ", jp: "`WeakMap` は文字列しか保存しない" },
            { en: "`WeakMap` sorts its keys automatically", np: "`WeakMap` ले key स्वतः क्रमबद्ध गर्छ", jp: "`WeakMap` はキーを自動で整列する" },
            { en: "`WeakMap` does not strongly retain its object keys", np: "`WeakMap` ले आफ्ना object key बलियो गरी राख्दैन", jp: "`WeakMap` はオブジェクトのキーを強く保持しない" },
          ],
          correctIndex: 3,
          explanation: { en: "A `Map` entry alone is enough to keep its key reachable.", np: "`Map` को entry मात्रैले यसको key पुग्न सकिने राख्न पुग्छ।", jp: "`Map` は項目があるだけでキーを到達可能に保つ。" },
        },
        {
          question: { en: "Which call is valid on `const map = new WeakMap()`?", np: "`const map = new WeakMap()` मा कुन call मान्य छ?", jp: "`const map = new WeakMap()` で有効な呼び出しは?" },
          options: [
            { en: "`map.set(\"user\", 123)`", np: "`map.set(\"user\", 123)`", jp: "`map.set(\"user\", 123)`" },
            { en: "`map.set({}, \"value\")`", np: "`map.set({}, \"value\")`", jp: "`map.set({}, \"value\")`" },
            { en: "`map.set(10, \"value\")`", np: "`map.set(10, \"value\")`", jp: "`map.set(10, \"value\")`" },
            { en: "`map.set(true, \"value\")`", np: "`map.set(true, \"value\")`", jp: "`map.set(true, \"value\")`" },
          ],
          correctIndex: 1,
          explanation: { en: "Only objects can be keys; a primitive throws a `TypeError`.", np: "Key object मात्र हुन सक्छन्; primitive ले `TypeError` दिन्छ।", jp: "キーになれるのはオブジェクトだけ。プリミティブは `TypeError`。" },
        },
        {
          question: { en: "Why does `WeakMap` have no `.size`?", np: "`WeakMap` मा `.size` किन छैन?", jp: "`WeakMap` に `.size` がないのはなぜか?" },
          options: [
            { en: "It would be too slow to compute", np: "गणना गर्न धेरै ढिलो हुन्थ्यो", jp: "計算が遅すぎるから" },
            { en: "Entries can disappear through garbage collection", np: "Garbage collection ले entry हराउन सक्छन्", jp: "ガベージコレクションで項目が消えうるから" },
            { en: "It stores only one value", np: "यसले एउटै मान राख्छ", jp: "値を1つしか保存しないから" },
            { en: "`.size` is deprecated", np: "`.size` अप्रचलित छ", jp: "`.size` は非推奨だから" },
          ],
          correctIndex: 1,
          explanation: { en: "Exposing it would let you observe exactly when collection ran.", np: "यो देखाए collection कहिले चल्यो भनी ठ्याक्कै देख्न सकिन्थ्यो।", jp: "公開すれば、回収の時期を正確に観測できてしまう。" },
        },
        {
          question: { en: "What does `WeakRef.deref()` return?", np: "`WeakRef.deref()` ले के फर्काउँछ?", jp: "`WeakRef.deref()` は何を返すか?" },
          options: [
            { en: "The object if it is still alive, otherwise `undefined`", np: "अझै जीवित भए object, नत्र `undefined`", jp: "生きていればオブジェクト、そうでなければ `undefined`" },
            { en: "A copy of the object", np: "Object को copy", jp: "オブジェクトのコピー" },
            { en: "Always the original object", np: "सधैं मूल object", jp: "常に元のオブジェクト" },
            { en: "The object's memory address", np: "Object को memory ठेगाना", jp: "オブジェクトのメモリアドレス" },
          ],
          correctIndex: 0,
          explanation: { en: "Always guard the result before using it.", np: "प्रयोग गर्नुअघि सधैं नतिजा जाँच्नुहोस्।", jp: "使う前に必ず結果を確認する。" },
        },
        {
          question: { en: "Which is the best choice for attaching metadata to DOM elements without keeping removed elements alive?", np: "हटाइएका element जीवित नराखी DOM element मा metadata जोड्न कुन उत्तम छ?", jp: "取り除かれた要素を生かさずにDOM要素へメタデータを付けるのに最適なのは?" },
          options: [
            { en: "`Map`", np: "`Map`", jp: "`Map`" },
            { en: "`WeakMap`", np: "`WeakMap`", jp: "`WeakMap`" },
            { en: "An array", np: "एउटा array", jp: "配列" },
            { en: "`WeakRef`", np: "`WeakRef`", jp: "`WeakRef`" },
          ],
          correctIndex: 1,
          explanation: { en: "The entry then follows the lifetime of the element it describes.", np: "अनि entry ले आफूले वर्णन गरेको element कै आयु पछ्याउँछ।", jp: "項目は、それが説明する要素の寿命に従う。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "What does the <b>stack</b> primarily track?", np: "<b>Stack</b> ले मुख्यतः केको हिसाब राख्छ?", jp: "<b>スタック</b>が主に追うものは?" },
      options: [
        { en: "Function execution and call frames", np: "Function execution र call frame", jp: "関数の実行と呼び出しフレーム" },
        { en: "Every object in the program", np: "Program का हरेक object", jp: "プログラム内のすべてのオブジェクト" },
        { en: "Pending network requests", np: "बाँकी network request", jp: "保留中のネットワーク要求" },
      ],
      correctIndex: 0,
      explanation: { en: "Dynamically allocated data lives in the heap instead.", np: "गतिशील रूपमा छुट्याइएको data बरु heap मा बस्छ।", jp: "動的に確保したデータはヒープに置かれる。" },
    },
    {
      question: { en: "For `const b = a` where `a` is an object, what is copied?", np: "`a` object हुँदा `const b = a` मा के copy हुन्छ?", jp: "`a` がオブジェクトのとき `const b = a` で複製されるものは?" },
      options: [
        { en: "The whole object", np: "पूरै object", jp: "オブジェクト全体" },
        { en: "The reference to the object", np: "Object को reference", jp: "オブジェクトへの参照" },
        { en: "Only the object's own properties", np: "Object का आफ्नै property मात्र", jp: "自身のプロパティだけ" },
      ],
      correctIndex: 1,
      explanation: { en: "Use `{ ...a }` when you need an independent object.", np: "स्वतन्त्र object चाहिँदा `{ ...a }` प्रयोग गर्नुहोस्।", jp: "独立したオブジェクトが要るなら `{ ...a }` を使う。" },
    },
    {
      question: { en: "What makes an object eligible for garbage collection?", np: "Object लाई garbage collection योग्य केले बनाउँछ?", jp: "オブジェクトがGCの対象になる条件は?" },
      options: [
        { en: "Its reference count hitting zero", np: "यसको reference count शून्य पुग्नु", jp: "参照カウントが0になること" },
        { en: "Its enclosing function returning", np: "यसको बाहिरी function return हुनु", jp: "囲っている関数が戻ること" },
        { en: "Becoming unreachable from the GC roots", np: "GC root बाट पुग्न नसकिने हुनु", jp: "GCルートから到達できなくなること" },
      ],
      correctIndex: 2,
      explanation: { en: "That is why an unreachable cycle is still collectable.", np: "त्यसैले पुग्न नसकिने cycle पनि संकलनयोग्य हुन्छ।", jp: "だから到達不能な循環も回収できる。" },
    },
    {
      question: { en: "Do circular references always cause a memory leak?", np: "के circular reference ले सधैं memory leak गराउँछ?", jp: "循環参照は必ずメモリリークを起こすか?" },
      options: [
        { en: "Yes, they can never be collected", np: "हो, ती कहिल्यै संकलन हुन सक्दैनन्", jp: "はい、決して回収されない" },
        { en: "No, an unreachable cycle can still be collected", np: "होइन, पुग्न नसकिने cycle पनि संकलन हुन सक्छ", jp: "いいえ、到達不能な循環は回収できる" },
        { en: "Only in Node.js", np: "Node.js मा मात्र", jp: "Node.jsでのみ" },
      ],
      correctIndex: 1,
      explanation: { en: "Modern collectors trace reachability rather than counting references.", np: "आधुनिक collector ले reference गन्नुभन्दा reachability पछ्याउँछन्।", jp: "現代のコレクタは参照を数えず到達可能性をたどる。" },
    },
    {
      question: { en: "Why can a closure keep a large array alive?", np: "Closure ले ठूलो array किन जीवित राख्न सक्छ?", jp: "クロージャが大きな配列を生かし続けるのはなぜか?" },
      options: [
        { en: "Closures copy every outer variable", np: "Closure ले हरेक बाहिरी variable copy गर्छ", jp: "外側の変数をすべて複製するから" },
        { en: "It keeps a reference to the variable it captured", np: "यसले आफूले समेटेको variable को reference राख्छ", jp: "取り込んだ変数への参照を保持するから" },
        { en: "Arrays are never garbage collected", np: "Array कहिल्यै garbage collect हुँदैनन्", jp: "配列は決して回収されないから" },
      ],
      correctIndex: 1,
      explanation: { en: "Read out the single value you need before returning the closure.", np: "Closure फर्काउनुअघि चाहिने एउटै मान झिक्नुहोस्।", jp: "クロージャを返す前に、必要な1つの値を取り出す。" },
    },
    {
      question: { en: "What removes an event listener correctly?", np: "Event listener सही ढंगले कसले हटाउँछ?", jp: "イベントリスナーを正しく外すのは?" },
      options: [
        { en: "`removeEventListener` with the same function reference", np: "उही function reference सहित `removeEventListener`", jp: "同じ関数参照を渡した `removeEventListener`" },
        { en: "A new arrow function with the same body", np: "उही body भएको नयाँ arrow function", jp: "同じ本体の新しいアロー関数" },
        { en: "Setting the element to `null`", np: "Element लाई `null` बनाउनु", jp: "要素に `null` を代入する" },
      ],
      correctIndex: 0,
      explanation: { en: "Two identical-looking functions are still different objects.", np: "उस्तै देखिने दुई function पनि फरक object हुन्।", jp: "見た目が同じ関数でも別のオブジェクト。" },
    },
    {
      question: { en: "What happens if a polling function calls `setInterval` every time it runs?", np: "Polling function ले चलेको हरेक पटक `setInterval` बोलाए के हुन्छ?", jp: "ポーリング関数が実行のたびに `setInterval` を呼ぶとどうなるか?" },
      options: [
        { en: "JavaScript refuses the second call", np: "JavaScript ले दोस्रो call अस्वीकार गर्छ", jp: "JavaScriptが2回目の呼び出しを拒否する" },
        { en: "The newest interval replaces the previous one", np: "नयाँ interval ले अघिल्लोलाई प्रतिस्थापन गर्छ", jp: "新しいintervalが前のものを置き換える" },
        { en: "Each call starts another independent timer", np: "हरेक call ले अर्को स्वतन्त्र timer सुरु गर्छ", jp: "呼ぶたびに独立したタイマーが増える" },
      ],
      correctIndex: 2,
      explanation: { en: "Store the id and guard with `if (timerId) return;`.", np: "Id राख्नुहोस् र `if (timerId) return;` ले जोगिनुहोस्।", jp: "IDを保持し、`if (timerId) return;` で守る。" },
    },
    {
      question: { en: "Why is an unbounded cache a leak risk?", np: "सीमारहित cache किन leak जोखिम हो?", jp: "上限のないキャッシュがリークの危険なのはなぜか?" },
      options: [
        { en: "Caches cannot be garbage collected", np: "Cache garbage collect हुन सक्दैनन्", jp: "キャッシュは回収できないから" },
        { en: "Every stored value stays reachable while the cache holds it", np: "Cache ले राखेसम्म हरेक मान पुग्न सकिने रहन्छ", jp: "キャッシュが保持する限り、保存した値は到達可能なままだから" },
        { en: "Caches copy their values twice", np: "Cache ले आफ्ना मान दुई पटक copy गर्छ", jp: "値を2回複製するから" },
      ],
      correctIndex: 1,
      explanation: { en: "Add a size limit, eviction policy or expiry.", np: "आकार सीमा, eviction नीति वा म्याद थप्नुहोस्।", jp: "上限・追い出し方針・期限を加える。" },
    },
    {
      question: { en: "What can a `WeakMap` key be?", np: "`WeakMap` को key के हुन सक्छ?", jp: "`WeakMap` のキーになれるのは?" },
      options: [
        { en: "Any value", np: "कुनै पनि मान", jp: "任意の値" },
        { en: "Strings and symbols", np: "String र symbol", jp: "文字列とシンボル" },
        { en: "Objects only", np: "Object मात्र", jp: "オブジェクトのみ" },
      ],
      correctIndex: 2,
      explanation: { en: "A primitive key throws a `TypeError`.", np: "Primitive key ले `TypeError` दिन्छ।", jp: "プリミティブのキーは `TypeError` になる。" },
    },
    {
      question: { en: "Why does `WeakMap` offer no iteration or `.size`?", np: "`WeakMap` ले iteration वा `.size` किन दिँदैन?", jp: "`WeakMap` に反復も `.size` もないのはなぜか?" },
      options: [
        { en: "They would expose when garbage collection removed an entry", np: "तिनले garbage collection ले entry कहिले हटायो भनी देखाउँथे", jp: "ガベージコレクションが項目を消した時期が分かってしまうから" },
        { en: "They are too slow to implement", np: "तिनी लागू गर्न धेरै ढिलो हुन्छन्", jp: "実装が遅すぎるから" },
        { en: "They were removed in a later spec", np: "पछिल्लो spec मा तिनी हटाइए", jp: "後の仕様で削除されたから" },
      ],
      correctIndex: 0,
      explanation: { en: "Collection timing is deliberately not observable.", np: "Collection कहिले हुन्छ भन्ने जानाजान देख्न नसकिने बनाइएको छ।", jp: "回収の時期は意図的に観測できないようにされている。" },
    },
    {
      question: { en: "What does `WeakRef.deref()` return once the object has been collected?", np: "Object संकलन भइसकेपछि `WeakRef.deref()` ले के फर्काउँछ?", jp: "オブジェクトが回収された後、`WeakRef.deref()` は何を返すか?" },
      options: [
        { en: "The last known value", np: "अन्तिम थाहा भएको मान", jp: "最後に分かっていた値" },
        { en: "It throws a `ReferenceError`", np: "यसले `ReferenceError` दिन्छ", jp: "`ReferenceError` を投げる" },
        { en: "`undefined`", np: "`undefined`", jp: "`undefined`" },
      ],
      correctIndex: 2,
      explanation: { en: "Always guard the result before using it.", np: "प्रयोग गर्नुअघि सधैं नतिजा जाँच्नुहोस्।", jp: "使う前に必ず結果を確認する。" },
    },
    {
      question: { en: "Which structure best attaches metadata to DOM elements you do not own the lifetime of?", np: "आफूले आयु नियन्त्रण नगर्ने DOM element मा metadata जोड्न कुन संरचना उत्तम छ?", jp: "寿命を自分で持たないDOM要素にメタデータを付けるのに最適な構造は?" },
      options: [
        { en: "`WeakMap`", np: "`WeakMap`", jp: "`WeakMap`" },
        { en: "`Map`", np: "`Map`", jp: "`Map`" },
        { en: "An array of pairs", np: "जोडीको array", jp: "ペアの配列" },
      ],
      correctIndex: 0,
      explanation: { en: "It does not become the reason a removed element stays alive.", np: "हटाइएको element जीवित रहनुको कारण यो बन्दैन।", jp: "取り除かれた要素が生き残る理由にはならない。" },
    },
  ],
};
