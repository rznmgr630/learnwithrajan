import type { LocalizedString } from "@/lib/i18n/types";
import { backendDayTitle, backendTags, backendWeekTitle } from "./backend-learning/backend-roadmap-i18n";
import { DAY_1_DETAIL } from "./backend-learning/day-1-detail";
import { DAY_2_DETAIL } from "./backend-learning/day-2-detail";
import { DAY_3_DETAIL } from "./backend-learning/day-3-detail";
import { DAY_4_DETAIL } from "./backend-learning/day-4-detail";
import { DAY_5_DETAIL } from "./backend-learning/day-5-detail";
import { DAY_6_DETAIL } from "./backend-learning/day-6-detail";
import { DAY_7_DETAIL } from "./backend-learning/day-7-detail";
import { DAY_8_DETAIL } from "./backend-learning/day-8-detail";
import { DAY_9_DETAIL } from "./backend-learning/day-9-detail";
import { DAY_10_DETAIL } from "./backend-learning/day-10-detail";
import { DAY_11_DETAIL } from "./backend-learning/day-11-detail";
import { DAY_12_DETAIL } from "./backend-learning/day-12-detail";
import { DAY_13_DETAIL } from "./backend-learning/day-13-detail";
import { DAY_14_DETAIL } from "./backend-learning/day-14-detail";

/** Official “current” day (1-based). Days before this count as done when seeding local progress. */
export const CURRENT_DAY = 1;

export const TOTAL_DAYS = 30;

export interface RoadmapTag {
  label: LocalizedString;
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
  | "nodejs-require-resolution"
  | "nodejs-express-middleware-chain"
  | "nodejs-stream-pipe"
  | "nodejs-event-emitter"
  | "nodejs-async-evolution"
  | "nodejs-mongoose-schema"
  | "nodejs-jest-unit-flow"
  | "nodejs-deploy-pipeline"
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
  | "producer-consumer"
  | "git-workdir-staging-repo"
  | "git-local-remote-workflow"
  | "git-first-commit-flow"
  | "git-branch-merge"
  | "git-fetch-pull-push"
  | "git-rebase-linearize"
  | "git-stash-pop"
  | "git-worktree"
  | "git-pr-review-merge"
  | "react-virtual-dom"
  | "react-render-cycle"
  | "react-component-tree"
  | "react-data-flow"
  | "react-use-effect-lifecycle"
  | "react-immutable-update"
  | "react-controlled-input"
  | "react-native-bridge-architecture"
  | "react-native-metro-fast-refresh"
  | "react-native-component-tree"
  | "react-native-flexbox-mobile"
  | "react-native-navigation-stacks"
  | "react-native-list-windowing"
  | "react-native-data-offline-online"
  | "react-native-native-module-bridge"
  | "react-native-testing-pyramid-mobile"
  | "react-native-release-pipeline"
  | "devops-linux-hierarchy"
  | "devops-osi-model"
  | "devops-docker-layers"
  | "devops-cicd-pipeline"
  | "devops-k8s-cluster"
  | "devops-terraform-workflow"
  | "devops-aws-vpc"
  | "devops-prometheus-architecture"
  | "devops-ansible-playbook"
  | "devops-nginx-proxy"
  | "devops-linux-os-stack"
  | "devops-linux-permissions"
  | "devops-dns-resolution"
  | "devops-process-lifecycle"
  | "devops-apt-workflow"
  | "devops-bash-script-flow"
  | "devops-ssh-key-auth"
  | "devops-tcp-handshake"
  | "devops-subnet-cidr"
  | "devops-firewall-nat"
  | "devops-network-debug-flow"
  | "devops-vpn-tunnel"
  | "devops-git-three-areas"
  | "devops-git-branching"
  | "devops-semver"
  | "devops-git-hooks"
  | "devops-monorepo-structure"
  | "devops-merge-conflict"
  | "devops-log-parsing"
  | "devops-boto3-workflow"
  | "devops-cli-tool"
  | "devops-cloud-models"
  | "devops-iam-model"
  | "devops-ec2-lifecycle"
  | "devops-vpc-design"
  | "devops-s3-architecture"
  | "devops-rds-architecture"
  | "devops-alb-asg"
  | "devops-cloudwatch"
  | "devops-lambda"
  | "devops-route53-cloudfront"
  | "devops-sg-nacl-waf"
  | "devops-ecs-ecr"
  | "devops-cfn-sdk"
  | "devops-cost-management"
  | "devops-container-vs-vm"
  | "devops-dockerfile"
  | "devops-container-lifecycle"
  | "devops-docker-networking"
  | "devops-docker-volumes"
  | "devops-docker-compose"
  | "devops-image-registry"
  | "devops-cicd-concepts"
  | "devops-jenkins-architecture"
  | "devops-jenkins-pipeline"
  | "devops-jenkins-triggers"
  | "devops-cicd-testing"
  | "devops-deploy-strategies"
  | "devops-jenkins-advanced"
  | "nextjs-request-lifecycle"
  | "nextjs-client-server-boundary"
  | "nextjs-data-fetch-cache"
  | "nextjs-render-strategies"
  | "nextjs-api-route-flow"
  | "nextjs-prisma-workflow"
  | "nextjs-nextauth-flow"
  | "nextjs-image-optimization"
  | "nextjs-vercel-deploy"
  | "laravel-request-lifecycle"
  | "laravel-service-container"
  | "laravel-eloquent-query"
  | "laravel-eloquent-relations"
  | "laravel-auth-guard"
  | "laravel-queue-job"
  | "laravel-api-resource"
  | "laravel-test-pyramid";

/** One rich block inside a section (tables, code, diagrams, or prose). */
export type RoadmapDetailBlock =
  | { type: "paragraph"; text: LocalizedString }
  | { type: "list"; items: LocalizedString[]; variant?: "bullet" | "number" }
  | { type: "table"; caption?: LocalizedString; headers: LocalizedString[]; rows: LocalizedString[][] }
  | { type: "code"; title?: LocalizedString; code: string }
  | { type: "diagram"; id: RoadmapDetailDiagramId };

/** Same blocks after applying UI locale (plain strings for rendering). */
export type RoadmapDetailBlockResolved =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; variant?: "bullet" | "number" }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { type: "code"; title?: string; code: string }
  | { type: "diagram"; id: RoadmapDetailDiagramId };

