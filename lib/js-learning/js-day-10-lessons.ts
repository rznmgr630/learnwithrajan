import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_10_LESSONS: JsLessonDay = {
  day: 10,
  title: { en: "Error Handling, CommonJS & ES Modules", np: "Error Handling, CommonJS र ES Modules", jp: "エラー処理・CommonJS・ESモジュール" },
  totalMinutes: 27,
  difficulty: { en: "Beginner", np: "Beginner", jp: "初級" },
  lessons: [
    {
      id: "try-catch-custom-errors",
      title: { en: "try, catch, finally & Custom Errors", np: "try, catch, finally, Custom Errors", jp: "try・catch・finallyとカスタムエラー" },
      durationMinutes: 9,
      explanation: {
        en: "An <b>error</b> happens when something goes wrong while your program is running.\n\nFor example:\n\n```javascript\nconst user = null;\n\nconsole.log(user.name);\n```\n\nThis causes an error because `null` means <b>there is no object</b> to read from.\n\nErrors can happen for many reasons:\n\n• User enters invalid data\n• Database request fails\n• API is unavailable\n• Network connection fails\n• A file cannot be found\n• Your code has a bug\n\nWe can't prevent every error.\n\nThe goal is to <b>handle errors properly instead of letting the whole application crash</b>.\n\n---\n\n## 1. `try...catch`\n\nJavaScript gives us `try...catch` to handle errors.\n\n```javascript\ntry {\n  // Code that might fail\n} catch (err) {\n  // Handle the error\n}\n```\n\nFor example:\n\n```javascript\ntry {\n  const user = null;\n  console.log(user.name);\n} catch (err) {\n  console.log(\"Something went wrong\");\n}\n```\n\nWhen the code inside `try` throws an error, JavaScript immediately moves to `catch`.\n\n```text\ntry\n ↓\nError happens\n ↓\ncatch\n ↓\nHandle the error\n```\n\nThis prevents the error from crashing that part of the program.\n\n---\n\n## 2. The `Error` Object\n\nThe `catch` block gives us an error object.\n\n```javascript\ncatch (err) {\n  console.log(err);\n}\n```\n\nAn error usually contains useful information.\n\n### `err.name`\n\nTells us the type of error.\n\n```javascript\nconsole.log(err.name);\n```\n\nExample:\n\n```text\nTypeError\n```\n\n### `err.message`\n\nTells us what went wrong.\n\n```javascript\nconsole.log(err.message);\n```\n\nExample:\n\n```text\nCannot read properties of null\n```\n\n### `err.stack`\n\nShows where the error happened.\n\n```javascript\nconsole.log(err.stack);\n```\n\nThis is very useful when <b>debugging</b> (finding the cause of a problem).\n\n---\n\n## 3. `finally`\n\nSometimes we need to run some code <b>no matter what happens</b>.\n\nThat's what `finally` is for.\n\n```javascript\ntry {\n  // Try something\n} catch (err) {\n  // Handle error\n} finally {\n  // Always runs\n}\n```\n\nFor example, imagine we open a database connection:\n\n```text\nOpen database\n     ↓\nDo some work\n     ↓\nSuccess or Error\n     ↓\nClose database\n```\n\nWe want the database connection to close whether the operation succeeds or fails.\n\nSo we can use:\n\n```javascript\ntry {\n  await database.query();\n} catch (err) {\n  console.log(err.message);\n} finally {\n  database.close();\n}\n```\n\n`finally` runs:\n\n• After success\n• After an error\n• Even if `return` is used\n\nThat's why it's useful for <b>cleanup</b> (closing or releasing something).\n\n---\n\n## 4. Common JavaScript Errors\n\nJavaScript has several built-in error types.\n\n### `TypeError`\n\nUsually means you're using a value in the wrong way.\n\n```javascript\nconst user = null;\n\nuser.name;\n```\n\nResult:\n\n```text\nTypeError\n```\n\n---\n\n### `ReferenceError`\n\nHappens when you try to use a variable that doesn't exist.\n\n```javascript\nconsole.log(username);\n```\n\nIf `username` was never created:\n\n```text\nReferenceError\n```\n\n---\n\n### `SyntaxError`\n\nHappens when JavaScript code is written incorrectly.\n\n```javascript\nconst user =\n```\n\nThe code isn't valid JavaScript.\n\n```text\nSyntaxError\n```\n\n---\n\n### `RangeError`\n\nHappens when a value is outside an allowed range.\n\n```javascript\nconst numbers = new Array(-1);\n```\n\nThis produces a `RangeError`.\n\n---\n\n## 5. `throw`\n\nWe can also create an error ourselves using `throw`.\n\nFor example, suppose a user must be at least 18 years old.\n\n```javascript\nfunction register(age) {\n  if (age < 18) {\n    throw new Error(\"User must be 18 or older\");\n  }\n\n  console.log(\"Registration successful\");\n}\n```\n\nIf:\n\n```javascript\nregister(15);\n```\n\nThe function throws an error.\n\nWe can handle it:\n\n```javascript\ntry {\n  register(15);\n} catch (err) {\n  console.log(err.message);\n}\n```\n\nOutput:\n\n```text\nUser must be 18 or older\n```\n\nSo `throw` basically means:\n\n> <b>\"Something is wrong. Stop and send this error to whoever can handle it.\"</b>\n\n---\n\n## 6. Custom Errors\n\nIn a real application, you may want different types of errors.\n\nFor example:\n\n• Validation error\n• Authentication error\n• Payment error\n• Database error\n\nWe can create our own error class.\n\n```javascript\nclass ValidationError extends Error {\n  constructor(message) {\n    super(message);\n    this.name = \"ValidationError\";\n  }\n}\n```\n\nNow we can use it:\n\n```javascript\nthrow new ValidationError(\"Email is required\");\n```\n\nThis makes it easier to understand what went wrong.\n\n---\n\n## 7. Adding Extra Information\n\nCustom errors can contain additional information.\n\nFor example:\n\n```javascript\nclass ValidationError extends Error {\n  constructor(message, field) {\n    super(message);\n    this.name = \"ValidationError\";\n    this.field = field;\n  }\n}\n```\n\nNow:\n\n```javascript\nthrow new ValidationError(\n  \"Email is required\",\n  \"email\"\n);\n```\n\nWe can access:\n\n```javascript\nerr.message\nerr.field\n```\n\nSo the error can tell us:\n\n```text\nType: ValidationError\nField: email\nMessage: Email is required\n```\n\n---\n\n## 8. Checking the Error Type\n\nWe can use `instanceof` to check what kind of error we received.\n\n```javascript\ntry {\n  // something\n} catch (err) {\n  if (err instanceof ValidationError) {\n    console.log(\"Invalid input\");\n  }\n}\n```\n\nThis lets us handle different errors differently.\n\nFor example:\n\n```javascript\ntry {\n  await createUser();\n} catch (err) {\n  if (err instanceof ValidationError) {\n    console.log(\"Please check your input\");\n  } else {\n    throw err;\n  }\n}\n```\n\nThe important part is:\n\n```javascript\nthrow err;\n```\n\nIf we don't know how to handle an error, <b>send it back up instead of silently ignoring it</b>.\n\n---\n\n## 9. Never Silently Ignore Errors\n\nThis is bad:\n\n```javascript\ntry {\n  await saveUser();\n} catch (err) {\n  // Nothing\n}\n```\n\nNow the program failed, but nobody knows why.\n\nIt's usually better to:\n\n```javascript\ncatch (err) {\n  console.error(err);\n  throw err;\n}\n```\n\nOr handle it properly if you know what to do.",
        np: "<b>Error</b> तब हुन्छ जब तपाईंको program चल्दै गर्दा केही गलत हुन्छ।\n\nउदाहरणका लागि:\n\n```javascript\nconst user = null;\n\nconsole.log(user.name);\n```\n\nयसले error दिन्छ किनकि `null` को अर्थ <b>पढ्न कुनै object छैन</b> भन्ने हो।\n\nError धेरै कारणले हुन सक्छ:\n\n• User ले invalid data हाल्यो\n• Database request fail भयो\n• API उपलब्ध छैन\n• Network connection fail भयो\n• File भेटिएन\n• तपाईंको code मा bug छ\n\nहामी हरेक error रोक्न सक्दैनौं।\n\nलक्ष्य <b>पूरै application crash हुन नदिई error लाई राम्ररी handle गर्नु</b> हो।\n\n---\n\n## 1. `try...catch`\n\nJavaScript ले error handle गर्न `try...catch` दिन्छ।\n\n```javascript\ntry {\n  // Code that might fail\n} catch (err) {\n  // Handle the error\n}\n```\n\nउदाहरणका लागि:\n\n```javascript\ntry {\n  const user = null;\n  console.log(user.name);\n} catch (err) {\n  console.log(\"Something went wrong\");\n}\n```\n\n`try` भित्रको code ले error throw गर्दा, JavaScript तुरुन्तै `catch` मा जान्छ।\n\n```text\ntry\n ↓\nError happens\n ↓\ncatch\n ↓\nHandle the error\n```\n\nयसले error लाई program को त्यो भाग crash गर्नबाट रोक्छ।\n\n---\n\n## 2. `Error` Object\n\n`catch` block ले हामीलाई error object दिन्छ।\n\n```javascript\ncatch (err) {\n  console.log(err);\n}\n```\n\nError मा सामान्यतया उपयोगी जानकारी हुन्छ।\n\n### `err.name`\n\nError को प्रकार बताउँछ।\n\n```javascript\nconsole.log(err.name);\n```\n\nउदाहरण:\n\n```text\nTypeError\n```\n\n### `err.message`\n\nके गलत भयो त्यो बताउँछ।\n\n```javascript\nconsole.log(err.message);\n```\n\nउदाहरण:\n\n```text\nCannot read properties of null\n```\n\n### `err.stack`\n\nError कहाँ भयो त्यो देखाउँछ।\n\n```javascript\nconsole.log(err.stack);\n```\n\nयो <b>debugging</b> (समस्याको कारण खोज्दा) धेरै उपयोगी हुन्छ।\n\n---\n\n## 3. `finally`\n\nकहिलेकाहीँ हामीलाई <b>के भए पनि</b> चल्ने code चाहिन्छ।\n\n`finally` त्यसैका लागि हो।\n\n```javascript\ntry {\n  // Try something\n} catch (err) {\n  // Handle error\n} finally {\n  // Always runs\n}\n```\n\nउदाहरणका लागि, कल्पना गर्नुहोस् हामी database connection खोल्छौं:\n\n```text\nOpen database\n     ↓\nDo some work\n     ↓\nSuccess or Error\n     ↓\nClose database\n```\n\nOperation सफल होस् वा fail, हामी database connection बन्द होस् भन्ने चाहन्छौं।\n\nत्यसैले हामी यो प्रयोग गर्न सक्छौं:\n\n```javascript\ntry {\n  await database.query();\n} catch (err) {\n  console.log(err.message);\n} finally {\n  database.close();\n}\n```\n\n`finally` चल्छ:\n\n• सफल भएपछि\n• Error आएपछि\n• `return` प्रयोग भए पनि\n\nत्यसैले यो <b>cleanup</b> (कुनै चीज बन्द वा release गर्नु) का लागि उपयोगी छ।\n\n---\n\n## 4. सामान्य JavaScript Errors\n\nJavaScript मा केही built-in error types छन्।\n\n### `TypeError`\n\nसामान्यतया तपाईंले value लाई गलत तरिकाले प्रयोग गरेको जनाउँछ।\n\n```javascript\nconst user = null;\n\nuser.name;\n```\n\nनतिजा:\n\n```text\nTypeError\n```\n\n---\n\n### `ReferenceError`\n\nअस्तित्वमा नभएको variable प्रयोग गर्न खोज्दा हुन्छ।\n\n```javascript\nconsole.log(username);\n```\n\nयदि `username` कहिल्यै बनाइएको थिएन:\n\n```text\nReferenceError\n```\n\n---\n\n### `SyntaxError`\n\nJavaScript code गलत तरिकाले लेखिँदा हुन्छ।\n\n```javascript\nconst user =\n```\n\nयो code valid JavaScript होइन।\n\n```text\nSyntaxError\n```\n\n---\n\n### `RangeError`\n\nValue अनुमति दिइएको range बाहिर हुँदा हुन्छ।\n\n```javascript\nconst numbers = new Array(-1);\n```\n\nयसले `RangeError` दिन्छ।\n\n---\n\n## 5. `throw`\n\nहामी आफैं पनि `throw` प्रयोग गरी error बनाउन सक्छौं।\n\nउदाहरणका लागि, मानौं user कम्तीमा 18 वर्षको हुनुपर्छ।\n\n```javascript\nfunction register(age) {\n  if (age < 18) {\n    throw new Error(\"User must be 18 or older\");\n  }\n\n  console.log(\"Registration successful\");\n}\n```\n\nयदि:\n\n```javascript\nregister(15);\n```\n\nFunction ले error throw गर्छ।\n\nहामी यसलाई handle गर्न सक्छौं:\n\n```javascript\ntry {\n  register(15);\n} catch (err) {\n  console.log(err.message);\n}\n```\n\nOutput:\n\n```text\nUser must be 18 or older\n```\n\nत्यसैले `throw` को मुख्य अर्थ:\n\n> <b>\"केही गलत छ। रोक र यो error लाई handle गर्न सक्नेसम्म पठाऊ।\"</b>\n\n---\n\n## 6. Custom Errors\n\nवास्तविक application मा, तपाईंलाई फरक-फरक प्रकारका error चाहिन सक्छ।\n\nउदाहरणका लागि:\n\n• Validation error\n• Authentication error\n• Payment error\n• Database error\n\nहामी आफ्नै error class बनाउन सक्छौं।\n\n```javascript\nclass ValidationError extends Error {\n  constructor(message) {\n    super(message);\n    this.name = \"ValidationError\";\n  }\n}\n```\n\nअब हामी यो प्रयोग गर्न सक्छौं:\n\n```javascript\nthrow new ValidationError(\"Email is required\");\n```\n\nयसले के गलत भयो भन्ने बुझ्न सजिलो बनाउँछ।\n\n---\n\n## 7. थप जानकारी थप्नु\n\nCustom error मा अतिरिक्त जानकारी राख्न सकिन्छ।\n\nउदाहरणका लागि:\n\n```javascript\nclass ValidationError extends Error {\n  constructor(message, field) {\n    super(message);\n    this.name = \"ValidationError\";\n    this.field = field;\n  }\n}\n```\n\nअब:\n\n```javascript\nthrow new ValidationError(\n  \"Email is required\",\n  \"email\"\n);\n```\n\nहामी यो पहुँच गर्न सक्छौं:\n\n```javascript\nerr.message\nerr.field\n```\n\nत्यसैले error हामीलाई यो बताउन सक्छ:\n\n```text\nType: ValidationError\nField: email\nMessage: Email is required\n```\n\n---\n\n## 8. Error को प्रकार जाँच्नु\n\nहामीले कुन प्रकारको error पायौं भन्ने जाँच्न `instanceof` प्रयोग गर्न सक्छौं।\n\n```javascript\ntry {\n  // something\n} catch (err) {\n  if (err instanceof ValidationError) {\n    console.log(\"Invalid input\");\n  }\n}\n```\n\nयसले हामीलाई फरक error लाई फरक तरिकाले handle गर्न दिन्छ।\n\nउदाहरणका लागि:\n\n```javascript\ntry {\n  await createUser();\n} catch (err) {\n  if (err instanceof ValidationError) {\n    console.log(\"Please check your input\");\n  } else {\n    throw err;\n  }\n}\n```\n\nमहत्वपूर्ण भाग यो हो:\n\n```javascript\nthrow err;\n```\n\nError कसरी handle गर्ने थाहा नभए, <b>चुपचाप बेवास्ता गर्नुको साटो माथि फर्काउनुहोस्</b>।\n\n---\n\n## 9. Error लाई कहिल्यै चुपचाप बेवास्ता नगर्नुहोस्\n\nयो नराम्रो हो:\n\n```javascript\ntry {\n  await saveUser();\n} catch (err) {\n  // Nothing\n}\n```\n\nअब program fail भयो, तर किन भयो कसैलाई थाहा छैन।\n\nसामान्यतया यो राम्रो हुन्छ:\n\n```javascript\ncatch (err) {\n  console.error(err);\n  throw err;\n}\n```\n\nवा के गर्ने थाहा छ भने राम्ररी handle गर्नुहोस्।",
        jp: "<b>エラー</b>とは、プログラムの実行中に何かがうまくいかないことです。\n\nたとえば:\n\n```javascript\nconst user = null;\n\nconsole.log(user.name);\n```\n\n`null` は<b>読み取る対象のオブジェクトがない</b>という意味なので、これはエラーになります。\n\nエラーはさまざまな理由で起こります:\n\n• ユーザーが不正なデータを入力する\n• データベースへのリクエストが失敗する\n• APIが利用できない\n• ネットワーク接続が失敗する\n• ファイルが見つからない\n• コードにバグがある\n\nすべてのエラーを防ぐことはできません。\n\n目標は<b>アプリケーション全体をクラッシュさせず、エラーを適切に処理すること</b>です。\n\n---\n\n## 1. `try...catch`\n\nJavaScriptはエラーを処理するために `try...catch` を用意しています。\n\n```javascript\ntry {\n  // Code that might fail\n} catch (err) {\n  // Handle the error\n}\n```\n\nたとえば:\n\n```javascript\ntry {\n  const user = null;\n  console.log(user.name);\n} catch (err) {\n  console.log(\"Something went wrong\");\n}\n```\n\n`try` の中のコードがエラーをスローすると、JavaScriptはすぐに `catch` へ移ります。\n\n```text\ntry\n ↓\nError happens\n ↓\ncatch\n ↓\nHandle the error\n```\n\nこれでエラーがプログラムのその部分をクラッシュさせるのを防げます。\n\n---\n\n## 2. `Error` オブジェクト\n\n`catch` ブロックはエラーオブジェクトを渡してくれます。\n\n```javascript\ncatch (err) {\n  console.log(err);\n}\n```\n\nエラーには通常、役に立つ情報が入っています。\n\n### `err.name`\n\nエラーの種類を教えてくれます。\n\n```javascript\nconsole.log(err.name);\n```\n\n例:\n\n```text\nTypeError\n```\n\n### `err.message`\n\n何がうまくいかなかったかを教えてくれます。\n\n```javascript\nconsole.log(err.message);\n```\n\n例:\n\n```text\nCannot read properties of null\n```\n\n### `err.stack`\n\nエラーがどこで起きたかを示します。\n\n```javascript\nconsole.log(err.stack);\n```\n\nこれは<b>デバッグ</b>（問題の原因を探すこと）のときにとても役立ちます。\n\n---\n\n## 3. `finally`\n\n<b>何が起きても</b>実行したいコードがあるときもあります。\n\nそのためにあるのが `finally` です。\n\n```javascript\ntry {\n  // Try something\n} catch (err) {\n  // Handle error\n} finally {\n  // Always runs\n}\n```\n\nたとえば、データベース接続を開くと想像してください:\n\n```text\nOpen database\n     ↓\nDo some work\n     ↓\nSuccess or Error\n     ↓\nClose database\n```\n\n処理が成功しても失敗しても、データベース接続は閉じたいはずです。\n\nそこで次のように書けます:\n\n```javascript\ntry {\n  await database.query();\n} catch (err) {\n  console.log(err.message);\n} finally {\n  database.close();\n}\n```\n\n`finally` が実行されるのは:\n\n• 成功したあと\n• エラーが起きたあと\n• `return` が使われた場合でも\n\nだからこそ<b>クリーンアップ</b>（何かを閉じたり解放したりすること）に役立ちます。\n\n---\n\n## 4. よくあるJavaScriptのエラー\n\nJavaScriptには組み込みのエラー型がいくつかあります。\n\n### `TypeError`\n\nたいていは値の使い方が間違っていることを意味します。\n\n```javascript\nconst user = null;\n\nuser.name;\n```\n\n結果:\n\n```text\nTypeError\n```\n\n---\n\n### `ReferenceError`\n\n存在しない変数を使おうとしたときに起きます。\n\n```javascript\nconsole.log(username);\n```\n\n`username` が一度も作られていなければ:\n\n```text\nReferenceError\n```\n\n---\n\n### `SyntaxError`\n\nJavaScriptのコードの書き方が正しくないときに起きます。\n\n```javascript\nconst user =\n```\n\nこのコードは正しいJavaScriptではありません。\n\n```text\nSyntaxError\n```\n\n---\n\n### `RangeError`\n\n値が許された範囲の外にあるときに起きます。\n\n```javascript\nconst numbers = new Array(-1);\n```\n\nこれは `RangeError` になります。\n\n---\n\n## 5. `throw`\n\n`throw` を使って自分でエラーを作ることもできます。\n\nたとえば、ユーザーは18歳以上でなければならないとしましょう。\n\n```javascript\nfunction register(age) {\n  if (age < 18) {\n    throw new Error(\"User must be 18 or older\");\n  }\n\n  console.log(\"Registration successful\");\n}\n```\n\nもし:\n\n```javascript\nregister(15);\n```\n\nこの関数はエラーをスローします。\n\nこう処理できます:\n\n```javascript\ntry {\n  register(15);\n} catch (err) {\n  console.log(err.message);\n}\n```\n\n出力:\n\n```text\nUser must be 18 or older\n```\n\nつまり `throw` は基本的にこういう意味です:\n\n> <b>「何かがおかしい。処理を止めて、このエラーを扱える相手に渡す。」</b>\n\n---\n\n## 6. カスタムエラー\n\n実際のアプリケーションでは、種類の違うエラーが欲しくなります。\n\nたとえば:\n\n• バリデーションエラー\n• 認証エラー\n• 決済エラー\n• データベースエラー\n\n自分のエラークラスを作れます。\n\n```javascript\nclass ValidationError extends Error {\n  constructor(message) {\n    super(message);\n    this.name = \"ValidationError\";\n  }\n}\n```\n\nこれで次のように使えます:\n\n```javascript\nthrow new ValidationError(\"Email is required\");\n```\n\n何がうまくいかなかったのかが分かりやすくなります。\n\n---\n\n## 7. 追加情報を持たせる\n\nカスタムエラーには追加の情報を持たせられます。\n\nたとえば:\n\n```javascript\nclass ValidationError extends Error {\n  constructor(message, field) {\n    super(message);\n    this.name = \"ValidationError\";\n    this.field = field;\n  }\n}\n```\n\nそして:\n\n```javascript\nthrow new ValidationError(\n  \"Email is required\",\n  \"email\"\n);\n```\n\n次のようにアクセスできます:\n\n```javascript\nerr.message\nerr.field\n```\n\nエラー自身がこう教えてくれます:\n\n```text\nType: ValidationError\nField: email\nMessage: Email is required\n```\n\n---\n\n## 8. エラーの種類を調べる\n\n`instanceof` を使って、受け取ったエラーの種類を調べられます。\n\n```javascript\ntry {\n  // something\n} catch (err) {\n  if (err instanceof ValidationError) {\n    console.log(\"Invalid input\");\n  }\n}\n```\n\nこれでエラーごとに違う処理ができます。\n\nたとえば:\n\n```javascript\ntry {\n  await createUser();\n} catch (err) {\n  if (err instanceof ValidationError) {\n    console.log(\"Please check your input\");\n  } else {\n    throw err;\n  }\n}\n```\n\n大事な部分はここです:\n\n```javascript\nthrow err;\n```\n\n処理の仕方が分からないエラーは、<b>黙って無視せず上に投げ返す</b>ことです。\n\n---\n\n## 9. エラーを黙って無視しない\n\nこれは良くありません:\n\n```javascript\ntry {\n  await saveUser();\n} catch (err) {\n  // Nothing\n}\n```\n\nプログラムは失敗したのに、その理由を誰も知りません。\n\n通常はこうする方が良いです:\n\n```javascript\ncatch (err) {\n  console.error(err);\n  throw err;\n}\n```\n\nあるいは、どうすべきか分かっているなら適切に処理します。",
      },
      diagram: `try
 ↓
Run risky code
 ↓
Did it fail?
 ↙          ↘
No           Yes
↓             ↓
Continue     catch
               ↓
          Handle error
               ↓
            finally
               ↓
          Cleanup`,
      codeExample: {
        title: { en: "Robust error handling with custom error classes", np: "Robust error handling, custom error classes", jp: "カスタムエラークラスによる堅牢なエラー処理" },
        code: `// ── Basic try/catch — recovering instead of crashing ─────────────────
function parseConfig(jsonString) {
  try {
    return JSON.parse(jsonString);       // might throw SyntaxError
  } catch (err) {
    console.error("Invalid JSON:", err.message);
    return null;
  }
}
parseConfig("invalid json");   // logs "Invalid JSON: ..." instead of crashing

// ── The Error object ─────────────────────────────────────────────────
try {
  null.name;   // TypeError: Cannot read properties of null
} catch (err) {
  err.name;     // "TypeError"
  err.message;  // "Cannot read properties of null (reading 'name')"
  err.stack;    // full stack trace — where it happened
}

// ── finally always runs — even after a 'return' inside try ───────────
function test() {
  try {
    return "Success";
  } finally {
    console.log("Finally runs");   // logs BEFORE the function actually returns
  }
}
test();   // logs "Finally runs", then returns "Success"

// ── Throwing your own errors on purpose ───────────────────────────────
function withdraw(amount) {
  if (amount > 1000) throw new Error("Withdrawal limit exceeded");
  return amount;
}

// ── Custom error classes — extend Error for extra context ─────────────
class ValidationError extends Error {
  constructor(message, field) {
    super(message);            // sets this.message and this.stack correctly
    this.name = "ValidationError";
    this.field = field;        // extra context
  }
}
class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = 401;
  }
}

function login(password) {
  if (password !== "123456") throw new AuthenticationError("Invalid password");
}

// ── Catching specific error types with instanceof ─────────────────────
try {
  login("wrong-password");
} catch (err) {
  if (err instanceof AuthenticationError) {
    console.log({ statusCode: err.statusCode, message: err.message });
    // { statusCode: 401, message: "Invalid password" }
  } else {
    throw err;   // unrecognised error — never swallow it silently
  }
}`,
      },
      keyTakeaways: [
        { en: "`try` → \\\"Try this code.\\\" Put the risky part inside it so a failure does not crash the whole application.", np: "`try` → \\\"यो code try गर।\\\" जोखिमपूर्ण भाग यसभित्र राख्नुहोस् ताकि failure ले पूरै application crash नगरोस्।", jp: "`try` → \\\"このコードを試す。\\\" 失敗がアプリ全体をクラッシュさせないよう、危険な部分をこの中に置く。" },
        { en: "`catch` → \\\"Something went wrong. Handle it.\\\" The error object carries `err.name` (the type), `err.message` (what happened) and `err.stack` (where it happened).", np: "`catch` → \\\"केही गलत भयो। यसलाई handle गर।\\\" Error object मा `err.name` (प्रकार), `err.message` (के भयो) र `err.stack` (कहाँ भयो) हुन्छ।", jp: "`catch` → \\\"何かがおかしい。処理する。\\\" エラーオブジェクトは `err.name`（種類）、`err.message`（何が起きたか）、`err.stack`（どこで起きたか）を持つ。" },
        { en: "`finally` → \\\"Do this no matter what.\\\" It runs after success, after an error, and even after a `return` — which makes it the place for cleanup like closing a database connection.", np: "`finally` → \\\"के भए पनि यो गर।\\\" यो सफल भएपछि, error आएपछि, र `return` पछि पनि चल्छ — त्यसैले database connection बन्द गर्ने जस्ता cleanup का लागि यही ठाउँ हो।", jp: "`finally` → \\\"何があってもこれを行う。\\\" 成功後・エラー後・`return` の後でも実行されるので、データベース接続を閉じるようなクリーンアップの置き場所になる。" },
        { en: "`throw` → \\\"I want to create/report an error.\\\" Use it when a business rule is broken, even if the code would technically keep running.", np: "`throw` → \\\"मैले error बनाउन/रिपोर्ट गर्न चाहन्छु।\\\" Business rule भाँचिँदा प्रयोग गर्नुहोस्, code technically चलिरहन सक्ने भए पनि।", jp: "`throw` → \\\"エラーを作って報告したい。\\\" コードが技術的には動き続ける場合でも、業務ルールが破られたときに使う。" },
        { en: "`instanceof` → \\\"What type of error is this?\\\" It lets you handle a `ValidationError` one way and rethrow everything else with `throw err`.", np: "`instanceof` → \\\"यो कुन प्रकारको error हो?\\\" यसले `ValidationError` लाई एक तरिकाले handle गर्न र बाँकी सबै लाई `throw err` ले rethrow गर्न दिन्छ।", jp: "`instanceof` → \\\"これはどの種類のエラーか?\\\" `ValidationError` は個別に処理し、それ以外は `throw err` で再スローできる。" },
        { en: "<b>Custom error</b> → \\\"Create an error specific to my application.\\\" `class ValidationError extends Error` can also carry extra context such as the `field` that failed.", np: "<b>Custom error</b> → \\\"मेरो application का लागि विशेष error बनाउ।\\\" `class ValidationError extends Error` ले fail भएको `field` जस्तो अतिरिक्त context पनि बोक्न सक्छ।", jp: "<b>カスタムエラー</b> → \\\"自分のアプリ専用のエラーを作る。\\\" `class ValidationError extends Error` は失敗した `field` などの追加情報も持てる。" },
        { en: "Never swallow an error with an empty `catch` — log it and rethrow, or handle it properly. A silent failure leaves nobody knowing why the program broke.", np: "खाली `catch` ले error कहिल्यै निल्नु हुँदैन — log गर्नुहोस् र rethrow गर्नुहोस्, वा राम्ररी handle गर्नुहोस्। चुपचापको failure ले program किन बिग्रियो कसैलाई थाहा हुँदैन।", jp: "空の `catch` でエラーを握りつぶさない — ログを出して再スローするか、きちんと処理する。黙って失敗すると、なぜ壊れたのか誰にも分からない。" },
        { en: "The goal of error handling is not to hide errors. It is to handle expected problems properly, give useful information when debugging, and let unexpected errors continue to the right place instead of silently disappearing.", np: "Error handling को लक्ष्य error लुकाउनु होइन। लक्ष्य अपेक्षित समस्या राम्ररी handle गर्नु, debugging मा उपयोगी जानकारी दिनु, र अनपेक्षित error लाई चुपचाप हराउनुको साटो ठीक ठाउँमा पुग्न दिनु हो।", jp: "エラー処理の目的はエラーを隠すことではない。想定される問題を適切に処理し、デバッグに役立つ情報を残し、想定外のエラーは黙って消さずに適切な場所まで届けることだ。" },
      ],
      commonMistakes: [
        { en: "Leaving a `catch` block empty, which swallows the error entirely — you never learn what failed, where it failed, or why.", np: "`catch` block खाली छोड्नु, जसले error लाई पूर्ण रूपमा swallow गर्छ — के, कहाँ, र किन fail भयो भन्ने कहिल्यै थाहा हुँदैन।", jp: "catchブロックを空のままにすること。エラーを完全に握りつぶし、何が・どこで・なぜ失敗したか分からなくなる。" },
        { en: "Catching every error broadly and just returning `null` or ignoring it, instead of re-throwing errors you don't specifically handle — this hides real problems from the caller.", np: "हरेक error लाई broadly catch गरेर केवल `null` फर्काउनु वा ignore गर्नु, specifically handle नगरेका errors re-throw गर्नुको सट्टा — यसले real problems caller बाट लुकाउँछ।", jp: "特定して処理していないエラーを再スローする代わりに、すべてのエラーを広くキャッチして単にnullを返すか無視すること。これは呼び出し元から本当の問題を隠す。" },
        { en: "Using `error.message` string comparisons for logic (`if (error.message === \"User missing\")`) instead of `instanceof` — messages can change wording and silently break the check.", np: "Logic का लागि `error.message` string comparison प्रयोग गर्नु (`if (error.message === \"User missing\")`) `instanceof` को सट्टा — messages को wording बदलिन सक्छ र check silently बिग्रन्छ।", jp: "instanceofの代わりにerror.messageの文字列比較をロジックに使うこと（`if (error.message === \"User missing\")`）。メッセージの文言が変わるとチェックが黙って壊れる。" },
        { en: "Forgetting `finally` cleanup (e.g. closing a database connection) and only putting that logic in `try`, so it never runs when an error happens partway through.", np: "`finally` cleanup बिर्सनु (जस्तै database connection close गर्नु) र त्यो logic `try` मा मात्र राख्नु, जसले error हुँदा त्यो कहिल्यै चल्दैन।", jp: "finallyでのクリーンアップ（データベース接続のクローズなど）を忘れ、そのロジックをtryにのみ置くこと。途中でエラーが起きると実行されない。" },
      ],
      quiz: [
        {
          question: { en: "In `try { return riskyCall(); } finally { console.log(\"done\"); }`, if `riskyCall()` succeeds and returns, does the finally block still run?", np: "`try { return riskyCall(); } finally { console.log(\"done\"); }` मा `riskyCall()` success भई return गरे पनि finally block चल्छ?", jp: "`try { return riskyCall(); } finally { console.log(\"done\"); }`でriskyCall()が成功してreturnしてもfinallyブロックは実行される？" },
          options: [
            { en: "No — finally is skipped once a return happens", np: "होइन — return भएपछि finally skip हुन्छ", jp: "いいえ — returnが発生するとfinallyはスキップされる" },
            { en: "Yes — finally always runs, even after a return inside try", np: "हो — finally सधैं चल्छ, try भित्र return भए पनि", jp: "はい — finallyは常に実行される、try内のreturnの後でも" },
          ],
          correctIndex: 1,
          explanation: { en: "finally is guaranteed to execute regardless of how the try/catch block exits — normal completion, an error, or a return statement.", np: "Try/catch block कसरी बाहिर निस्किए पनि finally execute हुने guaranteed छ — normal completion, error, वा return।", jp: "finallyはtry/catchブロックがどのように終了しても実行が保証される — 正常終了、エラー、return文のいずれでも。" },
        },
        {
          question: { en: "Why should you call `super(message)` in a custom error class's constructor?", np: "Custom error class को constructor मा `super(message)` किन call गर्नुपर्छ?", jp: "カスタムエラークラスのコンストラクタで`super(message)`を呼ぶべき理由は？" },
          options: [
            { en: "It sets `this.message` correctly, using Error's own constructor logic", np: "यसले Error को आफ्नै constructor logic प्रयोग गरी `this.message` सहि सेट गर्छ", jp: "Error自身のコンストラクタロジックを使ってthis.messageを正しく設定する" },
            { en: "It's optional boilerplate with no real effect", np: "यो optional boilerplate हो, real effect छैन", jp: "実際の効果のないオプションのボイラープレート" },
          ],
          correctIndex: 0,
          explanation: { en: "Error's constructor is what wires up .message and .stack; skipping super() leaves those unset or broken.", np: "Error को constructor ले नै .message र .stack सेटअप गर्छ; super() skip गर्दा ती सेट नहुन सक्छ।", jp: "Errorのコンストラクタが.messageと.stackを設定する。super()をスキップするとこれらが未設定になる。" },
        },
        {
          question: { en: "What should you do with an error type you don't specifically recognise inside a `catch` block?", np: "`catch` block भित्र नचिनेको error type सँग के गर्नुपर्छ?", jp: "catchブロック内で特定して認識していないエラータイプはどうするべき？" },
          options: [
            { en: "Re-throw it (`throw err`) so it isn't silently swallowed", np: "यसलाई re-throw गर्नुहोस् (`throw err`) ताकि silently swallow नहोस्", jp: "黙って握りつぶされないように再スロー（`throw err`）する" },
            { en: "Log it and continue as if nothing happened", np: "Log गर्नुहोस् र केही नभएको जस्तो जारी राख्नुहोस्", jp: "ログに記録して何もなかったように続行する" },
          ],
          correctIndex: 0,
          explanation: { en: "Swallowing unrecognised errors hides real bugs; rethrowing keeps them visible to whoever calls this code.", np: "नचिनेको error swallow गर्दा real bugs लुक्छन्; rethrow गर्दा यो code call गर्ने लाई देखिन्छ।", jp: "認識しないエラーを握りつぶすと本当のバグが隠れる。再スローすればこのコードを呼ぶ側に見える。" },
        },
      ],
    },
    {
      id: "commonjs-modules",
      title: { en: "CommonJS Modules (require / module.exports)", np: "CommonJS Modules (require / module.exports)", jp: "CommonJSモジュール（require/module.exports）" },
      durationMinutes: 9,
      explanation: {
        en: "When an application becomes large, putting everything into one file becomes difficult to manage.\n\nFor example:\n\n```text\napp.js\n ├── Users\n ├── Payments\n ├── Database\n ├── Email\n └── Authentication\n```\n\nInstead, we split the application into smaller files.\n\nEach file can handle <b>one main job</b>.\n\nThis is called a <b>module</b>.\n\n---\n\n## 1. What is a Module?\n\nA module is simply a separate file containing related code.\n\nFor example:\n\n```text\nproject/\n├── app.js\n├── math.js\n└── user.js\n```\n\n`math.js` can contain math-related functions.\n\n`user.js` can contain user-related functions.\n\n`app.js` can use them.\n\nThis makes the application easier to understand and maintain.\n\n---\n\n## 2. CommonJS\n\n<b>CommonJS</b> is a module system commonly used in Node.js.\n\nIt uses two main things:\n\n```text\nmodule.exports → Share code\n\nrequire()      → Get code from another file\n```\n\n---\n\n## 3. `module.exports`\n\nSuppose we have a file called `math.js`.\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nmodule.exports.add = add;\n```\n\nWe are saying:\n\n> \"Make the `add` function available to other files.\"\n\n---\n\n## 4. Using `require()`\n\nNow in `app.js`:\n\n```javascript\nconst math = require(\"./math\");\n\nconsole.log(math.add(2, 3));\n```\n\nOutput:\n\n```text\n5\n```\n\nThe flow is:\n\n```text\nmath.js\n   ↓\nmodule.exports\n   ↓\nrequire(\"./math\")\n   ↓\napp.js\n```\n\n---\n\n## 5. Exporting Multiple Things\n\nA module can export multiple functions.\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nfunction subtract(a, b) {\n  return a - b;\n}\n\nmodule.exports.add = add;\nmodule.exports.subtract = subtract;\n```\n\nThen:\n\n```javascript\nconst math = require(\"./math\");\n\nmath.add(10, 5);\nmath.subtract(10, 5);\n```\n\nWe can also write:\n\n```javascript\nmodule.exports = {\n  add,\n  subtract\n};\n```\n\nBoth approaches export an object containing the functions.\n\n---\n\n## 6. Exporting One Thing\n\nSometimes a file only needs to export one function.\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nmodule.exports = add;\n```\n\nThen:\n\n```javascript\nconst add = require(\"./math\");\n\nconsole.log(add(2, 3));\n```\n\nHere, `require()` directly gives us the function.\n\n---\n\n## 7. `require()` is Synchronous\n\n<b>Synchronous</b> means:\n\n> The code waits until the operation finishes before continuing.\n\nWhen Node.js does:\n\n```javascript\nconst math = require(\"./math\");\n```\n\nNode.js loads the file before moving to the next line.\n\nThink of it like:\n\n```text\nrequire(\"./math\")\n       ↓\nLoad file\n       ↓\nRun/prepare module\n       ↓\nContinue\n```\n\nThis is different from many asynchronous operations in Node.js.\n\n---\n\n## 8. Modules Are Cached\n\nThis is one of the most important things to understand.\n\nWhen Node.js loads a module for the first time, it <b>caches</b> (saves) the result.\n\nFor example:\n\n```javascript\n// math.js\n\nconsole.log(\"Math module loaded\");\n\nmodule.exports = {\n  add: (a, b) => a + b\n};\n```\n\nNow:\n\n```javascript\nconst math1 = require(\"./math\");\nconst math2 = require(\"./math\");\n```\n\nYou might expect the file to run twice.\n\nBut it doesn't.\n\nOutput:\n\n```text\nMath module loaded\n```\n\nOnly once.\n\nBoth variables get the same cached module:\n\n```text\nrequire(\"./math\") ──┐\n                    ├──→ Same cached module\nrequire(\"./math\") ──┘\n```\n\nSo:\n\n```javascript\nmath1 === math2\n```\n\nis:\n\n```text\ntrue\n```\n\n---\n\n## 9. Why Module Caching Matters\n\nBecause the module is cached, top-level code in that module normally runs only once.\n\nFor example:\n\n```javascript\n// counter.js\n\nlet count = 0;\n\ncount++;\n\nmodule.exports = count;\n```\n\nIf another file does:\n\n```javascript\nconst a = require(\"./counter\");\nconst b = require(\"./counter\");\n```\n\nBoth use the cached result.\n\nThe module isn't created again from scratch.\n\nThis is useful for things like:\n\n• Database connections\n• Configuration\n• Shared state\n• Expensive setup\n\n---\n\n## 10. `require()` Can Be Called Anywhere\n\n`require()` is a normal function, so you can call it inside a condition or function.\n\nFor example:\n\n```javascript\nif (process.env.NODE_ENV === \"development\") {\n  const logger = require(\"./logger\");\n}\n```\n\nOr:\n\n```javascript\nfunction getDatabase() {\n  return require(\"./database\");\n}\n```\n\nThis makes `require()` flexible.\n\nWith ES Modules, `import` works differently and follows stricter rules.",
        np: "Application ठूलो हुँदै जाँदा, सबै चीज एउटै file मा राख्नु व्यवस्थापन गर्न कठिन हुन्छ।\n\nउदाहरणका लागि:\n\n```text\napp.js\n ├── Users\n ├── Payments\n ├── Database\n ├── Email\n └── Authentication\n```\n\nबरु, हामी application लाई साना file मा विभाजन गर्छौं।\n\nहरेक file ले <b>एउटा मुख्य काम</b> सम्हाल्न सक्छ।\n\nयसलाई <b>module</b> भनिन्छ।\n\n---\n\n## 1. Module के हो?\n\nModule भनेको सम्बन्धित code राखिएको छुट्टै file मात्र हो।\n\nउदाहरणका लागि:\n\n```text\nproject/\n├── app.js\n├── math.js\n└── user.js\n```\n\n`math.js` मा math सम्बन्धी functions हुन सक्छन्।\n\n`user.js` मा user सम्बन्धी functions हुन सक्छन्।\n\n`app.js` ले तिनलाई प्रयोग गर्न सक्छ।\n\nयसले application बुझ्न र maintain गर्न सजिलो बनाउँछ।\n\n---\n\n## 2. CommonJS\n\n<b>CommonJS</b> Node.js मा सामान्य रूपमा प्रयोग हुने module system हो।\n\nयसले दुई मुख्य चीज प्रयोग गर्छ:\n\n```text\nmodule.exports → Share code\n\nrequire()      → Get code from another file\n```\n\n---\n\n## 3. `module.exports`\n\nमानौं हामीसँग `math.js` नामको file छ।\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nmodule.exports.add = add;\n```\n\nहामी यो भन्दै छौं:\n\n> \"`add` function लाई अरू file हरूका लागि उपलब्ध बनाऊ।\"\n\n---\n\n## 4. `require()` को प्रयोग\n\nअब `app.js` मा:\n\n```javascript\nconst math = require(\"./math\");\n\nconsole.log(math.add(2, 3));\n```\n\nOutput:\n\n```text\n5\n```\n\nFlow यो हो:\n\n```text\nmath.js\n   ↓\nmodule.exports\n   ↓\nrequire(\"./math\")\n   ↓\napp.js\n```\n\n---\n\n## 5. धेरै चीज Export गर्नु\n\nएउटा module ले धेरै function export गर्न सक्छ।\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nfunction subtract(a, b) {\n  return a - b;\n}\n\nmodule.exports.add = add;\nmodule.exports.subtract = subtract;\n```\n\nत्यसपछि:\n\n```javascript\nconst math = require(\"./math\");\n\nmath.add(10, 5);\nmath.subtract(10, 5);\n```\n\nहामी यसो पनि लेख्न सक्छौं:\n\n```javascript\nmodule.exports = {\n  add,\n  subtract\n};\n```\n\nदुबै तरिकाले function राखिएको object export हुन्छ।\n\n---\n\n## 6. एउटा चीज मात्र Export गर्नु\n\nकहिलेकाहीँ file ले एउटा function मात्र export गर्नुपर्ने हुन्छ।\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nmodule.exports = add;\n```\n\nत्यसपछि:\n\n```javascript\nconst add = require(\"./math\");\n\nconsole.log(add(2, 3));\n```\n\nयहाँ, `require()` ले हामीलाई सिधै function दिन्छ।\n\n---\n\n## 7. `require()` Synchronous छ\n\n<b>Synchronous</b> को अर्थ:\n\n> Operation सकिने बेलासम्म code कुर्छ, त्यसपछि मात्र अगाडि बढ्छ।\n\nNode.js ले यो गर्दा:\n\n```javascript\nconst math = require(\"./math\");\n```\n\nNode.js अर्को line मा जानुअघि file load गर्छ।\n\nयसलाई यसरी सोच्नुहोस्:\n\n```text\nrequire(\"./math\")\n       ↓\nLoad file\n       ↓\nRun/prepare module\n       ↓\nContinue\n```\n\nयो Node.js का धेरै asynchronous operations भन्दा फरक छ।\n\n---\n\n## 8. Modules Cache हुन्छन्\n\nयो बुझ्नुपर्ने सबैभन्दा महत्वपूर्ण चीजमध्ये एक हो।\n\nNode.js ले module पहिलो पटक load गर्दा, नतिजा <b>cache</b> (सेभ) गर्छ।\n\nउदाहरणका लागि:\n\n```javascript\n// math.js\n\nconsole.log(\"Math module loaded\");\n\nmodule.exports = {\n  add: (a, b) => a + b\n};\n```\n\nअब:\n\n```javascript\nconst math1 = require(\"./math\");\nconst math2 = require(\"./math\");\n```\n\nतपाईं file दुई पटक चल्छ भनी सोच्न सक्नुहुन्छ।\n\nतर चल्दैन।\n\nOutput:\n\n```text\nMath module loaded\n```\n\nएक पटक मात्र।\n\nदुबै variable ले उही cached module पाउँछन्:\n\n```text\nrequire(\"./math\") ──┐\n                    ├──→ Same cached module\nrequire(\"./math\") ──┘\n```\n\nत्यसैले:\n\n```javascript\nmath1 === math2\n```\n\nयो हुन्छ:\n\n```text\ntrue\n```\n\n---\n\n## 9. Module Caching किन महत्वपूर्ण छ\n\nModule cache हुने हुनाले, त्यो module को top-level code सामान्यतया एक पटक मात्र चल्छ।\n\nउदाहरणका लागि:\n\n```javascript\n// counter.js\n\nlet count = 0;\n\ncount++;\n\nmodule.exports = count;\n```\n\nयदि अर्को file ले यो गर्छ:\n\n```javascript\nconst a = require(\"./counter\");\nconst b = require(\"./counter\");\n```\n\nदुबैले cached नतिजा प्रयोग गर्छन्।\n\nModule फेरि सुरुबाट बनाइँदैन।\n\nयो यस्ता चीजका लागि उपयोगी छ:\n\n• Database connections\n• Configuration\n• Shared state\n• महँगो setup\n\n---\n\n## 10. `require()` कहीं पनि Call गर्न सकिन्छ\n\n`require()` सामान्य function हो, त्यसैले तपाईं यसलाई condition वा function भित्र call गर्न सक्नुहुन्छ।\n\nउदाहरणका लागि:\n\n```javascript\nif (process.env.NODE_ENV === \"development\") {\n  const logger = require(\"./logger\");\n}\n```\n\nवा:\n\n```javascript\nfunction getDatabase() {\n  return require(\"./database\");\n}\n```\n\nयसले `require()` लाई flexible बनाउँछ।\n\nES Modules मा, `import` फरक तरिकाले काम गर्छ र कडा नियम पालना गर्छ।",
        jp: "アプリケーションが大きくなると、すべてを1つのファイルに入れておくのは管理しづらくなります。\n\nたとえば:\n\n```text\napp.js\n ├── Users\n ├── Payments\n ├── Database\n ├── Email\n └── Authentication\n```\n\n代わりに、アプリケーションを小さなファイルに分割します。\n\n各ファイルは<b>1つの主な役割</b>を担えます。\n\nこれを<b>モジュール</b>と呼びます。\n\n---\n\n## 1. モジュールとは?\n\nモジュールとは、関連するコードをまとめた別のファイルにすぎません。\n\nたとえば:\n\n```text\nproject/\n├── app.js\n├── math.js\n└── user.js\n```\n\n`math.js` には数学関連の関数を入れられます。\n\n`user.js` にはユーザー関連の関数を入れられます。\n\n`app.js` はそれらを使えます。\n\nこれでアプリケーションは理解しやすく、保守しやすくなります。\n\n---\n\n## 2. CommonJS\n\n<b>CommonJS</b> はNode.jsで広く使われているモジュールシステムです。\n\n主に2つのものを使います:\n\n```text\nmodule.exports → Share code\n\nrequire()      → Get code from another file\n```\n\n---\n\n## 3. `module.exports`\n\n`math.js` というファイルがあるとします。\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nmodule.exports.add = add;\n```\n\nこれはこう言っているのと同じです:\n\n> 「`add` 関数を他のファイルから使えるようにする。」\n\n---\n\n## 4. `require()` を使う\n\n次に `app.js` で:\n\n```javascript\nconst math = require(\"./math\");\n\nconsole.log(math.add(2, 3));\n```\n\n出力:\n\n```text\n5\n```\n\n流れはこうです:\n\n```text\nmath.js\n   ↓\nmodule.exports\n   ↓\nrequire(\"./math\")\n   ↓\napp.js\n```\n\n---\n\n## 5. 複数のものをエクスポートする\n\n1つのモジュールから複数の関数をエクスポートできます。\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nfunction subtract(a, b) {\n  return a - b;\n}\n\nmodule.exports.add = add;\nmodule.exports.subtract = subtract;\n```\n\nそして:\n\n```javascript\nconst math = require(\"./math\");\n\nmath.add(10, 5);\nmath.subtract(10, 5);\n```\n\nこうも書けます:\n\n```javascript\nmodule.exports = {\n  add,\n  subtract\n};\n```\n\nどちらの書き方でも、関数を含むオブジェクトがエクスポートされます。\n\n---\n\n## 6. 1つだけエクスポートする\n\nファイルが関数を1つだけエクスポートしたい場合もあります。\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nmodule.exports = add;\n```\n\nそして:\n\n```javascript\nconst add = require(\"./math\");\n\nconsole.log(add(2, 3));\n```\n\nこの場合、`require()` は関数そのものを返します。\n\n---\n\n## 7. `require()` は同期的\n\n<b>同期的（Synchronous）</b>とは:\n\n> 処理が終わるまでコードが待ってから先に進む、という意味です。\n\nNode.jsが次を実行するとき:\n\n```javascript\nconst math = require(\"./math\");\n```\n\nNode.jsは次の行に進む前にファイルを読み込みます。\n\nこうイメージしてください:\n\n```text\nrequire(\"./math\")\n       ↓\nLoad file\n       ↓\nRun/prepare module\n       ↓\nContinue\n```\n\nこれはNode.jsの多くの非同期処理とは異なります。\n\n---\n\n## 8. モジュールはキャッシュされる\n\nこれは理解すべき最も重要なことの1つです。\n\nNode.jsがモジュールを初めて読み込むとき、その結果を<b>キャッシュ</b>（保存）します。\n\nたとえば:\n\n```javascript\n// math.js\n\nconsole.log(\"Math module loaded\");\n\nmodule.exports = {\n  add: (a, b) => a + b\n};\n```\n\nそして:\n\n```javascript\nconst math1 = require(\"./math\");\nconst math2 = require(\"./math\");\n```\n\nファイルが2回実行されると思うかもしれません。\n\nしかし、そうはなりません。\n\n出力:\n\n```text\nMath module loaded\n```\n\n1回だけです。\n\nどちらの変数も同じキャッシュされたモジュールを受け取ります:\n\n```text\nrequire(\"./math\") ──┐\n                    ├──→ Same cached module\nrequire(\"./math\") ──┘\n```\n\nつまり:\n\n```javascript\nmath1 === math2\n```\n\nは:\n\n```text\ntrue\n```\n\n---\n\n## 9. モジュールのキャッシュが重要な理由\n\nモジュールがキャッシュされるので、そのモジュールのトップレベルのコードは通常1回だけ実行されます。\n\nたとえば:\n\n```javascript\n// counter.js\n\nlet count = 0;\n\ncount++;\n\nmodule.exports = count;\n```\n\n別のファイルがこうすると:\n\n```javascript\nconst a = require(\"./counter\");\nconst b = require(\"./counter\");\n```\n\nどちらもキャッシュされた結果を使います。\n\nモジュールが最初から作り直されることはありません。\n\nこれは次のようなものに役立ちます:\n\n• データベース接続\n• 設定\n• 共有される状態\n• コストの高い初期化\n\n---\n\n## 10. `require()` はどこでも呼べる\n\n`require()` は普通の関数なので、条件文や関数の中でも呼べます。\n\nたとえば:\n\n```javascript\nif (process.env.NODE_ENV === \"development\") {\n  const logger = require(\"./logger\");\n}\n```\n\nまたは:\n\n```javascript\nfunction getDatabase() {\n  return require(\"./database\");\n}\n```\n\nこれが `require()` の柔軟さです。\n\nESモジュールでは `import` の動きが違い、より厳しいルールに従います。",
      },
      diagram: `                 module.js
                    ↓
             module.exports
                    ↓
                  require
                    ↓
                 app.js`,
      codeExample: {
        title: { en: "Exporting and importing with CommonJS", np: "CommonJS सँग export/import", jp: "CommonJSでのエクスポート・インポート" },
        code: `// ── Exporting a single function — math.js ────────────────────────────
function add(a, b) { return a + b; }
module.exports = add;

// ── Importing it — app.js ─────────────────────────────────────────────
const add = require("./math");
add(5, 3);   // 8

// ── Exporting multiple functions as an object ──────────────────────────
function subtract(a, b) { return a - b; }
module.exports = { add, subtract };

const math = require("./math");
math.add(10, 5);        // 15
math.subtract(10, 5);   // 5

// ── Destructured import — cleaner call sites ────────────────────────────
const { add, subtract } = require("./math");
add(5, 2);        // 7
subtract(5, 2);   // 3

// ── Real backend example ────────────────────────────────────────────────
// database.js
function connectDatabase() { console.log("Database connected"); }
function closeDatabase() { console.log("Database closed"); }
module.exports = { connectDatabase, closeDatabase };

// server.js
const database = require("./database");
database.connectDatabase();   // "Database connected"
console.log("Server running");

// ── Built-in and third-party modules ────────────────────────────────────
const path = require("path");        // core Node module, no ./ needed
// const express = require("express");  // third-party package (node_modules)

// ── require() is just a function call — can be conditional ─────────────
if (process.env.DEBUG) {
  const debugTools = require("./debug");   // valid in CJS, not in ES Modules
}`,
      },
      keyTakeaways: [
        { en: "`module.exports` → \"Share this code.\" It is how a file makes a function, object or value available to other files.", np: "`module.exports` → \"यो code share गर।\" यसै मार्फत file ले function, object वा value अरू file लाई उपलब्ध बनाउँछ।", jp: "`module.exports` → \"このコードを共有する。\" ファイルが関数・オブジェクト・値を他のファイルから使えるようにする仕組み。" },
        { en: "`require()` → \"Give me that code.\" `const math = require(\"./math\")` loads the module and returns whatever it exported.", np: "`require()` → \"त्यो code मलाई देऊ।\" `const math = require(\"./math\")` ले module load गर्छ र यसले export गरेको जे छ त्यही फर्काउँछ।", jp: "`require()` → \"そのコードをくれ。\" `const math = require(\"./math\")` はモジュールを読み込み、エクスポートされたものを返す。" },
        { en: "<b>Synchronous</b> → \"Wait until the module is loaded.\" Node.js finishes loading the file before moving to the next line.", np: "<b>Synchronous</b> → \"Module load हुँदासम्म कुर।\" Node.js अर्को line मा जानुअघि file load सक्काउँछ।", jp: "<b>同期的</b> → \"モジュールが読み込まれるまで待つ。\" Node.jsは次の行に進む前にファイルの読み込みを終える。" },
        { en: "<b>Cached</b> → \"Load it once and reuse it.\" Requiring the same file twice runs its top-level code only once, and both variables point at the same object, so `math1 === math2` is `true`.", np: "<b>Cached</b> → \"एक पटक load गर र पुनः प्रयोग गर।\" उही file दुई पटक require गर्दा top-level code एक पटक मात्र चल्छ, र दुबै variable उही object तिर देखाउँछन्, त्यसैले `math1 === math2` `true` हुन्छ।", jp: "<b>キャッシュ</b> → \"一度読み込んで再利用する。\" 同じファイルを2回requireしてもトップレベルのコードは1回だけ実行され、両方の変数が同じオブジェクトを指すので `math1 === math2` は `true`。" },
        { en: "Caching is what makes a module a good place for database connections, configuration, shared state and expensive setup.", np: "Caching ले नै module लाई database connections, configuration, shared state र महँगो setup राख्ने राम्रो ठाउँ बनाउँछ।", jp: "キャッシュされるからこそ、モジュールはデータベース接続・設定・共有状態・コストの高い初期化を置くのに適した場所になる。" },
        { en: "`require()` anywhere → \"It can be called inside conditions or functions.\" It is just a function, unlike the static `import` of ES Modules.", np: "`require()` कहीं पनि → \"यो condition वा function भित्र call गर्न सकिन्छ।\" यो केवल function हो, ES Modules को static `import` जस्तो होइन।", jp: "`require()` はどこでも → \"条件文や関数の中でも呼べる。\" ESモジュールの静的な `import` とは違い、単なる関数だから。" },
        { en: "The basic pattern: `module.exports = { add(a, b) { return a + b; } }` in `math.js`, then `const math = require(\"./math\")` in `app.js`.", np: "आधारभूत pattern: `math.js` मा `module.exports = { add(a, b) { return a + b; } }`, त्यसपछि `app.js` मा `const math = require(\"./math\")`।", jp: "基本パターン: `math.js` で `module.exports = { add(a, b) { return a + b; } }`、`app.js` で `const math = require(\"./math\")`。" },
        { en: "In one line: `module.exports` shares code → `require()` gets the code → modules load synchronously → modules are cached after the first load.", np: "एक वाक्यमा: `module.exports` ले code share गर्छ → `require()` ले code लिन्छ → modules synchronously load हुन्छन् → पहिलो load पछि modules cache हुन्छन्।", jp: "一言で言えば: `module.exports` がコードを共有し → `require()` がそれを取得し → モジュールは同期的に読み込まれ → 最初の読み込み後はキャッシュされる。" },
      ],
      commonMistakes: [
        { en: "Writing a function in a file but forgetting to attach it to `module.exports` — it stays private to that file, and `require()` in another file returns nothing useful.", np: "File मा function लेखेर `module.exports` मा attach गर्न बिर्सनु — त्यो त्यही file मा मात्र private रहन्छ, अर्को file को `require()` ले केही useful फिर्ता दिँदैन।", jp: "ファイルに関数を書いたが`module.exports`に付けるのを忘れること。その関数はそのファイル内だけのプライベートなままで、他ファイルのrequire()は何も有用なものを返さない。" },
        { en: "Requiring a local file without the `./` prefix (`require(\"math\")` instead of `require(\"./math\")`) — Node then looks for an installed package named `math` instead of your file.", np: "Local file require गर्दा `./` prefix बिर्सनु (`require(\"./math\")` को सट्टा `require(\"math\")`) — Node ले तिम्रो file को सट्टा `math` नामको installed package खोज्छ।", jp: "ローカルファイルをrequireする際に`./`接頭辞を忘れること（`require(\"./math\")`ではなく`require(\"math\")`）。Nodeは自分のファイルの代わりに`math`という名前のインストール済みパッケージを探してしまう。" },
        { en: "Mixing `module.exports.x = ...` (adding to the exports object) with `module.exports = { ... }` (replacing it entirely) in the same file — the replacement wipes out the earlier additions.", np: "Same file मा `module.exports.x = ...` (exports मा थप्नु) र `module.exports = { ... }` (पूर्ण replace) मिलाउनु — replacement ले पहिलेका additions हराउँछ।", jp: "同じファイルで`module.exports.x = ...`（追加）と`module.exports = { ... }`（完全置換）を混ぜること。置換により以前の追加が消える。" },
        { en: "Mixing CommonJS (`require`/`module.exports`) and ES Modules (`import`/`export`) syntax in the same file — they are different module systems, so pick one style per project.", np: "Same file मा CommonJS (`require`/`module.exports`) र ES Modules (`import`/`export`) syntax मिलाउनु — यी फरक module systems हुन्, project प्रति एउटा style मात्र छान्ने।", jp: "同じファイルでCommonJS（require/module.exports）とESモジュール（import/export）の構文を混ぜること。異なるモジュールシステムなので、プロジェクトごとに1つの方式を選ぶ。" },
        { en: "Writing `module.exports.add()` (which calls the function immediately) instead of `module.exports.add = add` (which exports the function reference).", np: "`module.exports.add = add` (function reference export) को सट्टा `module.exports.add()` (जसले function तुरुन्तै call गर्छ) लेख्नु।", jp: "`module.exports.add = add`（関数の参照をエクスポート）の代わりに`module.exports.add()`（関数を即座に呼び出してしまう）と書くこと。" },
      ],
      quiz: [
        {
          question: { en: "Is `require()` synchronous or asynchronous?", np: "`require()` synchronous वा asynchronous हो?", jp: "`require()`は同期か非同期か？" },
          options: [
            { en: "Synchronous — it blocks until the module fully loads", np: "Synchronous — module पूर्ण load नभएसम्म block गर्छ", jp: "同期 — モジュールが完全にロードされるまでブロックする" },
            { en: "Asynchronous — it returns a Promise", np: "Asynchronous — यो Promise फर्काउँछ", jp: "非同期 — Promiseを返す" },
          ],
          correctIndex: 0,
          explanation: { en: "CommonJS require() is a blocking, synchronous operation — this is one of its key differences from ES Modules' import.", np: "CommonJS require() blocking, synchronous operation हो — ES Modules को import सँगको एक key फरक।", jp: "CommonJSのrequire()はブロッキングで同期的な操作。これはESモジュールのimportとの主な違いの1つ。" },
        },
        {
          question: { en: "If you `require(\"./math\")` twice from two different files, do you get two separate objects?", np: "दुई फरक files बाट `require(\"./math\")` दुई पटक गर्दा दुई फरक objects पाउँछौं?", jp: "2つの異なるファイルから`require(\"./math\")`を2回すると、2つの別々のオブジェクトを得る？" },
          options: [
            { en: "No — the module is cached; both get the exact same object", np: "होइन — module cache हुन्छ; दुवैले उही object पाउँछन्", jp: "いいえ — モジュールはキャッシュされ、両方が同じオブジェクトを得る" },
            { en: "Yes — each require re-runs the module fresh", np: "हो — हरेक require ले module नयाँ रूपमा फेरि चलाउँछ", jp: "はい — 各requireがモジュールを新しく再実行する" },
          ],
          correctIndex: 0,
          explanation: { en: "Node caches modules by resolved file path after the first require, so later requires reuse that same cached object.", np: "Node ले पहिलो require पछि resolved file path अनुसार module cache गर्छ, पछिका requires ले उही cached object reuse गर्छन्।", jp: "Nodeは最初のrequire後に解決されたファイルパスでモジュールをキャッシュし、以降のrequireは同じキャッシュされたオブジェクトを再利用する。" },
        },
        {
          question: { en: "Can `require()` be called conditionally inside an `if` block?", np: "`require()` लाई `if` block भित्र conditionally call गर्न सकिन्छ?", jp: "`require()`はifブロック内で条件付きで呼べる？" },
          options: [
            { en: "Yes — it's a normal function call, valid anywhere", np: "हो — यो normal function call हो, जहाँसुकै valid", jp: "はい — 通常の関数呼び出しで、どこでも有効" },
            { en: "No — require must always be at the top level of the file", np: "होइन — require सधैं file को top level मा हुनुपर्छ", jp: "いいえ — requireは常にファイルのトップレベルにある必要がある" },
          ],
          correctIndex: 0,
          explanation: { en: "Unlike ES Modules' static import statement, require() is just a function, so it can appear anywhere ordinary code can, including inside conditionals.", np: "ES Modules को static import statement भन्दा फरक, require() केवल function हो, त्यसैले यो conditional भित्र पनि प्रयोग हुन सक्छ।", jp: "ESモジュールの静的なimport文とは異なり、require()は単なる関数なので、条件文の中など通常のコードが書ける場所ならどこでも使える。" },
        },
      ],
    },
    {
      id: "es-modules",
      title: { en: "ES Modules (import / export)", np: "ES Modules (import / export)", jp: "ESモジュール（import/export）" },
      durationMinutes: 9,
      explanation: {
        en: "ES Modules (ESM) are JavaScript's official, standard module system — supported natively in browsers and in Node.js (12+, with `\"type\": \"module\"` in `package.json`), and used throughout modern frameworks like React and Next.js. `export` shares code from a file; `import` brings code from another file in. A file can have any number of <b>named exports</b> (`export const PI = ...`, `export function add() {}`) plus up to one <b>default export</b> (`export default class Calculator {}`) at the same time — named imports must match the exported name exactly (`import { add }`, unless renamed with `as`), while a default import can be given any local name (`import Calculator from \"./math.js\"`).\n\nUnlike CommonJS's `require()`, `import` statements are <b>statically analysed</b> at build/parse time — they must sit at the top level of a file, never inside an `if` — and this is exactly what lets bundlers perform <b>tree-shaking</b>: safely removing exports that are never imported anywhere, since the whole dependency graph is knowable without running any code. For loading a module conditionally or lazily, ES Modules offer <b>dynamic import</b> — `await import(\"./path.js\")` — which returns a Promise instead of blocking.",
        np: "ES Modules JavaScript को official standard module system हो — browser र Node.js दुवैमा native support, र React/Next.js जस्ता modern frameworks मा प्रयोग हुन्छ। `export` ले code share गर्छ, `import` ले अर्को file बाट ल्याउँछ। एउटा file मा धेरै named exports र एउटा default export हुन सक्छ — named import ले exported name सँग exactly मिल्नुपर्छ, default import जुनसुकै नामले import गर्न सकिन्छ। `import` statically analyse हुन्छ (top-level मात्र), जसले tree-shaking सम्भव बनाउँछ। Dynamic import (`await import(...)`) ले lazy loading दिन्छ।",
        jp: "ESモジュールはJavaScriptの公式標準モジュールシステムで、ブラウザとNode.jsの両方でネイティブサポートされ、ReactやNext.jsなどのモダンなフレームワークで使われる。exportはコードを共有し、importは別ファイルから取り込む。1つのファイルに複数の名前付きエクスポートと1つのデフォルトエクスポートを持てる。名前付きインポートはエクスポート名と正確に一致する必要があるが、デフォルトインポートはどんなローカル名でも良い。importは静的に解析される（トップレベルのみ）。これによりツリーシェイキングが可能になる。動的import（await import(...)）で遅延読み込みができる。",
      },
      diagram: `math.js                                    app.js
──────────────────────                     ──────────────────────
export const PI = 3.14159;                 import { PI, add } from "./math.js";
export function add(a,b) {...}             import * as math from "./math.js";
export default class Calculator {}         import Calculator from "./math.js";

Mental model: export = "place this item in the library"
              import = "borrow this item from the library"

STATIC import   → top-level only    → enables tree-shaking (bundler removes unused)
DYNAMIC import  → await import(...) → returns a Promise, usable anywhere (lazy loading)`,
      codeExample: {
        title: { en: "Named exports, default export, and dynamic import", np: "Named exports, default export, dynamic import", jp: "名前付きエクスポート・デフォルトエクスポート・動的import" },
        code: `// ── Named exports — math.js ─────────────────────────────────────────
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }

// ── Default export — one per file, alongside named exports ────────────
export default class Calculator {
  add(a, b) { return a + b; }
}

// ── Named imports — app.js ───────────────────────────────────────────
import { add, multiply } from "./math.js";   // names must match exactly
add(2, 3);        // 5
multiply(2, 3);   // 6

// ── Default import — any local name works ─────────────────────────────
import Calculator from "./math.js";     // no curly braces
import MyCalc from "./math.js";         // this name works too — default exports aren't named

// ── Real backend example ────────────────────────────────────────────────
// user.service.js
export function findUser(userId) { return { id: userId, name: "Alex" }; }
export function deleteUser(userId) { console.log("Deleting user", userId); }

// user.controller.js
import { findUser, deleteUser } from "./user.service.js";
const user = findUser(10);   // { id: 10, name: "Alex" }
deleteUser(10);               // "Deleting user 10"

// ── Dynamic import — load a module on demand (async) ────────────────────
button.addEventListener("click", async () => {
  const { renderChart } = await import("./chart-library.js");  // lazy-loaded, returns a Promise
  renderChart(data);
});

// ── Enabling ESM in Node.js — package.json ──────────────────────────────
// { "type": "module" }`,
      },
      keyTakeaways: [
        { en: "`export` shares code from a file, `import` brings it into another — a file can have multiple named exports plus exactly one default export at the same time.", np: "`export` ले file बाट code share गर्छ, `import` ले अर्को file मा ल्याउँछ — एउटा file मा multiple named exports र exactly एउटा default export एकैसाथ हुन सक्छ।", jp: "exportはファイルからコードを共有し、importはそれを別のファイルに取り込む。1つのファイルは複数の名前付きエクスポートとちょうど1つのデフォルトエクスポートを同時に持てる。" },
        { en: "Named imports must match the exported name exactly (`import { add }`, unless renamed with `as`); a default import can be given any local name (`import Calculator from \"./math.js\"`).", np: "Named imports ले exported name सँग exactly मिल्नुपर्छ (`import { add }`, `as` ले renamed नगरेसम्म); default import जुनसुकै local नामले import गर्न सकिन्छ।", jp: "名前付きインポートはエクスポート名と正確に一致する必要がある（`import { add }`、asで改名しない限り）。デフォルトインポートはどんなローカル名でも良い。" },
        { en: "Static `import` statements must sit at the top level of a file (never inside a conditional), which is exactly what lets bundlers tree-shake unused exports away.", np: "Static `import` statements file को top level मा नै हुनुपर्छ (conditional भित्र होइन), यही ले bundlers लाई unused exports tree-shake गर्न दिन्छ।", jp: "静的なimport文はファイルのトップレベルに置く必要がある（条件文の中は不可）。これがバンドラーが未使用のエクスポートをツリーシェイクできる理由。" },
        { en: "`await import(\"./path.js\")` is a dynamic import — it returns a Promise, can be called conditionally or lazily anywhere in code, unlike static import.", np: "`await import(\"./path.js\")` dynamic import हो — यसले Promise फर्काउँछ, static import भन्दा फरक जहाँसुकै conditionally call गर्न सकिन्छ।", jp: "`await import(\"./path.js\")`は動的importで、Promiseを返す。静的importとは異なり、コードのどこでも条件付きで呼べる。" },
      ],
      commonMistakes: [
        { en: "Forgetting curly braces on a named import (`import add from \"./math.js\"` instead of `import { add } from \"./math.js\"`).", np: "Named import मा curly braces बिर्सनु (`import { add } from \"./math.js\"` को सट्टा `import add from \"./math.js\"`)।", jp: "名前付きインポートで波括弧を忘れること（`import { add } from \"./math.js\"`ではなく`import add from \"./math.js\"`）。" },
        { en: "Using curly braces on a default import (`import { User } from \"./User.js\"` instead of `import User from \"./User.js\"`) — default exports don't have a name to match.", np: "Default import मा curly braces प्रयोग गर्नु (`import User from \"./User.js\"` को सट्टा `import { User } from \"./User.js\"`) — default exports सँग match गर्ने name नै हुँदैन।", jp: "デフォルトインポートで波括弧を使うこと（`import User from \"./User.js\"`ではなく`import { User } from \"./User.js\"`）。デフォルトエクスポートには一致させる名前がない。" },
        { en: "Trying to write more than one default export in the same file — a file can only have one; use named exports for anything beyond that.", np: "Same file मा एक भन्दा बढी default export लेख्ने प्रयास गर्नु — एउटा file मा एउटा मात्र हुन सक्छ; बाँकीका लागि named exports प्रयोग गर्ने।", jp: "同じファイルに2つ以上のデフォルトエクスポートを書こうとすること。1ファイルに1つしか持てない。それ以外は名前付きエクスポートを使う。" },
        { en: "Forgetting the file extension in an import path (`\"./math\"` instead of `\"./math.js\"`) — native ESM in the browser requires it, unlike bundler-based setups.", np: "Import path मा file extension बिर्सनु (`\"./math.js\"` को सट्टा `\"./math\"`) — browser को native ESM मा यो required हुन्छ।", jp: "importパスでファイル拡張子を忘れること（`\"./math.js\"`ではなく`\"./math\"`）。ブラウザのネイティブESMではこれが必要。" },
        { en: "Mixing CommonJS (`module.exports`) and ES Modules (`import`/`export`) syntax in the same file — they are different module systems, so pick one style per project.", np: "Same file मा CommonJS (`module.exports`) र ES Modules (`import`/`export`) syntax मिलाउनु — यी फरक module systems हुन्, project प्रति एउटा style मात्र छान्ने।", jp: "同じファイルでCommonJS（module.exports）とESモジュール（import/export）の構文を混ぜること。異なるモジュールシステムなので、プロジェクトごとに1つの方式を選ぶ。" },
      ],
      quiz: [
        {
          question: { en: "Can a single file have both a default export and named exports?", np: "एउटा file मा default export र named exports दुवै हुन सक्छ?", jp: "1つのファイルにデフォルトエクスポートと名前付きエクスポートの両方を持てる？" },
          options: [
            { en: "Yes — a file can have both at the same time", np: "हो — एउटा file मा दुवै एकैसाथ हुन सक्छ", jp: "はい — 1つのファイルに両方同時に持てる" },
            { en: "No — a file must choose exactly one export style", np: "होइन — file ले exactly एउटा export style छान्नुपर्छ", jp: "いいえ — ファイルは1つのエクスポート方式を選ばなければならない" },
          ],
          correctIndex: 0,
          explanation: { en: "ES Modules allow up to one default export alongside any number of named exports in the same file.", np: "ES Modules ले same file मा एउटा default export सँगै जुनसुकै संख्याको named exports लाई अनुमति दिन्छ।", jp: "ESモジュールは同じファイルで1つのデフォルトエクスポートと任意の数の名前付きエクスポートを許可する。" },
        },
        {
          question: { en: "Why must static `import` statements sit only at the top level of a module?", np: "Static `import` statements किन module को top level मा मात्र हुनुपर्छ?", jp: "静的importステートメントがモジュールのトップレベルにのみ置ける理由は？" },
          options: [
            { en: "Because it's a purely stylistic rule with no functional purpose", np: "किनकि यो कुनै functional purpose नभएको केवल stylistic rule हो", jp: "機能的な目的のない単なるスタイル上の規則だから" },
            { en: "So bundlers/engines can statically analyse the whole module graph and tree-shake unused exports", np: "ताकि bundlers/engines ले पूरै module graph statically analyse गरी unused exports tree-shake गर्न सकोस्", jp: "バンドラー/エンジンがモジュールグラフ全体を静的に解析し未使用エクスポートをツリーシェイクできるように" },
          ],
          correctIndex: 1,
          explanation: { en: "Static, top-level-only imports are what makes the entire module dependency graph knowable ahead of time, without running any code.", np: "Static, top-level-only imports ले नै कोड नचलाई पूरै module dependency graph अगावै जान्न सक्ने बनाउँछ।", jp: "静的でトップレベルのみのimportこそが、コードを実行せずにモジュール依存グラフ全体を事前に把握可能にする。" },
        },
        {
          question: { en: "What does `await import(\"./chart-library.js\")` return?", np: "`await import(\"./chart-library.js\")` ले के फर्काउँछ?", jp: "`await import(\"./chart-library.js\")`は何を返す？" },
          options: [
            { en: "A Promise that resolves to the module's exports", np: "Module का exports मा resolve हुने Promise", jp: "モジュールのエクスポートに解決されるPromise" },
            { en: "The module's exports synchronously, immediately", np: "Module का exports synchronously, तुरुन्तै", jp: "モジュールのエクスポートを同期的に、即座に" },
          ],
          correctIndex: 0,
          explanation: { en: "Dynamic import() is inherently asynchronous, which is exactly what makes lazy/conditional loading possible in ESM.", np: "Dynamic import() स्वाभाविक रूपमा asynchronous हो, यही ले ESM मा lazy/conditional loading सम्भव बनाउँछ।", jp: "動的import()は本質的に非同期であり、これがESMで遅延/条件付き読み込みを可能にする。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "Does a `finally` block run even after a `return` inside `try`?", np: "`try` भित्रको `return` पछि पनि `finally` block चल्छ?", jp: "try内のreturnの後でもfinallyブロックは実行される？" },
      options: [{ en: "Yes — finally always runs", np: "हो — finally सधैं चल्छ", jp: "はい — finallyは常に実行される" }, { en: "No — return skips finally", np: "होइन — return ले finally skip गर्छ", jp: "いいえ — returnはfinallyをスキップする" }],
      correctIndex: 0,
      explanation: { en: "finally is guaranteed regardless of how try/catch exits.", np: "Try/catch कसरी बाहिर निस्किए पनि finally guaranteed छ।", jp: "try/catchがどのように終了してもfinallyは保証される。" },
    },
    {
      question: { en: "What must a custom error class's constructor call to correctly set `.message`?", np: "Custom error class को constructor ले `.message` सहि सेट गर्न के call गर्नुपर्छ?", jp: "カスタムエラークラスのコンストラクタが.messageを正しく設定するために何を呼ぶ必要がある？" },
      options: [{ en: "`super(message)`", np: "`super(message)`", jp: "`super(message)`" }, { en: "Nothing, message is automatic", np: "केही होइन, message automatic हो", jp: "何も、messageは自動" }],
      correctIndex: 0,
      explanation: { en: "Error's own constructor logic sets up .message and .stack.", np: "Error को आफ्नै constructor logic ले .message र .stack सेटअप गर्छ।", jp: "Error自身のコンストラクタロジックが.messageと.stackを設定する。" },
    },
    {
      question: { en: "What should you do with an error type inside `catch` that you don't specifically handle?", np: "`catch` भित्र specifically handle नगरेको error type सँग के गर्नुपर्छ?", jp: "catch内で特に処理していないエラータイプはどうするべき？" },
      options: [{ en: "Re-throw it", np: "Re-throw गर्नुहोस्", jp: "再スローする" }, { en: "Log and ignore it", np: "Log गरी ignore गर्नुहोस्", jp: "ログに記録して無視する" }],
      correctIndex: 0,
      explanation: { en: "Rethrowing keeps unrecognised bugs visible instead of hiding them.", np: "Rethrow गर्दा नचिनेका bugs लुकाइनुको सट्टा दृश्य रहन्छन्।", jp: "再スローすれば認識していないバグが隠れずに見えるようになる。" },
    },
    {
      question: { en: "Is `require()` in CommonJS synchronous or asynchronous?", np: "CommonJS को `require()` synchronous वा asynchronous हो?", jp: "CommonJSのrequire()は同期か非同期か？" },
      options: [{ en: "Synchronous", np: "Synchronous", jp: "同期" }, { en: "Asynchronous", np: "Asynchronous", jp: "非同期" }],
      correctIndex: 0,
      explanation: { en: "require() blocks until the module is fully loaded.", np: "require() ले module पूर्ण load नभएसम्म block गर्छ।", jp: "require()はモジュールが完全にロードされるまでブロックする。" },
    },
    {
      question: { en: "If two files `require(\"./math\")`, do they get the same cached object or two fresh copies?", np: "दुई files ले `require(\"./math\")` गर्दा उही cached object वा दुई फरक copies पाउँछन्?", jp: "2つのファイルがrequire(\"./math\")すると、同じキャッシュされたオブジェクトか2つの新しいコピーか？" },
      options: [{ en: "The same cached object", np: "उही cached object", jp: "同じキャッシュされたオブジェクト" }, { en: "Two independent fresh copies", np: "दुई independent फरक copies", jp: "2つの独立した新しいコピー" }],
      correctIndex: 0,
      explanation: { en: "Modules run once and are cached by resolved path.", np: "Modules एकपल्ट चल्छन् र resolved path अनुसार cache हुन्छन्।", jp: "モジュールは一度実行され、解決されたパスでキャッシュされる。" },
    },
    {
      question: { en: "Can `require()` be called conditionally inside an `if` block?", np: "`require()` लाई `if` block भित्र conditionally call गर्न सकिन्छ?", jp: "`require()`はifブロック内で条件付きで呼べる？" },
      options: [{ en: "Yes — it's a normal function call", np: "हो — यो normal function call हो", jp: "はい — 通常の関数呼び出し" }, { en: "No — must be top-level like import", np: "होइन — import जस्तै top-level हुनुपर्छ", jp: "いいえ — importのようにトップレベルである必要がある" }],
      correctIndex: 0,
      explanation: { en: "require() is just a function, unlike static ESM import.", np: "require() केवल function हो, static ESM import जस्तो होइन।", jp: "require()は単なる関数であり、静的なESM importとは異なる。" },
    },
    {
      question: { en: "Can a single ES Module file have both a default export and named exports?", np: "एउटा ES Module file मा default export र named exports दुवै हुन सक्छ?", jp: "1つのESモジュールファイルにデフォルトエクスポートと名前付きエクスポートの両方を持てる？" },
      options: [{ en: "Yes", np: "हो", jp: "はい" }, { en: "No, only one style per file", np: "होइन, file प्रति एउटा style मात्र", jp: "いいえ、ファイルごとに1つの方式のみ" }],
      correctIndex: 0,
      explanation: { en: "ESM allows one default export alongside any number of named exports.", np: "ESM ले जुनसुकै संख्याका named exports सँगै एउटा default export अनुमति दिन्छ।", jp: "ESMは任意の数の名前付きエクスポートと共に1つのデフォルトエクスポートを許可する。" },
    },
    {
      question: { en: "Why must ESM `import` statements sit at the top level of a module?", np: "ESM `import` statements किन module को top level मा हुनुपर्छ?", jp: "ESMのimport文がモジュールのトップレベルに置かれる必要があるのはなぜ？" },
      options: [{ en: "So the module graph can be statically analysed for tree-shaking", np: "ताकि module graph tree-shaking का लागि statically analyse होस्", jp: "モジュールグラフをツリーシェイキングのために静的に解析できるように" }, { en: "It's just a stylistic preference", np: "यो केवल stylistic preference हो", jp: "単なるスタイル上の好み" }],
      correctIndex: 0,
      explanation: { en: "Static imports enable ahead-of-time analysis, unlike CommonJS's dynamic require().", np: "Static imports ले ahead-of-time analysis सम्भव बनाउँछ, CommonJS को dynamic require() जस्तो होइन।", jp: "静的importは事前解析を可能にする。CommonJSの動的なrequire()とは異なる。" },
    },
    {
      question: { en: "What does `await import(\"./x.js\")` return?", np: "`await import(\"./x.js\")` ले के फर्काउँछ?", jp: "`await import(\"./x.js\")`は何を返す？" },
      options: [{ en: "A Promise resolving to the module's exports", np: "Module का exports मा resolve हुने Promise", jp: "モジュールのエクスポートに解決されるPromise" }, { en: "The exports synchronously", np: "Exports synchronously", jp: "エクスポートを同期的に" }],
      correctIndex: 0,
      explanation: { en: "Dynamic import is asynchronous by design, enabling lazy loading.", np: "Dynamic import design द्वारा asynchronous छ, lazy loading सम्भव बनाउँछ।", jp: "動的importは設計上非同期であり、遅延読み込みを可能にする。" },
    },
  ],
};
