import { DAY_1_DETAIL } from "./day-1-detail";
import { DAY_2_DETAIL } from "./day-2-detail";
import { DAY_3_DETAIL } from "./day-3-detail";
import { DAY_4_DETAIL } from "./day-4-detail";
import { DAY_5_DETAIL } from "./day-5-detail";
import { DAY_6_DETAIL } from "./day-6-detail";
import { DAY_7_DETAIL } from "./day-7-detail";
import { DAY_8_DETAIL } from "./day-8-detail";
import { DAY_9_DETAIL } from "./day-9-detail";
import { DAY_10_DETAIL } from "./day-10-detail";
import { DAY_11_DETAIL } from "./day-11-detail";
import { DAY_12_DETAIL } from "./day-12-detail";
import { DAY_13_DETAIL } from "./day-13-detail";
import { DAY_14_DETAIL } from "./day-14-detail";

/** Official “current” day (1-based). Days before this count as done when seeding local progress. */
export const CURRENT_DAY = 1;

export const TOTAL_DAYS = 30;

export interface RoadmapTag {
  label: string;
  /** Maps to pill colors in `BackendRoadmap`. */
  slug: string;
}

/** Inline diagram keys rendered as SVG figures in the day detail modal. */
export type RoadmapDetailDiagramId =
  | "http11-sequential"
  | "http2-multiplex"
  | "http3-quic"
  | "request-response"
  | "status-401-403"
  | "node-one-thread-io"
  | "node-event-loop-phases"
  | "node-execution-priority"
  | "go-goroutine-mn"
  | "acid-transaction"
  | "btree-index"
  | "isolation-levels"
  | "rest-graphql-grpc"
  | "cursor-pagination"
  | "rate-limit-token-bucket"
  | "jwt-flow"
  | "oauth2-code-flow"
  | "rbac-model"
  | "cache-layers"
  | "cache-aside-pattern"
  | "log-correlation"
  | "error-classification"
  | "lb-round-robin"
  | "lb-ha-failover"
  | "erd-one-many"
  | "deadlock-cycle"
  | "cap-theorem"
  | "primary-replica"
  | "cqrs-sketch"
  | "inverted-index"
  | "queue-backpressure"
  | "producer-consumer";

/** One rich block inside a section (tables, code, diagrams, or prose). */
export type RoadmapDetailBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; variant?: "bullet" | "number" }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { type: "code"; title?: string; code: string }
  | { type: "diagram"; id: RoadmapDetailDiagramId };

/** Optional subsection in a day detail (e.g. “HTTP methods”). */
export interface RoadmapDayDetailSection {
  title: string;
  /** Simple bullet list (use when you do not need tables/diagrams). */
  items?: string[];
  /** Rich layout: tables, code samples, SVG diagrams. If set, `items` is ignored. */
  blocks?: RoadmapDetailBlock[];
}

/** One self-check question with a hidden answer (accordion). */
export interface RoadmapDayFaqItem {
  question: string;
  answer: string;
  /** Optional pill above the answer (e.g. topic label). */
  tag?: string;
  /** Optional left-border quote below the main answer paragraphs. */
  callout?: string;
}

/** Shown in the day detail panel when a card is opened. */
export interface RoadmapDayDetail {
  /** One paragraph or several for longer write-ups. */
  overview: string | string[];
  /** Optional themed blocks rendered after the overview. */
  sections?: RoadmapDayDetailSection[];
  /** Optional FAQ; answers show in an accordion (collapsed by default). */
  faq?: RoadmapDayFaqItem[];
  bullets?: string[];
}

export interface RoadmapDay {
  day: number;
  title: string;
  tags: RoadmapTag[];
  /** Optional; if omitted, the UI uses a short generic template. */
  detail?: RoadmapDayDetail;
}

export interface RoadmapWeek {
  id: string;
  title: string;
  /** Tailwind class for the week bullet (e.g. `bg-purple-500`). */
  dotClass: string;
  days: RoadmapDay[];
}