/** Optional subsection in a day detail (e.g. “HTTP methods”). */
export interface RoadmapDayDetailSection {
  title: LocalizedString;
  /** Simple bullet list (use when you do not need tables/diagrams). */
  items?: LocalizedString[];
  /** Rich layout: tables, code samples, SVG diagrams. If set, `items` is ignored. */
  blocks?: RoadmapDetailBlock[];
}

/** One self-check question with a hidden answer (accordion). */
export interface RoadmapDayFaqItem {
  question: LocalizedString;
  answer: LocalizedString;
  /** Optional pill above the answer (e.g. topic label). */
  tag?: LocalizedString;
  /** Optional left-border quote below the main answer paragraphs. */
  callout?: LocalizedString;
}

/** Shown in the day detail panel when a card is opened. */
export interface RoadmapDayDetail {
  /** One paragraph or several for longer write-ups. Omit when sections (or bullets alone) carry the narrative. */
  overview?: LocalizedString | LocalizedString[];
  /** Optional themed blocks rendered after the overview. */
  sections?: RoadmapDayDetailSection[];
  /** Optional FAQ; answers show in an accordion (collapsed by default). */
  faq?: RoadmapDayFaqItem[];
  bullets?: LocalizedString[];
}

export interface RoadmapDay {
  day: number;
  title: LocalizedString;
  tags: RoadmapTag[];
  /** Optional; if omitted, the UI uses a short generic template. */
  detail?: RoadmapDayDetail;
}

export interface RoadmapWeek {
  id: string;
  title: LocalizedString;
  /** Tailwind class for the week bullet (e.g. `bg-purple-500`). */
  dotClass: string;
  days: RoadmapDay[];
}

function dayRow(day: number, tagSlugs: [string, string], detail?: RoadmapDayDetail): RoadmapDay {
  return {
    day,
    title: backendDayTitle(day),
    tags: backendTags(tagSlugs),
    ...(detail ? { detail } : {}),
  };
}

