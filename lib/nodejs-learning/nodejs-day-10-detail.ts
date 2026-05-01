import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_10_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Real APIs relate **customers** to **movies** to **rentals**—in MongoDB you choose **embedding** (nested documents) vs **referencing** (`ObjectId` pointers) vs **hybrids**. Wrong choices mean giant documents, slow queries, or stale duplicated data.",
      np: "एम्बेड वा सन्दर्भ — प्रश्न ढाँचा अनुसार छान्नुहोस्।",
      jp: "**埋め込みと参照**をクエリと整合性で選ぶ。",
    },
    {
      en: "**Population** (`populate`) feels like a SQL join—it pulls related documents after the first query—watch for **N+1** patterns where one list endpoint accidentally triggers one database round-trip **per row**.",
      np: "`populate` मन पराउँछ तर N+1 खर्चिलो हुन सक्छ।",
      jp: "**populate** は便利だが **N+1** に注意。",
    },
  ],
  sections: [
    {
      title: { en: "Modelling relationships — embed vs reference", np: "एम्बेड र सन्दर्भ", jp: "関連のモデル化" },
      blocks: [
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
            en: "**Embed** children when they **always** belong to one parent and you fetch them together—comments on a blog post is classic. **Reference** separate collections when documents grow large or update independently—users vs orders. Arrays of subdocuments suit ordered line items with their **own `_id`** for targeted updates.",
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
            en: "**Movies** relate to **Genres**—store **`genreId`** references and validate the genre exists **before** insert/update. **Rentals** tie customers and movies together—think about **inventory**: decrement stock and record rental rows **consistently** or users see phantom availability.",
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
            en: "**Multi-document transactions** (`session.withTransaction`) commit or roll back **together**—essential when money or inventory moves between collections. **`mongoose.Types.ObjectId.isValid`** only checks hex shape—a string can be “valid” yet **not exist**; pair with **`exists`** queries when correctness matters.",
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
        en: "Embed when the nested data is **small**, **fetched with** the parent every time, and **updated together**. Reference when documents are **large**, **shared** across parents, or change **independently**—normalize like you would in SQL when duplication would drift.",
        np: "सानो र सँगै भए embed; ठूलो वा स्वतन्त्र भए ref।",
        jp: "常に一緒・小さければ埋め込み。大きい・共有・独立なら参照。",
      },
    },
  ],
};
