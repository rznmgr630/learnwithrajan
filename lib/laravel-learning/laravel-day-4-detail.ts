import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_4_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Blade is Laravel’s template engine: inheritance (`@extends`, `@section`, `@yield`), control flow (`@if`, `@foreach`), and components. Views live in `resources/views` with `.blade.php` extension.",
      np: "Blade — inheritance, सर्त, लूप। दृश्य `resources/views` मा।",
      jp: "Blade はテンプレート言語。継承・`@if` / `@foreach`・コンポーネント。`resources/views` に配置。",
    },
  ],
  sections: [
    {
      title: { en: "Passing data & checking existence", np: "डाटा पठाउने", jp: "データの受け渡し" },
      blocks: [
        {
          type: "code",
          code: `return view('users.index', ['users' => $users]);
return view('users.index')->with('users', $users);
return view('users.index', compact('users'));

if (view()->exists('partials.banner')) { ... }
// or View::exists() via facade`,
        },
      ],
    },
    {
      title: { en: "Subviews & class components", np: "Subview र कम्पोनेन्ट", jp: "部分ビューとコンポーネント" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Use `@include('name')` for partials. `@includeIf` guards missing templates. Invokable / class-based components (`php artisan make:component Alert`) pair a PHP class (public props, `render()`) with `resources/views/components/alert.blade.php`; render with `<x-alert type='info'>slot</x-alert>` (HTML-style attributes in Blade).",
            np: "`@include` partial को लागि। `make:component` ले वर्ग + `<x-...>`।",
            jp: "部分は `@include`。クラスコンポーネントは `make:component` で `<x-alert>` として使います。",
          },
        },
      ],
    },
    {
      title: { en: "Inline Blade strings", np: "इनलाइन Blade", jp: "インライン Blade" },
      blocks: [
        {
          type: "code",
          code: `use Illuminate\\Support\\Facades\\Blade;

return Blade::render('Hello, {{ $name }}!', ['name' => 'Rajan']);`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When use `@include` vs a Blade component?",
        np: "`@include` बनाम component?",
        jp: "`@include` とコンポーネントの違いは？",
      },
      answer: {
        en: "Include = simple file reuse. Components = reusable UI with props, slots, and a class for logic—better for design systems and testing isolated UI pieces.",
        np: "सामान्य partial मा include; props/slot चाहिँ component।",
        jp: "静的な断片は include。props や スロット、ロジックをまとめたいなら コンポーネントが向いています。",
      },
    },
  ],
};
