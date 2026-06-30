import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_20_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Modern Laravel apps almost always have a frontend story. You have three main paths: <b>Blade + Livewire</b> (server-rendered, reactive without writing JavaScript), <b>Inertia.js</b> (SPA feel with Vue or React, using Laravel routing and controllers), or a fully decoupled <b>API + frontend</b> (Sanctum + Next.js/Nuxt — covered in Day 15). Today covers Livewire and Inertia — the two \"integrated\" approaches that keep your team in one codebase.",
      np: "Laravel frontend: Livewire (PHP-centric, reactive), Inertia.js (Vue/React + Laravel routing), वा Sanctum API। आज Livewire र Inertia cover गर्छौं।",
      jp: "Laravel のフロントエンド: Livewire（PHP 中心）、Inertia.js（Vue/React + Laravel ルーティング）、Sanctum API の 3 択。今日は Livewire と Inertia を学ぶ。",
    },
    {
      en: "What each option is best for:\n\n<b>Livewire</b> — best when your team prefers PHP and minimal JavaScript\n↳ Think of it as interactive Blade — components re-render server-side on user interaction\n• No JavaScript framework to learn\n• Two-way data binding with `wire:model`\n• Full access to Laravel validation, auth, and Eloquent\n\n<b>Inertia.js</b> — best when your team knows Vue or React and wants a proper SPA\n↳ Think of it as using Laravel as a JSON API but with server-side routing (no `/api` prefix, no token management)\n• Controllers return Inertia responses instead of JSON\n• Vue/React page components receive props directly from controllers\n\n<b>Vite</b> — the asset bundler used by both; replaces Laravel Mix\n↳ Hot Module Replacement, near-instant builds, works with React, Vue, TypeScript",
      np: "Livewire: PHP-first, reactive Blade। Inertia: Vue/React + Laravel routing। Vite: asset bundler (Laravel Mix को replacement)।",
      jp: "Livewire: PHP 重視・Blade 拡張。Inertia: Vue/React + Laravel ルーティング。Vite: アセットバンドラー（Mix の後継）。",
    },
  ],
  sections: [
    {
      title: {
        en: "Vite — asset bundling in Laravel",
        np: "Vite — asset bundling",
        jp: "Vite — アセットバンドル",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Before diving into Livewire or Inertia, you need to understand the asset pipeline. <b>Vite</b> is a build tool — it takes your JS, CSS, and TypeScript files and bundles them for the browser. It replaced Laravel Mix in Laravel 10+.\n\nThe key win over Mix:\n• Dev server starts instantly (no webpack cold start)\n• Hot-reloads changes in milliseconds instead of seconds\n• Native TypeScript and JSX support with zero config\n• Smaller production bundles via tree-shaking",
            np: "Vite = JS/CSS build tool। Laravel 10+ मा Laravel Mix को replacement। Hot reload instant छ।",
            jp: "Vite は JS/CSS ビルドツール。Laravel 10 以降 Mix の後継。ホットリロードが高速。",
          },
        },
        {
          type: "code",
          title: { en: "vite.config.js + Blade integration", np: "vite.config.js", jp: "vite.config.js" },
          code: `// vite.config.js (default Laravel setup)
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true, // auto-refresh Blade on change
        }),
    ],
});

// Adding React support
// npm install @vitejs/plugin-react
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({ input: ['resources/js/app.jsx'], refresh: true }),
        react(),
    ],
});

// In Blade layouts — include compiled assets
// resources/views/layouts/app.blade.php
@vite(['resources/css/app.css', 'resources/js/app.js'])

// Dev: npm run dev   (starts Vite dev server with HMR)
// Prod: npm run build  (outputs to public/build/ with hashed filenames)`,
        },
        {
          type: "paragraph",
          text: {
            en: "Vite in production (`npm run build`) outputs versioned files to `public/build/manifest.json`. The `@vite()` directive reads this manifest to inject the correct hashed filenames. Never commit the `public/build/` folder to git — always run `npm run build` in your CI/CD pipeline.",
            np: "Production मा `npm run build` चलाउनुस्। `public/build/` git मा commit नगर्नुस् — CI/CD मा build गर्नुस्।",
            jp: "本番は `npm run build`。`public/build/` は git に含めず、CI/CD でビルドする。",
          },
        },
      ],
    },
    {
      title: {
        en: "Livewire — reactive PHP components",
        np: "Livewire — reactive PHP components",
        jp: "Livewire — リアクティブ PHP コンポーネント",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Livewire works by rendering a component as HTML on the server, sending it to the browser, and then — when the user interacts (types, clicks, submits) — sending a small Ajax request back to re-render just that component. No page refresh, no JavaScript state management, no REST API needed.\n\nAnalogy: it's like a turbo-charged Blade component that can react to user input.",
            np: "Livewire = server-side HTML render गर्छ। User interact गर्दा Ajax request पठाउँछ, component फेरि render हुन्छ। JavaScript framework चाहिँदैन।",
            jp: "Livewire はサーバー側で HTML をレンダリングし、ユーザー操作時に Ajax で再レンダリング。JS フレームワーク不要。",
          },
        },
        {
          type: "code",
          title: { en: "SearchPosts Livewire component", np: "Livewire component example", jp: "Livewire コンポーネント例" },
          code: `// php artisan make:livewire SearchPosts
// Creates: app/Livewire/SearchPosts.php + resources/views/livewire/search-posts.blade.php

// app/Livewire/SearchPosts.php
namespace App\\Livewire;

use Livewire\\Component;
use App\\Models\\Post;

class SearchPosts extends Component
{
    public string $search = '';

    // Runs automatically whenever $search changes
    public function updatedSearch(): void
    {
        $this->resetPage(); // reset pagination on new search
    }

    public function render()
    {
        return view('livewire.search-posts', [
            'posts' => Post::where('title', 'like', "%{$this->search}%")
                ->latest()
                ->limit(20)
                ->get(),
        ]);
    }
}

// resources/views/livewire/search-posts.blade.php
<div>
    <input wire:model.live.debounce.300ms="search"
           type="text"
           placeholder="Search posts..."
           class="w-full border rounded px-3 py-2" />

    <ul class="mt-4 space-y-2">
        @foreach ($posts as $post)
            <li>{{ $post->title }}</li>
        @endforeach
    </ul>
</div>

{{-- Include in any Blade view --}}
<livewire:search-posts />`,
        },
        {
          type: "paragraph",
          text: {
            en: "Key Livewire directives:\n• `wire:model` — two-way data binding (input ↔ PHP property)\n  ↳ `wire:model.live` updates on every keystroke; `wire:model.blur` updates on focus-out\n  ↳ `wire:model.live.debounce.300ms` waits 300ms after the user stops typing\n• `wire:click` — call a PHP method on click: `wire:click=\"deletePost({{ $post->id }})\"`\n• `wire:submit` — handle form submission server-side\n• `wire:loading` — show/hide an element while a network request is in flight\n  ↳ `wire:loading.class=\"opacity-50\"` dims the component while loading",
            np: "`wire:model`, `wire:click`, `wire:submit`, `wire:loading` — Livewire का मुख्य directives।",
            jp: "`wire:model`（双方向バインド）、`wire:click`（メソッド呼び出し）、`wire:submit`、`wire:loading` が主なディレクティブ。",
          },
        },
      ],
    },
    {
      title: {
        en: "Livewire — forms, validation & lifecycle hooks",
        np: "Livewire forms, validation र lifecycle",
        jp: "Livewire のフォーム・バリデーション・ライフサイクル",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Livewire form handling feels like writing a normal PHP form but without the redirect cycle. Define properties, validate with the same rules as Form Requests, and show errors with `@error`. For complex forms, use the `Form` object class (Livewire 3) to encapsulate form state and validation in one place.",
            np: "Livewire forms = PHP properties + validate() + @error। Redirect cycle नभई direct update हुन्छ।",
            jp: "Livewire のフォームは PHP プロパティ + `validate()` + `@error`。リダイレットなしで即更新。",
          },
        },
        {
          type: "code",
          title: { en: "CreatePost Livewire form", np: "CreatePost form", jp: "CreatePost フォーム" },
          code: `// app/Livewire/CreatePost.php
namespace App\\Livewire;

use Livewire\\Component;
use App\\Models\\Post;

class CreatePost extends Component
{
    public string $title = '';
    public string $body  = '';

    // Livewire 3: attribute-based validation
    #[\\Livewire\\Attributes\\Validate('required|min:3|max:255')]
    public string $titleField = '';

    protected $rules = [
        'title' => 'required|min:3|max:255',
        'body'  => 'required|min:10',
    ];

    public function save(): void
    {
        $validated = $this->validate();

        Post::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        $this->reset(['title', 'body']); // clear form
        session()->flash('message', 'Post created successfully.');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}

{{-- resources/views/livewire/create-post.blade.php --}}
<form wire:submit="save">
    <div>
        <input wire:model="title" type="text" placeholder="Post title" />
        @error('title') <span class="text-red-500">{{ $message }}</span> @enderror
    </div>
    <div class="mt-3">
        <textarea wire:model="body" placeholder="Post body"></textarea>
        @error('body') <span class="text-red-500">{{ $message }}</span> @enderror
    </div>
    <button type="submit" wire:loading.attr="disabled">
        <span wire:loading>Saving...</span>
        <span wire:loading.remove>Save Post</span>
    </button>
</form>`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Livewire lifecycle hooks</b>:\n• `mount()` — runs once when the component is first created (like a constructor)\n  ↳ Use it to load initial data: `$this->post = Post::find($id)`\n• `updated($property)` — runs after any property changes\n  ↳ Avoid expensive queries here; debounce or use `updatedTitle()` for specific properties\n• `hydrate()` / `dehydrate()` — run before/after each network request\n  ↳ Use for re-initialising non-serialisable state (e.g. DB connections)\n• `#[Lazy]` attribute — defers component rendering until after the page loads (great for heavy components)",
            np: "`mount()`, `updated()`, `hydrate()`/`dehydrate()` — Livewire lifecycle hooks।",
            jp: "`mount()`（初期化）、`updated()`（プロパティ変更後）、`hydrate()`/`dehydrate()`（リクエスト前後）が主なライフサイクル。",
          },
        },
      ],
    },
    {
      title: {
        en: "Inertia.js — SPA feel, server-side routing",
        np: "Inertia.js — SPA feel with server-side routing",
        jp: "Inertia.js — SPA 感覚＋サーバー側ルーティング",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Inertia is not a framework — it's a protocol. It sits between Laravel (server) and Vue/React (client) and lets them speak the same language.\n\nYour Laravel controller returns an Inertia response: `Inertia::render('PostIndex', ['posts' => $posts])`. On first load, the full HTML is returned. Subsequent navigations return a JSON payload that swaps out just the current page component — no full page reload, no routing library needed on the frontend.\n\nAnalogy: imagine a TV remote that changes what's showing on screen without turning the TV off and on again.",
            np: "Inertia = Laravel controller + Vue/React page components। Page navigation = JSON swap (no full reload)।",
            jp: "Inertia は Laravel コントローラーと Vue/React ページコンポーネントをつなぐプロトコル。ページ遷移は JSON スワップ（フルリロードなし）。",
          },
        },
        {
          type: "code",
          title: { en: "Inertia setup + controller + Vue page", np: "Inertia example", jp: "Inertia の例" },
          code: `// Install
// composer require inertiajs/inertia-laravel
// npm install @inertiajs/vue3 vue

// resources/views/app.blade.php (root layout)
<!DOCTYPE html>
<html>
<head>
    @vite(['resources/js/app.js'])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>

// resources/js/app.js
import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.vue', { eager: true });
        return pages[\`./Pages/\${name}.vue\`];
    },
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .mount(el);
    },
});

// app/Http/Controllers/PostController.php
use Inertia\\Inertia;
use App\\Http\\Resources\\PostResource;

public function index()
{
    return Inertia::render('Posts/Index', [
        'posts' => PostResource::collection(Post::with('author')->latest()->paginate(15)),
    ]);
}

// resources/js/Pages/Posts/Index.vue
<script setup>
import { Link } from '@inertiajs/vue3';

defineProps({ posts: Object });
</script>

<template>
  <div>
    <Link href="/posts/create">New Post</Link>
    <div v-for="post in posts.data" :key="post.id">
      <Link :href="\`/posts/\${post.id}\`">{{ post.title }}</Link>
    </div>
  </div>
</template>`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Shared data</b> — auth user, flash messages, and app-wide props belong in `HandleInertiaRequests` middleware's `share()` method, so they're available in every page component:\n• `auth.user` → `usePage().props.auth.user` in Vue/React\n• `flash.message` → show success/error banners globally\n• `ziggy` → share named routes to the frontend (with the Ziggy package)\n\nThis is the Inertia equivalent of Blade's `@auth` / `view()->share()` — define once, use everywhere.",
            np: "`HandleInertiaRequests::share()` मा auth user, flash messages राख्नुस् — सबै pages मा available हुन्छ।",
            jp: "`HandleInertiaRequests::share()` に認証ユーザーやフラッシュを設定すると全ページで利用できる。",
          },
        },
      ],
    },
    {
      title: {
        en: "Choosing your stack & SSR considerations",
        np: "Stack छनोट र SSR",
        jp: "スタック選択と SSR",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Which frontend approach to choose — the honest decision matrix:\n• Full PHP team, existing Blade app → add Livewire incrementally to specific components\n  ↳ No big rewrite; Blade and Livewire coexist perfectly\n• Vue/React team, wants tight Laravel integration → Inertia\n  ↳ Controllers, validation, auth all stay in PHP — just the views move to Vue/React\n• Separate mobile app OR third-party consumers → Sanctum API (Day 15)\n  ↳ Completely decoupled; frontend can be any technology\n• Need SEO on a Vue/React Inertia app → enable Inertia SSR with `php artisan inertia:start-ssr`",
            np: "PHP team → Livewire। Vue/React team → Inertia। Mobile/API → Sanctum। SEO चाहिने → Inertia SSR।",
            jp: "PHP チーム→ Livewire。Vue/React チーム→ Inertia。モバイル/API→ Sanctum。SEO 必要→ Inertia SSR。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Frontend approach comparison",
            np: "Frontend approaches",
            jp: "フロントエンドアプローチ比較",
          },
          headers: [
            { en: "Approach", np: "Approach", jp: "アプローチ" },
            { en: "JS required", np: "JS", jp: "JS 必要" },
            { en: "Routing", np: "Routing", jp: "ルーティング" },
            { en: "Auth", np: "Auth", jp: "認証" },
            { en: "SEO", np: "SEO", jp: "SEO" },
            { en: "Best for", np: "Best for", jp: "向いている用途" },
          ],
          rows: [
            [
              { en: "Blade", np: "Blade", jp: "Blade" },
              { en: "None", np: "नभएको", jp: "不要" },
              { en: "Server", np: "Server", jp: "サーバー" },
              { en: "Session", np: "Session", jp: "セッション" },
              { en: "Excellent", np: "उत्तम", jp: "優秀" },
              { en: "Content sites", np: "Content sites", jp: "コンテンツサイト" },
            ],
            [
              { en: "Livewire", np: "Livewire", jp: "Livewire" },
              { en: "Minimal", np: "न्यूनतम", jp: "最小限" },
              { en: "Server", np: "Server", jp: "サーバー" },
              { en: "Session", np: "Session", jp: "セッション" },
              { en: "Excellent", np: "उत्तम", jp: "優秀" },
              { en: "Admin UIs / forms", np: "Admin UIs", jp: "管理 UI・フォーム" },
            ],
            [
              { en: "Inertia + Vue/React", np: "Inertia", jp: "Inertia" },
              { en: "Vue or React", np: "Vue वा React", jp: "Vue か React" },
              { en: "Server", np: "Server", jp: "サーバー" },
              { en: "Session", np: "Session", jp: "セッション" },
              { en: "Needs SSR", np: "SSR चाहिन्छ", jp: "SSR が必要" },
              { en: "SPA with Laravel backend", np: "SPA + Laravel", jp: "Laravel バックエンド SPA" },
            ],
            [
              { en: "Decoupled API", np: "API", jp: "分離 API" },
              { en: "Any framework", np: "कुनै पनि", jp: "任意" },
              { en: "Client-side", np: "Client", jp: "クライアント" },
              { en: "Sanctum tokens", np: "Sanctum tokens", jp: "Sanctum トークン" },
              { en: "Client-side", np: "Client", jp: "クライアント側" },
              { en: "Mobile / headless", np: "Mobile / headless", jp: "モバイル・ヘッドレス" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "Inertia SSR runs a Node.js server (`php artisan inertia:start-ssr`) that renders the first page server-side for SEO and faster initial load. It's an opt-in — most admin apps don't need it. For public-facing marketing pages with SEO requirements, enable SSR or use a static site generator for those specific pages.",
            np: "Inertia SSR: Node.js server ले first page server-side render गर्छ। SEO चाहिने apps मा enable गर्नुस्।",
            jp: "Inertia SSR: Node.js が初回ページをサーバー側でレンダリング。SEO が必要な場合に有効化。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Can I mix Livewire and Inertia in the same app?",
        np: "एउटै app मा Livewire र Inertia दुवै प्रयोग गर्न सकिन्छ?",
        jp: "同じアプリで Livewire と Inertia を混在できますか?",
      },
      answer: {
        en: "Technically yes, but it creates two frontend systems to maintain. Typical pattern: use Inertia for the main app and Blade/Livewire for a simpler admin panel. Mixing them in the same views is unsupported and creates confusing state management.",
        np: "हुन्छ, तर maintenance double हुन्छ। Main app मा Inertia, admin panel मा Livewire — यो common pattern हो।",
        jp: "技術的には可能ですが、2 つのフロントエンドシステムを管理することになります。メインアプリに Inertia、管理パネルに Livewire が一般的なパターンです。",
      },
    },
    {
      question: {
        en: "Does Livewire work with Alpine.js?",
        np: "Livewire र Alpine.js सँगसँगै काम गर्छन्?",
        jp: "Livewire は Alpine.js と連携できますか?",
      },
      answer: {
        en: "Yes, they are designed to work together. Alpine.js handles client-side interactions (toggles, animations, dropdowns) while Livewire handles server interactions. Livewire ships with Alpine included — you don't need to install it separately. Rule: use `x-data`, `x-show`, `x-on:click` for purely visual JavaScript; use `wire:click` when a server round-trip is needed.",
        np: "हो, सँगसँगै काम गर्छन्। Alpine = client-side UI। Livewire = server interactions। Alpine Livewire मा included छ।",
        jp: "はい、一緒に使えます。Alpine は UI インタラクション、Livewire はサーバー通信を担当。Livewire に Alpine が同梱されています。",
      },
    },
    {
      question: {
        en: "How does Inertia handle form validation errors?",
        np: "Inertia मा form validation errors कसरी handle हुन्छ?",
        jp: "Inertia のフォームバリデーションエラーはどう扱いますか?",
      },
      answer: {
        en: "Inertia redirects back with a 422 response (Laravel validation failure) and includes the errors in the Inertia shared props. Use the `useForm()` helper in Vue/React — it automatically populates `form.errors` from the 422 response. No manual error parsing needed.",
        np: "`useForm()` helper प्रयोग गर्नुस्। 422 response आउँदा `form.errors` automatically populate हुन्छ।",
        jp: "`useForm()` ヘルパーを使うと、422 レスポンスから `form.errors` が自動的に設定されます。",
      },
    },
    {
      question: {
        en: "What is the performance impact of Livewire's network requests?",
        np: "Livewire का network requests को performance impact के हो?",
        jp: "Livewire のネットワークリクエストがパフォーマンスに与える影響は?",
      },
      answer: {
        en: "Every `wire:model.live` keystroke triggers a network request. For search inputs, use `wire:model.live.debounce.500ms` to delay the request 500ms after the user stops typing. For non-interactive updates, use `wire:model.blur` (only fires on focus-out). Profile with browser DevTools network tab to see the frequency and payload size.",
        np: "प्रत्येक keystroke मा request जान्छ। `wire:model.live.debounce.500ms` प्रयोग गर्नुस् search inputs मा।",
        jp: "キーストロークごとにリクエストが発生します。検索入力には `wire:model.live.debounce.500ms` を使い、不要なリクエストを減らしましょう。",
      },
    },
    {
      question: {
        en: "Can Vite handle TypeScript out of the box?",
        np: "Vite ले TypeScript automatically handle गर्छ?",
        jp: "Vite は TypeScript をそのまま扱えますか?",
      },
      answer: {
        en: "Yes. Vite processes TypeScript natively via esbuild without needing a separate `ts-loader`. Add `@types/node` and a `tsconfig.json`, then rename files to `.ts` or `.tsx`. Important caveat: Vite skips type-checking for speed — run `tsc --noEmit` separately in CI to catch type errors before deployment.",
        np: "हो, Vite ले TypeScript native support गर्छ (esbuild मार्फत)। CI मा `tsc --noEmit` छुट्टै चलाउनुस्।",
        jp: "はい、esbuild 経由でネイティブ対応。ただし型チェックはスキップされるため、CI で `tsc --noEmit` を別途実行してください。",
      },
    },
  ],
};
