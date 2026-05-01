import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_4_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Blade** is Laravel's compiled template engine. Files use the `.blade.php` extension and live in `resources/views/`. Blade adds template **inheritance** (`@extends`/`@section`/`@yield`), rich **control flow** directives, **components** (anonymous and class-based), and **stacks** for injecting assets from child templates — all compiling down to plain PHP cached in `storage/framework/views/`.",
      np: "Blade Laravel को compiled template engine। `.blade.php` फाइल `resources/views/` मा। inheritance, control flow, components, stacks सब।",
      jp: "Blade は Laravel のコンパイル済みテンプレートエンジン。`resources/views/` に `.blade.php` ファイルを配置。継承・制御フロー・コンポーネント・スタックが使えます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Template inheritance pattern",
        np: "Template inheritance pattern",
        jp: "テンプレート継承パターン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Define a **layout** file with `@yield('slot-name')` placeholders. Child views `@extend` the layout and `@section` fill each slot. Use `@parent` inside a section to prepend/append to the layout's default content. `{{ $var }}` echoes **HTML-escaped** output; `{!! $html !!}` is **unescaped** (use with trusted content only). `{{-- comment --}}` leaves no HTML output.",
            np: "Layout मा `@yield`; child मा `@extends` + `@section`। `{{ $var }}` escaped; `{!! $html !!}` unescaped। `{{-- comment --}}`।",
            jp: "レイアウトに `@yield`、子ビューで `@extends` + `@section` で埋めます。`{{ $var }}` は HTML エスケープ、`{!! $html !!}` は生の出力。`{{-- --}}` はコメント（出力なし）。",
          },
        },
        {
          type: "code",
          title: {
            en: "Layout file: resources/views/layouts/app.blade.php",
            np: "Layout file",
            jp: "レイアウトファイル",
          },
          code: `<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <title>@yield('title', 'My App')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @stack('styles')
</head>
<body>
    @include('partials.nav')

    <main>
        @yield('content')
    </main>

    @stack('scripts')
</body>
</html>`,
        },
        {
          type: "code",
          title: {
            en: "Child view: resources/views/posts/show.blade.php",
            np: "Child view",
            jp: "子ビュー",
          },
          code: `@extends('layouts.app')

@section('title', $post->title)

@section('content')
    <article>
        <h1>{{ $post->title }}</h1>

        {{-- Unescaped — only use with sanitized/trusted HTML --}}
        {!! $post->body_html !!}
    </article>
@endsection

@push('scripts')
    <script>console.log('post page loaded');</script>
@endpush`,
        },
        {
          type: "paragraph",
          text: {
            en: "Pass data from a controller to a Blade view with `view('name', ['key' => $value])`, `view('name')->with('key', $value)`, or `view('name', compact('post', 'comments'))`. All keys become variables inside the template.",
            np: "Controller बाट Blade मा data: `view('name', ['key' => $value])` वा `compact('post')`।",
            jp: "コントローラから Blade へのデータ渡し：`view('name', ['key' => $value])`・`->with()`・`compact()` のいずれかを使います。",
          },
        },
      ],
    },
    {
      title: {
        en: "Control flow & loop variable",
        np: "Control flow र loop variable",
        jp: "制御フローとループ変数",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Conditionals",
            np: "Conditionals",
            jp: "条件分岐",
          },
          code: `@if ($user->isAdmin())
    <span>Admin</span>
@elseif ($user->isModerator())
    <span>Mod</span>
@else
    <span>User</span>
@endif

@unless ($user->isVerified())
    <p>Please verify your email.</p>
@endunless

@isset($post)
    <p>{{ $post->title }}</p>
@endisset

@empty($posts)
    <p>No posts found.</p>
@endempty

@auth
    <a href="/logout">Log out</a>
@endauth

@guest
    <a href="/login">Log in</a>
@endguest`,
        },
        {
          type: "code",
          title: {
            en: "@foreach with the $loop variable",
            np: "@foreach र $loop variable",
            jp: "@foreach と $loop 変数",
          },
          code: `@foreach ($posts as $post)
    {{-- $loop is always available inside @foreach --}}
    <div class="{{ $loop->even ? 'bg-gray-50' : '' }}">
        <span>{{ $loop->iteration }} / {{ $loop->count }}</span>

        @if ($loop->first)
            <span class="badge">Latest</span>
        @endif

        <h2>{{ $post->title }}</h2>

        @if ($loop->last)
            <hr>
        @endif
    </div>
@endforeach

{{-- @forelse: handles empty collections gracefully --}}
@forelse ($comments as $comment)
    <p>{{ $comment->body }}</p>
@empty
    <p>No comments yet.</p>
@endforelse

{{-- $loop->depth and $loop->parent for nested loops --}}
@foreach ($categories as $category)
    @foreach ($category->posts as $post)
        {{-- $loop->parent->index = outer iteration --}}
        <p>{{ $loop->parent->index }}: {{ $post->title }}</p>
    @endforeach
@endforeach`,
        },
        {
          type: "table",
          caption: {
            en: "Useful $loop properties",
            np: "$loop properties",
            jp: "$loop の主なプロパティ",
          },
          headers: [
            { en: "Property", np: "Property", jp: "プロパティ" },
            { en: "Type", np: "Type", jp: "型" },
            { en: "Description", np: "विवरण", jp: "内容" },
          ],
          rows: [
            [
              { en: "`$loop->index`", np: "`$loop->index`", jp: "`$loop->index`" },
              { en: "int (0-based)", np: "int (0 start)", jp: "int（0 始まり）" },
              { en: "Current iteration index", np: "current index", jp: "現在のインデックス" },
            ],
            [
              { en: "`$loop->iteration`", np: "`$loop->iteration`", jp: "`$loop->iteration`" },
              { en: "int (1-based)", np: "int (1 start)", jp: "int（1 始まり）" },
              { en: "Current iteration (human-friendly)", np: "1 start iteration", jp: "現在の繰り返し数" },
            ],
            [
              { en: "`$loop->count`", np: "`$loop->count`", jp: "`$loop->count`" },
              { en: "int", np: "int", jp: "int" },
              { en: "Total items in the collection", np: "कुल items", jp: "コレクションの総件数" },
            ],
            [
              { en: "`$loop->first`", np: "`$loop->first`", jp: "`$loop->first`" },
              { en: "bool", np: "bool", jp: "bool" },
              { en: "True on the first iteration", np: "पहिलो iteration", jp: "最初の繰り返しで true" },
            ],
            [
              { en: "`$loop->last`", np: "`$loop->last`", jp: "`$loop->last`" },
              { en: "bool", np: "bool", jp: "bool" },
              { en: "True on the last iteration", np: "अन्तिम iteration", jp: "最後の繰り返しで true" },
            ],
            [
              { en: "`$loop->odd` / `$loop->even`", np: "`odd` / `even`", jp: "`odd` / `even`" },
              { en: "bool", np: "bool", jp: "bool" },
              { en: "Odd / even iteration (useful for row striping)", np: "odd/even row", jp: "行の色分けに便利" },
            ],
            [
              { en: "`$loop->depth`", np: "`$loop->depth`", jp: "`$loop->depth`" },
              { en: "int", np: "int", jp: "int" },
              { en: "Nesting depth (1 = outermost)", np: "nesting depth", jp: "ネスト深さ（1 = 最外）" },
            ],
            [
              { en: "`$loop->parent`", np: "`$loop->parent`", jp: "`$loop->parent`" },
              { en: "object|null", np: "object|null", jp: "object|null" },
              { en: "Parent loop's `$loop` variable in nested loops", np: "outer loop $loop", jp: "外側ループの $loop" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Anonymous & class components",
        np: "Anonymous र class components",
        jp: "匿名コンポーネントとクラスコンポーネント",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Anonymous components** are plain `.blade.php` files in `resources/views/components/`. No PHP class needed. Use `$attributes->merge([])` to forward HTML attributes and `$slot` for the default slot content. Render with `<x-component-name>`. **Class components** add a PHP class (generated with `php artisan make:component`) for computed properties and logic.",
            np: "Anonymous: `resources/views/components/` मा blade file। `<x-name>` ले render। Class component: PHP class + view — `make:component`।",
            jp: "匿名コンポーネントは `resources/views/components/` の Blade ファイルだけ。クラスコンポーネントは `make:component` で PHP クラス + ビューを生成します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Anonymous component — resources/views/components/button.blade.php",
            np: "Anonymous component — button.blade.php",
            jp: "匿名コンポーネント — button.blade.php",
          },
          code: `{{-- resources/views/components/button.blade.php --}}
@props(['variant' => 'primary', 'type' => 'button'])

<button
    type="{{ $type }}"
    {{ $attributes->merge(['class' => "btn btn-$variant"]) }}
>
    {{ $slot }}
</button>`,
        },
        {
          type: "code",
          title: {
            en: "Using an anonymous component",
            np: "Anonymous component प्रयोग",
            jp: "匿名コンポーネントの利用",
          },
          code: `{{-- Renders <button class="btn btn-primary extra">Save</button> --}}
<x-button variant="primary" class="extra">Save</x-button>

{{-- Submit button --}}
<x-button type="submit" variant="danger">Delete</x-button>

{{-- Named slots --}}
{{-- resources/views/components/card.blade.php --}}
<div class="card">
    <div class="card-header">{{ $header }}</div>
    <div class="card-body">{{ $slot }}</div>
    @isset($footer)
        <div class="card-footer">{{ $footer }}</div>
    @endisset
</div>

{{-- Usage with named slots --}}
<x-card>
    <x-slot:header>Card Title</x-slot:header>
    Card body content here.
    <x-slot:footer>Footer text</x-slot:footer>
</x-card>`,
        },
        {
          type: "code",
          title: {
            en: "Class component — make:component Alert",
            np: "Class component — Alert",
            jp: "クラスコンポーネント — Alert",
          },
          code: `# Generates: app/View/Components/Alert.php + resources/views/components/alert.blade.php
php artisan make:component Alert`,
        },
        {
          type: "code",
          title: {
            en: "app/View/Components/Alert.php",
            np: "Alert.php PHP class",
            jp: "Alert.php クラス",
          },
          code: `<?php
namespace App\\View\\Components;

use Illuminate\\View\\Component;
use Illuminate\\View\\View;

class Alert extends Component
{
    public function __construct(
        public string $type = 'info',
        public string $title = '',
    ) {}

    // Computed property usable in the view as $iconClass
    public function iconClass(): string
    {
        return match ($this->type) {
            'success' => 'text-green-500',
            'error'   => 'text-red-500',
            default   => 'text-blue-500',
        };
    }

    public function render(): View
    {
        return view('components.alert');
    }
}`,
        },
        {
          type: "code",
          title: {
            en: "resources/views/components/alert.blade.php",
            np: "alert.blade.php view",
            jp: "alert.blade.php ビュー",
          },
          code: `{{-- $type, $title, and $iconClass() are available from the PHP class --}}
<div class="alert alert-{{ $type }}">
    @if ($title)
        <strong class="{{ $iconClass() }}">{{ $title }}</strong>
    @endif
    {{ $slot }}
</div>

{{-- Usage --}}
<x-alert type="success" title="Saved!">
    Your post has been published.
</x-alert>`,
        },
      ],
    },
    {
      title: {
        en: "Form helpers & Vite",
        np: "Form helpers र Vite",
        jp: "フォームヘルパと Vite",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`@csrf` generates a hidden CSRF token field — required on every HTML form that submits to a `web` route. `@method('PUT')` spoofs non-GET/POST HTTP verbs inside an HTML form (browsers only send GET/POST natively). `@error('field')` renders an inline error block when that field fails validation. `@vite()` generates `<link>` and `<script>` tags pointing to Vite-compiled assets, including HMR in development.",
            np: "`@csrf` — CSRF token; `@method('PUT')` — verb spoof; `@error` — validation error; `@vite()` — Vite assets (HMR dev)।",
            jp: "`@csrf` は CSRF トークンフィールド。`@method('PUT')` で動詞を偽装。`@error` でフィールドエラー表示。`@vite()` で Vite アセットを読み込み（開発時は HMR 付き）。",
          },
        },
        {
          type: "code",
          title: {
            en: "@csrf, @method, @error in a form",
            np: "@csrf, @method, @error form मा",
            jp: "@csrf・@method・@error のフォーム利用例",
          },
          code: `<form action="{{ route('posts.update', $post) }}" method="POST">
    @csrf
    @method('PUT')  {{-- Browser sends POST; Laravel reads X-HTTP-Method-Override --}}

    <div>
        <label for="title">Title</label>
        <input
            id="title"
            name="title"
            type="text"
            value="{{ old('title', $post->title) }}"
            class="{{ $errors->has('title') ? 'border-red-500' : '' }}"
        >
        @error('title')
            <p class="text-red-500 text-sm">{{ $message }}</p>
        @enderror
    </div>

    <div>
        <label for="body">Body</label>
        <textarea id="body" name="body">{{ old('body', $post->body) }}</textarea>
        @error('body')
            <p class="text-red-500 text-sm">{{ $message }}</p>
        @enderror
    </div>

    <button type="submit">Update Post</button>
</form>`,
        },
        {
          type: "code",
          title: {
            en: "@vite — Vite asset integration",
            np: "@vite — Vite assets",
            jp: "@vite — Vite アセット統合",
          },
          code: `{{-- In your layout <head> --}}
@vite(['resources/css/app.css', 'resources/js/app.js'])

{{-- Output in production (hashed filenames from manifest.json):
<link rel="stylesheet" href="/build/assets/app-3c4a5b6c.css">
<script type="module" src="/build/assets/app-9d8e7f10.js"></script>

  Output in development (with HMR hot-reload script injected):
<script type="module" src="http://localhost:5173/@vite/client"></script>
<script type="module" src="http://localhost:5173/resources/js/app.js"></script>
--}}`,
        },
        {
          type: "code",
          title: {
            en: "@stack and @push — injecting assets from child templates",
            np: "@stack / @push — child template बाट asset inject",
            jp: "@stack / @push — 子テンプレートからアセット注入",
          },
          code: `{{-- Layout defines the stack slot --}}
@stack('scripts')

{{-- Any child view or component can push into it --}}
@push('scripts')
    <script src="{{ asset('js/chart.min.js') }}"></script>
@endpush

{{-- @prepend to insert at the top of the stack --}}
@prepend('scripts')
    <script>const appEnv = '{{ app()->environment() }}';</script>
@endprepend`,
        },
        {
          type: "paragraph",
          text: {
            en: "Use `@include('partials.nav')` for simple file reuse. `@includeIf('partials.banner')` silently skips missing files. `@includeWhen($user->isAdmin(), 'partials.admin-nav')` conditionally includes. `@includeFirst(['custom.nav', 'partials.nav'])` uses the first file that exists.",
            np: "`@include` — file reuse। `@includeIf` — file छैन भने skip। `@includeWhen` — conditional। `@includeFirst` — पहिलो available file।",
            jp: "`@include` で部分ビューを読み込み。`@includeIf` はファイルが無い場合にスキップ。`@includeWhen` で条件付き。`@includeFirst` で存在する最初のファイルを使用。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How do I pass data from a controller to a Blade view?",
        np: "Controller बाट Blade view मा data कसरी पठाउने?",
        jp: "コントローラから Blade ビューへのデータ渡し方は？",
      },
      answer: {
        en: "Three equivalent ways: `return view('posts.show', ['post' => $post])` (associative array), `return view('posts.show')->with('post', $post)` (chained helper), or `return view('posts.show', compact('post', 'comments'))` (PHP `compact` shorthand). All array keys become `$variable` inside the template.",
        np: "`view('name', ['key' => $val])`, `->with('key', $val)`, `compact('post')` — तिनीहरू सबै equivalent।",
        jp: "連想配列・`->with()` チェーン・`compact()` の 3 通り。配列のキーがテンプレート内の変数名になります。",
      },
    },
    {
      question: {
        en: "What is the difference between `@include` and `<x-component>`?",
        np: "`@include` र `<x-component>` को फरक?",
        jp: "`@include` と `<x-component>` の違いは？",
      },
      answer: {
        en: "`@include` is a simple file-paste with access to the parent scope (all parent variables are available automatically). `<x-component>` is more powerful: it supports explicit **props**, **slots** (default + named), `$attributes->merge()` for HTML attribute forwarding, and an optional PHP class for logic. Use `@include` for truly static partials; use components for reusable UI with defined interfaces.",
        np: "`@include` — simple file paste, parent scope accessible। `<x-component>` — props, slots, attributes, PHP class।",
        jp: "`@include` は親スコープをすべて引き継ぐシンプルな埋め込み。`<x-component>` は props・スロット・属性マージ・PHP クラスロジックをサポートします。",
      },
    },
    {
      question: {
        en: "Can I use `{{ }}` for JavaScript template literals?",
        np: "JavaScript मा `{{ }}` प्रयोग गर्न सकिन्छ?",
        jp: "Blade の `{{ }}` は JavaScript テンプレートリテラルと衝突しない？",
      },
      answer: {
        en: "Blade processes `{{ $var }}` before the browser sees the page. If you need to output a literal `{{ }}` without Blade touching it (e.g. for a Vue.js or Alpine.js template), prefix with `@`: write `@{{ message }}` and Blade will render the literal `{{ message }}` string. Alternatively, wrap the entire block in `@verbatim ... @endverbatim`.",
        np: "Blade `{{ }}` process गर्छ। Vue/Alpine को लागि `@{{ message }}` वा `@verbatim` block प्रयोग गर्नुस्।",
        jp: "Blade は `{{ $var }}` をサーバで処理します。Vue/Alpine 向けにリテラル `{{ }}` を出力するには `@{{ message }}` か `@verbatim ... @endverbatim` ブロックを使います。",
      },
    },
    {
      question: {
        en: "How does `@stack` differ from `@section`?",
        np: "`@stack` र `@section` को फरक?",
        jp: "`@stack` と `@section` の違いは？",
      },
      answer: {
        en: "`@section` / `@yield` works as a single-slot override: a child can define the section once (or `@parent` to extend it). `@stack` / `@push` is **additive** — multiple `@push` calls from any child view or component all accumulate into the stack in order. This makes `@stack` ideal for scripts and styles that need to be contributed by multiple components on one page.",
        np: "`@section` — एकपटक override। `@stack` — additive; multiple `@push` सबै accumulate। scripts/styles inject गर्न ideal।",
        jp: "`@section` は 1 回だけ上書き。`@stack` は **累積型**で、複数の `@push` が順番に積まれます。ページ内複数コンポーネントがスクリプトを注入するのに向いています。",
      },
    },
    {
      question: {
        en: "How do I escape a `{{` in Blade so it appears literally in the HTML?",
        np: "Blade मा `{{` literal HTML मा कसरी?",
        jp: "Blade で `{{` をそのまま HTML に出力するには？",
      },
      answer: {
        en: "Prefix the opening brace with `@`: write `@{{ message }}`. Blade strips the `@` and outputs the literal text `{{ message }}` without parsing it. For larger blocks containing many `{{ }}` expressions, use `@verbatim ... @endverbatim` — Blade won't touch anything inside that block.",
        np: "`@{{ message }}` लेख्नुस् — Blade `@` हटाएर `{{ message }}` literal output दिन्छ। ठूलो block मा `@verbatim`।",
        jp: "`@{{ message }}` と書くと Blade は `@` を除去し `{{ message }}` をそのまま出力します。大きなブロックには `@verbatim ... @endverbatim` を使います。",
      },
    },
  ],
};
