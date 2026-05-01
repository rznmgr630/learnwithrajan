import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_8_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**MongoDB** stores **documents** (JSON-like BSON) in **collections** instead of rigid tables—great when schemas evolve. **Mongoose** adds **schemas**, **validation**, and a fluent query API on top so Node apps stay type-aware without switching languages.",
      np: "Mongo दस्तावेज; Mongoose ले आकार र प्रश्न सजिलो बनाउँछ।",
      jp: "**MongoDB** はドキュメント指向。**Mongoose** がスキーマとクエリを整える。",
    },
    {
      en: "Install MongoDB locally via **official installer** or **Docker**—keep **data directories** outside your git repo. **`mongosh`** connects from the terminal so you can **`find`** documents before trusting only application logs.",
      np: "स्थापना पछि `mongosh` ले जाँच गर्नुहोस्।",
      jp: "ローカルは公式インストーラか Docker。**mongosh** で直接確認できると強い。",
    },
  ],
  sections: [
    {
      title: { en: "MongoDB basics & local setup", np: "MongoDB र स्थापना", jp: "MongoDB とセットアップ" },
      blocks: [
        {
          type: "code",
          title: { en: "mongosh after mongod is running", np: "mongosh", jp: "mongosh で確認" },
          code: `# Terminal (with mongod listening):
mongosh
show dbs
use rental_db
db.genres.insertOne({ name: 'Comedy' })
db.genres.find().pretty()`,
        },
        {
          type: "paragraph",
          text: {
            en: "Unlike SQL rows, documents can embed nested objects—flexibility trades off with discipline: you still design **indexes** and **query patterns** intentionally. For learning, run **`mongod`** locally or use **MongoDB Atlas** free tier later—connection strings always belong in **environment variables**.",
            np: "लचिलोपनका लागि इन्डेक्स र प्रश्न योजना चाहिन्छ।",
            jp: "柔軟だからこそインデックス設計が重要。接続 URI は環境変数へ。",
          },
        },
      ],
    },
    {
      title: {
        en: "Connecting, schemas, models & saving",
        np: "जडान, schema, मोडेल",
        jp: "接続・スキーマ・モデル・保存",
      },
      blocks: [
        {
          type: "code",
          title: { en: "Connect + define model (sketch)", np: "जडान उदाहरण", jp: "接続の例" },
          code: `const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
});
const Genre = mongoose.model('Genre', genreSchema);

// create vs new + save — both valid patterns`,
        },
        {
          type: "diagram",
          id: "primary-replica",
        },
        {
          type: "paragraph",
          text: {
            en: "Production MongoDB often runs as a **replica set** (diagram above)—multiple nodes for availability. **`mongoose.connect(uri)`** opens a pool; listen for **`disconnected`** / **`reconnected`** events and fail fast if the URI is wrong. **Schemas** define fields, defaults, and indexes; **Models** bind a schema to a **collection name**.",
            np: "उत्पादनमा प्रायः replica — जडान घटनाहरू सुन्नुहोस्।",
            jp: "本番はレプリカ構成が一般的。**mongoose.connect** とプールを理解する。",
          },
        },
      ],
    },
    {
      title: {
        en: "Querying, indexes, pagination & updates",
        np: "प्रश्न र पृष्ठांकन",
        jp: "クエリ・インデックス・ページング",
      },
      blocks: [
        {
          type: "code",
          title: { en: "Filter + page in the database", np: "प्रश्न उदाहरण", jp: "クエリ例" },
          code: `const movies = await Movie.find({ genreId, price: { $lte: 20 } })
  .sort({ title: 1 })
  .skip((page - 1) * pageSize)
  .limit(pageSize)
  .select('title price');`,
        },
        {
          type: "diagram",
          id: "btree-index",
        },
        {
          type: "paragraph",
          text: {
            en: "**Comparison operators** (`$gt`, `$in`, …) and **logical** (`$and`, `$or`) filter documents **inside** the database—better than fetching everything into Node. **Regex** searches can be slow without indexes—profile queries during development.",
            np: "फिल्टर DB भित्र — पूरै लोड गर्नु हुँदैन।",
            jp: "**演算子**で DB 側にフィルタ。正規表現はインデックスと相談。",
          },
        },
        {
          type: "diagram",
          id: "cursor-pagination",
        },
        {
          type: "paragraph",
          text: {
            en: "**Pagination** — **`skip`/`limit`** is simple but slows down on deep pages; **cursor-based** pagination (sort by `_id` or timestamp, pass last seen value) scales better for feeds—matches the diagram’s stable cursor idea.",
            np: "गहिरो पृष्ठमा कर्सर राम्रो — skip भारी हुन सक्छ।",
            jp: "**ページング** — 深いページはカーソル方式が安定（図参照）。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why prefer atomic updates over read-modify-save?",
        np: "अणु अद्यावधिक किन?",
        jp: "原子更新を使う理由？",
      },
      answer: {
        en: "Two requests reading the same document and saving blindly can **overwrite** each other—**`findOneAndUpdate`** with operators (`$inc`, `$set`) applies changes **atomically** at the document level.",
        np: "दुई लेखकले पढेर बचत गर्दा रेस — अणु अद्यावधिक सुरक्षित।",
        jp: "読んで書くと競合しやすい。**findOneAndUpdate** と演算子で原子更新。",
      },
    },
  ],
};
