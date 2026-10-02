import type { RoadmapWeek } from "@/lib/challenge-data";

export const PYTHON_TOTAL_DAYS = 10;

export const PYTHON_ROADMAP_WEEKS: RoadmapWeek[] = [
  {
    id: "python-phase-0",
    title: {
      en: "Phase 0 · Python Foundations",
      np: "Phase 0 · Python आधार",
      jp: "Phase 0・Python 基礎",
    },
    dotClass: "bg-[var(--accent)]",
    days: [
      {
        day: 1,
        title: {
          en: "Python Setup & Programming Fundamentals",
          np: "Python सेटअप र प्रोग्रामिङ आधार",
          jp: "Python のセットアップとプログラミング基礎",
        },
        tags: [
          { slug: "setup", label: { en: "setup", np: "सेटअप", jp: "セットアップ" } },
          { slug: "fundamentals", label: { en: "fundamentals", np: "आधार", jp: "基礎" } },
        ],
      },
      {
        day: 2,
        title: { en: "Variables & Data Types", np: "Variables र Data Types", jp: "変数とデータ型" },
        tags: [
          { slug: "variables", label: { en: "variables", np: "variables", jp: "変数" } },
          { slug: "data-types", label: { en: "data types", np: "data types", jp: "データ型" } },
        ],
      },
      {
        day: 3,
        title: { en: "Strings", np: "Strings", jp: "文字列" },
        tags: [
          { slug: "strings", label: { en: "strings", np: "strings", jp: "文字列" } },
          { slug: "formatting", label: { en: "formatting", np: "formatting", jp: "書式設定" } },
        ],
      },
      {
        day: 4,
        title: { en: "Operators & Expressions", np: "Operators र Expressions", jp: "演算子と式" },
        tags: [
          { slug: "operators", label: { en: "operators", np: "operators", jp: "演算子" } },
          { slug: "logic", label: { en: "logic", np: "logic", jp: "論理" } },
        ],
      },
      {
        day: 5,
        title: { en: "Conditional Logic", np: "Conditional Logic", jp: "条件分岐" },
        tags: [
          { slug: "conditionals", label: { en: "conditionals", np: "conditionals", jp: "条件分岐" } },
          { slug: "control-flow", label: { en: "control flow", np: "control flow", jp: "制御フロー" } },
        ],
      },
    ],
  },
  {
    id: "python-phase-1",
    title: { en: "Phase 1 · Core Python", np: "Phase 1 · Core Python", jp: "Phase 1・Python コア" },
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_70%,#34d399)]",
    days: [
      { day: 6, title: { en: "Lists", np: "Lists", jp: "リスト" }, tags: [{ slug: "lists", label: { en: "lists", np: "lists", jp: "リスト" } }, { slug: "collections", label: { en: "collections", np: "collections", jp: "コレクション" } }] },
      { day: 7, title: { en: "Tuples, Sets & Frozensets", np: "Tuples, Sets र Frozensets", jp: "タプル・セット・frozenset" }, tags: [{ slug: "sets", label: { en: "sets", np: "sets", jp: "セット" } }, { slug: "tuples", label: { en: "tuples", np: "tuples", jp: "タプル" } }] },
      { day: 8, title: { en: "Dictionaries", np: "Dictionaries", jp: "辞書" }, tags: [{ slug: "dictionaries", label: { en: "dictionaries", np: "dictionaries", jp: "辞書" } }, { slug: "data-modeling", label: { en: "data modeling", np: "data modeling", jp: "データモデリング" } }] },
      { day: 9, title: { en: "Loops", np: "Loops", jp: "ループ" }, tags: [{ slug: "loops", label: { en: "loops", np: "loops", jp: "ループ" } }, { slug: "iteration", label: { en: "iteration", np: "iteration", jp: "反復" } }] },
      { day: 10, title: { en: "Comprehensions", np: "Comprehensions", jp: "内包表記" }, tags: [{ slug: "comprehensions", label: { en: "comprehensions", np: "comprehensions", jp: "内包表記" } }, { slug: "collections", label: { en: "collections", np: "collections", jp: "コレクション" } }] },
    ],
  },
];
