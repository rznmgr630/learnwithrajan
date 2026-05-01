import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_7_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Access data via Eloquent models (preferred) or the query builder (`DB::table`). Raw SQL is available but loses migrations’ consistency guarantees—reach for `DB::select` only when necessary.",
      np: "Eloquent वा `DB::table`। कच्चा SQL आवश्यक परे मात्र।",
      jp: "データは Eloquent か クエリビルダ が基本。生 SQL は必要最小限に。",
    },
  ],
  sections: [
    {
      title: { en: "Facade DB vs Query Builder", np: "DB फасाड", jp: "DB ファサード" },
      blocks: [
        {
          type: "code",
          code: `use Illuminate\\Support\\Facades\\DB;

DB::select('select * from users where active = ?', [1]);

DB::table('users')->where('active', 1)->orderByDesc('id')->get();`,
        },
      ],
    },
    {
      title: { en: "Models & mass assignment", np: "मोडेल", jp: "モデルと代入" },
      blocks: [
        {
          type: "code",
          code: `php artisan make:model Post

class Post extends Model
{
    protected $fillable = ['title', 'body'];
    // protected $table = 'posts_custom'; // override table name
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "Protect `$fillable` / `$guarded` when using `create()`, `fill()`, or `update()` so users cannot inject unexpected columns.",
            np: "`$fillable` ले सुरक्षित mass assignment।",
            jp: "`$fillable` / `$guarded` で予期しないカラム代入を防ぎます。",
          },
        },
      ],
    },
    {
      title: { en: "CRUD patterns (correct ordering)", np: "CRUD ढाँचा", jp: "CRUD の書き方" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Apply `where` / `orderBy` on the query builder or Eloquent builder before `get()`, `first()`, `paginate()`. Example: `User::where('active', 1)->orderByDesc('id')->paginate(15)` — not `User::all()->orderBy` (collections don’t chain SQL order like that).",
            np: "`orderBy` ले query मा — `all()` पछि होइन।",
            jp: "`orderBy` は `get()` / `paginate()` の前 にチェーン。`User::all()` の後に SQL 順序は付けられません。",
          },
        },
        {
          type: "code",
          code: `User::create($validated);
User::whereKey($ids)->update(['status' => 'active']);
User::updateOrCreate(['email' => $email], $attributes);
$user->delete();
User::destroy([1, 2, 3]);`,
        },
      ],
    },
    {
      title: { en: "Accessors & mutators", np: "Accessor र mutator", jp: "アクセサ／ミューテータ" },
      blocks: [
        {
          type: "code",
          code: `use Illuminate\\Database\\Eloquent\\Casts\\Attribute;

protected function name(): Attribute
{
    return Attribute::make(
        get: fn (?string $value) => $value !== null ? ucfirst($value) : '',
        set: fn (string $value) => strtolower($value),
    );
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When choose Query Builder over Eloquent?",
        np: "Query Builder कहिले?",
        jp: "いつクエリビルダを使う？",
      },
      answer: {
        en: "Use Eloquent when you have models, relationships, casting, events. Use Query Builder for ad-hoc reporting, aggregations without hydration, or bridging legacy tables without ORM mapping.",
        np: "मोडेल/सम्बन्ध छ भने Eloquent; विशेष रिपोर्टमा Builder।",
        jp: "モデルやリレーションがあるなら Eloquent。集計だけ・レガシーテーブルだけなどは Query Builder も有効です。",
      },
    },
  ],
};