export const ROADMAP_WEEKS: RoadmapWeek[] = [
  {
    id: "w1",
    title: "Week 1: Core foundations",
    dotClass: "bg-purple-500",
    days: [
      {
        day: 1,
        title: "HTTP & REST deep dive",
        tags: [
          { label: "networking", slug: "networking" },
          { label: "theory", slug: "theory" },
        ],
        detail: DAY_1_DETAIL,
      },
      {
        day: 2,
        title: "Node.js / Go internals",
        tags: [
          { label: "runtime", slug: "runtime" },
          { label: "core", slug: "core" },
        ],
        detail: DAY_2_DETAIL,
      },
      {
        day: 3,
        title: "Database fundamentals",
        tags: [
          { label: "database", slug: "database" },
          { label: "sql", slug: "sql" },
        ],
        detail: DAY_3_DETAIL,
      },
      {
        day: 4,
        title: "API design patterns",
        tags: [
          { label: "design", slug: "design" },
          { label: "api", slug: "api" },
        ],
        detail: DAY_4_DETAIL,
      },
      {
        day: 5,
        title: "Authentication & authorisation",
        tags: [
          { label: "security", slug: "security" },
          { label: "auth", slug: "auth" },
        ],
        detail: DAY_5_DETAIL,
      },
      {
        day: 6,
        title: "Caching strategies",
        tags: [
          { label: "performance", slug: "performance" },
          { label: "cache", slug: "cache" },
        ],
        detail: DAY_6_DETAIL,
      },
      {
        day: 7,
        title: "Error handling & logging",
        tags: [
          { label: "reliability", slug: "reliability" },
          { label: "ops", slug: "ops" },
        ],
        detail: DAY_7_DETAIL,
      },
    ],
  },
  {
    id: "w2",
    title: "Week 2: System design & databases",
    dotClass: "bg-teal-500",
    days: [
      {
        day: 8,
        title: "Load balancers & reverse proxies",
        tags: [
          { label: "networking", slug: "networking" },
          { label: "architecture", slug: "architecture" },
        ],
        detail: DAY_8_DETAIL,
      },
      {
        day: 9,
        title: "Relational modeling & migrations",
        tags: [
          { label: "database", slug: "database" },
          { label: "design", slug: "design" },
        ],
        detail: DAY_9_DETAIL,
      },
      {
        day: 10,
        title: "Transactions & isolation levels",
        tags: [
          { label: "database", slug: "database" },
          { label: "theory", slug: "theory" },
        ],
        detail: DAY_10_DETAIL,
      },
      {
        day: 11,
        title: "NoSQL shapes & consistency",
        tags: [
          { label: "database", slug: "database" },
          { label: "nosql", slug: "nosql" },
        ],
        detail: DAY_11_DETAIL,
      },
      {
        day: 12,
        title: "Read replicas & CQRS sketch",
        tags: [
          { label: "database", slug: "database" },
          { label: "architecture", slug: "architecture" },
        ],
        detail: DAY_12_DETAIL,
      },
      {
        day: 13,
        title: "Search & indexing basics",
        tags: [
          { label: "performance", slug: "performance" },
          { label: "database", slug: "database" },
        ],
        detail: DAY_13_DETAIL,
      },
      {
        day: 14,
        title: "Backpressure & queues intro",
        tags: [
          { label: "reliability", slug: "reliability" },
          { label: "architecture", slug: "architecture" },
        ],
        detail: DAY_14_DETAIL,
      },
    ],
  },
  {
    id: "w3",
    title: "Week 3: DevOps, CI/CD & cloud",
    dotClass: "bg-amber-800",
    days: [
      {
        day: 15,
        title: "Linux, processes & systemd",
        tags: [
          { label: "ops", slug: "ops" },
          { label: "core", slug: "core" },
        ],
      },
      {
        day: 16,
        title: "Containers & images",
        tags: [
          { label: "docker", slug: "docker" },
          { label: "ops", slug: "ops" },
        ],
      },
      {
        day: 17,
        title: "CI pipelines & tests in deploy",
        tags: [
          { label: "cicd", slug: "cicd" },
          { label: "reliability", slug: "reliability" },
        ],
      },
      {
        day: 18,
        title: "IaC & environments",
        tags: [
          { label: "cloud", slug: "cloud" },
          { label: "ops", slug: "ops" },
        ],
      },
      {
        day: 19,
        title: "Kubernetes mental model",
        tags: [
          { label: "cloud", slug: "cloud" },
          { label: "architecture", slug: "architecture" },
        ],
      },
      {
        day: 20,
        title: "Secrets, config & key rotation",
        tags: [
          { label: "security", slug: "security" },
          { label: "ops", slug: "ops" },
        ],
      },
      {
        day: 21,
        title: "Deploy strategies & rollbacks",
        tags: [
          { label: "cloud", slug: "cloud" },
          { label: "reliability", slug: "reliability" },
        ],
      },
    ],
  },
  {
    id: "w4",
    title: "Week 4: Observability, security & scale",
    dotClass: "bg-orange-500",
    days: [
      {
        day: 22,
        title: "Structured logging & correlation IDs",
        tags: [
          { label: "ops", slug: "ops" },
          { label: "observability", slug: "observability" },
        ],
      },
      {
        day: 23,
        title: "Metrics, RED/USE & dashboards",
        tags: [
          { label: "observability", slug: "observability" },
          { label: "ops", slug: "ops" },
        ],
      },
      {
        day: 24,
        title: "Distributed tracing",
        tags: [
          { label: "observability", slug: "observability" },
          { label: "theory", slug: "theory" },
        ],
      },
      {
        day: 25,
        title: "Threat modeling for APIs",
        tags: [
          { label: "security", slug: "security" },
          { label: "theory", slug: "theory" },
        ],
      },
      {
        day: 26,
        title: "AuthZ patterns & rate limits",
        tags: [
          { label: "security", slug: "security" },
          { label: "api", slug: "api" },
        ],
      },
      {
        day: 27,
        title: "Load testing & capacity",
        tags: [
          { label: "performance", slug: "performance" },
          { label: "reliability", slug: "reliability" },
        ],
      },
      {
        day: 28,
        title: "SLOs, error budgets & incidents",
        tags: [
          { label: "reliability", slug: "reliability" },
          { label: "ops", slug: "ops" },
        ],
      },
    ],
  },
  {
    id: "capstone",
    title: "Days 29-30: Capstone & portfolio",
    dotClass: "bg-neutral-500",
    days: [
      {
        day: 29,
        title: "Ship a service end-to-end",
        tags: [
          { label: "api", slug: "api" },
          { label: "core", slug: "core" },
        ],
      },
      {
        day: 30,
        title: "ADRs, docs & portfolio story",
        tags: [
          { label: "theory", slug: "theory" },
          { label: "ops", slug: "ops" },
        ],
      },
    ],
  },
];

