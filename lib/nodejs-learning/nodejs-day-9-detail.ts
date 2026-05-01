import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_9_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Validation** is the gate between “messy HTTP JSON” and “trustworthy database documents.” Mongoose validators run **before** writes; combine them with **request-layer** schemas (`Joi`, **`zod`**) so malicious or malformed clients never reach expensive database work.",
      np: "प्रमाणीकरण — HTTP र DB बीच गेट।",
      jp: "**検証** は HTTP と DB の間の関所。二段で守る。",
    },
    {
      en: "Projects on this day wire **Genres** and **Customers** APIs to persistence—your routes stay thin because validation errors translate into consistent **`400`** responses with field-level messages.",
      np: "Genres/Customers परियोजना — पातलो रूट, स्पष्ट 400।",
      jp: "**Genres / Customers** で永続化とエラー形式を揃える。",
    },
  ],
  sections: [
    {
      title: { en: "Validation layers — schema-first", np: "प्रमाणीकरण तह", jp: "検証の層" },
      blocks: [
        {
          type: "code",
          title: { en: "Mongoose validators on the schema", np: "schema प्रमाणीकरण", jp: "スキーマでの検証" },
          code: `const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true,
  },
});`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Built-in validators** (`required`, `minlength`, `enum`, numeric **min/max**) express obvious rules declaratively. **Custom validators** add business checks (e.g., string format) synchronously. **Async validators** hit the database for uniqueness—keep them quick and avoid N+1 patterns.",
            np: "बिल्ट-इन र कस्टम — असिंक अद्वितीयता छिटो राख्नुहोस्।",
            jp: "**組み込み**で基本ルール。**非同期**は一意性など DB が必要なときだけ。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Where each validator type runs — pick the lightest tool that still guarantees correctness",
            np: "प्रमाणीकरण प्रकार तुलना",
            jp: "バリデータの種類",
          },
          headers: [
            { en: "Kind", np: "प्रकार", jp: "種類" },
            { en: "Good for", np: "का लागि", jp: "向く場面" },
            { en: "Watch out", np: "सावधानी", jp: "注意" },
          ],
          rows: [
            [
              { en: "**Built-in** (`required`, `enum`)", np: "बिल्ट-इन", jp: "**組み込み**" },
              { en: "Simple shape rules everyone agrees on", np: "साधारण नियम", jp: "型・必須・列挙" },
              { en: "Still combine with HTTP-layer validation", np: "HTTP तह पनि", jp: "HTTP 検証も併用" },
            ],
            [
              { en: "**Custom sync**", np: "कस्टम सिंक", jp: "**カスタム同期**" },
              { en: "Regex or cross-field checks without I/O", np: "regex", jp: "正規表現・フィールド間" },
              { en: "Keep deterministic—no surprise DB calls", np: "DB अन्तर्वस्तु होइन", jp: "DB を挟まない" },
            ],
            [
              { en: "**Async**", np: "असिंक", jp: "**非同期**" },
              { en: "Uniqueness against the database", np: "अद्वितीयता", jp: "一意性チェック" },
              { en: "Slow validators delay saves—index fields", np: "छिटो राख्नुहोस्", jp: "遅くならないよう索引" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "**`ValidationError`** exposes **`.errors`** per field—map those keys to HTTP **`400`** JSON so clients can highlight inputs. Reject bad payloads **before** expensive work—never rely on the database alone to “fix” bad strings.",
            np: "`ValidationError` लाई फिल्ड अनुसार 400 मा।",
            jp: "**ValidationError** をフィールド単位で返す。DB に頼りすぎない。",
          },
        },
      ],
    },
    {
      title: {
        en: "Projects — persistence & project structure",
        np: "परियोजना र संरचना",
        jp: "プロジェクトと構成",
      },
      blocks: [
        {
          type: "code",
          title: { en: "Keep routes thin — folders carry structure", np: "पातलो रूट", jp: "薄いルート" },
          code: `/*
routes/genres.js   ← HTTP only
models/genre.js    ← Mongoose schema + methods
validators/genre.js ← reuse from POST/PUT handlers
*/`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Genres API** — swap in-memory arrays for **`Genre`** documents; keep route URLs identical so Postman collections still pass.",
              np: "Genres — मेमोरीबाट Mongoose मा।",
              jp: "**Genres** — メモリ実装を Mongoose に差し替え。",
            },
            {
              en: "**Customers API** — practice **unique indexes** (email) and friendly duplicate-key errors.",
              np: "Customers — अद्वितीय इन्डेक्स।",
              jp: "**Customers** — メール一意と重複エラー表現。",
            },
            {
              en: "**Restructure** — group **`models/`**, **`routes/`**, **`validators/`** so HTTP and persistence validation do not diverge.",
              np: "फोल्डरले जिम्मेवारी छुट्याउँछ।",
              jp: "**フォルダ分け** — モデル・ルート・検証を分離。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "Mongoose validators vs Joi/zod?", np: "Mongoose वा Joi?", jp: "Mongoose と Joi？" },
      answer: {
        en: "**Both**: Jol/zod guards **HTTP shape** (strings, optional fields, coercion). **Mongoose** guards **documents** and indexes—together they stop garbage at the door and at the database boundary.",
        np: "HTTP र DB दुवै तह — दुवै प्रयोग।",
        jp: "リクエストは Joi/zod、永続は Mongoose の二段構え。",
      },
    },
  ],
};
