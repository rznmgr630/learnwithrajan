import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_29_LESSONS: LessonDay = {
  day: 29,
  title: "Internationalization",
  totalMinutes: 84,
  difficulty: "Advanced",
  lessons: [
    {
      id: "nextjs-29-1",
      title: "Internationalization and Locale Routing",
      durationMinutes: 17,
      explanation: `
Internationalization, often shortened to i18n, means designing an application so it can support multiple languages and regions. Localization, often called l10n, is the process of adapting content for a particular locale.

A common Next.js architecture puts the locale in the URL:

/en
/ne
/ja

Then a nested route handles the application:

/en/courses
/ne/courses
/ja/courses

A dynamic [locale] segment can represent the language:

app/[locale]/
├── layout.tsx
├── page.tsx
└── courses/
    └── page.tsx

This approach makes language explicit in the URL and gives search engines separate addressable pages.

You should decide early whether the locale represents only a language or a language-region combination. For example, en, ja, and ne represent languages, while en-US and en-GB can represent language plus region.

Locale routing should be consistent. If your application uses /en, /ne, and /ja, every public localized route should follow the same convention.
`,
      diagram: `
                     [locale]
                        |
          +-------------+-------------+
          |             |             |
         /en           /ne           /ja
          |             |             |
       English        Nepali        Japanese
          |             |             |
      /courses      /courses      /courses
`,
      codeExample: {
        title: "Locale as a dynamic route segment",
        code: `// app/[locale]/page.tsx
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main>
      <h1>Current locale: {locale}</h1>
    </main>
  );
}

// Possible URLs:
// /en
// /ne
// /ja`,
      },
      keyTakeaways: [
        "Internationalization prepares an application for multiple languages and regions.",
        "A locale can be represented by a dynamic route segment.",
        "Locale-prefixed URLs make language-specific pages addressable.",
        "Decide whether your locale model represents language or language plus region.",
        "Keep locale routing consistent across the application."
      ],
      commonMistakes: [
        "Mixing localized and non-localized public routes without a clear strategy.",
        "Confusing language codes with region codes.",
        "Allowing unsupported locale values.",
        "Hard-coding locale behavior into every page."
      ],
      quiz: [
        {
          question: "What might /ja/courses represent?",
          options: ["Japanese courses page", "A database table", "A route group", "An API method"],
          correctIndex: 0,
          explanation: "The locale prefix can identify Japanese as the language of the page."
        },
        {
          question: "What does [locale] represent in the route?",
          options: ["A dynamic locale segment", "A static asset", "A parallel route", "A CSS module"],
          correctIndex: 0,
          explanation: "[locale] is a dynamic route segment."
        }
      ]
    },
    {
      id: "nextjs-29-2",
      title: "Language Detection and Locale Switching",
      durationMinutes: 17,
      explanation: `
A multilingual application needs a way to decide which language to show when a visitor arrives without a locale in the URL.

Possible signals include a user's saved preference, a cookie, the browser's Accept-Language header, or an explicit selection. These signals should be handled carefully because automatic detection is not always correct.

A common strategy is:

1. Check an explicit locale in the URL.
2. If there is no locale, check a saved user preference.
3. Consider browser language.
4. Fall back to a default locale.

The URL should generally become the source of truth after the application has selected a locale. This prevents the language from silently changing during navigation.

A language switcher should preserve the current route when possible. If the user is viewing /en/courses/react, switching to Nepali should ideally navigate to /ne/courses/react rather than dropping them at the homepage.

For unsupported locales, redirect to a supported locale or return a controlled not-found response. Do not allow arbitrary locale values to reach translation-loading code.
`,
      diagram: `
Visitor
  |
  v
Has locale URL?
  |
  +-- yes --> use URL locale
  |
  no
  |
  v
Saved preference?
  |
  +-- yes --> use preference
  |
  no
  |
  v
Browser language
  |
  v
Default locale
`,
      codeExample: {
        title: "Locale switcher preserving the current route",
        code: `"use client";

import { usePathname, useRouter } from "next/navigation";

export function LanguageSwitcher({
  locale,
}: {
  locale: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(nextLocale: string) {
    const segments = pathname.split("/");

    // Replace the first locale segment.
    segments[1] = nextLocale;

    router.push(segments.join("/") || \`/\${nextLocale}\`);
  }

  return (
    <select
      value={locale}
      onChange={(event) => switchLocale(event.target.value)}
    >
      <option value="en">English</option>
      <option value="ne">नेपाली</option>
      <option value="ja">日本語</option>
    </select>
  );
}`,
      },
      keyTakeaways: [
        "Automatic language detection should have a clear precedence order.",
        "The URL should become the stable source of truth after locale selection.",
        "Language switching should preserve the user's current route where possible.",
        "Only supported locales should be accepted.",
        "Automatic detection should not unexpectedly override an explicit user choice."
      ],
      commonMistakes: [
        "Redirecting users repeatedly because locale detection runs on every request.",
        "Ignoring an explicit URL locale.",
        "Dropping the current page when switching languages.",
        "Accepting arbitrary locale values."
      ],
      quiz: [
        {
          question: "What should generally take precedence over browser language?",
          options: ["An explicit locale in the URL", "Random selection", "CSS", "Image metadata"],
          correctIndex: 0,
          explanation: "An explicit URL locale represents a clear user/request choice."
        },
        {
          question: "What should a language switcher ideally preserve?",
          options: ["The current route", "The database password", "The server process", "The image cache"],
          correctIndex: 0,
          explanation: "Users generally expect to remain on the same content page after changing language."
        }
      ]
    },
    {
      id: "nextjs-29-3",
      title: "Translation Architecture",
      durationMinutes: 17,
      explanation: `
Translation architecture becomes important as soon as an application contains more than a few localized strings. The goal is to keep translations maintainable and prevent language logic from spreading throughout the application.

A common approach is to store translation dictionaries:

messages/
├── en.json
├── ne.json
└── ja.json

For example:

{
  "home": {
    "title": "Learn programming",
    "description": "Build your skills step by step"
  }
}

The application can load the dictionary for the active locale and provide a translation function.

Translation keys should describe meaning rather than visual position. A key such as home.title is usually more maintainable than text1 or button3.

Interpolation is needed when a sentence contains dynamic data:

"welcome": "Welcome, {name}"

Pluralization can become more complex because languages do not all use the same plural rules. A production translation system should use locale-aware plural rules rather than assuming English-style singular/plural behavior.

Keep translations separate from application logic. The component should request a translation by key rather than contain a large conditional such as if locale === "ja".
`,
      diagram: `
Locale
  |
  v
Translation Loader
  |
  +----> en.json
  +----> ne.json
  +----> ja.json
  |
  v
Translation Function
  |
  v
Component
  |
  v
Localized UI
`,
      codeExample: {
        title: "Simple translation dictionary",
        code: `// messages/en.ts
export default {
  home: {
    title: "Learn programming",
    greeting: "Welcome, {name}",
  },
};

// messages/ne.ts
export default {
  home: {
    title: "प्रोग्रामिङ सिक्नुहोस्",
    greeting: "स्वागत छ, {name}",
  },
};

// A simple translation function
function translate(
  text: string,
  values: Record<string, string>
) {
  return text.replace(
    /\\{(\\w+)\\}/g,
    (_, key) => values[key] ?? \`{\${key}}\`
  );
}

translate("Welcome, {name}", { name: "Rajan" });`,
      },
      keyTakeaways: [
        "Translation dictionaries keep language content separate from UI logic.",
        "Meaningful translation keys are easier to maintain.",
        "Interpolation supports dynamic values inside translations.",
        "Pluralization needs locale-aware rules.",
        "Do not scatter locale-specific conditionals throughout components."
      ],
      commonMistakes: [
        "Using the English sentence itself as every translation key.",
        "Creating inconsistent keys across locales.",
        "Assuming every language has only singular and plural forms.",
        "Hard-coding translated text inside components."
      ],
      quiz: [
        {
          question: "Which translation key is more maintainable?",
          options: ["button3", "home.title", "text7", "abc"],
          correctIndex: 1,
          explanation: "Meaningful keys communicate what the translation represents."
        },
        {
          question: "What does interpolation allow?",
          options: [
            "Dynamic values inside translated messages",
            "Database migrations",
            "Route groups",
            "Image resizing"
          ],
          correctIndex: 0,
          explanation: "Interpolation lets translated messages contain dynamic values such as a user's name."
        }
      ]
    },
    {
      id: "nextjs-29-4",
      title: "Localized Metadata and Date/Number Formatting",
      durationMinutes: 17,
      explanation: `
Internationalization affects more than text. Dates, numbers, currencies, and metadata should also be localized.

JavaScript provides the Intl APIs for locale-aware formatting. Intl.DateTimeFormat can format dates according to a locale. Intl.NumberFormat can format numbers and currencies.

For example:

new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
}).format(1000);

The output is different from formatting the same value as Nepalese rupees or US dollars.

Dates also vary between locales. Avoid manually building dates with strings such as \`\${month}/\${day}/\${year}\` when the application supports multiple locales.

Metadata should be localized too. A Japanese page should have Japanese title and description metadata. A Nepali page should use Nepali metadata.

For SEO, localized pages should also have clear alternate relationships where appropriate. The important idea is that language is part of the page identity, not merely a UI preference.
`,
      diagram: `
Locale
  |
  +------> UI translations
  |
  +------> Metadata
  |
  +------> Date formatting
  |
  +------> Number formatting
  |
  +------> Currency formatting
  |
  v
Consistent localized experience
`,
      codeExample: {
        title: "Locale-aware date and currency formatting",
        code: `const locale = "ja-JP";

const date = new Intl.DateTimeFormat(locale, {
  dateStyle: "long",
}).format(new Date());

const price = new Intl.NumberFormat(locale, {
  style: "currency",
  currency: "JPY",
}).format(12000);

console.log(date);
console.log(price);

// Nepali example:
// new Intl.NumberFormat("ne-NP").format(1234567);`,
      },
      keyTakeaways: [
        "Internationalization includes dates, numbers, and currencies.",
        "Intl.DateTimeFormat provides locale-aware date formatting.",
        "Intl.NumberFormat handles locale-aware numbers and currencies.",
        "Localized metadata should match the language of the page.",
        "Locale should be treated as part of the page identity."
      ],
      commonMistakes: [
        "Manually formatting dates with fixed separators.",
        "Using one currency format for every locale.",
        "Localizing visible text but not metadata.",
        "Assuming locale changes only language."
      ],
      quiz: [
        {
          question: "Which API formats numbers and currencies by locale?",
          options: ["Intl.NumberFormat", "Intl.RouteFormat", "Intl.ImageFormat", "Intl.Metadata"],
          correctIndex: 0,
          explanation: "Intl.NumberFormat provides locale-aware number and currency formatting."
        },
        {
          question: "Should localized pages have localized metadata?",
          options: ["Yes", "No", "Only for private pages", "Only in development"],
          correctIndex: 0,
          explanation: "Localized metadata helps search engines and users understand the language-specific page."
        }
      ]
    },
    {
      id: "nextjs-29-5",
      title: "RTL Awareness and Production i18n",
      durationMinutes: 16,
      explanation: `
Some languages are written from right to left, commonly called RTL. Arabic and Hebrew are examples. Supporting RTL correctly requires more than reversing a few strings.

The document direction should be represented with dir="rtl" for RTL pages. Layouts should prefer logical CSS properties such as margin-inline-start and padding-inline-end instead of assuming left and right are always meaningful.

For example, margin-inline-start adapts to writing direction, while margin-left always means the physical left side.

Components should also avoid assumptions about icon direction. Arrows, navigation controls, and directional illustrations may need to change depending on writing direction.

Even when your initial languages are English, Nepali, and Japanese, building with direction awareness makes the architecture easier to extend later.

Production i18n should also consider translation completeness, locale-specific metadata, caching, URL consistency, date/number formatting, accessibility, and SEO. Translation is an application-wide concern, not only a text-replacement feature.
`,
      diagram: `
                 Locale
                   |
          +--------+--------+
          |                 |
        LTR               RTL
          |                 |
       dir=ltr           dir=rtl
          |                 |
   logical CSS        logical CSS
          |                 |
          +--------+--------+
                   |
              UI Layout
`,
      codeExample: {
        title: "Direction-aware root element",
        code: `export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const direction = ["ar", "he", "fa"].includes(locale)
    ? "rtl"
    : "ltr";

  return (
    <html lang={locale} dir={direction}>
      <body>{children}</body>
    </html>
  );
}

/*
Prefer logical CSS:

margin-inline-start
padding-inline-end
border-inline-start

instead of assuming:

margin-left
padding-right
border-left
*/`,
      },
      keyTakeaways: [
        "RTL requires document direction and layout awareness.",
        "dir='rtl' communicates writing direction to the browser and assistive technologies.",
        "Logical CSS properties adapt to writing direction.",
        "Directional icons and interactions may need special treatment.",
        "Production i18n includes routing, translations, formatting, metadata, accessibility, and SEO."
      ],
      commonMistakes: [
        "Only translating text while ignoring layout direction.",
        "Using physical left/right CSS everywhere.",
        "Forgetting to set document direction.",
        "Assuming RTL is simply a mirrored LTR interface."
      ],
      quiz: [
        {
          question: "Which attribute communicates RTL document direction?",
          options: ["dir='rtl'", "direction='reverse'", "rtl='true'", "lang='rtl'"],
          correctIndex: 0,
          explanation: "The dir attribute communicates the document's writing direction."
        },
        {
          question: "Why are logical CSS properties useful?",
          options: [
            "They adapt better to writing direction",
            "They disable JavaScript",
            "They replace routing",
            "They encrypt content"
          ],
          correctIndex: 0,
          explanation: "Logical properties such as margin-inline-start adapt to LTR and RTL directions."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "What might /ne/courses represent?",
      options: ["Nepali courses page", "A database route", "A parallel slot", "An image file"],
      correctIndex: 0,
      explanation: "The /ne prefix can represent the Nepali locale."
    },
    {
      question: "What should usually take precedence when the user explicitly chooses a locale?",
      options: ["The explicit choice", "A random locale", "The default only", "A CSS rule"],
      correctIndex: 0,
      explanation: "An explicit user choice should not normally be silently overridden."
    },
    {
      question: "Why use translation dictionaries?",
      options: [
        "To separate localized content from application logic",
        "To create database tables",
        "To optimize images",
        "To create API routes"
      ],
      correctIndex: 0,
      explanation: "Dictionaries centralize translated content and keep UI logic cleaner."
    },
    {
      question: "Which API is appropriate for locale-aware dates?",
      options: ["Intl.DateTimeFormat", "Intl.Route", "Intl.Metadata", "Intl.Date"],
      correctIndex: 0,
      explanation: "Intl.DateTimeFormat formats dates according to locale conventions."
    },
    {
      question: "What does dir='rtl' communicate?",
      options: ["The page uses right-to-left writing direction", "The page is private", "The page is dynamic", "The page is cached"],
      correctIndex: 0,
      explanation: "The dir attribute communicates the document's writing direction."
    },
    {
      question: "Which languages are a useful starting set for the project?",
      options: ["English, Nepali, and Japanese", "Only English", "Only Arabic", "English and Latin"],
      correctIndex: 0,
      explanation: "The project is designed around English, Nepali, and Japanese."
    }
  ],
  project: {
    name: "Multilingual Marketing Website",
    goal: "Build a production-style multilingual Next.js marketing site supporting English, Nepali, and Japanese.",
    brief: `
Build a multilingual website for a fictional developer-learning platform.

The application should support:
- /en
- /ne
- /ja

Each locale should have translated navigation, hero content, feature descriptions, pricing labels, and footer content.

Add a language switcher that keeps the user on the equivalent page when possible. Use locale-specific translation dictionaries.

Format dates and numbers with Intl APIs. Generate localized metadata for each locale and prepare the layout so RTL languages can be added later without rewriting the application.
`,
    steps: [
      "Create a [locale] route segment.",
      "Define supported locales: en, ne, and ja.",
      "Create translation dictionaries.",
      "Create a locale validation layer.",
      "Build localized navigation and page content.",
      "Create a language switcher that preserves the current route.",
      "Use interpolation for dynamic translated messages.",
      "Format dates and numbers with Intl APIs.",
      "Generate localized metadata.",
      "Set the correct html lang attribute.",
      "Add direction handling for future RTL locales.",
      "Test every major page in all three locales."
    ],
    acceptance: [
      "English, Nepali, and Japanese routes work.",
      "Translations are stored separately from UI components.",
      "Language switching preserves the current page where possible.",
      "Unsupported locales are handled safely.",
      "Dates and numbers use locale-aware formatting.",
      "Metadata is localized.",
      "The document has the correct lang attribute.",
      "The layout is prepared for RTL languages.",
      "No large locale-specific conditional blocks are scattered through components."
    ],
    stretch: [
      "Add Arabic as an RTL locale.",
      "Add localized Open Graph metadata.",
      "Add language alternate metadata.",
      "Add locale-specific currency selection.",
      "Persist the user's preferred locale in a cookie."
    ]
  },
};