export function getAllRoadmapDays(): RoadmapDay[] {
  return ROADMAP_WEEKS.flatMap((w) => w.days).sort((a, b) => a.day - b.day);
}

export function getRoadmapDayContext(
  dayNumber: number,
): { weekTitle: string; day: RoadmapDay } | null {
  for (const week of ROADMAP_WEEKS) {
    const day = week.days.find((d) => d.day === dayNumber);
    if (day) return { weekTitle: week.title, day };
  }
  return null;
}

const DEFAULT_DETAIL_BULLETS = [
  "Summarize the main idea in one sentence.",
  "List one hands-on exercise you tried.",
  "Note one question to revisit tomorrow.",
] as const;

/** Merges saved `detail` with a neutral template when a day has no custom copy yet. */
export function resolveDayDetail(day: RoadmapDay): RoadmapDayDetail {
  if (day.detail) return day.detail;
  return {
    overview: `Focus for today: ${day.title}. Add a custom \`detail\` block on this day inside lib/challenge-data.ts when you are ready.`,
    bullets: [...DEFAULT_DETAIL_BULLETS],
  };
}

export function seedCompletedDayNumbers(): Set<number> {
  const done = new Set<number>();
  for (let d = 1; d < CURRENT_DAY; d += 1) done.add(d);
  return done;
}
