import type { RoadmapWeek } from "@/lib/challenge-data";

export const PYTHON_TOTAL_DAYS = 46;

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
  {
    id: "python-phase-2",
    title: { en: "Phase 2 · Functions & Python Thinking", np: "Phase 2 · Functions र Python Thinking", jp: "Phase 2・関数とPython的な考え方" },
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_55%,#a78bfa)]",
    days: [
      { day: 11, title: { en: "Functions", np: "Functions", jp: "関数" }, tags: [{ slug: "functions", label: { en: "functions", np: "functions", jp: "関数" } }, { slug: "scope", label: { en: "scope", np: "scope", jp: "スコープ" } }] },
      { day: 12, title: { en: "Advanced Function Arguments", np: "Advanced Function Arguments", jp: "高度な関数引数" }, tags: [{ slug: "args", label: { en: "args", np: "args", jp: "args" } }, { slug: "kwargs", label: { en: "kwargs", np: "kwargs", jp: "kwargs" } }] },
      { day: 13, title: { en: "Scope & Closures", np: "Scope र Closures", jp: "スコープとクロージャ" }, tags: [{ slug: "scope", label: { en: "scope", np: "scope", jp: "スコープ" } }, { slug: "closures", label: { en: "closures", np: "closures", jp: "クロージャ" } }] },
      { day: 14, title: { en: "Lambda, map, filter & reduce", np: "Lambda, map, filter र reduce", jp: "lambda・map・filter・reduce" }, tags: [{ slug: "lambda", label: { en: "lambda", np: "lambda", jp: "lambda" } }, { slug: "functional", label: { en: "functional", np: "functional", jp: "関数型" } }] },
      { day: 15, title: { en: "Modules & Packages", np: "Modules र Packages", jp: "モジュールとパッケージ" }, tags: [{ slug: "modules", label: { en: "modules", np: "modules", jp: "モジュール" } }, { slug: "packages", label: { en: "packages", np: "packages", jp: "パッケージ" } }] },
    ],
  },
  {
    id: "python-phase-3",
    title: { en: "Phase 3 · Object-Oriented Python", np: "Phase 3 · Object-Oriented Python", jp: "Phase 3・オブジェクト指向Python" },
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_42%,#f59e0b)]",
    days: [
      { day: 16, title: { en: "Classes & Objects", np: "Classes र Objects", jp: "クラスとオブジェクト" }, tags: [{ slug: "classes", label: { en: "classes", np: "classes", jp: "クラス" } }, { slug: "objects", label: { en: "objects", np: "objects", jp: "オブジェクト" } }] },
      { day: 17, title: { en: "Encapsulation & Properties", np: "Encapsulation र Properties", jp: "カプセル化とプロパティ" }, tags: [{ slug: "properties", label: { en: "properties", np: "properties", jp: "プロパティ" } }] },
      { day: 18, title: { en: "Inheritance & Polymorphism", np: "Inheritance र Polymorphism", jp: "継承とポリモーフィズム" }, tags: [{ slug: "inheritance", label: { en: "inheritance", np: "inheritance", jp: "継承" } }] },
      { day: 19, title: { en: "Dataclasses & Special Methods", np: "Dataclasses र Special Methods", jp: "dataclassと特殊メソッド" }, tags: [{ slug: "dataclasses", label: { en: "dataclasses", np: "dataclasses", jp: "dataclass" } }] },
      { day: 20, title: { en: "OOP Design", np: "OOP Design", jp: "OOP設計" }, tags: [{ slug: "design", label: { en: "design", np: "design", jp: "設計" } }] },
    ],
  },
  {
    id: "python-phase-4",
    title: { en: "Phase 4 · Errors, Files & Real-World Python", np: "Phase 4 · Errors, Files र Real-World Python", jp: "Phase 4・エラー・ファイル・実践Python" },
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_32%,#f97316)]",
    days: [
      { day: 21, title: { en: "Exception Handling", np: "Exception Handling", jp: "例外処理" }, tags: [] },
      { day: 22, title: { en: "Files & Directories", np: "Files र Directories", jp: "ファイルとディレクトリ" }, tags: [] },
      { day: 23, title: { en: "JSON, CSV & Serialization", np: "JSON, CSV र Serialization", jp: "JSON・CSV・シリアライズ" }, tags: [] },
      { day: 24, title: { en: "Dates & Times", np: "Dates र Times", jp: "日付と時刻" }, tags: [] },
      { day: 25, title: { en: "Regular Expressions & Text Processing", np: "Regular Expressions र Text Processing", jp: "正規表現とテキスト処理" }, tags: [] },
    ],
  },
  {
    id: "python-phase-5",
    title: { en: "Phase 5 · Python Standard Library", np: "Phase 5 · Python Standard Library", jp: "Phase 5・Python標準ライブラリ" },
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_24%,#06b6d4)]",
    days: [
      { day: 26, title: { en: "Collections & Itertools", np: "Collections र Itertools", jp: "collectionsとitertools" }, tags: [] },
      { day: 27, title: { en: "Functional & Utility Modules", np: "Functional र Utility Modules", jp: "関数型・ユーティリティモジュール" }, tags: [] },
      { day: 28, title: { en: "OS, System & Environment", np: "OS, System र Environment", jp: "OS・システム・環境" }, tags: [] },
      { day: 29, title: { en: "Logging", np: "Logging", jp: "ロギング" }, tags: [] },
      { day: 30, title: { en: "CLI Applications", np: "CLI Applications", jp: "CLIアプリケーション" }, tags: [] },
    ],
  },
  {
    id: "python-phase-6",
    title: { en: "Phase 6 · Advanced Python", np: "Phase 6 · Advanced Python", jp: "Phase 6・高度なPython" },
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_18%,#ec4899)]",
    days: [
      { day: 31, title: { en: "Iterators & Generators", np: "Iterators र Generators", jp: "イテレータとジェネレータ" }, tags: [] },
      { day: 32, title: { en: "Decorators & Higher-Order Functions", np: "Decorators र Higher-Order Functions", jp: "デコレータと高階関数" }, tags: [] },
      { day: 33, title: { en: "Context Managers & Resource Safety", np: "Context Managers र Resource Safety", jp: "コンテキストマネージャとリソース安全性" }, tags: [] },
      { day: 34, title: { en: "Descriptors & Attribute Access", np: "Descriptors र Attribute Access", jp: "ディスクリプタと属性アクセス" }, tags: [] },
      { day: 35, title: { en: "Metaprogramming & Introspection", np: "Metaprogramming र Introspection", jp: "メタプログラミングとイントロスペクション" }, tags: [] },
    ],
  },
  {
    id: "python-phase-7",
    title: { en: "Phase 7 · Type Safety & Code Quality", np: "Phase 7 · Type Safety र Code Quality", jp: "Phase 7・型安全性とコード品質" },
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_14%,#8b5cf6)]",
    days: [
      { day: 36, title: { en: "Type Hints & Static Analysis", np: "Type Hints र Static Analysis", jp: "型ヒントと静的解析" }, tags: [] },
      { day: 37, title: { en: "Advanced Typing", np: "Advanced Typing", jp: "高度な型付け" }, tags: [] },
      { day: 38, title: { en: "Static Analysis & Code Quality Automation", np: "Static Analysis र Code Quality Automation", jp: "静的解析とコード品質自動化" }, tags: [] },
      { day: 39, title: { en: "Testing Fundamentals with pytest", np: "pytestによるテスト基礎", jp: "pytestによるテスト基礎" }, tags: [] },
      { day: 40, title: { en: "Advanced Testing & Test Doubles", np: "Advanced Testing र Test Doubles", jp: "高度なテストとテストダブル" }, tags: [] },
    ],
  },
  {
    id: "python-phase-8",
    title: { en: "Phase 8 · Databases & Backend Development", np: "Phase 8 · Databases र Backend Development", jp: "Phase 8・データベースとバックエンド開発" },
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_10%,#10b981)]",
    days: [
      { day: 41, title: { en: "SQL Database Integration & Security", np: "SQL Database Integration र Security", jp: "SQLデータベース統合とセキュリティ" }, tags: [] },
      { day: 42, title: { en: "Enterprise ORM with SQLAlchemy 2.0", np: "SQLAlchemy 2.0 सहित Enterprise ORM", jp: "SQLAlchemy 2.0によるエンタープライズORM" }, tags: [] },
      { day: 43, title: { en: "Database Migrations & Schema Evolution with Alembic", np: "Alembic सहित Database Migrations", jp: "Alembicによるデータベースマイグレーション" }, tags: [] },
      { day: 44, title: { en: "HTTP & REST APIs", np: "HTTP र REST APIs", jp: "HTTPとREST API" }, tags: [] },
      { day: 45, title: { en: "FastAPI Fundamentals", np: "FastAPI Fundamentals", jp: "FastAPI基礎" }, tags: [] },
    ],
  },
  {
    id: "python-phase-9",
    title: { en: "Phase 9 · Production Backend", np: "Phase 9 · Production Backend", jp: "Phase 9・本番バックエンド" },
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_8%,#ef4444)]",
    days: [{ day: 46, title: { en: "Enterprise FastAPI Architecture & Design Patterns", np: "Enterprise FastAPI Architecture", jp: "エンタープライズFastAPIアーキテクチャ" }, tags: [] }],
  },
];
