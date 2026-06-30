import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_4_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "<b>Blade</b> is how you build the HTML in your Laravel app. Instead of writing raw PHP inside HTML, you write clean template syntax — Blade converts it to PHP behind the scenes and caches the result so it's fast.\n\nBlade files live in `resources/views/` and use the `.blade.php` extension. The four main features you'll use:\n• <b>Inheritance</b> — define one master layout, then fill in the pieces from each page\n  ↳ Uses `@extends`, `@section`, and `@yield`\n• <b>Control flow</b> — `@if`, `@foreach`, `@forelse` — cleaner than raw PHP tags inside HTML\n• <b>Components</b> — reusable UI pieces like buttons, alerts, and cards\n• <b>Stacks</b> — let child pages inject their own scripts or styles into the shared layout",
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
            en: "Think of your layout file as a page frame — the header, navigation, and footer that every page shares. You mark the spots where each page fills in its own content using `@yield('slot-name')`.\n\nEach page then uses that frame:\n• `@extends('layouts.app')` — says \"use this layout as my frame\"\n• `@section('content') ... @endsection` — fills in the slot named 'content'\n• `@parent` inside a section — keeps the layout's default content and adds to it\n\nOutputting data in Blade:\n• `{{ $var }}` — safe output, HTML-escaped automatically\n  ↳ Always use this for user-entered content — it prevents XSS attacks\n• `{!! $html !!}` — raw unescaped output\n  ↳ Only use with content you trust completely (e.g. HTML you generated yourself)\n• `{{-- comment --}}` — a Blade comment, never appears in the final HTML output",
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
            en: "To send data from your controller into the view, pick any of these three equivalent styles — they all work the same way:\n• `view('posts.show', ['post' => $post])` — explicit array, always clear and readable\n• `view('posts.show')->with('post', $post)` — chained helper, good for conditionally adding data\n• `view('posts.show', compact('post', 'comments'))` — PHP shorthand when your variable names already match the keys you want\n\nWhatever key name you use in the array becomes a `$variable` inside the template.",
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
            en: "Components let you build reusable UI pieces — like a button, alert box, or card — that you can drop into any view with a single tag.\n\n<b>Anonymous components</b>\n• Just a `.blade.php` file in `resources/views/components/` — no PHP class needed\n  ↳ Declare what props it accepts with `@props(['variant' => 'primary'])`\n• Use `$slot` to render whatever content goes between the component's opening and closing tags\n• Use `$attributes->merge(['class' => '...'])` to pass through any extra HTML attributes the caller adds\n• Render with `<x-button variant=\"primary\">Save</x-button>`\n\n<b>Class components</b>\n• Add a PHP class alongside the view — useful when you need computed properties or logic in the component\n  ↳ Generate both files at once: `php artisan make:component Alert`\n  ↳ The class lives in `app/View/Components/`, the view in `resources/views/components/`",
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
            en: "Four directives you'll use on almost every form:\n\n<b>`@csrf`</b>\n• Adds a hidden token field that proves the form was submitted from your own site\n  ↳ Without it, Laravel rejects the request with a 419 error — never skip it on web forms\n\n<b>`@method('PUT')`</b>\n• Browsers can only send GET and POST natively — HTML forms can't send PUT, PATCH, or DELETE\n  ↳ This directive adds a hidden field so Laravel knows which HTTP method you actually intended\n\n<b>`@error('field')`</b>\n• Renders an inline error message when that field fails validation\n  ↳ Only shows up when there's an error — renders nothing when the field passes\n\n<b>`@vite(['resources/css/app.css', 'resources/js/app.js'])`</b>\n• Generates the correct `<link>` and `<script>` tags for your CSS and JS\n  ↳ In development: points to the Vite dev server with hot-module reload (HMR) for instant updates\n  ↳ In production: uses hashed filenames from the build manifest for cache-busting",
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
            en: "Laravel has four ways to pull in a partial view — pick the right one for your situation:\n• `@include('partials.nav')` — simple include, like a copy-paste of that file into this spot\n• `@includeIf('partials.banner')` — only includes if the file exists, silently skips it otherwise\n  ↳ Useful for optional UI elements that may not exist in every project variant\n• `@includeWhen($user->isAdmin(), 'partials.admin-nav')` — only includes when a condition is true\n• `@includeFirst(['custom.nav', 'partials.nav'])` — tries each file in order, uses the first one that exists\n  ↳ Useful for themes or overridable templates where some projects customize the default",
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
        en: "Three ways, all equivalent — choose whichever feels most readable for your situation:\n• `return view('posts.show', ['post' => $post])` — explicit array, always clear\n• `return view('posts.show')->with('post', $post)` — chain as many `->with()` calls as you need\n• `return view('posts.show', compact('post', 'comments'))` — PHP shorthand when your local variable names already match the keys you want\n\nIn all three cases, the key name becomes a `$variable` inside the template.",
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
        en: "Both pull in another template, but they work very differently:\n\n<b>`@include('partials.nav')`</b>\n• Simple file paste — the included file can see all variables from the parent view automatically\n  ↳ Good for static partials like a nav bar or footer that don't need their own props\n\n<b>`<x-component>`</b>\n• More like a reusable building block with a clear, defined interface\n  ↳ Accepts explicit <b>props</b> (declared inputs), keeping the caller in control of what data goes in\n  ↳ Supports <b>slots</b> (default and named) for injecting content between the tags\n  ↳ Forwards extra HTML attributes with `$attributes->merge()`\n  ↳ Can have a PHP class behind it for computed properties or logic\n\nRule of thumb: use `@include` for simple one-off partials, use components for any UI you'll reuse in multiple places.",
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
        en: "Blade processes all `{{ }}` on the server before the HTML is sent to the browser. If you're using a JavaScript framework like Vue.js or Alpine.js that also uses `{{ }}` syntax, you have two options to stop Blade from touching them:\n\n• Prefix with `@`: write `@{{ message }}` — Blade strips the `@` and outputs the literal text `{{ message }}` for JavaScript to process\n  ↳ Best for one or two expressions\n• Wrap a whole block in `@verbatim ... @endverbatim` — Blade leaves everything inside completely untouched\n  ↳ Best when you have many JavaScript expressions in one section",
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
        en: "They solve different problems:\n\n<b>`@section` / `@yield`</b>\n• One slot, one value — a child view fills it in once\n  ↳ If two children both define the same `@section`, the last one wins\n  ↳ Use `@parent` if you want to keep the layout's default content and add to it\n\n<b>`@stack` / `@push`</b>\n• Additive — every `@push` call adds to the stack, they all accumulate in order\n  ↳ Multiple components on the same page can each push their own scripts to `@stack('scripts')`\n  ↳ Great for page-specific JavaScript or CSS that different components on the page need to inject",
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
        en: "Two ways — same ones as escaping for JavaScript frameworks:\n• Write `@{{ message }}` — Blade strips the `@` and outputs `{{ message }}` as literal HTML text\n  ↳ Use this for one or two expressions\n• Wrap a large block in `@verbatim ... @endverbatim` — Blade ignores everything between those tags\n  ↳ Use this when you have many `{{ }}` expressions in a section and don't want to prefix each one individually",
        np: "`@{{ message }}` लेख्नुस् — Blade `@` हटाएर `{{ message }}` literal output दिन्छ। ठूलो block मा `@verbatim`।",
        jp: "`@{{ message }}` と書くと Blade は `@` を除去し `{{ message }}` をそのまま出力します。大きなブロックには `@verbatim ... @endverbatim` を使います。",
      },
    },
  ],
};