export const ROADMAP_WEEKS: RoadmapWeek[] = [
  {
    id: "w1",
    title: backendWeekTitle("w1"),
    dotClass: "bg-[var(--accent)]",
    days: [
      dayRow(1, ["networking", "theory"], DAY_1_DETAIL),
      dayRow(2, ["runtime", "core"], DAY_2_DETAIL),
      dayRow(3, ["database", "sql"], DAY_3_DETAIL),
      dayRow(4, ["design", "api"], DAY_4_DETAIL),
      dayRow(5, ["security", "auth"], DAY_5_DETAIL),
      dayRow(6, ["performance", "cache"], DAY_6_DETAIL),
      dayRow(7, ["reliability", "ops"], DAY_7_DETAIL),
    ],
  },
  {
    id: "w2",
    title: backendWeekTitle("w2"),
    dotClass: "bg-[var(--accent)]",
    days: [
      dayRow(8, ["networking", "architecture"], DAY_8_DETAIL),
      dayRow(9, ["database", "design"], DAY_9_DETAIL),
      dayRow(10, ["database", "theory"], DAY_10_DETAIL),
      dayRow(11, ["database", "nosql"], DAY_11_DETAIL),
      dayRow(12, ["database", "architecture"], DAY_12_DETAIL),
      dayRow(13, ["performance", "database"], DAY_13_DETAIL),
      dayRow(14, ["reliability", "architecture"], DAY_14_DETAIL),
    ],
  },
  {
    id: "w3",
    title: backendWeekTitle("w3"),
    dotClass: "bg-[var(--accent)]",
    days: [
      dayRow(15, ["ops", "core"]),
      dayRow(16, ["docker", "ops"]),
      dayRow(17, ["cicd", "reliability"]),
      dayRow(18, ["cloud", "ops"]),
      dayRow(19, ["cloud", "architecture"]),
      dayRow(20, ["security", "ops"]),
      dayRow(21, ["cloud", "reliability"]),
    ],
  },
  {
    id: "w4",
    title: backendWeekTitle("w4"),
    dotClass: "bg-[var(--accent)]",
    days: [
      dayRow(22, ["ops", "observability"]),
      dayRow(23, ["observability", "ops"]),
      dayRow(24, ["observability", "theory"]),
      dayRow(25, ["security", "theory"]),
      dayRow(26, ["security", "api"]),
      dayRow(27, ["performance", "reliability"]),
      dayRow(28, ["reliability", "ops"]),
    ],
  },
  {
    id: "capstone",
    title: backendWeekTitle("capstone"),
    dotClass: "bg-[var(--accent)]",
    days: [dayRow(29, ["api", "core"]), dayRow(30, ["theory", "ops"])],
  },
];

export function getAllRoadmapDays(): RoadmapDay[] {
  return ROADMAP_WEEKS.flatMap((w) => w.days).sort((a, b) => a.day - b.day);
}

export function getRoadmapDayContext(
  dayNumber: number,
): { weekTitle: LocalizedString; day: RoadmapDay } | null {
  for (const week of ROADMAP_WEEKS) {
    const day = week.days.find((d) => d.day === dayNumber);
    if (day) return { weekTitle: week.title, day };
  }
  return null;
}

const DEFAULT_DETAIL_BULLETS: LocalizedString[] = [
  {
    en: "Summarize the main idea in one sentence.",
    np: "मुख्य विचार एक वाक्यमा सार्नुहोस्।",
    jp: "主旨を一文でまとめましょう。",
  },
  {
    en: "List one hands-on exercise you tried.",
    np: "तपाईंले गरेको एउटा व्यावहारिक अभ्यास लेख्नुहोस्।",
    jp: "試したハンズオンを一つ書き出しましょう。",
  },
  {
    en: "Note one question to revisit tomorrow.",
    np: "भोलि फेरि हेर्न एउटा प्रश्न टिप्नुहोस्।",
    jp: "明日見直したい疑問を一つメモしましょう。",
  },
];

/** Merges saved `detail` with a neutral template when a day has no custom copy yet. */
export function resolveDayDetail(day: RoadmapDay): RoadmapDayDetail {
  if (day.detail) return day.detail;
  return {
    bullets: [...DEFAULT_DETAIL_BULLETS],
  };
}

export function seedCompletedDayNumbers(): Set<number> {
  const done = new Set<number>();
  for (let d = 1; d < CURRENT_DAY; d += 1) done.add(d);
  return done;
}
