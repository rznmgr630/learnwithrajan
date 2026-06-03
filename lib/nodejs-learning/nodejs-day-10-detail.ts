import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_10_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "In a real app, data is connected — customers rent movies, orders have line items, posts have comments. In MongoDB you choose whether to **embed** that related data inside the document or **reference** it with an ID that points to another collection. Picking the wrong approach leads to bloated documents, slow queries, or data that gets out of sync.",
      np: "एम्बेड वा सन्दर्भ — प्रश्न ढाँचा अनुसार छान्नुहोस्।",
      jp: "**埋め込みと参照**をクエリと整合性で選ぶ。",
    },
    {
      en: "**`populate`** in Mongoose works like a SQL join — it runs a second query to fetch the related documents. This is convenient, but be careful: if you call `populate` on a list of 50 items, that is 50 extra database queries. This is called the **N+1 problem** and it can quietly make your endpoints much slower.",
      np: "`populate` मन पराउँछ तर N+1 खर्चिलो हुन सक्छ।",
      jp: "**populate** は便利だが **N+1** に注意。",
    },
  ],
  sections: [
    {
      title: { en: "Modelling relationships — embed vs reference", np: "एम्बेड र सन्दर्भ", jp: "関連のモデル化" },
      blocks: [
        {
          type: "youtube",
          videoId: "-56x56UppqQ",
          title: "MongoDB Crash Course",
        },
        {
          type: "code",
          title: { en: "Embed vs ObjectId reference (sketch)", np: "एम्बेड वा ref", jp: "埋め込みと参照" },
          code: `// Reference another collection by id
const movieSchema = new mongoose.Schema({
  title: String,
  genreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true },
});

// Embed small subdocuments that always ship with the parent
const orderSchema = new mongoose.Schema({
  lines: [{ sku: String, qty: Number, price: Number }],
});`,
        },
        {
          type: "diagram",
          id: "erd-one-many",
        },
        {
          type: "paragraph",
          text: {
            en: "**Embed** data when it always belongs to one parent and you always need it at the same time — like comments inside a blog post. **Reference** data (using an ID) when the related document is large, shared across multiple parents, or changes independently. Arrays of embedded objects are great for ordered items like order line items — each one gets its own `_id` so you can update them individually.",
            np: "सँगै जीवनचक्र भए embed; स्वतन्त्र भए ref।",
            jp: "**埋め込み**は常に一緒に読む子。**参照**は独立したライフサイクル向け。",
          },
        },
      ],
    },
    {
      title: { en: "Movies & Rentals projects", np: "Movies र Rentals", jp: "Movies / Rentals プロジェクト" },
      blocks: [
        {
          type: "code",
          title: { en: "Validate foreign keys before save", np: "जाँच गर्नु", jp: "保存前に関連検証" },
          code: `async function createMovie(body) {
  const genre = await Genre.findById(body.genreId);
  if (!genre) {
    throw Object.assign(new Error('Unknown genre'), { statusCode: 400 });
  }
  return Movie.create(body);
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "Movies belong to genres — store a `genreId` reference and always check that the genre actually exists before saving a movie. Rentals connect customers and movies — think about inventory carefully. If you decrement stock and record the rental in two separate steps without a transaction, a crash between those steps can leave your data inconsistent and show users inventory that is not really there.",
            np: "अस्तित्व जाँच र इन्भेन्टरी — दुवै मिलाउनुहोस्।",
            jp: "**Movies** はジャンル参照の整合。**Rentals** は在庫と整合。",
          },
        },
      ],
    },
    {
      title: {
        en: "Transactions & validating ObjectIds",
        np: "लेनदेन र ObjectId",
        jp: "トランザクションと ObjectId",
      },
      blocks: [
        {
          type: "youtube",
          videoId: "-56x56UppqQ",
          title: "MongoDB Transactions Explained",
        },
        {
          type: "code",
          title: { en: "Multi-document transaction (pattern)", np: "लेनदेन उदाहरण", jp: "トランザクションの型" },
          code: `const session = await mongoose.startSession();
session.startTransaction();
try {
  await Movie.updateOne({ _id }, { $inc: { numberInStock: -1 } }).session(session);
  await Rental.create([{ customerId, movieId }], { session });
  await session.commitTransaction();
} catch (e) {
  await session.abortTransaction();
  throw e;
} finally {
  session.endSession();
}`,
        },
        {
          type: "diagram",
          id: "acid-transaction",
        },
        {
          type: "paragraph",
          text: {
            en: "**Transactions** let you update multiple documents at once, where either all changes succeed or none do — essential when inventory or money is involved. **`mongoose.Types.ObjectId.isValid`** only checks whether the string has the right format (24 hex characters) — it does not check if a document with that ID actually exists. Always do a `findById` or `exists` query when you need to be sure.",
            np: "`isValid` मात्र पर्याप्त छैन — अस्तित्व जाँच गर्नुहोस्।",
            jp: "**トランザクション**で複数コレクションを一体に。**ObjectId** は形式と存在を別検証。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When should I embed instead of reference?",
        np: "एम्बेड कहिले?",
        jp: "埋め込みはいつ？",
      },
      answer: {
        en: "Embed when the data is small, always read alongside the parent, and updated at the same time as the parent. Reference when documents are large, when the same data is used by multiple parents, or when each document changes on its own schedule. A good rule of thumb: if the embedded data would get out of sync or grow unbounded, reference instead.",
        np: "सानो र सँगै भए embed; ठूलो वा स्वतन्त्र भए ref।",
        jp: "常に一緒・小さければ埋め込み。大きい・共有・独立なら参照。",
      },
    },
  ],
};
