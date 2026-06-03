import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_8_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**MongoDB** saves data as flexible **documents** (similar to JSON) grouped in **collections** — unlike SQL tables, there is no rigid column structure. **Mongoose** sits on top of MongoDB and gives your Node app **schemas**, **validation**, and a clean API for querying data.",
      np: "Mongo दस्तावेज; Mongoose ले आकार र प्रश्न सजिलो बनाउँछ।",
      jp: "**MongoDB** はドキュメント指向。**Mongoose** がスキーマとクエリを整える。",
    },
    {
      en: "You can install MongoDB using the **official installer** or run it with **Docker** — just make sure your data folder is not inside your git repo. The **`mongosh`** shell lets you connect from your terminal and check what is actually in your database, which is more reliable than only reading your app logs.",
      np: "स्थापना पछि `mongosh` ले जाँच गर्नुहोस्।",
      jp: "ローカルは公式インストーラか Docker。**mongosh** で直接確認できると強い。",
    },
  ],
  sections: [
    {
      title: { en: "MongoDB basics & local setup", np: "MongoDB र स्थापना", jp: "MongoDB とセットアップ" },
      blocks: [
        {
          type: "youtube",
          videoId: "-bt_y4Loofg",
          title: "MongoDB in 100 Seconds",
        },
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
            en: "MongoDB lets you embed nested objects inside a document, unlike SQL which splits data across multiple tables. That flexibility is powerful, but you still need to plan your **indexes** and how you will query the data. For now, run **`mongod`** locally. When you are ready to host your database online, use the **MongoDB Atlas** free tier — and always store your connection string in an **environment variable**, never in your code.",
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
            en: "In production, MongoDB usually runs as a **replica set** — multiple copies of your database for reliability (shown in the diagram above). **`mongoose.connect(uri)`** opens a connection pool automatically. It is good practice to listen for **`disconnected`** and **`reconnected`** events so you know when the database goes down. **Schemas** describe what fields a document has and what values are valid; **Models** connect a schema to the actual MongoDB collection.",
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
          type: "youtube",
          videoId: "-56x56UppqQ",
          title: "MongoDB Crash Course",
        },
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
            en: "Operators like **`$gt`**, **`$in`**, **`$and`**, and **`$or`** let you filter data inside the database — so only the matching documents come back to your app. This is much faster than loading everything and filtering in JavaScript. Be careful with **regex searches** though — without an index, they scan every document and can slow your app down.",
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
            en: "For **pagination**, `skip` and `limit` are the easiest to start with — but they get slow when users navigate to later pages because MongoDB still has to scan all the skipped documents. **Cursor-based pagination** (sorting by `_id` or a timestamp and passing the last value you saw) is faster and works much better for long lists or feeds.",
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
        en: "If two requests both read the same document and then save it, one will overwrite the other's changes. **`findOneAndUpdate`** with operators like **`$inc`** and **`$set`** avoids this by making the change directly in the database in one step — no read-then-write race condition.",
        np: "दुई लेखकले पढेर बचत गर्दा रेस — अणु अद्यावधिक सुरक्षित।",
        jp: "読んで書くと競合しやすい。**findOneAndUpdate** と演算子で原子更新。",
      },
    },
  ],
};
