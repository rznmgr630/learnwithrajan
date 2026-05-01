import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_9_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Eloquent relationships map tables: `hasOne` / `hasMany` / `belongsTo` / `belongsToMany` (pivot). Name foreign keys consistently (`user_id`) or pass custom keys in relation methods.",
      np: "hasOne, hasMany, belongsTo, belongsToMany — pivot टेबल।",
      jp: "リレーションは `hasOne`・`hasMany`・`belongsTo`・`belongsToMany`（中間テーブル）。外部キーは規約で結び付きます。",
    },
  ],
  sections: [
    {
      title: { en: "Examples", np: "उदाहरण", jp: "例" },
      blocks: [
        {
          type: "code",
          code: `class User extends Model {
    public function profile() { return $this->hasOne(Profile::class); }
    public function posts() { return $this->hasMany(Post::class); }
    public function roles() {
        return $this->belongsToMany(Role::class)->withTimestamps();
    }
}

$user->roles()->attach($roleId);
$user->roles()->detach($roleId);
$user->roles()->sync([1, 2, 3]);`,
        },
      ],
    },
    {
      title: { en: "Eager loading", np: "Eager load", jp: "Eager loading" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Avoid N+1 queries: `User::with('posts')->get()` or `$users->load('posts')`. Add constraints with `with(['posts' => fn ($q) => $q->latest()])`.",
            np: "`with()` ले N+1 कम गर्छ।",
            jp: "`with()` / `load()` で N+1 を防ぎます。",
          },
        },
      ],
    },
    {
      title: { en: "Soft deletes", np: "मृदु मेट्ने", jp: "ソフトデリート" },
      blocks: [
        {
          type: "code",
          code: `use Illuminate\\Database\\Eloquent\\SoftDeletes;

class Post extends Model {
    use SoftDeletes;
}

// migration: $table->softDeletes();

$post->delete(); // sets deleted_at
Post::withTrashed()->find($id)?->restore();
Post::withTrashed()->find($id)?->forceDelete();`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Many-to-many vs hasMany/belongsTo?",
        np: "M:N बनाम 1:N?",
        jp: "多対多と 1 対多の使い分け？",
      },
      answer: {
        en: "Use belongsTo/hasMany when each child row points to one parent via FK. Use belongsToMany when either side can relate to many rows—you need a pivot table (`role_user`).",
        np: "एक अभिभावक भए hasMany; धेरै-धेरै सम्बन्धमा pivot।",
        jp: "親子は FK で hasMany/belongsTo。両方が多いときは belongsToMany と ピボットです。",
      },
    },
  ],
};
