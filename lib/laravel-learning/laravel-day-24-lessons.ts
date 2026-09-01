import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_24_LESSONS: LessonDay = {
  day: 24,
  title: "Frontend integration — Vite, Livewire & Inertia",
  totalMinutes: 90,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "two-paths",
      title: "Two paths, and where state lives",
      durationMinutes: 11,
      explanation: "Yesterday built an API for a client you do not write. Today is the client you do.\n\nLaravel offers two ways, and they are genuinely different:\n\n```text\n                    Laravel\n                       │\n         ┌─────────────┴─────────────┐\n         ▼                           ▼\n   Blade + Livewire          JavaScript + Inertia\n         │                           │\n   server-driven                client-side UI\n         │                           │\n   PHP components          React / Vue / Svelte\n```\n\n<b>The useful skill is knowing when to choose each</b>, not memorising both APIs.\n\n---\n\n### 1. Basic — the two stacks\n\n<b>Livewire</b> keeps you in PHP:\n\n```text\nbrowser  →  Blade  →  Livewire  →  Laravel  →  database\n```\n\nYou write PHP classes and Blade templates. JavaScript is minimal, and often none of your own.\n\n<b>Inertia</b> keeps Laravel and gives the browser a real JavaScript application:\n\n```text\nbrowser  →  React / Vue / Svelte  →  Inertia  →  Laravel  →  database\n```\n\nYour routes, controllers, validation and Eloquent are unchanged. The views become components.\n\n<b>Neither is an API.</b> That is worth stating, because both give you a single-page feel without the thing you built yesterday: no separate client, no tokens, no versioning, no CORS. The frontend and the backend are one deployment that happens to speak to itself.\n\n---\n\n### 2. Intermediate — the one difference that matters\n\nEverything else follows from this: <b>where does the interface's state live?</b>\n\n```text\nLivewire                       Inertia\n────────                       ───────\nbrowser                        browser\n   ↓                              ↓\nLivewire component             React state\n   ↓                              ↓\nPHP state, on the server       Inertia visit\n   ↓                              ↓\nLaravel                        Laravel\n```\n\nIn Livewire, <b>the truth about what is typed in that search box is a PHP property on the server.</b> The browser holds a rendering of it. Type a character and a request goes out; PHP updates and sends back new HTML.\n\nIn Inertia, <b>the truth is JavaScript state in the browser.</b> React owns it, and Laravel is asked for data when the page needs some.\n\nEverything you notice afterwards comes from that. Livewire needs a round trip for interactions and gives you PHP everywhere. Inertia is instant locally and asks you to write and reason about a JavaScript application.\n\n---\n\n### 3. Advanced — choosing\n\nThe honest answer is that it depends on things that are not about Laravel:\n\n```text\nteam skills\napplication complexity\nhow much of the UI is genuinely interactive\nhow much JavaScript you want to own\n```\n\n<b>Livewire fits when Laravel should own the application:</b>\n\n```text\nadmin panels · dashboards · CRUD · forms\ninternal tools · data tables · a CMS\n```\n\nThings that are mostly a database with an interface on it. Writing those in React means rebuilding validation, pagination and state that Laravel already has.\n\n<b>Inertia fits when the interface is the product:</b>\n\n```text\na SaaS dashboard · rich data visualisation\nhighly interactive UI · a large component system\n```\n\nAnd it fits when your team already writes React well, because then Livewire is the unfamiliar thing.\n\nTwo cautions worth carrying.\n\n<b>Livewire's round trip is real.</b> Every interaction is a request, so a component that reacts to each keystroke is a request per keystroke. On a fast connection it is invisible; on a slow one it is not, and the fixes are debouncing and doing less per interaction rather than a different framework.\n\n<b>And Inertia is a JavaScript application.</b> Choosing it means a build step, a component tree, client state and everything else that comes with React, which is a real cost when the page is a table with a filter.\n\n<b>You can also use both</b>, in the same application, on different pages. The admin area in Livewire and the customer-facing dashboard in Inertia is a normal arrangement, because Laravel underneath is identical.",
      diagram: `Two paths

                      Laravel
                         │
           ┌─────────────┴─────────────┐
           ▼                           ▼
     Blade + Livewire          JavaScript + Inertia
           │                           │
     server-driven                client-side UI
           │                           │
     PHP components          React / Vue / Svelte


  Livewire   browser → Blade → Livewire → Laravel → db
  Inertia    browser → React → Inertia  → Laravel → db

  Neither is an API. Both give a single-page feel with
  no separate client, no tokens, no versioning, no CORS.
  One deployment, talking to itself.


The one difference that matters

  Where does the interface's STATE live?

  Livewire                    Inertia
  ────────                    ───────
  browser                     browser
     ↓                           ↓
  Livewire component          React state
     ↓                           ↓
  PHP state, ON THE SERVER    Inertia visit
     ↓                           ↓
  Laravel                     Laravel

  Livewire: the truth about what is in that search box
  is a PHP property. The browser holds a rendering of
  it. Type a character → a request → new HTML.

  Inertia: the truth is JavaScript state in the browser.
  React owns it; Laravel is asked for data.

  Everything else follows. Livewire needs a round trip
  and gives you PHP everywhere. Inertia is instant
  locally and asks you to own a JavaScript application.


Choosing

  It depends on things that are not about Laravel:
    team skills
    how much of the UI is genuinely interactive
    how much JavaScript you want to own

  Livewire, when Laravel should own the application:
    admin panels · dashboards · CRUD · forms
    internal tools · data tables · a CMS

    Mostly a database with an interface on it. Writing
    those in React means rebuilding validation,
    pagination and state Laravel already has.

  Inertia, when the interface IS the product:
    a SaaS dashboard · rich visualisation
    highly interactive UI · a large component system

    And when the team already writes React well.


Two cautions

  Livewire's round trip is real. Every interaction is a
  request, so reacting to each keystroke is a request
  per keystroke. The fixes are debouncing and doing less,
  not a different framework.

  Inertia IS a JavaScript application: a build step, a
  component tree, client state. A real cost when the
  page is a table with a filter.


  And you can use BOTH, on different pages of one app.
  Laravel underneath is identical.`,
      codeExample: {
        title: "The same page, two ways",
        code: `<?php
// ---------- Livewire: the state is a PHP property ----------

// app/Livewire/SearchPosts.php

namespace App\\Livewire;

use App\\Models\\Post;
use Livewire\\Component;

class SearchPosts extends Component
{
    // The truth about what is in the search box.
    public string $search = '';

    public function render()
    {
        return view('livewire.search-posts', [
            'posts' => Post::where('title', 'like', "%{$this->search}%")
                ->paginate(10),
        ]);
    }
}
?>

{{-- resources/views/livewire/search-posts.blade.php --}}

<div>
    <input wire:model.live="search" placeholder="Search posts">

    @foreach ($posts as $post)
        <p>{{ $post->title }}</p>
    @endforeach

    {{ $posts->links() }}
</div>

{{-- Type a character → a request → PHP re-renders → new HTML --}}


<?php
// ---------- Inertia: the state is React state ----------

// app/Http/Controllers/PostController.php

public function index(Request $request)
{
    return Inertia::render('Posts/Index', [
        'posts'   => PostResource::collection(
            Post::where('title', 'like', "%{$request->search}%")->paginate(10)
        ),
        'filters' => $request->only('search'),
    ]);
}
?>

// resources/js/pages/Posts/Index.tsx

import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Index({ posts, filters }) {
    // The truth about what is in the search box.
    const [search, setSearch] = useState(filters.search ?? '');

    return (
        <div>
            <input
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    router.get('/posts', { search: e.target.value },
                        { preserveState: true, replace: true });
                }}
            />

            {posts.data.map((post) => <p key={post.id}>{post.title}</p>)}
        </div>
    );
}

// Typing updates React instantly. Laravel is asked for
// data, not for the interface.


<?php
// ---------- What is identical in both ----------

// routes, controllers, validation, policies, Eloquent,
// migrations, jobs, mail — every day of this track so far.
//
// Only the last step differs: a Blade view driven by
// Livewire, or a component driven by Inertia.
//
// Which is why the two can live in one application,
// on different pages.`,
      },
      keyTakeaways: [
        "<b>Laravel offers two frontend paths: Blade with Livewire, and a JavaScript framework with Inertia.</b>",
        "<b>Livewire keeps you in PHP</b>, with Blade templates and minimal JavaScript.",
        "<b>Inertia keeps Laravel's routes, controllers and validation</b>, and replaces the views with components.",
        "<b>Neither is an API</b>: no separate client, no tokens, no versioning, no CORS.",
        "<b>The difference that matters is where the interface's state lives.</b>",
        "<b>In Livewire the state is a PHP property on the server</b>, and the browser holds a rendering of it.",
        "<b>In Inertia the state is JavaScript state in the browser</b>, and Laravel is asked for data.",
        "<b>Livewire fits work that is mostly a database with an interface</b>: admin panels, CRUD, internal tools.",
        "<b>Inertia fits when the interface is the product</b>, or when the team already writes React well.",
        "<b>Livewire's round trip is real</b>, so per-keystroke interactivity is a request per keystroke.",
        "<b>Inertia is a JavaScript application</b>, with the build step and client state that implies.",
        "<b>Both can be used in one application on different pages</b>, because Laravel underneath is identical.",
      ],
      commonMistakes: [
        "<b>Treating this as an API decision.</b> Neither approach needs the API you built yesterday.",
        "<b>Choosing by fashion rather than by team.</b> The unfamiliar option is the expensive one, whichever it is.",
        "<b>Building an admin CRUD screen in React.</b> You rebuild validation, pagination and state Laravel already has.",
        "<b>Reaching for Livewire on a highly interactive interface.</b> Every interaction becomes a round trip.",
        "<b>Assuming you must pick one for the whole application.</b> Different pages can use different approaches.",
      ],
      quiz: [
        {
          question: "What is the core difference between Livewire and Inertia?",
          options: [
            "One is faster",
            "Where the interface's state lives: a PHP property on the server, or JavaScript state in the browser",
            "Inertia requires an API",
            "Livewire cannot paginate",
          ],
          correctIndex: 1,
          explanation: "Everything else you notice follows from that.",
        },
        {
          question: "Does Inertia require you to build a REST API?",
          options: [
            "Yes, it consumes one",
            "No; Laravel's routes and controllers return pages with props",
            "Only for forms",
            "Only in production",
          ],
          correctIndex: 1,
          explanation: "That is the point of it: a SPA feel without a separate API.",
        },
        {
          question: "Which kind of application suits Livewire best?",
          options: [
            "A highly interactive data visualisation tool",
            "An admin panel or CRUD-heavy internal tool",
            "A public marketing site",
            "A mobile application",
          ],
          correctIndex: 1,
          explanation: "Mostly a database with an interface, where Laravel already has the pieces.",
        },
        {
          question: "What is the cost of Livewire's model?",
          options: [
            "It cannot validate",
            "Every interaction is a server round trip",
            "It requires a build step",
            "It needs a separate deployment",
          ],
          correctIndex: 1,
          explanation: "Which is why per-keystroke updates need debouncing.",
        },
      ],
    },
    {
      id: "vite-and-tailwind",
      title: "Vite, hot reload & asset versioning",
      durationMinutes: 11,
      explanation: "Both paths need the same thing underneath: something that turns your CSS and JavaScript into files a browser can use.\n\n---\n\n### 1. Basic — what Vite is for\n\n```text\nresources/\n├── css/app.css\n└── js/app.js\n```\n\nThose are not files a browser should fetch directly. They import other files, they may be TypeScript, and the CSS needs processing. <b>Vite is the build tool that turns them into something servable</b>, and the dev server that makes changes appear instantly.\n\n```text\nJavaScript · CSS · TypeScript · assets\nhot reload · production builds\n```\n\nIn Blade:\n\n```blade\n@vite(['resources/css/app.css', 'resources/js/app.js'])\n```\n\nOne directive, two behaviours:\n\n```text\ndevelopment              production\n───────────              ──────────\npoints at the dev        points at the built,\nserver                   versioned files\nhot updates              cached hard\n```\n\n<b>That is the whole reason `@vite` exists</b> rather than a `<script src>`: the correct answer differs between environments, and the directive knows which one you are in.\n\n---\n\n### 2. Intermediate — hot reload\n\n```bash\nnpm run dev\n```\n\nThen edit a component or a stylesheet:\n\n```text\nbefore                  with Vite\n──────                  ─────────\nedit                    edit\n  ↓                       ↓\nbuild                   Vite detects it\n  ↓                       ↓\nrefresh                 the browser updates\n```\n\nAnd in the good case it updates <i>without</i> a full reload, so the state you had on screen survives. On a form you are halfway through, that is the difference between a two-second loop and a twenty-second one.\n\nTwo things that catch people:\n\n<b>`npm run dev` must be running.</b> Without it, `@vite` points at a dev server that is not there and the page loads with no styles at all. The blank unstyled page is almost always this.\n\n<b>And it is for development only.</b> Production runs `npm run build` once, at deploy time, and serves the output. A server running `npm run dev` in production is a misconfiguration, not a shortcut.\n\n---\n\n### 3. Advanced — why versioned filenames\n\nBrowsers cache aggressively, which is what you want until you deploy.\n\n```text\nyou deploy a fix\n      ↓\nthe browser has app.js cached\n      ↓\nthe user runs yesterday's code\n```\n\nAnd nothing tells either of you. The bug is fixed, the customer still has it, and \"try a hard refresh\" is a support conversation nobody should have to have.\n\n<b>Vite gives every build a filename derived from its contents:</b>\n\n```text\napp.js  →  app-abc123.js\n\ncontent changes\n\napp.js  →  app-def456.js\n```\n\nA different filename is a different URL, so the cache cannot answer it. <b>Change the code and every browser fetches the new file; change nothing and every browser keeps the cached one.</b> Correct in both directions, with no cache headers to tune.\n\nThe manifest maps the names, and `@vite` reads it, which is why you never write a hashed filename yourself.\n\nOne deployment note that follows: <b>`npm run build` has to run before the new code is live</b>, or Blade asks the manifest for a file that is not there yet. That is a real deployment error, and its message is `Unable to locate file in Vite manifest`.\n\n---\n\n### Tailwind\n\nThe styling layer both paths share:\n\n```html\n<button class=\"rounded-lg bg-blue-600 px-4 py-2 text-white\">Search</button>\n```\n\nrather than inventing `.search-button` and a stylesheet to hold it.\n\nThe trade is real and worth naming: <b>the markup gets noisier and the stylesheet stops growing.</b> A CSS file that only ever gets added to is a genuine long-term problem, because nobody can safely delete from it; utility classes make the styling local to the thing it styles, which means deleting a component deletes its styles.\n\nAnd when a pattern repeats, it becomes a component in whichever system you are using: a Blade component, or a React one. <b>The repetition is a signal, not a defect.</b>",
      diagram: `What Vite is for

  resources/
  ├── css/app.css
  └── js/app.js

  Not files a browser should fetch: they import other
  files, may be TypeScript, and the CSS needs processing.

  Vite builds them, and serves them instantly while
  you work.

  @vite(['resources/css/app.css', 'resources/js/app.js'])

  development              production
  ───────────              ──────────
  points at the dev        points at the built,
  server                   versioned files
  hot updates              cached hard

  That is why @vite exists rather than a <script src>:
  the right answer differs per environment, and the
  directive knows which one you are in.


Hot reload

  npm run dev

  before                   with Vite
  ──────                   ─────────
  edit                     edit
    ↓                        ↓
  build                    Vite detects it
    ↓                        ↓
  refresh                  the browser updates

  And often without a full reload, so the state on
  screen survives. Halfway through a form, that is a
  two-second loop instead of twenty.

  ⚠️  npm run dev must be RUNNING. Without it, @vite
      points at a server that is not there and the page
      loads with no styles. The blank unstyled page is
      almost always this.

  ⚠️  It is development only. Production runs npm run
      build once at deploy time.


Why versioned filenames

  you deploy a fix
        ↓
  the browser has app.js cached
        ↓
  the user runs yesterday's code

  Nothing tells either of you. The bug is fixed, the
  customer still has it, and "try a hard refresh" is a
  support conversation nobody should have.

  Vite names every build from its CONTENTS:

    app.js  →  app-abc123.js
    content changes
    app.js  →  app-def456.js

  A different filename is a different URL, so the cache
  cannot answer it.

    code changed    → every browser fetches the new file
    nothing changed → every browser keeps the cached one

  Correct both ways, with no cache headers to tune.

  ⚠️  npm run build must run before the new code is live,
      or Blade asks the manifest for a file that is not
      there:  "Unable to locate file in Vite manifest".


Tailwind

  <button class="rounded-lg bg-blue-600 px-4 py-2 text-white">

  rather than inventing .search-button and a stylesheet
  to hold it.

  The trade: noisier markup, and a stylesheet that stops
  growing. A CSS file that is only ever added to is a
  real long-term problem, because nobody can safely
  delete from it. Utility classes keep styling local, so
  deleting a component deletes its styles.

  When a pattern repeats, it becomes a component —
  Blade or React. The repetition is a signal, not
  a defect.`,
      codeExample: {
        title: "Vite from development to deploy",
        code: `// vite.config.js

import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,      // reload on Blade and route changes
        }),
        react(),
    ],
});


{{-- resources/views/layouts/app.blade.php --}}

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Points at the dev server locally and at the built,
         versioned files in production. --}}
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
</head>
<body>
    {{ $slot }}
</body>
</html>


# ---------- Development ----------

npm run dev

# Leave it running. Edit a component and the browser
# updates, often without losing the state on screen.
#
# ⚠️ A page with no styles at all is almost always this
#    command not running.


# ---------- Production ----------

npm run build

# resources/js/app.tsx  →  public/build/assets/app-abc123.js
# resources/css/app.css →  public/build/assets/app-def456.css
#
# The filename comes from the CONTENT, so:
#
#   code changed    → new filename → every browser fetches it
#   nothing changed → same filename → every browser caches it
#
# ⚠️ This must run before the new code is live, or:
#    "Unable to locate file in Vite manifest"


# ---------- A deploy script ----------

git pull
composer install --no-dev --optimize-autoloader
npm ci
npm run build              # before the code goes live
php artisan migrate --force
php artisan config:cache
php artisan route:cache


{{-- ---------- Tailwind ---------- --}}

{{-- Utilities, in the markup that uses them --}}
<button class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
    Search
</button>

{{-- When it repeats, it becomes a component --}}
{{-- resources/views/components/button.blade.php --}}
<button {{ $attributes->merge([
    'class' => 'rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700',
]) }}>
    {{ $slot }}
</button>

{{-- <x-button>Search</x-button> --}}`,
      },
      keyTakeaways: [
        "<b>Vite builds your CSS and JavaScript</b> and serves them instantly while you work.",
        "<b>`@vite()` points at the dev server locally and at built, versioned files in production.</b>",
        "That is why it exists rather than a plain `<script src>`: the right answer differs per environment.",
        "<b>`npm run dev` must be running</b>, and a page with no styles at all is almost always that.",
        "<b>Hot reload often updates without a full refresh</b>, so the state on screen survives an edit.",
        "<b>Production runs `npm run build` once at deploy time</b>, and serves the output.",
        "<b>Browsers cache assets, so a deploy can leave users running yesterday's code.</b>",
        "<b>Vite names every build from its contents</b>, so a changed file is a new URL the cache cannot answer.",
        "<b>`npm run build` must run before the new code is live</b>, or Blade cannot find the file in the manifest.",
        "<b>Tailwind trades noisier markup for a stylesheet that stops growing</b>, and keeps styles local to what they style.",
        "<b>A repeated utility pattern becomes a component</b>, which is a signal rather than a defect.",
      ],
      commonMistakes: [
        "<b>Loading the page without `npm run dev` running.</b> Nothing is styled and nothing explains why.",
        "<b>Running `npm run dev` on a production server.</b> Production serves built files, not a dev server.",
        "<b>Deploying without `npm run build`.</b> Blade asks the manifest for files that do not exist.",
        "<b>Writing hashed filenames by hand.</b> The manifest maps them, and `@vite` reads it.",
        "<b>Adding a `.search-button` class for every component.</b> The stylesheet grows and nobody can safely delete from it.",
      ],
      quiz: [
        {
          question: "What does `@vite()` do differently in production?",
          options: [
            "Nothing",
            "It points at the built, versioned files rather than the dev server",
            "It minifies at request time",
            "It disables CSS",
          ],
          correctIndex: 1,
          explanation: "One directive, and it knows which environment it is in.",
        },
        {
          question: "The page loads with no styles at all. What is the usual cause?",
          options: [
            "A missing Tailwind config",
            "`npm run dev` is not running, so `@vite` points at a dev server that is not there",
            "The cache needs clearing",
            "A missing layout",
          ],
          correctIndex: 1,
          explanation: "In production the equivalent cause is a missing `npm run build`.",
        },
        {
          question: "Why does Vite include a hash in built filenames?",
          options: [
            "To prevent tampering",
            "A changed file gets a new URL, so caches cannot serve the old one",
            "For debugging",
            "To compress them",
          ],
          correctIndex: 1,
          explanation: "And unchanged files keep their name, so they stay cached.",
        },
        {
          question: "What is the trade Tailwind makes?",
          options: [
            "Smaller pages for slower rendering",
            "Noisier markup for a stylesheet that stops growing, with styles local to what they style",
            "Less flexibility for faster builds",
            "None",
          ],
          correctIndex: 1,
          explanation: "Deleting a component then deletes its styles too.",
        },
      ],
    },
    {
      id: "livewire-basics",
      title: "Livewire — components, properties & wire:model",
      durationMinutes: 12,
      explanation: "Interactive interfaces, written in PHP.\n\n---\n\n### 1. Basic — a component is two files\n\n```bash\nphp artisan make:livewire SearchPosts\n```\n\n```text\napp/Livewire/SearchPosts.php               the class: state and actions\nresources/views/livewire/search-posts.blade.php   the template\n```\n\nThe class holds state and behaviour; the Blade file renders it. Which is the same split as a controller and a view, except that <b>the class stays alive across interactions</b> rather than answering one request and disappearing.\n\nA property is state:\n\n```php\nclass SearchPosts extends Component\n{\n    public string $search = '';\n\n    public function render()\n    {\n        return view('livewire.search-posts', [\n            'posts' => Post::where('title', 'like', \"%{$this->search}%\")->get(),\n        ]);\n    }\n}\n```\n\nAnd `render()` runs again after every interaction, which is why the list updates without you writing anything to update it.\n\n---\n\n### 2. Intermediate — `wire:model`\n\n```blade\n<input wire:model=\"search\">\n```\n\n```text\nuser types\n    ↓\nwire:model\n    ↓\n$search on the server\n```\n\n<b>`$this->search` is now what the user typed</b>, in PHP, with no route, no request handling and no JavaScript of your own.\n\nOne detail that decides how the component feels:\n\n```text\nwire:model             updates on blur or submit\nwire:model.live        updates on every keystroke\nwire:model.live.debounce.300ms   after they stop typing\nwire:model.blur        explicitly on blur\n```\n\n<b>The default is deliberate.</b> Livewire waits, because the alternative is a server request per keystroke. `.live` is what you want for a search box, and `.debounce` is what makes `.live` reasonable: one request when they pause, not eight while they type \"laravel\".\n\nThat one modifier is the difference between a component that feels instant and one that feels like a form from 2004, and it is the most common Livewire performance problem.\n\n---\n\n### 3. Advanced — what is actually being sent\n\n<b>Every interaction sends the component's public properties to the server and gets HTML back.</b> Which explains three rules that otherwise look arbitrary.\n\n<b>Public properties must be serialisable.</b> Strings, numbers, arrays, and Eloquent models Livewire can re-resolve. Not a closure, a file handle, or an arbitrary object. Anything the component needs but cannot serialise belongs in `render()` or a computed property, not a public property.\n\n<b>They also travel in both directions</b>, which makes them visible to the browser. A public property is not a place for anything the user should not see.\n\n<b>And they can be modified by the client.</b> A `public int $userId` can be changed before the request comes back, so <b>authorization has to be checked in the action, not assumed from the property.</b> Day 20 applies here exactly as it does in a controller.\n\nTwo things that make components readable.\n\n<b>A computed property</b> for anything derived, so it is not stored and not sent:\n\n```php\n#[Computed]\npublic function posts()\n{\n    return Post::where('title', 'like', \"%{$this->search}%\")->paginate(10);\n}\n```\n\n<b>And `wire:key` in loops</b>, so Livewire can tell rows apart when the list changes. Without it, a filtered list can reuse the wrong DOM element, which produces the bug where a checkbox stays ticked on the wrong row.",
      diagram: `A component is two files

  php artisan make:livewire SearchPosts

    app/Livewire/SearchPosts.php          the class
    resources/views/livewire/
        search-posts.blade.php            the template

  The same split as a controller and a view, except the
  class STAYS ALIVE across interactions rather than
  answering one request and disappearing.

    public string \$search = '';

  render() runs again after every interaction, which is
  why the list updates without you writing anything to
  update it.


wire:model

  <input wire:model="search">

    user types → wire:model → \$search on the server

  \$this->search is what the user typed. In PHP. No route,
  no request handling, no JavaScript of your own.

  And the modifier decides how it FEELS:

    wire:model                      on blur or submit
    wire:model.live                 every keystroke
    wire:model.live.debounce.300ms  when they stop
    wire:model.blur                 explicitly on blur

  The default waits on purpose: the alternative is a
  request per keystroke. .live suits a search box, and
  .debounce is what makes .live reasonable — one request
  when they pause, not eight while they type "laravel".

  That one modifier is the most common Livewire
  performance problem.


What is actually being sent

  Every interaction sends the component's PUBLIC
  PROPERTIES to the server and gets HTML back.

  Which explains three rules:

    They must be SERIALISABLE.
      strings, numbers, arrays, models Livewire can
      re-resolve — not closures, handles or arbitrary
      objects. Anything else belongs in render() or a
      computed property.

    They travel in BOTH directions.
      A public property is visible to the browser. Not
      a place for anything the user should not see.

    They can be MODIFIED by the client.
      A public int \$userId can be changed before the
      request comes back. Authorization is checked in
      the ACTION, never assumed from the property.
      Day 20 applies exactly as in a controller.


Two things that make components readable

  #[Computed] for anything derived
    not stored, not sent

  wire:key in loops
    so Livewire can tell rows apart when the list
    changes. Without it, a filtered list reuses the
    wrong DOM element — the bug where a checkbox
    stays ticked on the wrong row.`,
      codeExample: {
        title: "A search component",
        code: `<?php
// php artisan make:livewire SearchPosts

namespace App\\Livewire;

use App\\Models\\Post;
use Livewire\\Attributes\\Computed;
use Livewire\\Component;
use Livewire\\WithPagination;

class SearchPosts extends Component
{
    use WithPagination;

    // State. Sent to the server on every interaction,
    // and visible to the browser.
    public string $search = '';
    public string $status = 'all';

    // Derived: not stored, not sent.
    #[Computed]
    public function posts()
    {
        return Post::query()
            ->when($this->search, fn ($q) =>
                $q->where('title', 'like', "%{$this->search}%"))
            ->when($this->status !== 'all', fn ($q) =>
                $q->where('status', $this->status))
            ->latest()
            ->paginate(10);
    }

    public function render()
    {
        return view('livewire.search-posts');
    }
}
?>

{{-- resources/views/livewire/search-posts.blade.php --}}

<div>
    {{-- .live.debounce: one request when they pause,
         not one per keystroke --}}
    <input
        wire:model.live.debounce.300ms="search"
        placeholder="Search posts"
        class="rounded border px-3 py-2"
    >

    <select wire:model.live="status" class="rounded border px-3 py-2">
        <option value="all">All</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
    </select>

    {{-- Livewire shows this while a request is in flight --}}
    <div wire:loading class="text-sm text-gray-500">Searching…</div>

    @forelse ($this->posts as $post)
        {{-- wire:key so rows are not confused when the
             list changes --}}
        <div wire:key="post-{{ $post->id }}" class="border-b py-2">
            <p class="font-medium">{{ $post->title }}</p>
            <p class="text-sm text-gray-500">{{ $post->status }}</p>
        </div>
    @empty
        <p class="py-8 text-center text-gray-500">No posts found.</p>
    @endforelse

    {{ $this->posts->links() }}
</div>


<?php
// ---------- The modifiers, and what they cost ----------

// wire:model                     on blur or submit
// wire:model.live                every keystroke  ← 8 requests
//                                   for "laravel"
// wire:model.live.debounce.300ms one request when they pause
// wire:model.blur                explicitly on blur


<?php
// ---------- Public properties are client-controlled ----------

class EditPost extends Component
{
    public Post $post;

    // ❌ The browser can change $post's id before the
    //    request returns. This trusts it.
    public function save()
    {
        $this->post->update(['title' => $this->title]);
    }

    // ✓ Authorize in the action, exactly as in a controller.
    public function saveSafely()
    {
        $this->authorize('update', $this->post);

        $this->post->update(['title' => $this->title]);
    }
}


<?php
// ---------- What cannot be a public property ----------

// ❌ Not serialisable, and sent on every interaction.
public \\Closure $formatter;
public $fileHandle;

// ✓ Derive it where it is needed.
#[Computed]
public function formatter()
{
    return fn ($value) => number_format($value, 2);
}`,
      },
      keyTakeaways: [
        "<b>A Livewire component is a PHP class plus a Blade view</b>, and the class stays alive across interactions.",
        "<b>Public properties are the component's state</b>, and `render()` runs again after every interaction.",
        "<b>`wire:model` binds an input to a property</b>, so `$this->search` is what the user typed.",
        "<b>The default updates on blur</b>, because `.live` means a server request per keystroke.",
        "<b>`.debounce` is what makes `.live` reasonable</b>: one request when they pause, not one per character.",
        "<b>Every interaction sends the public properties to the server</b> and receives HTML back.",
        "<b>Public properties must be serialisable</b>, so closures and handles belong in `render()` or a computed property.",
        "<b>They are visible to the browser</b>, so nothing secret belongs in one.",
        "<b>They can be modified by the client</b>, so authorization is checked in the action, never assumed.",
        "<b>`#[Computed]` derives values without storing or sending them</b>, and `wire:key` keeps rows straight in a loop.",
      ],
      commonMistakes: [
        "<b>Using `wire:model.live` with no debounce on a text input.</b> Every keystroke is a server request.",
        "<b>Trusting a public property in an action.</b> The client can change it; authorize as you would in a controller.",
        "<b>Putting a closure or a resource in a public property.</b> It cannot be serialised and is sent every time.",
        "<b>Omitting `wire:key` in a loop.</b> Filtering reuses the wrong DOM element and state sticks to the wrong row.",
        "<b>Storing derived data in a public property.</b> It is recomputed anyway, and now it travels both ways.",
      ],
      quiz: [
        {
          question: "What does a Livewire interaction actually send?",
          options: [
            "Only the changed field",
            "The component's public properties, receiving rendered HTML back",
            "A JSON API request",
            "The whole page",
          ],
          correctIndex: 1,
          explanation: "Which is why properties must be serialisable and are visible to the client.",
        },
        {
          question: "Why does `wire:model` default to updating on blur?",
          options: [
            "It is easier to implement",
            "`.live` means a server request per keystroke",
            "Blur events are more reliable",
            "For accessibility",
          ],
          correctIndex: 1,
          explanation: "`.debounce` is what makes `.live` reasonable on a text input.",
        },
        {
          question: "Can you trust a public property's value in an action?",
          options: [
            "Yes, it comes from the server",
            "No; the client can modify it, so authorize in the action",
            "Only if it is typed",
            "Only for strings",
          ],
          correctIndex: 1,
          explanation: "Day 20's rules apply exactly as they do in a controller.",
        },
        {
          question: "What does `wire:key` prevent in a loop?",
          options: [
            "Duplicate database queries",
            "Livewire reusing the wrong DOM element when the list changes",
            "Validation errors",
            "Extra requests",
          ],
          correctIndex: 1,
          explanation: "The classic symptom is a checkbox staying ticked on the wrong row.",
        },
      ],
    },
    {
      id: "livewire-actions-and-uploads",
      title: "Actions, lifecycle hooks, validation & uploads",
      durationMinutes: 12,
      explanation: "State was the first half. This is the part that does things.\n\n---\n\n### 1. Basic — actions\n\nA public method is an action:\n\n```php\npublic function searchPosts()\n{\n    // query posts\n}\n```\n\n```blade\n<button wire:click=\"searchPosts\">Search</button>\n```\n\n```text\nclick\n  ↓\nLivewire request\n  ↓\nyour PHP method\n  ↓\ndatabase\n  ↓\nupdated HTML\n  ↓\nbrowser\n```\n\n<b>You never write the AJAX request</b>, and that is the whole appeal: `wire:click` calls a PHP method, and the page updates.\n\nActions take arguments:\n\n```blade\n<button wire:click=\"delete({{ $post->id }})\">Delete</button>\n```\n\nAnd the warning from the last lesson applies with more force here: <b>that id comes from the browser.</b> An action is a route, and it needs the same authorization a route would.\n\nUseful modifiers:\n\n```text\nwire:click.prevent       stop the default\nwire:submit              a form, without a page load\nwire:confirm=\"Sure?\"     a confirmation before it runs\nwire:loading             shown while a request is in flight\nwire:dirty               shown when there are unsaved changes\n```\n\n---\n\n### 2. Intermediate — lifecycle hooks and validation\n\nA hook runs when something changes:\n\n```php\npublic function updatedSearch()\n{\n    $this->resetPage();\n}\n```\n\n```text\n$search changes\n      ↓\nupdatedSearch()\n      ↓\nreset to page 1\n```\n\n<b>That specific example is one you will need.</b> Filter a paginated list while on page 5 and you are looking at page 5 of a shorter list, which is usually empty. Resetting the page on every filter change is the fix, and forgetting it is a bug that looks like \"search is broken\".\n\nOther hooks: `mount()` when the component is created, `updating()` before a change, `updated()` after any of them.\n\n<b>Keep them small.</b> A hook runs on every relevant change, so a heavy one runs constantly, and logic buried in a hook is hard to find when the component misbehaves.\n\nValidation is Laravel's, in the component:\n\n```php\n$this->validate([\n    'title' => ['required', 'string', 'max:255'],\n]);\n```\n\nErrors reach Blade through the same `@error` directive as a normal form:\n\n```text\ninput → Livewire → Laravel validation → errors → Blade\n```\n\n<b>Same rules, same messages, no duplication.</b> Which is the strongest practical argument for Livewire: the validation you already wrote works, unchanged, in an interactive interface.\n\nAnd `#[Validate]` attributes put the rule next to the property, so it also validates live as the user types.\n\n---\n\n### 3. Advanced — file uploads\n\n```blade\n<input type=\"file\" wire:model=\"photo\">\n```\n\n```php\nuse Livewire\\WithFileUploads;\n\npublic $photo;\n```\n\n```text\nbrowser\n  ↓\nLivewire upload\n  ↓\na temporary file\n  ↓\nvalidation\n  ↓\nstorage\n```\n\nThe upload happens immediately, into temporary storage, so you can show a preview before anything is saved. `$this->photo->temporaryUrl()` is what that preview uses.\n\n<b>And every rule from Day 22 still applies</b>, because nothing about Livewire changes what an upload is:\n\n```text\nvalidate the type, with mimes:\nvalidate the size, with max:\nvalidate dimensions on an image\nnever trust the filename\nstore with store(), not storeAs() from the client\n```\n\nTwo things specific to this arrangement.\n\n<b>Temporary files accumulate.</b> An upload that is never submitted still landed on your server, so the temporary directory needs pruning; Livewire's own cleanup handles it if configured.\n\n<b>And validate on upload, not only on submit.</b> `#[Validate('image|max:2048')]` on the property rejects a 40 MB file as it arrives, rather than after it has been transferred and is sitting in temporary storage.",
      diagram: `Actions

  public function searchPosts() { ... }

  <button wire:click="searchPosts">Search</button>

    click → Livewire request → your PHP method
          → database → updated HTML → browser

  You never write the AJAX request. That is the appeal.

  With arguments:

    wire:click="delete({{ \$post->id }})"

  ⚠️  That id comes from the BROWSER. An action is a
      route, and needs the authorization a route would.

  Modifiers:
    wire:click.prevent     stop the default
    wire:submit            a form, no page load
    wire:confirm="Sure?"   confirm before running
    wire:loading           shown during a request
    wire:dirty             shown when unsaved


Lifecycle hooks

    \$search changes → updatedSearch() → resetPage()

  That specific one you will need: filter a paginated
  list while on page 5 and you are on page 5 of a
  shorter list, which is usually empty. Forgetting it
  is a bug that looks like "search is broken".

  Also: mount() on creation, updating() before,
  updated() after any change.

  Keep them SMALL. A hook runs on every relevant change,
  so a heavy one runs constantly — and logic buried in
  a hook is hard to find when the component misbehaves.


Validation is Laravel's, in the component

  \$this->validate([
      'title' => ['required', 'string', 'max:255'],
  ]);

    input → Livewire → Laravel validation → errors → Blade

  Same rules, same messages, no duplication. Which is
  the strongest practical argument for Livewire: the
  validation you already wrote works, unchanged, in an
  interactive interface.

  #[Validate] puts the rule next to the property, and
  validates live as the user types.


File uploads

  <input type="file" wire:model="photo">
  use WithFileUploads;

    browser → Livewire upload → a temporary file
            → validation → storage

  The upload happens immediately, so you can show a
  preview: \$this->photo->temporaryUrl()

  Every Day 22 rule still applies:
    validate the type with mimes:
    validate the size with max:
    validate dimensions on an image
    never trust the filename
    store() rather than storeAs() from the client

  Two things specific here:

    Temporary files accumulate. An upload never
    submitted still landed on your server.

    Validate ON UPLOAD, not only on submit.
    #[Validate('image|max:2048')] rejects a 40 MB file
    as it arrives, rather than after it is transferred.`,
      codeExample: {
        title: "Actions, hooks, validation and an upload",
        code: `<?php

namespace App\\Livewire;

use App\\Models\\Post;
use Livewire\\Attributes\\Validate;
use Livewire\\Component;
use Livewire\\WithFileUploads;
use Livewire\\WithPagination;

class PostForm extends Component
{
    use WithPagination, WithFileUploads;

    // The rule sits next to the property, and validates
    // live as the user types.
    #[Validate('required|string|max:255')]
    public string $title = '';

    #[Validate('required|string')]
    public string $body = '';

    // Rejected as it arrives, not after transfer.
    #[Validate('nullable|image|max:2048')]
    public $photo;

    public string $search = '';

    // ---------- Lifecycle ----------

    public function mount(): void
    {
        // Runs once, when the component is created.
    }

    public function updatedSearch(): void
    {
        // Filtering while on page 5 shows page 5 of a
        // shorter list, which is usually empty.
        $this->resetPage();
    }

    // ---------- Actions ----------

    public function save()
    {
        // Laravel's validation, unchanged.
        $this->validate();

        $post = auth()->user()->posts()->create([
            'title' => $this->title,
            'body'  => $this->body,
        ]);

        if ($this->photo) {
            // Day 22's rules, unchanged: a generated name.
            $post->update([
                'photo_path' => $this->photo->store('photos', 's3'),
            ]);
        }

        $this->reset(['title', 'body', 'photo']);

        session()->flash('status', 'Post created.');
    }

    public function delete(int $postId): void
    {
        $post = Post::findOrFail($postId);

        // That id came from the browser. An action is a
        // route, and needs the same authorization.
        $this->authorize('delete', $post);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.post-form');
    }
}
?>

{{-- resources/views/livewire/post-form.blade.php --}}

<div>
    <form wire:submit="save">
        <input wire:model.blur="title" class="rounded border px-3 py-2">
        @error('title') <p class="text-sm text-red-600">{{ $message }}</p> @enderror

        <textarea wire:model.blur="body" class="rounded border px-3 py-2"></textarea>
        @error('body') <p class="text-sm text-red-600">{{ $message }}</p> @enderror

        <input type="file" wire:model="photo">

        {{-- A preview, before anything is saved --}}
        @if ($photo)
            <img src="{{ $photo->temporaryUrl() }}" class="h-24 w-24 rounded">
        @endif

        <button type="submit" wire:loading.attr="disabled">
            <span wire:loading.remove>Save</span>
            <span wire:loading>Saving…</span>
        </button>
    </form>

    @foreach ($posts as $post)
        <div wire:key="post-{{ $post->id }}">
            {{ $post->title }}

            <button
                wire:click="delete({{ $post->id }})"
                wire:confirm="Delete this post?"
            >Delete</button>
        </div>
    @endforeach
</div>


<?php
// ---------- Keep hooks small ----------

// ❌ Runs on every keystroke of every property.
public function updated($property): void
{
    $this->recalculateEverything();
    $this->syncWithExternalApi();
}

// ✓ One property, one small job.
public function updatedSearch(): void
{
    $this->resetPage();
}`,
      },
      keyTakeaways: [
        "<b>A public method is an action</b>, called from Blade with `wire:click` or `wire:submit`.",
        "<b>You never write the AJAX request</b>: the click calls PHP and the page updates.",
        "<b>An action's arguments come from the browser</b>, so an action needs the authorization a route would.",
        "`wire:loading`, `wire:confirm`, `wire:dirty` and `.prevent` cover the common interface needs.",
        "<b>Lifecycle hooks react to changes</b>, and `updatedSearch()` calling `resetPage()` is one you will need.",
        "Filtering a paginated list without resetting the page shows an empty page 5, which looks like broken search.",
        "<b>Keep hooks small</b>, because they run on every relevant change and hide logic when things misbehave.",
        "<b>Validation is Laravel's, unchanged</b>, and errors reach Blade through the usual `@error` directive.",
        "<b>`#[Validate]` puts the rule next to the property</b> and validates live as the user types.",
        "<b>File uploads land in temporary storage immediately</b>, so `temporaryUrl()` can show a preview.",
        "<b>Every Day 22 upload rule still applies</b>, and validating on upload rejects a huge file as it arrives.",
      ],
      commonMistakes: [
        "<b>Trusting an id passed to an action.</b> It came from the browser, so authorize before acting on it.",
        "<b>Filtering without `resetPage()`.</b> The user sees an empty page and reports that search is broken.",
        "<b>Putting heavy work in a lifecycle hook.</b> It runs on every change, and nobody looks there first.",
        "<b>Re-implementing validation in JavaScript.</b> The rules you already wrote work here unchanged.",
        "<b>Validating an upload only on submit.</b> The file has already been transferred and stored temporarily.",
      ],
      quiz: [
        {
          question: "What does `wire:click=\"delete(5)\"` require you to remember?",
          options: [
            "To debounce it",
            "That the argument came from the browser, so the action must authorize",
            "To wrap it in a form",
            "To add `wire:key`",
          ],
          correctIndex: 1,
          explanation: "An action is a route, with the same rules.",
        },
        {
          question: "Why does a filter change usually need `resetPage()`?",
          options: [
            "To clear the cache",
            "Otherwise the user stays on page 5 of a now-shorter list, which is usually empty",
            "To re-run validation",
            "To reset the sort order",
          ],
          correctIndex: 1,
          explanation: "The symptom looks like search returning nothing.",
        },
        {
          question: "What validation does a Livewire component use?",
          options: [
            "A JavaScript library",
            "Laravel's validator, with the same rules and messages",
            "Its own rule set",
            "Browser validation",
          ],
          correctIndex: 1,
          explanation: "Which is the strongest practical argument for Livewire.",
        },
        {
          question: "When does a Livewire file upload reach the server?",
          options: [
            "On form submission",
            "Immediately, into temporary storage, which is what allows a preview",
            "Only after validation passes",
            "Never; it stays in the browser",
          ],
          correctIndex: 1,
          explanation: "So validate on upload rather than only on submit.",
        },
      ],
    },
    {
      id: "volt-and-flux",
      title: "Volt & Flux UI",
      durationMinutes: 9,
      explanation: "Two things built on Livewire that change how much you write.\n\n---\n\n### 1. Basic — Volt\n\nA Livewire component is two files. For a small one, that is two files for eleven lines of code:\n\n```text\napp/Livewire/SearchPosts.php\nresources/views/livewire/search-posts.blade.php\n```\n\n<b>Volt</b> puts both in one:\n\n```text\nsearch-posts.blade.php\n        │\n        ├── PHP logic\n        └── HTML\n```\n\nThe state, the actions and the markup sit together, which for a small component is genuinely easier to read: you can see everything the thing does without opening a second file.\n\n```text\nVolt              one file, less ceremony\nclass-based       separate concerns, easier to test\n```\n\n<b>The trade-off is real in both directions.</b> A component with three properties and one action reads better in one file. A component with fifteen properties, six actions and validation is easier to navigate, and much easier to unit test, as a class.\n\nThe useful rule: <b>start with Volt for small components, and move to a class when the file stops fitting on a screen.</b> Converting is mechanical.\n\n---\n\n### 2. Intermediate — Flux\n\nEvery application needs the same primitives:\n\n```text\nbutton · modal · dropdown · input\nselect · tabs · table · badge\n```\n\nBuilding them yourself means building focus management, keyboard handling, accessible labelling and consistent styling, per component, and getting each of them right.\n\n<b>Flux</b> is a component library built for Livewire:\n\n```text\nLivewire  +  Flux  →  an interactive Laravel interface\n```\n\nSo a modal is a modal, a dropdown closes on escape, and everything looks like the same product without you designing a design system first.\n\n---\n\n### 3. Advanced — what you are choosing\n\nA component library is a real decision, in both directions.\n\n<b>What you get:</b> consistency without effort, accessibility you would otherwise have to know about, and speed. A form built from ready components is an afternoon rather than a week, and it is a better form.\n\n<b>What you give up:</b> a dependency in your interface layer, someone else's design opinions, and the awkward moment when a design calls for something the library does not do. Fighting a component library is slower than not having one.\n\nThe question worth asking: <b>is your interface a differentiator, or a way to use the application?</b>\n\n```text\nan admin panel, an internal tool,\na back-office system                     →  use a library\n\na product whose interface is the thing\nyou are selling                          →  own more of it\n```\n\nMost applications are the first, and most teams overestimate how much the second applies to them.\n\nOne last note that generalises. <b>The same argument recurs on the Inertia side</b>, where shadcn/ui appears later today with a different answer: it gives you the component code in your own project rather than as a dependency. Different trade, same question, and knowing which one you are making is the point.",
      diagram: `Volt: one file instead of two

  app/Livewire/SearchPosts.php
  resources/views/livewire/search-posts.blade.php

  Two files for eleven lines of code.

  Volt:

    search-posts.blade.php
            │
            ├── PHP logic
            └── HTML

  State, actions and markup together, so you can see
  everything the component does without opening a
  second file.

    Volt          one file, less ceremony
    class-based   separate concerns, easier to test

  Three properties and one action → one file reads better.
  Fifteen properties, six actions and validation →
  easier to navigate, and much easier to unit test,
  as a class.

  Start with Volt. Move to a class when the file stops
  fitting on a screen. Converting is mechanical.


Flux: the primitives you always need

  button · modal · dropdown · input
  select · tabs · table · badge

  Building them yourself means focus management,
  keyboard handling, accessible labelling and consistent
  styling — per component, each of them correct.

    Livewire + Flux → an interactive Laravel interface

  A modal is a modal. A dropdown closes on escape.
  Everything matches, without designing a design system
  first.


What you are actually choosing

  You get
    consistency without effort
    accessibility you would otherwise have to know about
    speed — a form is an afternoon, and a better form

  You give up
    a dependency in your interface layer
    somebody else's design opinions
    the awkward moment when a design needs something
    the library does not do

  Fighting a component library is slower than not
  having one.


  The question:

    is your interface a DIFFERENTIATOR, or a way to
    use the application?

      admin panel, internal tool,      → use a library
      back-office system

      a product whose interface is     → own more of it
      the thing you are selling

  Most applications are the first, and most teams
  overestimate how much the second applies to them.


  The same argument recurs on the Inertia side, where
  shadcn/ui answers it differently: the component code
  lives in your project rather than as a dependency.
  Different trade, same question.`,
      codeExample: {
        title: "Volt, and a Flux-built form",
        code: `{{-- ---------- A Volt component: one file ---------- --}}
{{-- resources/views/livewire/search-posts.blade.php --}}

<?php

use App\\Models\\Post;
use Livewire\\Volt\\Component;
use Livewire\\WithPagination;

new class extends Component {
    use WithPagination;

    public string $search = '';

    public function updatedSearch(): void
    {
        $this->resetPage();
    }

    public function with(): array
    {
        return [
            'posts' => Post::when($this->search, fn ($q) =>
                $q->where('title', 'like', "%{$this->search}%"))
                ->paginate(10),
        ];
    }
}; ?>

<div>
    <input wire:model.live.debounce.300ms="search" placeholder="Search">

    @foreach ($posts as $post)
        <p wire:key="post-{{ $post->id }}">{{ $post->title }}</p>
    @endforeach

    {{ $posts->links() }}
</div>

{{-- Everything the component does, on one screen. --}}


{{-- ---------- When it should become a class ---------- --}}

{{-- Fifteen properties, six actions and validation is
     easier to navigate, and much easier to unit test,
     as app/Livewire/PostManager.php with its own view. --}}


{{-- ---------- Flux: the primitives ---------- --}}

<flux:input wire:model="email" label="Email" type="email" />

@error('email')
    <flux:error>{{ $message }}</flux:error>
@enderror

<flux:select wire:model.live="status" label="Status">
    <flux:select.option value="all">All</flux:select.option>
    <flux:select.option value="published">Published</flux:select.option>
</flux:select>

<flux:button wire:click="save" variant="primary">Save</flux:button>

<flux:modal name="confirm-delete">
    <flux:heading>Delete this post?</flux:heading>
    <flux:text>This cannot be undone.</flux:text>

    <flux:button wire:click="delete" variant="danger">Delete</flux:button>
</flux:modal>

{{-- The modal traps focus, closes on escape and is
     labelled correctly. None of which you wrote. --}}


{{-- ---------- What building it yourself involves ---------- --}}

{{-- A modal is not a div with a fixed position:

       focus moves into it, and back out on close
       escape closes it
       the background does not scroll
       screen readers announce it
       tab does not escape into the page behind

     Each of those is a thing to know, and to get right,
     for every primitive.

     Which is the argument for a library — and the reason
     to ask first whether your interface is a
     differentiator or a way to use the application. --}}`,
      },
      keyTakeaways: [
        "<b>A Livewire component is normally two files</b>, which is a lot of ceremony for a small one.",
        "<b>Volt puts the logic and the template in one file</b>, so a small component is readable at a glance.",
        "<b>A class-based component is easier to navigate and much easier to unit test</b> once it grows.",
        "<b>Start with Volt and convert when the file stops fitting on a screen</b>; the conversion is mechanical.",
        "<b>Flux is a component library for Livewire</b>, covering buttons, modals, dropdowns, inputs and tables.",
        "Building those yourself means focus management, keyboard handling and accessible labelling, each done correctly.",
        "<b>A library buys consistency, accessibility and speed</b>, and costs a dependency and somebody else's opinions.",
        "<b>Fighting a component library is slower than not having one</b>, so the fit matters.",
        "<b>Ask whether your interface is a differentiator or a way to use the application.</b>",
        "<b>The same question appears on the Inertia side with shadcn/ui</b>, answered differently: you own the code.",
      ],
      commonMistakes: [
        "<b>Writing every component as a class out of habit.</b> A three-property component is clearer in one file.",
        "<b>Keeping a Volt file that has grown to hundreds of lines.</b> That is the point to convert.",
        "<b>Building your own modal.</b> Focus, escape, scroll locking and announcements are all part of it.",
        "<b>Fighting a component library's design.</b> That is slower than having written the components yourself.",
        "<b>Assuming your interface is a differentiator.</b> Most applications are an interface onto a database.",
      ],
      quiz: [
        {
          question: "What does Volt change?",
          options: [
            "It replaces Livewire",
            "It puts a component's logic and template in a single file",
            "It removes the need for validation",
            "It compiles components to JavaScript",
          ],
          correctIndex: 1,
          explanation: "Convenient for a small component; a class scales better.",
        },
        {
          question: "When should a Volt component become a class?",
          options: [
            "Immediately",
            "When it grows enough that navigating and unit testing it in one file becomes awkward",
            "When it uses validation",
            "Never",
          ],
          correctIndex: 1,
          explanation: "The conversion is mechanical, so start simple.",
        },
        {
          question: "What is the strongest argument for a component library like Flux?",
          options: [
            "It reduces bundle size",
            "Accessibility and consistency you would otherwise have to build correctly per primitive",
            "It removes the need for Tailwind",
            "It generates the backend",
          ],
          correctIndex: 1,
          explanation: "A modal alone involves focus, escape, scroll locking and announcements.",
        },
        {
          question: "What question decides whether to use one?",
          options: [
            "How large the team is",
            "Whether your interface is a differentiator or a way to use the application",
            "Which framework you chose",
            "Whether you use TypeScript",
          ],
          correctIndex: 1,
          explanation: "Most applications are the second, and most teams assume the first.",
        },
      ],
    },
    {
      id: "inertia-basics",
      title: "Inertia — pages, props & forms",
      durationMinutes: 12,
      explanation: "The other path: a real JavaScript frontend, without the API you built yesterday.\n\n---\n\n### 1. Basic — what Inertia is\n\n> <b>A single-page frontend without turning Laravel into a separate API backend.</b>\n\n```text\nReact\n  ↕\nInertia\n  ↕\nLaravel\n  ↕\nEloquent\n```\n\nLaravel keeps everything it already did:\n\n```text\nroutes · controllers · validation · authorization · database\n```\n\nReact handles what it is good at:\n\n```text\ncomponents · interface state · interactions\n```\n\n<b>The thing worth appreciating is what is absent.</b> No tokens, no CORS, no versioning, no separate deployment, no second set of routes. Yesterday's API exists because a client you do not control needs a contract. Inertia's client is your own code, shipped together, so it does not need one.\n\n---\n\n### 2. Intermediate — pages and props\n\nA controller returns a page instead of a view:\n\n```php\nreturn Inertia::render('Posts/Index', [\n    'posts'   => $posts,\n    'filters' => $filters,\n]);\n```\n\n```text\nresources/js/pages/Posts/Index.tsx\n```\n\nAnd the second argument arrives as props:\n\n```text\nLaravel controller\n      ↓\nprops\n      ↓\nInertia\n      ↓\nReact page\n```\n\n<b>Which makes the mental model simple: a controller is still a controller.</b> It authorizes, queries and returns data. Only the last line changed.\n\nProps travel over the wire, so <b>use API Resources here too</b>, for the same reason as yesterday: without one you serialise the model, and every column reaches the browser and the page source.\n\nTypes make the contract explicit on the other side:\n\n```ts\ntype Props = {\n    posts: Post[];\n    filters: Filters;\n};\n```\n\n<b>An Inertia visit is not a page load.</b> Clicking a link makes a request, receives the new page's props as JSON, and swaps the component. The layout, the JavaScript and the scroll position survive, which is what makes it feel like a single-page application.\n\n---\n\n### 3. Advanced — forms, and why they are the good part\n\nThis is where Inertia earns its place, because it is the part a hand-rolled API makes tedious.\n\n```text\nReact form\n   ↓\nInertia form helper\n   ↓\na normal Laravel route\n   ↓\nvalidation\n   ↓\nredirect, or errors\n   ↓\nReact\n```\n\n```tsx\nconst form = useForm({ title: '', body: '' });\n\nform.post('/posts');\n```\n\nAnd the controller is the one you would have written anyway:\n\n```php\n$request->validate([...]);\n\nPost::create($data);\n\nreturn redirect()->route('posts.index');\n```\n\n<b>A failed validation redirects back, and Inertia puts the errors in `form.errors`</b>, keyed by field. No 422 to parse, no error shape to agree on, no duplicated rules.\n\nThe helper also gives you the things every form needs and nobody enjoys writing:\n\n```text\nform.processing    disable the button\nform.errors        per field\nform.progress      for uploads\nform.reset()\nform.isDirty       warn before leaving\n```\n\nTwo things worth knowing.\n\n<b>A controller redirects, it does not return JSON.</b> That surprises people coming from an API: after a successful `POST`, redirect as you would for a Blade form, and Inertia follows it and renders the next page.\n\n<b>And validation errors are shared automatically</b>, so `form.errors` is populated without the controller doing anything special. Same rules, same messages, one source of truth.",
      diagram: `What Inertia is

  > A single-page frontend without turning Laravel into
    a separate API backend.

    React
      ↕
    Inertia
      ↕
    Laravel
      ↕
    Eloquent

  Laravel keeps: routes · controllers · validation ·
                 authorization · database
  React handles: components · interface state ·
                 interactions

  What is ABSENT is the point:

    no tokens · no CORS · no versioning
    no separate deployment · no second set of routes

  Yesterday's API exists because a client you do not
  control needs a contract. Inertia's client is your
  own code, shipped together.


Pages and props

  return Inertia::render('Posts/Index', [
      'posts'   => \$posts,
      'filters' => \$filters,
  ]);

    resources/js/pages/Posts/Index.tsx

    Laravel controller → props → Inertia → React page

  A controller is still a controller: it authorizes,
  queries and returns data. Only the last line changed.

  Props travel over the wire, so use API Resources here
  too — without one you serialise the model and every
  column reaches the browser and the page source.

  type Props = { posts: Post[]; filters: Filters };


  An Inertia VISIT is not a page load. A link makes a
  request, receives the next page's props as JSON, and
  swaps the component. The layout, the JavaScript and
  the scroll position survive.


Forms: the part that earns its place

  React form
     ↓
  Inertia form helper
     ↓
  a NORMAL Laravel route
     ↓
  validation
     ↓
  redirect, or errors
     ↓
  React

    const form = useForm({ title: '', body: '' });
    form.post('/posts');

  And the controller is the one you would have written:

    \$request->validate([...]);
    Post::create(\$data);
    return redirect()->route('posts.index');

  A failed validation redirects back, and Inertia puts
  the errors in form.errors, keyed by field.

    no 422 to parse
    no error shape to agree on
    no duplicated rules

  Plus what every form needs and nobody enjoys writing:

    form.processing   disable the button
    form.errors       per field
    form.progress     uploads
    form.reset()
    form.isDirty      warn before leaving


  Two things:

    A controller REDIRECTS, it does not return JSON.
    Surprising if you came from an API. Redirect as you
    would for a Blade form; Inertia follows it.

    Validation errors are shared automatically, so
    form.errors is populated with no special controller
    code. One source of truth.`,
      codeExample: {
        title: "A page, its props, and a form",
        code: `<?php
// ---------- The controller: still a controller ----------

namespace App\\Http\\Controllers;

use App\\Models\\Post;
use Illuminate\\Http\\Request;
use Inertia\\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Posts/Index', [
            // A resource here too: without one, every
            // column reaches the browser and the page source.
            'posts' => PostResource::collection(
                Post::query()
                    ->when($request->search, fn ($q, $search) =>
                        $q->where('title', 'like', "%{$search}%"))
                    ->latest()
                    ->paginate(10)
                    ->withQueryString()
            ),
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body'  => ['required', 'string'],
        ]);

        $request->user()->posts()->create($data);

        // A redirect, not JSON. Inertia follows it.
        return redirect()->route('posts.index')
            ->with('status', 'Post created.');
    }
}
?>

// ---------- The page ----------
// resources/js/pages/Posts/Index.tsx

import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

type Post = { id: number; title: string; status: string };
type Props = { posts: { data: Post[] }; filters: { search?: string } };

export default function Index({ posts, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    return (
        <>
            <Head title="Posts" />

            <input
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    router.get('/posts', { search: e.target.value }, {
                        preserveState: true,
                        replace: true,
                    });
                }}
            />

            {posts.data.map((post) => (
                <Link key={post.id} href={'/posts/' + post.id}>
                    {post.title}
                </Link>
            ))}
        </>
    );
}

// A Link is an Inertia visit, not a page load: it fetches
// the next page's props and swaps the component. The
// layout and the JavaScript survive.


// ---------- The form ----------
// resources/js/pages/Posts/Create.tsx

import { useForm } from '@inertiajs/react';

export default function Create() {
    const form = useForm({ title: '', body: '' });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/posts');
    }

    return (
        <form onSubmit={submit}>
            <input
                value={form.data.title}
                onChange={(e) => form.setData('title', e.target.value)}
            />
            {/* Populated from Laravel's validation. No 422 parsing. */}
            {form.errors.title && <p>{form.errors.title}</p>}

            <textarea
                value={form.data.body}
                onChange={(e) => form.setData('body', e.target.value)}
            />
            {form.errors.body && <p>{form.errors.body}</p>}

            <button type="submit" disabled={form.processing}>
                {form.processing ? 'Saving…' : 'Save'}
            </button>
        </form>
    );
}

// form.processing · form.errors · form.progress
// form.reset() · form.isDirty
//
// The things every form needs and nobody enjoys writing.`,
      },
      keyTakeaways: [
        "<b>Inertia gives a single-page frontend without a separate API</b>: no tokens, no CORS, no versioning.",
        "<b>Laravel keeps its routes, controllers, validation, authorization and Eloquent</b>; React takes the views.",
        "<b>`Inertia::render('Page', [...])` returns a page and its props</b>, so only the controller's last line changed.",
        "<b>Props travel over the wire, so use API Resources here too</b>, or every column reaches the browser.",
        "TypeScript types make the prop contract explicit on the frontend side.",
        "<b>An Inertia visit is not a page load</b>: it fetches props and swaps the component, keeping layout and state.",
        "<b>The form helper posts to a normal Laravel route</b>, which validates and redirects as it always did.",
        "<b>Validation errors arrive in `form.errors`, keyed by field</b>, with no 422 to parse and no duplicated rules.",
        "<b>A controller redirects rather than returning JSON</b>, and Inertia follows the redirect.",
        "`form.processing`, `form.progress`, `form.reset()` and `form.isDirty` cover what every form needs.",
      ],
      commonMistakes: [
        "<b>Returning JSON from an Inertia controller.</b> Redirect as you would for a Blade form.",
        "<b>Passing models straight into props.</b> Every column is serialised into the page, exactly as on an API.",
        "<b>Rebuilding validation in React.</b> The rules already exist and their errors arrive automatically.",
        "<b>Using a plain `<a>` instead of `Link`.</b> That is a full page load, and the SPA feel is gone.",
        "<b>Thinking Inertia needs the API from yesterday.</b> It replaces the need for one.",
      ],
      quiz: [
        {
          question: "What does Inertia let you avoid?",
          options: [
            "Writing controllers",
            "Building a separate API with tokens, CORS and versioning",
            "Using Eloquent",
            "Validation",
          ],
          correctIndex: 1,
          explanation: "Its client is your own code, shipped with the application.",
        },
        {
          question: "What does an Inertia controller return after a successful POST?",
          options: [
            "JSON with the created model",
            "A redirect, which Inertia follows",
            "A 201 status",
            "The page component",
          ],
          correctIndex: 1,
          explanation: "Exactly as it would for a Blade form.",
        },
        {
          question: "How do Laravel validation errors reach a React form?",
          options: [
            "You parse the 422 body",
            "Inertia shares them automatically, and they appear in `form.errors` keyed by field",
            "You duplicate the rules in JavaScript",
            "Through a separate endpoint",
          ],
          correctIndex: 1,
          explanation: "One source of truth for the rules and the messages.",
        },
        {
          question: "Why use an API Resource for Inertia props?",
          options: [
            "Inertia requires it",
            "Props are serialised into the page, so without one every column reaches the browser",
            "For pagination",
            "For TypeScript types",
          ],
          correctIndex: 1,
          explanation: "The same argument as yesterday, for the same reason.",
        },
      ],
    },
    {
      id: "inertia-performance-and-types",
      title: "Partial reloads, deferred props, TypeScript & Precognition",
      durationMinutes: 12,
      explanation: "Making an Inertia page fast, and making its contract hold.\n\n---\n\n### 1. Basic — partial reloads\n\nA dashboard page has several props:\n\n```text\nPosts · Statistics · Notifications · Profile\n```\n\nChange the search filter and, by default, the controller runs again and returns all four. Three of them were fine.\n\n<b>A partial reload asks for a subset:</b>\n\n```tsx\nrouter.get('/dashboard', { search }, { only: ['posts'] });\n```\n\n```text\nrequest\n  ↓\n\"only posts\"\n  ↓\nLaravel\n  ↓\nposts\n  ↓\nReact updates posts\n```\n\nAnd because a prop can be a closure, <b>Laravel does not even run the queries for the props you did not ask for:</b>\n\n```php\n'statistics' => fn () => $this->expensiveStats(),\n```\n\nThat closure is only called when `statistics` is included. Without it, a filter keystroke re-runs the statistics query every time, which is the most common Inertia performance problem and the least visible one.\n\n---\n\n### 2. Intermediate — deferred props\n\nSome data is slow and not needed immediately:\n\n```text\ntitle       immediate\nposts       immediate\nanalytics   takes two seconds\n```\n\nBy default the page waits for all three, so the user sees nothing for two seconds because of a chart below the fold.\n\n<b>A deferred prop lets the page render first:</b>\n\n```php\n'analytics' => Inertia::defer(fn () => $this->analytics()),\n```\n\n```text\npage renders\n     ↓\ndeferred request\n     ↓\nanalytics arrive\n     ↓\nthat part fills in\n```\n\n<b>The total time is the same; the perceived time is not.</b> Something useful is on screen immediately, and the expensive part appears where a placeholder was.\n\nWhich makes the design question explicit: what does the user need first? Usually the thing they came for, and rarely the chart.\n\n---\n\n### 3. Advanced — types, components and duplicated rules\n\n<b>TypeScript</b> makes the prop contract checkable:\n\n```ts\ntype User = { id: number; name: string; email: string };\n```\n\n```text\nLaravel data → Inertia props → TypeScript types → React\n```\n\nWithout it, a renamed field in a resource is a runtime `undefined` somewhere in the interface. With it, it is a compile error, in the right file, before it ships.\n\nThe types are still written by hand, so they can drift; a generator that produces them from your resources removes that, and is worth adding once the number of pages grows.\n\n<b>shadcn/ui</b> is the component-library question from the Volt lesson, answered differently. <b>You copy the component code into your project and own it.</b> No dependency to fight, no upgrade to fear, and no ceiling when a design needs something unusual. The cost is that it is now your code: your bugs, your accessibility, your maintenance.\n\n```text\na library      somebody else's code, somebody else's decisions\nshadcn/ui      your code, from a good starting point\n```\n\n<b>Precognition</b> solves the duplication that Inertia otherwise reintroduces.\n\nLivewire validates on the server as you type, because the state is already there. In React, live validation usually means writing the rules again:\n\n```text\nLaravel                React\n───────                ─────\nemail required         email required\nemail valid            email valid\npassword min 12        password min 12\n```\n\n<b>Two sources of truth, and one of them will fall behind.</b>\n\nPrecognition sends the form to Laravel <i>before</i> submission and asks it to validate without executing:\n\n```text\nuser types\n    ↓\nprecognition request\n    ↓\nLaravel's own rules\n    ↓\nvalidation result\n    ↓\nfrontend shows it\n```\n\nOne set of rules, live feedback, and no chance of the two disagreeing. On a long form, that is the difference between finding out about field three at the end and finding out immediately.",
      diagram: `Partial reloads

  A dashboard: Posts · Statistics · Notifications · Profile

  Change the filter and, by default, the controller runs
  again and returns all four. Three were fine.

    router.get('/dashboard', { search }, { only: ['posts'] })

    request → "only posts" → Laravel → posts
            → React updates posts

  And because a prop can be a CLOSURE, Laravel does not
  even run the queries you did not ask for:

    'statistics' => fn () => \$this->expensiveStats(),

  Without that, a filter keystroke re-runs the statistics
  query every time. The most common Inertia performance
  problem, and the least visible.


Deferred props

    title       immediate
    posts       immediate
    analytics   takes two seconds

  By default the page waits for all three, so the user
  sees nothing for two seconds because of a chart below
  the fold.

    'analytics' => Inertia::defer(fn () => ...)

    page renders → deferred request → analytics arrive
                 → that part fills in

  Total time is the same. PERCEIVED time is not.

  Which makes the design question explicit: what does
  the user need first? Usually the thing they came for,
  rarely the chart.


TypeScript

    type User = { id: number; name: string; email: string };

    Laravel data → Inertia props → TypeScript types → React

  Without it, a renamed field in a resource is a runtime
  undefined somewhere in the interface. With it, it is a
  compile error, in the right file, before it ships.

  The types are hand-written and can drift. A generator
  that produces them from your resources removes that.


shadcn/ui: the same question, a different answer

    a library     somebody else's code and decisions
    shadcn/ui     YOUR code, from a good starting point

  You copy the component in and own it. No dependency to
  fight, no upgrade to fear, no ceiling when a design
  needs something unusual.

  The cost: it is now your code. Your bugs, your
  accessibility, your maintenance.


Precognition

  Livewire validates on the server as you type, because
  the state is already there. In React, live validation
  usually means writing the rules again:

    Laravel              React
    ───────              ─────
    email required       email required
    email valid          email valid
    password min 12      password min 12

  Two sources of truth, and one will fall behind.

    user types
        ↓
    precognition request
        ↓
    Laravel's OWN rules
        ↓
    validation result
        ↓
    the frontend shows it

  One set of rules, live feedback, no chance of the two
  disagreeing. On a long form, that is finding out about
  field three immediately rather than at the end.`,
      codeExample: {
        title: "A fast page with one set of rules",
        code: `<?php
// ---------- Partial reloads and lazy props ----------

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Dashboard', [
            // Always sent.
            'filters' => $request->only('search'),

            'posts' => PostResource::collection(
                Post::where('title', 'like', "%{$request->search}%")
                    ->paginate(10)
            ),

            // A closure: only evaluated when this prop is
            // actually requested. Without it, every filter
            // keystroke re-runs this query.
            'statistics' => fn () => $this->expensiveStatistics(),

            // The page renders first; this fills in after.
            'analytics' => Inertia::defer(fn () => $this->analytics()),
        ]);
    }
}
?>

// resources/js/pages/Dashboard.tsx

import { router, Deferred } from '@inertiajs/react';

// Ask for one prop, and Laravel runs one query.
router.get('/dashboard', { search }, {
    only: ['posts'],
    preserveState: true,
    replace: true,
});

// The deferred prop, with something to show meanwhile.
<Deferred data="analytics" fallback={<Skeleton />}>
    <AnalyticsChart />
</Deferred>


// ---------- TypeScript ----------

// resources/js/types/index.d.ts

export type User = {
    id: number;
    name: string;
    email: string;
};

export type Post = {
    id: number;
    title: string;
    status: 'draft' | 'published';
    author: User;
};

// A renamed field in PostResource is now a compile error
// in the right file, rather than a runtime undefined
// somewhere in the interface.

export default function Index({ posts }: { posts: Post[] }) {
    return <>{posts.map((p) => <p key={p.id}>{p.title}</p>)}</>;
}


<?php
// ---------- Precognition: one set of rules ----------

// The route accepts a precognitive request and runs the
// same validation without executing the action.

Route::post('/register', [RegisterController::class, 'store'])
    ->middleware(HandlePrecognitiveRequests::class);


class RegisterController extends Controller
{
    public function store(Request $request)
    {
        // Precognition runs exactly these rules, and stops.
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        User::create($data);

        return redirect()->route('dashboard');
    }
}
?>

// resources/js/pages/Register.tsx

import { useForm } from 'laravel-precognition-react-inertia';

export default function Register() {
    const form = useForm('post', '/register', {
        name: '', email: '', password: '',
    });

    return (
        <form onSubmit={(e) => { e.preventDefault(); form.submit(); }}>
            <input
                value={form.data.email}
                onChange={(e) => form.setData('email', e.target.value)}
                // Validated by LARAVEL, as they leave the field.
                onBlur={() => form.validate('email')}
            />
            {form.errors.email && <p>{form.errors.email}</p>}

            <button disabled={form.processing}>Register</button>
        </form>
    );
}

// The rules exist once. The frontend cannot disagree
// with the backend, because it is asking the backend.`,
      },
      keyTakeaways: [
        "<b>A partial reload requests a subset of props</b>, so a filter change does not rebuild the whole page.",
        "<b>A prop defined as a closure is only evaluated when requested</b>, so unrequested queries never run.",
        "Without that, every filter keystroke re-runs the expensive props, which is the common Inertia performance bug.",
        "<b>A deferred prop lets the page render before slow data arrives</b>, and fills in afterwards.",
        "<b>The total time is unchanged; the perceived time is not</b>, which makes \"what do they need first\" a real question.",
        "<b>TypeScript turns a renamed field into a compile error</b> rather than a runtime `undefined` in the interface.",
        "Hand-written types can drift, so generating them from your resources is worth doing as pages grow.",
        "<b>shadcn/ui gives you the component code to own</b>, trading a dependency for maintenance you now carry.",
        "<b>Live validation in React normally duplicates the rules</b>, creating two sources of truth.",
        "<b>Precognition asks Laravel to validate before submission</b>, using the same rules, so the two cannot disagree.",
      ],
      commonMistakes: [
        "<b>Returning every prop on every filter change.</b> Three expensive queries run for a search box.",
        "<b>Passing an evaluated value where a closure would do.</b> The query runs whether or not the prop is wanted.",
        "<b>Blocking a page on a slow chart.</b> Defer it and show what the user actually came for.",
        "<b>Re-implementing validation rules in React.</b> They will fall out of step with the server's.",
        "<b>Treating hand-written prop types as guaranteed.</b> They are a claim about the backend, not a check of it.",
      ],
      quiz: [
        {
          question: "What does `only: ['posts']` do on an Inertia visit?",
          options: [
            "Filters the posts",
            "Requests just that prop, so closure props that were not asked for are never evaluated",
            "Caches the response",
            "Skips the controller",
          ],
          correctIndex: 1,
          explanation: "Which is what stops a filter keystroke re-running every expensive query.",
        },
        {
          question: "What does a deferred prop change?",
          options: [
            "The total load time",
            "The page renders before that data arrives, and it fills in afterwards",
            "The prop is cached",
            "The query runs in a job",
          ],
          correctIndex: 1,
          explanation: "Perceived performance, not actual total time.",
        },
        {
          question: "What does TypeScript catch in an Inertia application?",
          options: [
            "Validation failures",
            "A renamed or missing prop field, at compile time rather than as a runtime `undefined`",
            "Missing authorization",
            "N+1 queries",
          ],
          correctIndex: 1,
          explanation: "In the right file, before it ships.",
        },
        {
          question: "What problem does Precognition solve?",
          options: [
            "Slow queries",
            "Live validation in the frontend duplicating the server's rules into a second source of truth",
            "Missing CSRF tokens",
            "Large bundles",
          ],
          correctIndex: 1,
          explanation: "It asks Laravel to run the real rules before submission.",
        },
      ],
    },
    {
      id: "folio-and-choosing",
      title: "Folio, and choosing between the two",
      durationMinutes: 11,
      explanation: "One more routing option, and then the decision this day exists to make.\n\n---\n\n### 1. Basic — Folio\n\nNormal routing names every page:\n\n```php\nRoute::get('/about', [AboutController::class, 'index']);\n```\n\nWhich is right when the page has logic. For a page that is only content, it is a route, a controller and a view for something that is one file's worth of markup.\n\n<b>Folio makes the filesystem the routes:</b>\n\n```text\npages/\n├── index.blade.php      →  /\n├── about.blade.php      →  /about\n└── contact.blade.php    →  /contact\n```\n\nAdd a file, get a URL. If you have written Next.js, this is the arrangement you already know.\n\n<b>It suits pages, not applications.</b> Marketing pages, documentation, a terms page. Anything with authorization, several actions or real logic wants a controller, where that logic has somewhere to live and something to test.\n\nAnd it composes: Folio for the public pages, normal routes for the application, in the same project.\n\n---\n\n### 2. Intermediate — the comparison\n\n```text\n                     Livewire            Inertia\n───────────────────────────────────────────────────────\nmain language        PHP                 JS / TS\nUI                   Blade               React/Vue/Svelte\nserver interaction   Livewire requests   Inertia visits\nbrowser state        Livewire-managed    the JS framework\nJavaScript needed    minimal             significant\nbest for             CRUD, admin         rich frontends\nLaravel integration  very deep           very deep\nSPA-like feel        yes                 yes\nAPI required         no                  no\n```\n\n<b>Read the last two rows together</b>, because they are the point of the day: both give a single-page feel and neither needs the API from yesterday. The choice is not about capability.\n\n---\n\n### 3. Advanced — actually choosing\n\n<b>Livewire, when Laravel should own the application:</b>\n\n```text\nLaravel owns most of it\n        +\nthe UI is not extremely JavaScript-heavy\n        +\nthe team is stronger in PHP\n```\n\n```text\nadmin dashboard · CMS · back-office\nCRUD · internal management system\n```\n\n<b>Inertia, when the frontend is the work:</b>\n\n```text\nthe UI is genuinely rich\n        +\nthe team writes React or Vue well\n        +\nyou still want Laravel's conventions\n```\n\n```text\nSaaS dashboard · complex application\nrich data visualisation · a large component system\n```\n\nAnd the honest tiebreaker: <b>the unfamiliar option is the expensive one.</b> A team that writes React fluently will build a better admin panel in Inertia than in a framework they are learning, whatever the general advice says.\n\n<b>If you already work in React, Inertia plus TypeScript is the shorter path</b>, and Livewire is still worth understanding, because it is what most of the Laravel ecosystem is written against.\n\n---\n\n### What this day was actually about\n\n```text\nLaravel\n ├── routing\n ├── authentication\n ├── authorization\n ├── validation\n ├── Eloquent\n └── business logic\n        │\n        ├───────────────┐\n        ▼               ▼\n   Livewire          Inertia\n        │               │\n      Blade      React / Vue / Svelte\n```\n\n<b>Everything above the split is every day of this track</b>, and it does not change. Days 1 to 23 are the same whichever branch you take.\n\nWhich reframes the whole question. You are not choosing between two frameworks, or learning two systems. <b>You are choosing how the browser drives the same Laravel application</b>, and that is a decision you can revisit per page, per feature, or per team.\n\nAnd it is why the mastery target for today is not \"can you build both\". It is: <b>can you explain why the same Laravel backend supports two completely different frontend models?</b> If the answer is \"because everything that matters happens below the split\", the day has done its job.",
      diagram: `Folio: the filesystem is the routes

  Route::get('/about', [AboutController::class, 'index']);

  Right when the page has logic. For a page that is only
  content, that is a route, a controller and a view for
  one file's worth of markup.

    pages/
    ├── index.blade.php     →  /
    ├── about.blade.php     →  /about
    └── contact.blade.php   →  /contact

  Add a file, get a URL. If you have written Next.js,
  you already know this arrangement.

  It suits PAGES, not applications. Marketing pages,
  documentation, a terms page. Anything with
  authorization, several actions or real logic wants a
  controller, where that logic has somewhere to live and
  something to test.

  And it composes: Folio for public pages, normal routes
  for the application, in one project.


The comparison

                       Livewire            Inertia
  ─────────────────────────────────────────────────────
  main language        PHP                 JS / TS
  UI                   Blade               React/Vue/Svelte
  server interaction   Livewire requests   Inertia visits
  browser state        Livewire-managed    the JS framework
  JavaScript needed    minimal             significant
  best for             CRUD, admin         rich frontends
  Laravel integration  very deep           very deep
  SPA-like feel        yes                 yes
  API required         no                  no

  Read the last two rows together: both feel like a SPA
  and neither needs yesterday's API. The choice is not
  about capability.


Choosing

  Livewire, when Laravel should own the application:

    Laravel owns most of it
          + the UI is not extremely JavaScript-heavy
          + the team is stronger in PHP

    admin dashboard · CMS · back-office
    CRUD · internal management system

  Inertia, when the frontend IS the work:

    the UI is genuinely rich
          + the team writes React or Vue well
          + you still want Laravel's conventions

    SaaS dashboard · complex application
    rich visualisation · a large component system

  The honest tiebreaker: the UNFAMILIAR option is the
  expensive one. A team fluent in React will build a
  better admin panel in Inertia than in a framework they
  are learning.

  Already working in React? Inertia plus TypeScript is
  the shorter path. Livewire is still worth knowing:
  it is what most of the ecosystem is written against.


What this day was about

  Laravel
   ├── routing
   ├── authentication
   ├── authorization
   ├── validation
   ├── Eloquent
   └── business logic
          │
          ├───────────────┐
          ▼               ▼
     Livewire          Inertia
          │               │
        Blade      React / Vue / Svelte

  Everything ABOVE the split is every day of this track,
  and it does not change. Days 1 to 23 are the same
  whichever branch you take.

  So you are not choosing between two frameworks, or
  learning two systems. You are choosing how the browser
  DRIVES the same Laravel application — a decision you
  can revisit per page, per feature, or per team.

  Which is why the target today is not "can you build
  both". It is:

    can you explain why the same Laravel backend
    supports two completely different frontend models?

  "Because everything that matters happens below the
  split" is the answer.`,
      codeExample: {
        title: "Folio, and the two versions of one page",
        code: `{{-- ---------- Folio: a page is a file ---------- --}}

{{-- resources/views/pages/about.blade.php  →  /about --}}

<x-layout>
    <h1>About us</h1>
    <p>...</p>
</x-layout>

{{-- resources/views/pages/posts/[Post].blade.php  →  /posts/{post} --}}

<?php
use function Laravel\\Folio\\{name, middleware};

name('posts.show');
middleware(['auth']);
?>

<x-layout>
    <h1>{{ $post->title }}</h1>
</x-layout>

{{-- Right for pages. A screen with authorization, several
     actions and real logic wants a controller, where that
     logic has somewhere to live and something to test. --}}


<?php
// ---------- The same page, both ways ----------

// Livewire: the state is a PHP property.

class SearchPosts extends Component
{
    public string $search = '';
    public string $status = 'all';

    public function updatedSearch(): void
    {
        $this->resetPage();
    }

    #[Computed]
    public function posts()
    {
        return Post::query()
            ->when($this->search, fn ($q) =>
                $q->where('title', 'like', "%{$this->search}%"))
            ->when($this->status !== 'all', fn ($q) =>
                $q->where('status', $this->status))
            ->paginate(10);
    }
}

// wire:model.live.debounce → a request → PHP → new HTML


// Inertia: the state is React state.

class PostController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Posts/Index', [
            'posts' => PostResource::collection(
                Post::query()
                    ->when($request->search, fn ($q, $s) =>
                        $q->where('title', 'like', "%{$s}%"))
                    ->when($request->status !== 'all', fn ($q) =>
                        $q->where('status', $request->status))
                    ->paginate(10)
                    ->withQueryString()
            ),
            'filters' => $request->only('search', 'status'),
        ]);
    }
}

// React state → an Inertia visit → props → React renders


<?php
// ---------- What is identical ----------

// The query. The policy. The validation. The pagination.
// The model. The migration. The tests for all of it.
//
//   Laravel
//    ├── routing
//    ├── authentication
//    ├── authorization
//    ├── validation
//    ├── Eloquent
//    └── business logic
//           │
//           ├──────────────┐
//           ▼              ▼
//      Livewire         Inertia
//           │              │
//         Blade      React / Vue / Svelte
//
// Days 1 to 23 sit above the split and do not change.
// You are choosing how the browser drives the same
// application — per page, per feature, or per team.`,
      },
      keyTakeaways: [
        "<b>Folio makes the filesystem the routes</b>: add a Blade file under `pages/` and it becomes a URL.",
        "<b>It suits pages rather than applications</b>: marketing, documentation, a terms page.",
        "Anything with authorization, several actions or real logic wants a controller it can be tested through.",
        "<b>Livewire and Inertia both give a single-page feel, and neither needs an API</b>, so the choice is not about capability.",
        "<b>Livewire fits when Laravel should own the application</b> and the team is stronger in PHP.",
        "<b>Inertia fits when the interface is rich</b> and the team already writes React or Vue well.",
        "<b>The unfamiliar option is the expensive one</b>, whatever the general advice says.",
        "If you already work in React, Inertia plus TypeScript is the shorter path, and Livewire is still worth knowing.",
        "<b>Everything above the split is every day of this track</b>, unchanged by the choice.",
        "<b>You are not choosing between two frameworks; you are choosing how the browser drives one application.</b>",
        "<b>The target is being able to explain why one Laravel backend supports two frontend models</b>, not building both.",
      ],
      commonMistakes: [
        "<b>Using Folio for a screen with real logic.</b> The logic ends up in a template with nowhere to test it.",
        "<b>Choosing by fashion.</b> The framework your team does not know is the one that costs the most.",
        "<b>Assuming Inertia needs an API.</b> It exists precisely so you do not build one.",
        "<b>Committing the whole application to one approach.</b> Different pages can reasonably differ.",
        "<b>Learning both as unrelated systems.</b> Everything that matters sits above the split and is shared.",
      ],
      quiz: [
        {
          question: "What does Folio provide?",
          options: [
            "A component library",
            "Page-based routing, where a file under `pages/` becomes a URL",
            "A build tool",
            "An API layer",
          ],
          correctIndex: 1,
          explanation: "It suits content pages; screens with logic want a controller.",
        },
        {
          question: "Which row is the same for both Livewire and Inertia?",
          options: [
            "Main language",
            "Whether an API is required, and whether the result feels like a SPA",
            "Amount of JavaScript",
            "Where browser state lives",
          ],
          correctIndex: 1,
          explanation: "Neither needs an API, and both feel like a single-page application.",
        },
        {
          question: "What is the honest tiebreaker between them?",
          options: [
            "Performance",
            "Which one the team already knows, because the unfamiliar option is the expensive one",
            "Which is newer",
            "Which has more components",
          ],
          correctIndex: 1,
          explanation: "A fluent React team builds a better admin panel in Inertia than in something they are learning.",
        },
        {
          question: "Why can one Laravel backend support two frontend models?",
          options: [
            "It runs two applications",
            "Routing, authentication, authorization, validation and Eloquent sit above the split and do not change",
            "Both compile to the same output",
            "Inertia wraps Livewire",
          ],
          correctIndex: 1,
          explanation: "Only the last step differs: a Blade view or a JavaScript component.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the core difference between Livewire and Inertia?",
      options: [
        "One is faster",
        "Where the interface's state lives: a PHP property on the server, or JavaScript state in the browser",
        "Inertia requires a REST API",
        "Livewire cannot paginate",
      ],
      correctIndex: 1,
      explanation: "Everything else you notice follows from that.",
    },
    {
      question: "Does either approach require the API you built yesterday?",
      options: [
        "Both do",
        "Neither does; the frontend ships with the application",
        "Only Inertia",
        "Only Livewire",
      ],
      correctIndex: 1,
      explanation: "No tokens, no CORS, no versioning, no second deployment.",
    },
    {
      question: "Why does `@vite()` exist rather than a plain `<script src>`?",
      options: [
        "It minifies at runtime",
        "It points at the dev server locally and at built, versioned files in production",
        "It loads Tailwind",
        "It is required by Blade",
      ],
      correctIndex: 1,
      explanation: "One directive that knows which environment it is in.",
    },
    {
      question: "Why does Vite hash built filenames?",
      options: [
        "For security",
        "A changed file gets a new URL, so a cached old version cannot be served",
        "To compress them",
        "For debugging",
      ],
      correctIndex: 1,
      explanation: "And unchanged files keep their name, so they stay cached.",
    },
    {
      question: "Why does `wire:model` default to updating on blur?",
      options: [
        "Blur events are more reliable",
        "`.live` means a server request per keystroke",
        "It is easier to implement",
        "For accessibility",
      ],
      correctIndex: 1,
      explanation: "`.debounce` is what makes `.live` reasonable on a text input.",
    },
    {
      question: "Can you trust a Livewire public property inside an action?",
      options: [
        "Yes, it comes from the server",
        "No; the client can modify it, so authorize in the action as you would in a controller",
        "Only if it is typed",
        "Only for models",
      ],
      correctIndex: 1,
      explanation: "Public properties travel in both directions on every interaction.",
    },
    {
      question: "Why does a filter change usually need `resetPage()`?",
      options: [
        "To clear the cache",
        "Otherwise the user stays on page 5 of a now-shorter list, which is usually empty",
        "To re-run validation",
        "To reset the sort",
      ],
      correctIndex: 1,
      explanation: "The symptom looks like search returning nothing.",
    },
    {
      question: "What does an Inertia controller return after a successful POST?",
      options: [
        "JSON with the created model",
        "A redirect, which Inertia follows",
        "A 201 status",
        "The page component",
      ],
      correctIndex: 1,
      explanation: "Exactly as it would for a Blade form.",
    },
    {
      question: "How do Laravel validation errors reach a React form?",
      options: [
        "You parse the 422 body",
        "Inertia shares them automatically into `form.errors`, keyed by field",
        "You duplicate the rules in JavaScript",
        "Through a separate endpoint",
      ],
      correctIndex: 1,
      explanation: "One source of truth for both rules and messages.",
    },
    {
      question: "What does a partial reload with `only: ['posts']` avoid?",
      options: [
        "A full page load",
        "Evaluating and returning the props you did not ask for, including their queries",
        "Running the controller",
        "Re-rendering React",
      ],
      correctIndex: 1,
      explanation: "Closure props are only evaluated when they are requested.",
    },
    {
      question: "What problem does Precognition solve?",
      options: [
        "Slow queries",
        "Live frontend validation otherwise duplicating the server's rules into a second source of truth",
        "Missing CSRF tokens",
        "Large bundles",
      ],
      correctIndex: 1,
      explanation: "It asks Laravel to run the real rules before submission.",
    },
    {
      question: "Why can one Laravel backend support two completely different frontend models?",
      options: [
        "It runs two applications",
        "Routing, auth, validation and Eloquent sit above the split and do not change; only the last step differs",
        "Inertia is built on Livewire",
        "Both compile to the same output",
      ],
      correctIndex: 1,
      explanation: "You are choosing how the browser drives one application.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Build the InvoiceHub invoice list twice, once in Livewire and once in Inertia with React, and be able to explain what is different and what is not.",
    brief: "InvoiceHub's screens are plain Blade forms with full page reloads. Today they get a real interface, and you build it twice.\n\nThat is deliberate, and it is the whole exercise. Building it once teaches you a framework. <b>Building the same screen twice teaches you where the line between Laravel and the frontend actually is</b>, because everything that stays identical is the part that was never a frontend concern.\n\nThe screen is the same in both: search, a status filter, pagination, a loading state, an empty state and validation. Same query, same policy, same rules. Only the last step differs.\n\nWhen both work, do not stop. The questions at the end are the point of the day, and answering them is worth more than either implementation.",
    steps: [
      "Confirm Vite is running with `npm run dev`, then deliberately stop it and reload a page. Note what breaks and add that symptom to your notes, because you will see it again.",
      "Run `npm run build`, look at the generated filenames in `public/build`, then change one line of CSS and build again. Write down what changed and why that matters after a deploy.",
      "Build the Livewire version: a `SearchInvoices` component with `$search` and `$status` properties, a computed `invoices` property, and a Blade view.",
      "Use `wire:model.live` with no debounce on the search box, open the network tab, and type \"invoice\". Count the requests. Then add `.debounce.300ms` and count again.",
      "Add `updatedSearch()` calling `resetPage()`. Before adding it, filter while on page 3 and note exactly what the user sees.",
      "Add `wire:loading` and an empty state. Confirm both appear at the right moments by throttling the network in your browser's dev tools.",
      "Add a delete button with `wire:click` and `wire:confirm`. Then authorize it in the action, and write down why the id in that call cannot be trusted.",
      "Now the Inertia version: a controller returning `Inertia::render('Invoices/Index', [...])` with `invoices` and `filters` props, and a React page in TypeScript.",
      "Type the props properly. Then rename a field in `InvoiceResource` without updating the type, and note where the error appears and when.",
      "Implement search in React with `router.get(..., { preserveState: true, replace: true })`. Compare what the network tab shows with the Livewire version.",
      "Add a second expensive prop such as monthly totals. Make it a closure, add `only: ['invoices']` to the search visit, and confirm from your query log that the totals query no longer runs on every keystroke.",
      "Defer that totals prop instead and note what the user sees first. Decide which of the two versions you would ship.",
      "Build the invoice create form with `useForm`. Submit it invalid and confirm the errors arrive in `form.errors` without you writing any error handling.",
      "Add Precognition to that form so validation runs as the user leaves each field. Then change one rule in the controller and confirm the frontend follows without a frontend change.",
      "Put both versions behind different routes and view them side by side. Time a search on each with the network throttled, and record both numbers.",
      "Now answer, in writing, for the Livewire version: where does the state live, what request does `wire:model` produce, when does PHP run, and how does validation reach Blade?",
      "And for the Inertia version: where does the state live, what is a prop, what does a visit actually do, what does a partial reload change, and how does Laravel validation reach React?",
      "Finally, list everything that was identical between the two implementations. That list is the answer to why one backend supports both.",
    ],
    acceptance: [
      "Both versions of the invoice list work: search, status filter, pagination, loading state, empty state.",
      "The Livewire search is debounced, and you recorded the request count before and after.",
      "Filtering resets to page one, and you can describe what happened before you added it.",
      "The Livewire delete action authorizes, and you can explain why the id it receives is untrusted.",
      "The Inertia props are typed, and you saw where a renamed resource field surfaced as an error.",
      "The Inertia search uses a partial reload, and your query log proves the expensive prop does not run on every keystroke.",
      "The create form shows per-field validation errors with no error-handling code of your own.",
      "Precognition validates against the controller's rules, and changing a rule changes the frontend behaviour with no frontend change.",
      "You have timings for both versions under a throttled network.",
      "You have written answers to the state, request and validation questions for both versions.",
      "You have a list of everything that was identical, and can explain why that list is the point.",
    ],
    stretch: [
      "Rewrite the Livewire component as a single-file Volt component and note which one you find easier to read.",
      "Add a shadcn/ui table and dialog to the Inertia version, and write down what you now own that you did not before.",
      "Add a Folio-routed public invoice-status page and explain why that page suits Folio and the invoice list does not.",
    ],
  },
};
