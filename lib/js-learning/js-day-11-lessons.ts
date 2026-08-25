import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_11_LESSONS: JsLessonDay = {
  day: 11,
  title: { en: "Dates & Time", np: "Dates र Time", jp: "日付と時刻" },
  totalMinutes: 27,
  difficulty: { en: "Intermediate", np: "Intermediate", jp: "中級" },
  lessons: [
    {
      id: "dates-instants-utc",
      title: { en: "Instants, UTC & Local Time", np: "Instants, UTC र Local Time", jp: "瞬間・UTC・ローカル時刻" },
      durationMinutes: 9,
      explanation: {
        en: "JavaScript dates are one of the easiest places to write code that works perfectly on your machine and breaks in production.\n\nThe core problem is that a date can represent different things:\n\n• an <b>instant in time</b> — a precise moment globally\n• a <b>local date/time</b> — what someone sees on their clock\n• a <b>calendar date</b> — like `2026-08-26`, which may have no timezone at all\n\nJavaScript's classic `Date` object represents an <b>instant in time internally as milliseconds since the Unix epoch (UTC)</b>. The confusing part is that methods can interpret or display that instant in either UTC or the machine's local timezone.\n\n> <b>Store and exchange instants in UTC; convert them to the user's timezone only when displaying them.</b>\n\n---\n\n### 1. Basic — creating a Date\n\n```javascript\nconst now = new Date();\n\nconsole.log(now);\n```\n\nYou can also create a date from an ISO string:\n\n```javascript\nconst date = new Date(\"2026-08-26T12:00:00Z\");\n\nconsole.log(date.toISOString());\n// \"2026-08-26T12:00:00.000Z\"\n```\n\nThe `Z` means <b>UTC</b>.\n\n---\n\n### 2. Intermediate — UTC vs local time\n\n```javascript\nconst date = new Date(\"2026-08-26T12:00:00Z\");\n\nconsole.log(date.toISOString());\n// UTC\n\nconsole.log(date.toString());\n// Your machine's local timezone\n```\n\nThese may display different clock times, but they represent the <b>same instant</b>.\n\nYou can also read UTC components explicitly:\n\n```javascript\nconsole.log(date.getUTCHours()); // the UTC hour\nconsole.log(date.getHours());    // the hour in the machine's local timezone\n```\n\n---\n\n### 3. Advanced — one instant, many local views\n\n```text\nUTC\n2026-08-26 12:00\n\n        ↓ timezone conversion\n\nJapan\n2026-08-26 21:00\n\n        ↓ timezone conversion\n\nNew York\n2026-08-26 08:00\n```\n\n<b>Same instant. Different local representations.</b>\n\n---\n\n### `Date` is mutable, and that bites\n\n```javascript\nconst date = new Date();\n\nconst tomorrow = date;\n\ntomorrow.setDate(tomorrow.getDate() + 1);\n\nconsole.log(date);\n// Also changed!\n```\n\nBoth variables reference the same `Date` object. Create a new value instead:\n\n```javascript\nconst tomorrow = new Date(date);\n\ntomorrow.setDate(tomorrow.getDate() + 1);\n```",
        np: "JavaScript का date त्यस्ता ठाउँमध्ये एक हुन् जहाँ तपाईंको मेसिनमा राम्रोसँग चल्ने code production मा बिग्रन्छ।\n\nमूल समस्या यो हो कि date ले फरक-फरक कुरा जनाउन सक्छ:\n\n• <b>समयको एक क्षण</b> — विश्वव्यापी रूपमा निश्चित क्षण\n• <b>स्थानीय date/time</b> — कसैले आफ्नो घडीमा देख्ने\n• <b>पात्रोको मिति</b> — जस्तै `2026-08-26`, जसमा timezone नहुन सक्छ\n\nJavaScript को classic `Date` object ले <b>भित्री रूपमा Unix epoch (UTC) देखिको millisecond</b> का रूपमा समयको क्षण जनाउँछ। अलमल्याउने कुरा के हो भने method ले त्यो क्षणलाई UTC वा मेसिनको स्थानीय timezone दुबैमा व्याख्या वा प्रदर्शन गर्न सक्छन्।\n\n> <b>क्षणलाई UTC मा राख्नुहोस् र आदानप्रदान गर्नुहोस्; देखाउँदा मात्र user को timezone मा बदल्नुहोस्।</b>\n\n---\n\n### 1. आधारभूत — Date बनाउनु\n\n```javascript\nconst now = new Date();\n\nconsole.log(now);\n```\n\nISO string बाट पनि date बनाउन सक्नुहुन्छ:\n\n```javascript\nconst date = new Date(\"2026-08-26T12:00:00Z\");\n\nconsole.log(date.toISOString());\n// \"2026-08-26T12:00:00.000Z\"\n```\n\n`Z` को अर्थ <b>UTC</b> हो।\n\n---\n\n### 2. मध्यम — UTC vs स्थानीय समय\n\n```javascript\nconst date = new Date(\"2026-08-26T12:00:00Z\");\n\nconsole.log(date.toISOString());\n// UTC\n\nconsole.log(date.toString());\n// Your machine's local timezone\n```\n\nयिनले फरक घडी समय देखाउन सक्छन्, तर <b>उही क्षण</b> जनाउँछन्।\n\nUTC भाग स्पष्ट रूपमा पनि पढ्न सक्नुहुन्छ:\n\n```javascript\nconsole.log(date.getUTCHours()); // the UTC hour\nconsole.log(date.getHours());    // the hour in the machine's local timezone\n```\n\n---\n\n### 3. उन्नत — एउटै क्षण, धेरै स्थानीय दृश्य\n\n```text\nUTC\n2026-08-26 12:00\n\n        ↓ timezone conversion\n\nJapan\n2026-08-26 21:00\n\n        ↓ timezone conversion\n\nNew York\n2026-08-26 08:00\n```\n\n<b>उही क्षण। फरक स्थानीय प्रतिनिधित्व।</b>\n\n---\n\n### `Date` mutable छ, र यसले टोक्छ\n\n```javascript\nconst date = new Date();\n\nconst tomorrow = date;\n\ntomorrow.setDate(tomorrow.getDate() + 1);\n\nconsole.log(date);\n// Also changed!\n```\n\nदुबै variable ले उही `Date` object लाई देखाउँछन्। बरु नयाँ value बनाउनुहोस्:\n\n```javascript\nconst tomorrow = new Date(date);\n\ntomorrow.setDate(tomorrow.getDate() + 1);\n```",
        jp: "JavaScriptの日付は、自分の環境では完璧に動くのに本番で壊れるコードを書きやすい場所の1つです。\n\n根本の問題は、日付が異なるものを表しうることです:\n\n• <b>時刻の瞬間</b> — 世界共通の正確な一点\n• <b>ローカルの日時</b> — その人の時計に映るもの\n• <b>暦の日付</b> — `2026-08-26` のように、タイムゾーンを持たないこともある\n\nJavaScriptの従来の `Date` オブジェクトは、<b>内部的にはUnixエポック（UTC）からのミリ秒</b>として瞬間を表します。ややこしいのは、メソッドがその瞬間をUTCでも端末のローカルタイムゾーンでも解釈・表示できる点です。\n\n> <b>瞬間はUTCで保存・交換し、表示するときだけユーザーのタイムゾーンに変換する。</b>\n\n---\n\n### 1. 基本 — Dateを作る\n\n```javascript\nconst now = new Date();\n\nconsole.log(now);\n```\n\nISO文字列からも作れます:\n\n```javascript\nconst date = new Date(\"2026-08-26T12:00:00Z\");\n\nconsole.log(date.toISOString());\n// \"2026-08-26T12:00:00.000Z\"\n```\n\n`Z` は<b>UTC</b>を意味します。\n\n---\n\n### 2. 中級 — UTCとローカル時刻\n\n```javascript\nconst date = new Date(\"2026-08-26T12:00:00Z\");\n\nconsole.log(date.toISOString());\n// UTC\n\nconsole.log(date.toString());\n// Your machine's local timezone\n```\n\n表示される時刻は違っても、<b>同じ瞬間</b>を表しています。\n\nUTCの各要素を明示的に読むこともできます:\n\n```javascript\nconsole.log(date.getUTCHours()); // the UTC hour\nconsole.log(date.getHours());    // the hour in the machine's local timezone\n```\n\n---\n\n### 3. 上級 — 1つの瞬間、複数のローカル表示\n\n```text\nUTC\n2026-08-26 12:00\n\n        ↓ timezone conversion\n\nJapan\n2026-08-26 21:00\n\n        ↓ timezone conversion\n\nNew York\n2026-08-26 08:00\n```\n\n<b>同じ瞬間。異なるローカル表現。</b>\n\n---\n\n### `Date` はミュータブルで、それが噛みつく\n\n```javascript\nconst date = new Date();\n\nconst tomorrow = date;\n\ntomorrow.setDate(tomorrow.getDate() + 1);\n\nconsole.log(date);\n// Also changed!\n```\n\nどちらの変数も同じ `Date` オブジェクトを参照しています。新しい値を作りましょう:\n\n```javascript\nconst tomorrow = new Date(date);\n\ntomorrow.setDate(tomorrow.getDate() + 1);\n```",
      },
      diagram: `                    Date / Time
                         │
             ┌───────────┴───────────┐
             ↓                       ↓
        UTC / Instant            Local Time
       "What moment?"          "What does my
                                clock show?"
             │                       │
             │       Timezone        │
             └──────────┬────────────┘
                        ↓
                 User's display


UTC        2026-08-26 12:00
Japan      2026-08-26 21:00
New York   2026-08-26 08:00

Same instant, three local representations.`,
      codeExample: {
        title: { en: "One instant, read two ways", np: "एउटै क्षण, दुई तरिकाले पढिएको", jp: "1つの瞬間、2つの読み方" },
        code: `// ── 1. Basic — an instant from an ISO string ──────────────────────
const now = new Date();

const date = new Date("2026-08-26T12:00:00Z"); // Z means UTC

console.log(date.toISOString()); // "2026-08-26T12:00:00.000Z"

// ── 2. Intermediate — the same instant, two readings ──────────────
console.log(date.toISOString()); // UTC
console.log(date.toString());    // this machine's local timezone

console.log(date.getUTCHours()); // 12 — always UTC
console.log(date.getHours());    // depends where this runs

// ── 3. Advanced — Date is mutable, so copy before changing ────────
const start = new Date("2026-08-26T12:00:00Z");

const sameObject = start;
sameObject.setDate(sameObject.getDate() + 1);
console.log(start.toISOString()); // start moved too

const copy = new Date(start);
copy.setDate(copy.getDate() + 1);
console.log(start.toISOString()); // this time start is untouched`,
      },
      keyTakeaways: [
        { en: "A `Date` stores an <b>instant</b>: milliseconds since the Unix epoch, in UTC.", np: "`Date` ले <b>क्षण</b> राख्छ: Unix epoch देखिको millisecond, UTC मा।", jp: "`Date` は<b>瞬間</b>を保持する。UTCでのUnixエポックからのミリ秒。" },
        { en: "The same instant has <b>different local representations</b> in different timezones.", np: "उही क्षणका फरक timezone मा <b>फरक स्थानीय प्रतिनिधित्व</b> हुन्छन्।", jp: "同じ瞬間でも、タイムゾーンが違えば<b>ローカル表現は異なる</b>。" },
        { en: "`toISOString()` and `getUTCHours()` read UTC; `toString()` and `getHours()` read local time.", np: "`toISOString()` र `getUTCHours()` ले UTC पढ्छन्; `toString()` र `getHours()` ले स्थानीय समय।", jp: "`toISOString()` と `getUTCHours()` はUTCを、`toString()` と `getHours()` はローカル時刻を読む。" },
        { en: "The `Z` in an ISO string means <b>UTC</b>.", np: "ISO string मा `Z` को अर्थ <b>UTC</b> हो।", jp: "ISO文字列の `Z` は<b>UTC</b>を意味する。" },
        { en: "Store and exchange instants in UTC; convert only when displaying to a user.", np: "क्षणलाई UTC मा राख्नुहोस् र आदानप्रदान गर्नुहोस्; user लाई देखाउँदा मात्र बदल्नुहोस्।", jp: "瞬間はUTCで保存・交換し、ユーザーに表示するときだけ変換する。" },
        { en: "`Date` is <b>mutable</b> — `setDate()` changes the object every reference sees.", np: "`Date` <b>mutable</b> छ — `setDate()` ले हरेक reference ले देख्ने object बदल्छ।", jp: "`Date` は<b>ミュータブル</b>。`setDate()` はすべての参照が見るオブジェクトを変える。" },
      ],
      commonMistakes: [
        { en: "<b>Assuming `Date` is immutable</b> — `const tomorrow = date; tomorrow.setDate(...)` moves `date` too. Copy first with `new Date(date)`.", np: "<b>`Date` immutable हो भन्ने ठान्नु</b> — `const tomorrow = date; tomorrow.setDate(...)` ले `date` पनि सार्छ। पहिले `new Date(date)` ले copy गर्नुहोस्।", jp: "<b>`Date` がイミュータブルだと思う</b> — `const tomorrow = date; tomorrow.setDate(...)` は `date` も動かす。`new Date(date)` で先にコピーする。" },
        { en: "<b>Mixing UTC and local getters</b> — reading `getHours()` on a UTC instant gives whatever the machine's timezone says, which differs per environment.", np: "<b>UTC र स्थानीय getter मिसाउनु</b> — UTC क्षणमा `getHours()` पढ्दा मेसिनको timezone ले जे भन्छ त्यही आउँछ, जुन हरेक वातावरणमा फरक हुन्छ।", jp: "<b>UTCとローカルのゲッターを混ぜる</b> — UTCの瞬間に `getHours()` を使うと端末のタイムゾーン次第になり、環境ごとに変わる。" },
        { en: "<b>Storing local wall-clock text</b> — `\"2026-08-26 21:00\"` has no timezone, so its meaning depends on who reads it. Store `\"2026-08-26T12:00:00Z\"` instead.", np: "<b>स्थानीय घडीको पाठ राख्नु</b> — `\"2026-08-26 21:00\"` मा timezone छैन, त्यसैले यसको अर्थ पढ्नेमा भर पर्छ। बरु `\"2026-08-26T12:00:00Z\"` राख्नुहोस्।", jp: "<b>ローカルの壁時計表記を保存する</b> — `\"2026-08-26 21:00\"` にはタイムゾーンがなく、読む人次第で意味が変わる。`\"2026-08-26T12:00:00Z\"` を保存する。" },
      ],
      quiz: [
        {
          question: { en: "What does the `Z` mean in `new Date(\"2026-08-26T12:00:00Z\")`?", np: "`new Date(\"2026-08-26T12:00:00Z\")` मा `Z` को अर्थ के हो?", jp: "`new Date(\"2026-08-26T12:00:00Z\")` の `Z` は何を意味するか?" },
          options: [
            { en: "UTC", np: "UTC", jp: "UTC" },
            { en: "Local time", np: "स्थानीय समय", jp: "ローカル時刻" },
            { en: "Japan time", np: "जापान समय", jp: "日本時間" },
            { en: "Daylight Saving Time", np: "Daylight Saving Time", jp: "サマータイム" },
          ],
          correctIndex: 0,
          explanation: { en: "`Z` is the ISO 8601 marker for zero offset, meaning UTC.", np: "`Z` शून्य offset को ISO 8601 चिन्ह हो, अर्थात् UTC।", jp: "`Z` はオフセット0を示すISO 8601の記号、つまりUTC。" },
        },
        {
          question: { en: "What does a `Date` object actually store internally?", np: "`Date` object ले भित्री रूपमा वास्तवमा के राख्छ?", jp: "`Date` オブジェクトが内部で実際に保持するものは?" },
          options: [
            { en: "A formatted local string", np: "ढाँचाबद्ध स्थानीय string", jp: "書式化されたローカル文字列" },
            { en: "Milliseconds since the Unix epoch, in UTC", np: "Unix epoch देखिको millisecond, UTC मा", jp: "UTCでのUnixエポックからのミリ秒" },
            { en: "A timezone name", np: "Timezone को नाम", jp: "タイムゾーン名" },
          ],
          correctIndex: 1,
          explanation: { en: "Everything else — local hours, formatted output — is derived from that number.", np: "बाँकी सबै — स्थानीय घण्टा, ढाँचाबद्ध output — त्यही संख्याबाट निस्कन्छ।", jp: "ローカルの時刻も書式化された出力も、すべてその数値から導かれる。" },
        },
        {
          question: { en: "Why does `const tomorrow = date; tomorrow.setDate(...)` also change `date`?", np: "`const tomorrow = date; tomorrow.setDate(...)` ले `date` पनि किन बदल्छ?", jp: "なぜ `const tomorrow = date; tomorrow.setDate(...)` は `date` も変えるのか?" },
          options: [
            { en: "`setDate` is asynchronous", np: "`setDate` asynchronous छ", jp: "`setDate` が非同期だから" },
            { en: "`const` copies the value", np: "`const` ले value copy गर्छ", jp: "`const` が値をコピーするから" },
            { en: "Both names reference the same mutable `Date` object", np: "दुबै नामले उही mutable `Date` object लाई देखाउँछन्", jp: "どちらの名前も同じミュータブルな `Date` を参照しているから" },
          ],
          correctIndex: 2,
          explanation: { en: "Copy it with `new Date(date)` before mutating.", np: "Mutate गर्नुअघि `new Date(date)` ले copy गर्नुहोस्।", jp: "変更する前に `new Date(date)` でコピーする。" },
        },
      ],
    },
    {
      id: "dates-parsing-formatting",
      title: { en: "Parsing & Formatting Safely", np: "सुरक्षित Parsing र Formatting", jp: "安全な解析と書式化" },
      durationMinutes: 9,
      explanation: {
        en: "ISO 8601 strings are generally the safest format to exchange between systems:\n\n```javascript\nconst date = new Date(\"2026-08-26T12:00:00Z\");\n```\n\nBe careful with ambiguous strings such as `new Date(\"08/26/2026\")`. Different environments and assumptions can make non-ISO formats problematic.\n\n---\n\n### The classic date bug\n\nThis looks harmless:\n\n```javascript\nconst date = new Date(\"2026-08-26\");\n\nconsole.log(date);\n```\n\nA date-only ISO string is interpreted as a UTC-based date, which can produce a <b>different calendar day when displayed in a negative timezone</b>.\n\n```text\nDatabase:\n2026-08-26\n\nUser in another timezone:\n2026-08-25\n```\n\nThe bug isn't necessarily in JavaScript. The real question is:\n\n> <b>Did you mean a calendar date, or did you mean a moment in time?</b>\n\nThose are different concepts.\n\n---\n\n### `Intl.DateTimeFormat`\n\nDon't manually build localized dates like `` `${month}/${day}/${year}` ``. Use the internationalization API:\n\n```javascript\nconst date = new Date(\"2026-08-26T12:00:00Z\");\n\nconst formatter = new Intl.DateTimeFormat(\"en-US\", {\n  timeZone: \"Asia/Tokyo\",\n  dateStyle: \"full\",\n  timeStyle: \"short\"\n});\n\nconsole.log(formatter.format(date));\n// Wednesday, August 26, 2026 at 9:00 PM\n```\n\nFor New York:\n\n```javascript\nnew Intl.DateTimeFormat(\"en-US\", {\n  timeZone: \"America/New_York\",\n  dateStyle: \"full\",\n  timeStyle: \"short\"\n}).format(date);\n// Wednesday, August 26, 2026 at 8:00 AM\n```\n\nThe <b>instant never changed</b>. Only its presentation changed.\n\nYou can also change the locale:\n\n```javascript\nnew Intl.DateTimeFormat(\"en-US\").format(date);\nnew Intl.DateTimeFormat(\"en-GB\").format(date);\nnew Intl.DateTimeFormat(\"ja-JP\").format(date);\n```\n\nThis is much safer than manually formatting month and day names.",
        np: "प्रणालीबीच आदानप्रदान गर्न ISO 8601 string सामान्यतया सबैभन्दा सुरक्षित ढाँचा हो:\n\n```javascript\nconst date = new Date(\"2026-08-26T12:00:00Z\");\n```\n\n`new Date(\"08/26/2026\")` जस्ता अस्पष्ट string सँग होसियार हुनुहोस्। फरक वातावरण र अनुमानले non-ISO ढाँचालाई समस्याग्रस्त बनाउन सक्छन्।\n\n---\n\n### Classic date bug\n\nयो निर्दोष देखिन्छ:\n\n```javascript\nconst date = new Date(\"2026-08-26\");\n\nconsole.log(date);\n```\n\nDate-मात्र भएको ISO string लाई UTC-आधारित मिति मानिन्छ, जसले <b>ऋणात्मक timezone मा देखाउँदा फरक पात्रो दिन</b> दिन सक्छ।\n\n```text\nDatabase:\n2026-08-26\n\nUser in another timezone:\n2026-08-25\n```\n\nBug JavaScript मै छ भन्ने होइन। वास्तविक प्रश्न यो हो:\n\n> <b>तपाईंले पात्रोको मिति भन्न खोज्नुभयो, कि समयको क्षण?</b>\n\nती फरक अवधारणा हुन्।\n\n---\n\n### `Intl.DateTimeFormat`\n\n`` `${month}/${day}/${year}` `` जस्तो गरी हातले स्थानीयकृत मिति नबनाउनुहोस्। Internationalization API प्रयोग गर्नुहोस्:\n\n```javascript\nconst date = new Date(\"2026-08-26T12:00:00Z\");\n\nconst formatter = new Intl.DateTimeFormat(\"en-US\", {\n  timeZone: \"Asia/Tokyo\",\n  dateStyle: \"full\",\n  timeStyle: \"short\"\n});\n\nconsole.log(formatter.format(date));\n// Wednesday, August 26, 2026 at 9:00 PM\n```\n\nNew York का लागि:\n\n```javascript\nnew Intl.DateTimeFormat(\"en-US\", {\n  timeZone: \"America/New_York\",\n  dateStyle: \"full\",\n  timeStyle: \"short\"\n}).format(date);\n// Wednesday, August 26, 2026 at 8:00 AM\n```\n\n<b>क्षण कहिल्यै बदलिएन</b>। यसको प्रस्तुति मात्र बदलियो।\n\nLocale पनि बदल्न सक्नुहुन्छ:\n\n```javascript\nnew Intl.DateTimeFormat(\"en-US\").format(date);\nnew Intl.DateTimeFormat(\"en-GB\").format(date);\nnew Intl.DateTimeFormat(\"ja-JP\").format(date);\n```\n\nमहिना र दिनका नाम हातले ढाँचामा राख्नु भन्दा यो धेरै सुरक्षित छ।",
        jp: "システム間でやり取りするには、ISO 8601の文字列が一般に最も安全な形式です:\n\n```javascript\nconst date = new Date(\"2026-08-26T12:00:00Z\");\n```\n\n`new Date(\"08/26/2026\")` のような曖昧な文字列には注意してください。環境や前提の違いにより、ISO以外の形式は問題を起こしがちです。\n\n---\n\n### 典型的な日付のバグ\n\nこれは無害に見えます:\n\n```javascript\nconst date = new Date(\"2026-08-26\");\n\nconsole.log(date);\n```\n\n日付だけのISO文字列はUTC基準の日付として解釈されるため、<b>負のオフセットのタイムゾーンで表示すると暦の日がずれる</b>ことがあります。\n\n```text\nDatabase:\n2026-08-26\n\nUser in another timezone:\n2026-08-25\n```\n\nバグは必ずしもJavaScript側にありません。本当の問いはこれです:\n\n> <b>暦の日付のつもりだったのか、それとも時刻の瞬間のつもりだったのか?</b>\n\nこの2つは別の概念です。\n\n---\n\n### `Intl.DateTimeFormat`\n\n`` `${month}/${day}/${year}` `` のように手作業でローカライズしないでください。国際化APIを使います:\n\n```javascript\nconst date = new Date(\"2026-08-26T12:00:00Z\");\n\nconst formatter = new Intl.DateTimeFormat(\"en-US\", {\n  timeZone: \"Asia/Tokyo\",\n  dateStyle: \"full\",\n  timeStyle: \"short\"\n});\n\nconsole.log(formatter.format(date));\n// Wednesday, August 26, 2026 at 9:00 PM\n```\n\nニューヨークなら:\n\n```javascript\nnew Intl.DateTimeFormat(\"en-US\", {\n  timeZone: \"America/New_York\",\n  dateStyle: \"full\",\n  timeStyle: \"short\"\n}).format(date);\n// Wednesday, August 26, 2026 at 8:00 AM\n```\n\n<b>瞬間は変わっていません</b>。変わったのは見せ方だけです。\n\nロケールも変えられます:\n\n```javascript\nnew Intl.DateTimeFormat(\"en-US\").format(date);\nnew Intl.DateTimeFormat(\"en-GB\").format(date);\nnew Intl.DateTimeFormat(\"ja-JP\").format(date);\n```\n\n月名や曜日名を手で組み立てるよりずっと安全です。",
      },
      diagram: `Exchange format

"2026-08-26T12:00:00Z"     explicit instant, safest
"2026-08-26T21:00:00+09:00" explicit offset, also fine
"2026-08-26"                calendar date — no instant
"08/26/2026"                ambiguous, avoid


The date-only trap

new Date("2026-08-26")   → midnight UTC
        ↓ displayed in UTC-05:00
   2026-08-25            → yesterday


Display

Intl.DateTimeFormat(locale, { timeZone, dateStyle, timeStyle })
        ↓
one instant, formatted for whoever is reading`,
      codeExample: {
        title: { en: "ISO in, Intl out", np: "ISO भित्र, Intl बाहिर", jp: "入力はISO、出力はIntl" },
        code: `// ── 1. Basic — parse an explicit instant ──────────────────────────
const date = new Date("2026-08-26T12:00:00Z");

console.log(date.toISOString()); // "2026-08-26T12:00:00.000Z"

// Avoid ambiguous, non-ISO input
// new Date("08/26/2026"); // interpretation varies

// ── 2. Intermediate — the date-only trap ──────────────────────────
const calendarish = new Date("2026-08-26"); // midnight UTC, not a local day

// Displayed west of UTC this can read as 2026-08-25

// ── 3. Advanced — format, never hand-build ────────────────────────
const tokyo = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Tokyo",
  dateStyle: "full",
  timeStyle: "short"
});

const newYork = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  dateStyle: "full",
  timeStyle: "short"
});

console.log(tokyo.format(date));   // ...at 9:00 PM
console.log(newYork.format(date)); // ...at 8:00 AM

// Same instant, different locales
console.log(new Intl.DateTimeFormat("en-GB").format(date));
console.log(new Intl.DateTimeFormat("ja-JP").format(date));`,
      },
      keyTakeaways: [
        { en: "<b>ISO 8601</b> strings such as `\"2026-08-26T12:00:00Z\"` are the safest way to exchange instants.", np: "`\"2026-08-26T12:00:00Z\"` जस्ता <b>ISO 8601</b> string क्षण आदानप्रदान गर्ने सबैभन्दा सुरक्षित तरिका हुन्।", jp: "`\"2026-08-26T12:00:00Z\"` のような<b>ISO 8601</b>文字列が、瞬間をやり取りする最も安全な方法。" },
        { en: "Ambiguous formats like `\"08/26/2026\"` are interpreted differently across environments.", np: "`\"08/26/2026\"` जस्ता अस्पष्ट ढाँचा फरक वातावरणमा फरक तरिकाले व्याख्या हुन्छन्।", jp: "`\"08/26/2026\"` のような曖昧な形式は、環境ごとに解釈が異なる。" },
        { en: "A <b>date-only</b> string is read as midnight UTC, which can display as the previous day west of UTC.", np: "<b>Date-मात्र</b> string लाई UTC मध्यरात मानिन्छ, जुन UTC को पश्चिममा अघिल्लो दिन देखिन सक्छ।", jp: "<b>日付だけ</b>の文字列は真夜中UTCとして読まれ、UTCより西では前日として表示されうる。" },
        { en: "Ask whether you meant a <b>calendar date</b> or a <b>moment in time</b> — they are different concepts.", np: "तपाईंले <b>पात्रोको मिति</b> भन्न खोज्नुभयो कि <b>समयको क्षण</b> सोध्नुहोस् — ती फरक अवधारणा हुन्।", jp: "<b>暦の日付</b>のつもりか<b>時刻の瞬間</b>のつもりかを問う。この2つは別物。" },
        { en: "Use <b>`Intl.DateTimeFormat`</b> with a `timeZone` for display instead of building strings by hand.", np: "String हातले बनाउनुको साटो प्रदर्शनका लागि `timeZone` सहित <b>`Intl.DateTimeFormat`</b> प्रयोग गर्नुहोस्।", jp: "表示には文字列を手で組み立てず、`timeZone` を指定した<b>`Intl.DateTimeFormat`</b>を使う。" },
        { en: "Formatting changes only the <b>presentation</b>; the underlying instant stays the same.", np: "Formatting ले <b>प्रस्तुति</b> मात्र बदल्छ; अन्तर्निहित क्षण उही रहन्छ।", jp: "書式化が変えるのは<b>見せ方</b>だけ。元の瞬間は変わらない。" },
      ],
      commonMistakes: [
        { en: "<b>Treating a calendar date as an instant</b> — `new Date(\"2026-08-26\")` is midnight UTC, so a user west of UTC sees the 25th.", np: "<b>पात्रोको मितिलाई क्षण मान्नु</b> — `new Date(\"2026-08-26\")` UTC मध्यरात हो, त्यसैले UTC को पश्चिमका user ले 25 देख्छन्।", jp: "<b>暦の日付を瞬間として扱う</b> — `new Date(\"2026-08-26\")` は真夜中UTCなので、UTCより西のユーザーには25日に見える。" },
        { en: "<b>Parsing non-ISO strings</b> — `new Date(\"08/26/2026\")` relies on environment-specific interpretation. Send ISO 8601 instead.", np: "<b>Non-ISO string parse गर्नु</b> — `new Date(\"08/26/2026\")` वातावरण-निर्भर व्याख्यामा भर पर्छ। बरु ISO 8601 पठाउनुहोस्।", jp: "<b>ISO以外の文字列を解析する</b> — `new Date(\"08/26/2026\")` は環境依存の解釈に頼る。ISO 8601を送る。" },
        { en: "<b>Hand-building localized output</b> — `` `${month}/${day}/${year}` `` gets month names, ordering and locales wrong. Use `Intl.DateTimeFormat`.", np: "<b>हातले स्थानीयकृत output बनाउनु</b> — `` `${month}/${day}/${year}` `` ले महिनाको नाम, क्रम र locale गलत पार्छ। `Intl.DateTimeFormat` प्रयोग गर्नुहोस्।", jp: "<b>ローカライズ表示を手で組み立てる</b> — `` `${month}/${day}/${year}` `` は月名・順序・ロケールを誤る。`Intl.DateTimeFormat` を使う。" },
      ],
      quiz: [
        {
          question: { en: "Which API should you use for timezone-aware display?", np: "Timezone-सचेत प्रदर्शनका लागि कुन API प्रयोग गर्नुपर्छ?", jp: "タイムゾーンを考慮した表示にはどのAPIを使うべきか?" },
          options: [
            { en: "`parseInt()`", np: "`parseInt()`", jp: "`parseInt()`" },
            { en: "`Object.keys()`", np: "`Object.keys()`", jp: "`Object.keys()`" },
            { en: "`JSON.stringify()`", np: "`JSON.stringify()`", jp: "`JSON.stringify()`" },
            { en: "`Intl.DateTimeFormat`", np: "`Intl.DateTimeFormat`", jp: "`Intl.DateTimeFormat`" },
          ],
          correctIndex: 3,
          explanation: { en: "It takes a `timeZone` option and handles locale rules for you.", np: "यसले `timeZone` option लिन्छ र locale नियम आफैं सम्हाल्छ।", jp: "`timeZone` オプションを受け取り、ロケールの規則も処理してくれる。" },
        },
        {
          question: { en: "Why can `const birthday = new Date(\"2026-08-26\")` be dangerous?", np: "`const birthday = new Date(\"2026-08-26\")` किन खतरनाक हुन सक्छ?", jp: "`const birthday = new Date(\"2026-08-26\")` はなぜ危険か?" },
          options: [
            { en: "It may treat a calendar date as an instant and cause timezone-related date shifts", np: "यसले पात्रोको मितिलाई क्षण मान्न सक्छ र timezone-सम्बन्धी मिति सर्न सक्छ", jp: "暦の日付を瞬間として扱い、タイムゾーンによる日付のずれを起こしうるから" },
            { en: "`Date` cannot store years", np: "`Date` ले वर्ष राख्न सक्दैन", jp: "`Date` は年を保持できないから" },
            { en: "`Date` only works in UTC", np: "`Date` UTC मा मात्र काम गर्छ", jp: "`Date` はUTCでしか動かないから" },
            { en: "It always returns `NaN`", np: "यसले सधैं `NaN` फर्काउँछ", jp: "常に `NaN` を返すから" },
          ],
          correctIndex: 0,
          explanation: { en: "Midnight UTC displayed west of UTC lands on the previous calendar day.", np: "UTC मध्यरात UTC को पश्चिममा देखाउँदा अघिल्लो पात्रो दिनमा पर्छ।", jp: "真夜中UTCをUTCより西で表示すると、前日の暦日になる。" },
        },
        {
          question: { en: "Which is the best representation for an exact instant sent between a backend and frontend?", np: "Backend र frontend बीच पठाइने ठ्याक्कै क्षणका लागि उत्तम प्रतिनिधित्व कुन हो?", jp: "バックエンドとフロントエンド間で送る正確な瞬間の最適な表現は?" },
          options: [
            { en: "`\"August 26, 2026\"`", np: "`\"August 26, 2026\"`", jp: "`\"August 26, 2026\"`" },
            { en: "`\"2026-08-26T12:00:00Z\"`", np: "`\"2026-08-26T12:00:00Z\"`", jp: "`\"2026-08-26T12:00:00Z\"`" },
            { en: "`\"08/26/26\"`", np: "`\"08/26/26\"`", jp: "`\"08/26/26\"`" },
            { en: "`\"Wednesday\"`", np: "`\"Wednesday\"`", jp: "`\"Wednesday\"`" },
          ],
          correctIndex: 1,
          explanation: { en: "ISO 8601 with an explicit `Z` leaves no room for interpretation.", np: "स्पष्ट `Z` सहितको ISO 8601 ले व्याख्याको ठाउँ छोड्दैन।", jp: "明示的な `Z` を持つISO 8601なら解釈の余地がない。" },
        },
      ],
    },
    {
      id: "dates-timezones-temporal",
      title: { en: "Timezones, DST & Temporal", np: "Timezone, DST र Temporal", jp: "タイムゾーン・DST・Temporal" },
      durationMinutes: 9,
      explanation: {
        en: "Never assume every day has exactly 24 local hours. Daylight Saving Time can change the length of a local calendar day.\n\n```text\nUTC\n│\n├── Instant\n│\n├── America/New_York\n│      ↓ DST rules\n│\n├── Europe/London\n│      ↓ DST rules\n│\n└── Asia/Tokyo\n       ↓ no DST currently\n```\n\nThis is why code like:\n\n```javascript\ndate.setHours(date.getHours() + 24);\n```\n\nis not always equivalent to \"give me the same local time tomorrow\". <b>Calendar arithmetic and elapsed-time arithmetic are different problems.</b>\n\n---\n\n### The Temporal API\n\nThe modern JavaScript solution to many of these problems is the <b>Temporal API</b>. Instead of forcing everything into one `Date` object, Temporal provides types that express what you actually mean:\n\n```text\nTemporal.Instant         an exact moment in time\nTemporal.PlainDate       a calendar date, no time or timezone\nTemporal.PlainTime       a time of day, no date\nTemporal.ZonedDateTime   date + time + timezone\n```\n\nFor example:\n\n```javascript\nconst birthday = Temporal.PlainDate.from(\"1996-10-11\");\n\nconsole.log(birthday);\n// 1996-10-11\n```\n\nThat is fundamentally different from `new Date(\"1996-10-11\")`, because a birthday is normally a <b>calendar date</b>, not an instant occurring at midnight UTC.\n\n---\n\n### Temporal examples\n\nFor an exact moment:\n\n```javascript\nconst instant = Temporal.Instant.from(\"2026-08-26T12:00:00Z\");\n```\n\nFor a timezone-aware appointment:\n\n```javascript\nconst appointment = Temporal.ZonedDateTime.from(\n  \"2026-08-26T21:00:00+09:00[Asia/Tokyo]\"\n);\n```\n\nNow the timezone is <b>part of the value</b> instead of an assumption hidden somewhere in your application.\n\n---\n\n### Date vs Temporal\n\n```text\nProblem                     Date        Temporal\n──────────────────────────────────────────────────────\nExact instant               yes         Instant\nCalendar date               awkward     PlainDate\nTime only                   awkward     PlainTime\nTimezone-aware date/time    awkward     ZonedDateTime\nImmutable                   no          yes\nClear timezone semantics    unclear     yes\n```\n\n<b>Important:</b> Temporal availability depends on your runtime. Where it isn't natively available, use a polyfill or a well-maintained date/time library.\n\n---\n\n### Four rules to remember\n\n<b>1. Store instants in UTC.</b>\n\n<b>2. Don't manually calculate timezones.</b>\n\n<b>3. Distinguish a calendar date from an instant.</b>\n\n<b>4. Use `Intl.DateTimeFormat` for display, and Temporal when your environment supports it.</b>",
        np: "हरेक दिन ठ्याक्कै 24 स्थानीय घण्टाको हुन्छ भन्ने कहिल्यै नठान्नुहोस्। Daylight Saving Time ले स्थानीय पात्रो दिनको लम्बाइ बदल्न सक्छ।\n\n```text\nUTC\n│\n├── Instant\n│\n├── America/New_York\n│      ↓ DST rules\n│\n├── Europe/London\n│      ↓ DST rules\n│\n└── Asia/Tokyo\n       ↓ no DST currently\n```\n\nत्यसैले यस्तो code:\n\n```javascript\ndate.setHours(date.getHours() + 24);\n```\n\nसधैं \"भोलि उही स्थानीय समय देऊ\" सँग बराबर हुँदैन। <b>पात्रो गणित र बितेको समयको गणित फरक समस्या हुन्।</b>\n\n---\n\n### Temporal API\n\nयीमध्ये धेरै समस्याको आधुनिक JavaScript समाधान <b>Temporal API</b> हो। सबै कुरा एउटै `Date` object मा कोच्नुको साटो, Temporal ले तपाईंले वास्तवमा भन्न खोजेको कुरा जनाउने type दिन्छ:\n\n```text\nTemporal.Instant         an exact moment in time\nTemporal.PlainDate       a calendar date, no time or timezone\nTemporal.PlainTime       a time of day, no date\nTemporal.ZonedDateTime   date + time + timezone\n```\n\nउदाहरणका लागि:\n\n```javascript\nconst birthday = Temporal.PlainDate.from(\"1996-10-11\");\n\nconsole.log(birthday);\n// 1996-10-11\n```\n\nयो `new Date(\"1996-10-11\")` भन्दा मौलिक रूपमै फरक हो, किनकि जन्मदिन सामान्यतया <b>पात्रोको मिति</b> हो, UTC मध्यरातमा हुने क्षण होइन।\n\n---\n\n### Temporal उदाहरण\n\nठ्याक्कै क्षणका लागि:\n\n```javascript\nconst instant = Temporal.Instant.from(\"2026-08-26T12:00:00Z\");\n```\n\nTimezone-सचेत appointment का लागि:\n\n```javascript\nconst appointment = Temporal.ZonedDateTime.from(\n  \"2026-08-26T21:00:00+09:00[Asia/Tokyo]\"\n);\n```\n\nअब timezone तपाईंको application मा कतै लुकेको अनुमान नभई <b>value कै भाग</b> हो।\n\n---\n\n### Date vs Temporal\n\n```text\nProblem                     Date        Temporal\n──────────────────────────────────────────────────────\nExact instant               yes         Instant\nCalendar date               awkward     PlainDate\nTime only                   awkward     PlainTime\nTimezone-aware date/time    awkward     ZonedDateTime\nImmutable                   no          yes\nClear timezone semantics    unclear     yes\n```\n\n<b>महत्वपूर्ण:</b> Temporal उपलब्ध छ कि छैन तपाईंको runtime मा भर पर्छ। मूल रूपमा उपलब्ध नभएको ठाउँमा polyfill वा राम्ररी मर्मत गरिएको date/time library प्रयोग गर्नुहोस्।\n\n---\n\n### सम्झनुपर्ने चार नियम\n\n<b>1. क्षण UTC मा राख्नुहोस्।</b>\n\n<b>2. Timezone हातले गणना नगर्नुहोस्।</b>\n\n<b>3. पात्रोको मिति र क्षण छुट्याउनुहोस्।</b>\n\n<b>4. प्रदर्शनका लागि `Intl.DateTimeFormat`, र वातावरणले समर्थन गरे Temporal प्रयोग गर्नुहोस्।</b>",
        jp: "すべての日がちょうど24ローカル時間だと思い込まないでください。サマータイムはローカルの暦日の長さを変えます。\n\n```text\nUTC\n│\n├── Instant\n│\n├── America/New_York\n│      ↓ DST rules\n│\n├── Europe/London\n│      ↓ DST rules\n│\n└── Asia/Tokyo\n       ↓ no DST currently\n```\n\nだから次のようなコード:\n\n```javascript\ndate.setHours(date.getHours() + 24);\n```\n\nは「明日の同じローカル時刻」と常に同じではありません。<b>暦の計算と経過時間の計算は別の問題です。</b>\n\n---\n\n### Temporal API\n\nこれらの問題に対する現代的な解決策が<b>Temporal API</b>です。すべてを1つの `Date` に押し込む代わりに、意図をそのまま表す型を提供します:\n\n```text\nTemporal.Instant         an exact moment in time\nTemporal.PlainDate       a calendar date, no time or timezone\nTemporal.PlainTime       a time of day, no date\nTemporal.ZonedDateTime   date + time + timezone\n```\n\n例:\n\n```javascript\nconst birthday = Temporal.PlainDate.from(\"1996-10-11\");\n\nconsole.log(birthday);\n// 1996-10-11\n```\n\nこれは `new Date(\"1996-10-11\")` とは本質的に違います。誕生日はふつう<b>暦の日付</b>であり、真夜中UTCに起こる瞬間ではないからです。\n\n---\n\n### Temporalの例\n\n正確な瞬間:\n\n```javascript\nconst instant = Temporal.Instant.from(\"2026-08-26T12:00:00Z\");\n```\n\nタイムゾーン付きの予定:\n\n```javascript\nconst appointment = Temporal.ZonedDateTime.from(\n  \"2026-08-26T21:00:00+09:00[Asia/Tokyo]\"\n);\n```\n\nこれでタイムゾーンは、アプリのどこかに隠れた前提ではなく<b>値の一部</b>になります。\n\n---\n\n### DateとTemporal\n\n```text\nProblem                     Date        Temporal\n──────────────────────────────────────────────────────\nExact instant               yes         Instant\nCalendar date               awkward     PlainDate\nTime only                   awkward     PlainTime\nTimezone-aware date/time    awkward     ZonedDateTime\nImmutable                   no          yes\nClear timezone semantics    unclear     yes\n```\n\n<b>重要:</b> Temporalが使えるかはランタイム次第です。ネイティブに使えない環境では、ポリフィルか十分に保守された日時ライブラリを使ってください。\n\n---\n\n### 覚えておく4つの規則\n\n<b>1. 瞬間はUTCで保存する。</b>\n\n<b>2. タイムゾーンを手計算しない。</b>\n\n<b>3. 暦の日付と瞬間を区別する。</b>\n\n<b>4. 表示には `Intl.DateTimeFormat`、環境が対応していればTemporalを使う。</b>",
      },
      diagram: `Date represents an instant
        ↓
Internally based on UTC milliseconds
        ↓
Local methods display/use local timezone
        ↓
UTC methods display/use UTC
        ↓
Intl.DateTimeFormat handles presentation
        ↓
Temporal provides clearer date/time types


Problem                     Date        Temporal
──────────────────────────────────────────────────────
Exact instant               yes         Instant
Calendar date               awkward     PlainDate
Time only                   awkward     PlainTime
Timezone-aware date/time    awkward     ZonedDateTime
Immutable                   no          yes`,
      codeExample: {
        title: { en: "Why 24 hours is not a day, and what Temporal fixes", np: "24 घण्टा किन दिन होइन, र Temporal ले के ठीक गर्छ", jp: "24時間が1日でない理由と、Temporalが直すもの" },
        code: `// ── 1. Basic — adding 24 hours is not "tomorrow, same time" ───────
const date = new Date("2026-03-08T12:00:00Z");

date.setHours(date.getHours() + 24); // elapsed time, not calendar time
// Across a DST boundary the local clock time can shift

// ── 2. Intermediate — never hand-roll a timezone offset ───────────
// const japanTime = utcHours + 9; // wrong: offsets and DST vary

console.log(
  new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    dateStyle: "full",
    timeStyle: "short"
  }).format(new Date("2026-08-26T12:00:00Z"))
);

// ── 3. Advanced — Temporal says what you actually mean ────────────
// A birthday is a calendar date, not an instant at midnight UTC
const birthday = Temporal.PlainDate.from("1996-10-11");

// An exact moment
const instant = Temporal.Instant.from("2026-08-26T12:00:00Z");

// A meeting, with its timezone carried inside the value
const appointment = Temporal.ZonedDateTime.from(
  "2026-08-26T21:00:00+09:00[Asia/Tokyo]"
);

console.log(birthday.toString());    // 1996-10-11
console.log(instant.toString());     // 2026-08-26T12:00:00Z
console.log(appointment.toString()); // 2026-08-26T21:00:00+09:00[Asia/Tokyo]`,
      },
      keyTakeaways: [
        { en: "Not every local day has 24 hours — <b>DST</b> changes the length of a calendar day.", np: "हरेक स्थानीय दिन 24 घण्टाको हुँदैन — <b>DST</b> ले पात्रो दिनको लम्बाइ बदल्छ।", jp: "すべてのローカル日が24時間とは限らない。<b>サマータイム</b>が暦日の長さを変える。" },
        { en: "<b>Calendar arithmetic</b> and <b>elapsed-time arithmetic</b> are different problems.", np: "<b>पात्रो गणित</b> र <b>बितेको समयको गणित</b> फरक समस्या हुन्।", jp: "<b>暦の計算</b>と<b>経過時間の計算</b>は別の問題。" },
        { en: "Never add a fixed offset by hand; offsets and DST rules vary by zone and by date.", np: "स्थिर offset हातले कहिल्यै नथप्नुहोस्; offset र DST नियम zone र मिति अनुसार फरक हुन्छन्।", jp: "固定のオフセットを手で足さない。オフセットもDSTの規則もゾーンと日付で変わる。" },
        { en: "<b>Temporal</b> offers `Instant`, `PlainDate`, `PlainTime` and `ZonedDateTime` so a value says what it means.", np: "<b>Temporal</b> ले `Instant`, `PlainDate`, `PlainTime` र `ZonedDateTime` दिन्छ ताकि value ले आफ्नो अर्थ आफैं बताओस्।", jp: "<b>Temporal</b> は `Instant`・`PlainDate`・`PlainTime`・`ZonedDateTime` を提供し、値自身が意味を語る。" },
        { en: "Temporal values are <b>immutable</b>, unlike `Date`.", np: "Temporal का value <b>immutable</b> हुन्छन्, `Date` भन्दा फरक।", jp: "Temporalの値は `Date` と違って<b>イミュータブル</b>。" },
        { en: "Temporal availability depends on the runtime; use a polyfill or a maintained library where it is missing.", np: "Temporal उपलब्धता runtime मा भर पर्छ; नभएको ठाउँमा polyfill वा मर्मत गरिएको library प्रयोग गर्नुहोस्।", jp: "Temporalが使えるかはランタイム次第。ない環境ではポリフィルか保守されたライブラリを使う。" },
      ],
      commonMistakes: [
        { en: "<b>Manually converting timezones</b> — `const japanTime = utcTime + 9;` ignores DST and per-zone rules. Format with a `timeZone` option instead.", np: "<b>Timezone हातले बदल्नु</b> — `const japanTime = utcTime + 9;` ले DST र zone-अनुसारका नियम बेवास्ता गर्छ। बरु `timeZone` option ले format गर्नुहोस्।", jp: "<b>タイムゾーンを手で変換する</b> — `const japanTime = utcTime + 9;` はDSTやゾーン固有の規則を無視する。`timeZone` オプションで書式化する。" },
        { en: "<b>Adding 24 hours to mean \"tomorrow\"</b> — across a DST boundary the local clock time shifts. Calendar steps and duration steps differ.", np: "<b>\"भोलि\" भन्न 24 घण्टा थप्नु</b> — DST सीमा पार गर्दा स्थानीय घडी समय सर्छ। पात्रो चरण र अवधि चरण फरक हुन्छन्।", jp: "<b>「明日」のつもりで24時間足す</b> — DSTの境界をまたぐとローカル時刻がずれる。暦の刻みと期間の刻みは違う。" },
        { en: "<b>Using `Date` for something that has no time</b> — a birthday is a `PlainDate`, not an instant at midnight UTC.", np: "<b>समय नभएको कुराका लागि `Date` प्रयोग गर्नु</b> — जन्मदिन `PlainDate` हो, UTC मध्यरातको क्षण होइन।", jp: "<b>時刻のないものに `Date` を使う</b> — 誕生日は `PlainDate` であって、真夜中UTCの瞬間ではない。" },
      ],
      quiz: [
        {
          question: { en: "What does `Temporal.PlainDate.from(\"2026-08-26\")` represent?", np: "`Temporal.PlainDate.from(\"2026-08-26\")` ले के जनाउँछ?", jp: "`Temporal.PlainDate.from(\"2026-08-26\")` は何を表すか?" },
          options: [
            { en: "An exact UTC instant", np: "ठ्याक्कै UTC क्षण", jp: "正確なUTCの瞬間" },
            { en: "A Unix timestamp", np: "Unix timestamp", jp: "Unixタイムスタンプ" },
            { en: "A calendar date without a timezone", np: "Timezone बिनाको पात्रो मिति", jp: "タイムゾーンのない暦の日付" },
            { en: "A timezone offset", np: "Timezone offset", jp: "タイムゾーンのオフセット" },
          ],
          correctIndex: 2,
          explanation: { en: "That is exactly the concept `new Date(\"2026-08-26\")` fails to express.", np: "`new Date(\"2026-08-26\")` ले व्यक्त गर्न नसक्ने ठ्याक्कै यही अवधारणा हो।", jp: "まさに `new Date(\"2026-08-26\")` が表現できない概念。" },
        },
        {
          question: { en: "Why is `date.setHours(date.getHours() + 24)` not always \"tomorrow, same local time\"?", np: "`date.setHours(date.getHours() + 24)` किन सधैं \"भोलि, उही स्थानीय समय\" हुँदैन?", jp: "なぜ `date.setHours(date.getHours() + 24)` は必ずしも「明日の同じローカル時刻」ではないのか?" },
          options: [
            { en: "Because DST can make a local day shorter or longer than 24 hours", np: "किनकि DST ले स्थानीय दिनलाई 24 घण्टा भन्दा छोटो वा लामो बनाउन सक्छ", jp: "サマータイムによりローカルの1日が24時間より短くも長くもなりうるから" },
            { en: "Because `setHours` is asynchronous", np: "किनकि `setHours` asynchronous छ", jp: "`setHours` が非同期だから" },
            { en: "Because `Date` cannot store hours", np: "किनकि `Date` ले घण्टा राख्न सक्दैन", jp: "`Date` が時間を保持できないから" },
          ],
          correctIndex: 0,
          explanation: { en: "Elapsed-time arithmetic and calendar arithmetic answer different questions.", np: "बितेको समयको गणित र पात्रो गणितले फरक प्रश्नको जवाफ दिन्छन्।", jp: "経過時間の計算と暦の計算は別の問いに答えている。" },
        },
        {
          question: { en: "Which Temporal type carries its timezone inside the value?", np: "कुन Temporal type ले आफ्नो timezone value भित्रै बोक्छ?", jp: "タイムゾーンを値の中に持つTemporalの型はどれか?" },
          options: [
            { en: "`Temporal.Instant`", np: "`Temporal.Instant`", jp: "`Temporal.Instant`" },
            { en: "`Temporal.ZonedDateTime`", np: "`Temporal.ZonedDateTime`", jp: "`Temporal.ZonedDateTime`" },
            { en: "`Temporal.PlainTime`", np: "`Temporal.PlainTime`", jp: "`Temporal.PlainTime`" },
          ],
          correctIndex: 1,
          explanation: { en: "`\"2026-08-26T21:00:00+09:00[Asia/Tokyo]\"` states the zone explicitly.", np: "`\"2026-08-26T21:00:00+09:00[Asia/Tokyo]\"` ले zone स्पष्ट रूपमा बताउँछ।", jp: "`\"2026-08-26T21:00:00+09:00[Asia/Tokyo]\"` はゾーンを明示している。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "What does the `Z` mean in `new Date(\"2026-08-26T12:00:00Z\")`?", np: "`new Date(\"2026-08-26T12:00:00Z\")` मा `Z` को अर्थ के हो?", jp: "`new Date(\"2026-08-26T12:00:00Z\")` の `Z` は何を意味するか?" },
      options: [
        { en: "UTC", np: "UTC", jp: "UTC" },
        { en: "Local time", np: "स्थानीय समय", jp: "ローカル時刻" },
        { en: "Japan time", np: "जापान समय", jp: "日本時間" },
        { en: "Daylight Saving Time", np: "Daylight Saving Time", jp: "サマータイム" },
      ],
      correctIndex: 0,
      explanation: { en: "`Z` marks a zero UTC offset in ISO 8601.", np: "`Z` ले ISO 8601 मा शून्य UTC offset जनाउँछ।", jp: "`Z` はISO 8601でUTCオフセット0を示す。" },
    },
    {
      question: { en: "Which API should you use for timezone-aware display?", np: "Timezone-सचेत प्रदर्शनका लागि कुन API प्रयोग गर्नुपर्छ?", jp: "タイムゾーンを考慮した表示にはどのAPIを使うべきか?" },
      options: [
        { en: "`parseInt()`", np: "`parseInt()`", jp: "`parseInt()`" },
        { en: "`Intl.DateTimeFormat`", np: "`Intl.DateTimeFormat`", jp: "`Intl.DateTimeFormat`" },
        { en: "`JSON.stringify()`", np: "`JSON.stringify()`", jp: "`JSON.stringify()`" },
        { en: "`Object.keys()`", np: "`Object.keys()`", jp: "`Object.keys()`" },
      ],
      correctIndex: 1,
      explanation: { en: "Pass a `timeZone` and let it handle locale and DST rules.", np: "`timeZone` दिनुहोस् र locale र DST नियम यसैले सम्हालोस्।", jp: "`timeZone` を渡せば、ロケールとDSTの規則を任せられる。" },
    },
    {
      question: { en: "What does `Temporal.PlainDate.from(\"2026-08-26\")` represent?", np: "`Temporal.PlainDate.from(\"2026-08-26\")` ले के जनाउँछ?", jp: "`Temporal.PlainDate.from(\"2026-08-26\")` は何を表すか?" },
      options: [
        { en: "An exact UTC instant", np: "ठ्याक्कै UTC क्षण", jp: "正確なUTCの瞬間" },
        { en: "A Unix timestamp", np: "Unix timestamp", jp: "Unixタイムスタンプ" },
        { en: "A calendar date without a timezone", np: "Timezone बिनाको पात्रो मिति", jp: "タイムゾーンのない暦の日付" },
        { en: "A timezone offset", np: "Timezone offset", jp: "タイムゾーンのオフセット" },
      ],
      correctIndex: 2,
      explanation: { en: "A birthday is a calendar date, not a moment at midnight UTC.", np: "जन्मदिन पात्रोको मिति हो, UTC मध्यरातको क्षण होइन।", jp: "誕生日は暦の日付であり、真夜中UTCの瞬間ではない。" },
    },
    {
      question: { en: "Why can `const birthday = new Date(\"2026-08-26\")` be dangerous?", np: "`const birthday = new Date(\"2026-08-26\")` किन खतरनाक हुन सक्छ?", jp: "`const birthday = new Date(\"2026-08-26\")` はなぜ危険か?" },
      options: [
        { en: "`Date` cannot store years", np: "`Date` ले वर्ष राख्न सक्दैन", jp: "`Date` は年を保持できないから" },
        { en: "It always returns `NaN`", np: "यसले सधैं `NaN` फर्काउँछ", jp: "常に `NaN` を返すから" },
        { en: "`Date` only works in UTC", np: "`Date` UTC मा मात्र काम गर्छ", jp: "`Date` はUTCでしか動かないから" },
        { en: "It may treat a calendar date as an instant and cause timezone-related date shifts", np: "यसले पात्रोको मितिलाई क्षण मान्न सक्छ र timezone-सम्बन्धी मिति सर्न सक्छ", jp: "暦の日付を瞬間として扱い、タイムゾーンによる日付のずれを起こしうるから" },
      ],
      correctIndex: 3,
      explanation: { en: "The string is read as midnight UTC, so western timezones show the previous day.", np: "String लाई UTC मध्यरात मानिन्छ, त्यसैले पश्चिमी timezone ले अघिल्लो दिन देखाउँछन्।", jp: "文字列は真夜中UTCとして読まれるため、西側のタイムゾーンでは前日になる。" },
    },
    {
      question: { en: "Which is the best representation for an exact instant sent between a backend and frontend?", np: "Backend र frontend बीच पठाइने ठ्याक्कै क्षणका लागि उत्तम प्रतिनिधित्व कुन हो?", jp: "バックエンドとフロントエンド間で送る正確な瞬間の最適な表現は?" },
      options: [
        { en: "`\"2026-08-26T12:00:00Z\"`", np: "`\"2026-08-26T12:00:00Z\"`", jp: "`\"2026-08-26T12:00:00Z\"`" },
        { en: "`\"08/26/26\"`", np: "`\"08/26/26\"`", jp: "`\"08/26/26\"`" },
        { en: "`\"August 26, 2026\"`", np: "`\"August 26, 2026\"`", jp: "`\"August 26, 2026\"`" },
        { en: "`\"Wednesday\"`", np: "`\"Wednesday\"`", jp: "`\"Wednesday\"`" },
      ],
      correctIndex: 0,
      explanation: { en: "ISO 8601 with an explicit offset removes all ambiguity.", np: "स्पष्ट offset सहितको ISO 8601 ले सबै अस्पष्टता हटाउँछ।", jp: "明示的なオフセット付きのISO 8601なら曖昧さがなくなる。" },
    },
    {
      question: { en: "What does a `Date` object store internally?", np: "`Date` object ले भित्री रूपमा के राख्छ?", jp: "`Date` オブジェクトは内部で何を保持するか?" },
      options: [
        { en: "A local formatted string", np: "स्थानीय ढाँचाबद्ध string", jp: "ローカルの書式化文字列" },
        { en: "Milliseconds since the Unix epoch, in UTC", np: "Unix epoch देखिको millisecond, UTC मा", jp: "UTCでのUnixエポックからのミリ秒" },
        { en: "A timezone name", np: "Timezone को नाम", jp: "タイムゾーン名" },
      ],
      correctIndex: 1,
      explanation: { en: "Local hours and formatted output are all derived from that single number.", np: "स्थानीय घण्टा र ढाँचाबद्ध output सबै त्यही एउटा संख्याबाट निस्कन्छन्।", jp: "ローカルの時刻も書式化された出力も、すべてその1つの数値から導かれる。" },
    },
    {
      question: { en: "Is a `Date` object immutable?", np: "`Date` object immutable हो?", jp: "`Date` オブジェクトはイミュータブルか?" },
      options: [
        { en: "No — `setDate()` changes the object every reference shares", np: "होइन — `setDate()` ले हरेक reference ले बाँड्ने object बदल्छ", jp: "いいえ。`setDate()` はすべての参照が共有するオブジェクトを変える" },
        { en: "Yes", np: "हो", jp: "はい" },
      ],
      correctIndex: 0,
      explanation: { en: "Copy with `new Date(original)` before mutating; Temporal values are immutable.", np: "Mutate गर्नुअघि `new Date(original)` ले copy गर्नुहोस्; Temporal का value immutable हुन्छन्।", jp: "変更前に `new Date(original)` でコピーする。Temporalの値はイミュータブル。" },
    },
    {
      question: { en: "Why should you avoid `const japanTime = utcTime + 9`?", np: "`const japanTime = utcTime + 9` किन बच्नुपर्छ?", jp: "なぜ `const japanTime = utcTime + 9` を避けるべきか?" },
      options: [
        { en: "`utcTime` is always a string", np: "`utcTime` सधैं string हुन्छ", jp: "`utcTime` は常に文字列だから" },
        { en: "Addition is slow", np: "जोड ढिलो हुन्छ", jp: "足し算が遅いから" },
        { en: "Offsets and DST rules vary by zone and date, so a fixed number is wrong", np: "Offset र DST नियम zone र मिति अनुसार फरक हुन्छन्, त्यसैले स्थिर संख्या गलत हो", jp: "オフセットもDSTの規則もゾーンと日付で変わるため、固定の数値では誤りになるから" },
      ],
      correctIndex: 2,
      explanation: { en: "Format with a `timeZone` option and let the platform apply the rules.", np: "`timeZone` option ले format गर्नुहोस् र platform लाई नियम लागू गर्न दिनुहोस्।", jp: "`timeZone` オプションで書式化し、規則の適用はプラットフォームに任せる。" },
    },
    {
      question: { en: "Which Temporal type expresses a moment together with its timezone?", np: "कुन Temporal type ले क्षणलाई यसको timezone सँगै व्यक्त गर्छ?", jp: "瞬間とタイムゾーンを一緒に表すTemporalの型はどれか?" },
      options: [
        { en: "`Temporal.PlainDate`", np: "`Temporal.PlainDate`", jp: "`Temporal.PlainDate`" },
        { en: "`Temporal.ZonedDateTime`", np: "`Temporal.ZonedDateTime`", jp: "`Temporal.ZonedDateTime`" },
        { en: "`Temporal.PlainTime`", np: "`Temporal.PlainTime`", jp: "`Temporal.PlainTime`" },
      ],
      correctIndex: 1,
      explanation: { en: "The zone lives in the value, not in an assumption elsewhere in your code.", np: "Zone value मै रहन्छ, तपाईंको code मा अन्यत्र लुकेको अनुमानमा होइन।", jp: "ゾーンは値の中にあり、コードのどこかの前提に隠れていない。" },
    },
  ],
};
